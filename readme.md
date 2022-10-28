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