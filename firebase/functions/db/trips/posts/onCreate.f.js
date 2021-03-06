const functions = require('firebase-functions');
const admin = require('firebase-admin')

const FieldValue = require('firebase-admin').firestore.FieldValue;
const { getAction, isPropDirty } = require('../../utils')
const { continentForCountry } = require('../../countries')
 
exports = module.exports = functions.region('europe-west1').firestore
  .document('trips/{tripId}/posts/{postId}')
  .onCreate((snapshot, context) => {
    const tripId = context.params.tripId
    const postId = context.params.postId

    const postData = snapshot.data()

    const userId = postData.user.id

    const db = admin.firestore()
    const tripRef = db.collection("trips").doc(tripId);
    return tripRef.get()
      .then(doc => {
        if (!doc.exists) {
          throw new Error('Trip does not exist')
        }
        const tripData = doc.data()

        // Default 'recent'
        var recent = {
          message: postData.message,
          post: {
            id: postId,
            message: postData.message,
          },
          user: postData.user,
          media: []
        }
        // Get the media from the new post
        const newMedia = postData.media
        if (newMedia !== undefined && newMedia.length > 0) {
          for (var k=0; k<Math.min(4, newMedia.length); k++) {
            recent.media.push(newMedia[k])
          }
        } 
        // Append existing media until we have 4 
        const oldMedia = tripData.recent && tripData.recent.media ? tripData.recent.media : []
        const count = Math.min((4 - recent.media.length), oldMedia.length)
        for (var l=0; l<count; l++) {
          recent.media.push(oldMedia[l])
        }

        // Figure out the countries (we keep a list of countries visited in the trip)
        var countries = tripData.countries ? tripData.countries : []
        var country = postData.place && postData.place.country ? postData.place.country : null
        if (country && !countries.includes(country)) {
          countries.push(country)
        }
        // Find the continent
        var continents = tripData.continents ? tripData.continents : []
        continent = continentForCountry(country)
        if (continent && !continents.includes(continent)) {
          continents.push(continent)
        }

        // Update the Trip
        var data = {
          recent: recent,
          updated: postData.date,
          countries: countries,
          continents: continents,
          posts: FieldValue.increment(1)
        }
        return tripRef.update(data)       
      })
      .then(() => {
        // Collect followers
        return db.collection('trips').doc(tripId).collection('followers').get()
      })
      .then(snapshot => {
        // For each follower create a notification (except for the creator ;-))
        var batch = db.batch();
        snapshot.forEach(doc => {
          var followerData = doc.data()
          var followerId = followerData.user.id
  
          if (followerId !== userId) {      // Don't create a notification for the author of the post
            var ref = db.collection('users').doc(followerId).collection('notifications').doc()
            batch.set(ref, {
              created: postData.date,
              type: 10,
              trip: postData.trip,
              post: {
                id: postId,
                message: postData.message
              },
              user: postData.user, 
              read: false
            });
          }  
        });
        // Commit the batch
        return batch.commit();
      })
      .catch(err => {
        console.error(err);
      });
  })  