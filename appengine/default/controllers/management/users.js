
const admin = require('firebase-admin')
const db = admin.firestore()
const config = require('../../secrets/config')

module.exports.getUsers = async function (req, res) {
  if (req.token.uid != config.adminUserId) {
    res.sendStatus(403)
    res.end()
  }

  let users = db.collection('users').orderBy('created', 'desc').limit(100)
  users.get().then(function(querySnapshot) {
    // Collect the data
    return querySnapshot.docs.map(doc => Object.assign(doc.data(), {id: doc.id}));
    // if you can not use es6 syntax then replace {...doc.data(), id: doc.id} with Object.assign(doc.data(), {id: doc.id});

  }).then(data => {
    // Transform the data
    return data.map(doc => {
      let result = {
        'id': doc.id,
        'name': doc.name,
        'email': doc.email,
        'trips': doc.trips,
        'created': doc.created.toDate(),
        'updated': doc.updated.toDate()
      }
      return result
    })
  }).then (data => {
    // Return the data
    res.json({"users": data})
  })
}