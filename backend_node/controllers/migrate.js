const got = require('got')

const {Firestore} = require('@google-cloud/firestore');  
const db = new Firestore({
  projectId: 'gwa-net',
  keyFilename: '../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
}); 

const userId = "HVLCYVjM8Xd6bTvPohEky9NwgaF2"

async function migrateTrip(trip) {
  console.log(`migrate: ${trip.url} `)

  // Try to find in the datastore


}

module.exports.getTrips = async function (req, res) {

  const url = 'http://www.goingwalkabout.net/export/events/'
  
  // Async
  try {
    const response = await got(url, {json: true})
    const result = response.body["response"]
    const events = result["events"]

    events.forEach(event => {
      migrateTrip(event)
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

