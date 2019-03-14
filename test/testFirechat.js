import * as fb from '../src/firebaseConfig.js'

fb.auth.createUserWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
  // create user obj
  fb.database.child('users').push({
    login_name: 'test1@gmail.com',
    nick_name: 'test1',
    points: 0,
    avatar_url: '',
    gender: '',
    location: '',
    invites: [],
    muted: [],
    rooms: []
  })
})

fb.auth.onAuthStateChanged(user => {
  if (user) {
    fb.database.child('users').orderByChild('login_name').equalTo(user.uid).once('value', function(snapshot){
      fb.chat.setUser(snapshot.key, snapshot.val().nick_name, null)
    })        
  }
})

fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')

exports['createPost'] = function(test) {  
  const posts = fb.chat.createPost()
  test.equal(posts.count, 0)
  test.done()
}

exports['getPostList'] = function(test) {  
  const posts = fb.chat.getPostList()
  test.equal(posts.count, 0)
  test.done()
}
