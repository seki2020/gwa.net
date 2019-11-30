const admin = require('firebase-admin')
const db = admin.firestore()
const config = require('../../secrets/config')

module.exports.getTrips = async function (req, res) {
  if (req.token.uid != config.adminUserId) {
    res.sendStatus(403)
    res.end()
  }

  console.log("Get trips")

  let trips = db.collection('trips').orderBy('created', 'desc').limit(100)
  trips.get().then(function(querySnapshot) {
    // Collect the data
    return querySnapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
    // if you can not use es6 syntax then replace {...doc.data(), id: doc.id} with Object.assign(doc.data(), {id: doc.id});

  }).then(data => {
    // Transform the data
    return data.map(doc => {
      let result = {
        'id': doc.id,
        'name': doc.name,
        'user': doc.user.name,
        'shared': doc.shared,
        'featured': doc.featured,
        'followers': doc.followers,
        'posts': doc.posts,
        'created': doc.created.toDate(),
        'updated': doc.updated.toDate()
      }
      return result
    })
  }).then (data => {
    // Return the data
    res.json({"trips": data})
  })
}


module.exports.updateRecent = async function (req, res) {
  if (req.token.uid != config.adminUserId) {
    res.sendStatus(403)
    res.end()

  }
  // Get the Trip ID
  const tripId = req.params.tripId

  // Get the most recent posts for the trip
  db.collection('trips').doc(tripId).collection('posts').orderBy('date', 'desc').limit(10).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('   + No Posts')
      }
      else {
        var tripData = {
          recent: {
            media: [],
            message: "",
            user: null,
            post: null
          },
          updated: null
        }

        var postCount = 0
        var mediaCount = 0

        snapshot.forEach(doc => {
          var data = doc.data()
  
          // console.log("Source: ", doc.id, " => ", data.message);

          if (postCount == 0) {
            tripData.recent.message = data.message
            tripData.recent.post = {
              id: doc.id,
              message: data.message
            }
            tripData.recent.user = data.user
            tripData.updated = data.date
          }

          // Check the media, because we need the most recent 4 images
          if (data.media !== undefined) {
            for (i=0; i<data.media.length; i++) {
              if (mediaCount < 4) {
                tripData.recent.media.push(data.media[i])
                mediaCount += 1
              }
            }
          }

          postCount += 1
        })

        // Update the Trip
        return db.collection('trips').doc(tripId).update(tripData)       
      }
    })
    .then(doc => {
      console.log('Updated trip')
    })    
    .catch(err => {
      console.log('Error', err);
    });

  res.end()
}

module.exports.updateFollowers = async function (req, res) {
  if (req.token.uid != config.adminUserId) {
    res.sendStatus(403)
    res.end()

  }
  // Get the Trip ID
  const tripId = req.params.tripId
  var followers = null

  db.collection('trips').doc(tripId).collection('followers').get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('   + No followers')
      }
      else {
        followers = snapshot.size
        console.log(` got followers: ${followers}`)

        var data = {
          followers: followers
        }

        return db.collection('trips').doc(tripId).update(data)       
      }
    })
    .then(doc => {
      console.log('Updated trip')
      res.json({"followers": followers})      
    })    
    .catch(err => {
      console.log('Error', err);
      res.end()
    });
}

module.exports.updatePosts = async function (req, res) {
  if (req.token.uid != config.adminUserId) {
    res.sendStatus(403)
    res.end()

  }
  // Get the Trip ID
  const tripId = req.params.tripId
  var posts = null

  db.collection('trips').doc(tripId).collection('posts').get()
    .then(snapshot => {
      if (!snapshot.empty) {
        posts = snapshot.size

        return db.collection('trips').doc(tripId).update({posts: posts})       
      }
    })
    .then(doc => {
      res.json({"posts": posts})      
    })    
    .catch(err => {
      console.log('Error', err);
      res.end()
    });
}
