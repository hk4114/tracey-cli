const { stringify } = require('javascript-stringify')

// 递归的序列化代码
function stringifyJS(value) {
  return stringify(value, (val, indent, stringify) => {
    if (val && val.__expression) {
      return val.__expression
    }
    return stringify(val)
  }, 2)
}

module.exports = stringifyJS
