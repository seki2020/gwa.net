const admin = require('firebase-admin')
const db = admin.firestore()

module.exports.getTrips = async function (req, res) {
  console.log("Migrate Trip")

  const tripId = req.params.tripId

  return db.collection('trips').doc(tripId).get()
    .then(doc => {
      console.log('got trip')

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

  // res.json({"trip": tripId});

}