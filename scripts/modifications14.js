/*

  Purpose: Apply necessary modifications to older versions to prepare version 1.4

*/

'use strict'

// Include modules
const env = require('./env')
const alert = require('./alert')
const found = require('./found')
const fs = require('fs-extra')
const abs = require('path').resolve
const rec = require('recursive-readdir')

if (env.installed) {
  alert('Release modifications of v1.4 ongoing - please wait ...')
  try {
    // Configuration update
    // ... done in upgrade-config.js
    // Remove login-screen.vue
    if (found(env.app, 'pages/login-screen.vue')) {
      fs.removeSync(abs(env.app, 'pages/login-screen.vue'))
    }
    if (found(env.app, 'routes.json')) {
      const routes = fs.readJsonSync(abs(env.app, 'routes.json'))
      const newRoutes = []
      for (const r in routes) {
        if (routes[r].component !== 'login-screen.vue' && routes[r].component !== 'login-screen') {
          newRoutes.push(routes[r])
        }
      }
      fs.writeJsonSync(abs(env.app, 'routes.json'), newRoutes)
    }
    // Update strings in files
    rec(env.app, function (err, files) {
      if (err) alert('Release file modifications of v1.4 failed.', 'issue')
      files.map(function (file) {
        if (/\.(js|vue)$/.test(file)) {
          let content = fs.readFileSync(file, 'utf8')
          content = content.replace(/\$root\.title/g, '$root.config.title')
          content = content.replace(/\$root\.packageVersion/g, '$root.framework.version')
          content = content.replace(/\$root\.version/g, '$root.project.version')
          fs.writeFileSync(file, content)
        }
      })
      alert('Release modifications of v1.4 done.')
    })
  } catch (err) {
    alert('Release modifications of v1.4 failed.', 'issue')
  }
}
