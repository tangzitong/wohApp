/*

  Purpose: Create snapshots of the Firebase database and user list.

*/

'use strict'

// Include modules
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const fs = require('fs-extra')
const abs = require('path').resolve

// Define Firebase bin folder
const binFolder = abs(env.proj, 'node_modules/firebase-tools/bin')

// Define project
const project = env.cfg.firebase.authDomain.substr(0, env.cfg.firebase.authDomain.indexOf('.firebaseapp.com'))

// Define filename
const now = new Date()
const dateStr = now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' : '') + (now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' : '') + now.getDate()

// Run
alert('Firebase backup ongoing - please wait ...')
cmd(binFolder, 'firebase login', function () {
  alert('Firebase database backup ongoing - please wait ...')
  cmd(binFolder, 'firebase database:get / >"' + abs(env.proj, 'snapshots/firebase-database-' + dateStr + '.json') + '" --project ' + project, function () {
    alert('Firebase user backup ongoing - please wait ...')
    cmd(binFolder, 'firebase auth:export "' + abs(env.proj, 'snapshots/firebase-users-' + dateStr + '.json') + '" --format=json --project ' + project, function () {
      try {
        const dbFile = fs.readJsonSync(abs(env.proj, 'snapshots/firebase-database-' + dateStr + '.json'))
        fs.writeJsonSync(abs(env.proj, 'snapshots/firebase-database-' + dateStr + '.json'), dbFile)
        const userFile = fs.readJsonSync(abs(env.proj, 'snapshots/firebase-users-' + dateStr + '.json'))
        fs.writeJsonSync(abs(env.proj, 'snapshots/firebase-users-' + dateStr + '.json'), userFile)
        alert('Firebase backup done.')
      } catch (err) {
        alert('Failed to beautify database backup files.', 'issue')
      }
    }, 'Firebase user backup failed.')
  }, 'Firebase login failed.')
})
