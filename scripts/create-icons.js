/*

  Purpose: Create icons and splash screens, cache icons to version folder

  Arguments: --version (must be "x.y.z" or "dev")

*/

'use strict'

// Include packages
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const found = require('./found')
const fs = require('fs-extra')
// const hex2rgb = require('hex-rgb')
const img = require('jimp')
const abs = require('path').resolve
const toIco = require('to-ico')
const _ = require('underscore')

// ALert
alert('Icon generation ongoing - please wait ...')

// Define background color
const bg = [255, 255, 255, 255] // hex2rgb('#ffffff').rgb.concat(255)

// Define icons (name, width, height, background)
const icons = [
  ['app-store-icon', 1024, 1024, true],
  ['play-store-icon', 512, 512],
  ['apple-touch-icon', 180, 180, true],
  ['favicon', 16, 16],
  ['favicon', 32, 32],
  ['ico', 16, 16],
  ['ico', 32, 32],
  ['ico', 48, 48],
  ['android-chrome', 192, 192],
  ['android-chrome', 512, 512],
  ['mstile', 150, 150],
  ['ios-icon', 1024, 1024, true],
  ['ios-icon', 258, 258, true],
  ['ios-icon', 196, 196, true],
  ['ios-icon', 180, 180, true],
  ['ios-icon', 167, 167, true],
  ['ios-icon', 172, 172, true],
  ['ios-icon', 152, 152, true],
  ['ios-icon', 144, 144, true],
  ['ios-icon', 120, 120, true],
  ['ios-icon', 114, 114, true],
  ['ios-icon', 100, 100, true],
  ['ios-icon', 88, 88, true],
  ['ios-icon', 87, 87, true],
  ['ios-icon', 80, 80, true],
  ['ios-icon', 76, 76, true],
  ['ios-icon', 72, 72, true],
  ['ios-icon', 60, 60, true],
  ['ios-icon', 58, 58, true],
  ['ios-icon', 57, 57, true],
  ['ios-icon', 55, 55, true],
  ['ios-icon', 50, 50, true],
  ['ios-icon', 48, 48, true],
  ['ios-icon', 40, 40, true],
  ['ios-icon', 29, 29, true],
  ['ios-icon', 20, 20, true],
  ['ios-splash', 2048, 2732, true],
  ['ios-splash', 1536, 2048, true],
  ['ios-splash', 1436, 2048, true],
  ['ios-splash', 1242, 2208, true],
  ['ios-splash', 1080, 1920, true],
  ['ios-splash', 768, 1024, true],
  ['ios-splash', 750, 1334, true],
  ['ios-splash', 640, 1136, true],
  ['ios-splash', 640, 960, true],
  ['ios-splash', 320, 480, true],
  ['android-icon-ldpi', 36, 36],
  ['android-icon-mdpi', 48, 48],
  ['android-icon-hdpi', 72, 72],
  ['android-icon-xhdpi', 96, 96],
  ['android-icon-xxhdpi', 144, 144],
  ['android-icon-xxxhdpi', 192, 192],
  ['android-splash-xhdpi', 720, 1280, true],
  ['android-splash-hdpi', 480, 800, true],
  ['android-splash-mdpi', 320, 480, true],
  ['android-splash-ldpi', 200, 320, true]
]

// Add landscape launch screens
const iconNo = icons.length
for (let i = 0; i < iconNo; i++) {
  icons.push([icons[i][0], icons[i][2], icons[i][1], icons[i][3]])
}

// Set dev as default version
if (env.arg.version === undefined) {
  env.arg.version = 'dev'
}

// Get version parameter
if (/^(([0-9]+)\.([0-9]+)\.([0-9]+)|dev)$/.test(env.arg.version) === false) {
  alert('Given argument --version must be "x.y.z" or "dev".', 'issue')
}

// Remove dev folder
if (env.arg.version === 'dev') {
  fs.removeSync(abs(env.cache, 'icons/dev'))
}

// Icons for version already cached
const versionFolder = abs(env.cache, 'icons', env.arg.version)
if (found(versionFolder)) {
  alert('Icon generation done.', 'exit')
}

