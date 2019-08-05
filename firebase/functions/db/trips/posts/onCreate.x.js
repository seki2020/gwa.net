const functions = require('firebase-functions');
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
// try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.


exports = module.exports = functions.firestore
  .document('trips/{tripId}/posts/{postId}')
  .onCreate((snapshot, context) => {
    const tripId = context.params.tripId
    const postId = context.params.postId

    // Get an object representing the document
    const data = snapshot.data()
    const userId = data.user.id
    const message = data.message

    // Ignore 'waypoints'
    if(data.type === 90) {
      return true
    }

    // Fetch the matching Trip
    // const db = admin.firestore()
    // const followersRef = db.collection('trips-users').where('trip.id', '==', tripId)
    // followersRef.get()
    //   .then(snapshot => {
    //     // console.log('Got Trip Users results')

    //     // Once we get the results, begin a batch
    //     var batch = db.batch();
    //     snapshot.forEach(doc => {
    //       var followerData = doc.data()
    //       var followerId = followerData.user.id

    //       if (followerId !== userId) {      // Don't create a notification for the author of the post

    //         // Create a ref with auto-generated ID
    //         var userRef = db.collection('users').doc(followerId)
    //         var newNotificationRef = userRef.collection('notifications').doc()
    //         batch.set(newNotificationRef, {
    //           created: data.created,
    //           type: 10,
    //           trip: data.trip,
    //           post: {
    //             id: postId,
    //             message: message
    //           },
    //           user: data.user, 
    //           read: false
    //         });
    //       }

    //     });

    //     // Commit the batch
    //     return batch.commit();
    //   })
    //   .catch(err => {
    //     console.log('Error getting document', err);
    //   });

    return true

  })  