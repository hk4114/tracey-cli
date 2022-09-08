# tracey-cli 前端脚手架

本文已参与「新人创作礼」活动，一起开启掘金创作之路。

> 前端脚手架

## 解决什么问题？

脚手架就是帮助你把项目的基础架子搭好。例如项目依赖、模板、构建工具等等。让你不用从零开始配置一个项目，尽可能快的进行业务开发。

公司已开发的项目是资产和宝贵经验，包含很多公用的逻辑。把原有项目单纯地复制粘贴存在以下问题：
- 重复复制粘贴 dirty work
- 容易忽略项目中的配置
- 存在业务定制逻辑
- 项目框架不同。基于 cra/vue-cli/vite。需要整合到一起。

> 前置准备: 找个项目模板

## 核心模块
- 界面交互
- 下载项目模板

### 【界面交互】项目初始化

1. `mkdir tracey-cli & cd tracey-cli`
2. `npm init -y`
3. `mkdir bin` 新建 `enter.js` 文件，在 `package.json` 中增加 `"bin": "bin/enter"`
4. 编辑 `enter.js`

```js
#!/usr/bin/env node
// 关联依赖 commander 命令行指令配置
// npm i commander 
const { program } = require('commander');
const packageInfo = require('../package');

program.version(packageInfo.version, '-v, --version');

program.name(packageInfo.name)
  .usage(`<command> [option]`)

// 解析参数
program.parse(process.argv);
```

5. 终端运行 `npm link`，添加 `--force` 可以强制覆盖原有指令

测试:

![demo01.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50a49d791f5d439a9efdd840519f0471~tplv-k3u1fbpfcp-watermark.image?)



### 【界面交互】控制台输出样式
来了解下项目的依赖和这些依赖的简易使用：

- chalk 命令行样式 * 版本注意 `^4.1.2`
- ora 终端 loading * 版本注意 `^5.1.0`
- figlet 生成终端的艺术字

```js
// bin/enter.js
const chalk = require("chalk");
console.log(chalk.blue.underline.bold("调整样式"))

const ora = require("ora");
// 定义一个loading
const spinner = ora("加载中...");
// 启动loading
spinner.start();
setTimeout(() => {
  spinner.text = "失败";
  spinner.fail();
}, 1000);

const figlet = require("figlet")

console.log(
  "\r\n" +
  figlet.textSync(packageInfo.name, {
    font: "ANSI Shadow",
    horizontalLayout: "default",
    verticalLayout: "default",
    whitespaceBreak: true,
  })
);
```

![route.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f47adc955e3244199601b726d72877ee~tplv-k3u1fbpfcp-watermark.image?)

### 【界面交互】命令行交互
- inquirer 

```js
const Inquirer = require('inquirer')

// 多选交互功能
new Inquirer.prompt([
  {
    name: "react",
    // 单选将这里修改为 list 即可
    type: "checkbox",
    message: "选择项目所需功能",
    choices: [
      {
        name: "Babel",
        checked: true,
      },
      {
        name: "TypeScript",
      },
      {
        name: "Router",
      },
    ],
  },
]).then((data) => {
  console.log(data);
});
```

### 【下载模板】


```json
"publishConfig": {
  "registry":  // 私有 npm 源地址
}
```

参考资料：

[战场小包 【前端架构必备】手摸手带你搭建一个属于自己的脚手架](https://juejin.cn/post/7077717940941881358)