// Function to get icon file name
const getIconFilename = function (callback) {
  if ((env.arg.version === 'dev' || env.arg.version === env.pkg.version) && found(env.app, 'icon.png')) {
    callback(abs(env.app, 'icon.png'))
  } else {
    // Ensure version snapshot cache
    cmd(__dirname, 'node cache-snapshot --name "build-' + env.arg.version + '"', function () {
      const iconFile = '../src/icon.png'
      if (found(iconFile)) {
        callback(iconFile)
      } else {
        alert('Icon file not found for version "' + env.arg.version + '".', 'error')
      }
    })
  }
}

// Function to read icon to jimp object
const readIconFile = function (filename, callback) {
  new img(filename, function (err, icon) { // eslint-disable-line
    if (err) {
      alert('Failed to read icon file "' + filename + '"', 'error')
    } else {
      callback(icon)
    }
  })
}

// Function to calculate icon dimensions
const getIconsToCreate = function (icon, callback) {
  const iconsToCreate = []
  // Loop icons
  for (let i = 0; i < icons.length; i++) {
    // Define attributes
    const width = icons[i][1]
    const height = icons[i][2]
    const name = icons[i][0] + '-' + width + 'x' + height + (icons[i][0] === 'app-store-icon' ? '.jpg' : '.png')
    const isFilled = icons[i][3] !== undefined
    // Calculate icon size
    const maxIconWidth = width === height ? width : width / 2
    const maxIconHeight = width === height ? height : height / 2
    const factor = Math.min(maxIconWidth / icon.bitmap.width, maxIconHeight / icon.bitmap.height)
    const iconWidth = Math.floor(factor * icon.bitmap.width)
    const iconHeight = Math.floor(factor * icon.bitmap.height)
    // Calculate icon position
    const left = Math.floor((width - iconWidth) / 2)
    const top = Math.floor((height - iconHeight) / 2)
    // Define icon to create
    iconsToCreate.push({
      name: name,
      canvasWidth: width,
      canvasHeight: height,
      iconWidth: iconWidth,
      iconHeight: iconHeight,
      iconPosLeft: left,
      iconPosTop: top,
      isFilled: isFilled,
      resizeFactor: factor
    })
  }
  // Callback with icons to create
  callback(iconsToCreate)
}

// Create transparent icons
const createTransparentIcons = function (icon, iconList, hashFolder, callback) {
  alert('Transparent icon generation ongoing - please wait ...')
  if (!Array.isArray(iconList) || iconList.length === 0) {
    alert('Transparent icon generation done.')
    callback()
  } else {
    const thisIcon = iconList.pop()
    // Resize icon
    icon.resize(thisIcon.iconWidth, thisIcon.iconHeight, function (err, icon) {
      if (err) {
        alert('Failed to resize icon "' + thisIcon.name + '".', 'issue')
      } else {
        icon.write(abs(hashFolder, thisIcon.name), function (err) {
          if (err) {
            alert('Failed to save icon "' + thisIcon.name + '".', 'issue')
          } else {
            createTransparentIcons(icon, iconList, hashFolder, callback)
          }
        })
      }
    })
  }
}

// Create filled icons
const createFilledIcons = function (icon, iconList, hashFolder, callback) {
  alert('Filled icon generation ongoing - please wait ...')
  if (!Array.isArray(iconList) || iconList.length === 0) {
    alert('Filled icon generation done.')
    callback()
  } else {
    const thisIcon = iconList.pop()
    // Create canvas
    new img(thisIcon.canvasWidth, thisIcon.canvasHeight, img.rgbaToInt.apply(null, bg), function (err, canvas) { // eslint-disable-line
      if (err) {
        alert('Failed to create canvas for icon "' + thisIcon.name + '".', 'issue')
      } else {
        // Resize icon
        icon.resize(thisIcon.iconWidth, thisIcon.iconHeight, function (err, icon) {
          if (err) {
            alert('Failed to resize icon "' + thisIcon.name + '".', 'issue')
          } else {
            // Coyp icon to canvas
            canvas.composite(icon, thisIcon.iconPosLeft, thisIcon.iconPosTop, function (err, canvas) {
              if (err) {
                alert('Failed to merge icon "' + thisIcon.name + '" with canvas.', 'issue')
              } else {
                canvas.write(abs(hashFolder, thisIcon.name), function (err) {
                  if (err) {
                    alert('Failed to save icon "' + thisIcon.name + '".', 'issue')
                  } else {
                    createFilledIcons(icon, iconList, hashFolder, callback)
                  }
                })
              }
            })
          }
        })
      }
    })
  }
}

