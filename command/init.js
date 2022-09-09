const fs = require('fs-extra');
const figlet = require('figlet');
// 提供交互式命令行
const inquirer = require('inquirer'); 
// 一种简单的模板语言，可以自行百度一下
const handlebars = require('handlebars'); 
// 封装的独立进程模块，用来执行命令
const spawn = require('../lib/spawn'); 
const remove = require('../lib/remove'); // 用来删除文件和文件夹
const config = require('../templates'); // 引入定义好的基础项目列表

const { green, yellow, red, blue } = require('../lib/utils')

const packageInfo = require('../package');

function isUsingYarn() {
  return (process.env.npm_config_user_agent || '').indexOf('yarn') === 0;
}

// 检查项目文件状态
const checkStatus = (answers) => {
  const { projectName } = answers;
  return new Promise((resolve) => {
    if (fs.existsSync(projectName)) {
      throw '已存在同名目录！请确保项目名称在指定目录下的唯一性！'
    } else {
      return resolve(answers);
    }
  })
}

// 仓库克隆
const gitClone = (answers) => {
  const { projectName } = answers;
  const gitUrl = config.templates[answers.templateName].url;
  const branch = config.templates[answers.templateName].branch;
  const cwd = path.join(process.cwd(), `${projectName}`);
  return new Promise((resolve, reject) => {
    blue('基础模板下载中...')
    spawn(`git`, ['clone', `${gitUrl}`, `${projectName}`, '-v', '--progress'])
      .then((err) => {
        if (err) return reject(err);
        return spawn(`git`, ['checkout', `${branch}`], { cwd })
      })
      .then((err) => {
        if (err) return reject(err)
        // 删除模板自带的 .git 文件
        remove(`${projectName}/.git`);
        // 创建新的 git仓库
        return spawn(`git`, [`init`], { cwd })
      })
      .then((err) => {
        if (err) return reject(err)
        green('\n √ 基础模板下载完成! \n')
        return resolve(answers)
      })
  })
}

// 修改模板
const modifyTemplate = (answers) => {
  const { projectName, templateName } = answers
  return new Promise((resolve) => {
    blue('模板更新中...')
    try {
      switch (templateName) {
        case 'custom-admin':
          const meta = {
            NAME: projectName,
          };
          // 调整 package.json
          fs.writeFileSync(`${projectName}/package.json`, handlebars.compile(fs.readFileSync(`${projectName}/package.json`).toString())(meta));

          // 调整 配置文件
          fs.writeFileSync(`${projectName}/.env`, handlebars.compile(fs.readFileSync(`${projectName}/.env`).toString())(meta));
          fs.writeFileSync(`${projectName}/.env.development`, handlebars.compile(fs.readFileSync(`${projectName}/.env.development`).toString())(meta));
          fs.writeFileSync(`${projectName}/.env.production`, handlebars.compile(fs.readFileSync(`${projectName}/.env.production`).toString())(meta));
          break;
      }
      green('\n √ 模板更新完成! \n')
      return resolve(answers);
    } catch (error) {
      throw error;
    }
  })
}

// 依赖安装
const dependencyInstall = (answers) => {
  const { projectName } = answers;
  return new Promise((resolve, reject) => {
    blue('依赖安装中...')
    const cwd = path.join(process.cwd(), `${projectName}`);
    const useYarn = isUsingYarn();
    let command = '';
    let args;
    if (useYarn) {
      command = 'yarnpkg';
      args = ['install'];
    } else {
      command = 'npm';
      args = ['install', '--no-audit'];
    }
    spawn(command, args, { cwd })
      .then((err) => {
        if (err) return reject(err)
        green('\n √ 依赖安装完成! \n')
        return resolve(answers);
      })
  })
}

// 安装结束
const completed = () => {
  return new Promise((resolve) => {
    green('\n √ 安装完成，愉快地进行开发吧！')
    resolve(process.exit())
  })
}

module.exports = () => {
  yellow(figlet.textSync(packageInfo.name, {
    font: 'ANSI Shadow',
  }))
  inquirer.prompt([
    {
      name: 'templateName',
      type: 'list',
      message: '请选择你需要的项目模板：',
      choices: Object.keys(config.templates),
    },
    {
      name: 'projectName',
      type: 'input',
      message: '请输入你的项目名称(英文)：',
      validate: function (value) {
        if (value.length) {
          return true;
        } else {
          return '请输入你的项目名称';
        }
      },
    },
    {
      name: 'projectTitle',
      type: 'input',
      message: '请输入项目页面标题(中文)：',
    }
  ])
    .then(async (answers) => {
      const plugin = [
        checkStatus,
        gitClone,
        modifyTemplate,
        dependencyInstall,
        completed
      ];

      for (let i = 0; i < plugin.length; i++) {
        try {
          const callback = plugin[i];
          await callback(answers)
        } catch (error) {
          red('发生了一个错误：' + JSON.stringify(error))
          process.exit();
        }
      }
    })
}
