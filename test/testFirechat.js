const auth = require('../src/firebaseConfig').auth
const database = require('../src/firebaseConfig').database
const chat = require('../src/firebaseConfig').chat

// import * as fb from '../src/firebaseConfig.js'

/* exports['createUser1'] = function(test) {
  auth.createUserWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    const user_ = auth.currentUser
    // create user obj
    const ref = database.ref().child('users').child(user_.uid)
    const obj = {
      id: user_.uid,
      login_name: user_.email,
      name: 'test1',
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
    }
    ref.set(obj) // or however you wish to update the node
    test.done()
  })
}

exports['createUser2'] = function(test) {
  auth.createUserWithEmailAndPassword('test2@gmail.com', '12345qwert').then(user => {
    const user_ = auth.currentUser
    // create user obj
    const ref = database.ref('users/' + user_.uid)
    console.log(ref.toJSON())
    const obj = {
      id: ref.key,
      login_name: user_.email,
      name: 'test2',
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
    }
    console.log(obj)
    ref.set(obj, function(error) {
      if (!error) {
        test.done()
      }
    })
  })
}

exports['userLogin'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    const user_ = auth.currentUser
    // create user obj
    const ref = database.ref('users/' + user_.uid)
    console.log(ref.toJSON())
    const obj = {
      id: ref.key,
      login_name: user_.email,
      name: 'test1',
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
    }
    console.log(obj)
    ref.set(obj, function(error) {
      if (!error) {
        test.done()
      }
    })
  })
}

exports['setUser'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          console.log('chat._userId=' + user.uid)
          console.log('chat._userName=' + snapshot.child('name').val())
          test.equal(chat._userId, user.uid)
          test.equal(chat._userName, 'test1')
          test.done()
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['createPost'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.createPost('test content', 'https://wohapp-3a179.firebaseapp.com/', postkey => {
            database.ref().child('posts').child('data').child(postkey).once('value', function(snapshot2) {
              console.log('snapshot2.text=' + snapshot2.child('text').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('text').val(), 'test content')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              test.done()
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}
*/

