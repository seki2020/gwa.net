const admin = require('firebase-admin')
const db = admin.firestore()

module.exports.getTrips = async function (req, res) {
  // console.log("Migrate Trip")

  const tripId = req.params.tripId

  return db.collection('trips').doc(tripId).get()
    .then(doc => {
      // console.log('got trip')

      result = {}
      if (doc.exists) {
        const tripData = doc.data()
        result = {
          countries: tripData.countries,
          created: tripData.created.toDate(),
          description: tripData.description,
          start: {
            date: tripData.start.date.toDate(),
            place: tripData.start.place,
            timeZone: tripData.start.timeZone,
            timeZoneOffset: tripData.start.timeZoneOffset
          },
          end: {
            date: tripData.end.date.toDate(),
            place: tripData.end.place,
            timeZone: tripData.end.timeZone,
            timeZoneOffset: tripData.end.timeZoneOffset
          },
          name: tripData.name,
          updated: tripData.updated.toDate(),

        }
      }
      
      res.json({"trip": result});

    })
    .catch(err => {
      console.error(err);
    });
}

module.exports.getPosts = async function (req, res) {
  // console.log("Migrate posts")

  const tripId = req.params.tripId
  const after = req.query.after

  // Query the datastore for first post after timestamp
  let q = db.collection('trips').doc(tripId).collection('posts').orderBy('date').limit(1)
  if (after) {
    jsDate = new Date(after)
    jsDate.setMilliseconds(jsDate.getMilliseconds() + 1)
    tsDate = admin.firestore.Timestamp.fromDate(jsDate)
    q = q.where('date', '>=', tsDate)
  }

  return q.get()
    .then( snapshot => {
      var posts = []
      // console.log(' - Check the post')
      if (!snapshot.empty) {
        // console.log('   + Got posts')
        
        snapshot.forEach(doc => {
          const postData = doc.data()

          let data = {
            id: doc.id,
            date: postData.date.toDate(),
            media: postData.media,
            message: postData.message,
            place: postData.place,
            timeZone: postData.timeZone,
            timeZoneOffset: postData.timeZoneOffset,
          }
          // console.log(data)
          posts.push(data)

        })
      }
      res.json({"posts": posts});
    })
    .catch(err => {
      console.error(err);
      res.end()
    });
}
