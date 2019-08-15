const admin = require('firebase-admin')
const db = admin.firestore()
const storage = admin.storage()

const config = require('../secrets/config')

const got = require('got')
const stream = require('stream')
const {promisify} = require('util')

const {DateTime} = require('luxon')

const user = {
  id: config.adminUserId,
  name: "Aad"
}

function getUTCOffet(dateString, timeZone) {
  var d = DateTime.fromISO(dateString, { zone: timeZone }) 

  return d.offset
}

function getUnixTimeStamp(date) {
  return Math.round(date.getTime() / 1000);
}

function getRandomID(length) {
  var text = "";
  var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXUZ";

  for( var i=0; i < length; i++ )
      text += charset.charAt(Math.floor(Math.random() * charset.length));

  return text;
}

// const remoteUrl = 'https://gwa-net.appspot.com/export/trips/' 
const remoteBaseUrl = 'http://localhost:8081/' 
const remoteUrl = remoteBaseUrl + 'export/trips/' 


module.exports.getTrips = async function (req, res) {
  console.log("Move Trip")

  tripId = req.params.tripId
  
  const srcHost = req.protocol + '://' + req.headers.host

  // Get remote data to migrate
  const response = await got(remoteUrl + tripId, {json: true})
  const trip = response.body["trip"]

  var newTripId = tripId + '_x'

  // Check if trip already exists
  const tripRef = db.collection('trips').doc(newTripId)
  return tripRef.get()
    .then(doc => {
      if (!doc.exists) {
        // Add the event
        console.log(" - Create the Trip")
        // console.log(trip)

        var data = {
          name: trip.name,
          description: trip.description,
          // url: trip.url,
          featured: false,
          privacy: 0,
          followers: 0,
          start: {
            date: admin.firestore.Timestamp.fromDate(new  Date(trip.start.date)),
            timeZone: trip.start.timeZone,
            timeZoneOffset: trip.start.timeZoneOffset,
            place: {
              name: trip.start.place.name,
              description: trip.start.place.description,
              address: trip.start.place.address,
              city: trip.start.place.city,
              country: trip.start.place.country,
              location: new admin.firestore.GeoPoint(trip.start.place.location._latitude, trip.start.place.location._longitude)
            }
          },
          end: {
            date: admin.firestore.Timestamp.fromDate(new  Date(trip.end.date)),
            timeZone: trip.end.timeZone,
            timeZoneOffset: trip.end.timeZoneOffset,
            place: {
              name: trip.end.place.name,
              description: trip.end.place.description,
              address: trip.end.place.address,
              city: trip.end.place.city,
              country: trip.end.place.country,
              location: new admin.firestore.GeoPoint(trip.end.place.location._latitude, trip.end.place.location._longitude)
            }
          },
          created: admin.firestore.Timestamp.fromDate(new  Date(trip.start.date)),
          user: user
        }
        // console.log(data)

        // Add a new document with a generated id.
        return tripRef.set(data)
      }
      else {
        console.log(' - Trip already exists')
        return doc
      }
      
    })
    .then(ref => {
      console.log(' - Create the TripUser')

      // Need trip id and name
      var data = {
        role: 'owner',
        user: user,
        trip: {
          id: newTripId,
          name: trip.name
        },
        created: admin.firestore.Timestamp.fromDate(new  Date(trip.start.date)),
        updated: admin.firestore.Timestamp.fromDate(new  Date(trip.start.date))
      }
      // console.log(data)
      
      return tripRef.collection('followers').doc(user.id).set(data)

    })
    .then(async (ref) => {
      console.log(' - Move on to the Posts')

      // Call ourselves to get the first activity
      var sUrl = `${srcHost}/move/trips/${tripId}/posts`
      try {
        got(sUrl, {json: false})
      }
      catch (error ) {
        console.log(error)
      }
      return true
    })
    .then(() => {
      console.log(' - ** TRIP Done **')
      res.send('Working on migrating a trip')
    })
    .catch(err => {
      console.log('Error getting documents', err);
      res.end()
    });
}

