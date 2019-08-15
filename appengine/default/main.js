const express = require('express');
const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
const app = express();

const admin = require('firebase-admin')
const config = require('./secrets/config')

admin.initializeApp({
  credential: config.credential, 
  databaseURL: config.databaseUrl,
  storageBucket: config.bucketName
});

// Routers
const api = require('./routers/api')
const web = require('./routers/web')
const migrate = require('./routers/migrate')
const move = require('./routers/move')
const exporting = require('./routers/export')

// Middle ware 
// app.use(morgan('common'))

// Locally serve static files
app.use('/static', express.static('static/static'))
// app.use(favicon(path.join(__dirname, '/static/favicon.ico')))

// Set the routers
app.use('/api', api)
app.use('/web', web)
app.use('/migrate', migrate)
app.use('/move', move)
app.use('/export', exporting)

// For all other urls serve static/index.html. So we can type URLs
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'))
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  // console.log(`Server listening on port ${PORT}...`);
});