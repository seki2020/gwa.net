const functions = require('firebase-functions')
const admin = require('firebase-admin')

const { getAction, isPropDirty } = require('../utils')

exports = module.exports = functions.region('europe-west1').firestore
    .document('users/{userId}')
    .onWrite((change, context) => {
      const userId = context.params.userId

      const [action, oldDocument, newDocument] = getAction(change)

      if (action === 'update' && isPropDirty('name', oldDocument, newDocument)) {
        const db = admin.firestore()
        return db.collectionGroup('followers').where('user.id', '==', userId).get()
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
          .catch(err => {
            console.error(err);
          })
      }
      else {
        return true
      }
    })
