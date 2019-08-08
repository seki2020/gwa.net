const { setup, teardown } = require('./_helpers');

describe('Results', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();
  })

  afterAll(async () => {
    await teardown();
  })

  describe('Show result', () => {
    test('Show users', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      let users = await db.collection('users').get()
      for (user of users.docs) {
        console.log(user.id, user.data())

        console.log(' - Following')
        let following = await db.collection('users').doc(user.id).collection('following').get()
        for (f of following.docs) {
          console.log('   + ', f.data())
        }

        console.log(' - Notifications')
        let notifications = await db.collection('users').doc(user.id).collection('notifications').get()
        for (n of notifications.docs) {
          console.log('   + ', n.data())
        }
      }
    })

    test('Show trips', async () => {
      expect(db._settings.servicePath).toBe('localhost')

      let trips = await db.collection('trips').get()
      for (trip of trips.docs) {
        console.log(trip.id, trip.data())
      }
    })
  
  })
})