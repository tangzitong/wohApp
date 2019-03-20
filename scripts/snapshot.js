/* Purpose: Creates snapshot with current day as name, increase with character in case there are more than one snapshots per day */

'use strict'

// Include modules
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const found = require('./found')
const fs = require('fs-extra')
const abs = require('path').resolve

// Define filename
const now = new Date()
const name = 'snapshot-' + now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()

// Define filename and create snapshot
const createSnapshot = function (name, char) {
  // Start empty
  char = char || ''
  // Check if file exists
  if (char !== '' && char > 122) {
    alert('More than ' + (char - 97) + ' snapshots per day are not supported.', 'error')
  } else if (!found(env.proj, 'snapshots', name + (char === '' ? '' : String.fromCharCode(char)) + '.zip') && (char !== '' || !found(env.proj, 'snapshots', name + 'a.zip'))) {
    // Extend first one with a
    if (char === 98) {
      fs.renameSync(abs(env.proj, 'snapshots', name + '.zip'), abs(env.proj, 'snapshots', name + 'a.zip'))
    }
    name = name + (char === '' ? '' : String.fromCharCode(char))
    // Create snapshot
    cmd(__dirname, 'node create-snapshot --name ' + name)
  } else {
    return createSnapshot(name, char === '' ? 98 : char + 1)
  }
}
createSnapshot(name)
