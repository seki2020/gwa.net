var express = require('express')
var router = express.Router()

const migrate = require('../controllers/migrate')
const convert = require('../controllers/convert')

// define the home page route
router.get('/', function (req, res) {

  res.json({"environment": 'foo'})  
})

router.get('/trips/:tripUrl', migrate.getTrips)
router.get('/trips/:tripUrl/posts', migrate.getPosts)

router.get('/convert/timestamps', convert.timestamps)
router.get('/convert/waypoints', convert.waypoints)
router.get('/convert/followers', convert.followers)
router.get('/convert/trips-posts', convert.tripsPosts)

module.exports = router