const { setup, teardown } = require('./_helpers');

const auth = {
  uid: 'me'
}

const mockData = {
  'trips/me': {
    user: {
      id: 'me'
    }
  },
  'trips/me/posts/me': {
    trip: {
      id: 'me'
    },
    user: {
      id: 'me'
    }
  },

  'trips/other': {
    user: {
      id: 'other'
    }
  },
  'trips/other/posts/other': {
    trip: {
      id: 'other'
    },
    user: {
      id: 'other'
    }
  },

  'trips/public': {
    privacy: 2,
    user: {
      id: 'other'
    }
  },
  'trips/public/posts/other': {
    trip: {
      id: 'public'
    },
    user: {
      id: 'other'
    }
  },

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

  test('Deny getting trip post', async () => {
    await expect(db.doc('trips/me/posts/me').get()).toDeny();
    await expect(db.doc('trips/other/posts/other').get()).toDeny();
  })

  test('Deny getting public trip post', async () => {
    await expect(db.doc('trips/public/posts/public').get()).toDeny();
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

  // For NOT owned and not public trip
  test('Deny access to post of not owned trip', async () => {
    await expect(db.doc('trips/other/posts/other').get()).toDeny();
  })
  test('Deny update of post of not owned trip', async () => {
    await expect(db.doc('trips/other/posts/other').update({message: 'Hello'})).toDeny();
  })
  test('Deny creating post of not owned trip', async () => {
    await expect(db.collection('trips/other/posts').add({trip: {id: 'other'}, user: {id: 'me'}})).toDeny();
  })
  test('Deny deleting post of not owned trip', async () => {
    await expect(db.doc('trips/other/posts/other').delete()).toDeny();
  })

  // // For Owned trip
  test('Allow getting post of own trip', async () => {
    await expect(db.doc('trips/me/posts/me').get()).toAllow();
  })
  test('Allow update of post of own trip', async () => {
    await expect(db.doc('trips/me/posts/me').update({message: 'Hello'})).toAllow();
  })
  test('Deny update user of post of own trip', async () => {
    await expect(db.doc('trips/me/posts/me').update({message: 'Hello', user: {id: 'some'}})).toDeny();
  })
  test('Deny update trip of post in own trip', async () => {
    await expect(db.doc('trips/me/posts/me').update({message: 'Good day', trip: {id: 'xyz'}})).toDeny();
  })
  test('Allow create of post of own trip', async () => {
    await expect(db.collection('trips/me/posts').add({message: 'Hellow', trip: {id: 'me'}, user: {id: 'me'}})).toAllow();
  })
  test('Allow delete of post of own trip', async () => {
    await expect(db.doc('trips/me/posts/me').delete()).toAllow();
  })

  // Public trip
  test('Allow getting post of public not own trip', async () => {
    await expect(db.doc('trips/public/posts/other').get()).toAllow();
  })
  test('Deny create of post of public not own trip', async () => {
    await expect(db.collection('trips/public/posts').add({message: 'Hellow', trip: {id: 'public'}, user: {id: 'me'}})).toDeny();
  })

})

