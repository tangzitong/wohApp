Firebase study Guildline
====

> This page is part of the [wohApp Devlopment Guidline](dev.md)

https://firebase.google.com/docs/reference/js/firebase.database.Query

# startAt:
```
// Find all dinosaurs that are at least three meters tall.
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").startAt(3).on("child_added", function(snapshot) {
  console.log(snapshot.key)
});
```

# endAt:
```
var ref = firebase.database().ref("dinosaurs");
ref.orderByKey().endAt("pterodactyl").on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
```

# equalTo:
```
// Find all dinosaurs whose height is exactly 25 meters.
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
```

# isEqual:
```
var rootRef = firebase.database.ref();
var usersRef = rootRef.child("users");
usersRef.isEqual(rootRef);  // false
usersRef.isEqual(rootRef.child("users"));  // true
usersRef.parent.isEqual(rootRef);  // true
```

# limitToLast:
```
var rootRef = firebase.database.ref();
var usersRef = rootRef.child("users");
var usersQuery = usersRef.limitToLast(10);

usersQuery.isEqual(usersRef);  // false
usersQuery.isEqual(usersRef.limitToLast(10));  // true
usersQuery.isEqual(rootRef.limitToLast(10));  // false
usersQuery.isEqual(usersRef.orderByKey().limitToLast(10));  // false
```

# limitToFirst:
```
// Find the two shortest dinosaurs.
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").limitToFirst(2).on("child_added", function(snapshot) {
  // This will be called exactly two times (unless there are less than two
  // dinosaurs in the Database).

  // It will also get fired again if one of the first two dinosaurs is
  // removed from the data set, as a new dinosaur will now be the second
  // shortest.
  console.log(snapshot.key);
});
```

# off:
```
var onValueChange = function(dataSnapshot) {  ... };
ref.on('value', onValueChange);
ref.child('meta-data').on('child_added', onChildAdded);
// Sometime later...
ref.off('value', onValueChange);

// You must also call off() for any child listeners on ref
// to cancel those callbacks
ref.child('meta-data').off('child_added', onValueAdded);

// Or you can save a line of code by using an inline function
// and on()'s return value.
var onValueChange = ref.on('value', function(dataSnapshot) { ... });
// Sometime later...
ref.off('value', onValueChange);
```

# on:
```
ref.on('value', function(dataSnapshot) {
  ...
});

ref.on('child_added', function(childSnapshot, prevChildKey) {
  ...
});

ref.on('child_removed', function(oldChildSnapshot) {
  ...
});

ref.on('child_changed', function(childSnapshot, prevChildKey) {
  ...
});

ref.on('child_moved', function(childSnapshot, prevChildKey) {
  ...
});
```

# once:
```
// Basic usage of .once() to read the data located at ref.
ref.once('value')
  .then(function(dataSnapshot) {
    // handle read data.
  });

orderByChild:
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").on("child_added", function(snapshot) {
  console.log(snapshot.key + " was " + snapshot.val().height + " m tall");
});
```

# orderByKey:
```
var ref = firebase.database().ref("dinosaurs");
ref.orderByKey().on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
```

# orderByPriority:

# orderByValue:
```
var scoresRef = firebase.database().ref("scores");
scoresRef.orderByValue().limitToLast(3).on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    console.log("The " + data.key + " score is " + data.val());
  });
});
```

# toJSON:
```
// Calling toString() on a root Firebase reference returns the URL where its
// data is stored within the Database:
var rootRef = firebase.database().ref();
var rootUrl = rootRef.toString();
// rootUrl === "https://sample-app.firebaseio.com/".

// Calling toString() at a deeper Firebase reference returns the URL of that
// deep path within the Database:
var adaRef = rootRef.child('users/ada');
var adaURL = adaRef.toString();
// adaURL === "https://sample-app.firebaseio.com/users/ada".
```