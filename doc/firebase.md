Firebase study Guildline
====

> This page is part of the [wohApp Devlopment Guidline](dev.md)

# index
Modules
* app
* auth
* database
* firestore
* functions
* messaging
* storage
Interfaces
* FirebaseError
* User
* UserInfo
Variables
* SDK_VERSION
* apps
Functions
* initializeApp

# app
firebase.app.App 
* name: string
```
// The default app's name is "[DEFAULT]"
firebase.initializeApp(defaultAppConfig);
console.log(firebase.app().name);  // "[DEFAULT]"
```
* options: Object
```
var app = firebase.initializeApp(config);
console.log(app.options.databaseURL === config.databaseURL);  // true
```
* auth(): Auth
```
var auth = app.auth();
// The above is shorthand for:
// var auth = firebase.auth(app);
```
* database(url?: string): Database
```
var database = app.database();
// The above is shorthand for:
// var database = firebase.database(app);
```
* delete(): Promise<any>
```
app.delete()
  .then(function() {
    console.log("App deleted successfully");
  })
  .catch(function(error) {
    console.log("Error deleting app:", error);
  });
```
* firestore(): Firestore
* functions(region?: string): Functions
* messaging(): Messaging
```
var messaging = app.messaging();
// The above is shorthand for:
// var messaging = firebase.messaging(app);
```
* storage(url?: string): Storage
```
var storage = app.storage();
// The above is shorthand for:
// var storage = firebase.storage(app);
```

