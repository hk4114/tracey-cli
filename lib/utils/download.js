const path = require('path')

const spawn = require('./spawn')
const remove = require('./remove')
const { green, red, startLoad, endLoad } = require('./index')

function download(project, git) {
  const cwd = path.join(process.cwd(), `${project}`)
  startLoad('', '下载中...')
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let r = await spawn(`git`, ['clone', `${git.url}`, `${project}`, '-v', '--progress'])
    endLoad()
    if (r) {
      red('下载失败')
      return false
    }
    green('下载成功!')
    if (git.branch) {
      await spawn(`git`, ['checkout', `${git.branch}`], { cwd })
    }
    await remove(`./${project}/.git`)
    await spawn(`git`, [`init`], { cwd })
    if (r) return reject(r)
    return resolve(true)
  })
}
// how to use 
module.exports = download