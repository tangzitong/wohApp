// import firebase from 'firebase'
const firebase = require('firebase/app')
// Firechat is a simple, easily-extensible data layer for multi-user,
// multi-room chat, built entirely on [Firebase](https://firebase.google.com).
//
// The Firechat object is the primary conduit for all underlying data events.
// It exposes a number of methods for binding event listeners, creating,
// entering, or leaving chat rooms, initiating chats, sending messages,
// and moderator actions such as warning, kicking, or suspending users.
//
//     firechat.js 0.0.0
//     https://firebase.google.com
//     (c) 2016 Firebase
//     License: MIT

// Setup
// --------------
// (function() {
// Establish a reference to the `window` object, and save the previous value
// of the `Firechat` variable.
//  const root = this,
//      previousFirechat = global.Firechat

function Firechat(firebaseRef, options) {
  // Cache the provided Database reference and the firebase.App instance
  this._firechatRef = firebaseRef
  this._firebaseApp = firebaseRef.database.app

  // User-specific instance variables.
  this._user = null
  this._userId = null
  this._userName = null
  this._isModerator = false

  // A unique id generated for each session.
  this._sessionId = null

  // A mapping of event IDs to an array of callbacks.
  this._events = {}

  // A mapping of room IDs to a boolean indicating presence.
  this._rooms = {}

  // A mapping of operations to re-queue on disconnect.
  this._presenceBits = {}

  // Commonly-used Firebase references.
  this._userRef = null
  this._messageRef = this._firechatRef.child('room-messages')
  this._roomRef = this._firechatRef.child('room-metadata')
  this._privateRoomRef = this._firechatRef.child('room-private-metadata')
  this._moderatorsRef = this._firechatRef.child('moderators')
  this._suspensionsRef = this._firechatRef.child('suspensions')
  this._usersOnlineRef = this._firechatRef.child('user-names-online')
  this._postsRef = this._firechatRef.child('posts')

  // Setup and establish default options.
  this._options = options || {}

  // The number of historical messages to load per room.
  this._options.numMaxMessages = this._options.numMaxMessages || 50
}

// Run Firechat in *noConflict* mode, returning the `Firechat` variable to
// its previous owner, and returning a reference to the Firechat object.
// Firechat.noConflict = function noConflict() {
//  global.Firechat = previousFirechat
//  return Firechat
// }

// Export the Firechat object as a global.
// global.Firechat = Firechat

