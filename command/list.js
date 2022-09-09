const config = require('../templates');
const { yellow, cyan } = require('../lib/utils')

module.exports = () => {
  Object.keys(config.templates).forEach((item) => {
    const { description } = config.templates[item];
    console.log(`${yellow(item, false)} : ${cyan(description, false)} \n`);
  });
  process.exit();
}
