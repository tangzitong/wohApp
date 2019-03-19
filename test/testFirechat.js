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
      contacts: []
    })
  }).then(
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      console.log('user.uid=' + snapshot.key)
      console.log('user.login_name=' + snapshot.login_name)
      console.log('user.nick_name=' + snapshot.nick_name)
      test.equal(snapshot.login_name, 'test1@gmail.com')
      test.equal(snapshot.nick_name, 'test1')
      test.done()
    })
  )
}

exports['userLogin'] = function(test) {
}

exports['setUser'] = function(test) {
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

