/*

  Purpose: Replace app folder with minimum files.

*/

'use strict'

// Include modules
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const jsonScheme = require('./json-scheme')
const fs = require('fs-extra')
const abs = require('path').resolve

// Define source and destination folders
const dest = abs(env.proj, 'app')

// Steps
const resetAppFolder = function (callback) {
  alert('Resetting app folder - please wait ...')
  try {
    fs.emptyDirSync(abs(dest))
    fs.ensureDirSync(abs(dest, 'images'))
    fs.ensureDirSync(abs(dest, 'pages'))
    fs.ensureDirSync(abs(dest, 'lang'))
    alert('Reset app folder.')
    callback()
  } catch (err) {
    alert('Failed to reset app folder structure.', 'issue')
  }
}
const copyIconFile = function (callback) {
  fs.copy(abs(__dirname, '../client/icon.png'), abs(dest, 'icon.png'), function (err) {
    alert('Copying icon file - please wait ...')
    if (!err) {
      alert('Icon file copied.')
      callback()
    } else {
      alert('Failed to copy icon file.', 'issue')
    }
  })
}
const createConfigFile = function (callback) {
  alert('Create default configuration file.')
  const res = jsonScheme.create(abs(__dirname, '../config-scheme.json'), abs(dest, 'config.json'))
  if (!Array.isArray(res)) {
    env.cfg = fs.readJsonSync(abs(dest, 'config.json'))
    alert('Default configuration file created.')
    callback()
  } else {
    alert('Failed to create deafault configuration file.', 'issue')
  }
}
const createDatabaseRules = function (callback) {
  alert('Creating default database rules - please wait ...')
  const rules = {
    'rules': {
      '.read': 'auth != null',
      '.write': 'auth != null'
    }
  }
  fs.writeJson(abs(dest, 'firebase-database.json'), rules, function (err) {
    if (!err) {
      alert('Created default database rules.')
      callback()
    } else {
      alert('Failed to create default database rules.', 'issue')
    }
  })
}
const createStorageRules = function (callback) {
  alert('Creating default storage rules - please wait ...')
  const rules = 'service firebase.storage {\n' +
              '  match /b/' + (env.cfg.firebase.storageBucket !== '' ? env.cfg.firebase.storageBucket : '<your-storage-bucket>') + '/o {\n' +
              '    match /{allPaths=**} {\n' +
              '      allow read, write: if request.auth != null;\n' +
              '    }\n' +
              '  }\n' +
              '}\n'
  fs.writeFile(abs(dest, 'firebase-storage.txt'), rules, function (err) {
    if (!err) {
      alert('Created default storage rules.')
      callback()
    } else {
      alert('Failed to create default stoarge rules.', 'issue')
    }
  })
}
const createAppComponent = function (callback) {
  alert('Creating default app component - please wait ...')
  const content = '<template>\n' +
                '  <div id="app">\n' +
                '    <f7-views>\n' +
                '      <f7-view main url="/home/" navbar-through :dynamic-navbar="$theme.ios" />\n' +
                '    </f7-views>\n' +
                '  </div>\n' +
                '</template>\n'
  fs.writeFile(abs(dest, 'app.vue'), content, function (err) {
    if (!err) {
      alert('Created default app component.')
      callback()
    } else {
      alert('Failed to create default app component.', 'issue')
    }
  })
}
const createHomepage = function (callback) {
  alert('Creating default page component - please wait ...')
  const content = '<template>\n' +
                '  <f7-page>\n' +
                '    <f7-navbar :title="$root.config.title" />\n' +
                '    <f7-block inner inset>{{$lang(\'text\')}}</f7-block>\n' +
                '    <f7-block>\n' +
                '      <f7-button big fill raised bg="green" href="https://github.com/scriptPilot/app-framework/blob/master/DOCUMENTATION.md" external>Documentation</f7-button>\n' +
                '    </f7-block>\n' +
                '  </f7-page>\n' +
                '</template>\n'
  fs.writeFile(abs(dest, 'pages/home.vue'), content, function (err) {
    if (!err) {
      alert('Created default page component.')
      callback()
    } else {
      alert('Failed to create default page component.', 'issue')
    }
  })
}

const createLanguageFiles = (callback) => {
  alert('Creating default language files - please wait ...')
  try {
    fs.writeJsonSync(abs(dest, 'lang/en.json'), { text: 'It works!' }, { spaces: 2 })
    fs.writeJsonSync(abs(dest, 'lang/de.json'), { text: 'Es funktioniert!' }, { spaces: 2 })
  } catch (err) {
    alert('Failed to create languages files.', 'issue')
  }
  alert('Created language files.')
  callback()
}

const updateRoutes = (callback) => {
  if (dest === env.app) {
    cmd(__dirname, 'node update-routes', function () {
      callback()
    })
  } else {
    callback()
  }
}

// Run
alert('Replacing app folder with minimum files - please wait ...')
cmd(__dirname, 'node snapshot', function () {
  resetAppFolder(function () {
    copyIconFile(function () {
      createConfigFile(function () {
        createLanguageFiles(function () {
          createDatabaseRules(function () {
            createStorageRules(function () {
              createAppComponent(function () {
                createHomepage(function () {
                  updateRoutes(function () {
                    alert('App folder replaced with minimum files.')
                  })
                })
              })
            })
          })
        })
      })
    })
  })
})
