const express = require('express');
const morgan = require('morgan')
const app = express();

// Controllers
const migrate = require('./controllers/migrate')

// Middle ware and routing
app.use(morgan('combined'))
app.use('/migrate', migrate)

app.get('/', (req, res) => {
  res.send('Hello from Aadje... Engine!');
});

app.get('/storage', (req, res) => {
  console.log("Checking out storage")

  listBuckets()

  res.send('done')
})

app.get('/trips/:tripId/images/:imageId.jpg', (req, res) => {
  // /trips/5P4dof5zt7iGGG9EmZoX/images/FeSDhDOdueIJj.jpg

  console.log("Getting image")
  getImage(req.params.tripId, req.params.imageId, res)
  // fs.pipe(res)
  // res.end()

})

async function listBuckets() {
  // [START storage_list_buckets]
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  // const storage = new Storage();

  const storage = new Storage({
    projectId: 'gwa-net',
    keyFilename: '../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
  });  

  // Lists all buckets in the current project
  const [buckets] = await storage.getBuckets();
  console.log('Buckets:');
  buckets.forEach(bucket => {
    console.log(bucket.name);
  });
  // [END storage_list_buckets]
}

// Bucket name: gwa-net.appspot.com
function getImage(tripId, imageId, res) {
  // Imports the Google Cloud client library
  const {Storage} = require('@google-cloud/storage');

  // Creates a client
  const storage = new Storage({
    projectId: 'gwa-net',
    keyFilename: '../secrets/gwa-net-13e914d23139.json'     // TODO: In production this probably doesn't work. ../secrets is outside scope of app.yaml and won't get uploaded
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

  // res.send()  
}


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});