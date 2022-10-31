const path = require('path')
const inquirer = require('inquirer')
const clear = require('clear');

const { blue, loading } = require('../lib/utils')
const inquirer = require('inquirer');

const questions = [
  {

  }
]

function test(name, options) {
  blue(JSON.stringify(name))
  console.log('')
  blue(JSON.stringify())
  inquirer
    .prompt([
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
        type: 'list',
        message: '请选择公共管理状态？',
        name: 'state',
        choices: ['mobx', 'redux'],
        when: res => Boolean(res.conf)
      }
    ])
    .then(answers => {
      console.log(answers)
    })
    .catch(error => {
      /* 出现错误 */
    });
}

module.exports = test