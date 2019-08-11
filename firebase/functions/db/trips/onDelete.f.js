const functions = require('firebase-functions');
const admin = require('firebase-admin')
const db = admin.firestore()

const FieldValue = require('firebase-admin').firestore.FieldValue;

function deleteTripCollection(tripId, collection) {
  return db.collection('trips').doc(tripId).collection(collection).get()
  .then(snapshot => {
    var batch = db.batch()
    snapshot.forEach(doc => {
      batch.delete(doc.ref)
    })
    return batch.commit()
  }) 
  .catch(err => {
    console.error(err);
    return false
  })
}

function deleteNotifications(tripId) {
  return db.collectionGroup('notifications').where('trip.id', '==', tripId).get()
    .then(snapshot => {
      var batch = db.batch()
      snapshot.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }) 
    .catch(err => {
      console.log(err);
      return false
    })
}

exports = module.exports = functions.region('europe-west1').firestore
  .document('trips/{tripId}')
  .onDelete((snapshot, context) => {
    const tripId = context.params.tripId

    // Get an object representing the document
    const data = snapshot.data()
    const userId = data.user.id

    const userRef = db.collection("users").doc(userId);
    return userRef.update({
        trips: FieldValue.increment(-1)
      })    
      .then(() => {
        return deleteTripCollection(tripId, 'followers') 
      })
      .then(() => {
        return deleteTripCollection(tripId, 'posts') 
      })
      .then(() => {
        return deleteTripCollection(tripId, 'flags')  
      })
      .then(() => {
        return deleteNotifications(tripId) 
      })
      .then(() => {
        const config = JSON.parse(process.env.FIREBASE_CONFIG);
        const filename = `trips/${tripId}/images/${tripId}.jpg`
      
        return admin.storage().bucket(config.storageBucket).file(filename).delete()
      })
      .then(() => {
        return true
      })
      .catch(err => {
        console.error(err);
      })
  })  