var express = require('express')
var router = express.Router()

const migrate = require('../controllers/migrate')
const convert = require('../controllers/convert')

// define the home page route
router.get('/', function (req, res) {
  
  // res.send(`Migrate home page: ${value}`)

  let data = {
    'GAE_APPLICATION': process.env.GAE_APPLICATION,
    'GAE_DEPLOYMENT_ID': process.env.GAE_DEPLOYMENT_ID,
    'GAE_ENV': process.env.GAE_ENV,
    'GAE_INSTANCE': process.env.GAE_INSTANCE,
    'GAE_MEMORY_MB': process.env.GAE_MEMORY_MB,
    'GAE_RUNTIME': process.env.GAE_RUNTIME,
    'GAE_SERVICE': process.env.GAE_SERVICE,
    'GAE_VERSION': process.env.GAE_VERSION,
    'GOOGLE_CLOUD_PROJECT': process.env.GOOGLE_CLOUD_PROJECT,
    'NODE_ENV': process.env.NODE_ENV,
    'PORT': process.env.PORT
  }

  res.json({"environment": data})  
})

router.get('/trips/:tripUrl', migrate.getTrips)
router.get('/trips/:tripUrl/activities', migrate.getActivities)

router.get('/convert/trips-posts', convert.tripsPosts)

module.exports = router