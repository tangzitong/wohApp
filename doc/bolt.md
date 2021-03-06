Bolt study guildline
===

> This page is part of the [wohApp Devlopment Guidline](dev.md)

# 1.
```
path / {
  read() { auth != null }
  write() { auth != null }
}
```

# 2.
```
path / {
  read() { true }
  write() { true }
}
```
->
```
{
  "rules": {
    ".read": "true",
    ".write": "true"
  }
}
```

# 3.
// Allow anyone to read the list of Posts.
```
path /posts {
  read() { true }
}

// All individual Posts are writable by anyone.
path /posts/{id} is Post {
  write() { true }
}

type Post {
  validate() { this.message.length <= 140 }

  message: String,
  from: String
}
```

# 4.
```
path / is Person;

type Person {
  name: String,
  age: Number,
  isMember: Boolean,

  // Optional data (allows an Object or null/missing value).
  extra: Object | Null
}
```

# 5.
```
path /users/{id} is User;
path /rooms/{id} is Room;

type User {
  name: NameString,
  isAdmin: Boolean
}

type Room {
  name: NameString,
  creator: String
}

type NameString extends String {
  validate() { this.length > 0 && this.length <= 32 }
}
```

# 6.
```
path /users/{userid} is User {
  read() { true }
  write() { isCurrentUser(userid) }
}

type User {
  name: String,
  age: Number | Null
}

// Define isCurrentUser() function to test if the given user id
// matches the currently signed-in user.
isCurrentUser(uid) { auth != null && auth.uid == uid }
```

# 7.
```
path /posts/{id} is Post {
  read() { true }
  write() { true }
}

type Post {
  message: String,
  modified: CurrentTimestamp,
  created: InitialTimestamp
}

type CurrentTimestamp extends Number {
  validate() { this == now }
}

type InitialTimestamp extends Number {
  validate() { initial(this, now) }
}

// Returns true if the value is intialized to init, or if it retains it's prior
// value, otherwise.
initial(value, init) { value == (prior(value) == null ? init : prior(value)) }
```

# 8.
```
//
// Room Names
//
path /rooms_names is String[] {
  read() { isSignedIn() }
}

getRoomName(id) { prior(root.room_names[id]) }

//
// Room Members
//
path /members/{room_id} {
  read() { isRoomMember(room_id) }
}

path /members/{room_id}/{user_id} is NameString {
  write() { isCurrentUser(user_id) }
}

isRoomMember(room_id) { isSignedIn() && prior(root.members[room_id][auth.uid]) != null }

//
// Messages
//
path /messages/{room_id} {
  read() { isRoomMember(room_id) }
  validate() { getRoomName(room_id) != null }
}

path /messages/{room_id}/{message_id} is Message {
  write() { createOnly(this) && isRoomMember(room_id) }
}

type Message {
  name: NameString,
  message: MessageString,
  timestamp: CurrentTimestamp,
}

type MessageString extends String {
  validate() { this.length > 0 && this.length < 50 }
}

//
// Helper Types
//
type CurrentTimestamp extends Number {
  validate() { this == now }
}

type NameString {
  validate() { this.length > 0 && this.length < 20 }
}

//
// Helper Functions
//
isCurrentUser(uid) { isSignedIn() && auth.uid == uid }
isSignedIn() { auth != null }
createOnly(value) { prior(value) == null && value != null }
```
