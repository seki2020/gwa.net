// Bucket name: gwa-net.appspot.com
module.exports.getImage = async function (req, res) {
  const tripId = req.params.tripId
  const imageId = req.params.imageId

  console.log(`Get Image: ${tripId}/${imageId}`)

// function getImage(tripId, imageId, res) {
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage({
    projectId: 'gwa-net',
    keyFilename: '../../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
  });  

  /**
   * TODO(developer): Uncomment the following lines before running the sample.
   */
  const bucketName = 'gwa-net.appspot.com';
  const srcFilename = `trips/${tripId}/images/${imageId}.jpg`
  const destFilename = 'test_image.jpg';

  const options = {
    // The path to which the file should be downloaded, e.g. "./file.txt"
    destination: destFilename,
  };

  // Downloads the file
  // await storage
  //   .bucket(bucketName)
  //   .file(srcFilename)
  //   .download(options);

  var f = storage
    .bucket(bucketName)
    .file(srcFilename)

  console.log("We got a file, or not?")
  // console.log(f)  
  f.download().then(function(data) {
    console.log(data)
    var content = data[0]
    res.set('Content-Type', 'image/jpeg');
    res.send(content)
  }).catch(function() {
    console.log("We got error")
    res.end()
  })

  // res.end()  
}
