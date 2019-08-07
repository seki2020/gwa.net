// const admin = require('firebase-admin')

// admin.initializeApp()

// const db = admin.firestore()

const userId = 'HVLCYVjM8Xd6bTvPohEky9NwgaF2'

var user = {
  id: userId,
  name: 'Aadje',
  bio: 'joepie'
}

// const userRef = db.collection("users").doc(userId);
// userRef.set(data)    
//   .then(() => {
//     console.log('Done')
//     return true
//   })
//   .catch(err => {
//     console.log('Error: ', err);
//   })

// Show the users
// debugger
// let query = db.collection('users').get()
//   .then(snapshot => {
//     if (snapshot.empty) {
//       console.log('No matching documents.');
//       return;
//     }  

//     snapshot.forEach(doc => {
//       console.log(doc.id, '=>', doc.data());
//     });
//   })
//   .catch(err => {
//     console.log('Error getting documents', err);
//   });


const { setup, teardown } = require('./_helpers');

describe('Firestore Triggers 1', () => {
  let db;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    db = await setup();
  })

  afterAll(async () => {
    await teardown();
  })

  test('Get users', async () => {
    // Custom Matchers
    // await expect(ref.get()).toDeny();
    return db.collection('users').get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }  

        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
        });
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  })

  test('Set user', async () => {

    const userRef = db.collection("users").doc(userId);
    return userRef.set(user)    
      .then(() => {
        console.log('Done')
        return true
      })
      .catch(err => {
        console.log('Error: ', err);
      })

  })

})

// describe('Firestore Triggers 2', () => {
//   let db;

//   // Applies only to tests in this describe block
//   beforeAll(async () => {
//     db = await setup();
//   })

//   afterAll(async () => {
//     await teardown();
//   })

//   test('Third test', async () => {
//     // Custom Matchers
//     // await expect(ref.get()).toDeny();
//     console.log('Third test')
//   })

//   test('Forth test', async () => {
//     // Custom Matchers
//     // await expect(ref.get()).toDeny();
//     console.log('Forth test')
//   })

// })