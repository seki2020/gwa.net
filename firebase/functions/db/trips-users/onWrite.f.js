const functions = require('firebase-functions')
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

const FieldValue = require('firebase-admin').firestore.FieldValue;


function updateTripFollowerCount(action, oldDocument, newDocument) {
  // Keep a count of public trips in the user (owner)
  var inc = 0
  if (action === 'create' && newDocument.role !== 'owner') {
    inc = 1
  }
  else if (action === 'delete' && oldDocument.role !== 'owner') {
    inc = -1
  }
  return inc
}

exports = module.exports = functions.firestore
    .document('trips-users/{id}')
    .onWrite((change, context) => {
      // Get an object representing the document
      const oldDocument = change.before.exists ? change.before.data(): null
      const newDocument = change.after.exists ? change.after.data() : null

      const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
      console.log('Action: ', action)
      console.log('Old: ', oldDocument)
      console.log('New: ', newDocument)

      // const tripId = context.params.tripId
      const tripId = oldDocument ? oldDocument.trip.id : newDocument.trip.id

      // Rules
      // 1. Keep a count of all followers of a Trips

      // Keep a count of public trips in the user (owner)
      var inc = updateTripFollowerCount(action, oldDocument, newDocument)
      if (inc) {
        const db = admin.firestore()
        const tripRef = db.collection("trips").doc(tripId);
        return tripRef.update({
          followers: FieldValue.increment(inc)
        });
      }

      return true
    });