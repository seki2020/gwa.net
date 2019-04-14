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
  'trips-posts/xyz': {
    trip: {
      id: 'one'
    },
    user: {
      id: 'other'
    }
  },
  'trips/two': {
    user: {
      id: 'me'
    }
  },
  'trips-posts/abc': {
    trip: {
      id: 'two'
    },
    user: {
      id: 'me'
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
    await expect(db.doc('trips-posts/xyz').get()).toDeny();
    await expect(db.doc('trips-posts/abc').get()).toDeny();
  })

  test('Deny creating trip post', async () => {
    await expect(db.collection('trips-posts').add({})).toDeny();
    await expect(db.doc('trips-posts/def').set({trip: {id: 'two'}, user: {id: 'me'}})).toDeny();
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

  test('Deny access random trip post', async () => {
    await expect(db.doc('trips-posts/xyz').get()).toDeny();
  })
  test('Deny update random trip post', async () => {
    await expect(db.doc('trips-posts/xyz').update({message: 'Hello'})).toDeny();
  })

  test('Allow getting own trip post', async () => {
    await expect(db.doc('trips-posts/abc').get()).toAllow();
  })
  test('Allow update own trip post', async () => {
    await expect(db.doc('trips-posts/abc').update({message: 'Hello'})).toAllow();
  })
  test('Deny update user of own trip post', async () => {
    await expect(db.doc('trips-posts/abc').update({message: 'Hello', user: {id: 'some'}})).toDeny();
  })
  test('Deny update trip of own trip post', async () => {
    await expect(db.doc('trips-posts/abc').update({message: 'Good day', trip: {id: 'xyz'}})).toDeny();
  })

  test('Deny create post for someone else', async () => {
    await expect(db.doc('trips-posts/hij').set({message: 'Hello', user: {id: 'someone'}})).toDeny();
  })
  test('Deny create post without trip for yourself', async () => {
    await expect(db.doc('trips-posts/rst1').set({message: 'Hello', user: {id: 'me'}})).toDeny();
  })
  test('Deny create post with not existing trip for yourself', async () => {
    await expect(db.doc('trips-posts/rst2').set({message: 'Hello', user: {id: 'me'}, trip: {id: 'foo'}})).toDeny();
  })
  test('Deny create post with existing trip you do not own for yourself', async () => {
    await expect(db.doc('trips-posts/rst3').set({message: 'Hello', user: {id: 'me'}, trip: {id: 'one'}})).toDeny();
  })
  test('Allow create post with existing trip you own for yourself', async () => {
    await expect(db.doc('trips-posts/rst4').set({message: 'Hello', user: {id: 'me'}, trip: {id: 'two'}})).toAllow();
  })

})

