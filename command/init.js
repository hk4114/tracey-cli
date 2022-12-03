const clear = require('clear')
const inquirer = require('inquirer')

const templates = require('../templates.json')
const download = require('../lib/utils/download')

async function init(name, options) {
  const { template } = options
  clear()
  let git = template && { url: template }
  if (!template) {
    const answers = await inquirer.prompt([
      {
        name: 'template',
        type: 'list',
        message: '选择项目模板: ',
        choices: Object.keys(templates),
      },
    ])
    git = templates[answers.template]
  }
  await download(name, git)
  process.exit()
}

module.exports = init