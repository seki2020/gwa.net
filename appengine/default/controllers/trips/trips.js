const admin = require('firebase-admin')
const db = admin.firestore()
const storage = admin.storage()

const config = require('../../secrets/config')

function deleteNotifications(tripId) {
  return db.collectionGroup('notifications').where('trip.id', '==', tripId).get()
    .then(snapshot => {
      var batch = db.batch()
      snapshot.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }) 
    .catch(err => {
      console.log('Error: ', err);
      return false
    })
}

function deleteFlags(tripId) {
  return db.collection('trips').doc(tripId).collection('flags').get()
    .then(snapshot => {
      var batch = db.batch()
      snapshot.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }) 
    .catch(err => {
      console.log('Error: ', err);
      return false
    })
}

function deleteFollowers(tripId) {
  return db.collection('trips').doc(tripId).collection('followers').get()
    .then(snapshot => {
      var batch = db.batch()
      snapshot.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }) 
    .catch(err => {
      console.log('Error: ', err);
      return false
    })
}

function deletePosts(tripId) {
  return db.collection('trips').doc(tripId).collection('posts').get()
    .then(snapshot => {
      var batch = db.batch()
      snapshot.forEach(doc => {
        batch.delete(doc.ref)
      })
      return batch.commit()
    }) 
    .catch(err => {
      console.log('Error: ', err);
      return false
    })
}


module.exports.tripDelete = async function (req, res) {
  const tripId = req.params.tripId
  const uid = req.token.uid

  console.log(`Delete trip: ${tripId}`)


  // Find the deleted trip for the user (user can only delete their own trips)
  // let db = admin.firestore()

  // return Promise.reject('user cancelled');

  const tripRef = db.collection('trips').doc(tripId)

  return tripRef.get()
    .then(doc => {
      if (!doc.exists) {
        return Promise.reject('Trip does not exist');
        // throw new Error('Trip does not exist')
      }
      const tripData = doc.data()

      console.log(tripData.deleted)
      console.log(tripData.user.id)
      console.log(uid)

      if (!tripData.deleted || tripData.user.id != uid) {
        return Promise.reject('Trip cannot be deleted');

        // throw new Error('Trip cannot be deleted')
      }

      console.log("We can delete this trip")

      return deleteNotifications(tripId)
    })
    .then(doc => {
      console.log('Notifications - Done')

      // return Promise.reject('user cancelled');
      return deleteFlags(tripId) 
    })
    .then(doc => {
      console.log('Flags - Done')

      return deleteFollowers(tripId) 
    })
    .then(doc => {
      console.log('Followers - Done')

      return deletePosts(tripId) 
    })
    .then(doc => {
      console.log('Posts - Done')

      // return true
      return tripRef.delete()
    })
    .then(doc => {
      console.log('Done')
      res.json({"Done": "true"});
    })
    .catch(err => {
      console.error('Error: ', err);
      res.json({"Error": err});
    });
}