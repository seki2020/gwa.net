const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.firestore
  .document('users/{userId}/following/{tripId}')
  .onDelete((snapshot, context) => {
    const tripId = context.params.tripId

    const db = admin.firestore()
    const tripRef = db.collection("trips").doc(tripId);
    return tripRef.update({
        followers: FieldValue.increment(-1)
      })    
      .then(() => {
        console.log('Done')
        return true
      })
      .catch(err => {
        console.log('Error: ', err);
      })

  })  