'use strict'
const functions = require('firebase-functions');
const admin = require('firebase-admin')
// eslint-disable-next-line no-empty
try {admin.initializeApp(functions.config().firebase);} catch(e) {} // You do that because the admin SDK can only be initialized once.

const FieldValue = require('firebase-admin').firestore.FieldValue;

exports = module.exports = functions.firestore
  .document('trips-posts/{id}')
  .onWrite((change, context) => {
    // Get an object representing the document
    const oldDocument = change.before.exists ? change.before.data(): null
    const newDocument = change.after.exists ? change.after.data() : null

    const action = oldDocument === null ? 'create': newDocument === null ? 'delete': 'update'
    console.log('Action: ', action)
    // console.log('Old: ', oldDocument)
    // console.log('New: ', newDocument)
  
    const tripId = oldDocument ? oldDocument.trip.id : newDocument.trip.id

    // Rules
    // 1. Keep recent message and media in Trip and TripUser
    var recentData = {}
    // 2. Keep number of posts in Trip
    var postIncrement = action === 'create' ? 1 : action === 'delete' ? -1 : 0
    // 3. In case of delete, delete the media in storage

    // Fetch the matching Trip
    const db = admin.firestore()
    const tripRef = db.collection("trips").doc(tripId);
    tripRef.get()
      .then(doc => {
        if (doc.exists) {
          const tripData = doc.data()
          const recent = tripData.recent

          // 0. Current recent data
          recentData = {
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

          // 3. Update the Trip
          var data = {
            recent: recentData.recent,
            updated: recentData.updated,
            posts: FieldValue.increment(postIncrement)
          }
          return tripRef.update(data)

        }
        return true
      })
      .then(() => {
        console.log('Done update of the Trip, continue with Trip Users')

        // Batch update the TripUsers
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
        console.log('Done with the tripUsers')

        // in case of a delete, remove the media from storage
        if (action === 'delete') {
          console.log('Do media delete')
          const storage = admin.storage()
          // const bucket = storage.bucketName
          for (var j=0; j<oldDocument.media.length; j++) {
            let media = oldDocument.media[j]
            
            const bucketName = 'gwa-net.appspot.com';
            const filename = `trips/${tripId}/images/${media.id}.jpg`

            console.log(`   + media: ${filename}`)

            storage.bucket(bucketName).file(filename).delete()
          }
        }
        return true
      })
      .catch(err => {
        console.log('Error getting document', err);
      });

    return true

  })  