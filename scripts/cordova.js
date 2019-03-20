/*

  Purpose with specific arguments:

  --ios to open dev build in iOS emulator
  --android to open dev build in Android emulator
  --xcode to open given version build in Xcode
  --studio to open given version build in Android Studio

  Optionally: --version x.y.z

*/

'use strict'

// Load packages
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const found = require('./found')
const type = require('./type')
const fs = require('fs-extra')
const path = require('path')
const abs = require('path').resolve
const xml = require('xml2js')

let icons = null

// Deploy current version by default
if (env.arg.version === undefined && (env.arg.xcode === true || env.arg.studio === true)) {
  env.arg.version = env.pkg.version
} else if (env.arg.ios === true || env.arg.android === true) {
  env.arg.version = 'dev'
}

// Check arguments
if (env.arg.ios === true || env.arg.xcode === true) {
  if (env.os !== 'mac') {
    alert('iOS builds are only possible on macOS devices.', 'exit')
  }
} else if (env.arg.android !== true && env.arg.studio !== true) {
  alert('Cordova argument missing.', 'issue')
}

// Check store id
const storeId = env.arg.ios === true || env.arg.android === true
  ? 'com.app_framework.dev_build'
  : env.arg.xcode === true
    ? env.cfg.appStoreId
    : env.cfg.playStoreId
if (storeId === '') {
  alert('You must configure the ' + (env.arg.xcode === true ? 'appStoreId' : 'playStoreId') + ' before.', 'error')
} else if (env.arg.studio === true && /^([A-Za-z]{1}[A-Za-z\d_]*\.)*[A-Za-z][A-Za-z\d_]*$/.test(storeId) === false) {
  alert('The configured playStoreId is not valid.', 'error')
}

// Define Cordova bin directory
const binDir = abs(env.proj, 'node_modules/cordova/bin')

// Define build directories
const buildSourceDir = abs(env.cache, 'snapshots', 'build-' + env.arg.version, 'build/www')
const wwwFolder = abs(binDir, 'www')

