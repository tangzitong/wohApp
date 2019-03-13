const fb = require('../src/firebaseConfig.js')

exports['getPostList'] = function(test) {
  const posts = fb.chat.getPostList()
  test.equal(posts.count, 1)
  test.done()
}