module.exports.getPosts = async function (req, res) {
  console.log("Move post")

  const tripId = req.params.tripId
  const after = req.query.after

  const srcHost = req.protocol + '://' + req.headers.host

  // Get the remote URL
  var rUrl = `${remoteUrl}${tripId}/posts`
  if (after) {
    rUrl += `?after=${after}`
  }
  console.log(` - Get data: ${rUrl}`)

  var newTripId = tripId + '_x'

  // Get remote data to migrate
  const response = await got(rUrl, {json: true})
  const posts = response.body["posts"]

  // Check if trip already exists
  if (posts.length > 0) {
    const post = posts[0]       // Asume 1 post
    const postId = post.id
    const newPostId = postId + '_x'

    var trip = {}

    var tripRef = db.collection('trips').doc(newTripId);
    return tripRef.get()
      .then(doc => {
        console.log(" - Check the Trip")
        if (!doc.exists) {
          console.log('   + Trip is missing')
          throw ' ++ Trip does not exist'
        }

        // Get some important data
        let tripData = doc.data()
      
        // keep the trip
        trip = {
          id: doc.id,
          name: tripData.name
        }

        // Go and find the Post
        return tripRef.collection('posts').doc(newPostId).get()
      })
      .then( async(doc) => {
        if (!doc.exists) {
          console.log(' - Create post')

          data = {
            date: admin.firestore.Timestamp.fromDate(new  Date(post.date)),
            // media: post.media,
            message: post.message,
            timeZoneOffset: post.timeZoneOffset,
            timeZone: post.timeZone,
            trip: trip,
            user: user
          }
          if (post.place) {
            data.place = {
              name: post.place.name,
              description: post.place.description,
              address: post.place.address,
              city: post.place.city,
              country: post.place.country,
              location: new admin.firestore.GeoPoint(post.place.location._latitude, post.place.location._longitude)
            }
          }

          // Move the media, create media objects, fetch the media and store
          if (post.media) {
            data.media = post.media

            for (i=0; i<post.media.length; i++) {
              const media = post.media[i]
  
              const mediaUrl = `${remoteBaseUrl}api/trips/${tripId}/images/${media.id}.jpg`
              console.log(' - Move image: ', mediaUrl)
  
              // new
              const pipeline = promisify(stream.pipeline)
  
              // Move images
              const filename = `trips/${newTripId}/images/${media.id}.jpg`      // Target Filename
              var f = storage.bucket().file(filename)
              const writeStream = f.createWriteStream({
                metadata: {
                  contentType: media.contentType
                },
                resumable: false
              });
        
              try {
                await pipeline(got.stream(mediaUrl), writeStream)            
                console.log(" - Image moved")
              }
              catch (error ) {
                console.log(error)
              }            
            }
          }

          return tripRef.collection('posts').doc(newPostId).set(data)
        }
        else {
          console.log(' - Post already exists')
          return doc
        }
    })
    .then( async(ref) => {
      var ts = post.date

      console.log(' - Move to the next post: ', ts)

      // var jsDate = new Date(post.date + 'Z')

      // Call ourselves to get the next post
      var sUrl = `${srcHost}/move/trips/${tripId}/posts?after=${ts}`
      try {
        // const response = await got(sUrl, {json: false})
        got(sUrl, {json: false})
      }
      catch (error ) {
        console.log(error)
      }
      return true
    })
    .then(() => {
      console.log(' - ** POST Done **')
      res.end()
    })
    .catch(err => {
      console.error(err);
      res.end()
    });
  }
  else {
    console.log(' No more posts.. done!')
    res.end()
  }
  res.end()
}


// http://localhost:8081/export/trips/zNQdPUuwLf5nlu2kDhFn/posts?after=2019-05-19T12:02:33.574Z