// Firechat Internal Methods
// --------------
Firechat.prototype = {

  // Load the initial metadata for the user's account and set initial state.
  _loadUserMetadata: function(onComplete) {
    const self = this

    // Update the user record with a default name on user's first visit.
    this._userRef.transaction(function(current) {
      if (!current || !current.id || !current.name) {
        return {
          id: self._userId,
          name: self._userName
        }
      }
    }, function(error, committed, snapshot) {
      if (!error) {
        self._user = snapshot.val()
        self._moderatorsRef.child(self._userId).once('value', function(snapshot) {
          self._isModerator = !!snapshot.val()
          global.setTimeout(onComplete, 0)
        })
      }
    })
  },

  // Initialize Firebase listeners and callbacks for the supported bindings.
  _setupDataEvents: function() {
    // Monitor connection state so we can requeue disconnect operations if need be.
    const connectedRef = this._firechatRef.root.child('.info/connected')
    connectedRef.on('value', function(snapshot) {
      if (snapshot.val() === true) {
        // We're connected (or reconnected)! Set up our presence state.
        for (const path in this._presenceBits) {
          const op = this._presenceBits[path]
          const ref = op.ref

          ref.onDisconnect().set(op.offlineValue)
          ref.set(op.onlineValue)
        }
      }
    }, this)

    // Queue up a presence operation to remove the session when presence is lost
    this._queuePresenceOperation(this._sessionRef, true, null)

    // Register our username in the public user listing.
    const usernameRef = this._usersOnlineRef.child(this._userName.toLowerCase())
    const usernameSessionRef = usernameRef.child(this._sessionId)
    this._queuePresenceOperation(usernameSessionRef, {
      id: this._userId,
      name: this._userName
    }, null)

    // Listen for state changes for the given user.
    this._userRef.on('value', this._onUpdateUser, this)

    // Listen for chat invitations from other users.
    this._userRef.child('invites').on('child_added', this._onFirechatInvite, this)

    // Listen for messages from moderators and adminstrators.
    this._userRef.child('notifications').on('child_added', this._onNotification, this)
  },

  // Append the new callback to our list of event handlers.
  _addEventCallback: function(eventId, callback) {
    this._events[eventId] = this._events[eventId] || []
    this._events[eventId].push(callback)
  },

  // Retrieve the list of event handlers for a given event id.
  _getEventCallbacks: function(eventId) {
    if (this._events.hasOwnProperty(eventId)) {
      return this._events[eventId]
    }
    return []
  },

  // Invoke each of the event handlers for a given event id with specified data.
  _invokeEventCallbacks: function(eventId) {
    let args = []
    const callbacks = this._getEventCallbacks(eventId)

    Array.prototype.push.apply(args, arguments)
    args = args.slice(1)

    for (let i = 0; i < callbacks.length; i += 1) {
      callbacks[i].apply(null, args)
    }
  },

  // Keep track of on-disconnect events so they can be requeued if we disconnect the reconnect.
  _queuePresenceOperation: function(ref, onlineValue, offlineValue) {
    ref.onDisconnect().set(offlineValue)
    ref.set(onlineValue)
    this._presenceBits[ref.toString()] = {
      ref: ref,
      onlineValue: onlineValue,
      offlineValue: offlineValue
    }
  },

  // Remove an on-disconnect event from firing upon future disconnect and reconnect.
  _removePresenceOperation: function(ref, value) {
    const path = ref.toString()
    ref.onDisconnect().cancel()
    ref.set(value)
    delete this._presenceBits[path]
  },

  // Event to monitor current user state.
  _onUpdateUser: function(snapshot) {
    this._user = snapshot.val()
    this._userName = this._user.name
    this._invokeEventCallbacks('user-update', this._user)
  },

  // Event to monitor current auth + user state.
  _onAuthRequired: function() {
    this._invokeEventCallbacks('auth-required')
  },

  // Events to monitor room entry / exit and messages additional / removal.
  _onEnterRoom: function(room) {
    this._invokeEventCallbacks('room-enter', room)
  },
  _onNewMessage: function(roomId, snapshot) {
    const message = snapshot.val()
    message.id = snapshot.key
    this._invokeEventCallbacks('message-add', roomId, message)
  },
  _onRemoveMessage: function(roomId, snapshot) {
    const messageId = snapshot.key
    this._invokeEventCallbacks('message-remove', roomId, messageId)
  },
  _onLeaveRoom: function(roomId) {
    this._invokeEventCallbacks('room-exit', roomId)
  },

  // Event to listen for notifications from administrators and moderators.
  _onNotification: function(snapshot) {
    const notification = snapshot.val()
    if (!notification.read) {
      if (notification.notificationType !== 'suspension' || notification.data.suspendedUntil < new Date().getTime()) {
        snapshot.ref.child('read').set(true)
      }
      this._invokeEventCallbacks('notification', notification)
    }
  },

  // Events to monitor chat invitations and invitation replies.
  _onFirechatInvite: function(snapshot) {
    const self = this
    const invite = snapshot.val()

    // Skip invites we've already responded to.
    if (invite.status) {
      return
    }

    invite.id = invite.id || snapshot.key
    self.getRoom(invite.roomId, function(room) {
      invite.toRoomName = room.name
      self._invokeEventCallbacks('room-invite', invite)
    })
  },
  _onFirechatInviteResponse: function(snapshot) {
    const self = this
    const invite = snapshot.val()

    invite.id = invite.id || snapshot.key
    self._invokeEventCallbacks('room-invite-response', invite)
  }
}

// Firechat External Methods
// --------------

// Initialize the library and setup data listeners.
Firechat.prototype.setUser = function(userId, userName, callback) {
  const self = this

  self._firebaseApp.auth().onAuthStateChanged(function(user) {
    if (user) {
      self._userId = userId.toString()
      self._userName = userName.toString()
      self._userRef = self._firechatRef.child('users').child(self._userId)
      self._sessionRef = self._userRef.child('sessions').push()
      self._sessionId = self._sessionRef.key

      self._loadUserMetadata(function() {
        global.setTimeout(function() {
          callback(self._user)
          self._setupDataEvents()
        }, 0)
      })
    } else {
      self.warn('Firechat requires an authenticated Firebase reference. Pass an authenticated reference before loading.')
    }
  })
}

// Resumes the previous session by automatically entering rooms.
Firechat.prototype.resumeSession = function() {
  this._userRef.child('rooms').once('value', function(snapshot) {
    const rooms = snapshot.val()
    for (const roomId in rooms) {
      this.enterRoom(rooms[roomId].id)
    }
  }, /* onError */ function() {}, /* context */ this)
}

