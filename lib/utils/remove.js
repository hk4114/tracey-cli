const fs = require('fs-extra')
let path = require('path')

function remove(url) {
  let files = []
  if (fs.existsSync(url)) {
    files = fs.readdirSync(url)
    files.forEach((file) => {
      let curPath = path.join(url, file)
      if (fs.statSync(curPath).isDirectory()) {
        remove(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(url)
  } else {
    console.log('给定的路径不存在！')
  }
}

module.exports = remove
