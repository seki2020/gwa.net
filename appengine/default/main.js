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

  // # self.response.headers['Content-Security-Policy-Report-Only'] = \
  // # self.response.headers['Content-Security-Policy'] = \
  const rules = "default-src 'self' https://fonts.gstatic.com; \
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; \
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; \
    connect-src 'self' https://api.storyblok.com; \
    img-src 'self' https://img.youtube.com https://www.google-analytics.com; "

  res.set({
    // 'Content-Security-Policy-Report-Only': rules,
    'Content-Security-Policy': rules,
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'same-origin',
    'Feature-Policy': "camera 'none'; microphone 'none'"
  })

  res.sendFile(path.join(__dirname + '/static/index.html'))
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  // console.log(`Server listening on port ${PORT}...`);
});