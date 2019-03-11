var express = require('express')
var router = express.Router()

const tripsMedia = require('../controllers/trips-media')

// define the home page route
// router.get('/', function (req, res) {
//   res.send('Trips home page')
// })

router.get('/:tripId/images/:imageId.jpg', tripsMedia.getImage)

// router.get('/:tripId/images/:imageId.jpg', (req, res) => {
//   // /trips/5P4dof5zt7iGGG9EmZoX/images/FeSDhDOdueIJj.jpg

//   console.log("Getting image")
//   // getImage(req.params.tripId, req.params.imageId, res)
//   // fs.pipe(res)
//   res.end()

// })

// router.get('/users', migrate.getUsers)
// router.get('/trips/:tripUrl', migrate.getTrips)
// router.get('/trips/:tripUrl/activities', migrate.getActivities)

module.exports = router