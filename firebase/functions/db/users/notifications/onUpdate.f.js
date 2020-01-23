const functions = require('firebase-functions')
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

const {
  getAction,
  isPropDirty
} = require('../../utils')

exports = module.exports = functions.region('europe-west1').firestore
  .document('users/{userId}/notifications/{notificationId}')
  .onUpdate((change, context) => {
    const userId = context.params.userId

    const [action, oldDocument, newDocument] = getAction(change)

    const isDirtyRead = isPropDirty('read', oldDocument, newDocument)

    if (!isDirtyRead) {
      return true
    }
    // Update the unreadNotifications
    var increment = newDocument.read ? -1 : 1

    const db = admin.firestore()
    const userRef = db.collection("users").doc(userId);
    return userRef.update({
      unreadNotifications: FieldValue.increment(increment)
    })
    .catch(err => {
      console.error(err);
    })
  })