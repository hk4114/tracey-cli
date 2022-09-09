const chalk = require('chalk')

const colors = ['green', 'blue', 'yellow', 'red', 'cyan', 'blue']

const colorFn = {}

colors.forEach(color => {
  colorFn[color] = function (text, isConsole = true) {
    return isConsole ? console.log(chalk[color](text)) : chalk[color](text)
  }
})

module.exports = colorFn;