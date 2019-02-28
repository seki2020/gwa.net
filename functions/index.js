const functions = require('firebase-functions');

const admin = require('firebase-admin')
admin.initializeApp()


exports.createTripPost = functions.firestore
    .document('trips-posts/{id}')
    .onCreate((document, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = document.data();

      // access a particular field as you would any JS property
      const message = newValue.message;
      const updated = newValue.updated
      const tripId = newValue.trip.id

      // perform desired operations ...
      console.log(message)

      // Get the TripUser collection?
      const db = admin.firestore()

      var ref = db.collection('trips-users');
      var query = ref.where('trip.id', '==', tripId).get()
        .then(snapshot => {
          if (snapshot.empty) {
            console.log('No matching documents.');
            return null;
          }
      
          snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());

            let docRef = db.collection("trips-users").doc(doc.id)

            docRef.update({
              lastMessage: message,
              updated: updated
            })

          });
          return true
        })
        .catch(err => {
          console.log('Error getting documents', err);
        });

      return true
    });