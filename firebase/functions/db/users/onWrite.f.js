const functions = require('firebase-functions')
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
// try {admin.initializeApp()} catch(e) {} // You do that because the admin SDK can only be initialized once.

const { getAction, isPropDirty } = require('../utils')


exports = module.exports = functions.region('europe-west1').firestore
    .document('users/{userId}')
    .onWrite((change, context) => {
      const userId = context.params.userId
      // Get an object representing the document
      // const oldDocument = change.before.exists ? change.before.data(): null
      // const newDocument = change.after.exists ? change.after.data() : null

      // const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
      // console.log('Action: ', action)


      const [action, oldDocument, newDocument] = getAction(change)
      console.log('Action: ', action)
      // console.log('Old: ', oldDocument)
      // console.log('New: ', newDocument)

      if (action === 'update' && isPropDirty('name', oldDocument, newDocument)) {
        // console.log(" - update the name")

        const db = admin.firestore()
        return db.collectionGroup('followers').where('user.id', '==', userId).get()
        // return db.collection('users').doc(userId).collection('following').get()
          .then(snapshot => {
            // Once we get the results, begin a batch
            var batch = db.batch();
            snapshot.forEach(doc => {
              batch.update(doc.ref, {
                'user.name': newDocument.name,
              });
            });
      
            // Commit the batch
            return batch.commit();          
          })
          // .then(() => {
          //   console.log('Done')
          //   return true
          // })
          .catch(err => {
            console.log('Error: ', err);
          })
      }
      else {
        return true
      }
    })
