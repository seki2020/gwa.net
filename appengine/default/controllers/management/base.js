
const admin = require('firebase-admin')
const db = admin.firestore()
const storage = admin.storage()
const config = require('../../secrets/config')


module.exports.getPermissions = async function (req, res) {
  // console.log(`Get Permissions`)

  // console.log(req.token)

  // console.log(config.adminUserId)


  // Return the data
  res.json({"permissions": req.token.uid == config.adminUserId})
}