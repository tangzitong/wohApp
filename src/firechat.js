// import firebase from 'firebase'
const firebase = require('firebase/app')
const pureimage = require('pureimage')
const axios = require('axios')
const fs = require('fs')
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
  this._commentsRef = this._firechatRef.child('comments')
  this._likesRef = this._firechatRef.child('likes')

  this._jobsRef = this._firechatRef.child('jobs')
  this._jobapplicationsRef = this._firechatRef.child('jobapplications')
  this._joblikesRef = this._firechatRef.child('joblikes')

  this._companysRef = this._firechatRef.child('companys')
  this._companyapplicationsRef = this._firechatRef.child('companyapplications')
  this._companylikesRef = this._firechatRef.child('companylikes')

  this._projectsRef = this._firechatRef.child('projects')
  this._projectapplicationsRef = this._firechatRef.child('projectapplications')
  this._projectlikesRef = this._firechatRef.child('projectlikes')

  this._talentsRef = this._firechatRef.child('talents')
  this._talentapplicationsRef = this._firechatRef.child('talentapplications')
  this._talentlikesRef = this._firechatRef.child('talentlikes')
  this._dispatchersRef = this._firechatRef.child('dispatchers')
  this._dispatcherapplicationsRef = this._firechatRef.child('dispatcherapplications')
  this._dispatcherlikesRef = this._firechatRef.child('dispatcherlikes')
  this._consultantsRef = this._firechatRef.child('consultants')
  this._consultantapplicationsRef = this._firechatRef.child('consultantapplications')
  this._consultantlikesRef = this._firechatRef.child('consultantlikes')

  this._knowledgesRef = this._firechatRef.child('knowledges')
  this._knowledgecontentsRef = this._firechatRef.child('knowledgecontents')
  this._knowledgecertificatesRef = this._firechatRef.child('knowledgecertificates')
  this._knowledgeapplicationsRef = this._firechatRef.child('knowledgeapplications')
  this._knowledgelikesRef = this._firechatRef.child('knowledgelikes')
  this._knowledgecommentsRef = this._firechatRef.child('knowledgecomments')

  this._toolsRef = this._firechatRef.child('tools')
  this._toolapplicationsRef = this._firechatRef.child('toolapplications')
  this._toollikesRef = this._firechatRef.child('toollikes')
  this._eventsRef = this._firechatRef.child('events')
  this._eventapplicationsRef = this._firechatRef.child('eventapplications')
  this._eventlikesRef = this._firechatRef.child('eventlikes')

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
Firechat.prototype.createRoom = function(roomName, roomType, avatar, header, location, callback) {
  const self = this
  self.checkRoomExists(avatar, function(roomlist) {
    if (!roomlist) {
      const newRoomRef = this._roomRef.push()

      const newRoom = {
        id: newRoomRef.key,
        name: roomName,
        type: roomType || 'public',
        avatar: avatar,
        header: header,
        location: location,
        createdByUserId: this._userId,
        createdByUserName: this._userName,
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
  })
}

// Enter a chat room.
Firechat.prototype.enterRoom = function(roomId) {
  const self = this
  self.getRoom(roomId, function(room) {
    const roomName = room.name
    const avatar = room.avatar
    const header = room.header
    const location = room.location

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
        avatar: avatar,
        header: header,
        location: location,
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
    const roomlist = snapshot.val()
    const val = []
    for (const room in roomlist) {
      if (roomlist[room].createdByUserId === self._userId || roomlist[room].avatar === self._userId) {
        val.push(roomlist[room])
      }
    }
    cb(val)
  })
}

Firechat.prototype.checkRoomExists = function(userId, cb) {
  const self = this
  self._roomRef.once('value', function(snapshot) {
    const roomlist = snapshot.val()
    const val = []
    for (const room in roomlist) {
      if ((roomlist[room].createdByUserId === self._userId && roomlist[room].avatar === userId) ||
        (roomlist[room].createdByUserId === userId && roomlist[room].avatar === self._userId)) {
        val.push(roomlist[room])
      }
    }
    cb(val)
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

Firechat.prototype.getRoomMessages = function() {
  const self = this
  const roomId = arguments[0]
  let query = self._firechatRef.child('room-messages').child(roomId)
  const cb = arguments[arguments.length - 1]
  let limit = null

  if (arguments.length > 2) {
    limit = arguments[1]
  }

  query = (limit) ? query.limitToLast(limit) : query

  query.once('value', function(snapshot) {
    const roommessages = snapshot.val() || {}

    global.setTimeout(function() {
      cb(roommessages)
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
    like_count: 0,
    original_pic: pic,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newPostRef.set(newPost, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.post_count) {
          current.post_count++
        } else {
          current.post_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newPostRef.key)
        }
      })
    }
  })
}

Firechat.prototype.addComment = function(postKey, comments, callback) {
  const self = this
  const newCommentsRef = self._commentsRef.child('data').child(postKey).push()
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
      self._postsRef.child('data').child(postKey).transaction(function(current) {
        if (current) {
          current.comment_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(postKey)
        }
      })
    }
  })
}