// Define steps
const deleteFiles = function (files, callback) {
  if (Array.isArray(files) && files.length > 0) {
    const fileToDelete = files.shift()
    fs.remove(abs(binDir, fileToDelete), function (err) {
      if (err) {
        env.debug(`Failed to delete file "${fileToDelete}"`)
        alert('Failed to remove files in Cordova folder.', 'issue')
      } else {
        env.debug(`Deleted file "${fileToDelete}"`)
        deleteFiles(files, callback)
      }
    })
  } else {
    callback()
  }
}
const resetCordovaFolder = function (callback) {
  alert('Cordova directory reset ongoing - please wait ...')
  fs.readdir(binDir, function (err, files) {
    if (err) {
      alert('Cordova directory reset failed.', 'issue')
    } else {
      const filesToDelete = []
      for (let f = 0; f < files.length; f++) {
        if (files[f] !== 'cordova' && files[f] !== 'cordova.cmd') {
          filesToDelete.push(files[f])
        }
      }
      deleteFiles(filesToDelete, function () {
        alert('Cordova directory reset done.')
        callback()
      })
    }
  })
}
const createCordovaProject = function (callback) {
  alert('Cordova project folder creation ongoing - please wait ...')
  cmd(binDir, 'cordova create .temp', function () {
    fs.copy(abs(binDir, '.temp'), binDir, function (err) {
      if (!err) {
        fs.remove(abs(binDir, '.temp'), function (err) {
          if (!err) {
            alert('Cordova project folder creation done.')
            callback()
          } else {
            alert('Failed to remove Cordova temp folder.', 'issue')
          }
        })
      } else {
        alert('Failed to copy Cordova project folder.', 'issue')
      }
    })
  }, function () {
    alert('Failed to create Cordova project folder.', 'issue')
  })
}
const updateCordovaConfig = function (callback) {
  alert('Cordova configuration update ongoing - please wait ...')
  // Copy icons and read to array
  try {
    fs.copySync(abs(env.cache, 'icons/dev'), abs(binDir, 'icons'))
    icons = fs.readdirSync(abs(env.cache, 'icons/dev'))
  } catch (err) {
    alert('Failed to copy and read icon folder.', 'issue')
  }
  // Start configuration
  let config = {}
  // Add widget
  const d = new Date()
  const devVersion = d.getFullYear() - 2000 +
                     (d.getMonth() < 9 ? '0' : '') + (d.getMonth() + 1) +
                     (d.getDate() < 10 ? '0' : '') + d.getDate() +
                     (d.getHours() < 10 ? '0' : '') + d.getHours() +
                     (d.getMinutes() < 10 ? '0' : '') + d.getMinutes()
  config = {
    '$': {
      'id': storeId,
      'version': env.arg.version === 'dev' ? '0.0.' + devVersion : env.arg.version,
      'xmlns': 'http://www.w3.org/ns/widgets',
      'xmlns:cdv': 'http://cordova.apache.org/ns/1.0'
    }
  }
  // Add name
  config.name = env.cfg.title
  // Author
  if (type(env.pkg.author) === 'object') {
    config.author = {
      _: env.pkg.author.name
    }
    if (type(env.pkg.author.email) === 'string' || type(env.pkg.author.url) === 'string') {
      config.author.$ = {}
      if (type(env.pkg.author.email) === 'string') {
        config.author.$.email = env.pkg.author.email
      }
      if (type(env.pkg.author.url) === 'string') {
        config.author.$.url = env.pkg.author.url
      }
    }
  } else if (type(env.pkg.author) === 'string') {
    const authorInfo = env.pkg.author.match(/^(.+?)( <(.+)>)?( \((.+?)\))?$/)
    if (env.pkg.author !== null && authorInfo[1] !== undefined) {
      config.author = {
        _: authorInfo[1]
      }
      if (authorInfo[3] !== undefined || authorInfo[5] !== undefined) {
        config.author.$ = {}
        if (authorInfo[3] !== undefined) {
          config.author.$.email = authorInfo[3]
        }
        if (authorInfo[5] !== undefined) {
          config.author.$.url = authorInfo[5]
        }
      }
    }
  }
  // Add description
  if (env.pkg.description !== undefined) {
    config.description = env.pkg.description
  }
  // Add content entry point
  config.content = {
    '$': {
      'src': 'index.html'
    }
  }
  // Apply custom Cordova preferences
  if (env.cfg.cordovaPreferences !== undefined) {
    const preferences = config.preference ? [config.preference] : []
    for (const key in env.cfg.cordovaPreferences) {
      preferences.push({
        '$': {
          'name': key,
          'value': env.cfg.cordovaPreferences[key]
        }
      })
    }
    if (preferences.length > 0) {
      config.preference = preferences
    }
  }
  // Add Android platform
  if (env.arg.android === true || env.arg.studio) {
    config.platform = {
      '$': {
        'name': 'android'
      },
      'allow-intent': {
        '$': {
          'href': 'market:*'
        }
      },
      'icon': [],
      'splash': []
    }
    for (let i = 0; i < icons.length; i++) {
      const iconInfo = icons[i].match(/android-(icon|splash)-([a-z]+)dpi-([0-9]+)x([0-9]+)\.png/)
      if (iconInfo !== null) {
        config.platform[iconInfo[1]].push({
          '$': {
            'src': path.join('icons/' + iconInfo[0]),
            'density': (iconInfo[1] === 'splash' ? (iconInfo[3] > iconInfo[4] ? 'land' : 'port') + '-' : '') + iconInfo[2] + 'dpi'
          }
        })
      }
    }
  }
  // Add iOS platform
  if (env.arg.ios === true || env.arg.xcode === true) {
    config.platform = {
      $: {
        name: 'ios'
      },
      'allow-intent': [
        {
          $: {
            href: 'itms:*'
          }
        },
        {
          $: {
            href: 'itms-apps:*'
          }
        }
      ],
      'icon': [],
      'splash': []
    }
    for (let i = 0; i < icons.length; i++) {
      const iconInfo = icons[i].match(/ios-(icon|splash)-([0-9]+)x([0-9]+)\.png/)
      if (iconInfo !== null) {
        config.platform[iconInfo[1]].push({
          '$': {
            'src': path.join('icons/' + iconInfo[0]),
            'width': iconInfo[2],
            'height': iconInfo[3]
          }
        })
      }
    }
  }
  // White listening
  config.plugin = [
    {
      '$': {
        'name': 'cordova-plugin-whitelist',
        'spec': '1'
      }
    }
  ]
  config.access = {
    $: {
      origin: '*'
    }
  }
  config['allow-intent'] = [
    {
      $: {
        href: 'http://*/*'
      }
    },
    {
      $: {
        href: 'https://*/*'
      }
    },
    {
      $: {
        href: 'tel:*'
      }
    },
    {
      $: {
        href: 'sms:*'
      }
    },
    {
      $: {
        href: 'mailto:*'
      }
    },
    {
      $: {
        href: 'geo:*'
      }
    }
  ]
  // Update config files
  const builder = new xml.Builder({rootName: 'widget', xmldec: {version: '1.0', encoding: 'utf-8'}})
  const xmlContent = builder.buildObject(config)
  fs.writeFile(abs(binDir, 'config.xml'), xmlContent, function (err) {
    if (!err) {
      callback()
    } else {
      alert('Cordova configuration update failed.', 'issue')
    }
  })
}
const updateWwwFolder = function (callback) {
  alert('Cordova build folder update ongoing - please wait ...')
  fs.remove(wwwFolder, function (err) {
    if (!err) {
      fs.copy(buildSourceDir, wwwFolder, function (err) {
        if (!err) {
          fs.readFile(abs(wwwFolder, 'index.html'), 'utf8', function (err, html) {
            if (!err) {
              html = html.replace('<script', '<script type=text/javascript src=cordova.js></script><script')
              fs.writeFile(abs(wwwFolder, 'index.html'), html, function (err) {
                if (!err) {
                  alert('Cordova build folder update done.')
                  callback()
                } else {
                  alert('Failed to update the index.html file', 'issue')
                }
              })
            } else {
              alert('Failed to read the index.html file.', 'issue')
            }
          })
        } else {
          alert('Failed to copy build folder.', 'issue')
        }
      })
    } else {
      alert('Failed to reset Cordova build folder.', 'issue')
    }
  })
}
const installCordovaPlugins = function (callback, pluginList) {
  alert('Cordova plugin installation ongoing - please wait ...')
  if (pluginList === undefined) {
    pluginList = env.cfg.useCordovaPlugins
    if (pluginList.indexOf('cordova-plugin-whitelist') === -1) {
      pluginList.push('cordova-plugin-whitelist')
    }
    if (pluginList.indexOf('cordova-plugin-statusbar') === -1) {
      pluginList.push('cordova-plugin-statusbar')
    }
    if (pluginList.indexOf('cordova-plugin-nativestorage') === -1) {
      pluginList.push('cordova-plugin-nativestorage')
    }
  }
  if (Array.isArray(pluginList) && pluginList.length > 0) {
    const nextPlugin = pluginList.shift()
    const additionalCommand = nextPlugin === 'cordova-plugin-camera'
      ? ' --variable CAMERA_USAGE_DESCRIPTION="' + env.cfg.title + ' camera use" --variable PHOTOLIBRARY_USAGE_DESCRIPTION="' + env.cfg.title + ' photo library use"'
      : ''
    cmd(binDir, 'cordova plugin add ' + nextPlugin + additionalCommand, function () {
      installCordovaPlugins(callback, pluginList)
    }, function () {
      alert('Failed to install Cordova plugins.', 'issue')
    })
  } else {
    alert('Cordova plugin installation done.')
    callback()
  }
}
const addCordovaPlatforms = function (callback) {
  alert('Cordova platform installation ongoing - please wait ...')
  if (env.arg.ios === true || env.arg.xcode === true) {
    cmd(binDir, 'cordova platform add ios', function () {
      // workaround: #626 - npm run ios fails with <cannot read property 'replace' of undefined>
      try {
        const filename = path.resolve(binDir, 'platforms/ios/cordova/node_modules/ios-sim/src/lib.js')
        const string = 'list.push(util.format(\'%s, %s\', name_id_map[ deviceName ].replace(/^com.apple.CoreSimulator.SimDeviceType./, \'\'), runtime.replace(/^iOS /, \'\')));'
        const wrapper = 'if (name_id_map[deviceName] && runtime) { ' + string + ' }'
        let filecontent = fs.readFileSync(filename, 'utf8')
        filecontent = filecontent.replace(string, wrapper)
        fs.writeFileSync(filename, filecontent)
      } catch (err) {
        alert('Failed to apply workaround #626.')
      }
      // Alert
      alert('Cordova platform installation done for Android.')
      // Callback
      callback()
    }, function () {
      alert('Cordova platform installation failed for iOS.', 'issue')
    })
  } else {
    cmd(binDir, 'cordova platform add android', function () {
      fs.mkdir(abs(binDir, 'platforms/android/.idea'), function (err) {
        if (!err) {
          alert('Cordova platform installation done for Android.')
          callback()
        } else {
          alert('Failed to create .idea folder for Cordova Android platform.', 'issue')
        }
      })
      alert('Cordova platform installation done for Android.')
      callback()
    }, function () {
      alert('Cordova platform installation failed for Android.', 'issue')
    })
  }
}

