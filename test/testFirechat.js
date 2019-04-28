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
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        // console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.on('message-add', function(roomid, message) {
            console.log('roomid=' + roomid)
            console.log(message)
            test.done()
          })
          database.ref().child('room-metadata').once('value', function(rooms) {
            console.log(rooms.val())
            for (const roomid in rooms.val()) {
              chat.enterRoom(roomid)
              chat.sendMessage(roomid, 'test message', 'messageType')
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['createRoom'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.createRoom('test2', 'private', 'Vn8NjeM3yCh7vsK6mwhEdk9d1h73', 'A', 'Tokyo', roomkey => {
            database.ref().child('room-metadata').child(roomkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.createdByUserId=' + snapshot2.child('createdByUserId').val())
              test.equal(snapshot2.child('name').val(), 'test2')
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
                test.equal(snapshot3.child('name').val(), 'test2')
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

exports['getRoomMessages'] = function(test) {
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
              chat.getRoomMessages(roomid, function(messages) {
                console.log(messages)
                for (const messageid in messages) {
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
exports['getRoomList1'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getRoomList(function(rooms_) {
            console.log(rooms_)
            for (const roomid_ in rooms_) {
              test.equal(rooms_[roomid_].name, 'test2')
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

exports['getRoomList2'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getRoomList(function(rooms_) {
            console.log(rooms_)
            for (const roomid_ in rooms_) {
              test.equal(rooms_[roomid_].createdByUserName, 'test1')
              test.done()
              break
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test2@gmail.com', '12345qwert')
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

exports['createJob'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test job',
            jobtype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createJob(data, jobkey => {
            database.ref().child('jobs').child('data').child(jobkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test job')
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

exports['getJobList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                console.log('job.id=' + jobs[job].id)
                console.log('job.name=' + jobs[job].name)
                test.equal(jobs[job].name, 'test job')
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

exports['addJobApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            // console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.addJobApplication(jobs[job].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('jobs').child('data').child(jobs[job].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeJob'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            // console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.likeJob(jobs[job].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('jobs').child('data').child(jobs[job].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getJobApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            // console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.getJobApplications(jobs[job].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getJobLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            // console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.getJobLikes(jobs[job].id, function(likes) {
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

exports['removeJobApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            // console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.getJobApplications(jobs[job].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeJobApplication(jobs[job].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeJob'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            // console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.getJobLikes(jobs[job].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeJob(jobs[job].id, likes[like].id, function() {
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

exports['removeJob'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobList(function(jobs) {
            console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                chat.removeJob(jobs[job].id, function() {
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

exports['createCompany'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test company',
            companytype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createCompany(data, companykey => {
            database.ref().child('companys').child('data').child(companykey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test company')
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

exports['getCompanyList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                console.log('company.id=' + companys[company].id)
                console.log('company.name=' + companys[company].name)
                test.equal(companys[company].name, 'test company')
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

exports['addCompanyApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            // console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.addCompanyApplication(companys[company].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('companys').child('data').child(companys[company].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeCompany'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            // console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.likeCompany(companys[company].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('companys').child('data').child(companys[company].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getCompanyApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            // console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.getCompanyApplications(companys[company].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getCompanyLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            // console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.getCompanyLikes(companys[company].id, function(likes) {
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

exports['removeCompanyApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            // console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.getCompanyApplications(companys[company].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeCompanyApplication(companys[company].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeCompany'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            // console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.getCompanyLikes(companys[company].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeCompany(companys[company].id, likes[like].id, function() {
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

exports['removeCompany'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyList(function(companys) {
            console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                chat.removeCompany(companys[company].id, function() {
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

exports['createProject'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test project',
            projecttype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createProject(data, projectkey => {
            database.ref().child('projects').child('data').child(projectkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test project')
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

exports['getProjectList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                console.log('project.id=' + projects[project].id)
                console.log('project.name=' + projects[project].name)
                test.equal(projects[project].name, 'test project')
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

exports['addProjectApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            // console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.addProjectApplication(projects[project].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('projects').child('data').child(projects[project].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeProject'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            // console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.likeProject(projects[project].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('projects').child('data').child(projects[project].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getProjectApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            // console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.getProjectApplications(projects[project].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getProjectLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            // console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.getProjectLikes(projects[project].id, function(likes) {
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

exports['removeProjectApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            // console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.getProjectApplications(projects[project].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeProjectApplication(projects[project].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeProject'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            // console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.getProjectLikes(projects[project].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeProject(projects[project].id, likes[like].id, function() {
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

exports['removeProject'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectList(function(projects) {
            console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                chat.removeProject(projects[project].id, function() {
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

exports['createTalent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test talent',
            talenttype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createTalent(data, talentkey => {
            database.ref().child('talents').child('data').child(talentkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test talent')
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

exports['getTalentList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                console.log('talent.id=' + talents[talent].id)
                console.log('talent.name=' + talents[talent].name)
                test.equal(talents[talent].name, 'test talent')
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

exports['addTalentApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            // console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.addTalentApplication(talents[talent].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('talents').child('data').child(talents[talent].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeTalent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            // console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.likeTalent(talents[talent].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('talents').child('data').child(talents[talent].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getTalentApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            // console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.getTalentApplications(talents[talent].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getTalentLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            // console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.getTalentLikes(talents[talent].id, function(likes) {
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

exports['removeTalentApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            // console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.getTalentApplications(talents[talent].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeTalentApplication(talents[talent].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeTalent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            // console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.getTalentLikes(talents[talent].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeTalent(talents[talent].id, likes[like].id, function() {
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

exports['removeTalent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentList(function(talents) {
            console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                chat.removeTalent(talents[talent].id, function() {
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

exports['createConsultant'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test consultant',
            consultanttype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createConsultant(data, consultantkey => {
            database.ref().child('consultants').child('data').child(consultantkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test consultant')
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

exports['getConsultantList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                console.log('consultant.id=' + consultants[consultant].id)
                console.log('consultant.name=' + consultants[consultant].name)
                test.equal(consultants[consultant].name, 'test consultant')
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

exports['addConsultantApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            // console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.addConsultantApplication(consultants[consultant].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('consultants').child('data').child(consultants[consultant].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeConsultant'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            // console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.likeConsultant(consultants[consultant].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('consultants').child('data').child(consultants[consultant].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getConsultantApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            // console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.getConsultantApplications(consultants[consultant].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getConsultantLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            // console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.getConsultantLikes(consultants[consultant].id, function(likes) {
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

exports['removeConsultantApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            // console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.getConsultantApplications(consultants[consultant].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeConsultantApplication(consultants[consultant].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeConsultant'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            // console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.getConsultantLikes(consultants[consultant].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeConsultant(consultants[consultant].id, likes[like].id, function() {
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

exports['removeConsultant'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantList(function(consultants) {
            console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                chat.removeConsultant(consultants[consultant].id, function() {
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

exports['createDispatcher'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test dispatcher',
            dispatchertype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createDispatcher(data, dispatcherkey => {
            database.ref().child('dispatchers').child('data').child(dispatcherkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test dispatcher')
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

exports['getDispatcherList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                console.log('dispatcher.id=' + dispatchers[dispatcher].id)
                console.log('dispatcher.name=' + dispatchers[dispatcher].name)
                test.equal(dispatchers[dispatcher].name, 'test dispatcher')
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

exports['addDispatcherApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            // console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.addDispatcherApplication(dispatchers[dispatcher].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('dispatchers').child('data').child(dispatchers[dispatcher].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeDispatcher'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            // console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.likeDispatcher(dispatchers[dispatcher].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('dispatchers').child('data').child(dispatchers[dispatcher].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getDispatcherApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            // console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.getDispatcherApplications(dispatchers[dispatcher].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getDispatcherLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            // console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.getDispatcherLikes(dispatchers[dispatcher].id, function(likes) {
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

exports['removeDispatcherApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            // console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.getDispatcherApplications(dispatchers[dispatcher].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeDispatcherApplication(dispatchers[dispatcher].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeDispatcher'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            // console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.getDispatcherLikes(dispatchers[dispatcher].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeDispatcher(dispatchers[dispatcher].id, likes[like].id, function() {
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

exports['removeDispatcher'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherList(function(dispatchers) {
            console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                chat.removeDispatcher(dispatchers[dispatcher].id, function() {
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

exports['createKnowledge'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test knowledge',
            knowledgetype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createKnowledge(data, knowledgekey => {
            database.ref().child('knowledges').child('data').child(knowledgekey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test knowledge')
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

exports['getKnowledgeList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                console.log('knowledge.id=' + knowledges[knowledge].id)
                console.log('knowledge.name=' + knowledges[knowledge].name)
                test.equal(knowledges[knowledge].name, 'test knowledge')
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

exports['addKnowledgeApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.addKnowledgeApplication(knowledges[knowledge].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('knowledges').child('data').child(knowledges[knowledge].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeKnowledge'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.likeKnowledge(knowledges[knowledge].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('knowledges').child('data').child(knowledges[knowledge].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getKnowledgeApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.getKnowledgeApplications(knowledges[knowledge].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getKnowledgeLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.getKnowledgeLikes(knowledges[knowledge].id, function(likes) {
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

exports['removeKnowledgeApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.getKnowledgeApplications(knowledges[knowledge].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeKnowledgeApplication(knowledges[knowledge].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeKnowledge'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.getKnowledgeLikes(knowledges[knowledge].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeKnowledge(knowledges[knowledge].id, likes[like].id, function() {
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

exports['removeKnowledge'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.removeKnowledge(knowledges[knowledge].id, function() {
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

exports['createTool'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test tool',
            tooltype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createTool(data, toolkey => {
            database.ref().child('tools').child('data').child(toolkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test tool')
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

exports['getToolList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                console.log('tool.id=' + tools[tool].id)
                console.log('tool.name=' + tools[tool].name)
                test.equal(tools[tool].name, 'test tool')
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

exports['addToolApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            // console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.addToolApplication(tools[tool].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('tools').child('data').child(tools[tool].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeTool'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            // console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.likeTool(tools[tool].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('tools').child('data').child(tools[tool].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getToolApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            // console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.getToolApplications(tools[tool].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getToolLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            // console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.getToolLikes(tools[tool].id, function(likes) {
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

exports['removeToolApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            // console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.getToolApplications(tools[tool].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeToolApplication(tools[tool].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeTool'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            // console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.getToolLikes(tools[tool].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeTool(tools[tool].id, likes[like].id, function() {
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

exports['removeTool'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolList(function(tools) {
            console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                chat.removeTool(tools[tool].id, function() {
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

exports['createEvent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test event',
            eventtype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createEvent(data, eventkey => {
            database.ref().child('events').child('data').child(eventkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test event')
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

exports['getEventList'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                console.log('event.id=' + events[event].id)
                console.log('event.name=' + events[event].name)
                test.equal(events[event].name, 'test event')
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

exports['addEventApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            // console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.addEventApplication(events[event].id, 'test application', applicationkey => {
                  console.log('applicationkey=' + applicationkey)
                  database.ref().child('events').child('data').child(events[event].id).child('applications').child(applicationkey).once('value', function(applications) {
                    console.log(applications.val())
                    console.log('text=' + applications.child('text').val())
                    console.log('name=' + applications.child('name').val())
                    test.equal(applications.child('text').val(), 'test application')
                    test.equal(applications.child('name').val(), snapshot.child('name').val())
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

exports['likeEvent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            // console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.likeEvent(events[event].id, likekey => {
                  console.log('likekey=' + likekey)
                  database.ref().child('events').child('data').child(events[event].id).child('likes').child(likekey).once('value', function(likes) {
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

exports['getEventApplications'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            // console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.getEventApplications(events[event].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    console.log(applications[application].id)
                    console.log('text=' + applications[application].text)
                    console.log('name=' + applications[application].name)
                    test.equal(applications[application].text, 'test application')
                    test.equal(applications[application].name, snapshot.child('name').val())
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

exports['getEventLikes'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            // console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.getEventLikes(events[event].id, function(likes) {
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

exports['removeEventApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            // console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.getEventApplications(events[event].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.removeEventApplication(events[event].id, applications[application].id, function() {
                      console.log(applications[application].id)
                      console.log('text=' + applications[application].text)
                      console.log('name=' + applications[application].name)
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

exports['unlikeEvent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            // console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.getEventLikes(events[event].id, function(likes) {
                  console.log(likes)
                  for (const like in likes) {
                    chat.unlikeEvent(events[event].id, likes[like].id, function() {
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

exports['removeEvent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventList(function(events) {
            console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                chat.removeEvent(events[event].id, function() {
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

exports['updateJob'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test job',
            jobtype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createJob(data, jobkey => {
            database.ref().child('jobs').child('data').child(jobkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test job')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test job2',
                jobtype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateJob(jobkey, data2, jobkey2 => {
                database.ref().child('jobs').child('data').child(jobkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test job2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateCompany'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test company',
            companytype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createCompany(data, companykey => {
            database.ref().child('companys').child('data').child(companykey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test company')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test company2',
                companytype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateCompany(companykey, data2, companykey2 => {
                database.ref().child('companys').child('data').child(companykey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test company2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateProject'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test project',
            projecttype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createProject(data, projectkey => {
            database.ref().child('projects').child('data').child(projectkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test project')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test project2',
                projecttype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateProject(projectkey, data2, projectkey2 => {
                database.ref().child('projects').child('data').child(projectkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test project2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateTalent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test talent',
            talenttype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createTalent(data, talentkey => {
            database.ref().child('talents').child('data').child(talentkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test talent')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test talent2',
                talenttype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateTalent(talentkey, data2, talentkey2 => {
                database.ref().child('talents').child('data').child(talentkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test talent2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateConsultant'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test consultant',
            consultanttype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createConsultant(data, consultantkey => {
            database.ref().child('consultants').child('data').child(consultantkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test consultant')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test consultant2',
                consultanttype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateConsultant(consultantkey, data2, consultantkey2 => {
                database.ref().child('consultants').child('data').child(consultantkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test consultant2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateDispatcher'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test dispatcher',
            dispatchertype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createDispatcher(data, dispatcherkey => {
            database.ref().child('dispatchers').child('data').child(dispatcherkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test dispatcher')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test dispatcher2',
                dispatchertype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateDispatcher(dispatcherkey, data2, dispatcherkey2 => {
                database.ref().child('dispatchers').child('data').child(dispatcherkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test dispatcher2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateKnowledge'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test knowledge',
            knowledgetype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createKnowledge(data, knowledgekey => {
            database.ref().child('knowledges').child('data').child(knowledgekey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test knowledge')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test knowledge2',
                knowledgetype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateKnowledge(knowledgekey, data2, knowledgekey2 => {
                database.ref().child('knowledges').child('data').child(knowledgekey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test knowledge2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateTool'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test tool',
            tooltype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createTool(data, toolkey => {
            database.ref().child('tools').child('data').child(toolkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test tool')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test tool2',
                tooltype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateTool(toolkey, data2, toolkey2 => {
                database.ref().child('tools').child('data').child(toolkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test tool2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['updateEvent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          const data = {
            name: 'test event',
            eventtype: '1',
            industry: '1',
            area: '1',
            address: '11',
            Tel: '1',
            Fax: '1',
            Manager: '1',
            HP: '1',
            photo: ''
          }
          chat.createEvent(data, eventkey => {
            database.ref().child('events').child('data').child(eventkey).once('value', function(snapshot2) {
              console.log('snapshot2.name=' + snapshot2.child('name').val())
              console.log('snapshot2.nickname=' + snapshot2.child('nickname').val())
              test.equal(snapshot2.child('name').val(), 'test event')
              test.equal(snapshot2.child('nickname').val(), snapshot.child('name').val())
              const data2 = {
                name: 'test event2',
                eventtype: '1',
                industry: '1',
                area: '1',
                address: '11',
                Tel: '1',
                Fax: '1',
                Manager: '1',
                HP: '1',
                photo: ''
              }
              chat.updateEvent(eventkey, data2, eventkey2 => {
                database.ref().child('events').child('data').child(eventkey2).once('value', function(snapshot3) {
                  console.log('snapshot3.name=' + snapshot3.child('name').val())
                  console.log('snapshot3.nickname=' + snapshot3.child('nickname').val())
                  test.equal(snapshot3.child('name').val(), 'test event2')
                  test.equal(snapshot3.child('nickname').val(), snapshot.child('name').val())
                  test.done()
                })
              })
            })
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getCompanyByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyByKey('-LbW068uZTzWv84W5fNq', function(company) {
            console.log(company)
            if (company.avatar === user.uid) {
              console.log('company.id=' + company.id)
              console.log('company.name=' + company.name)
              test.equal(company.name, 'test company2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getCompanyListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyListByType('1', function(companys) {
            console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                console.log('company.id=' + companys[company].id)
                console.log('company.name=' + companys[company].name)
                test.equal(companys[company].name, 'test company2')
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

exports['getCompanyListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getCompanyListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(companys) {
            console.log(companys)
            for (const company in companys) {
              if (companys[company].avatar === user.uid) {
                console.log('company.id=' + companys[company].id)
                console.log('company.name=' + companys[company].name)
                test.equal(companys[company].name, 'test company2')
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

exports['getJobByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobByKey('-LbW05tjlGqALVI2K445', function(job) {
            console.log(job)
            if (job.avatar === user.uid) {
              console.log('job.id=' + job.id)
              console.log('job.name=' + job.name)
              test.equal(job.name, 'test job2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getJobListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobListByType('1', function(jobs) {
            console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                console.log('job.id=' + jobs[job].id)
                console.log('job.name=' + jobs[job].name)
                test.equal(jobs[job].name, 'test job2')
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

exports['getJobListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getJobListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(jobs) {
            console.log(jobs)
            for (const job in jobs) {
              if (jobs[job].avatar === user.uid) {
                console.log('job.id=' + jobs[job].id)
                console.log('job.name=' + jobs[job].name)
                test.equal(jobs[job].name, 'test job2')
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

exports['getProjectByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectByKey('-LbW06MHXWWiH_5qTsNa', function(project) {
            console.log(project)
            if (project.avatar === user.uid) {
              console.log('project.id=' + project.id)
              console.log('project.name=' + project.name)
              test.equal(project.name, 'test project2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getProjectListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectListByType('1', function(projects) {
            console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                console.log('project.id=' + projects[project].id)
                console.log('project.name=' + projects[project].name)
                test.equal(projects[project].name, 'test project2')
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

exports['getProjectListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getProjectListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(projects) {
            console.log(projects)
            for (const project in projects) {
              if (projects[project].avatar === user.uid) {
                console.log('project.id=' + projects[project].id)
                console.log('project.name=' + projects[project].name)
                test.equal(projects[project].name, 'test project2')
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

exports['getTalentByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentByKey('-LbW06_C0f7YZbS0UVec', function(talent) {
            console.log(talent)
            if (talent.avatar === user.uid) {
              console.log('talent.id=' + talent.id)
              console.log('talent.name=' + talent.name)
              test.equal(talent.name, 'test talent2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getTalentListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentListByType('1', function(talents) {
            console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                console.log('talent.id=' + talents[talent].id)
                console.log('talent.name=' + talents[talent].name)
                test.equal(talents[talent].name, 'test talent2')
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

exports['getTalentListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getTalentListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(talents) {
            console.log(talents)
            for (const talent in talents) {
              if (talents[talent].avatar === user.uid) {
                console.log('talent.id=' + talents[talent].id)
                console.log('talent.name=' + talents[talent].name)
                test.equal(talents[talent].name, 'test talent2')
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

exports['getConsultantByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantByKey('-LbW06mrQIcnI-hUSrnL', function(consultant) {
            console.log(consultant)
            if (consultant.avatar === user.uid) {
              console.log('consultant.id=' + consultant.id)
              console.log('consultant.name=' + consultant.name)
              test.equal(consultant.name, 'test consultant2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getConsultantListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantListByType('1', function(consultants) {
            console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                console.log('consultant.id=' + consultants[consultant].id)
                console.log('consultant.name=' + consultants[consultant].name)
                test.equal(consultants[consultant].name, 'test consultant2')
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

exports['getConsultantListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getConsultantListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(consultants) {
            console.log(consultants)
            for (const consultant in consultants) {
              if (consultants[consultant].avatar === user.uid) {
                console.log('consultant.id=' + consultants[consultant].id)
                console.log('consultant.name=' + consultants[consultant].name)
                test.equal(consultants[consultant].name, 'test consultant2')
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

exports['getDispatcherByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherByKey('-LbW07-Ak4hTKCxzuXdf', function(dispatcher) {
            console.log(dispatcher)
            if (dispatcher.avatar === user.uid) {
              console.log('dispatcher.id=' + dispatcher.id)
              console.log('dispatcher.name=' + dispatcher.name)
              test.equal(dispatcher.name, 'test dispatcher2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getDispatcherListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherListByType('1', function(dispatchers) {
            console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                console.log('dispatcher.id=' + dispatchers[dispatcher].id)
                console.log('dispatcher.name=' + dispatchers[dispatcher].name)
                test.equal(dispatchers[dispatcher].name, 'test dispatcher2')
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

exports['getDispatcherListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getDispatcherListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(dispatchers) {
            console.log(dispatchers)
            for (const dispatcher in dispatchers) {
              if (dispatchers[dispatcher].avatar === user.uid) {
                console.log('dispatcher.id=' + dispatchers[dispatcher].id)
                console.log('dispatcher.name=' + dispatchers[dispatcher].name)
                test.equal(dispatchers[dispatcher].name, 'test dispatcher2')
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

exports['getKnowledgeByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeByKey('-LbW07Cj8C37LDyZeKHF', function(knowledge) {
            console.log(knowledge)
            if (knowledge.avatar === user.uid) {
              console.log('knowledge.id=' + knowledge.id)
              console.log('knowledge.name=' + knowledge.name)
              test.equal(knowledge.name, 'test knowledge2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getKnowledgeListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeListByType('1', function(knowledges) {
            console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                console.log('knowledge.id=' + knowledges[knowledge].id)
                console.log('knowledge.name=' + knowledges[knowledge].name)
                test.equal(knowledges[knowledge].name, 'test knowledge2')
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

exports['getKnowledgeListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(knowledges) {
            console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                console.log('knowledge.id=' + knowledges[knowledge].id)
                console.log('knowledge.name=' + knowledges[knowledge].name)
                test.equal(knowledges[knowledge].name, 'test knowledge2')
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

exports['getToolByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolByKey('-LbW07QDVIQO5CWJ6-Xy', function(tool) {
            console.log(tool)
            if (tool.avatar === user.uid) {
              console.log('tool.id=' + tool.id)
              console.log('tool.name=' + tool.name)
              test.equal(tool.name, 'test tool2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getToolListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolListByType('1', function(tools) {
            console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                console.log('tool.id=' + tools[tool].id)
                console.log('tool.name=' + tools[tool].name)
                test.equal(tools[tool].name, 'test tool2')
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

exports['getToolListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(tools) {
            console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                console.log('tool.id=' + tools[tool].id)
                console.log('tool.name=' + tools[tool].name)
                test.equal(tools[tool].name, 'test tool2')
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

exports['getToolByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolByKey('-LbW07QDVIQO5CWJ6-Xy', function(tool) {
            console.log(tool)
            if (tool.avatar === user.uid) {
              console.log('tool.id=' + tool.id)
              console.log('tool.name=' + tool.name)
              test.equal(tool.name, 'test tool2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getToolListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolListByType('1', function(tools) {
            console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                console.log('tool.id=' + tools[tool].id)
                console.log('tool.name=' + tools[tool].name)
                test.equal(tools[tool].name, 'test tool2')
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

exports['getToolListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getToolListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(tools) {
            console.log(tools)
            for (const tool in tools) {
              if (tools[tool].avatar === user.uid) {
                console.log('tool.id=' + tools[tool].id)
                console.log('tool.name=' + tools[tool].name)
                test.equal(tools[tool].name, 'test tool2')
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

exports['getEventByKey'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventByKey('-LbW07cKyWoNzVpJvAZ5', function(event) {
            console.log(event)
            if (event.avatar === user.uid) {
              console.log('event.id=' + event.id)
              console.log('event.name=' + event.name)
              test.equal(event.name, 'test event2')
              test.done()
            }
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getEventListByType'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventListByType('1', function(events) {
            console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                console.log('event.id=' + events[event].id)
                console.log('event.name=' + events[event].name)
                test.equal(events[event].name, 'test event2')
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

exports['getEventListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getEventListByOwner('CIxg5db1wHWTu1eeymVp4EkLzfg1', function(events) {
            console.log(events)
            for (const event in events) {
              if (events[event].avatar === user.uid) {
                console.log('event.id=' + events[event].id)
                console.log('event.name=' + events[event].name)
                test.equal(events[event].name, 'test event2')
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

exports['updateKnowledgeApplication'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.getKnowledgeApplications(knowledges[knowledge].id, function(applications) {
                  console.log(applications)
                  for (const application in applications) {
                    chat.updateKnowledgeApplication(knowledge, application, true)
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

exports['addKnowledgeContent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                const content = {
                  type: 'Html',
                  data: '<div>this is Knowledge about Java Basic</div>'
                }
                chat.addKnowledgeContent(knowledge, 1, 'Java Basic', content, contentkey => {
                  console.log('contentkey=' + contentkey)
                  database.ref().child('knowledges').child('data').child(knowledge).child('contents').child(contentkey).once('value', function(contents) {
                    console.log(contents.val())
                    console.log('ord=' + contents.child('ord').val())
                    console.log('title=' + contents.child('title').val())
                    test.equal(contents.child('ord').val(), 1)
                    test.equal(contents.child('title').val(), 'Java Basic')
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

exports['updateKnowledgeContent'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                const content = {
                  type: 'Select',
                  title: '<div>this is Knowledge about Java Basic</div>',
                  options: {
                    '1': 'select option1',
                    '2': 'select option2'
                  },
                  answer: '1'
                }
                chat.addKnowledgeContent(knowledge, 2, 'Java Basic Test', content, contentkey => {
                  console.log('contentkey=' + contentkey)
                  database.ref().child('knowledges').child('data').child(knowledge).child('contents').child(contentkey).once('value', function(contents) {
                    console.log(contents.val())
                    console.log('ord=' + contents.child('ord').val())
                    console.log('title=' + contents.child('title').val())
                    test.equal(contents.child('ord').val(), 1)
                    test.equal(contents.child('title').val(), 'Java Basic')
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

exports['getKnowledgeContents'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.getKnowledgeContents(knowledge, function(contents) {
                  for (const content in contents) {
                    console.log(contents[content])
                    test.done()
                  }
                })
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

exports['updateLearningStatus'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.updateLearningStatus(knowledge, 2, true, knowledgeKey => {
                  console.log('knowledgeKey=' + knowledgeKey)
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
exports['addKnowledgeCertificate'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.addKnowledgeCertificate(knowledge, 'https://image.baidu.com/search/detail?ct=503316480&z=&tn=baiduimagedetail&ipn=d&word=%E5%AD%A6%E4%B9%A0%E8%AF%81%E6%98%8E%E4%B9%A6&step_word=&ie=utf-8&in=&cl=2&lm=-1&st=-1&hd=undefined&latest=undefined&copyright=undefined&cs=5659746,4131529913&os=2045183806,206696368&simid=3410681258,295304104&pn=2&rn=1&di=81730&ln=1642&fr=&fmq=1555750763902_R&ic=0&s=undefined&se=&sme=&tab=0&width=&height=&face=undefined&is=0,0&istype=2&ist=&jit=&bdtype=0&spn=0&pi=0&gsm=0&objurl=http%3A%2F%2Fimgsa.baidu.com%2Fexp%2Fw%3D500%2Fsign%3D9a7fec740a24ab18e016e13705fae69a%2F4b90f603738da977f10b8f79b351f8198618e3b8.jpg&rpstart=0&rpnum=0&adpicid=0&force=undefined', knowledgeKey => {
                  console.log('knowledgeKey=' + knowledgeKey)
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
exports['createCertificate'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeList(function(knowledges) {
            // console.log(knowledges)
            for (const knowledge in knowledges) {
              if (knowledges[knowledge].avatar === user.uid) {
                chat.createCertificate('src/assets/images/certificate.png', 'src/assets/images/' + knowledges[knowledge].id + knowledges[knowledge].avatar + '.png', knowledges[knowledge].name, () => {
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

exports['getKnowledgeListByOwner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeListByOwner(function(knowledges) {
            console.log(knowledges)
            test.done()
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}

exports['getKnowledgeListByLearner'] = function(test) {
  auth.onAuthStateChanged(function(user) {
    if (user) {
      const ref = database.ref('users/' + user.uid)
      console.log(ref.toJSON())
      ref.once('value', function(snapshot) {
        console.log(snapshot.val())
        chat.setUser(user.uid, snapshot.child('name').val(), function() {
          chat.getKnowledgeListByLearner(function(knowledges) {
            console.log(knowledges)
            test.done()
          })
        })
      })
    }
  })
  auth.signInWithEmailAndPassword('test1@gmail.com', '12345qwert')
}
*/
