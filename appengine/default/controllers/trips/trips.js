const admin = require('firebase-admin')
const db = admin.firestore()
const storage = admin.storage()

const config = require('../../secrets/config')

module.exports.tripDelete = async function (req, res) {
  const tripId = req.params.tripId
  const uid = req.token.uid

  console.log(`Delete trip: ${tripId}`)


  // Find the deleted trip for the user (user can only delete their own trips)
  // let db = admin.firestore()
  db.collection('trips').doc(tripId).get()
    .then(doc => {
      if (doc.exists) {
        let data = doc.data()
        if (data.deleted == true && data.user.id == uid) {
        // if (data.user.id == uid) {
          console.log("We can delete this trip")

          // Delete the TripUser document first, because we don't want this Trip to show up anymore
          db.collection('trips-users').where('trip.id', '==', tripId).get()
            .then(snapshot => {
              if (!snapshot.empty) {
                var batch = db.batch();
                snapshot.forEach(doc => {
                  // Delete documents in a batch
                  batch.delete(doc.ref);
                })
                batch.commit().then(() => {
                  console.log(" - Delete users - Done")
                });
              }
            })
            .catch(err => {
              console.log('Error getting documents', err);
            })

          // Delete the TripPosts
          db.collection('trips-posts').where('trip.id', '==', tripId).get()
            .then(snapshot => {
              if (!snapshot.empty) {
                snapshot.forEach(doc => {
                  // console.log(doc.id, '=>', doc.data());
                  console.log(` - post: ${doc.id}`);

                  let post = doc.data()

                  // Remove the stored media
                  if (post.media) {
                    for (i=0; i<post.media.length; i++) {
                      let media = post.media[i]
                      
                      const bucketName = config.bucketName
                      const filename = `trips/${tripId}/images/${media.id}.jpg`
    
                      var f = storage.bucket(bucketName).file(filename)
                      f.delete().then(() => {
                        console.log("     -- Deleted")
                      }).catch(error => {
                        console.log(`     -- Error: ${error}`)
                      })
  
                    }
                  }

                  // Remove the post
                  doc.ref.delete()
                });
              }
          
            })
            .catch(err => {
              console.log('Error getting documents', err);
            });

          // Delete the Trip
          doc.ref.delete()  
        }

      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });

  res.json({"foo": "bar"});
}