const deployDevRules = function (callback) {
  if (env.arg.version === 'dev') {
    cmd(__dirname, 'node firebase --database --storage --version dev', function () {
      callback()
    })
  } else {
    callback()
  }
}

// Run script
deployDevRules(function () {
  cmd(__dirname, 'node cache-version --version ' + env.arg.version, function () {
    resetCordovaFolder(function () {
      createCordovaProject(function () {
        updateCordovaConfig(function () {
          updateWwwFolder(function () {
            installCordovaPlugins(function () {
              addCordovaPlatforms(function () {
                if (env.arg.ios === true) {
                  alert('iOS simulator start ongoing - please wait ...')
                  cmd(binDir, 'cordova emulate ios', function () {
                    alert('iOS emulator started.')
                  })
                } else if (env.arg.xcode === true) {
                  alert('Xcode start ongoing - please wait ...')
                  // Determine .xcworkspace or .xcodeproj file (with cocoapod / default)
                  const iOSWorkspaceFile = abs(binDir, 'platforms/ios', env.cfg.title + '.xcworkspace')
                  const iOSProjFile = abs(binDir, 'platforms/ios', env.cfg.title + '.xcodeproj')
                  const useFile = found(iOSWorkspaceFile) ? iOSWorkspaceFile : iOSProjFile
                  cmd(__dirname, 'open -a Xcode "' + useFile + '"', function () {
                    alert('Xcode started.')
                  })
                } else if (env.arg.android === true) {
                  alert('Android simulator start ongoing - please wait ...')
                  cmd(binDir, 'cordova emulate android', function () {
                    alert('Android emulator started.')
                  })
                } else if (env.arg.studio === true) {
                  alert('Android Studio start ongoing - please wait ...')
                  if (env.os === 'win') {
                    const possibleInstallations = [
                      abs(process.env['ProgramFiles'], 'Android/Android Studio/bin/studio64.exe'),
                      abs(process.env['ProgramFiles'], 'Android/Android Studio/bin/studio.exe'),
                      abs(process.env['ProgramFiles(x86)'], 'Android/Android Studio/bin/studio64.exe'),
                      abs(process.env['ProgramFiles(x86)'], 'Android/Android Studio/bin/studio.exe')
                    ]
                    for (let p = 0; p < possibleInstallations.length; p++) {
                      if (found(possibleInstallations[p])) {
                        cmd(path.dirname(possibleInstallations[p]), ['start', path.basename(possibleInstallations[p]), '"' + abs(binDir, 'platforms/android') + '"'], function () {
                          alert('Android Studio started.')
                        })
                        p = possibleInstallations.length
                      } else if (p + 1 === possibleInstallations.length) {
                        alert('Android Studio installation path not found.\nPlease open Android Studio manually and open project path:\n\n' + abs(binDir, 'platforms/android'), 'issue')
                      }
                    }
                  } else if (env.os === 'mac') {
                    cmd(__dirname, 'open -a "/Applications/Android Studio.app" "' + abs(binDir, 'platforms/android') + '"', function () {
                      alert('Android Studio started.')
                    })
                  } else if (env.os === 'linux') {
                    const possibleInstallations = [
                      abs('/bin/android-studio/bin/studio.sh'),
                      abs('/opt/android-studio/bin/studio.sh'),
                      abs('/usr/bin/android-studio/bin/studio.sh'),
                      abs('/usr/local/android-studio/bin/studio.sh'),
                      abs('/usr/local/bin/android-studio/bin/studio.sh')
                    ]
                    for (let p = 0; p < possibleInstallations.length; p++) {
                      if (found(possibleInstallations[p])) {
                        cmd(path.dirname(possibleInstallations[p]), ['./' + path.basename(possibleInstallations[p]), '"' + abs(binDir, 'platforms/android') + '"'], function () {
                          alert('Android Studio started.')
                        })
                        p = possibleInstallations.length
                      } else if (p + 1 === possibleInstallations.length) {
                        alert('Android Studio installation path not found.\nPlease open Android Studio manually and open project path:\n\n' + abs(binDir, 'platforms/android'), 'issue')
                      }
                    }
                  } else {
                    alert('Unknown operating system "' + env.os + '".', 'issue')
                  }
                } else {
                  alert('No argument found of list ios, android, xcode or studio.', 'issue')
                }
              })
            })
          })
        })
      })
    })
  })
})
