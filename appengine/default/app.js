const express = require('express');
// const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
const app = express();

const admin = require('firebase-admin')
const serviceAccount = require('./secrets/gwa-net-13e914d23139.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://gwa-net.firebaseio.com'
});

// Routers
const api = require('./routers/api')
const web = require('./routers/web')
const migrate = require('./routers/migrate')

// Middle ware 
// app.use(morgan('combined'))

// Locally serve static files
app.use('/static', express.static('static/static'))
app.use(favicon(path.join(__dirname, '/static/favicon.ico')))

// Set the routers
app.use('/api', api)
app.use('/web', web)

app.use('/migrate', migrate)


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'))
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  // console.log(`Server listening on port ${PORT}...`);
});