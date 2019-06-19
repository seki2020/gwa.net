var express = require('express')
var router = express.Router()

const flags = require('../controllers/management/flags')
// const convert = require('../controllers/convert')

// define the home page route
// router.get('/', function (req, res) {
//   res.send('Management home page')
// })

router.get('/flags', flags.getFlags)

module.exports = router