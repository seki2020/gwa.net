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

const remoteUrl = 'http://www.goingwalkabout.net/export/events/' 


module.exports.getTrips = async function (req, res) {
  console.log("Migrate Trip")

  const tripUrl = req.params.tripUrl
  
  const srcHost = req.protocol + '://' + req.headers.host

  // Get remote data to migrate
  const response = await got(remoteUrl + tripUrl, {json: true})
  const result = response.body["response"]
  const trip = result['event']

  // Check if trip already exists
  var ref = db.collection('trips');
  var query = ref.where('user.id', '==', user.id).where('url', '==', trip.url).get()
    .then(snapshot => {
      if (snapshot.empty) {
        // Add the event
        console.log(" - Create the Trip")

        var data = {
          name: trip.name,
          description: trip.description,
          url: trip.url,
          featured: false,
          privacy: 0,
          followers: 0,
          start: {
            date: admin.firestore.Timestamp.fromDate(new  Date(trip.from.date + 'Z')),
            timeZone: trip.from.tz,
            timeZoneOffet: getUTCOffet(trip.from.date, trip.from.tz),
            place: {
              name: trip.from.place,
              description: trip.from.place,
              location: new admin.firestore.GeoPoint(trip.from.location.lat, trip.from.location.lon)
            }
          },
          end: {
            date: admin.firestore.Timestamp.fromDate(new  Date(trip.until.date + 'Z')),
            timeZone: trip.until.tz,
            timeZoneOffet: getUTCOffet(trip.until.date, trip.until.tz),
            place: {
              name: trip.until.place,
              description: trip.until.place,
              location: new admin.firestore.GeoPoint(trip.until.location.lat, trip.until.location.lon)
            }
          },
          created: admin.firestore.Timestamp.fromDate(new  Date(trip.from.date + 'Z')),
          user: user
        }
        // Add a new document with a generated id.
        return db.collection('trips').add(data)
      }
      else {
        console.log(' - Trip already exists')
      }

      // move on to the activities
      return snapshot.docs[0]
    })
    .then(ref => {
      console.log(' - Create the TripUser')

      // Need trip id and name
      var data = {
        role: 'owner',
        user: user,
        trip: {
          id: ref.id,
          name: trip.name
        },
        created: admin.firestore.Timestamp.fromDate(new  Date(trip.from.date + 'Z')),
        updated: admin.firestore.Timestamp.fromDate(new  Date(trip.from.date + 'Z'))
      }
      
      return db.collection('trips').doc(ref.id).collection('followers').doc(user.id).set(data)

    })
    .then(async (ref) => {
      console.log(' - Move on to the Posts')

      // Call ourselves to get the first activity
      var sUrl = `${srcHost}/migrate/trips/${tripUrl}/posts`
      try {
        const response = await got(sUrl, {json: false})
      }
      catch (error ) {
        console.log(error)
      }

    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  res.send('Working on migrating a trip')
}

module.exports.getPosts = async function (req, res) {
  console.log("Migrate posts")

  const tripUrl = req.params.tripUrl
  const after = req.query.after

  const srcHost = req.protocol + '://' + req.headers.host

  // Get the remote URL
  var rUrl = `${remoteUrl}${tripUrl}/activities?limit=1`
  if (after) {
    rUrl += `&after=${after}`
  }
  console.log(` - ${rUrl}`)

  // Get remote data to migrate
  const response = await got(rUrl, {json: true})
  const result = response.body["response"]
  const posts = result['activities']

  // Check if trip already exists
  if (posts.length > 0) {
    const post = posts[0]

    var trip = {}

    var ref = db.collection('trips');
    var query = ref.where('user.id', '==', user.id).where('url', '==', tripUrl).get()
      .then(snapshot => {
        console.log(" - Check the Trip")
        if (snapshot.empty) {
          console.log('   + Trip is missing')
          throw ' ++ Trip does not exist'
        }

        // Get some important data
        let document = snapshot.docs[0]
        let data = document.data()
      
        // keep the trip
        trip = {
          id: document.id,
          name: data.name
        }

        // Go and find the Post
        return db.collection('trips').doc(trip.id).collection('posts').where('reference', '==', post.reference).get()
      })
      .then( async(snapshot) => {
        console.log(' - Check the post')
        if (snapshot.empty) {
          console.log('   + go and create the post')

          data = {
            message: post.title,
            date: admin.firestore.Timestamp.fromDate(new  Date(post.date + 'Z')),
            // updated: admin.firestore.Timestamp.fromDate(new  Date(post.date + 'Z')),
            source: post.source,
            reference: post.reference,
            timeZoneOffet: post.tz_offset,
            timeZone: post.tz_name,
            place: {
              name: post.place,
              description: post.place,
              location: new admin.firestore.GeoPoint(post.location.lat, post.location.lon),
              country: post.country
            },
            media: [],
            trip: trip,
            user: user
          }

          // Get the media, create media objects, fetch the media and store
          for (i=0; i<post.media.length; i++) {
            m = post.media[i]
            var media = {
              id: getRandomID(12),
              url: m.url,
              aspectRatio: m.width / m.height,
              contentType: m.content_type == "image/jpg" ? "image/jpeg" : m.content_type
            }

            data.media.push({
              id: media.id,
              aspectRatio: media.aspectRatio,
              contentType: media.contentType
            })

            // new
            const pipeline = promisify(stream.pipeline)

            // Move images
            const filename = `trips/${trip.id}/images/${media.id}.jpg`
            var f = storage.bucket().file(filename)
            const writeStream = f.createWriteStream({
              metadata: {
                contentType: media.contentType
              },
              resumable: false
            });
      
            try {
              await pipeline(
                got.stream(`${media.url}=s1920`),
                writeStream
              )            
              console.log(" - Image moved")
              }
            catch (error ) {
              console.log(error)
            }            
            // // Get the image and send it to cloud storage
            // const result = await got.stream(`${media.url}=s1920`).pipe(stream);
            // console.log(result)
          }

          return db.collection('trips').doc(trip.id).collection('posts').add(data)
        }
        else {
          // continue
        }
        return snapshot.docs[0]
    })
    .then( async(ref) => {
      console.log(' - Move to the next post')

      var dt = new Date(post.date + 'Z')
      var ts = getUnixTimeStamp(dt)

      // Call ourselves to get the first activity
      var sUrl = `${srcHost}/migrate/trips/${tripUrl}/posts?after=${ts}`
      try {
        const response = await got(sUrl, {json: false})
      }
      catch (error ) {
        console.log(error)
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
  }

  res.end()
}
