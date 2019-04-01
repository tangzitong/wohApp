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
      contact_count: 0,
      posts: [],
      post_count: 0,
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
      contact_count: 0,
      posts: [],
      post_count: 0,
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
      contact_count: 0,
      posts: [],
      post_count: 0,
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

exports['addComment'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            // console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                chat.addComment(posts[post].id, 'test commment', commentkey => {
                  console.log('commentkey=' + commentkey)
                  database.ref().child('posts').child('data').child(posts[post].id).child('comments').child(commentkey).once('value', function(comments) {
                    console.log(comments.val())
                    console.log('text=' + comments.child('text').val())
                    console.log('name=' + comments.child('name').val())
                    test.equal(comments.child('text').val(), 'test commment')
                    test.equal(comments.child('name').val(), snapshot.child('name').val())
                    test.done()
                  })
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['likePost'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            // console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                chat.likePost(posts[post].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('posts').child('data').child(posts[post].id).child('likes').child(likekey).once('value', function(likes) {
                    console.log(likes.val())
                    console.log('name=' + likes.child('name').val())
                    test.equal(likes.child('name').val(), snapshot.child('name').val())
                    test.done()
                  })
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getPostComments'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            // console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                chat.getPostComments(posts[post].id, function(comments) {
                  console.log(comments)
                  for (const comment in comments) {
                    console.log(comments[comment].id)
                    console.log('text=' + comments[comment].text)
                    console.log('name=' + comments[comment].name)
                    test.equal(comments[comment].text, 'test commment')
                    test.equal(comments[comment].name, snapshot.child('name').val())
                    test.done()
                  }
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getPostLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            // console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                chat.getPostLikes(posts[post].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    console.log(likes[like].id)
                    console.log('name=' + likes[like].name)
                    test.equal(likes[like].name, snapshot.child('name').val())
                    test.done()
                  }
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['removePostComment'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            // console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                chat.getPostComments(posts[post].id, function(comments) {
                  console.log(comments)
                  for (const comment in comments) {
                    chat.removePostComment(posts[post].id, comments[comment].id, function() {
                      console.log(comments[comment].id)
                      console.log('text=' + comments[comment].text)
                      console.log('name=' + comments[comment].name)
                      test.done()
                    })
                  }
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['unlikePost'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getPostList(function(posts) {
            // console.log(posts)
            for (const post in posts) {
              if (posts[post].avatar === user.uid) {
                chat.getPostLikes(posts[post].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikePost(posts[post].id, likes[like].id, function() {
                      console.log(likes[like].id)
                      test.done()
                    })
                  }
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['removePost'] = function(test) {
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
                chat.removePost(posts[post].id, function() {
                  test.done()
                })
              }
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['addContact'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.addContact('1', 'Alex Black', 'A', 'London', contactkey => {
            database.ref().child('users').child(user.uid).child('contacts').child(contactkey).once('value', function(snapshot2) {
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              console.log('snapshot2.location=' + snapshot2.child('location').val())
              console.log('snapshot2.avatar=' + snapshot2.child('avatar').val())
              console.log('snapshot2.header=' + snapshot2.child('header').val())
              test.equal(snapshot2.child('nickname').val(), 'Alex Black')
              test.equal(snapshot2.child('location').val(), 'London')
              test.equal(snapshot2.child('avatar').val(), '1')
              test.equal(snapshot2.child('header').val(), 'A')
              test.done()
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getContactList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getContactList(function(contacts) {
            console.log(contacts)
            for (const contact in contacts) {
              console.log('contact.id=' + contacts[contact].id)
              console.log('contact.nickname=' + contacts[contact].nickname)
              test.equal(contacts[contact].nickname, 'Alex Black')
              test.equal(contacts[contact].header, 'A')
              test.done()
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['removeContact'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getContactList(function(contacts) {
            console.log(contacts)
            for (const contact in contacts) {
              chat.removeContact(contacts[contact].id, function() {
                test.done()
              })
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['resumeSession'] = function(test) {
  test.done()
}
exports['on'] = function(test) {
  test.done()
}

exports['createRoom'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.createRoom('room1', 'private', roomkey => {
            database.ref().child('room-metadata').child(roomkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.createdByUserId=' + snapshot2.child('createdByUserId').val())
              test.equal(snapshot2.child('name').val(), 'room1')
              test.equal(snapshot2.child('createdByUserId').val(), user.uid)
              test.done()
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['enterRoom'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('room-metadata').once('value', function(rooms) {
            console.log(rooms.val())
            for (const roomid in rooms.val()) {
              chat.enterRoom(roomid)
              database.ref().child('users').child(user.uid).child('rooms').child(roomid).once('value', function(snapshot3) {
                console.log('snapshot3.name=' + snapshot3.child('name').val())
                console.log('snapshot3.active=' + snapshot3.child('active').val())
                test.equal(snapshot3.child('name').val(), 'room1')
                test.equal(snapshot3.child('active').val(), true)
                test.done()
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['leaveRoom'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('room-metadata').once('value', function(rooms) {
            console.log(rooms.val())
            for (const roomid in rooms.val()) {
              chat.leaveRoom(roomid)
              database.ref().child('users').child(user.uid).child('rooms').child(roomid).once('value', function(snapshot3) {
                console.log('snapshot3.name=' + snapshot3.child('name').val())
                console.log('snapshot3.active=' + snapshot3.child('active').val())
                test.equal(snapshot3.child('name').val(), null)
                test.equal(snapshot3.child('active').val(), null)
                test.done()
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['sendMessage'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('room-metadata').once('value', function(rooms) {
            console.log(rooms.val())
            for (const roomid in rooms.val()) {
              chat.sendMessage(roomid, 'test message', 'messageType')
              database.ref().child('room-messages').child(roomid).once('value', function(messages) {
                console.log(messages.val())
                for (const messageid in messages.val()) {
                  database.ref().child('room-messages').child(roomid).child(messageid).once('value', function(snapshot2) {
                    console.log('snapshot2.message=' + snapshot2.child('message').val())
                    console.log('snapshot2.type=' + snapshot2.child('type').val())
                    test.equal(snapshot2.child('message').val(), 'test message')
                    test.equal(snapshot2.child('type').val(), 'messageType')
                    test.done()
                  })
                }
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['toggleUserMute'] = function(test) {
  test.done()
}

exports['inviteUser'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('room-metadata').once('value', function(rooms) {
            console.log(rooms.val())
            for (const roomid in rooms.val()) {
              const userid = 'Vn8NjeM3yCh7vsK6mwhEdk9d1h73'
              chat.inviteUser(userid, roomid)
              database.ref().child('users').child(userid).child('invites').once('value', function(invites) {
                console.log(invites.val())
                for (const inviteid in invites.val()) {
                  console.log('inviteid=' + inviteid)
                  database.ref().child('users').child(userid).child('invites').child(inviteid).once('value', function(snapshot2) {
                    console.log(snapshot2.val())
                    console.log('snapshot2.fromUserId=' + snapshot2.child('fromUserId').val())
                    console.log('snapshot2.fromUserName=' + snapshot2.child('fromUserName').val())
                    test.equal(snapshot2.child('fromUserId').val(), user.uid)
                    test.equal(snapshot2.child('fromUserName').val(), snapshot.child('name').val())
                    test.done()
                  })
                }
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['acceptInvite'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('users').child(user.uid).child('invites').once('value', function(invites) {
            console.log(invites.val())
            for (const inviteid in invites.val()) {
              console.log('inviteid=' + inviteid)
              chat.acceptInvite(inviteid, function() {
                database.ref().child('users').child(user.uid).child('invites').child(inviteid).once('value', function(snapshot2) {
                  console.log(snapshot2.val())
                  console.log('snapshot2.status=' + snapshot2.child('status').val())
                  console.log('snapshot2.toUserName=' + snapshot2.child('toUserName').val())
                  test.equal(snapshot2.child('status').val(), 'accepted')
                  test.equal(snapshot2.child('toUserName').val(), snapshot.child('name').val())
                  test.done()
                })
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test2@gmail.com', '12345qwert')
}

exports['declineInvite'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('users').child(user.uid).child('invites').once('value', function(invites) {
            console.log(invites.val())
            for (const inviteid in invites.val()) {
              console.log('inviteid=' + inviteid)
              chat.declineInvite(inviteid, function() {
                database.ref().child('users').child(user.uid).child('invites').child(inviteid).once('value', function(snapshot2) {
                  console.log(snapshot2.val())
                  console.log('snapshot2.status=' + snapshot2.child('status').val())
                  console.log('snapshot2.toUserName=' + snapshot2.child('toUserName').val())
                  test.equal(snapshot2.child('status').val(), 'declined')
                  test.equal(snapshot2.child('toUserName').val(), snapshot.child('name').val())
                  test.done()
                })
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test2@gmail.com', '12345qwert')
}
*/
exports['getRoomList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          database.ref().child('room-metadata').once('value', function(rooms) {
            console.log(rooms.val())
            for (const roomid in rooms.val()) {
              chat.getRoomList(function(rooms_) {
                for (const roomid_ in rooms_) {
                  test.equal(roomid, roomid_)
                  test.done()
                }
              })
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

/*
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
