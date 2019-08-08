const { setup, teardown } = require('./_helpers');
const { userId, userData, tripId, tripData, followingData } = require('./_data')

describe('Firestore Triggers 1', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();
  })

  afterAll(async () => {
    await teardown();
  })

  describe('User initialization', () => {
    test('Init user', async () => {
      expect(db._settings.servicePath).toBe('localhost')
  
      // Creates the user if it doesn't exist
      let ref = db.collection('users').doc(userId)
      let doc = await ref.get()
      if (!doc.exists) {
        await ref.set(userData)
      }
      let user = await ref.get()
      expect(user.exists).toBe(true)
    })
  })

  describe('Trip initialization', () => {
    test('Init trip', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      // Creates the Trip if it doesn't exist
      let ref = db.collection('trips').doc(tripId)
      let doc = await ref.get()
      if (!doc.exists) {
        await ref.set(tripData)
      }
      let trip = await ref.get()
      expect(trip.exists).toBe(true)

      // Create the Trip follower
      let followingRef = db.collection('users').doc(userId).collection('following').doc(tripId)
      let followingDoc = await followingRef.get()
      if (!followingDoc.exists) {
        await followingRef.set(followingData)
      }
      let following = await followingRef.get()
      expect(following.exists).toBe(true)

      // Wait for a while
      await new Promise(res => setTimeout(() => {
        expect(true).toBe(true)
        res()
      }, 2000))      
    })
  })

  describe('Verification', () => {
    test('User has 1 trip', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      let ref = db.collection('users').doc(userId)
      let doc = await ref.get()
      expect(doc.exists).toBe(true)
      expect(doc.data().trips).toBe(1)

    })

    test('Trip has 1 follower', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      let ref = db.collection('trips').doc(tripId)
      let doc = await ref.get()
      expect(doc.exists).toBe(true)
      expect(doc.data().followers).toBe(1)
    })
  })

})
