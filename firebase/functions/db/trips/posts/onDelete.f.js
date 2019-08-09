const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.firestore
  .document('trips/{tripId}/posts/{postId}')
  .onDelete((snapshot, context) => {
    const tripId = context.params.tripId
    const postId = context.params.postId

    var postData = snapshot.data()
    var lastPostData = {}
    
    var recent = {}

    // Get recent posts
    const db = admin.firestore()
    const tripRef = db.collection("trips").doc(tripId);

    console.log('get last post')
    return db.collection('trips').doc(tripId).collection('posts').orderBy('updated', 'desc').limit(1).get()
      .then(snapshot => {
        console.log('Got last post')
        if (!snapshot.empty) {
          lastPostData = snapshot.docs[0].data()

          recent = {
            message: lastPostData.message,
            post: {
              id: snapshot.docs[0].id,
              message: lastPostData.message,
            },
            user: lastPostData.user,
            media: lastPostData.media ? lastPostData.media : []
          }
        }
        // Now get the Trip
        return tripRef.get()
      })
      .then(doc => {
        console.log('got the trip')
        if (!doc.exists) {
          throw new Error('Trip does not exist')
        }
        const tripData = doc.data()

        // Get the recent 
        // recent = tripData.recent

        // Get the media and remove the 'delete' media if there is any
        const tripMedia = tripData.recent && tripData.recent.media ? tripData.recent.media : []
        const postMedia = postData.media ? postData.media : []
        const lastPostMedia = recent ? recent.media : []
        
        // Remove the postMedia from the tripMedia

        // Take the tripMedia that is not in the postMedia and not in the lastPostMedia
        var tmpMedia = []
        for (var i=0; i<tripMedia.length; i++) {
          var found = false
          for (var j=0; j<postMedia.length; j++) {
            if (tripMedia[i].id === postMedia[j].id) {
              found = true
            }
          }
          for (var k=0; k<lastPostMedia.length; k++) {
            if (tripMedia[i].id === lastPostMedia[k].id) {
              found = true
            }
          }
          if (!found) {
            tmpMedia.push(tripMedia[i])
          }
        }
        if (recent) {
          console.log('Got a recent after image stuff')
          // make sure there are only 4 items in the recent media
          for (var l=0; l<tmpMedia.length; l++) {
            recent.media.push(tmpMedia[l])        // Add all the media we stil have in the trip and is still valid
          }
          recent.media = recent.media.slice(0, 4)
        }

        // Update the Trip
        var data = {
          recent: recent,
          updated: lastPostData ? lastPostData.updated : tripData.updated,
          posts: FieldValue.increment(-1)
        }
        console.log("go and update the trip", data)
        return tripRef.update(data)       // Return the promise and continue

      })
      .then(() => {
        console.log('Done with the Trip update, remove the flags')

        return db.collection('trips').doc(tripId).collection('flags').where('post.id', '==', postId).get()

        // return true
      })

      .then(snapshot => {
        console.log('Batch the flag deletes')
        // Once we get the results, begin a batch to delete the flags
        var batch = db.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.ref)
        });
  
        // Commit the batch
        return batch.commit();         
      })
      .then(() => {
        console.log('Done with flag delete, remove the notifications')
        return db.collectionGroup('notifications').where('post.id', '==', postId).get()
      })
      .then(snapshot => {
        console.log('Batch the notification deletes')
        // Once we get the results, begin a batch to delete the flags
        var batch = db.batch();
        snapshot.forEach(doc => {
          batch.delete(doc.ref)
        })
  
        // Commit the batch
        return batch.commit();         
      })
  
      .then(() => {
        console.log('Done with notifications delete, remove the images')
  
        const config = JSON.parse(process.env.FIREBASE_CONFIG);
        const storage = admin.storage()
        const bucketName = config.storageBucket
      
        const promises = []
        const mediaList = postData.media ? postData.media : []
        for (var j=0; j<mediaList.length; j++) {
          let media = mediaList[j]
          
          const filename = `trips/${tripId}/images/${media.id}.jpg`
          console.log(' - ', filename)
      
          const p = storage.bucket(bucketName).file(filename).delete()
          promises.push(p)
        }
        console.log("- done the looping, go return all promises")
        return Promise.all(promises)

      })

      .catch(err => {
        console.log('Error: ', err);
      })
  

  })  