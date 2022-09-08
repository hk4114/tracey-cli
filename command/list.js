const config = require('../templates');
const chalk = require('chalk');

module.exports = () => {
  Object.keys(config.templates).forEach((item) => {
    const { description } = config.templates[item];
    console.log(`${chalk.yellow(item)} : ${chalk.cyan(description)} \n`);
  });
  process.exit();
}
