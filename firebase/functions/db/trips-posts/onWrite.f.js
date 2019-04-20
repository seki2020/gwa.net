const functions = require('firebase-functions');
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

exports = module.exports = functions.firestore
  .document('trips-posts/{id}')
  .onWrite((change, context) => {
    // Get an object representing the document
    const oldDocument = change.before.exists ? change.before.data(): null
    const newDocument = change.after.exists ? change.after.data() : null

    const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
    console.log('Action: ', action)
    console.log('Old: ', oldDocument)
    console.log('New: ', newDocument)
  
    const tripId = oldDocument ? oldDocument.trip.id : newDocument.trip.id

    // Fetch the matching Trip
    const db = admin.firestore()
    const tripRef = db.collection("trips").doc(tripId);
    tripRef.get()
      .then(doc => {
        if (doc.exists) {
          const tripData = doc.data()
          var updated = tripData.updated
          const recent = tripData.recent
          var recentMessage = recent !== undefined ? (recent.messsage !== undefined ? recent.message : "") : ""
          var recentUser = recent !== undefined ? (recent.user !== undefined ? recent.user : null) : null
          var recentMedia = recent !== undefined ? (recent.media !== undefined ? recent.media : []) : []
          var tmpMedia = []
          
          // 1. Process the 'old' document (for update and delete)
          if (oldDocument) {
            // Remove the old media from the recent media
            const oldMedia = oldDocument.media
            for (var i=0; i<recentMedia.length; i++) {
              // Remove any matching media from the recentMedia
              var found = false
              for (var j=0; j<oldMedia.length; j++) {
                if (recentMedia[i].id === oldMedia[j].id) {
                  found = true
                }
              }
              if (!found) {
                tmpMedia.push(recentMedia[i])
              }
            } 
            recentMedia = tmpMedia

            // Remove the message
            if (oldDocument.message === recent.message) {
              recentMessage = ""
            }
          }

          // 2. Process the 'new' document (for create and update)
          if (newDocument) {
            var newMedia = []
            const media = newDocument.media
            if (media !== undefined && media.length > 0) {
              for (var k=0; k<Math.min(4, media.length); k++) {
                newMedia.push(media[k])
              }
            } 
            const count = Math.min((4 - newMedia.length), recentMedia.length)

            for (var l=0; l<count; l++) {
              newMedia.push(recentMedia[l])
            }
            console.log('New media: ', newMedia)

            // Set the New values
            recentMessage = newDocument.message
            recentUser = newDocument.user
            recentMedia = newMedia
            updated = newDocument.updated
          }

          // 3. Update the Trip
          return tripRef.update({
            recent: {
              message: recentMessage,
              user: recentUser,
              media: recentMedia
            },
            updated: updated
          })
          // .then(ref => {
          //   return true
          // }).catch(err => {
          //   console.log('Error getting document', err);
          // })          


        }
        return true
      })
      .then(ref => {
        console.log('Done with the update of the Trip')
        return true
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

    return true

    // // 1. If there is an old document (update or delete), clean-up the 'resent'
    // if (oldDocument) {
    //   console.log('- Clean up old document stuff')
    // }


    // if (action === 'create') {
    //   // Get the parent Trip
    //   const db = admin.firestore()
    //   const tripRef = db.collection("trips").doc(newDocument.trip.id);
    //   tripRef.get()
    //     .then(doc => {
    //       if (doc.exists) {
    //         console.log('Trip data:', doc.data());

    //         const tripData = doc.data()
    //         const recent = tripData.recent
    //         const recentMedia = recent !== undefined ? (recent.media !== undefined ? recent.media : []) : []

    //         console.log('Recent media: ', recentMedia)

    //         // Check for media in the post
    //         var newMedia = []
    //         const media = newDocument.media
    //         if (media !== undefined && media.length > 0) {
    //           for (var i=0; i<Math.min(4, media.length); i++) {
    //             newMedia.push(media[i])
    //           }
    //         } 
    //         // console.log('New media: ', newMedia)
    //         // const newLength = newMedia.length
    //         // const recentLength = recentMedia.length
    //         const count = Math.min((4 - newMedia.length), recentMedia.length)
    //         // console.log('length: ', newLength, ', ', recentLength, 'count ', count)

    //         for (var j=0; j<count; j++) {
    //           newMedia.push(recentMedia[j])
    //         }
    //         console.log('New media: ', newMedia)

    //         // let docRef = db.collection("trips-users").doc(doc.id)
    //         return tripRef.update({
    //           recent: {
    //             message: newDocument.message,
    //             user: newDocument.user,
    //             media: newMedia
    //           },
    //           updated: newDocument.updated
    //         })

    //       }
    //       return true
    //     })
    //     .catch(err => {
    //       console.log('Error getting document', err);
    //     });

    //   return true
    // }
    // return true
  })  