const functions = require('firebase-functions');

const admin = require('firebase-admin')
admin.initializeApp()


exports.createTripPost = functions.firestore
    .document('trips-posts/{id}')
    .onCreate((document, context) => {
      // Get an object representing the document
      const newPost = document.data();

      // access a particular field as you would any JS property
      // const message = newValue.message;
      // const updated = newValue.updated
      // const tripId = newValue.trip.id

      const media = newPost.media

      // Get the TripUser collection?
      const db = admin.firestore()
      db.collection('trips-users').where('trip.id', '==', newPost.trip.id).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return null;
          }
      
          snapshot.forEach(doc => {
            const tripUser = doc.data()
            const recent = tripUser.recent
            const recentMedia = recent !== undefined ? (recent.media !== undefined ? recent.media : []) : []

            // console.log(doc.id, '=>', tripUser);
            console.log('Recent media: ', recentMedia)

            // Check for media in the post
            var newMedia = []
            // if (media.length > 0) {
              for (var i=0; i<Math.min(4, media.length); i++) {
                newMedia.push(media[i])
              }
            // } 
            console.log('New media: ', newMedia)
            const newLength = newMedia.length
            const recentLength = recentMedia.length
            const count = Math.min((4 - newMedia.length), recentMedia.length)
            console.log('length: ', newLength, ', ', recentLength, 'count ', count)

            for (var j=0; j<count; j++) {
              console.log(j)
              newMedia.push(recentMedia[j])
            }
            console.log('New media: ', newMedia)

            let docRef = db.collection("trips-users").doc(doc.id)
            docRef.update({
              recent: {
                message: newPost.message,
                user: newPost.user,
                media: newMedia
              },
              updated: newPost.updated
            })

          });
          return true
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });

      return true
    });