/*

  Purpose: Cache build version to cache.

*/

'use strict'

// Include modules
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')

// Check version
if (/^(dev|(([0-9]+)\.([0-9]+)\.([0-9]+)))$/.test(env.arg.version) !== true) {
  alert('Version argument not valid.', 'error')
// Cache version
} else {
  cmd(__dirname, 'node cache-snapshot --name build-' + env.arg.version, function () {
    alert('Version ' + env.arg.version + ' cached.')
  })
}
