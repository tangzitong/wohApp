/*

  Purpose: Deploy build folder to FTP server and update .htaccess file

*/

'use strict'

// Include modules
const env = require('./env')
const alert = require('./alert')
const cmd = require('./cmd')
const found = require('./found')
const fs = require('fs-extra')
const ftp = require('ftp')
const path = require('path')
const abs = require('path').resolve
const rec = require('recursive-readdir')

// Deploy current version by default
if (env.arg.version === undefined) {
  env.arg.version = env.pkg.version
}

// Steps
const getConfig = function (callback) {
  const configFile = abs(env.proj, 'ftp-config.json')
  if (found(configFile)) {
    fs.readJson(configFile, function (err, config) {
      if (err) {
        alert('Reading the "ftp-config.json" file failed.', 'issue')
      } else {
        if (config.host !== undefined && config.port !== undefined && config.user !== undefined && config.password !== undefined) {
          callback(config)
        } else {
          alert('File "ftp-config.json" must contain object with host, port, user and password properties.', 'error')
        }
      }
    })
  } else {
    const standardConfig = {
      host: '',
      port: '21',
      user: '',
      password: ''
    }
    fs.writeJson(configFile, standardConfig, function (err) {
      if (!err) {
        alert('Please update the "ftp-config.json" file with your FTP server data first.', 'exit')
      } else {
        alert('Creation of the "ftp-config.json" file failed.', 'issue')
      }
    })
  }
}
const connect = function (config, callback) {
  alert('Connecting to the FTP server - please wait ...')
  let client = new ftp() // eslint-disable-line
  client.on('ready', function () {
    callback(client)
  })
  client.on('error', () => {
    alert('Failed to connect to the FTP server.\nPlease check your "ftp-config.json" file.', 'error')
  })
  client.connect(config)
}
const uploadFiles = function (client, localFolder, remoteFolder, files, callback) {
  if (!Array.isArray(files) || files.length === 0) {
    callback()
  } else {
    const file = files.shift()
    const folder = path.join(remoteFolder, path.dirname(file))
    const parentFolder = path.dirname(folder)
    const putFile = function () {
      client.put(abs(localFolder, file), path.join(remoteFolder, file).replace(/\\/g, '/'), function (err) {
        if (err) alert('Failed to upload file "' + path.join(folder, file) + '" to the FTP server.', 'issue')
        uploadFiles(client, localFolder, remoteFolder, files, callback)
      })
    }
    client.list(parentFolder.replace(/\\/g, '/'), function (err, folders) {
      if (err) alert('Failed to list files from FTP server.', 'issue')
      let folderFound = false
      folders.map(function (f) {
        if (f === path.basename(folder)) {
          folderFound = true
        }
      })
      if (folderFound === true) {
        putFile()
      } else {
        client.mkdir(folder.replace(/\\/g, '/'), true, function (err) {
          if (err) alert('Failed to create folder "' + folder + '" on the FTP server.', 'issue')
          putFile()
        })
      }
    })
  }
}
const uploadBuildFolder = function (client, callback) {
  alert('Uploading build folder - please wait ...')
  const localFolder = abs(env.cache, 'snapshots', 'build-' + env.arg.version, 'build/www')
  const remoteFolder = 'build-' + env.arg.version
  if (!found(localFolder)) {
    alert('Local folder not found.', 'issue')
  }
  client.list(function (err, list) {
    if (!err) {
      let remoteFolderFound = false
      list.map(function (item) {
        if (item.name === remoteFolder && item.type === 'd') {
          remoteFolderFound = true
        }
      })
      if (remoteFolderFound === true && env.arg.version !== 'dev') {
        alert('Build folder already uploaded.')
        callback()
      } else {
        rec(localFolder, function (err, files) {
          if (err) alert('Failed to read local folder files.', 'issue')
          files.map(function (item, index) {
            files[index] = item.substr(localFolder.length + 1)
          })
          uploadFiles(client, localFolder, remoteFolder, files, function () {
            alert('Build folder upload done.')
            callback()
          })
        })
      }
    } else {
      alert('Failed to list FTP server content.', 'issue')
    }
  })
}
const updateHtaccess = function (client, callback) {
  alert('Updating .htaccess file - please wait ...')
  const cacheDir = abs(env.cache, 'ftp')
  const htaccess = 'RewriteEngine On\n' +
                 'RewriteCond %{REQUEST_URI} !^/build-' + env.arg.version + '/\n' +
                 'RewriteRule ^(.*)$ /build-' + env.arg.version + '/$1 [L]\n' +
                 'RewriteCond %{REQUEST_FILENAME} !-f\n' +
                 'RewriteCond %{REQUEST_FILENAME} !-d\n' +
                 'RewriteRule ^build-([0-9.]+)/(.*)?$ /#/$2 [R,L,NE]\n'
  fs.ensureDir(cacheDir, function (err) {
    if (!err) {
      fs.writeFile(abs(cacheDir, '.htaccess'), htaccess, function (err) {
        if (!err) {
          client.put(abs(cacheDir, '.htaccess'), '.htaccess', function (err) {
            if (!err) {
              callback()
            } else {
              alert('Failed to update .htaccess file on FTP server.', 'issue')
            }
          })
        } else {
          alert('Failed to cache .htaccess file.', 'issue')
        }
      })
    } else {
      alert('Failed to create cache folder.', 'issue')
    }
  })
}

// Run
alert('FTP deployment ongoing - please wait ...')
getConfig(function (config) {
  cmd(__dirname, 'node cache-version --version ' + env.arg.version, function () {
    connect(config, function (client) {
      uploadBuildFolder(client, function () {
        updateHtaccess(client, function () {
          client.end()
          alert('FTP deployment done for version ' + env.arg.version + '.')
        })
      })
    })
  })
})
