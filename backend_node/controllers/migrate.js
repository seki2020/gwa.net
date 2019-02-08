var express = require('express')
var router = express.Router()

// define the home page route
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// define the about route
router.get('/trips', function (req, res) {
  




  res.send('Get and show the trips')
})

module.exports = router