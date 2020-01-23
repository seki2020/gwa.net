const functions = require('firebase-functions')
const admin = require('firebase-admin')

const { getAction, isPropDirty } = require('../utils')

exports = module.exports = functions.region('europe-west1').firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
      const userId = context.params.userId

      const [action, oldDocument, newDocument] = getAction(change)

      const isDirtyName = isPropDirty('name', oldDocument, newDocument) 

      if (!isDirtyName) {
        return true
      }
  
      const db = admin.firestore()
      // Fetch trips for this user
      return db.collection('trips').where('user.id', '==', userId).get()
        .then(snapshot => {
          // Update the user.name for each trip
          var batch = db.batch();
          snapshot.forEach(doc => {
            batch.update(doc.ref, {
              'user.name': newDocument.name,
            });
          });
          return batch.commit();          
        })
        .then(() => {
          // Fetch followed trips for this user
          return db.collectionGroup('followers').where('user.id', '==', userId).get()
        })
        .then(snapshot => {
          // Update the followers in a batch
          var batch = db.batch();
          snapshot.forEach(doc => {
            batch.update(doc.ref, {
              'user.name': newDocument.name,
            });
          });
          return batch.commit();          
        })
        .catch(err => {
          console.error(err);
          return false
        })
  
    })
