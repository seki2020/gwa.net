const admin = require('firebase-admin')

// Test data
const userId = 'Mw9os612DzNrX0zn0NlTUmMbhf92'   
const userData = {
  name: 'Demo user',
  bio: 'Testing'
}

describe('Firestore Triggers 1', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    console.log("beforeAll")
    db = admin.initializeApp().firestore()
  })

  afterAll(async () => {
    console.log("afterAll")
    // No teardown necessary
  })

  describe('User initialization', () => {
    test('Init user', async () => {
      console.log("Init the test")
      // Make sure we only run this locally
      expect(db._settings.servicePath).toBe('localhost')
  
      // Creates the user if it doesn't exist
      let ref = db.collection('users').doc(userId)
      let doc = await ref.get()
      if (!doc.exists) {
        console.log("User is missing, go create!")
        await ref.set(userData)
      }
      let user = await ref.get()
      expect(user.exists).toBe(true)
    })
  })
})
