import firebase from 'firebase'
import 'firebase/database'
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
firebase.initializeApp(dbConfig)

// firebase utils
const auth = firebase.auth()
const currentUser = auth.currentUser
const database = firebase.database().ref()

// firechat
const chat = new Firechat(database, null)

auth.onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    chat.setUser(user.uid, user.displayName)
    // ...
  } else {
    // User is signed out.
    // ...
  }
})

export {
  dbConfig,
  database,
  auth,
  currentUser,
  chat
}