// Callback registration. Supports each of the following events:
Firechat.prototype.on = function(eventType, cb) {
  this._addEventCallback(eventType, cb)
}

// Create and automatically enter a new chat room.
Firechat.prototype.createRoom = function(roomName, roomType, callback) {
  const self = this
  const newRoomRef = this._roomRef.push()

  const newRoom = {
    id: newRoomRef.key,
    name: roomName,
    type: roomType || 'public',
    createdByUserId: this._userId,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  }

  if (roomType === 'private') {
    newRoom.authorizedUsers = {}
    newRoom.authorizedUsers[this._userId] = true
  }

  newRoomRef.set(newRoom, function(error) {
    if (!error) {
      self.enterRoom(newRoomRef.key)
    }
    if (callback) {
      callback(newRoomRef.key)
    }
  })
}

// Enter a chat room.
Firechat.prototype.enterRoom = function(roomId) {
  const self = this
  self.getRoom(roomId, function(room) {
    const roomName = room.name

    if (!roomId || !roomName) return

    // Skip if we're already in this room.
    if (self._rooms[roomId]) {
      return
    }

    self._rooms[roomId] = true

    if (self._user) {
      // Save entering this room to resume the session again later.
      self._userRef.child('rooms').child(roomId).set({
        id: roomId,
        name: roomName,
        active: true
      })

      // Set presence bit for the room and queue it for removal on disconnect.
      const presenceRef = self._firechatRef.child('room-users').child(roomId).child(self._userId).child(self._sessionId)
      self._queuePresenceOperation(presenceRef, {
        id: self._userId,
        name: self._userName
      }, null)
    }

    // Invoke our callbacks before we start listening for new messages.
    self._onEnterRoom({
      id: roomId,
      name: roomName
    })

    // Setup message listeners
    self._roomRef.child(roomId).once('value', function(snapshot) {
      self._messageRef.child(roomId).limitToLast(self._options.numMaxMessages).on('child_added', function(snapshot) {
        self._onNewMessage(roomId, snapshot)
      }, /* onCancel */ function() {
        // Turns out we don't have permission to access these messages.
        self.leaveRoom(roomId)
      }, /* context */ self)

      self._messageRef.child(roomId).limitToLast(self._options.numMaxMessages).on('child_removed', function(snapshot) {
        self._onRemoveMessage(roomId, snapshot)
      }, /* onCancel */ function() {}, /* context */ self)
    }, /* onFailure */ function() {}, self)
  })
}

// Leave a chat room.
Firechat.prototype.leaveRoom = function(roomId) {
  const self = this
  const userRoomRef = self._firechatRef.child('room-users').child(roomId)

  // Remove listener for new messages to this room.
  self._messageRef.child(roomId).off()

  if (self._user) {
    const presenceRef = userRoomRef.child(self._userId).child(self._sessionId)

    // Remove presence bit for the room and cancel on-disconnect removal.
    self._removePresenceOperation(presenceRef, null)

    // Remove session bit for the room.
    self._userRef.child('rooms').child(roomId).remove()
  }

  delete self._rooms[roomId]

  // Invoke event callbacks for the room-exit event.
  self._onLeaveRoom(roomId)
}

Firechat.prototype.sendMessage = function(roomId, messageContent, messageType, cb) {
  const self = this
  const message = {
    userId: self._userId,
    name: self._userName,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    message: messageContent,
    type: messageType || 'default'
  }

  if (!self._user) {
    self._onAuthRequired()
    if (cb) {
      cb(new Error('Not authenticated or user not set!'))
    }
    return
  }

  const newMessageRef = self._messageRef.child(roomId).push()
  newMessageRef.setWithPriority(message, firebase.database.ServerValue.TIMESTAMP, cb)
}

Firechat.prototype.deleteMessage = function(roomId, messageId, cb) {
  const self = this

  self._messageRef.child(roomId).child(messageId).remove(cb)
}

// Mute or unmute a given user by id. This list will be stored internally and
// all messages from the muted clients will be filtered client-side after
// receipt of each new message.
Firechat.prototype.toggleUserMute = function(userId, cb) {
  const self = this

  if (!self._user) {
    self._onAuthRequired()
    if (cb) {
      cb(new Error('Not authenticated or user not set!'))
    }
    return
  }

  self._userRef.child('muted').child(userId).transaction(function(isMuted) {
    return (isMuted) ? null : true
  }, cb)
}

