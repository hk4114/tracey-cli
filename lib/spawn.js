const spawn = require('cross-spawn')


module.exports = (command, args = [], options = {}) => {
  return new Promise((resolve) => {
    const child = spawn(command, args, Object.assign({ stdio: 'inherit', shell: true, cwd: '' }, options))
    child.on('close', code => {
      if (code !== 0) {
        return resolve({ command: `${command} ${args.join(' ')}` });
      }
      resolve();
    });
  })
}