# auth
firebase. auth. Auth 
* Persistence: string
```
An enumeration of the possible persistence mechanism types.
```
* app
```
var app = auth.app;
```
* currentUser: User | null
```
The currently signed-in user (or null).
```
* languageCode: string | null
```
The current Auth instance's language code. This is a readable/writable property. When set to null, the default Firebase Console language setting is applied. The language code will propagate to email action templates (password reset, email verification and email change revocation), SMS templates for phone authentication, reCAPTCHA verifier and OAuth popup/redirect operations provided the specified providers support localization with the language code specified.
```
* settings: AuthSettings
```
The current Auth instance's settings. This is used to edit/read configuration related options like app verification mode for phone authentication.
```
* applyActionCode(code: string): Promise<void>
```
Applies a verification code sent to the user by email or other out-of-band mechanism.
```
* checkActionCode(code: string): Promise<ActionCodeInfo>
```
Checks a verification code sent to the user by email or other out-of-band mechanism.
Returns metadata about the code.
```
* confirmPasswordReset(code: string, newPassword: string): Promise<void>
```
Completes the password reset process, given a confirmation code and new password.
```
* createUserWithEmailAndPassword(email: string, password: string): Promise<UserCredential>
```
firebase.auth().createUserWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode == 'auth/weak-password') {
    alert('The password is too weak.');
  } else {
    alert(errorMessage);
  }
  console.log(error);
});
```
* fetchProvidersForEmail(email: string): Promise<Array<string>>
```
Gets the list of provider IDs that can be used to sign in for the given email address. Useful for an "identifier-first" sign-in flow.
```
* fetchSignInMethodsForEmail(email: string): Promise<Array<string>>
```
Gets the list of possible sign in methods for the given email address. This is useful to differentiate methods of sign-in for the same provider, eg. EmailAuthProvider which has 2 methods of sign-in, email/password and email/link.
```
* getRedirectResult(): Promise<UserCredential>
```
Returns a UserCredential from the redirect-based sign-in flow.
If sign-in succeeded, returns the signed in user. If sign-in was unsuccessful, fails with an error. If no redirect operation was called, returns a UserCredential with a null User.
```
```
// First, we perform the signInWithRedirect.
// Creates the provider object.
var provider = new firebase.auth.FacebookAuthProvider();
// You can add additional scopes to the provider:
provider.addScope('email');
provider.addScope('user_friends');
// Sign in with redirect:
auth.signInWithRedirect(provider)
////////////////////////////////////////////////////////////
// The user is redirected to the provider's sign in flow...
////////////////////////////////////////////////////////////
// Then redirected back to the app, where we check the redirect result:
auth.getRedirectResult().then(function(result) {
  // The firebase.User instance:
  var user = result.user;
  // The Facebook firebase.auth.AuthCredential containing the Facebook
  // access token:
  var credential = result.credential;
  // As this API can be used for sign-in, linking and reauthentication,
  // check the operationType to determine what triggered this redirect
  // operation.
  var operationType = result.operationType;
}, function(error) {
  // The provider's account email, can be used in case of
  // auth/account-exists-with-different-credential to fetch the providers
  // linked to the email:
  var email = error.email;
  // The provider's credential:
  var credential = error.credential;
  // In case of auth/account-exists-with-different-credential error,
  // you can fetch the providers using this:
  if (error.code === 'auth/account-exists-with-different-credential') {
    auth.fetchProvidersForEmail(email).then(function(providers) {
      // The returned 'providers' is a list of the available providers
      // linked to the email address. Please refer to the guide for a more
      // complete explanation on how to recover from this error.
    });
  }
});
```
* isSignInWithEmailLink(emailLink: string): boolean
```
Checks if an incoming link is a sign-in with email link.
```
* onAuthStateChanged(nextOrObserver: Observer<any> | function, error?: function, completed?: firebase.Unsubscribe): firebase.Unsubscribe
```
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  }
});
```
* onIdTokenChanged(nextOrObserver: Observer<any> | function, error?: function, completed?: firebase.Unsubscribe): firebase.Unsubscribe
```
firebase.auth().onIdTokenChanged(function(user) {
  if (user) {
    // User is signed in or token was refreshed.
  }
});
```
* sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings | null): Promise<void>
```
var actionCodeSettings = {
  url: 'https://www.example.com/?email=user@example.com',
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  handleCodeInApp: true
};
firebase.auth().sendPasswordResetEmail(
    'user@example.com', actionCodeSettings)
    .then(function() {
      // Password reset email sent.
    })
    .catch(function(error) {
      // Error occurred. Inspect error.code.
    });
```
* sendSignInLinkToEmail(email: string, actionCodeSettings: ActionCodeSettings): Promise<void>
```
var actionCodeSettings = {
  // The URL to redirect to for sign-in completion. This is also the deep
  // link for mobile redirects. The domain (www.example.com) for this URL
  // must be whitelisted in the Firebase Console.
  url: 'https://www.example.com/finishSignUp?cartId=1234',
  iOS: {
    bundleId: 'com.example.ios'
  },
  android: {
    packageName: 'com.example.android',
    installApp: true,
    minimumVersion: '12'
  },
  // This must be true.
  handleCodeInApp: true
};
firebase.auth().sendSignInLinkToEmail('user@example.com', actionCodeSettings)
    .then(function() {
      // The link was successfully sent. Inform the user. Save the email
      // locally so you don't need to ask the user for it again if they open
      // the link on the same device.
    })
    .catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
    });
```
* setPersistence(persistence: Persistence): Promise<void>
```
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function() {
  // Existing and future Auth states are now persisted in the current
  // session only. Closing the window would clear any existing state even if
  // a user forgets to sign out.
});
```
* signInAndRetrieveDataWithCredential(credential: AuthCredential): Promise<UserCredential>
```
Asynchronously signs in with the given credentials, and returns any available additional user information, such as user name.
```
* signInAndRetrieveDataWithCustomToken(token: string): Promise<UserCredential>
```
firebase.auth().signInAndRetrieveDataWithCustomToken(token)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/invalid-custom-token') {
        alert('The token you provided is not valid.');
      } else {
        console.error(error);
      }
    });
```
* signInAndRetrieveDataWithEmailAndPassword(email: string, password: string): Promise<UserCredential>
```
firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        alert('Wrong password.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
    });
```
* signInAnonymously(): Promise<UserCredential>
```
firebase.auth().signInAnonymously().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  if (errorCode === 'auth/operation-not-allowed') {
    alert('You must enable Anonymous auth in the Firebase Console.');
  } else {
    console.error(error);
  }
});
```
* signInAnonymouslyAndRetrieveData(): Promise<UserCredential>
```
firebase.auth().signInAnonymouslyAndRetrieveData().catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;

  if (errorCode === 'auth/operation-not-allowed') {
    alert('You must enable Anonymous auth in the Firebase Console.');
  } else {
    console.error(error);
  }
});
```
* signInWithCredential(credential: AuthCredential): Promise<User>
```
firebase.auth().signInWithCredential(credential).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  // The email of the user's account used.
  var email = error.email;
  // The firebase.auth.AuthCredential type that was used.
  var credential = error.credential;
  if (errorCode === 'auth/account-exists-with-different-credential') {
    alert('Email already associated with another account.');
    // Handle account linking here, if using.
  } else {
    console.error(error);
  }
 });
 ```
 * signInWithCustomToken(token: string): Promise<UserCredential>
 ```
 firebase.auth().signInWithCustomToken(token).catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/invalid-custom-token') {
    alert('The token you provided is not valid.');
  } else {
    console.error(error);
  }
});
```
* signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential>
```
firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    alert('Wrong password.');
  } else {
    alert(errorMessage);
  }
  console.log(error);
});
```
* signInWithEmailLink(email: string, emailLink?: string): Promise<UserCredential>
```
firebase.auth().signInWithEmailLink(email, emailLink)
    .catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
```
* signInWithPhoneNumber(phoneNumber: string, applicationVerifier: ApplicationVerifier): Promise<ConfirmationResult>
```
// 'recaptcha-container' is the ID of an element in the DOM.
var applicationVerifier = new firebase.auth.RecaptchaVerifier(
    'recaptcha-container');
firebase.auth().signInWithPhoneNumber(phoneNumber, applicationVerifier)
    .then(function(confirmationResult) {
      var verificationCode = window.prompt('Please enter the verification ' +
          'code that was sent to your mobile device.');
      return confirmationResult.confirm(verificationCode);
    })
    .catch(function(error) {
      // Handle Errors here.
    });
```
* signInWithPopup(provider: AuthProvider): Promise<UserCredential>
```
// Creates the provider object.
var provider = new firebase.auth.FacebookAuthProvider();
// You can add additional scopes to the provider:
provider.addScope('email');
provider.addScope('user_friends');
// Sign in with popup:
auth.signInWithPopup(provider).then(function(result) {
  // The firebase.User instance:
  var user = result.user;
  // The Facebook firebase.auth.AuthCredential containing the Facebook
  // access token:
  var credential = result.credential;
}, function(error) {
  // The provider's account email, can be used in case of
  // auth/account-exists-with-different-credential to fetch the providers
  // linked to the email:
  var email = error.email;
  // The provider's credential:
  var credential = error.credential;
  // In case of auth/account-exists-with-different-credential error,
  // you can fetch the providers using this:
  if (error.code === 'auth/account-exists-with-different-credential') {
    auth.fetchProvidersForEmail(email).then(function(providers) {
      // The returned 'providers' is a list of the available providers
      // linked to the email address. Please refer to the guide for a more
      // complete explanation on how to recover from this error.
    });
  }
});
```
* signOut(): Promise<void>
```
Signs out the current user.
```
* updateCurrentUser(user: User | null): Promise<void>
```
Asynchronously sets the provided user as currentUser on the current Auth instance. A new instance copy of the user provided will be made and set as currentUser.
```
* useDeviceLanguage(): void
```
Sets the current language to the default device/browser preference.
```
* verifyPasswordResetCode
```
Checks a password reset code sent to the user by email or other out-of-band mechanism.
```
# database
firebase. database 
* EventType: "value" | "child_added" | "child_changed" | "child_moved" | "child_removed"
* enableLogging(logger?: boolean | function, persistent?: boolean): any
Logs debugging information to the console.
```
// Enable logging
firebase.database.enableLogging(true);
```
```
// Provide custom logger which prefixes log statements with "[FIREBASE]"
firebase.database.enableLogging(function(message) {
  console.log("[FIREBASE]", message);
});
```
## firebase.database.Database
* app: App
```
var app = database.app;
```
* goOffline(): any
```
firebase.database().goOffline();
```
* goOnline(): any
```
firebase.database().goOnline();
```
* ref(path?: string): Reference
```
// Get a reference to the root of the Database
var rootRef = firebase.database().ref();
```
```
// Get a reference to the /users/ada node
var adaRef = firebase.database().ref("users/ada");
// The above is shorthand for the following operations:
//var rootRef = firebase.database().ref();
//var adaRef = rootRef.child("users/ada");
```
* refFromURL(url: string): Reference
```
// Get a reference to the root of the Database
var rootRef = firebase.database().ref("https://<DATABASE_NAME>.firebaseio.com");
```

