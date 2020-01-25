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
    const isDirtyPrivate = isPropDirty('shared', oldDocument, newDocument) 

    const isDirtyCountries = isPropDirty('countries', oldDocument, newDocument) 
    const isDirtyContinents = isPropDirty('continents', oldDocument, newDocument) 
    
    if (newDocument.deleted || (!isDirtyRecent && !isDirtyName && !isDirtyPrivate && !isDirtyCountries && !isDirtyContinents)) {
      return true
    }

    const db = admin.firestore()
    return db.collection('trips').doc(tripId).collection('followers').get()
      .then(snapshot => {
        if (isDirtyRecent || isDirtyName || isDirtyPrivate) {
          var data = {
            'recent': newDocument.recent ? newDocument.recent : null,
            'shared': newDocument.shared,
            'trip.name': newDocument.name,
            'updated': newDocument.updated
          }
    
          // Once we get the results, begin a batch
          var batch = db.batch();
          snapshot.forEach(doc => {
            batch.update(doc.ref, data);
          });
    
          // Commit the batch
          return batch.commit();       
        }
        return true
      })
      .then(() => {
        // Check if countries or continents are dirty
        if (isDirtyCountries || isDirtyContinents) {
          // Update the user.
          const userId = newDocument.user.id
          const userRef = db.collection("users").doc(userId);
          return userRef.update({
            countries: admin.firestore.FieldValue.arrayUnion(...newDocument.countries),
            continents: admin.firestore.FieldValue.arrayUnion(...newDocument.continents)
          })    
        }
        return true
      })      
      .catch(err => {
        console.error(err);
      })

})