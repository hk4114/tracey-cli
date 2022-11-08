const chalk = require('chalk')
const stripAnsi = require('strip-ansi')

const format = (label, msg) => msg.split('\n').map((line, i) => (i === 0
  ? `${label} ${line}`
  : line.padStart(stripAnsi(label).length))).join('\n')

const chalkTag = msg => chalk.bgBlackBright.white.dim(` ${msg} `)

const colors = ['green', 'blue', 'yellow', 'red', 'cyan', 'blue']

const colorFn = {}

colors.forEach(color => {
  colorFn[color] = function (text, isConsole = true) {
    return isConsole ? console.log(chalk[color](text)) : chalk[color](text)
  }
})

colorFn.log = (msg = '', tag = null) => {
  tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg)
}

colorFn.info = (msg, tag = null) => {
  console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg))
}

colorFn.warn = (msg, tag = null) => {
  console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), chalk.yellow(msg)))
}

colorFn.error = (msg, tag = null) => {
  console.error(format(chalk.bgRed(' ERROR ') + (tag ? chalkTag(tag) : ''), chalk.red(msg)))
  if (msg instanceof Error) {
    console.error(msg.stack)
  }
}

module.exports = colorFn