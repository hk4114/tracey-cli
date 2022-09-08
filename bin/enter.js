#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk')
const figlet = require('figlet')
const packageInfo = require('../package');

program.command('init')
  .description('创建一个新项目')
  .action(() => {
    require('../command/init')()
  });

program.command('ls')
  .description('展示模板项目列表')
  .action(() => {
    require('../command/list')()
  });

// 更新项目 config 文件
program
  .command('update')
  .description('更新packages版本')
  .action(() => {
    require('../command/update')()
  });

program.on("--help", function () {
  console.log(
    "\r\n" +
    figlet.textSync(packageInfo.name, {
      font: "ANSI Shadow",
    })
  );
  console.log();
  console.log(
    `Run ${chalk.cyan(
      packageInfo.name + " <command> --help"
    )} for detailed usage of given command.`
  );
  console.log();
});

program
  .name(packageInfo.name)
  .version(packageInfo.version)
  .usage(`<command> [option]`)

// 解析参数
// npm run server --port 3000 后面的 --port 3000 就是用户输入的参数 process.argv
program.parse(process.argv);

