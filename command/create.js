/* eslint-disable max-classes-per-file */
const path = require('path')
const inquirer = require('inquirer')
const clear = require('clear')

const executeCmd = require('../lib/executeCmd')
const Generator = require('../lib/Generator')

// 获取模板数据
function getPromptModules() {
  return [
    'babel',
    'router',
    'vuex',
    'linter',
  ].map(file => require(`../lib/promptModules/${file}`))
}

class Creator {
  constructor() {
    this.featurePrompt = {
      name: 'features',
      message: 'Check the features needed for your project:',
      pageSize: 10,
      type: 'checkbox',
      choices: [],
    }
    this.injectedPrompts = []
  }

  getFinalPrompts() {
    this.injectedPrompts.forEach(prompt => {
      const originalWhen = prompt.when || (() => true)
      prompt.when = answers => originalWhen(answers)
    })
    const prompts = [
      this.featurePrompt,
      ...this.injectedPrompts,
    ]
    return prompts
  }
}

class PromptModuleAPI {
  constructor(creator) {
    this.creator = creator
  }

  injectFeature(feature) {
    this.creator.featurePrompt.choices.push(feature)
  }

  injectPrompt(prompt) {
    this.creator.injectedPrompts.push(prompt)
  }
}

async function create(name) {
  const creator = new Creator()
  // 获取各个模块的交互提示语
  const promptModules = getPromptModules()
  const promptAPI = new PromptModuleAPI(creator)
  promptModules.forEach(m => m(promptAPI))

  clear()

  // 弹出交互提示语并获取用户的选择
  const answers = await inquirer.prompt(creator.getFinalPrompts())

  // package.json 文件内容
  const pkg = {
    name,
    version: '0.1.0',
    dependencies: {},
    devDependencies: {},
  }

  const generator = new Generator(pkg, path.join(process.cwd(), name))
  // 填入 vue webpack 必选项，无需用户选择
  answers.features.unshift('vue', 'webpack')

  // 根据用户选择的选项加载相应的模块，在 package.json 写入对应的依赖项
  // 并且将对应的 template 模块渲染
  answers.features.forEach(feature => {
    require(`../lib/generator/${feature}`)(generator, answers)
  })

  await generator.generate()

  console.log('\n正在下载依赖...\n')
  // 下载依赖
  await executeCmd('npm install', path.join(process.cwd(), name))
  console.log('\n依赖下载完成! 执行下列命令开始开发：\n')
  console.log(`cd ${name}`)
  console.log(`npm run dev`)
}

module.exports = create