var express = require('express')
var router = express.Router()

const move = require('../controllers/move')

// define the home page route
router.get('/', function (req, res) {

  res.json({"environment": 'foo'})  
})

router.get('/trips/:tripUrl', move.getTrips)
router.get('/trips/:tripUrl/posts', move.getPosts)

module.exports = router