Firechat.prototype.likePost = function(postKey, callback) {
  const self = this
  const newLikesRef = self._likesRef.child('data').child(postKey).push()

  const newlike = {
    id: newLikesRef.key,
    postid: postKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._postsRef.child('data').child(postKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
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
  const self = this
  self._postsRef.child('data').child(postKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.post_count) {
          current.post_count--
        } else {
          current.post_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getPostComments = function(postkey, cb) {
  const self = this

  self._commentsRef.child('data').child(postkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removePostComment = function(postKey, commentKey, callback) {
  const self = this
  self._commentsRef.child('data').child(postKey).child(commentKey).remove(function(error) {
    if (!error) {
      self._postsRef.child('data').child(postKey).transaction(function(current) {
        if (current) {
          current.comment_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getPostLikes = function(postkey, cb) {
  const self = this

  self._likesRef.child('data').child(postkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikePost = function(postKey, likeKey, callback) {
  const self = this
  self._likesRef.child('data').child(postKey).child(likeKey).remove(function(error) {
    if (!error) {
      self._postsRef.child('data').child(postKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.addContact = function(userid, name, header, location, callback) {
  const self = this
  const newContactsRef = self._userRef.child('contacts').push()

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
      self._userRef.transaction(function(current) {
        if (current && current.contact_count) {
          current.contact_count++
        } else {
          current.contact_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newContactsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.removeContact = function(userkey, callback) {
  const self = this

  self._userRef.child('contacts').child(userkey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.contact_count) {
          current.contact_count--
        } else {
          current.contact_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getContactList = function(cb) {
  const self = this

  self._userRef.child('contacts').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.createJob = function(data, callback) {
  const self = this
  const newJobRef = self._jobsRef.child('data').push()

  const newJob = {
    id: newJobRef.key,
    name: data.name,
    introduce: data.introduce,
    jobtype: data.jobtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newJobRef.set(newJob, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.job_count) {
          current.job_count++
        } else {
          current.job_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newJobRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateJob = function(jobKey, data, callback) {
  const self = this
  const newJobRef = self._jobsRef.child('data').child(jobKey)

  const newJob = {
    name: data.name,
    introduce: data.introduce,
    jobtype: data.jobtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newJobRef.update(newJob, function(error) {
    if (!error) {
      callback(newJobRef.key)
    }
  })
}

Firechat.prototype.addJobApplication = function(jobKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._jobapplicationsRef.child('data').child(jobKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    jobid: jobKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._jobsRef.child('data').child(jobKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateJobApplication = function(jobKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._jobapplicationsRef.child('data').child(jobKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for job owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Job', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeJob = function(jobKey, callback) {
  const self = this
  const newLikesRef = self._joblikesRef.child('data').child(jobKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    jobid: jobKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._jobsRef.child('data').child(jobKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getJobList = function(cb) {
  const self = this

  self._jobsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getJobByKey = function(jobKey, cb) {
  const self = this

  self._jobsRef.child('data').child(jobKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getJobListByType = function(jobType, cb) {
  const self = this

  self._jobsRef.child('data').orderByChild('jobtype').equalTo(jobType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getJobListByOwner = function(cb) {
  const self = this

  self._jobsRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getJobListByApplication = function(cb) {
  const self = this
  self._jobsRef.child('data').once('value', function(snapshot) {
    const jobs = snapshot.val()
    const val = []
    for (const job in jobs) {
      self._jobapplicationsRef.child('data').child(job).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(jobs[job])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeJob = function(jobKey, callback) {
  const self = this
  self._jobsRef.child('data').child(jobKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.job_count) {
          current.job_count--
        } else {
          current.job_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getJobApplications = function(jobkey, cb) {
  const self = this

  self._jobapplicationsRef.child('data').child(jobkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyJobApplication = function(jobkey, cb) {
  const self = this

  self._jobapplicationsRef.child('data').child(jobkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeJobApplication = function(jobKey, applicationKey, callback) {
  const self = this
  self._jobapplicationsRef.child('data').child(jobKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._jobsRef.child('data').child(jobKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getJobLikes = function(jobkey, cb) {
  const self = this

  self._joblikesRef.child('data').child(jobkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeJob = function(jobKey, likeKey, callback) {
  const self = this
  self._joblikesRef.child('data').child(jobKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._jobsRef.child('data').child(jobKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createCompany = function(data, callback) {
  const self = this
  const newCompanyRef = self._companysRef.child('data').push()

  const newCompany = {
    id: newCompanyRef.key,
    name: data.name,
    introduce: data.introduce,
    companytype: data.companytype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newCompanyRef.set(newCompany, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.company_count) {
          current.company_count++
        } else {
          current.company_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newCompanyRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateCompany = function(companyKey, data, callback) {
  const self = this
  const newCompanyRef = self._companysRef.child('data').child(companyKey)

  const newCompany = {
    name: data.name,
    introduce: data.introduce,
    companytype: data.companytype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newCompanyRef.update(newCompany, function(error) {
    if (!error) {
      callback(newCompanyRef.key)
    }
  })
}

Firechat.prototype.addCompanyApplication = function(companyKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._companyapplicationsRef.child('data').child(companyKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    companyid: companyKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._companysRef.child('data').child(companyKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateCompanyApplication = function(companyKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._companyapplicationsRef.child('data').child(companyKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Company owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Company', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeCompany = function(companyKey, callback) {
  const self = this
  const newLikesRef = self._companylikesRef.child('data').child(companyKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    companyid: companyKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._companysRef.child('data').child(companyKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getCompanyList = function(cb) {
  const self = this

  self._companysRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getCompanyByKey = function(companyKey, cb) {
  const self = this

  self._companysRef.child('data').child(companyKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getCompanyListByType = function(companyType, cb) {
  const self = this

  self._companysRef.child('data').orderByChild('companytype').equalTo(companyType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getCompanyListByOwner = function(cb) {
  const self = this

  self._companysRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getCompanyListByApplication = function(cb) {
  const self = this
  self._companysRef.child('data').once('value', function(snapshot) {
    const companys = snapshot.val()
    const val = []
    for (const company in companys) {
      self._companyapplicationsRef.child('data').child(company).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(companys[company])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeCompany = function(companyKey, callback) {
  const self = this
  self._companysRef.child('data').child(companyKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.company_count) {
          current.company_count--
        } else {
          current.company_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getCompanyApplications = function(companykey, cb) {
  const self = this

  self._companyapplicationsRef.child('data').child(companykey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyCompanyApplication = function(companykey, cb) {
  const self = this

  self._companyapplicationsRef.child('data').child(companykey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeCompanyApplication = function(companyKey, applicationKey, callback) {
  const self = this
  self._companyapplicationsRef.child('data').child(companyKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._companysRef.child('data').child(companyKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getCompanyLikes = function(companykey, cb) {
  const self = this

  self._companylikesRef.child('data').child(companykey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeCompany = function(companyKey, likeKey, callback) {
  const self = this
  self._companylikesRef.child('data').child(companyKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._companysRef.child('data').child(companyKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createProject = function(data, callback) {
  const self = this
  const newProjectRef = self._projectsRef.child('data').push()

  const newProject = {
    id: newProjectRef.key,
    name: data.name,
    introduce: data.introduce,
    projecttype: data.projecttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newProjectRef.set(newProject, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.project_count) {
          current.project_count++
        } else {
          current.project_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newProjectRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateProject = function(projectKey, data, callback) {
  const self = this
  const newProjectRef = self._projectsRef.child('data').child(projectKey)

  const newProject = {
    name: data.name,
    introduce: data.introduce,
    projecttype: data.projecttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newProjectRef.update(newProject, function(error) {
    if (!error) {
      callback(newProjectRef.key)
    }
  })
}

Firechat.prototype.addProjectApplication = function(projectKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._projectapplicationsRef.child('data').child(projectKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    projectid: projectKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._projectsRef.child('data').child(projectKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateProjectApplication = function(projectKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._projectapplicationsRef.child('data').child(projectKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Project owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Project', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeProject = function(projectKey, callback) {
  const self = this
  const newLikesRef = self._projectlikesRef.child('data').child(projectKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    projectid: projectKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._projectsRef.child('data').child(projectKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getProjectList = function(cb) {
  const self = this

  self._projectsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getProjectByKey = function(projectKey, cb) {
  const self = this

  self._projectsRef.child('data').child(projectKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getProjectListByType = function(projectType, cb) {
  const self = this

  self._projectsRef.child('data').orderByChild('projecttype').equalTo(projectType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getProjectListByOwner = function(cb) {
  const self = this

  self._projectsRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getProjectListByApplication = function(cb) {
  const self = this
  self._projectsRef.child('data').once('value', function(snapshot) {
    const projects = snapshot.val()
    const val = []
    for (const project in projects) {
      self._projectapplicationsRef.child('data').child(project).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(projects[project])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeProject = function(projectKey, callback) {
  const self = this
  self._projectsRef.child('data').child(projectKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.project_count) {
          current.project_count--
        } else {
          current.project_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getProjectApplications = function(projectkey, cb) {
  const self = this

  self._projectapplicationsRef.child('data').child(projectkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyProjectApplication = function(projectkey, cb) {
  const self = this

  self._projectapplicationsRef.child('data').child(projectkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeProjectApplication = function(projectKey, applicationKey, callback) {
  const self = this
  self._projectapplicationsRef.child('data').child(projectKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._projectsRef.child('data').child(projectKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getProjectLikes = function(projectkey, cb) {
  const self = this

  self._projectlikesRef.child('data').child(projectkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeProject = function(projectKey, likeKey, callback) {
  const self = this
  self._projectlikesRef.child('data').child(projectKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._projectsRef.child('data').child(projectKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createTalent = function(data, callback) {
  const self = this
  const newTalentRef = self._talentsRef.child('data').push()

  const newTalent = {
    id: newTalentRef.key,
    name: data.name,
    introduce: data.introduce,
    talenttype: data.talenttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newTalentRef.set(newTalent, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.talent_count) {
          current.talent_count++
        } else {
          current.talent_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newTalentRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateTalent = function(talentKey, data, callback) {
  const self = this
  const newTalentRef = self._talentsRef.child('data').child(talentKey)

  const newTalent = {
    name: data.name,
    introduce: data.introduce,
    talenttype: data.talenttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newTalentRef.update(newTalent, function(error) {
    if (!error) {
      callback(newTalentRef.key)
    }
  })
}

Firechat.prototype.addTalentApplication = function(talentKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._talentapplicationsRef.child('data').child(talentKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    talentid: talentKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._talentsRef.child('data').child(talentKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateTalentApplication = function(talentKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._talentapplicationsRef.child('data').child(talentKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Talent owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Talent', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeTalent = function(talentKey, callback) {
  const self = this
  const newLikesRef = self._talentlikesRef.child('data').child(talentKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    talentid: talentKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._talentsRef.child('data').child(talentKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getTalentList = function(cb) {
  const self = this

  self._talentsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getTalentByKey = function(talentKey, cb) {
  const self = this

  self._talentsRef.child('data').child(talentKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getTalentListByType = function(talentType, cb) {
  const self = this

  self._talentsRef.child('data').orderByChild('talenttype').equalTo(talentType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getTalentListByOwner = function(cb) {
  const self = this

  self._talentsRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getTalentListByApplication = function(cb) {
  const self = this
  self._talentsRef.child('data').once('value', function(snapshot) {
    const talents = snapshot.val()
    const val = []
    for (const talent in talents) {
      self._talentapplicationsRef.child('data').child(talent).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(talents[talent])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeTalent = function(talentKey, callback) {
  const self = this
  self._talentsRef.child('data').child(talentKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.talent_count) {
          current.talent_count--
        } else {
          current.talent_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getTalentApplications = function(talentkey, cb) {
  const self = this

  self._talentapplicationsRef.child('data').child(talentkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyTalentApplication = function(talentkey, cb) {
  const self = this

  self._talentapplicationsRef.child('data').child(talentkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeTalentApplication = function(talentKey, applicationKey, callback) {
  const self = this
  self._talentapplicationsRef.child('data').child(talentKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._talentsRef.child('data').child(talentKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getTalentLikes = function(talentkey, cb) {
  const self = this

  self._talentlikesRef.child('data').child(talentkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeTalent = function(talentKey, likeKey, callback) {
  const self = this
  self._talentlikesRef.child('data').child(talentKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._talentsRef.child('data').child(talentKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createConsultant = function(data, callback) {
  const self = this
  const newConsultantRef = self._consultantsRef.child('data').push()

  const newConsultant = {
    id: newConsultantRef.key,
    name: data.name,
    introduce: data.introduce,
    consultanttype: data.consultanttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newConsultantRef.set(newConsultant, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.consultant_count) {
          current.consultant_count++
        } else {
          current.consultant_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newConsultantRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateConsultant = function(consultantKey, data, callback) {
  const self = this
  const newConsultantRef = self._consultantsRef.child('data').child(consultantKey)

  const newConsultant = {
    name: data.name,
    introduce: data.introduce,
    consultanttype: data.consultanttype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newConsultantRef.update(newConsultant, function(error) {
    if (!error) {
      callback(newConsultantRef.key)
    }
  })
}

Firechat.prototype.addConsultantApplication = function(consultantKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._consultantapplicationsRef.child('data').child(consultantKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    consultantid: consultantKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._consultantsRef.child('data').child(consultantKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateConsultantApplication = function(consultantKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._consultantapplicationsRef.child('data').child(consultantKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Consultant owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Consultant', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeConsultant = function(consultantKey, callback) {
  const self = this
  const newLikesRef = self._consultantlikesRef.child('data').child(consultantKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    consultantid: consultantKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._consultantsRef.child('data').child(consultantKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getConsultantList = function(cb) {
  const self = this

  self._consultantsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getConsultantByKey = function(consultantKey, cb) {
  const self = this

  self._consultantsRef.child('data').child(consultantKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getConsultantListByType = function(consultantType, cb) {
  const self = this

  self._consultantsRef.child('data').orderByChild('consultanttype').equalTo(consultantType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getConsultantListByOwner = function(cb) {
  const self = this

  self._consultantsRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getConsultantListByApplication = function(cb) {
  const self = this
  self._consultantsRef.child('data').once('value', function(snapshot) {
    const consultants = snapshot.val()
    const val = []
    for (const consultant in consultants) {
      self._consultantapplicationsRef.child('data').child(consultant).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(consultants[consultant])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeConsultant = function(consultantKey, callback) {
  const self = this
  self._consultantsRef.child('data').child(consultantKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.consultant_count) {
          current.consultant_count--
        } else {
          current.consultant_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getConsultantApplications = function(consultantkey, cb) {
  const self = this

  self._consultantapplicationsRef.child('data').child(consultantkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyConsultantApplication = function(consultantkey, cb) {
  const self = this

  self._consultantapplicationsRef.child('data').child(consultantkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeConsultantApplication = function(consultantKey, applicationKey, callback) {
  const self = this
  self._consultantapplicationsRef.child('data').child(consultantKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._consultantsRef.child('data').child(consultantKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getConsultantLikes = function(consultantkey, cb) {
  const self = this

  self._consultantlikesRef.child('data').child(consultantkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeConsultant = function(consultantKey, likeKey, callback) {
  const self = this
  self._consultantlikesRef.child('data').child(consultantKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._consultantsRef.child('data').child(consultantKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createDispatcher = function(data, callback) {
  const self = this
  const newDispatcherRef = self._dispatchersRef.child('data').push()

  const newDispatcher = {
    id: newDispatcherRef.key,
    name: data.name,
    introduce: data.introduce,
    dispatchertype: data.dispatchertype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newDispatcherRef.set(newDispatcher, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.dispatcher_count) {
          current.dispatcher_count++
        } else {
          current.dispatcher_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newDispatcherRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateDispatcher = function(dispatcherKey, data, callback) {
  const self = this
  const newDispatcherRef = self._dispatchersRef.child('data').child(dispatcherKey)

  const newDispatcher = {
    name: data.name,
    introduce: data.introduce,
    dispatchertype: data.dispatchertype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newDispatcherRef.update(newDispatcher, function(error) {
    if (!error) {
      callback(newDispatcherRef.key)
    }
  })
}

Firechat.prototype.addDispatcherApplication = function(dispatcherKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._dispatcherapplicationsRef.child('data').child(dispatcherKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    dispatcherid: dispatcherKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._dispatchersRef.child('data').child(dispatcherKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateDispatcherApplication = function(dispatcherKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._dispatcherapplicationsRef.child('data').child(dispatcherKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Dispatcher owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Dispatcher', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeDispatcher = function(dispatcherKey, callback) {
  const self = this
  const newLikesRef = self._dispatcherlikesRef.child('data').child(dispatcherKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    dispatcherid: dispatcherKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._dispatchersRef.child('data').child(dispatcherKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getDispatcherList = function(cb) {
  const self = this

  self._dispatchersRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getDispatcherByKey = function(dispatcherKey, cb) {
  const self = this

  self._dispatchersRef.child('data').child(dispatcherKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getDispatcherListByType = function(dispatcherType, cb) {
  const self = this

  self._dispatchersRef.child('data').orderByChild('dispatchertype').equalTo(dispatcherType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getDispatcherListByOwner = function(cb) {
  const self = this

  self._dispatchersRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getDispatcherListByApplication = function(cb) {
  const self = this
  self._dispatchersRef.child('data').once('value', function(snapshot) {
    const dispatchers = snapshot.val()
    const val = []
    for (const dispatcher in dispatchers) {
      self._dispatcherapplicationsRef.child('data').child(dispatcher).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(dispatchers[dispatcher])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeDispatcher = function(dispatcherKey, callback) {
  const self = this
  self._dispatchersRef.child('data').child(dispatcherKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.dispatcher_count) {
          current.dispatcher_count--
        } else {
          current.dispatcher_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getDispatcherApplications = function(dispatcherkey, cb) {
  const self = this

  self._dispatcherapplcationsRef.child('data').child(dispatcherkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyDispatcherApplication = function(dispatcherkey, cb) {
  const self = this

  self._dispatcherapplicationsRef.child('data').child(dispatcherkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeDispatcherApplication = function(dispatcherKey, applicationKey, callback) {
  const self = this
  self._dispatcherapplicationsRef.child('data').child(dispatcherKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._dispatchersRef.child('data').child(dispatcherKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getDispatcherLikes = function(dispatcherkey, cb) {
  const self = this

  self._dispatcherlikesRef.child('data').child(dispatcherkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeDispatcher = function(dispatcherKey, likeKey, callback) {
  const self = this
  self._dispatcherlikesRef.child('data').child(dispatcherKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._dispatchersRef.child('data').child(dispatcherKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createKnowledge = function(data, callback) {
  const self = this
  const newKnowledgeRef = self._knowledgesRef.child('data').push()

  const newKnowledge = {
    id: newKnowledgeRef.key,
    name: data.name,
    introduce: data.introduce,
    knowledgetype: data.knowledgetype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    content_count: 0,
    certificate_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newKnowledgeRef.set(newKnowledge, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.knowledge_count) {
          current.knowledge_count++
        } else {
          current.knowledge_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newKnowledgeRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateKnowledge = function(knowledgeKey, data, callback) {
  const self = this
  const newKnowledgeRef = self._knowledgesRef.child('data').child(knowledgeKey)

  const newKnowledge = {
    name: data.name,
    introduce: data.introduce,
    knowledgetype: data.knowledgetype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newKnowledgeRef.update(newKnowledge, function(error) {
    if (!error) {
      callback(newKnowledgeRef.key)
    }
  })
}

Firechat.prototype.addKnowledgeApplication = function(knowledgeKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._knowledgeapplicationsRef.child('data').child(knowledgeKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    knowledgeid: knowledgeKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateKnowledgeApplication = function(knowledgeKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._knowledgeapplicationsRef.child('data').child(knowledgeKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for knowledge owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Knowledge', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.updateLearningStatus = function(knowledgeKey, contentOrd, LearningStatus, callback) {
  const self = this
  const newLearningsRef = self._userRef.child('learnings').child(knowledgeKey)
  const newLearning = {
    contentOrd: contentOrd,
    LearningStatus: LearningStatus,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newLearningsRef.update(newLearning, function(error) {
    if (!error) {
      callback(newLearningsRef.key)
    }
  })
}

Firechat.prototype.addKnowledgeContent = function(knowledgeKey, ord, title, content, callback) {
  const self = this
  const newContentsRef = self._knowledgecontentsRef.child('data').child(knowledgeKey).child('contents').push()
  const newContent = {
    id: newContentsRef.key,
    ord: ord,
    title: title,
    content: content,
    comment_count: 0,
    comments: [],
    knowledgeid: knowledgeKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newContentsRef.set(newContent, function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.content_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newContentsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.addKnowledgeCertificate = function(knowledgeKey, callback) {
  const self = this
  const newCertificatesRef = self._knowledgecertificatesRef.child('data').child(knowledgeKey).child(this._userId)
  const newCertificate = {
    id: newCertificatesRef.key,
    knowledgeid: knowledgeKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newCertificatesRef.update(newCertificate, function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.certificate_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newCertificatesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.addKnowledgeContentComment = function(knowledgeKey, contentKey, comment, callback) {
  const self = this
  const newCommentsRef = self._knowledgecommentsRef.child('data').child(knowledgeKey).child('contents').child(contentKey).push()
  const newComment = {
    id: newCommentsRef.key,
    comment: comment,
    contentid: contentKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newCommentsRef.set(newComment, function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).once('value', function(snapshot) {
        const ownerid = snapshot.child('avatar').val()
        self._roomRef.once('value', function(snapshot2) {
          const roomlist = snapshot2.val()
          for (const room in roomlist) {
            if (roomlist[room].createdByUserId === ownerid && roomlist[room].avatar === self._userId) {
              self.sendMessage(room, comment, 'messageType')
              break
            }
          }
        })
      })
      self._knowledgecontentsRef.child('data').child(knowledgeKey).child('contents').child(contentKey).transaction(function(current) {
        if (current) {
          current.comment_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newCommentsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateKnowledgeContent = function(knowledgeKey, contentKey, ord, title, content, callback) {
  const self = this
  const newContentsRef = self._knowledgecontentsRef.child('data').child(knowledgeKey).child('contents').child(contentKey)
  const newContent = {
    ord: ord,
    title: title,
    content: content,
    knowledgeid: knowledgeKey,
    avatar: this._userId,
    name: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newContentsRef.update(newContent, function(error) {
    if (!error) {
      callback(newContentsRef.key)
    }
  })
}

Firechat.prototype.likeKnowledge = function(knowledgeKey, callback) {
  const self = this
  const newLikesRef = self._knowledgelikesRef.child('data').child(knowledgeKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    knowledgeid: knowledgeKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getKnowledgeList = function(cb) {
  const self = this

  self._knowledgesRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeByKey = function(knowledgeKey, cb) {
  const self = this

  self._knowledgesRef.child('data').child(knowledgeKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeListByType = function(knowledgeType, cb) {
  const self = this

  self._knowledgesRef.child('data').orderByChild('knowledgetype').equalTo(knowledgeType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeListByOwner = function(cb) {
  const self = this

  self._knowledgesRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeListByApplication = function(cb) {
  const self = this
  self._knowledgesRef.child('data').once('value', function(snapshot) {
    const knowledges = snapshot.val()
    const val = []
    for (const knowledge in knowledges) {
      self._knowledgeapplicationsRef.child('data').child(knowledge).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(knowledges[knowledge])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.getKnowledgeListByLearner = function(cb) {
  const self = this
  let learningStatus = {}
  self._userRef.child('learnings').once('value', function(snapshot) {
    learningStatus = snapshot.val()
  })
  self._knowledgesRef.child('data').once('value', function(snapshot) {
    const knowledges = snapshot.val()
    const val = []
    for (const knowledge in knowledges) {
      for (const status in learningStatus) {
        if (status === knowledge) {
          val.push(knowledges[knowledge])
        }
      }
    }
    cb(val)
  })
}

Firechat.prototype.removeKnowledge = function(knowledgeKey, callback) {
  const self = this
  self._knowledgesRef.child('data').child(knowledgeKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.knowledge_count) {
          current.knowledge_count--
        } else {
          current.knowledge_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getKnowledgeApplications = function(knowledgekey, cb) {
  const self = this

  self._knowledgeapplicationsRef.child('data').child(knowledgekey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyKnowledgeApplication = function(knowledgekey, cb) {
  const self = this

  self._knowledgeapplicationsRef.child('data').child(knowledgekey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeContents = function(knowledgekey, cb) {
  const self = this

  self._knowledgecontentsRef.child('data').child(knowledgekey).child('contents').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeContentComments = function(knowledgekey, contentKey, cb) {
  const self = this

  self._knowledgecommentsRef.child('data').child(knowledgekey).child('contents').child(contentKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getKnowledgeCertificates = function(knowledgekey, cb) {
  const self = this

  self._knowledgecertificatesRef.child('data').child(knowledgekey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyKnowledgeCertificate = function(knowledgekey, cb) {
  const self = this

  self._knowledgecertificatesRef.child('data').child(knowledgekey).orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getLearningStatus = function(cb) {
  const self = this

  self._userRef.child('learnings').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeKnowledgeApplication = function(knowledgeKey, applicationKey, callback) {
  const self = this
  self._knowledgeapplicationsRef.child('data').child(knowledgeKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.removeKnowledgeContent = function(knowledgeKey, contentKey, callback) {
  const self = this
  self._knowledgecontentsRef.child('data').child(knowledgeKey).child('contents').child(contentKey).remove(function(error) {
    if (!error) {
      self._knowledgecontentsRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.content_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getKnowledgeLikes = function(knowledgekey, cb) {
  const self = this

  self._knowledgelikesRef.child('data').child(knowledgekey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeKnowledge = function(knowledgeKey, likeKey, callback) {
  const self = this
  self._knowledgelikesRef.child('data').child(knowledgeKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._knowledgesRef.child('data').child(knowledgeKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createTool = function(data, callback) {
  const self = this
  const newToolRef = self._toolsRef.child('data').push()

  const newTool = {
    id: newToolRef.key,
    name: data.name,
    introduce: data.introduce,
    tooltype: data.tooltype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newToolRef.set(newTool, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.tool_count) {
          current.tool_count++
        } else {
          current.tool_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newToolRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateTool = function(toolKey, data, callback) {
  const self = this
  const newToolRef = self._toolsRef.child('data').child(toolKey)

  const newTool = {
    name: data.name,
    introduce: data.introduce,
    tooltype: data.tooltype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newToolRef.update(newTool, function(error) {
    if (!error) {
      callback(newToolRef.key)
    }
  })
}

Firechat.prototype.addToolApplication = function(toolKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._toolapplicationsRef.child('data').child(toolKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    toolid: toolKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._toolsRef.child('data').child(toolKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateToolApplication = function(toolKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._toolapplicationsRef.child('data').child(toolKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Tool owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Tool', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeTool = function(toolKey, callback) {
  const self = this
  const newLikesRef = self._toollikesRef.child('data').child(toolKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    toolid: toolKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._toolsRef.child('data').child(toolKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getToolList = function(cb) {
  const self = this

  self._toolsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getToolByKey = function(toolKey, cb) {
  const self = this

  self._toolsRef.child('data').child(toolKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getToolListByType = function(toolType, cb) {
  const self = this

  self._toolsRef.child('data').orderByChild('tooltype').equalTo(toolType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getToolListByOwner = function(cb) {
  const self = this

  self._toolsRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getToolListByApplication = function(cb) {
  const self = this
  self._toolsRef.child('data').once('value', function(snapshot) {
    const tools = snapshot.val()
    const val = []
    for (const tool in tools) {
      self._toolapplicationsRef.child('data').child(tool).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(tools[tool])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeTool = function(toolKey, callback) {
  const self = this
  self._toolsRef.child('data').child(toolKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.tool_count) {
          current.tool_count--
        } else {
          current.tool_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getToolApplications = function(toolkey, cb) {
  const self = this

  self._toolapplicationsRef.child('data').child(toolkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyToolApplication = function(toolkey, cb) {
  const self = this

  self._toolapplicationsRef.child('data').child(toolkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeToolApplication = function(toolKey, applicationKey, callback) {
  const self = this
  self._toolapplicationsRef.child('data').child(toolKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._toolsRef.child('data').child(toolKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getToolLikes = function(toolkey, cb) {
  const self = this

  self._toollikesRef.child('data').child(toolkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeTool = function(toolKey, likeKey, callback) {
  const self = this
  self._toollikesRef.child('data').child(toolKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._toolsRef.child('data').child(toolKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.createEvent = function(data, callback) {
  const self = this
  const newEventRef = self._eventsRef.child('data').push()

  const newEvent = {
    id: newEventRef.key,
    name: data.name,
    introduce: data.introduce,
    eventtype: data.eventtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    application_count: 0,
    like_count: 0,
    avatar: this._userId,
    nickname: this._userName,
    created_at: firebase.database.ServerValue.TIMESTAMP
  }

  newEventRef.set(newEvent, function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.event_count) {
          current.event_count++
        } else {
          current.event_count = 1
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newEventRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateEvent = function(eventKey, data, callback) {
  const self = this
  const newEventRef = self._eventsRef.child('data').child(eventKey)

  const newEvent = {
    name: data.name,
    introduce: data.introduce,
    eventtype: data.eventtype,
    industry: data.industry,
    area: data.area,
    address: data.address,
    Tel: data.Tel,
    Fax: data.Fax,
    Manager: data.Manager,
    HP: data.HP,
    photo: data.photo,
    avatar: this._userId,
    nickname: this._userName,
    update_at: firebase.database.ServerValue.TIMESTAMP
  }

  newEventRef.update(newEvent, function(error) {
    if (!error) {
      callback(newEventRef.key)
    }
  })
}

Firechat.prototype.addEventApplication = function(eventKey, applications, callback) {
  const self = this
  const newApplcationsRef = self._eventapplicationsRef.child('data').child(eventKey).child(this._userId)
  const newApplication = {
    id: newApplcationsRef.key,
    text: applications,
    eventid: eventKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }
  newApplcationsRef.set(newApplication, function(error) {
    if (!error) {
      self._eventsRef.child('data').child(eventKey).transaction(function(current) {
        if (current) {
          current.application_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newApplcationsRef.key)
        }
      })
    }
  })
}

Firechat.prototype.updateEventApplication = function(eventKey, applicationKey, approvalStatus, callback) {
  const self = this
  const newApplicationsRef = self._eventapplicationsRef.child('data').child(eventKey).child(applicationKey)
  const newApplication = {
    approvalStatus: approvalStatus,
    approvalAvatar: this._userId,
    approvalName: this._userName,
    approval_at: firebase.database.ServerValue.TIMESTAMP
  }

  newApplicationsRef.update(newApplication, function(error) {
    if (!error) {
      if (approvalStatus) { // create room for Event owner and learner
        newApplicationsRef.once('value', function(snapshot) {
          const roomname = snapshot.child('name').val()
          const header = roomname.charAt(0).toUpperCase()
          self.createRoom(roomname, 'private', snapshot.child('avatar').val(), header, 'Event', roomkey => {
            callback(newApplicationsRef.key)
          })
        })
      }
    }
  })
}

Firechat.prototype.likeEvent = function(eventKey, callback) {
  const self = this
  const newLikesRef = self._eventlikesRef.child('data').child(eventKey).child('likes').push()

  const newlike = {
    id: newLikesRef.key,
    eventid: eventKey,
    avatar: this._userId,
    name: this._userName,
    time: firebase.database.ServerValue.TIMESTAMP
  }

  newLikesRef.set(newlike, function(error) {
    if (!error) {
      self._eventsRef.child('data').child(eventKey).transaction(function(current) {
        if (current) {
          current.like_count++
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback(newLikesRef.key)
        }
      })
    }
  })
}

Firechat.prototype.getEventList = function(cb) {
  const self = this

  self._eventsRef.child('data').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getEventByKey = function(eventKey, cb) {
  const self = this

  self._eventsRef.child('data').child(eventKey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getEventListByType = function(eventType, cb) {
  const self = this

  self._eventsRef.child('data').orderByChild('eventtype').equalTo(eventType).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getEventListByOwner = function(cb) {
  const self = this

  self._eventsRef.child('data').orderByChild('avatar').equalTo(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getEventListByApplication = function(cb) {
  const self = this
  self._eventsRef.child('data').once('value', function(snapshot) {
    const events = snapshot.val()
    const val = []
    for (const event in events) {
      self._eventapplicationsRef.child('data').child(event).child(self._userId).once('value', function(snapshot2) {
        if (snapshot2.exists()) {
          val.push(events[event])
        }
      })
    }
    cb(val)
  })
}

Firechat.prototype.removeEvent = function(eventKey, callback) {
  const self = this
  self._eventsRef.child('data').child(eventKey).remove(function(error) {
    if (!error) {
      self._userRef.transaction(function(current) {
        if (current && current.event_count) {
          current.event_count--
        } else {
          current.event_count = 0
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getEventApplications = function(eventkey, cb) {
  const self = this

  self._eventapplicationsRef.child('data').child(eventkey).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.getMyEventApplication = function(eventkey, cb) {
  const self = this

  self._eventapplicationsRef.child('data').child(eventkey).child(this._userId).once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.removeEventApplication = function(eventKey, applicationKey, callback) {
  const self = this
  self._eventapplicationsRef.child('data').child(eventKey).child(applicationKey).remove(function(error) {
    if (!error) {
      self._eventsRef.child('data').child(eventKey).transaction(function(current) {
        if (current) {
          current.application_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.getEventLikes = function(eventkey, cb) {
  const self = this

  self._eventlikesRef.child('data').child(eventkey).child('likes').once('value', function(snapshot) {
    cb(snapshot.val())
  })
}

Firechat.prototype.unlikeEvent = function(eventKey, likeKey, callback) {
  const self = this
  self._eventlikesRef.child('data').child(eventKey).child('likes').child(likeKey).remove(function(error) {
    if (!error) {
      self._eventsRef.child('data').child(eventKey).transaction(function(current) {
        if (current) {
          current.like_count--
        }
        return current
      }, function(error, committed, snapshot) {
        if (!error && callback) {
          callback()
        }
      })
    }
  })
}

Firechat.prototype.downloadCertificateTemplate = function(certificateUrl, certificatePath, callback) {
  axios.get(certificateUrl, {responseType: 'arraybuffer'}).then(res => {
    fs.writeFileSync(certificatePath, new Buffer.From(res.data), 'binary')
    if (callback) {
      callback()
    }
  })
}

Firechat.prototype.createCertificate = function(certificatePath, myCertificatePath, callback) {
  const self = this
  const fnt = pureimage.registerFont('src/assets/fonts/SourceSansPro-Regular.ttf', 'Source Sans Pro')
  fnt.load(() => {
    pureimage.decodePNGFromStream(fs.createReadStream(certificatePath)).then((img) => {
      const ctx = img.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.font = "48pt 'Source Sans Pro'"
      const dt = new Date()
      const y = dt.getFullYear()
      const m = ('00' + (dt.getMonth() + 1)).slice(-2)
      const d = ('00' + dt.getDate()).slice(-2)
      const result = y + '/' + m + '/' + d
      ctx.fillText(self._userName, 377, 520)
      ctx.fillText(result, 377, 573)
      pureimage.encodePNGToStream(img, fs.createWriteStream(myCertificatePath)).then(() => {
        if (callback) {
          callback()
        }
      })
    })
  })
}

// })()

module.exports = { Firechat }
