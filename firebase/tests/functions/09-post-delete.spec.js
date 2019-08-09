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

  describe('Delete Post', () => {
    test('Delete Post', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      const newPostId = postId + 'y'

      // Create the Trip follower
      let ref = db.collection('trips').doc(tripId).collection('posts').doc(newPostId)
      let doc = await ref.delete()

      // Wait for a while
      await new Promise(res => setTimeout(() => {
        expect(true).toBe(true)
        res()
      }, 1000))      
    })

    // test('Trip has 1 post', async () => {
    //   expect(db._settings.servicePath).toBe('localhost')

    //   let ref = db.collection('trips').doc(tripId)
    //   let doc = await ref.get()
    //   expect(doc.exists).toBe(true)
    //   expect(doc.data().posts).toBe(1)
    // })
  
  })
})