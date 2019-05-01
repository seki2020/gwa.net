const { setup, teardown } = require('./_helpers');

const auth = {
  uid: 'me'
}

const mockData = {
  'trips/one': {
    user: {
      id: 'other'
    }
  },
  'trips/two': {
    user: {
      id: 'me'
    }
  },
  'trips/five': {
    user: {
      id: 'me'
    },
    privacy: 2
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

  test('Deny getting trip', async () => {
    await expect(db.doc('trips/one').get()).toDeny();
    await expect(db.doc('trips/two').get()).toDeny();
  })

  test('Deny creating trip', async () => {
    await expect(db.collection('trips').add({})).toDeny();
    await expect(db.doc('trips/three').set({user: {id: 'me'}})).toDeny();
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

  test('Deny access random trip', async () => {
    await expect(db.doc('trips/one').get()).toDeny();
  })
  test('Allow access public trip from someone else', async () => {
    await expect(db.doc('trips/five').get()).toAllow();
  })

  test('Deny update random trip', async () => {
    await expect(db.doc('trips/one').update({name: 'new'})).toDeny();
  })

  test('Allow getting own trip', async () => {
    await expect(db.doc('trips/two').get()).toAllow();
  })
  test('Allow update own trip', async () => {
    await expect(db.doc('trips/two').update({name: 'new'})).toAllow();
  })
  test('Deny update user of own trip', async () => {
    await expect(db.doc('trips/two').update({user: {id: 'some'}})).toDeny();
  })

  test('Allow create trip for your own', async () => {
    await expect(db.doc('trips/three').set({name: 'three', user: {id: 'me'}})).toAllow();
  })
  test('Deny create trip for someone else', async () => {
    await expect(db.doc('trips/four').set({name: 'four', user: {id: 'someone'}})).toDeny();
  })

})

