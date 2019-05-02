var express = require('express')
var router = express.Router()

const migrate = require('../controllers/migrate')
const convert = require('../controllers/convert')

// define the home page route
router.get('/', function (req, res) {
  res.send('Migrate home page')
})

router.get('/trips/:tripUrl', migrate.getTrips)
router.get('/trips/:tripUrl/activities', migrate.getActivities)

router.get('/convert/trips-posts', convert.tripsPosts)

module.exports = router