## firebase.database.DataSnapshot
A DataSnapshot contains data from a Database location.
* key: string | null
```
// Assume we have the following data in the Database:
{
  "name": {
    "first": "Ada",
    "last": "Lovelace"
  }
}

var ref = firebase.database().ref("users/ada");
ref.once("value")
  .then(function(snapshot) {
    var key = snapshot.key; // "ada"
    var childKey = snapshot.child("name/last").key; // "last"
  });
```
* ref: Reference
The Reference for the location that generated this DataSnapshot.
* child(path: string): DataSnapshot
```
// Assume we have the following data in the Database:
{
  "name": {
    "first": "Ada",
    "last": "Lovelace"
  }
}

// Test for the existence of certain keys within a DataSnapshot
var ref = firebase.database().ref("users/ada");
ref.once("value")
  .then(function(snapshot) {
    var name = snapshot.child("name").val(); // {first:"Ada",last:"Lovelace"}
    var firstName = snapshot.child("name/first").val(); // "Ada"
    var lastName = snapshot.child("name").child("last").val(); // "Lovelace"
    var age = snapshot.child("age").val(); // null
  });
```
* exists(): boolean
```
// Assume we have the following data in the Database:
{
  "name": {
    "first": "Ada",
    "last": "Lovelace"
  }
}

// Test for the existence of certain keys within a DataSnapshot
var ref = firebase.database().ref("users/ada");
ref.once("value")
  .then(function(snapshot) {
    var a = snapshot.exists();  // true
    var b = snapshot.child("name").exists(); // true
    var c = snapshot.child("name/first").exists(); // true
    var d = snapshot.child("name/middle").exists(); // false
  });
```
* exportVal(): any
Exports the entire contents of the DataSnapshot as a JavaScript object.
* forEach(action: function): boolean
Enumerates the top-level children in the DataSnapshot.
```
// Assume we have the following data in the Database:
{
  "users": {
    "ada": {
      "first": "Ada",
      "last": "Lovelace"
    },
    "alan": {
      "first": "Alan",
      "last": "Turing"
    }
  }
}

// Loop through users in order with the forEach() method. The callback
// provided to forEach() will be called synchronously with a DataSnapshot
// for each child:
var query = firebase.database().ref("users").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
  });
});
```
```
// You can cancel the enumeration at any point by having your callback
// function return true. For example, the following code sample will only
// fire the callback function one time:
var query = firebase.database().ref("users").orderByKey();
query.once("value")
  .then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var key = childSnapshot.key; // "ada"

      // Cancel enumeration
      return true;
  });
});
```
* getPriority(): string | number | null
Gets the priority value of the data in this DataSnapshot.
* hasChild(path: string): boolean
```
// Assume we have the following data in the Database:
{
  "name": {
    "first": "Ada",
    "last": "Lovelace"
  }
}

// Determine which child keys in DataSnapshot have data.
var ref = firebase.database().ref("users/ada");
ref.once("value")
  .then(function(snapshot) {
    var hasName = snapshot.hasChild("name"); // true
    var hasAge = snapshot.hasChild("age"); // false
  });
```
* hasChildren(): boolean
```
// Assume we have the following data in the Database:
{
  "name": {
    "first": "Ada",
    "last": "Lovelace"
  }
}

var ref = firebase.database().ref("users/ada");
ref.once("value")
  .then(function(snapshot) {
    var a = snapshot.hasChildren(); // true
    var b = snapshot.child("name").hasChildren(); // true
    var c = snapshot.child("name/first").hasChildren(); // false
  });
```
* numChildren(): number
```
// Assume we have the following data in the Database:
{
  "name": {
    "first": "Ada",
    "last": "Lovelace"
  }
}

var ref = firebase.database().ref("users/ada");
ref.once("value")
  .then(function(snapshot) {
    var a = snapshot.numChildren(); // 1 ("name")
    var b = snapshot.child("name").numChildren(); // 2 ("first", "last")
    var c = snapshot.child("name/first").numChildren(); // 0
  });
```
* val(): any
```
// Write and then read back a JavaScript object from the Database.
ref.set({ name: "Ada", age: 36 })
  .then(function() {
   return ref.once("value");
  })
  .then(function(snapshot) {
    var data = snapshot.val();
    // data is { "name": "Ada", "age": 36 }
    // data.name === "Ada"
    // data.age === 36
  });
```

