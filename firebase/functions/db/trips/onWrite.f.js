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
  return inc
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

      const tripId = context.params.tripId
      const userId = oldDocument ? oldDocument.user.id : newDocument.user.id

      // Rules
      // 1. Keep a count of all public Trips for a User
      // 2. Keep Trip names in the Trip Users in sync
      // 3. Keep Trip privacy in the Trip Users in sync (this is needed in the Trip Users, so we can see te followers of a Trip)
      // 4. When Trip is set to private, remove all Followers

      const db = admin.firestore()

      // Keep a count of public trips in the user (owner)
      var inc = updateUserTripCount(action, userId, oldDocument, newDocument)
      if (inc) {
        // const db = admin.firestore()
        const userRef = db.collection("users").doc(userId);
        userRef.update({
          trips: FieldValue.increment(inc)
        });
      }

      // Deal with name changes of the trip, but only for update
      if (action === 'update' && (oldDocument.name !== newDocument.name || oldDocument.privacy !== newDocument.privacy)) {
        console.log("Go and update trip names in the followers?")

        db.collection('trips-users').where('trip.id', '==', tripId).get()
        .then(snapshot => {
          console.log('Got Trip Users results')
          
          var data = {
            'trip.name': newDocument.name,
            'trip.privacy': newDocument.privacy
          }

          // Once we get the results, begin a batch
          var batch = db.batch();
          snapshot.forEach(doc => {
              // For each doc, add an update or delete operation to the batch
              if (newDocument.privacy === Constants.privacy.private && doc.data().role === 'follower') {
                batch.delete(doc.ref)
              }
              else {
                batch.update(doc.ref, data);
              }
          });

          // Commit the batch
          return batch.commit();          
        })
        .catch(err => {
          console.log('Error getting document', err);
        })
      }

      return true
    });