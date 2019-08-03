
const admin = require('firebase-admin')
const db = admin.firestore()

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