// Send a moderator notification to a specific user.
Firechat.prototype.sendSuperuserNotification = function(userId, notificationType, data, cb) {
  const self = this
  const userNotificationsRef = self._firechatRef.child('users').child(userId).child('notifications')

  userNotificationsRef.push({
    fromUserId: self._userId,
    timestamp: firebase.database.ServerValue.TIMESTAMP,
    notificationType: notificationType,
    data: data || {}
  }, cb)
}

// Warn a user for violating the terms of service or being abusive.
Firechat.prototype.warnUser = function(userId) {
  const self = this

  self.sendSuperuserNotification(userId, 'warning')
}

// Suspend a user by putting the user into read-only mode for a period.
Firechat.prototype.suspendUser = function(userId, timeLengthSeconds, cb) {
  const self = this
  const suspendedUntil = new Date().getTime() + 1000 * timeLengthSeconds

  self._suspensionsRef.child(userId).set(suspendedUntil, function(error) {
    if (error && cb) {
      return cb(error)
    } else {
      self.sendSuperuserNotification(userId, 'suspension', {
        suspendedUntil: suspendedUntil
      })
      return cb(null)
    }
  })
}

// Invite a user to a specific chat room.
Firechat.prototype.inviteUser = function(userId, roomId) {
  const self = this
  const sendInvite = function() {
    const inviteRef = self._firechatRef.child('users').child(userId).child('invites').push()
    inviteRef.set({
      id: inviteRef.key,
      fromUserId: self._userId,
      fromUserName: self._userName,
      roomId: roomId
    })

    // Handle listen unauth / failure in case we're kicked.
    inviteRef.on('value', self._onFirechatInviteResponse, function() {}, self)
  }

  if (!self._user) {
    self._onAuthRequired()
    return
  }

  self.getRoom(roomId, function(room) {
    if (room.type === 'private') {
      const authorizedUserRef = self._roomRef.child(roomId).child('authorizedUsers')
      authorizedUserRef.child(userId).set(true, function(error) {
        if (!error) {
          sendInvite()
        }
      })
    } else {
      sendInvite()
    }
  })
}

Firechat.prototype.acceptInvite = function(inviteId, cb) {
  const self = this

  self._userRef.child('invites').child(inviteId).once('value', function(snapshot) {
    const invite = snapshot.val()
    if (invite === null && cb) {
      return cb(new Error('acceptInvite(' + inviteId + '): invalid invite id'))
    } else {
      self.enterRoom(invite.roomId)
      self._userRef.child('invites').child(inviteId).update({
        'status': 'accepted',
        'toUserName': self._userName
      }, cb)
    }
  }, self)
}

Firechat.prototype.declineInvite = function(inviteId, cb) {
  const self = this
  const updates = {
    'status': 'declined',
    'toUserName': self._userName
  }

  self._userRef.child('invites').child(inviteId).update(updates, cb)
}

