const functions = require('firebase-functions');
const admin = require('firebase-admin')

const { getAction, isPropDirty } = require('../utils')

exports = module.exports = functions.region('europe-west1').firestore
  .document('trips/{tripId}')
  .onUpdate((change, context) => {
    const tripId = context.params.tripId

    const [action, oldDocument, newDocument] = getAction(change)

    const isDirtyRecent = isPropDirty('recent', oldDocument, newDocument) 
    const isDirtyName = isPropDirty('name', oldDocument, newDocument) 
    const isDirtyPrivate = isPropDirty('privacy', oldDocument, newDocument) 
    
    if (newDocument.deleted || (!isDirtyRecent && !isDirtyName && !isDirtyPrivate)) {
      return true
    }

    const db = admin.firestore()
    return db.collection('trips').doc(tripId).collection('followers').get()
      .then(snapshot => {
        var data = {
          'recent': newDocument.recent ? newDocument.recent : null,
          'privacy': newDocument.privacy,
          'trip.name': newDocument.name,
        }
  
        // Once we get the results, begin a batch
        var batch = db.batch();
        snapshot.forEach(doc => {
          batch.update(doc.ref, data);
        });
  
        // Commit the batch
        return batch.commit();          
      })
      .catch(err => {
        console.error(err);
      })

})