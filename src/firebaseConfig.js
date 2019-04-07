// import firebase from 'firebase/app'
// import 'firebase/database'
// import 'firebase/storage'
// import { Firechat } from './firechat.js'

const firebase = require('firebase')
require('firebase/database')
require('firebase/storage')
const Firechat = require('./firechat')

// firebase init goes here

const dbConfig = {
  apiKey: 'AIzaSyDAE4x2uKFo46nBgZOxSsIFqcYVIqArM0Q',
  authDomain: 'wohapp-3a179.firebaseapp.com',
  databaseURL: 'https://wohapp-3a179.firebaseio.com',
  projectId: 'wohapp-3a179',
  storageBucket: 'wohapp-3a179.appspot.com',
  messagingSenderId: '553446471400',
  allowEmailLogin: true,
  allowEmailRegistration: true
}
// firebase app for dev & product
window.firebase = firebase.initializeApp(dbConfig)
// firebase app for nodeunit test
// firebase.initializeApp(dbConfig)

// firebase utils
const auth = firebase.auth()
const database = firebase.database()
const storage = firebase.storage()
const timestamp = firebase.database.ServerValue.TIMESTAMP
// firechat
const chat = new Firechat.Firechat(database.ref(), null)

module.exports = {
  dbConfig,
  database,
  storage,
  auth,
  timestamp,
  chat
}