// Create special icons
const createIcoFile = function (hashFolder, callback) {
  alert('Favicon.ico creation ongoing - please wait ...')
  // Load files
  const files = []
  icons.map(icon => {
    if (icon[0] === 'ico') {
      const path = abs(hashFolder, 'ico-' + icon[1] + 'x' + icon[2] + '.png')
      if (!found(path)) {
        alert('Cannot find ico-' + icon[1] + 'x' + icon[2] + '.png in hash cache folder.', 'issue')
      } else {
        files.push(fs.readFileSync(path))
      }
    }
  })
  toIco(files).then(function (buf) {
    fs.writeFile(abs(hashFolder, 'favicon.ico'), buf, function (err) {
      if (err || !found(hashFolder, 'favicon.ico')) {
        alert('Failed to save favicon.ico to hash cache folder.', 'issue')
      } else {
        alert('Favicon.ico creation done.')
        callback()
      }
    })
  }).catch(function () {
    alert('Failed to generate favicon.ico file.', 'issue')
  })
}

// Downsize ms tile icons, keep transparency
const downsizeTileIcons = function (hashFolder, iconList, callback) {
  alert('Downsizing tile icons - Please wait ...')
  if (!Array.isArray(iconList) || iconList.length === 0) {
    alert('Downsized tile icons.')
    callback()
  } else {
    const iconFile = iconList.shift().name
    if (/^mstile/.test(iconFile) === true) {
      new img(abs(hashFolder, iconFile), function (err, icon) { // eslint-disable-line
        if (!err) {
          new img(icon.bitmap.width, icon.bitmap.height, function (err, canvas) { // eslint-disable-line
            if (!err) {
              const newWidth = Math.floor(icon.bitmap.width * 0.75)
              const newHeight = Math.floor(icon.bitmap.height * 0.75)
              icon.resize(newWidth, newHeight, function (err, icon) {
                if (!err) {
                  const left = Math.floor((canvas.bitmap.width - newWidth) / 2)
                  const top = Math.floor((canvas.bitmap.height - newHeight) / 2)
                  canvas.composite(icon, left, top, function (err, canvas) {
                    if (!err) {
                      canvas.write(abs(hashFolder, iconFile), function (err) {
                        if (!err) {
                          downsizeTileIcons(hashFolder, iconList, callback)
                        } else {
                          alert('Failed to save tile icon.', 'issue')
                        }
                      })
                    } else {
                      alert('Failed to create tile icon.', 'issue')
                    }
                  })
                } else {
                  alert('Failed to downsize tile icon.', 'issue')
                }
              })
            } else {
              alert('Failed to create tile icon canvas.', 'issue')
            }
          })
        } else {
          alert('Failed to read tile icon.', 'issue')
        }
      })
    } else {
      downsizeTileIcons(hashFolder, iconList, callback)
    }
  }
}

// Cache hash folder
const cacheHashFolder = function (hashFolder, callback) {
  // Copy icons to version cache folder
  fs.copy(hashFolder, versionFolder, function (err) {
    if (err) {
      alert('Failed to cache icons.', 'error')
    } else {
      callback()
    }
  })
}

// Run
alert('Icon generation ongoing - please wait ...')
getIconFilename(function (filename) {
  readIconFile(filename, function (icon) {
    // Icon with same hash already cached
    const hashFolder = abs(env.cache, 'icons', icon.hash() + '-' + '#ffffff'.substr(1).toLowerCase())
    if (found(hashFolder)) {
      cacheHashFolder(hashFolder, function () {
        alert('Icon generation done.', 'exit')
      })
    } else {
      // Generate icons
      getIconsToCreate(icon, function (iconsToCreate) {
        // Group by filled / not filled
        const filled = _.sortBy(_.filter(iconsToCreate, function (i) { return i.isFilled === true }), 'resizeFactor')
        const transparent = _.sortBy(_.filter(iconsToCreate, function (i) { return i.isFilled === false }), 'resizeFactor')
        // Clone icon for filled one
        const iconFilled = icon.clone()
        // Create hash folder
        fs.ensureDirSync(hashFolder)
        // Create icons
        createTransparentIcons(icon, transparent, hashFolder, function () {
          createFilledIcons(iconFilled, filled, hashFolder, function () {
            downsizeTileIcons(hashFolder, iconsToCreate, function () {
              createIcoFile(hashFolder, function () {
                cacheHashFolder(hashFolder, function () {
                  alert('Icon generation done.', 'exit')
                })
              })
            })
          })
        })
      })
    }
  })
})
