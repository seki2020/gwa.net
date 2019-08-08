const { setup, teardown } = require('./_helpers');
const { userId, userData, tripId, tripData, followingData, postId, postData } = require('./_data')

describe('Results', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();
  })

  afterAll(async () => {
    await teardown();
  })

  describe('Add Post', () => {
    test('Add Post', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      // Create the Trip follower
      let ref = db.collection('trips').doc(tripId).collection('posts').doc(postId)
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

    test('Trip has 1 post', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      let ref = db.collection('trips').doc(tripId)
      let doc = await ref.get()
      expect(doc.exists).toBe(true)
      expect(doc.data().posts).toBe(1)
    })
  
  })
})