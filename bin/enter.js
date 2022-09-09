#!/usr/bin/env node
const { program } = require('commander');
const figlet = require('figlet')

const { cyan } = require('../lib/utils');
const packageInfo = require('../package');

program.command('init <app-name>')
  .description('创建一个新项目')
  .option('-f, --force', '如果目录存在则覆盖')
  .option('-t, --template [url]', '指定git仓库作为模板')
  .action((name, options) => {
    require('../command/init')(name, options)
  });

program.command('ls')
  .description('展示模板项目列表')
  .action(() => {
    require('../command/list')()
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
    `Run ${cyan(
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

