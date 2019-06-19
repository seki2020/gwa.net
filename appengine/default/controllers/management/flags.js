
const admin = require('firebase-admin')
const db = admin.firestore()
const storage = admin.storage()

// Bucket name: gwa-net.appspot.com
module.exports.getFlags = async function (req, res) {
  console.log(`Get Flags`)

  let flags = db.collectionGroup('flags').orderBy('created', 'desc').limit(100)


  flags.get().then(function(querySnapshot) {
    // Collect the data
    return querySnapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
    // if you can not use es6 syntax then replace {...doc.data(), id: doc.id} with Object.assign(doc.data(), {id: doc.id});

  }).then(data => {
    // Transform the data
    return data.map(doc => {
      return {
        'id': doc.id,
        'type': doc.type,
        'created': doc.created.toDate(),
        'trip': doc.trip,
        'user': doc.user
      }

    })
  }).then (data => {
    // Return the data
    res.json({"flags": data})
  })
}