const got = require('got')

const {DateTime} = require('luxon')
const {GeoPoint} = require('@google-cloud/firestore');  
const {Firestore} = require('@google-cloud/firestore');  
const db = new Firestore({
  projectId: 'gwa-net',
  keyFilename: '../../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
}); 

const {Storage} = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'gwa-net',
  keyFilename: '../../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
});  

// const user = {
//   id: "HVLCYVjM8Xd6bTvPohEky9NwgaF2",
//   name: "Aad"
// }
// Demo
const user = {
  id: "Mw9os612DzNrX0zn0NlTUmMbhf92",
  name: "Demo"
}

// const userId = "HVLCYVjM8Xd6bTvPohEky9NwgaF2"
const serverUrl = "http://localhost:8080"
const remoteUrl = 'http://www.goingwalkabout.net/export/events/' 


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

module.exports.getTrips = async function (req, res) {

  const tripUrl = req.params.tripUrl
  
  // Async
  try {
    // Get remote data to migrate
    const response = await got(remoteUrl + tripUrl, {json: true})
    const result = response.body["response"]

    // migrateTrip(req, res, result["event"])
  }
  catch (error ) {
    console.log(error)
  }

  res.send('Get and show the trips')
}

async function migrateTrip(req, res, event) {
  console.log(`Migrate: ${event.url} `)

  // Try to find in the datastore
  var ref = db.collection('trips');
  var query = ref.where('user.id', '==', user.id).where('url', '==', event.url).get()
    .then(snapshot => {
      if (snapshot.empty) {
        // Add the event
        addTrip(req, res, event)
        
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

async function addTrip(req, res, event) {
  console.log(` - Add: ${event.url}`)
  // Build data structure to insert
  data = {
    name: event.name,
    description: event.description,
    url: event.url,
    featured: false,
    privacy: 0,
    followers: 0,
    start: {
      date: Firestore.Timestamp.fromDate(new  Date(event.from.date + 'Z')),
      timeZone: event.from.tz,
      timeZoneOffet: getUTCOffet(event.from.date, event.from.tz),
      place: {
        name: event.from.place,
        description: event.from.place,
        location: new GeoPoint(event.from.location.lat, event.from.location.lon)
      }
    },
    end: {
      date: Firestore.Timestamp.fromDate(new  Date(event.until.date + 'Z')),
      timeZone: event.until.tz,
      timeZoneOffet: getUTCOffet(event.until.date, event.until.tz),
      place: {
        name: event.until.place,
        description: event.until.place,
        location: new GeoPoint(event.until.location.lat, event.until.location.lon)
      }
    },
    user: user
  }

  // console.log(data)


  // Add a new document with a generated id.
  db.collection('trips').add(data).then(ref => {
    // Now add the TripUser
    var data = {
      role: 'owner',
      user: user,
      trip: {
        id: ref.id,
        name: event.name
      },
      updated: Firestore.Timestamp.fromDate(new  Date(event.until.date + 'Z'))
    }

    // Make ID for the TripUser
    var uid = ref.id + '_' + user.id
    db.collection('trips-users').doc(uid).set(data).then(ref => {
      console.log(" - added user info")
    })  

  });
}

module.exports.getActivities = async function (req, res) {
  console.log("Get activities")
  // console.log(req.params)
  // console.log(req.query)

  const tripUrl = req.params.tripUrl
  const after = req.query.after

  // Try to find the trip, only if successfull we can continue in the datastore
  var ref = db.collection('trips');
  var query = ref.where('user.id', '==', user.id).where('url', '==', tripUrl).get()
    .then(snapshot => {
      if (!snapshot.empty) {
        let document = snapshot.docs[0]
        let data = document.data()

        const trip = {
          id: document.id,
          name: data.name
        }

        fetchActivities(tripUrl, trip, after)
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });

  res.end()
}

async function fetchActivities(tripUrl, trip, after) {
  console.log(" - Fetch activities")

  const limit = 1

  try {
    // Get remote data to migrate
    var rUrl = `${remoteUrl}${tripUrl}/activities?limit=${limit}`
    if (after) {
      rUrl += `&after=${after}`
    }
    console.log(`   + ${rUrl}`)

    const response = await got(rUrl, {json: true})
    const result = response.body["response"]
    const activities = result["activities"]

    var d = new Date()
    for (i=0; i<activities.length; i++) {
      activity = activities[i]

      // keep track of oldest date
      var activityDate = new Date(activity.date + 'Z')
      if(d > activityDate) {
        d = activityDate
      }

      migrateActivity(tripUrl, trip, activity)
    }

    if(activities.length == limit) {
      // Move on to the next batch
      var ts = getUnixTimeStamp(d)
      var sUrl = `${serverUrl}/migrate/trips/${tripUrl}/activities?after=${ts}`
  
      // Next Batch
      try {
        // console.log("Move on to the activities")
        const response = await got(sUrl, {json: true})
      }
      catch (error ) {
        console.log(error)
      }
    }
  }
  catch (error ) {
    console.log(error)
  }
}

async function migrateActivity(tripUrl, trip, activity) {
  // console.log("- Activity")

  // Try to find in the datastore
  // var ref = db.collection('trips-posts');
  var ref = db.collection('trips').doc(trip.id).collection('posts');
  var query = ref.where('reference', '==', activity.reference).get()
    .then(snapshot => {
      if (snapshot.empty) {
        // Add the event
        addActivity(trip, activity)
        
      }
    })

}

async function addActivity(trip, activity) {
  // console.log("   +++ Add")
  // console.log(activity)

  data = {
    message: activity.title,
    created: Firestore.Timestamp.fromDate(new  Date(activity.date + 'Z')),
    updated: Firestore.Timestamp.fromDate(new  Date(activity.date + 'Z')),
    source: activity.source,
    reference: activity.reference,
    timeZoneOffet: activity.tz_offset,
    timeZone: activity.tz_name,
    place: {
      name: activity.place,
      description: activity.place,
      location: new GeoPoint(activity.location.lat, activity.location.lon),
      country: activity.country
    },
    media: [],
    trip: trip,
    user: user
  }
  var media_list = []
  for (i=0; i<activity.media.length; i++) {
    m = activity.media[i]
    var media = {
      id: getRandomID(12),
      url: m.url,
      aspectRatio: m.width / m.height,
      contentType: m.content_type == "image/jpg" ? "image/jpeg" : m.content_type
    }
    media_list.push(media)
    data.media.push({
      id: media.id,
      aspectRatio: media.aspectRatio,
      contentType: media.contentType
    })
  }

  // Add a new document with a generated id.
  db.collection('trips').doc(trip.id).collection('posts').add(data).then(ref => {
  // db.collection('trips-posts').add(data).then(ref => {
    // console.log("Added the Post, go and get/upload the media")

    for (i=0; i<media_list.length; i++) {
      const media = media_list[i]

      const bucketName = 'gwa-net.appspot.com';
      const filename = `trips/${trip.id}/images/${media.id}.jpg`
      var f = storage
        .bucket(bucketName)
        .file(filename)
    
      const stream = f.createWriteStream({
        metadata: {
          contentType: media.contentType
        },
        resumable: false
      });

      // Get the image and send it to cloud storage
      got.stream(`${media.url}=s1920`).pipe(stream);

    }

  });

}

