/* Purpose: Clear cache folder */

'use strict'

const env = require('./env')
const alert = require('./alert')
const fs = require('fs-extra')

alert('Cache reset ongoing - please wait ...')
fs.remove(env.cache, function (err) {
  if (err) {
    alert('Failed to reset cache.', 'error')
  } else {
    alert('Cache reset done.')
  }
})
