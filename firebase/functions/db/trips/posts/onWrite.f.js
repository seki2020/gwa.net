'use strict'
const functions = require('firebase-functions');
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
// try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

const FieldValue = require('firebase-admin').firestore.FieldValue;

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
    // const postId = context.params.postId

    // Get an object representing the document
    const oldDocument = change.before.exists ? change.before.data(): null
    const newDocument = change.after.exists ? change.after.data() : null

    const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
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
        console.log('Done update of the Trip, continue with Trip Users')

        // Get the Trip users
        return db.collection('trips-users').where('trip.id', '==', tripId).get()
      })
      .then(snapshot => {
        console.log('Got Trip Users results')

        // Once we get the results, begin a batch
        var batch = db.batch();
        snapshot.forEach(doc => {
            // For each doc, add a delete operation to the batch
            batch.update(doc.ref, recentData);
        });

        // Commit the batch
        return batch.commit();
      })
      .then(() => {
        console.log('Done with the tripUsers: ', action)

        // in case of a delete, remove the media from storage
        if (action === 'delete') {
          console.log(" - do the deletions")
          return postDeleteMedia(tripId, oldDocument)

          // console.log('Do media delete')
          // const storage = admin.storage()
          // for (var j=0; j<oldDocument.media.length; j++) {
          //   let media = oldDocument.media[j]
            
          //   const bucketName = 'gwa-net.appspot.com';
          //   const filename = `trips/${tripId}/images/${media.id}.jpg`

          //   // console.log(`   + media: ${filename}`)

          //   storage.bucket(bucketName).file(filename).delete()
          // }
        }
        else {
          console.log(" - Done")
          return true
        }
      })
      .then(value => {
        console.log('value: ', value)
        return true
      })
      .catch(err => {
        console.log('Error getting document', err);
      });


    // console.log("Function done")  
    // return true

  })  