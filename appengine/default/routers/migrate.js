var express = require('express')
var router = express.Router()

const migrate = require('../controllers/migrate')

// define the home page route
router.get('/', function (req, res) {
  res.send('Migrate home page')
})

router.get('/trips/:tripUrl', migrate.getTrips)
router.get('/trips/:tripUrl/activities', migrate.getActivities)

module.exports = router