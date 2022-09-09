const ora = require('ora')
const { green } = require('./colors')

const spinner = ora()
let lastMsg

const startLoad = (symbol, msg) => {
  if (!msg) {
    msg = symbol
    symbol = green('✔', false)
  }
  if (lastMsg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: lastMsg.text,
    })
  }
  spinner.text = ' ' + msg
  lastMsg = {
    symbol: symbol + ' ',
    text: msg,
  }
  spinner.start()
}

const endLoad = msg => {
  if (lastMsg && msg) {
    spinner.stopAndPersist({
      symbol: lastMsg.symbol,
      text: msg || lastMsg.text,
    })
  } else {
    spinner.stop()
  }
  lastMsg = null
}

module.exports = {
  endLoad,
  startLoad
}
// usage
// spinner.start(); // 开启加载
// spinner.succeed();
// spinner.fail("请求失败， request fail, reTrying");