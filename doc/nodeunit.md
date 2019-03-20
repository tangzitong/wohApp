Nodeunit Usage Guildline
===

# Installation
```
npm install nodeunit -g
```

# usage
```
exports.testSomething = function(test) {
    test.expect(1);
    test.ok(true, "this assertion should pass");
    test.done();
};

exports.testSomethingElse = function(test) {
    test.ok(false, "this assertion should fail");
    test.done();
};
```

# API Documentation

* ok(value, [message]) - Tests if value is a true value.
* equal(actual, expected, [message]) - Tests shallow, coercive equality with the equal comparison operator ( == ).
* notEqual(actual, expected, [message]) - Tests shallow, coercive non-equality with the not equal comparison operator ( != ).
* deepEqual(actual, expected, [message]) - Tests for deep equality.
* notDeepEqual(actual, expected, [message]) - Tests for any deep inequality.
* strictEqual(actual, expected, [message]) - Tests strict equality, as determined by the strict equality operator ( === )
* notStrictEqual(actual, expected, [message]) - Tests strict non-equality, as determined by the strict not equal operator ( !== )
* throws(block, [error], [message]) - Expects block to throw an error.
* doesNotThrow(block, [error], [message]) - Expects block not to throw an error.
* ifError(value) - Tests if value is not a false value, throws if it is a true value. Useful when testing the first argument, error in callbacks.

## Nodeunit also provides the following functions within tests:
* expect(amount) - Specify how many assertions are expected to run within a test. Very useful for ensuring that all your callbacks and assertions are run.
* done() - Finish the current test function, and move on to the next. ALL tests should call this!


# Tests run in series
```
var _readFile = fs.readFile;
fs.readFile = function(path, callback) {
    // it's a stub!
};
// test function that uses fs.readFile

// we're done
fs.readFile = _readFile;

Groups, setUp and tearDown
exports.test1 = function (test) {
    ...
}

exports.group = {
    test2: function (test) {
        ...
    },
    test3: function (test) {
        ...
    }
}

module.exports = {
    setUp: function (callback) {
        this.foo = 'bar';
        callback();
    },
    tearDown: function (callback) {
        // clean up
        callback();
    },
    test1: function (test) {
        test.equals(this.foo, 'bar');
        test.done();
    }
};
```

# Running Tests
```
nodeunit testmodule1.js testfolder [...]
```

## Command-line Options
* --reporter FILE - you can set the test reporter to a custom module or on of the modules in nodeunit/lib/reporters, when omitted, the default test runner is used.
* --list-reporters - list available built-in reporters.
* --config FILE - load config options from a JSON file, allows the customisation of color schemes for the default test reporter etc. See bin/nodeunit.json for current available options.
* -t testName - run specific test only.
* -f fullTestName - run specific test only. fullTestName is built so: "outerGroup - .. - innerGroup - testName".
* --version or -v - report nodeunit version
* --help - show nodeunit help

# Running tests in the browser
```
<html>
  <head>
    <title>Example Test Suite</title>
    <link rel="stylesheet" href="nodeunit.css" type="text/css" />
    <script src="nodeunit.js"></script>
    <script src="suite1.js"></script>
    <script src="suite2.js"></script>
  </head>
  <body>
    <h1 id="nodeunit-header">Example Test Suite</h1>
    <script>
      nodeunit.run({
        'Suite One': suite1,
        'Suite Two': suite2
      });
    </script>
  </body>
</html>
```

# Adding nodeunit to Your Projects
```
#!/usr/bin/env node
var reporter = require('nodeunit').reporters.default;
reporter.run(['test']);
```