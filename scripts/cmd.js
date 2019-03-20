/*

  Purpose: Run a child process and, depending on the result, run onSuccess() or onError() callbacks.

  cmd(workingDirectory <string/array>, commands <string/array>, [onSuccess <null/string/function>, [onError <string/function>]])

*/

'use strict'

// Import modules
const alert = require('./alert')
const type = require('./type')
const cp = require('child_process')
const path = require('path')

// Export function
module.exports = function (workingDirectory, commands, onSuccess, onError) {
  // Check number of argument
  if (arguments.length < 2 < arguments.length > 4) {
    alert('cmd() funtions needs two to four arguments.', 'issue')
  }
  // Check working directory
  if (type(workingDirectory) === 'array') {
    workingDirectory = path.resolve.apply(null, workingDirectory)
  } else if (type(workingDirectory) !== 'string') {
    alert('cmd() functions needs string as first argument.', 'issue')
  }
  // Check commands
  if (type(commands) === 'string') {
    commands = commands.split(' ')
  } else if (type(commands) !== 'array') {
    alert('cmd() functions needs string or array as second argument.', 'issue')
  }
  // Check onSuccess
  if (type(onSuccess) === 'string') {
    const msg = onSuccess
    onSuccess = function () {
      alert(msg)
    }
  } else if (onSuccess === undefined || type(onSuccess) === 'null') {
    onSuccess = function () {}
  } else if (type(onSuccess) !== 'function') {
    alert('cmd() functions needs null, string or function as third argument.', 'issue')
  }
  // Check onError
  if (type(onError) === 'string') {
    const msg = onError
    onError = function () {
      alert(msg, 'error')
    }
  } else if (onError === undefined) {
    onError = function () {
      process.exit(process.env.subProcess === 'true' ? 1 : 0)
    }
  } else if (type(onError) !== 'function') {
    alert('cmd() functions needs string or function as fourth argument.', 'issue')
  }
  // Define child process environment variables, set subProcess to "true"
  const env = JSON.parse(JSON.stringify(process.env))
  env.subProcess = true
  // Run sub process
  cp.spawn(commands.shift(), commands, {
    cwd: workingDirectory,
    env: env,
    stdio: 'inherit',
    shell: true
  })
  // Callback on sub process closure
    .on('close', function (exitCode) {
      if (exitCode === 0) {
        onSuccess()
      } else {
        onError()
      }
    })
}
