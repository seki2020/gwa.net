const { setup, teardown } = require('./_helpers');
const { userId, userData, tripId, tripData, followerData, postId, postData } = require('./_data')

describe('Results', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();
  })

  afterAll(async () => {
    await teardown();
  })

  describe('Add Post 2', () => {
    test('Add Post 2', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      const newPostId = postId + 'x'

      // Create the Trip follower
      let ref = db.collection('trips').doc(tripId).collection('posts').doc(newPostId)
      let doc = await ref.get()
      if (!doc.exists) {
        await ref.set(postData)
      }
      let post = await ref.get()
      expect(post.exists).toBe(true)

      // Wait for a while
      await new Promise(res => setTimeout(() => {
        expect(true).toBe(true)
        res()
      }, 1000))      
    })

    test('Add Post 3', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      const newPostId = postId + 'y'

      // Create the Trip follower
      let ref = db.collection('trips').doc(tripId).collection('posts').doc(newPostId)
      let doc = await ref.get()
      if (!doc.exists) {
        await ref.set(postData)
      }
      let post = await ref.get()
      expect(post.exists).toBe(true)

      // Wait for a while
      await new Promise(res => setTimeout(() => {
        expect(true).toBe(true)
        res()
      }, 1000))      
    })

  
  })
})