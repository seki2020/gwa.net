const { setup, teardown } = require('./_helpers');

const auth = {
  uid: 'me'
}

const mockData = {
  'trips/me': {
    trip: {
      id: 'me'
    },
    user: {
      id: 'me'
    }
  },
  'trips-users/me_me': {    // trip_user
    trip: {
      id: 'me'
    },
    user: {
      id: 'me'
    }
  },
  'trips-users/me_you': {    // trip_user
    trip: {
      id: 'me'
    },
    user: {
      id: 'you'
    }
  },

  'trips/other': {
    trip: {
      id: 'other'
    },
    user: {
      id: 'other'
    }
  },
  'trips-users/other_me': {    // trip_user
    trip: {
      id: 'other'
    },
    user: {
      id: 'me'
    }
  },
  'trips-users/other_you': {    // trip_user
    trip: {
      id: 'other'
    },
    user: {
      id: 'you'
    }
  },

  'trips/public': {
    privacy: 2,
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

  test('Deny getting trip-user', async () => {
    await expect(db.doc('trips-users/me_me').get()).toDeny();
    await expect(db.doc('trips-users/me_you').get()).toDeny();
  })

  test('Deny creating trip-user', async () => {
    await expect(db.collection('trips-users').add({})).toDeny();
    await expect(db.doc('trips-users/two_me').set({trip: {id: 'two'}, user: {id: 'me'}})).toDeny();
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

  // test('Deny getting trip-users of random (not owned) trip', async () => {
  //   await expect(db.collection('trips-users').where('trip.id', '==', 'other')).toAllow();
  // })
  test('Deny getting trip-users of random (not owned) trip', async () => {
    await expect(db.collection('trips-users').get()).toDeny();
  })
  test('Deny access random trip-user', async () => {
    await expect(db.doc('trips-users/other_you').get()).toDeny();
  })
  test('Allow access to trip-user if you own the trip', async () => {
    await expect(db.doc('trips-users/me_you').get()).toAllow();
  })
  test('Allow access to trip-user that you are self', async () => {
    await expect(db.doc('trips-users/other_me').get()).toAllow();
  })

  // await expect(db.collection('trips/public/posts').get()).toAllow();



  // test('Deny access random trip-user', async () => {
  //   await expect(db.doc('trips-users/xyz').get()).toDeny();
  // })
  // test('Deny update random trip user', async () => {
  //   await expect(db.doc('trips-users/xyz').update({role: 'follower'})).toDeny();
  // })

  // test('Allow getting own trip user', async () => {
  //   await expect(db.doc('trips-users/abc').get()).toAllow();
  // })
  // test('Allow update own trip user', async () => {
  //   await expect(db.doc('trips-users/abc').update({role: 'follower'})).toAllow();
  // })
  // test('Deny update user of own trip user', async () => {
  //   await expect(db.doc('trips-users/abc').update({role: 'follower', user: {id: 'some'}})).toDeny();
  // })
  // test('Deny update trip of own trip user', async () => {
  //   await expect(db.doc('trips-users/abc').update({role: 'follower', trip: {id: 'xyz'}})).toDeny();
  // })

  // test('Deny create trip for someone else', async () => {
  //   await expect(db.doc('trips-users/hij').set({name: 'four', user: {id: 'someone'}})).toDeny();
  // })
  // test('Deny create trip without trip for yourself', async () => {
  //   await expect(db.doc('trips-users/rst1').set({role: 'follower', user: {id: 'me'}})).toDeny();
  // })
  // test('Deny create trip with not existing trip for yourself', async () => {
  //   await expect(db.doc('trips-users/rst2').set({role: 'follower', user: {id: 'me'}, trip: {id: 'foo'}})).toDeny();
  // })

  // test('Allow create trip with existing trip for yourself', async () => {
  //   await expect(db.doc('trips-users/rst3').set({role: 'follower', user: {id: 'me'}, trip: {id: 'one'}})).toAllow();
  // })

  // test('Deny delete trip user of someone else', async () => {
  //   await expect(db.doc('trips-users/xyz').delete()).toDeny();
  // })

  // test('Allow delete trip user of yourself', async () => {
  //   await expect(db.doc('trips-users/abc').delete()).toAllow();
  // })


})

