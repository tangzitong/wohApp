/*

  Purpose: Copy snapshot to cache

  Arguments: --name must be name of snapshot file (without .zip)

*/

'use strict'

// Load modules
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const found = require('./found')
const unzip = require('extract-zip')
const fs = require('fs-extra')
const path = require('path')
const abs = require('path').resolve

// Alert
alert('Snapshot cache ongoing - please wait ...')

// Get snapshot name
if (env.arg.name === undefined) {
  alert('Snapshot cache needs name argument.', 'error')
}

// Define snapshot cache folder
const cacheFolder = path.resolve(env.cache, 'snapshots/' + env.arg.name)

// Snapshot already cached
if (found(cacheFolder) && env.arg.name !== 'build-dev') {
  alert('Snapshot cache done.', 'exit')

// Cache dev snapshot
} else if (env.arg.name === 'build-dev') {
  // Build
  cmd(__dirname, 'node build --dev', function () {
    // Reset cache folder
    fs.emptyDir(abs(env.cache, 'snapshots/build-dev'), function (err) {
      if (err) {
        alert('Failed to reset build-dev cache folder.', 'issue')
      } else {
        // Copy build files
        fs.copy(abs(env.cache, 'build'), abs(env.cache, 'snapshots/build-dev/build'), function (err) {
          if (err) {
            // alert('Failed to copy build files to snapshot cache.', 'issue')
          } else {
            alert('Snapshot cached.')
          }
        })
      }
    })
  })

// Unzip snapshot
} else {
  const snapshotFile = path.resolve(env.proj, 'snapshots/' + env.arg.name + '.zip')
  // Snapshot file found
  if (found(snapshotFile)) {
    unzip(
      snapshotFile,
      {dir: cacheFolder},
      function (err) {
        if (err) {
          alert('Snapshot cache failed.', 'issue')
        } else {
          alert('Snapshot cached.')
        }
      }
    )
  // Current version requested and build folder found
  } else if (env.arg.name === 'build-' + env.pkg.version && found(env.proj, 'build')) {
    // Copy build files
    fs.copy(abs(env.proj, 'build'), abs(env.cache, 'snapshots', env.arg.name, 'build'), function (err) {
      if (err) {
        alert('Failed to copy build files to snapshot cache.', 'issue')
      } else {
        alert('Snapshot cached.')
      }
    })
  // Snapshot file not found
  } else {
    const buildHint = !found(env.proj, 'build') ? '\nPlease build your application first with "npm run patch/minor/major".' : ''
    alert('Snapshot file "' + path.relative(env.proj, snapshotFile) + '" not found.' + buildHint, 'error')
  }
}
