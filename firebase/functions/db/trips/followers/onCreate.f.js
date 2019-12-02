const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.region('europe-west1').firestore
  .document('trips/{tripId}/followers/{userId}')
  .onCreate((snapshot, context) => {
    const tripId = context.params.tripId

    const db = admin.firestore()

    const followerRef = snapshot.ref

    const tripRef = db.collection("trips").doc(tripId);
    return tripRef.get()
      .then(doc => {
        const tripData = doc.data()

        // Update the Follower
        return followerRef.update({
          'trip.name': tripData.name,
          recent: tripData.recent,
          // recent: tripData.recent !== undefined ? tripData.recent : null,
          updated: tripData.updated,
        })       
      })
      .then(() => {
        return tripRef.update({
          followers: FieldValue.increment(1)
        })    
      })  
      .catch(err => {
        console.error(err);
      })

  })  