## firebase.database.OnDisconnect 
The onDisconnect class allows you to write or clear data when your client disconnects from the Database server. These updates occur whether your client disconnects cleanly or not, so you can rely on them to clean up data even if a connection is dropped or a client crashes.
* cancel(onComplete?: function): Promise<any>
```
var ref = firebase.database().ref("onlineState");
ref.onDisconnect().set(false);
// ... sometime later
ref.onDisconnect().cancel();
```
* remove(onComplete?: function): Promise<any>
```
Ensures the data at this location is deleted when the client is disconnected (due to closing the browser, navigating to a new page, or network issues).
```
* set(value: any, onComplete?: function): Promise<any>
```
var ref = firebase.database().ref("users/ada/status");
ref.onDisconnect().set("I disconnected!");
```
* setWithPriority(value: any, priority: number | string | null, onComplete?: function): Promise<any>
```
Ensures the data at this location is set to the specified value and priority when the client is disconnected (due to closing the browser, navigating to a new page, or network issues).
```
* update(values: Object, onComplete?: function): Promise<any>
```
var ref = firebase.database().ref("users/ada");
ref.update({
   onlineState: true,
   status: "I'm online."
});
ref.onDisconnect().update({
  onlineState: false,
  status: "I'm offline."
});
```

## firebase.database.Reference 
A Reference represents a specific location in your Database and can be used for reading or writing data to that Database location.
* key: string | null
```
// The key of a root reference is null
var rootRef = firebase.database().ref();
var key = rootRef.key;  // key === null
```
```
// The key of any non-root reference is the last token in the path
var adaRef = firebase.database().ref("users/ada");
var key = adaRef.key;  // key === "ada"
key = adaRef.child("name/last").key;  // key === "last"
```
* parent: Reference | null
```
// The parent of a root reference is null
var rootRef = firebase.database().ref();
parent = rootRef.parent;  // parent === null
```
```
// The parent of any non-root reference is the parent location
var usersRef = firebase.database().ref("users");
var adaRef = firebase.database().ref("users/ada");
// usersRef and adaRef.parent represent the same location
```
* ref: Reference
Returns a Reference to the Query's location.
* root: Reference
```
// The root of a root reference is itself
var rootRef = firebase.database().ref();
// rootRef and rootRef.root represent the same location
```
* child(path: string): Reference
```
var usersRef = firebase.database().ref('users');
var adaRef = usersRef.child('ada');
var adaFirstNameRef = adaRef.child('name/first');
var path = adaFirstNameRef.toString();
// path is now 'https://sample-app.firebaseio.com/users/ada/name/first'
```

