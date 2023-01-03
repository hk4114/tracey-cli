#!/usr/bin/env node
const { program } = require('commander')
const figlet = require('figlet')

const { cyan } = require('../lib/utils')
const packageInfo = require('../package')

const create = require('../command/create')
const init = require('../command/init')
const list = require('../command/list')

// 查看版本
program.version(packageInfo.version, '-v, --version')

// 查看模板列表
program.command('ls')
.description('展示模板项目列表')
.action(() => {
  list()
})

// 自己写的命令
program.command('init <app-name>')
.description('创建一个新项目')
.option('-t, --template [url]', '指定git仓库作为模板')
.action((name, options) => {
  console.log(name, options)
  // init(name, options)
})

// 别人写的生成命令
program
.version(packageInfo.version)
.command('create <name>')
.description('create a new project')
.action(name => {
  create(name)
})

program.on('--help', () => {
  console.log(
    '\r\n'
    + figlet.textSync(packageInfo.name, {
      font: 'ANSI Shadow',
    }),
  )
  console.log()
  console.log(
    `Run ${cyan(
      packageInfo.name + ' <command> --help',
    )} for detailed usage of given command.`,
  )
  console.log()
})

program
.name(packageInfo.name)
.version(packageInfo.version)
.usage(`<command> [option]`)

// 解析参数
// npm run server --port 3000 后面的 --port 3000 就是用户输入的参数 process.argv
program.parse(process.argv)
