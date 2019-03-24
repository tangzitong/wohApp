const fb = require('../src/firebaseConfig.js')
// import * as fb from '../src/firebaseConfig.js'

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

exports['getPostList'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        console.log('post.id=' + post.id)
        console.log('post.text=' + post.text)
        test.equal(post.text, 'test content')
        test.equal(post.original_pic, 'https://wohapp-3a179.firebaseapp.com/')
        test.done()
      })
    })
  })
}

exports['addComment'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.addComment(post.id, 'test commment', commentkey => {
          fb.database.child('posts').child(post.id).child('comments').once('value', function(snapshot2) {
            const comment = snapshot2[0]
            console.log('comment.text=' + comment.text)
            console.log('comment.name=' + comment.name)
            test.equal(comment.text, 'test content')
            test.equal(comment.name, snapshot.nick_name)
            test.done()
          })
        })
      })
    })
  })
}

exports['likePost'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.likePost(post.id, commentkey => {
          fb.database.child('posts').child(post.id).child('likes').once('value', function(snapshot2) {
            const like = snapshot2[0]
            console.log('like.postid=' + like.postid)
            console.log('like.name=' + like.name)
            test.equal(like.postid, post.id)
            test.equal(like.name, snapshot.nick_name)
            test.done()
          })
        })
      })
    })
  })
}

exports['getPostComments'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.getPostComments(post.id, comments => {
          const comment = comments[0]
          console.log('comment.text=' + comment.text)
          console.log('comment.name=' + comment.name)
          test.equal(comment.text, 'test content')
          test.equal(comment.name, snapshot.nick_name)
          test.done()
        })
      })
    })
  })
}

exports['getPostLikes'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.getPostLikes(post.id, likes => {
          const like = likes[0]
          console.log('like.name=' + like.name)
          test.equal(like.name, snapshot.nick_name)
          test.done()
        })
      })
    })
  })
}

exports['removePostComment'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.getPostComments(post.id, comments => {
          const comment = comments[0]
          fb.removePostComment(post.id, comment.id)
          fb.getPostLikes(post.id, comments2 => {
            console.log('comments2.count=' + comments2.count)
            test.equal(comments2.count, 0)
            test.done()
          })
        })
      })
    })
  })
}

exports['unlikePost'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.getPostLikes(post.id, likes => {
          const like = likes[0]
          fb.unlikePost(post.id, like.id)
          fb.getPostLikes(post.id, likes2 => {
            console.log('likes2.count=' + likes2.count)
            test.equal(likes2.count, 0)
            test.done()
          })
        })
      })
    })
  })
}

exports['removePost'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getPostList(posts => {
        const post = posts[0]
        fb.removePost(post.id)
        fb.getPostList(posts2 => {
          console.log('posts2.count=' + posts2.count)
          test.equal(posts2.count, 0)
          test.done()
        })
      })
    })
  })
}

exports['addContact'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.addContact('1', 'Alex Black', 'A', 'London', contactkey => {
        fb.database.child('contacts').child(contactkey).once('value', function(snapshot2) {
          console.log('snapshot2.nickname=' + snapshot2.nickname)
          console.log('snapshot2.location=' + snapshot2.location)
          console.log('snapshot2.avatar=' + snapshot2.avatar)
          console.log('snapshot2.header=' + snapshot2.header)
          test.equal(snapshot2.nickname, 'Alex Black')
          test.equal(snapshot2.location, 'London')
          test.equal(snapshot2.avatar, '1')
          test.equal(snapshot2.header, 'A')
          test.done()
        })
      })
    })
  })
}

exports['getContactList'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getContactList(contacts => {
        const contact = contacts[0]
        fb.database.child('contacts').child(contact.id).once('value', function(snapshot2) {
          console.log('snapshot2.nickname=' + snapshot2.nickname)
          console.log('snapshot2.location=' + snapshot2.location)
          console.log('snapshot2.avatar=' + snapshot2.avatar)
          console.log('snapshot2.header=' + snapshot2.header)
          test.equal(snapshot2.nickname, 'Alex Black')
          test.equal(snapshot2.location, 'London')
          test.equal(snapshot2.avatar, '1')
          test.equal(snapshot2.header, 'A')
          test.done()
        })
      })
    })
  })
}

exports['removeContact'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.getContactList(contacts => {
        const contact = contacts[0]
        fb.removeContact(contact.id)
        fb.getContactList(contacts2 => {
          console.log('contacts2.count=' + contacts2.count)
          test.equal(contacts2.count, 0)
          test.done()
        })
      })
    })
  })
}

exports['resumeSession'] = function(test) {
}
exports['on'] = function(test) {
}

exports['createRoom'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.createRoom('room1', 'private', roomkey => {
        fb.database.child('room-metadata').child(roomkey).once('value', function(snapshot2) {
          console.log('snapshot2.name=' + snapshot2.name)
          console.log('snapshot2.createdByUserId=' + snapshot2.createdByUserId)
          test.equal(snapshot2.name, 'room1')
          test.equal(snapshot2.createdByUserId, user.uid)
          test.done()
        })
      })
    })
  })
}

exports['enterRoom'] = function(test) {
  fb.auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    fb.database.child('users').child(user.uid).once('value', function(snapshot) {
      fb.setUser(user.uid, snapshot.nick_name)
      fb.database.child('room-metadata').once('value', function(snapshot2) {
        const room = snapshot2[0]
        fb.enterRoom(room.id)
        fb.database.child('users').child('rooms').child(room.id).once('value', function(snapshot3) {
          console.log('snapshot3.name=' + snapshot3.name)
          console.log('snapshot3.active=' + snapshot3.active)
          test.equal(snapshot3.name, 'room1')
          test.equal(snapshot3.name, true)
          test.done()
        })
        fb.database.child('users').child(user.uid).child('sessions').once('value', function(snapshot3) {
          const sessionId = snapshot3.key
          fb.database.child('room-users').child(room.id).child(user.uid).child(sessionId).once('value', function(snapshot4) {
            console.log('snapshot4.id=' + snapshot4.id)
            console.log('snapshot4.name=' + snapshot4.name)
            test.equal(snapshot4.id, user.uid)
            test.equal(snapshot4.name, snapshot.nick_name)
            test.done()
          })
        })
      })
    })
  })
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
exports['userLogout'] = function(test) {
}
