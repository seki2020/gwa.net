
const admin = require('firebase-admin')
const serviceAccount = require('../../../secrets/gwa-net-13e914d23139.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gwa-net.firebaseio.com'
});

// Bucket name: gwa-net.appspot.com
module.exports.tripDelete = async function (req, res) {
  const tripId = req.params.tripId

  console.log(`Delete trip: ${tripId}`)

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { 
    const idToken = req.headers.authorization.split(' ')[1];

    // Verify the token
    admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
      var uid = decodedToken.uid;
      // ...
      console.log(`- Verified the token for: ${uid}`)

      // Find the deleted trip for the user (user can only delete their own trips)
      
      // Try to find in the datastore
      var ref = db.collection('trips');
      var query = ref.where('user.id', '==', user.id).where('url', '==', event.url).get()
        .then(snapshot => {
          if (snapshot.empty) {
            // Add the event
            addEvent(req, res, event)
            
          }
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });













    }).catch(function(error) {
      // Handle error
      console.log("- Trouble verifying the token")
    });    
  }
  res.json({"foo": "bar"});
}