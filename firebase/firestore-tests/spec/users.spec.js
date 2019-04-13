const { setup, teardown } = require('./_helpers');

const auth = {
  uid: 'me'
}

const mockData = {
  'users/me': {
    name: 'Aad'
  },
  'users/other': {
    name: 'Other'
  }
};

describe('Not Authorized user', () => {
  let db
  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup(null, mockData)
  })

  afterAll(async () => {
    await teardown()
  });

  test('Deny getting user', async () => {
    await expect(db.doc('users/me').get()).toDeny();
    await expect(db.doc('users/other').get()).toDeny();
  })

  test('Deny creating user', async () => {
    await expect(db.collection('users').add({})).toDeny();
    await expect(db.doc('users/me').set({})).toDeny();
  })
})

describe('Authorized user', () => {
  let db
  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup(auth, mockData)
  })

  afterAll(async () => {
    await teardown()
  });

  test('Deny getting random user', async () => {
    await expect(db.doc('users/other').get()).toDeny();
  })
  test('Deny update random user', async () => {
    await expect(db.doc('users/other').update({name: 'name'})).toDeny();
  })

  test('Allow access own user', async () => {
    await expect(db.doc('users/me').get()).toAllow();
  })
  test('Allow update own user', async () => {
    await expect(db.doc('users/me').update({name: 'update'})).toAllow();
  })

})

