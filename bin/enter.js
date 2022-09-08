#!/usr/bin/env node
const { program } = require('commander');
const chalk = require('chalk')
const figlet = require('figlet')
const packageInfo = require('../package');

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

