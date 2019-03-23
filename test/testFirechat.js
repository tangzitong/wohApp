const fb = require('../src/firebaseConfig.js')

exports['createUser'] = function(test) {
  fb.auth.createUserWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    // create user obj
    fb.database.child('users').child(user.uid).set({
      login_name: 'test1@gmail.com',
      nick_name: 'test1',
      points: 0,
      avatar_url: '',
      gender: '',
      location: '',
      invites: [],
      muted: [],
      rooms: [],
      contacts: [],
      posts: [],
      photo: ''
    })
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      console.log('user.uid=' + snapshot.key)
      console.log('user.login_name=' + snapshot.login_name)
      console.log('user.nick_name=' + snapshot.nick_name)
      test.equal(snapshot.login_name, 'test1@gmail.com')
      test.equal(snapshot.nick_name, 'test1')
      test.done()
    })
  })
}

exports['setUser'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      console.log('fb._userId=' + fb._userId)
      console.log('fb._userName=' + fb._userName)
      test.equal(fb._userId, 'test1@gmail.com')
      test.equal(fb._userName, 'test1')
      test.done()
    })
  })
}
exports['resumeSession'] = function(test) {
}
exports['on'] = function(test) {
}
exports['createRoom'] = function(test) {
}
exports['enterRoom'] = function(test) {
}
exports['leaveRoom'] = function(test) {
}
exports['sendMessage'] = function(test) {
}
exports['toggleUserMute'] = function(test) {
}
exports['inviteUser'] = function(test) {
}
exports['acceptInvite'] = function(test) {
}
exports['declineInvite'] = function(test) {
}
exports['getRoomList'] = function(test) {
}
exports['getUsersByPrefix'] = function(test) {
}
exports['getUsersByRoom'] = function(test) {
}

exports['createPost'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.createPost('test content', 'https://wohapp-3a179.firebaseapp.com/', postkey => {
        fb.database.child('posts').child(postkey).once('value', function(snapshot2) {
          console.log('snapshot2.text=' + snapshot2.text)
          console.log('snapshot2.name=' + snapshot2.name)
          test.equal(snapshot2.text, 'test content')
          test.equal(snapshot2.name, snapshot.nick_name)
          test.done()
        })
      })
    })
  })
}

exports['addComment'] = function(test) {
}
exports['likePost'] = function(test) {
}
exports['getPostList'] = function(test) {
}
exports['removePost'] = function(test) {
}
exports['getPostComments'] = function(test) {
}
exports['removePostComment'] = function(test) {
}
exports['getPostLikes'] = function(test) {
}
exports['addContact'] = function(test) {
}
exports['removeContact'] = function(test) {
}
exports['getContactList'] = function(test) {
}
exports['userLogout'] = function(test) {
}