exports['getPostList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                console.log('post.id=' + posts[post].id)
                console.log('post.text=' + posts[post].text)
                test.equal(posts[post].text, 'test content')
                test.equal(posts[post].original_pic, 'https://wohapp-3a179.firebaseapp.com/')
                test.done()
                break
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

/*
exports['addComment'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.addComment(post.id, 'test commment', commentkey => {
          database.ref().child('posts').child(post.id).child('comments').once('value', function(snapshot2) {
            const comment = snapshot2[0]
            console.log('comment.text=' + comment.text)
            console.log('comment.name=' + comment.name)
            test.equal(comment.text, 'test content')
            test.equal(comment.name, snapshot.nick_name)
          })
        })
      })
    })
  })
  test.done()
}

exports['likePost'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.likePost(post.id, commentkey => {
          database.ref().child('posts').child(post.id).child('likes').once('value', function(snapshot2) {
            const like = snapshot2[0]
            console.log('like.postid=' + like.postid)
            console.log('like.name=' + like.name)
            test.equal(like.postid, post.id)
            test.equal(like.name, snapshot.nick_name)
          })
        })
      })
    })
  })
  test.done()
}

exports['getPostComments'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.getPostComments(post.id, comments => {
          const comment = comments[0]
          console.log('comment.text=' + comment.text)
          console.log('comment.name=' + comment.name)
          test.equal(comment.text, 'test content')
          test.equal(comment.name, snapshot.nick_name)
        })
      })
    })
  })
  test.done()
}

exports['getPostLikes'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.getPostLikes(post.id, likes => {
          const like = likes[0]
          console.log('like.name=' + like.name)
          test.equal(like.name, snapshot.nick_name)
        })
      })
    })
  })
  test.done()
}

exports['removePostComment'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.getPostComments(post.id, comments => {
          const comment = comments[0]
          chat.removePostComment(post.id, comment.id)
          chat.getPostLikes(post.id, comments2 => {
            console.log('comments2.count=' + comments2.count)
            test.equal(comments2.count, 0)
          })
        })
      })
    })
  })
  test.done()
}

exports['unlikePost'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.getPostLikes(post.id, likes => {
          const like = likes[0]
          chat.unlikePost(post.id, like.id)
          chat.getPostLikes(post.id, likes2 => {
            console.log('likes2.count=' + likes2.count)
            test.equal(likes2.count, 0)
          })
        })
      })
    })
  })
  test.done()
}

exports['removePost'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getPostList(posts => {
        const post = posts[0]
        chat.removePost(post.id)
        chat.getPostList(posts2 => {
          console.log('posts2.count=' + posts2.count)
          test.equal(posts2.count, 0)
        })
      })
    })
  })
  test.done()
}

exports['addContact'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.addContact('1', 'Alex Black', 'A', 'London', contactkey => {
        database.ref().child('contacts').child(contactkey).once('value', function(snapshot2) {
          console.log('snapshot2.nickname=' + snapshot2.nickname)
          console.log('snapshot2.location=' + snapshot2.location)
          console.log('snapshot2.avatar=' + snapshot2.avatar)
          console.log('snapshot2.header=' + snapshot2.header)
          test.equal(snapshot2.nickname, 'Alex Black')
          test.equal(snapshot2.location, 'London')
          test.equal(snapshot2.avatar, '1')
          test.equal(snapshot2.header, 'A')
        })
      })
    })
  })
}

exports['getContactList'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getContactList(contacts => {
        const contact = contacts[0]
        database.ref().child('contacts').child(contact.id).once('value', function(snapshot2) {
          console.log('snapshot2.nickname=' + snapshot2.nickname)
          console.log('snapshot2.location=' + snapshot2.location)
          console.log('snapshot2.avatar=' + snapshot2.avatar)
          console.log('snapshot2.header=' + snapshot2.header)
          test.equal(snapshot2.nickname, 'Alex Black')
          test.equal(snapshot2.location, 'London')
          test.equal(snapshot2.avatar, '1')
          test.equal(snapshot2.header, 'A')
        })
      })
    })
  })
  test.done()
}

exports['removeContact'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.getContactList(contacts => {
        const contact = contacts[0]
        chat.removeContact(contact.id)
        chat.getContactList(contacts2 => {
          console.log('contacts2.count=' + contacts2.count)
          test.equal(contacts2.count, 0)
        })
      })
    })
  })
  test.done()
}

exports['resumeSession'] = function(test) {
  test.done()
}
exports['on'] = function(test) {
  test.done()
}

exports['createRoom'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      chat.createRoom('room1', 'private', roomkey => {
        database.ref().child('room-metadata').child(roomkey).once('value', function(snapshot2) {
          console.log('snapshot2.name=' + snapshot2.name)
          console.log('snapshot2.createdByUserId=' + snapshot2.createdByUserId)
          test.equal(snapshot2.name, 'room1')
          test.equal(snapshot2.createdByUserId, user.uid)
        })
      })
    })
  })
  test.done()
}

exports['leaveRoom'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      database.ref().child('room-metadata').once('value', function(snapshot2) {
        const room = snapshot2[0]
        chat.leaveRoom(room.id)
        database.ref().child('users').child('rooms').child(room.id).once('value', function(snapshot3) {
          console.log('snapshot3.name=' + snapshot3.name)
          console.log('snapshot3.active=' + snapshot3.active)
          test.equal(snapshot3.name, 'room1')
          test.equal(snapshot3.name, true)
        })
        database.ref().child('users').child(user.uid).child('sessions').once('value', function(snapshot3) {
          const sessionId = snapshot3.key
          database.ref().child('room-users').child(room.id).child(user.uid).child(sessionId).once('value', function(snapshot4) {
            console.log('snapshot4.id=' + snapshot4.id)
            console.log('snapshot4.name=' + snapshot4.name)
            test.equal(snapshot4.id, user.uid)
            test.equal(snapshot4.name, snapshot.nick_name)
          })
        })
      })
    })
  })
  test.done()
}

exports['leaveRoom'] = function(test) {
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert').then(user => {
    database.ref().child('users').child(user.uid).once('value', function(snapshot) {
      chat.setUser(user.uid, snapshot.nick_name)
      database.ref().child('room-metadata').once('value', function(snapshot2) {
        const room = snapshot2[0]
        chat.leaveRoom(room.id)
        database.ref().child('users').child('rooms').child(room.id).once('value', function(snapshot3) {
          console.log('snapshot3.name=' + snapshot3.name)
          console.log('snapshot3.active=' + snapshot3.active)
          test.equal(snapshot3.name, 'room1')
          test.equal(snapshot3.name, false)
        })
        database.ref().child('users').child(user.uid).child('sessions').once('value', function(snapshot3) {
          const sessionId = snapshot3.key
          database.ref().child('room-users').child(room.id).child(user.uid).child(sessionId).once('value', function(snapshot4) {
            test.equal(snapshot4, null)
          })
        })
      })
    })
  })
  test.done()
}

exports['sendMessage'] = function(test) {
  test.done()
}
exports['toggleUserMute'] = function(test) {
  test.done()
}
exports['inviteUser'] = function(test) {
  test.done()
}
exports['acceptInvite'] = function(test) {
  test.done()
}
exports['declineInvite'] = function(test) {
  test.done()
}
exports['getRoomList'] = function(test) {
  test.done()
}
exports['getUsersByPrefix'] = function(test) {
  test.done()
}
exports['getUsersByRoom'] = function(test) {
  test.done()
}
exports['userLogout'] = function(test) {
  test.done()
}
*/
