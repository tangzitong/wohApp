import firebase from 'firebase'
import 'firebase/firestore'
// import Firechat from 'firechat/dist/firechat.js'

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
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true
}
db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const postsCollection = db.collection('posts')
const commentsCollection = db.collection('comments')
const likesCollection = db.collection('likes')

// const chat = new Firechat(db, null)

export {
  db,
  auth,
  currentUser,
  usersCollection,
  postsCollection,
  commentsCollection,
  likesCollection
}
