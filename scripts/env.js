/*

  Purpose:
  - Check node version
  - Define paths
  - Fix configuration file
  - Check if user has forked the repo insetead of installing it as dependency
  - Define installation status
  - Load package information
  - Load app configuration
  - Define operating system
  - Function to compare path with .gitignore entries
  Provide everything as an object

*/

'use strict'

// Include Modules
const alert = require('./alert')
const found = require('./found')
// const jsonScheme = require('./json-scheme')
// const upgradeConfig = require('./upgrade-config')
const fs = require('fs-extra')
const argParser = require('minimist')
const rel = require('path').join
const abs = require('path').resolve
const sep = require('path').sep
const ver = require('semver')

// Include framework information
const framework = require('../package.json')

// Check node version
if (framework.engines && framework.engines.node && ver.satisfies(process.version, framework.engines.node) !== true) {
  alert('Please update Node.js to version ' + framework.engines.node, 'error')
}

// Read script parameters
const arg = argParser(process.argv.slice(2))

// Define installation status
const installed = false

// Define paths
const proj = installed ? abs(__dirname, '../../../') : abs(__dirname, '../')
const app = installed ? abs(proj, 'src') : abs(proj, 'src')
const cache = abs(proj, 'node_modules/.app-framework-cache')

// Check if user has forked the repo
if (!installed && !found(proj, '.enable-dev-mode')) {
  // alert('App Framework should be installed as module.\nPlease check our documentation on GitHub.', 'error')
}

// Fix configuration file
/* if (found(app, 'config.json')) {
  upgradeConfig(app)
  let configFix = jsonScheme.fix(abs(__dirname, '../config-scheme.json'), abs(app, 'config.json'))
  if (Array.isArray(configFix)) {
    alert('Failed to fix config file.\nDetails:\n- ' + configFix.join('\n- '), 'issue', 'issue')
  }
} */

// Load configuration
const pkg = found(proj, 'package.json') ? fs.readJsonSync(abs(proj, 'package.json')) : {}
// let cfg = found(app, 'config.json') ? fs.readJsonSync(abs(app, 'config.json')) : {}

// Define operating system
let os = null
if (process.platform === 'win32') {
  os = 'win'
} else if (process.platform === 'darwin') {
  os = 'mac'
} else if (process.platform === 'linux') {
  os = 'linux'
} else {
  alert('Your operation system "' + process.platform + '" is not supported.', 'issue')
}

// Read .gitignore file as array with regexp
const ignoredExp = []
if (found(proj, '.gitignore')) {
  const gitignore = fs.readFileSync(abs(proj, '.gitignore'), 'utf8')
  const rows = gitignore.match(/^(.+)$/gm)
  for (let r = 0; r < rows.length; r++) {
    if (rows[r] !== '' && /^#/.test(rows[r]) === false) {
      let exp = rel(rows[r])
      // Replace path separators with system path separators
      exp = exp.replace(/\//, sep)
      // Escape backslashs
      exp = exp.replace(/\\/g, '\\\\')
      // Escape slashs
      exp = exp.replace(/\//g, '\\\/') // eslint-disable-line
      // Escape points
      exp = exp.replace(/\./g, '\\.')
      // Escape wildcards
      exp = exp.replace(/\*/g, '(.*)')
      // Make last backslash optional (to include folder itself)
      exp = exp.replace(/\\\\$/g, '(\\\\(.*))?')
      // Make last slash optional (to include folder itself)
      exp = exp.replace(/\\\/$/g, '(\\\/(.*))?') // eslint-disable-line
      // Add start/end
      exp = '^' + exp + '$'
      // Create regexp
      const regexp = new RegExp(exp)
      ignoredExp.push(regexp)
    }
  }
}

// Function to check path according .gitignore file
const ignored = function (path) {
  // Transform path, if folder, add separator to end
  let isIgnored = false
  for (let i = 0; i < ignoredExp.length; i++) {
    if (ignoredExp[i].test(path) === true) {
      isIgnored = true
      i = ignoredExp.length
    }
  }
  return isIgnored
}

// Debug function
const debug = (input) => {
  // if (cfg.debug === true) {
  const inputString = typeof input === 'string' ? input : JSON.stringify(input)
  const debugFile = abs(proj, 'debug.log')
  let debugFileContent = found(debugFile) ? fs.readFileSync(debugFile, 'utf-8') : ''
  debugFileContent = debugFileContent + inputString + '\n'
  fs.writeFileSync(debugFile, debugFileContent)
  // }
}

module.exports = {
  framework: framework,
  arg: arg,
  installed: installed,
  proj: proj,
  app: app,
  cache: cache,
  pkg: pkg,
  // cfg: cfg,
  os: os,
  ignored: ignored,
  debug: debug
}
