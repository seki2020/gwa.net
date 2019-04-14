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
  'trips-users/xyz': {
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
  'trips-users/abc': {
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

  test('Deny getting trip', async () => {
    await expect(db.doc('trips-users/xyz').get()).toDeny();
    await expect(db.doc('trips-users/abc').get()).toDeny();
  })

  test('Deny creating trip', async () => {
    await expect(db.collection('trips-users').add({})).toDeny();
    await expect(db.doc('trips-users/def').set({trip: {id: 'two'}, user: {id: 'me'}})).toDeny();
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

  test('Deny access random trip user', async () => {
    await expect(db.doc('trips-users/xyz').get()).toDeny();
  })
  test('Deny update random trip user', async () => {
    await expect(db.doc('trips-users/xyz').update({role: 'follower'})).toDeny();
  })

  test('Allow getting own trip user', async () => {
    await expect(db.doc('trips-users/abc').get()).toAllow();
  })
  test('Allow update own trip user', async () => {
    await expect(db.doc('trips-users/abc').update({role: 'follower'})).toAllow();
  })
  test('Deny update user of own trip user', async () => {
    await expect(db.doc('trips-users/abc').update({role: 'follower', user: {id: 'some'}})).toDeny();
  })
  test('Deny update trip of own trip user', async () => {
    await expect(db.doc('trips-users/abc').update({role: 'follower', trip: {id: 'xyz'}})).toDeny();
  })

  test('Deny create trip for someone else', async () => {
    await expect(db.doc('trips-users/hij').set({name: 'four', user: {id: 'someone'}})).toDeny();
  })
  test('Deny create trip without trip for yourself', async () => {
    await expect(db.doc('trips-users/rst1').set({role: 'follower', user: {id: 'me'}})).toDeny();
  })
  test('Deny create trip with not existing trip for yourself', async () => {
    await expect(db.doc('trips-users/rst2').set({role: 'follower', user: {id: 'me'}, trip: {id: 'foo'}})).toDeny();
  })

  test('Allow create trip with existing trip for yourself', async () => {
    await expect(db.doc('trips-users/rst3').set({role: 'follower', user: {id: 'me'}, trip: {id: 'one'}})).toAllow();
  })

})

