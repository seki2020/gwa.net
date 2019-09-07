const got = require('got')
const keys = require('../../secrets/keys')

module.exports.nearBy = async function (req, res) {
  let location = req.query.location;
  if (!location) {
    return res.end()
  }

  // Call remote to get nearby locations
  let places = []

	try {
    // Foursquare implemenation. This is the best, but requires billing so need to implement alternatives
    const url = `https://api.foursquare.com/v2/venues/search?ll=${location}&v=20190901&intent=checkin&limit=20&radius=150&client_id=${keys.foursquare.clientID}&client_secret=${keys.foursquare.clientSecret}`
    const response = await got(url, {json: true})
    if (response.statusCode == 200) {
      let venues = response.body.response.venues
      venues.forEach(venue => {
        places.push({
          'name': venue.name,
          'address': venue.location.address,
          'city': venue.location.city,
          'country': venue.location.cc,
          'location': {
            'latitude': venue.location.lat,
            'longitude': venue.location.lng
          },
          'distance': venue.location.distance
        })
      })
    }

  } catch (error) {
		console.log(error.response.body);
	}
  res.json({
    'source': 'foursquare',
    'places': places,
  });  
}