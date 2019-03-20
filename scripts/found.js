/* Purpose: Check if file or folder exists (input string or array of path fragments; case-sensitive) */

'use strict'

// Include modules
const fs = require('fs-extra')
const path = require('path')

// Export function
module.exports = function () {
  try {
    const pathToCheck = path.resolve.apply(null, arguments)
    const dirname = path.dirname(pathToCheck)
    const basename = path.basename(pathToCheck)
    const files = fs.readdirSync(dirname)
    return files.indexOf(basename) > -1
  } catch (err) {
    return false
  }
}
