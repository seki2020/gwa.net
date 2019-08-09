'use strict'
const functions = require('firebase-functions');
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
// try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

const FieldValue = require('firebase-admin').firestore.FieldValue;

const { getAction, isPropDirty } = require('../../utils')

function updateRecentData(tripData, oldDocument, newDocument) {
  const recent = tripData.recent

  // 0. Current recent data
  var recentData = {
    recent: {
      message: recent && recent.message ? recent.message : "",
      user: recent && recent.user ? recent.user : tripData.user,
      media: recent && recent.media ? recent.media : []
    },
    updated: tripData.updated
  }            
  var tmpMedia = []

  // 1. Process the 'old' document (for update and delete)
  if (oldDocument) {
    // Remove the old media from the recent media
    const oldMedia = oldDocument.media
    for (var i=0; i<recentData.recent.media.length; i++) {
      // Remove any matching media from the recentMedia
      var found = false
      if (oldMedia !== undefined) {
        for (var j=0; j<oldMedia.length; j++) {
          if (recentData.recent.media[i].id === oldMedia[j].id) {
            found = true
          }
        }
      }
      if (!found) {
        tmpMedia.push(recentData.recent.media[i])
      }
    } 
    recentData.recent.media = tmpMedia

    // Remove the message
    if (oldDocument.message === recentData.recent.message) {
      recentData.recent.message = ""
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
    const count = Math.min((4 - newMedia.length), recentData.recent.media.length)
    for (var l=0; l<count; l++) {
      newMedia.push(recentData.recent.media[l])
    }

    // Set the New values
    recentData.recent.message = newDocument.message
    recentData.recent.user = newDocument.user
    recentData.recent.media = newMedia
    recentData.updated = newDocument.updated
  }

  return recentData
}

function createNotifications(tripId, postId, newDocument) {
  console.log(" --- go create notifications")

  const userId = newDocument.user.id
  // const message = newDocument.message
  
  const db = admin.firestore()
  return db.collection('trips').doc(tripId).collection('followers').get()
  // return db.collectionGroup('following').where('trip.id', '==', tripId).get()
    .then(snapshot => {
      console.log('Got followers')

      // Once we get the results, begin a batch
      var batch = db.batch();
      snapshot.forEach(doc => {
        var followerData = doc.data()
        var followerId = followerData.user.id

        // if (followerId !== userId) {      // Don't create a notification for the author of the post
          // Create a ref with auto-generated ID
          var ref = db.collection('users').doc(followerId).collection('notifications').doc()
          batch.set(ref, {
            created: newDocument.created,
            type: 10,
            trip: newDocument.trip,
            post: {
              id: postId,
              message: newDocument.message
            },
            user: newDocument.user, 
            read: false
          });
        // }

      });

      // Commit the batch
      console.log(' - commit the batch')
      return batch.commit();
    })
    .catch(err => {
      console.log('Error: ', err);
    });
}

function postDeleteMedia(tripId, oldDocument) {
  console.log('Do media delete')

  const config = JSON.parse(process.env.FIREBASE_CONFIG);
  const storage = admin.storage()
  const bucketName = config.storageBucket

  const promises = []
  for (var j=0; j<oldDocument.media.length; j++) {
    let media = oldDocument.media[j]
    
    const filename = `trips/${tripId}/images/${media.id}.jpg`
    console.log(' - ', filename)

    const p = storage.bucket(bucketName).file(filename).delete()
    promises.push(p)
  }
  console.log("- done the looping, go return all promises")
  return Promise.all(promises)
}

exports = module.exports = functions.firestore
  .document('trips/{tripId}/posts/{postId}')
  .onWrite((change, context) => {
    const tripId = context.params.tripId
    const postId = context.params.postId

    const [action, oldDocument, newDocument] = getAction(change)
    console.log('Action: ', action)
  
    // Make sure to ignore 'Waypoints'
    const postType = oldDocument ? oldDocument.type : newDocument.type
    if(postType === 90) {
      return true
    }

    // Rules
    // 1. Keep recent message and media in Trip and TripUser
    var recentData = {}
    // 2. Keep number of posts in Trip
    var postIncrement = action === 'create' ? 1 : action === 'delete' ? -1 : 0
    // 3. In case of delete, delete the media in storage

    // Fetch the matching Trip
    const db = admin.firestore()
    const tripRef = db.collection("trips").doc(tripId);

    return tripRef.get()
      .then(doc => {
        if (!doc.exists) {
          console.log('   + Trip is missing')
          throw new Error('Trip does not exist')
        }
        const tripData = doc.data()

        // Update the 'recent' data
        recentData = updateRecentData(tripData, oldDocument, newDocument)

        // Figure out the countries
        var countries = tripData.countries ? tripData.countries : []
        if (newDocument) {
          var country = newDocument.place && newDocument.place.country ? newDocument.place.country : null
          if (country && !countries.includes(country)) {
            countries.push(country)
          }
        }

        // Update the Trip
        var data = {
          recent: recentData.recent,
          updated: recentData.updated,
          countries: countries,
          posts: FieldValue.increment(postIncrement)
        }
        return tripRef.update(data)       // Return the promise and continue

      })
      .then(() => {
        console.log('Done with the Trip update: ', action)

        // in case of a delete, remove the media from storage
        if (action === 'create') {
          console.log(" - do the notifications")
          return createNotifications(tripId, postId, newDocument)
          // return true
        }
        else if (action === 'delete') {
          console.log(" - do the deletions")
          return postDeleteMedia(tripId, oldDocument)
        }
        else {
          return true
        }
      })
      // .then(value => {
      //   console.log('value: ', value)
      //   return true
      // })
      .catch(err => {
        console.log('Error getting document', err);
      });

  })  


  /*
  Logic for rebuilding the recent data 
  - Add post
    + message = post.message
    + user = post.user
    + updated = post.update
    + post = post.id + post.message
    + media = post.media with max of 4, if post.media < 4 append existing media up until it's 4

  - Update post
    + Just rebuild the whole thing, like Delete post  

  - Delete post
    + Rebuild the recent data  


  Rebuilding the recent data
  1. Get the most recent post
    - Check what happens if this is done for an update (not latest) or deletion
    + This post determines the message, updated, etc.. and the first set of media. 
    + If media < 4 append extra media from the existing recent..
    WARNING: Media might be delete, so in case of Deletion, remove the media first.
    NOTE: Currently we don't have Update post functionality  

    db.collection('trips').doc(tripId).collection('posts').orderBy('updated').limit(1)
      .then(snapshot => {

      })


  */