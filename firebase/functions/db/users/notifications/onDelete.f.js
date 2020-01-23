const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.region('europe-west1').firestore
  .document('users/{userId}/notifications/{notificationId}')
  .onDelete((snapshot, context) => {
    const userId = context.params.userId

    const notification = snapshot.data()

    // Update the user with unread count
    if (!notification.read) {
      const db = admin.firestore()
      const userRef = db.collection("users").doc(userId);
      return userRef.update({
        unreadNotifications: FieldValue.increment(-1)
      })
      .catch(err => {
        console.error(err);
      })
    }
    else {
      return true
    }
  })  