const express = require('express')
const admin = require('firebase-admin')
const router = express.Router()

const usersMedia = require('../controllers/users/media')
const tripsMedia = require('../controllers/trips/media')
const places = require('../controllers/places/places')

// Test, later to the bottom
router.get('/places/nearby', places.nearBy)

// router.use((req, res, next) => {
//   // Get Auth Header value
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') { 
//     const idToken = req.headers.authorization.split(' ')[1];

//     // Verify the token
//     admin.auth().verifyIdToken(idToken)
//     .then((decodedToken) => {
//       req.token = decodedToken
//       next()

//     }).catch((error) => {
//       // Handle error
//       console.log(`- Trouble verifying the token: ${error}`)
//       res.sendStatus(403)
//     });    
//   }
//   else {
//     console.log(`- No Bearer token`)
//     res.sendStatus(403)
//   }
// })

// Users
router.get('/users/:imageId.jpg', usersMedia.getImage)

// Trips
router.get('/trips/:tripId/images/:imageId.jpg', tripsMedia.getImage)

module.exports = router