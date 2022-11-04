const stringifyJS = require('./utils/stringifyJS')
const merge = require('deepmerge')

const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]))
const mergeOptions = {
  arrayMerge: mergeArrayWithDedupe,
}

const transformJS = {
  read: ({ filename, context }) => {
    try {
      return require(`./${filename}`, context, true)
    } catch (e) {
      return null
    }
  },
  write: ({ value }) => `module.exports = ${stringifyJS(value, null, 4)}`,
}

const transformJSON = {
  read: ({ source }) => JSON.parse(source),
  write: ({ value, existing }) => JSON.stringify(merge(existing, value, mergeOptions), null, 4),
}

const transformYAML = {
  read: ({ source }) => require('js-yaml').safeLoad(source),
  write: ({ value, existing }) => require('js-yaml').safeDump(merge(existing, value, mergeOptions), {
    skipInvalid: true,
  }),
}

const transformLines = {
  read: ({ source }) => source.split('\n'),
  write: ({ value, existing }) => {
    if (existing) {
      value = existing.concat(value)
      value = value.filter((item, index) => value.indexOf(item) === index)
    }
    return value.join('\n')
  },
}

const transforms = {
  js: transformJS,
  json: transformJSON,
  yaml: transformYAML,
  lines: transformLines,
}

class ConfigTransform {
  constructor(options) {
    this.fileDescriptor = options.file
  }

  transform(value, context) {
    let file

    if (!file) {
      file = this.getDefaultFile()
    }
    const { type, filename } = file

    const transform = transforms[type]

    let source

    const content = transform.write({
      source,
      filename,
      context,
      value,
    })

    return {
      filename,
      content,
    }
  }

  getDefaultFile() {
    const [type] = Object.keys(this.fileDescriptor)
    const [filename] = this.fileDescriptor[type]
    return { type, filename }
  }
}

module.exports = ConfigTransform