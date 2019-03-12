
const admin = require('firebase-admin')
const serviceAccount = require('../../../secrets/gwa-net-13e914d23139.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gwa-net.firebaseio.com'
});

const db = admin.firestore()
const storage = admin.storage()

// Bucket name: gwa-net.appspot.com
module.exports.tripDelete = async function (req, res) {
  const tripId = req.params.tripId

  console.log(`Delete trip: ${tripId}`)

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { 
    const idToken = req.headers.authorization.split(' ')[1];

    // Verify the token
    admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      // ...
      console.log(`- Verified the token for: ${uid}`)

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
                      for (i=0; i<post.media.length; i++) {
                        let media = post.media[i]
                        
                        const bucketName = 'gwa-net.appspot.com';
                        const filename = `trips/${tripId}/images/${media.id}.jpg`

                        console.log(`   + media: ${filename}`)

                        var f = storage.bucket(bucketName).file(filename)
                        f.delete().then(() => {
                          console.log("     -- Deleted")
                        }).catch(error => {
                          console.log(`     -- Error: ${error}`)
                        })

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

    }).catch(function(error) {
      // Handle error
      console.log(`- Trouble verifying the token: ${error}`)
    });    
  }
  res.json({"foo": "bar"});
}