* startAt(value: number | string | boolean | null, key?: string): Query
```
// Find all dinosaurs that are at least three meters tall.
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").startAt(3).on("child_added", function(snapshot) {
  console.log(snapshot.key)
});
```

* endAt(value: number | string | boolean | null, key?: string): Query
```
var ref = firebase.database().ref("dinosaurs");
ref.orderByKey().endAt("pterodactyl").on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
```

* equalTo(value: number | string | boolean | null, key?: string): Query
```
// Find all dinosaurs whose height is exactly 25 meters.
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").equalTo(25).on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
```

* isEqual(other: Query | null): boolean
```
var rootRef = firebase.database.ref();
var usersRef = rootRef.child("users");
usersRef.isEqual(rootRef);  // false
usersRef.isEqual(rootRef.child("users"));  // true
usersRef.parent.isEqual(rootRef);  // true
```

* limitToFirst(limit: number): Query
```
var rootRef = firebase.database.ref();
var usersRef = rootRef.child("users");
var usersQuery = usersRef.limitToLast(10);

usersQuery.isEqual(usersRef);  // false
usersQuery.isEqual(usersRef.limitToLast(10));  // true
usersQuery.isEqual(rootRef.limitToLast(10));  // false
usersQuery.isEqual(usersRef.orderByKey().limitToLast(10));  // false
```

* limitToLast(limit: number): Query
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

* off(eventType?: EventType, callback?: function, context?: Object | null): any
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

* on(eventType: EventType, callback: function, cancelCallbackOrContext?: Object | null, context?: Object | null): function
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

* once(eventType: EventType, successCallback?: function, failureCallbackOrContext?: Object | null, context?: Object | null): Promise<DataSnapshot>
```
// Basic usage of .once() to read the data located at ref.
ref.once('value')
  .then(function(dataSnapshot) {
    // handle read data.
  });

* orderByChild(path: string): Query
var ref = firebase.database().ref("dinosaurs");
ref.orderByChild("height").on("child_added", function(snapshot) {
  console.log(snapshot.key + " was " + snapshot.val().height + " m tall");
});
```

