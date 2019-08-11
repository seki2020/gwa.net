const functions = require('firebase-functions');
const admin = require('firebase-admin')
const db = admin.firestore()

const FieldValue = require('firebase-admin').firestore.FieldValue;

function deletePostFlags(tripId, postId) {
  return db.collection('trips').doc(tripId).collection('flags').where('post.id', '==', postId).get()
  .then(snapshot => {
    var batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref)
    });
    return batch.commit();         
  })
  .catch(err => {
    console.error(err);
    return false
  })  
}

function deleteNotifications(postId) {
  return db.collectionGroup('notifications').where('post.id', '==', postId).get()
    .then(snapshot => {
      var batch = db.batch()
      snapshot.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }) 
    .catch(err => {
      console.error(err);
      return false
    })
}

function deleteMedia(tripId, postData) {
  const config = JSON.parse(process.env.FIREBASE_CONFIG);
  const storage = admin.storage()
  const bucketName = config.storageBucket

  const promises = []
  const mediaList = postData.media ? postData.media : []
  for (var j=0; j<mediaList.length; j++) {
    const media = mediaList[j]    
    const filename = `trips/${tripId}/images/${media.id}.jpg`

    const p = storage.bucket(bucketName).file(filename).delete()
    promises.push(p)
  }
  return Promise.all(promises)  
}

function updateTrip(tripId, tripData, postId, postData) {
  return db.collection('trips').doc(tripId).collection('posts').orderBy('updated', 'desc').limit(1).get()
    .then(snapshot => {
      var lastPostData = null
      var recent = null
      if (snapshot.empty) {     // The last post is deleted\
        recent = null
      }
      else {
        lastPostData = snapshot.docs[0].data()    // The last post, we should use this info for the recent, with some images added
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
      if (recent) {
        // Fix up the Media in the recent
        const tripMedia = tripData.recent && tripData.recent.media ? tripData.recent.media : []
        const deletedPostMedia = postData.media ? postData.media : []
        const lastPostMedia = recent && recent.media ? recent.media : []
          
        // Take the tripMedia that is not in the postMedia and not in the lastPostMedia and append to recent.media
        for (var i=0; i<tripMedia.length; i++) {
          var found = false
          for (var j=0; j<deletedPostMedia.length; j++) {
            if (tripMedia[i].id === deletedPostMedia[j].id) {
              found = true
            }
          }
          for (var k=0; k<lastPostMedia.length; k++) {
            if (tripMedia[i].id === lastPostMedia[k].id) {
              found = true
            }
          }
          if (!found) {
            recent.media.push(tripMedia[i])
          }
        }
        // Make sure we only have max 4 media objects
        recent.media = recent.media.slice(0, 4)
      }

      // Update the Trip
      var data = {
        recent: recent,
        updated: lastPostData ? lastPostData.updated : tripData.updated,
        posts: FieldValue.increment(-1)
      }
      return db.collection('trips').doc(tripId).update(data)       // Return the promise and continue
    })
    .catch(err => {
      console.error(err);
      return false
    })

}

exports = module.exports = functions.region('europe-west1').firestore
  .document('trips/{tripId}/posts/{postId}')
  .onDelete((snapshot, context) => {
    const tripId = context.params.tripId
    const postId = context.params.postId

    var postData = snapshot.data()

    return db.collection("trips").doc(tripId).get()
      .then(doc => {
        if (doc.exists) {
          return updateTrip(tripId, doc.data(), postId, postData)
        }
        else {
          return true
        }
      })
      .then(() => {
        return deletePostFlags(tripId, postId)
      })
      .then(() => {
        return deleteNotifications(postId)
      })
      .then(() => {
        return deleteMedia(tripId, postData)
      })
      .catch(err => {
        console.error(err);
      })
  })  