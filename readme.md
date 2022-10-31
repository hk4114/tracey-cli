# tracey-cli
```sh
# 查看版本号
tc -v 
# 运行创建命令
tc init <project name>
# 指定下载模板
tc init -t https://github.com/hk4114/Custom-Admin.git
```

发布（publish）到指定私有域 npm

```json
// package.json 添加配置
{
  // ...
  "publishConfig": {
    "registry":  // 私有 npm 源地址
  }
}
```

## 本地调试
```sh
git clone https://github.com/hk4114/tracey-cli.git
# 链接到全局
npm link
# 如果失败尝试 
npm link --force
```


## 依赖包

### 样式
- chalk 控制命令行样式
- ora 终端 loading
- figlet 生成终端的艺术字

### 交互
- inquirer