Firechat.prototype.getRoomList = function(cb) {
  const self = this

  self._roomRef.once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getUsersByRoom = function() {
  const self = this
  const roomId = arguments[0]
  let query = self._firechatRef.child('room-users').child(roomId)
  const cb = arguments[arguments.length - 1]
  let limit = null

  if (arguments.length > 2) {
    limit = arguments[1]
  }

  query = (limit) ? query.limitToLast(limit) : query

  query.once('value', function(snapshot) {
    const usernames = snapshot.val() || {}
    const usernamesUnique = {}

    for (const username in usernames) {
      for (const session in usernames[username]) {
        // Skip all other sessions for this user as we only need one.
        usernamesUnique[username] = usernames[username][session]
        break
      }
    }

    global.setTimeout(function() {
      cb(usernamesUnique)
    }, 0)
  })
}

Firechat.prototype.getUsersByPrefix = function(prefix, startAt, endAt, limit, cb) {
  let query = this._usersOnlineRef
  const prefixLower = prefix.toLowerCase()

  if (startAt) {
    query = query.startAt(null, startAt)
  } else if (endAt) {
    query = query.endAt(null, endAt)
  } else {
    query = (prefixLower) ? query.startAt(null, prefixLower) : query.startAt()
  }

  query = (limit) ? query.limitToLast(limit) : query

  query.once('value', function(snapshot) {
    const usernames = snapshot.val() || {}
    const usernamesFiltered = {}

    for (const userNameKey in usernames) {
      const sessions = usernames[userNameKey]
      let userName,
        userId

      // Grab the user data from the first registered active session.
      for (const sessionId in sessions) {
        userName = sessions[sessionId].name
        userId = sessions[sessionId].id

        // Skip all other sessions for this user as we only need one.
        break
      }

      // Filter out any usernames that don't match our prefix and break.
      if ((prefix.length > 0) && (userName.toLowerCase().indexOf(prefixLower) !== 0)) {
        continue
      }

      usernamesFiltered[userName] = {
        name: userName,
        id: userId
      }
    }

    global.setTimeout(function() {
      cb(usernamesFiltered)
    }, 0)
  })
}

// Miscellaneous helper methods.
Firechat.prototype.getRoom = function(roomId, callback) {
  this._roomRef.child(roomId).once('value', function(snapshot) {
    callback(snapshot.val())
  })
}

Firechat.prototype.userIsModerator = function() {
  return this._isModerator
}

Firechat.prototype.warn = function(msg) {
  if (console) {
    msg = 'Firechat Warning: ' + msg
    if (typeof console.warn === 'function') {
      console.warn(msg)
    } else if (typeof console.log === 'function') {
      console.log(msg)
    }
  }
}

Firechat.prototype.createPost = function(content, pic, callback) {
  const self = this
  const newPostRef = self._postsRef.child('data').push()

  const newPost = {
    id: newPostRef.key,
    text: content,
    comment_count: 0,
    comments: [],
    like_count: 0,
    likes: [],
    original_pic: pic,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newPostRef.set(newPost, function(error) {
    if (!error && callback) {
      callback(newPostRef.key)
    }
  })
}

Firechat.prototype.addComment = function(postKey, comments, callback) {
  const self = this
  const newCommentsRef = self._postsRef.child(postKey).child('comments').push()

  const newComment = {
    id: newCommentsRef.key,
    text: comments,
    postid: postKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newCommentsRef.set(newComment, function(error) {
    if (!error) {
      self._postsRef.child(postKey).update({
        'comment_count': 'comment_count' + 1
      })
    }
    if (callback) {
      callback(newCommentsRef.key)
    }
  })
}

Firechat.prototype.likePost = function(postKey, callback) {
  const self = this
  const newLikesRef = self._postsRef.child(postKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    postid: postKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._postsRef.child(postKey).update({
        'like_count': 'like_count' + 1
      })
    }
    if (callback) {
      callback(newLikesRef.key)
    }
  })
}

Firechat.prototype.getPostList = function(cb) {
  const self = this

  self._postsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removePost = function(postKey, callback) {
  self._postsRef.child(postKey).remove(function(error) {
    if (!error && callback) {
      callback()
    }
  })
}

Firechat.prototype.getPostComments = function(postkey, cb) {
  const self = this

  self._postsRef.child(postkey).child('comments').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removePostComment = function(postKey, commentKey, callback) {
  self._postsRef.child(postKey).child('comments').child(commentKey).remove(function(error) {
    if (!error) {
      self._postsRef.child(postKey).update({
        'comment_count': 'comment_count' - 1
      })
    }
    if (callback) {
      callback()
    }
  })
}

Firechat.prototype.getPostLikes = function(postkey, cb) {
  const self = this

  self._postsRef.child(postkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikePost = function(postKey, likeKey, callback) {
  self._postsRef.child(postKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._postsRef.child(postKey).update({
        'like_count': 'like_count' - 1
      })
    }
    if (callback) {
      callback()
    }
  })
}

Firechat.prototype.addContact = function(userid, name, header, location, callback) {
  const self = this
  const newContactsRef = self._userRef.child(this._userId).child('contacts').push()

  const newContact = {
    id: newContactsRef.key,
    nickname: name,
    location: location,
    avatar: userid,
    header: header,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newContactsRef.set(newContact, function(error) {
    if (!error) {
      self._userRef.child(this._userId).update({
        'contact_count': 'contact_count' + 1
      })
    }
    if (callback) {
      callback(newContactsRef.key)
    }
  })
}

Firechat.prototype.removeContact = function(userkey, callback) {
  const self = this

  self._userRef.child(this._userId).child('contacts').child(userkey).remove(function(error) {
    if (!error) {
      self._userRef.child(this._userId).update({
        'contact_count': 'contact_count' - 1
      })
    }
    if (callback) {
      callback()
    }
  })
}

Firechat.prototype.getContactList = function(cb) {
  const self = this

  self._userRef.child(this._userId).child('contacts').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

// })()

module.exports = { Firechat }
