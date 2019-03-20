import firebase from 'firebase'
import 'firebase/database'
import 'firebase/storage'

import { Firechat } from './firechat.js'

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
// firebase app
window.firebase = firebase.initializeApp(dbConfig)

// firebase utils
const auth = firebase.auth()
const database = firebase.database()
const storage = firebase.storage()

// firechat
const chat = new Firechat(database.ref(), null)

export {
  dbConfig,
  database,
  storage,
  auth,
  chat
}
