const functions = require('firebase-functions')
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

const FieldValue = require('firebase-admin').firestore.FieldValue;
const Constants = require('../constants')


function updateUserTripCount(action, userId, oldDocument, newDocument) {
  // Keep a count of public trips in the user (owner)
  var inc = 0
  if (action === 'create' && newDocument.privacy === Constants.privacy.public) {
    inc = 1
  }
  else if (action === 'delete' && oldDocument.privacy === Constants.privacy.public) {
    inc = -1
  }
  else if (action === 'update') {
    // Depends on a change in privacy settings... 
    if (oldDocument.privacy === Constants.privacy.public && newDocument.privacy !== Constants.privacy.public ) {
      inc = -1
    }
    if (oldDocument.privacy !== Constants.privacy.public && newDocument.privacy === Constants.privacy.public ) {
      inc = 1
    }
  }
  if (inc) {
    const db = admin.firestore()
    const userRef = db.collection("users").doc(userId);
    userRef.update({
      trips: FieldValue.increment(inc)
    });
  }
}

exports = module.exports = functions.firestore
    .document('trips/{tripId}')
    .onWrite((change, context) => {
      // Get an object representing the document
      const oldDocument = change.before.exists ? change.before.data(): null
      const newDocument = change.after.exists ? change.after.data() : null

      const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
      console.log('Action: ', action)
      console.log('Old: ', oldDocument)
      console.log('New: ', newDocument)

      const userId = oldDocument ? oldDocument.user.id : newDocument.user.id


      // Keep a count of public trips in the user (owner)
      updateUserTripCount(action, userId, oldDocument, newDocument)

      // Deal with name changes of the trip, but only for update
      if (action === 'update' && oldDocument.name !== newDocument.name) {
        console.log("Go and update trip names in the followers?")
      }

      return true
    });