* orderByKey(): Query
```
var ref = firebase.database().ref("dinosaurs");
ref.orderByKey().on("child_added", function(snapshot) {
  console.log(snapshot.key);
});
```

* orderByPriority(): Query

* orderByValue(): Query
```
var scoresRef = firebase.database().ref("scores");
scoresRef.orderByValue().limitToLast(3).on("value", function(snapshot) {
  snapshot.forEach(function(data) {
    console.log("The " + data.key + " score is " + data.val());
  });
});
```
* toString(): string
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

* toJSON(): Object
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
* onDisconnect(): OnDisconnect

* push(value?: any, onComplete?: function): ThenableReference
```
var messageListRef = firebase.database().ref('message_list');
var newMessageRef = messageListRef.push();
newMessageRef.set({
  'user_id': 'ada',
  'text': 'The Analytical Engine weaves algebraical patterns just as the Jacquard loom weaves flowers and leaves.'
});
// We've appended a new message to the message_list location.
var path = newMessageRef.toString();
// path will be something like
// 'https://sample-app.firebaseio.com/message_list/-IKo28nwJLH0Nc5XeFmj'
```
* remove(onComplete?: function): Promise<any>
```
var adaRef = firebase.database().ref('users/ada');
adaRef.remove()
  .then(function() {
    console.log("Remove succeeded.")
  })
  .catch(function(error) {
    console.log("Remove failed: " + error.message)
  });
```
* set(value: any, onComplete?: function): Promise<any>
```
var adaNameRef = firebase.database().ref('users/ada/name');
adaNameRef.child('first').set('Ada');
adaNameRef.child('last').set('Lovelace');
// We've written 'Ada' to the Database location storing Ada's first name,
// and 'Lovelace' to the location storing her last name.
```
* setPriority(priority: string | number | null, onComplete: function): Promise<any>
Sets a priority for the data at this Database location.
* setWithPriority(newVal: any, newPriority: string | number | null, onComplete?: function): Promise<any>
Writes data the Database location. Like set() but also specifies the priority for that data.

* transaction(transactionUpdate: function, onComplete?: function, applyLocally?: boolean): Promise<any>
```
// Increment Ada's rank by 1.
var adaRankRef = firebase.database().ref('users/ada/rank');
adaRankRef.transaction(function(currentRank) {
  // If users/ada/rank has never been set, currentRank will be `null`.
  return currentRank + 1;
});
```
```
// Try to create a user for ada, but only if the user id 'ada' isn't
// already taken
var adaRef = firebase.database().ref('users/ada');
adaRef.transaction(function(currentData) {
  if (currentData === null) {
    return { name: { first: 'Ada', last: 'Lovelace' } };
  } else {
    console.log('User ada already exists.');
    return; // Abort the transaction.
  }
}, function(error, committed, snapshot) {
  if (error) {
    console.log('Transaction failed abnormally!', error);
  } else if (!committed) {
    console.log('We aborted the transaction (because ada already exists).');
  } else {
    console.log('User ada added!');
  }
  console.log("Ada's data: ", snapshot.val());
});
```
* update(values: Object, onComplete?: function): Promise<any>
```
var adaNameRef = firebase.database().ref('users/ada/name');
// Modify the 'first' and 'last' properties, but leave other data at
// adaNameRef unchanged.
adaNameRef.update({ first: 'Ada', last: 'Lovelace' });
```

## firebase.database.ServerValue 
* TIMESTAMP: Object
```
var sessionsRef = firebase.database().ref("sessions");
sessionsRef.push({
  startedAt: firebase.database.ServerValue.TIMESTAMP
});
```
## firebase.database.ThenableReference 
Properties
* key
* parent
* ref
* root
Methods
* catch
catch<TResult>(onrejected?: function | undefined | null): Promise<Reference | TResult>
* child
* endAt
* equalTo
* isEqual
* limitToFirst
* limitToLast
* off
* on
* onDisconnect
* once
* orderByChild
* orderByKey
* orderByPriority
* orderByValue
* push
* remove
* set
* setPriority
* setWithPriority
* startAt
* then
then<TResult1, TResult2>(onfulfilled?: function | undefined | null, onrejected?: function | undefined | null): Promise<TResult1 | TResult2>
* toJSON
* toString
* transaction
* update

