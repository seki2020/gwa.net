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

function getUTCOffet(dateString, timeZone) {
  var d = DateTime.fromISO(dateString, { zone: timeZone }) 

  return d.offset
}

async function addEvent(event) {
  console.log(` - Add: ${event.url}`)
  // Build data structure to insert
  data = {
    name: event.name,
    description: event.description,
    url: event.url,
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

  // Add a new document with a generated id.
  db.collection('trips').add(data).then(ref => {
    console.log('Added document with ID: ', ref.id);

    // Now add the TripUser
    var data = {
      role: 'owner',
      user: user,
      trip: {
        uid: ref.id,
        name: event.name
      },
      updated: Firestore.Timestamp.fromDate(new  Date(event.until.date + 'Z'))
    }

    db.collection('trips-users').add(data).then(ref => {
      console.log(" - added user info")
    })  

  });
}

async function migrateEvent(event) {
  console.log(`Migrate: ${event.url} `)

  // Try to find in the datastore
  var ref = db.collection('trips');
  var query = ref.where('user.uid', '==', user.uid).where('url', '==', event.url).get()
    .then(snapshot => {
      if (snapshot.empty) {
        addEvent(event)
      }
    })
    .catch(err => {
      console.log('Error getting documents', err);
    });
}

module.exports.getTrips = async function (req, res) {

  const url = 'http://www.goingwalkabout.net/export/events/'
  
  // Async
  try {
    const response = await got(url, {json: true})
    const result = response.body["response"]
    const events = result["events"]

    events.forEach(event => {
      migrateEvent(event)
      // console.log(event)
    })
  }
  catch (error ) {
    console.log(error)
  }

  res.send('Get and show the trips')
}

module.exports.getUsers = async function (req, res) {
  // const {Firestore} = require('@google-cloud/firestore');  
  // const db = new Firestore({
  //   projectId: 'gwa-net',
  //   keyFilename: '../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
  // });  

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

