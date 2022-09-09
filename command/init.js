const path = require('path')
const fs = require('fs-extra')
const clear = require('clear');
const inquirer = require('inquirer');

const spawn = require('../lib/spawn');
const templates = require('../templates');
const remove = require('../lib/remove');
const { green, red, startLoad, endLoad } = require('../lib/utils')

// 下载模板
function download(project, git) {
  const cwd = path.join(process.cwd(), `${project}`);
  startLoad('', '下载中...');
  return new Promise(async (resolve, reject) => {
    let r = await spawn(`git`, ['clone', `${git.url}`, `${project}`, '-v', '--progress']);
    endLoad()
    if (r) {
      red('下载失败')
      return false
    }
    green('下载成功!');
    if (git.branch) {
      await spawn(`git`, ['checkout', `${git.branch}`], { cwd });
    }
    await remove(`./${project}/.git`);
    await spawn(`git`, [`init`], { cwd })
    if (r) return reject(err);
    return resolve(true)
  })
}

async function init(name, options) {
  const { template } = options
  clear();
  let git = template && { url: template }
  if (!template) {
    const answers = await inquirer.prompt([
      {
        name: 'template',
        type: 'list',
        message: '选择项目模板: ',
        choices: Object.keys(templates),
      }
    ])
    git = templates[answers.template]
  }
  await download(name, git);
  process.exit()
}

module.exports = init