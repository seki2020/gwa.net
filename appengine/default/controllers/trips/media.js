const admin = require('firebase-admin')
const storage = admin.storage()

const config = require('../../secrets/config')

module.exports.getImage = async function (req, res) {
  const tripId = req.params.tripId
  const imageId = req.params.imageId

  const bucketName = config.bucketName
  const srcFilename = `trips/${tripId}/images/${imageId}.jpg`

  var f = storage.bucket(bucketName).file(srcFilename)

  f.download().then(function(data) {
    // console.log(data)
    var content = data[0]
    res.set('Content-Type', 'image/jpeg');
    res.send(content)
  }).catch(function() {
    console.log("Error fetching image")
    res.end()
  })

  // res.end()  
}