## firebase.database.Query 
https://firebase.google.com/docs/reference/js/firebase.database.Query
* endAt
* equalTo
* isEqual
* limitToFirst
* limitToLast
* off
* on
* once
* orderByChild
* orderByKey
* orderByPriority
* orderByValue
* startAt
* toJSON
* toString

# FirebaseError
firebase. FirebaseError 
* code: string
```
auth/user-not-found
```
* message: string
* name: string
```
FirebaseError
```
* stack: string

# initializeApp

```
// Initialize default app
// Retrieve your own options values by adding a web app on
// https://console.firebase.google.com
firebase.initializeApp({
  apiKey: "AIza....",                             // Auth / General Use
  authDomain: "YOUR_APP.firebaseapp.com",         // Auth with popup/redirect
  databaseURL: "https://YOUR_APP.firebaseio.com", // Realtime Database
  storageBucket: "YOUR_APP.appspot.com",          // Storage
  messagingSenderId: "123456789"                  // Cloud Messaging
});
```

# firebase.firestore 
## Classes
* Blob
* CollectionReference
* DocumentReference
* DocumentSnapshot
* FieldPath
* FieldValue
* Firestore
* GeoPoint
* Query
* QueryDocumentSnapshot
* QuerySnapshot
* Timestamp
* Transaction
* WriteBatch
## Interfaces
* DocumentChange
* FirestoreError
* GetOptions
* PersistenceSettings
* SetOptions
* Settings
* SnapshotListenOptions
* SnapshotMetadata
* SnapshotOptions
## Type aliases
* DocumentChangeType
* DocumentData
* FirestoreErrorCode
* LogLevel
* OrderByDirection
* UpdateData
* WhereFilterOp
## Variables
* CACHE_SIZE_UNLIMITED
## Functions
* setLogLevel

# firebase.functions 
* FunctionsErrorCode: "ok" | "cancelled" | "unknown" | "invalid-argument" | "deadline-exceeded" | "not-found" | "already-exists" | "permission-denied" | "resource-exhausted" | "failed-precondition" | "aborted" | "out-of-range" | "unimplemented" | "internal" | "unavailable" | "data-loss" | "unauthenticated"
## firebase.functions.Functions 
* new Functions(): Functions
* httpsCallable(name: string, options?: HttpsCallableOptions): HttpsCallable
Gets an HttpsCallable instance that refers to the function with the given name.
* useFunctionsEmulator(url: string): void
Changes this instance to point to a Cloud Functions emulator running locally. See https://firebase.google.com/docs/functions/local-emulator
# firebase.messaging 
* deleteToken(token: string): Promise<boolean>
To forceably stop a registration token from being used, delete it by calling this method.
* getToken(): Promise<string | null>
After calling requestPermission() you can call this method to get an FCM registration token that can be used to send push messages to this user.
* onMessage(nextOrObserver: firebase.NextFn<any> | Observer<any>, error?: firebase.ErrorFn, completed?: firebase.CompleteFn): firebase.Unsubscribe
When a push message is received and the user is currently on a page for your origin, the message is passed to the page and an onMessage() event is dispatched with the payload of the push message.
* onTokenRefresh(nextOrObserver: firebase.NextFn<any> | Observer<any>, error?: firebase.ErrorFn, completed?: firebase.CompleteFn): firebase.Unsubscribe
You should listen for token refreshes so your web app knows when FCM has invalidated your existing token and you need to call getToken() to get a new token.
* requestPermission(): Promise<void>
Notification permissions are required to send a user push messages. Calling this method displays the permission dialog to the user and resolves if the permission is granted.
* setBackgroundMessageHandler(callback: function): void
FCM directs push messages to your web page's onMessage() callback if the user currently has it open. Otherwise, it calls your callback passed into setBackgroundMessageHandler().
* usePublicVapidKey(b64PublicKey: string): void
* useServiceWorker(registration: ServiceWorkerRegistration): void

# firebase.storage 
## Interfaces
* FullMetadata
* Reference
* SettableMetadata
* Storage
* UploadMetadata
* UploadTask
* UploadTaskSnapshot
## Type aliases
* StringFormat
* TaskEvent
* TaskState
