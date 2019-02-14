const got = require('got')

const {DateTime} = require('luxon')
const {GeoPoint} = require('@google-cloud/firestore');  
const {Firestore} = require('@google-cloud/firestore');  
const db = new Firestore({
  projectId: 'gwa-net',
  keyFilename: '../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
}); 

const user ={
  uid: "HVLCYVjM8Xd6bTvPohEky9NwgaF2",
  name: "Aad 't Hart"
}
// const userId = "HVLCYVjM8Xd6bTvPohEky9NwgaF2"
const serverUrl = "http://localhost:8080"
const remoteUrl = 'http://www.goingwalkabout.net/export/events/' 


function getUTCOffet(dateString, timeZone) {
  var d = DateTime.fromISO(dateString, { zone: timeZone }) 

  return d.offset
}

async function addEvent(req, res, event) {
  console.log(` - Add: ${event.url}`)
  // Build data structure to insert
  data = {
    name: event.name,
    description: event.description,
    url: event.url,
    featured: true,
    from: {
      date: Firestore.Timestamp.fromDate(new  Date(event.from.date + 'Z')),
      timeZone: event.from.tz,
      timeZoneOffet: getUTCOffet(event.from.date, event.from.tz),
      place: {
        name: event.from.place,
        location: new GeoPoint(event.from.location.lat, event.from.location.lon)
      }
    },
    until: {
      date: Firestore.Timestamp.fromDate(new  Date(event.until.date + 'Z')),
      timeZone: event.until.tz,
      timeZoneOffet: getUTCOffet(event.until.date, event.until.tz),
      place: {
        name: event.until.place,
        location: new GeoPoint(event.until.location.lat, event.until.location.lon)
      }
    },
    user: user
  }

  // console.log(data)

  // Test calling a new URL
  res.end()
  try {
    console.log("Move on to the activities")

    const query = new URLSearchParams([['trip_id', 123], ['trip_name', event.name]]);
    const response = await got("/migrate/trips/" + event.url + "/activities" , {baseUrl: serverUrl, json: true, query})
  }
  catch (error ) {
    console.log(error)
  }

  // Add a new document with a generated id.
  // db.collection('trips').add(data).then(ref => {
  //   console.log('Added document with ID: ', ref.id);

  //   // Now add the TripUser
  //   var data = {
  //     role: 'owner',
  //     user: user,
  //     trip: {
  //       uid: ref.id,
  //       name: event.name
  //     },
  //     updated: Firestore.Timestamp.fromDate(new  Date(event.until.date + 'Z'))
  //   }

  //   db.collection('trips-users').add(data).then(ref => {
  //     console.log(" - added user info")

  //     // Go and get the activities for this trip

  //   })  

  // });
}

async function migrateEvent(req, res, event) {
  console.log(`Migrate: ${event.url} `)

  // Try to find in the datastore
  var ref = db.collection('trips');
  var query = ref.where('user.uid', '==', user.uid).where('url', '==', event.url).get()
    .then(snapshot => {
      if (snapshot.empty) {
        // Add the event
        addEvent(req, res, event)
        
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

async function addActivity(req, res, activity) {
  console.log("   +++ Add")
}

async function migrateActivity(req, res, tripUrl, trip, activity) {
  console.log("- Acivity")
  console.log(trip)
  console.log(activity)

  // Try to find in the datastore
  var ref = db.collection('trips-posts');
  var query = ref.where('user.uid', '==', user.uid).where('trip.uid', '==', trip.uid).where('reference', '==', activity.reference).get()
    .then(snapshot => {
      if (snapshot.empty) {
        // Add the event
        addActivity(req, res, activity)
        
      }
    })

}


module.exports.getTrips = async function (req, res) {

  const trip = "berlin2015"
  
  // Async
  try {
    // Get remote data to migrate
    const response = await got(remoteUrl + trip, {json: true})
    const result = response.body["response"]

    migrateEvent(req, res, result["event"])
  }
  catch (error ) {
    console.log(error)
  }

  res.send('Get and show the trips')
}

module.exports.getActivities = async function (req, res) {

  console.log("Go and get activities for the trip")
  console.log(req.params)
  console.log(req.query)

  const trip = {
    uid: req.query.trip_id,
    name: req.query.trip_name
  }
  const tripUrl = req.params.tripUrl

  // Async
  try {
    // Get remote data to migrate
    const response = await got(remoteUrl + tripUrl + '/activities?limit=2', {json: true})
    const result = response.body["response"]
    const activities = result["activities"]

    activities.forEach(activity => {
      migrateActivity(req, res, tripUrl, trip, activity)
    })

    // migrateEvent(req, res, result["event"])
  }
  catch (error ) {
    console.log(error)
  }

  res.end()
}

module.exports.getUsers = async function (req, res) {
  try {
    var users = await db.collection('users').get()
    users.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });

    // return users
  }
  catch (error) {
    console.log(error)
  }
  res.send('Connected to Firestore')

}

