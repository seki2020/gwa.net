var express = require('express')
const admin = require('firebase-admin')
var router = express.Router()

const base = require('../controllers/management/base')
const flags = require('../controllers/management/flags')

router.use((req, res, next) => {
  // Get Auth Header value
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { 
    const idToken = req.headers.authorization.split(' ')[1];

    // Verify the token
    admin.auth().verifyIdToken(idToken)
    .then((decodedToken) => {
      req.token = decodedToken
      next()

    }).catch((error) => {
      // Handle error
      console.log(`- Trouble verifying the token: ${error}`)
      res.sendStatus(403)
    });    
  }
  else {
    console.log(`- No Bearer token`)
    res.sendStatus(403)
  }
})

router.get('/management/', base.getPermissions)
router.get('/management/flags', flags.getFlags)

module.exports = router