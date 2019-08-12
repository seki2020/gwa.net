
const admin = require('firebase-admin')
const db = admin.firestore()

const FieldValue = require('firebase-admin').firestore.FieldValue

function getRandomID(length) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXUZ";

  for( var i=0; i < length; i++ )
      text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}

module.exports.tripsPosts = async function (req, res) {

  console.log(`Convert TripsPosts`)

  // Get all the TripPosts and recreate as Trips/Posts
  db.collection('trips-posts').orderBy("created").limit(20).get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var data = doc.data()
        var tripId = data.trip.id

        console.log("Source: ", doc.id, " => ", data);

        // Fix it up
        // delete data.trip

        // Fix the media
        if (data.media !== undefined) {
          for (i=0; i<data.media.length; i++) {
            m = data.media[i]
            m.aspectRatio = m.ratio 
            delete m.ratio
            m.contentType = m.type
            delete m.type
          }
        }

        if (data.place !== undefined) {
          data.place.country = "NL"
        }

        // Create a Trip/Post
        ref = db.collection('trips').doc(tripId).collection('posts').add(data)
          .then(ref => {
            console.log("Created Post")
          })  
          .catch(error => {
            console.log(error)
          })


        console.log("Target: ", doc.id, " => ", data);

      })
    })
    .catch(err => {
      console.log('Error getting documents', err);
    })

    res.send('Converting TripsPosts')

}

module.exports.followers = async function (req, res) {

  console.log(`Convert Followers`)

  // Get all the TripUsers and recreate as Trips/Followers
  db.collection('trips-users').get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        var data = doc.data()
        var userId = data.user.id
        var tripId = data.trip.id

        // console.log("Source: ", doc.id, " => ", data);

        // Create a Trip/Follower
        ref = db.collection('trips').doc(tripId).collection('followers').doc(userId).set(data)
        // ref = db.collection('users').doc(userId).collection('following').doc(tripId).set(data)
          .then(ref => {
            console.log("Created Following")
          })  
          .catch(error => {
            console.log(error)
          })

        // console.log("Target: ", doc.id, " => ", data);

      })
    })
    .catch(err => {
      console.log('Error getting documents', err);
    })

    res.send('Converting Followers')

}

module.exports.waypoints = async function (req, res) {

  console.log(`Convert Waypoints`)

  // Get all the TripUsers and recreate as Trips/Followers

  const tripRef = db.collection('trips').doc('qrB8ENTnhsWDtvVVlRCe')

  tripRef.collection('posts').where('type', '==', 90).get()
    .then(snapshot => {

      var waypoints = []
      snapshot.forEach(doc => {
        var data = doc.data()

        // console.log("Source: ", doc.id, " => ", data);

        waypoints.push({
          id: getRandomID(12),
          date: data.updated,
          location: data.location,
          user: data.user
        })
      })

      return tripRef.update({
        'waypoints': waypoints
      })
      // return tripRef.update({
      //   'waypoints': admin.firestore.FieldValue.arrayUnion(waypoints)
      // })

    })
    .then(doc => {
      console.log('Updated trip')
    })    
    .catch(err => {
      console.log('Error getting documents', err);
    })

    res.send('Converting Waypoints')

}


module.exports.timestamps = async function (req, res) {

  console.log(`Convert Timestamps`)

  // Get all the TripUsers and recreate as Trips/Followers

  const tripRef = db.collection('trips').doc('zNQdPUuwLf5nlu2kDhFn')

  tripRef.collection('posts').get()
    .then(snapshot => {

      var batch = db.batch()
      snapshot.forEach(doc => {
        var data = doc.data()

        if (data.type == 90) {
          batch.delete(doc.ref)
        }
        else {
          batch.update(doc.ref, {
            date: data.updated,
            created: FieldValue.delete(),
            timestamp: FieldValue.delete()
          })
        }

      })
      return batch.commit()

    })
    .then(doc => {
      console.log('Updated trip')
    })    
    .catch(err => {
      console.log('Error getting documents', err);
    })

    res.send('Converting Timestamps')

}