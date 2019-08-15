var express = require('express')
var router = express.Router()

const exporting = require('../controllers/export')

// define the home page route
router.get('/', function (req, res) {
  res.json({"environment": 'export'})  
})

router.get('/trips/:tripId', exporting.getTrips)
router.get('/trips/:tripId/posts', exporting.getPosts)

module.exports = router