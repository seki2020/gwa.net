const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.region('europe-west1').firestore
  .document('users/{userId}/notifications/{notificationId}')
  .onCreate((snapshot, context) => {
    const userId = context.params.userId
    const notificationId = context.params.notificationId

    const notification = snapshot.data()

    // Only type = 10 (post notification) are processed for now
    const type = notification.type
    if (type !== 10) {
      return true
    }

    // Tokens
    var tokens = []
    var unreadNotifications

    // Get the user
    const db = admin.firestore()
    const userRef = db.collection("users").doc(userId);
    return userRef.get()
      .then(doc => {
        if (!doc.exists) {
          throw new Error('User does not exist')
        }
        let userData = doc.data()

        // Keep the tokens
        tokens = userData.fcmTokens
        unreadNotifications = userData.unreadNotifications
        if (!unreadNotifications || unreadNotifications < 0) {
          unreadNotifications = 0
        }

        // Update the user with unread count
        if (!notification.read) {
          unreadNotifications += 1
          return userRef.update({
            unreadNotifications: FieldValue.increment(1)
          })
        }
        else {
          return true
        }
      })
      .then(() => {
        // Send the notifications
        if(tokens.length > 0) {
          // No tokens, no notifications
          var body = notification.trip.name + ': ' + notification.post.message
          if (body.length > 120) {
            body = body.substring(0,117) + "..."
          }

          const message = {
            notification: {
              title: notification.user.name,
              body: body
            },
            data: {
              type: type.toString(),
              tripId: notification.trip.id,
              postId: notification.post.id,
              userId: notification.user.id,
              notificationId
            },
            apns: {           // Apple specific settings
              headers: {
                  'apns-priority': '10'
              },
              payload: {
                  aps: {
                      sound: 'default',
                      badge: unreadNotifications
                  }
              },
            },
            // android: {
            //   priority: 'high',
            //   notification: {
            //     sound: 'default',
            //   }
            // },
            tokens: tokens,
          }

          return admin.messaging().sendMulticast(message)
        }
        return true
      })
      .then((response) => {
        if (response.failureCount > 0) {
          const failedTokens = [];
          response.responses.forEach((resp, idx) => {
            console.log(resp)
            // if (!resp.success) {
              // failedTokens.push(registrationTokens[idx]);
            // }
          });
          console.log('List of tokens that caused failures: ' + failedTokens);
        }
        return
      })
      .catch(err => {
        console.error(err);
      });    

  })  