const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.region('europe-west1').firestore
  .document('trips/{tripId}')
  .onDelete((snapshot, context) => {
    const tripId = context.params.tripId

    // Get an object representing the document
    const data = snapshot.data()
    const userId = data.user.id

    const db = admin.firestore()
    const userRef = db.collection("users").doc(userId);
    return userRef.update({
        trips: FieldValue.increment(-1)
      })    
      .then(() => {
        console.log('Done')
        return true
      })
      .catch(err => {
        console.log('Error: ', err);
      })

  })  