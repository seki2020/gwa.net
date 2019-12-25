const functions = require('firebase-functions');
const admin = require('firebase-admin')

// const FieldValue = require('firebase-admin').firestore.FieldValue;
// const { getAction, isPropDirty } = require('../../utils')

exports = module.exports = functions.region('europe-west1').firestore
  .document('users/{userId}/notifications/{notificationId}')
  .onCreate((snapshot, context) => {
    const userId = context.params.userId

    const notification = snapshot.data()

    const type = notification.type
    const user = notification.user.name

    // Debugging
    const tripName = notification.trip.name
    const message = notification.post.message

    console.log(`Notification: ${user} posted in ${tripName}: ${message}`)

    // Get the user
    const db = admin.firestore()
    const userRef = db.collection("users").doc(userId);
    return userRef.get()
      .then(doc => {
        if (!doc.exists) {
          throw new Error('User does not exist')
        }
        const userData = doc.data()
        console.log(userData)

        // Get the tokens for this user
        // const tokens = userData.fcmTokens
        // if(tokens.length > 0) {
        //   const message = {
        //     notification: {
        //       title: "Going walkabout",
        //       body: notification.post.message
        //     },
        //     data: {
        //       type: type,
        //       tripId: notification.trip.id,
        //       postId: notification.post.id,
        //       userId: notification.user.id
        //     },
        //     tokens: tokens,
        //   }
          
        //   admin.messaging().sendMulticast(message)
        //     .then((response) => {
        //       if (response.failureCount > 0) {
        //         const failedTokens = [];
        //         response.responses.forEach((resp, idx) => {
        //           if (!resp.success) {
        //             failedTokens.push(registrationTokens[idx]);
        //           }
        //         });
        //         console.log('List of tokens that caused failures: ' + failedTokens);
        //       }
        //     });
        // }

      })
      .catch(err => {
        console.error(err);
      });    

  })  