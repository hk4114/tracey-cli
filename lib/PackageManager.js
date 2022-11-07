const stripAnsi = require('strip-ansi')
const execa = require('execa')
const inquirer = require('inquirer')

const executeCmd = require('./executeCmd')
const { yellow, cyan } = require('./utils')
const { hasProjectYarn, hasYarn } = require('./utils/env')
const request = require('./utils/request')
const { loadOptions, saveOptions } = require('./utils/options')

async function ping(registry) {
  await request.get(`${registry}/vue-cli-version-marker/latest`)
  return registry
}

function removeSlash(url) {
  return url.replace(/\/$/, '')
}

const registries = {
  npm: 'https://registry.npmjs.org',
  yarn: 'https://registry.yarnpkg.com',
  taobao: 'https://registry.npm.taobao.org',
  pnpm: 'https://registry.npmjs.org',
}

const PACKAGE_MANAGER_CONFIG = {
  npm: {
    install: ['install'],
  },
  yarn: {
    install: [],
  },
}

let checked
let result

async function shouldUseTaobao(command) {
  if (!command) {
    command = hasYarn() ? 'yarn' : 'npm'
  }

  // ensure this only gets called once.
  if (checked) return result
  checked = true

  // previously saved preference
  const saved = loadOptions().useTaobaoRegistry
  if (typeof saved === 'boolean') {
    result = saved
    return saved
  }

  const save = val => {
    result = val
    saveOptions({ useTaobaoRegistry: val })
    return val
  }

  let userCurrent
  try {
    userCurrent = (await execa(command, ['config', 'get', 'registry'])).stdout
  } catch (registryError) {
    try {
      // Yarn 2 uses `npmRegistryServer` instead of `registry`
      userCurrent = (await execa(command, ['config', 'get', 'npmRegistryServer'])).stdout
    } catch (npmRegistryServerError) {
      return save(false)
    }
  }

  const defaultRegistry = registries[command]
  if (removeSlash(userCurrent) !== removeSlash(defaultRegistry)) {
    // user has configured custom registry, respect that
    return save(false)
  }

  let faster
  try {
    faster = await Promise.race([
      ping(defaultRegistry),
      ping(registries.taobao),
    ])
  } catch (e) {
    return save(false)
  }

  if (faster !== registries.taobao) {
    // default is already faster
    return save(false)
  }

  if (process.env.VUE_CLI_API_MODE) {
    return save(true)
  }

  // ask and save preference
  const { useTaobaoRegistry } = await inquirer.prompt([
    {
      name: 'useTaobaoRegistry',
      type: 'confirm',
      message: yellow(
        ` Your connection to the default ${command} registry seems to be slow.\n`
        + `   Use ${cyan(registries.taobao)} for faster installation?`,
      ),
    },
  ])

  // 注册淘宝源
  if (useTaobaoRegistry) {
    await execa(command, ['config', 'set', 'registry', registries.taobao])
  }

  return save(useTaobaoRegistry)
}

class PackageManager {
  constructor(context, packageManager) {
    this.context = context
    this._registries = {}

    if (packageManager) {
      this.bin = packageManager
    } else if (context) {
      if (hasProjectYarn(context)) {
        this.bin = 'yarn'
      } else {
        this.bin = 'npm'
      }
    }
  }

  // Any command that implemented registry-related feature should support
  // `-r` / `--registry` option
  async setRegistry() {
    const cacheKey = ''
    if (this._registries[cacheKey]) {
      return this._registries[cacheKey]
    }

    let registry
    if (await shouldUseTaobao(this.bin)) {
      registry = registries.taobao
    } else {
      try {
        if (!registry || registry === 'undefined') {
          registry = (await execa(this.bin, ['config', 'get', 'registry'])).stdout
        }
      } catch (e) {
        // Yarn 2 uses `npmRegistryServer` instead of `registry`
        registry = (await execa(this.bin, ['config', 'get', 'npmRegistryServer'])).stdout
      }
    }

    this._registries[cacheKey] = stripAnsi(registry).trim()
    return this._registries[cacheKey]
  }

  async runCommand(command, args) {
    const prevNodeEnv = process.env.NODE_ENV
    // In the use case of Vue CLI, when installing dependencies,
    // the `NODE_ENV` environment variable does no good;
    // it only confuses users by skipping dev deps (when set to `production`).
    delete process.env.NODE_ENV

    await this.setRegistry()
    await executeCmd(
      this.bin,
      [
        ...PACKAGE_MANAGER_CONFIG[this.bin][command],
        ...(args || []),
      ],
      this.context,
    )

    if (prevNodeEnv) {
      process.env.NODE_ENV = prevNodeEnv
    }
  }

  async install() {
    console.log('\n正在下载依赖...\n')
    await this.runCommand('install')
    return true
  }
}

module.exports = PackageManager
