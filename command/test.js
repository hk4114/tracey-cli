// const path = require('path')
const inquirer = require('inquirer')
// const clear = require('clear');

// const { blue, loading } = require('../lib/utils')

const questions = [
  {
    name: 'conf',
    type: 'confirm',
    message: '是否创建新的项目？'
  },
  {
    name: 'name',
    message: '请输入项目名称？',
    when: res => Boolean(res.conf)
  },
  {
    type: 'checkbox',
    message: '请选择公共管理状态？',
    name: 'state',
    choices: ['mobx', 'redux'],
    when: res => Boolean(res.conf)
  }
]

function test(name, options) {
  inquirer
    .prompt(questions)
    .then(answers => {
      console.log(answers)
    })
    .catch(error => {
      /* 出现错误 */
    });
}

module.exports = test