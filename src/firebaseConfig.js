import firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/database'
import { Firechat } from 'firechat/dist/firechat.js'

// firebase init goes here

const config = {
  apiKey: 'AIzaSyDAE4x2uKFo46nBgZOxSsIFqcYVIqArM0Q',
  authDomain: 'wohapp-3a179.firebaseapp.com',
  databaseURL: 'https://wohapp-3a179.firebaseio.com',
  projectId: 'wohapp-3a179',
  storageBucket: 'wohapp-3a179.appspot.com',
  messagingSenderId: '553446471400'
}
firebase.initializeApp(config)

// firebase utils
const firestore = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser
const database = firebase.database().ref()
// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
firestore.settings(settings)

// firebase collections
const usersCollection = firestore.collection('users')
const postsCollection = firestore.collection('posts')
const commentsCollection = firestore.collection('comments')
const likesCollection = firestore.collection('likes')

const chat = new Firechat(database, null)

export {
  firestore,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection,
  chat
}
