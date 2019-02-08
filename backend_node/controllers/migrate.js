var express = require('express')
var router = express.Router()

const got = require('got')

// define the home page route
router.get('/', function (req, res) {
  res.send('Migrate home page')
})
// define the about route
router.get('/trips', function (req, res) {

  var url = 'http://www.goingwalkabout.net/export/events/'
  
  got(url, {json: true}).then( (response) => {
    // console.log(response.body)

    var result = response.body["response"]
    var events = result["events"]

    events.forEach(event => {
      console.log(event)
    });

    // console.log(events)
  })

  // logging.warning("Migrate stuff")

  // url = 'http://www.goingwalkabout.net/export/events/'

  // response = urlfetch.fetch(url=url)
  // result = json.loads(response.content)

  // print(result)
  // trips = result["response"]["events"]
  // for trip in trips:
  //     print(trip["name"])

  // return "Done doing migration"

  res.send('Get and show the trips')
})

module.exports = router