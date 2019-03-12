const express = require('express');
const morgan = require('morgan')
const favicon = require('serve-favicon')
const path = require('path')
const app = express();

// Routers
const api = require('./routers/api')
const trips = require('./routers/trips')
const migrate = require('./routers/migrate')

// Middle ware 
app.use(morgan('combined'))

// Locally serve static files
app.use('/static', express.static('static/static'))
app.use(favicon(path.join(__dirname, '/static/favicon.ico')))

// Set the routers
app.use('/api', api)
app.use('/trips', trips)
app.use('/migrate', migrate)


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/static/index.html'))
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});