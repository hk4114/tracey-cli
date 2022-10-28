const templates = require('../templates');
const { yellow, cyan } = require('../lib/utils')

module.exports = () => {
  Object.keys(templates).forEach((item) => {
    const { description } = templates[item];
    console.log(`${yellow(item, false)} : ${cyan(description, false)} \n`);
  });
  process.exit();
}
