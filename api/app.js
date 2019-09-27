'use strict';

// load all the modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')
const { sequelize } = require('./models');
const cors = require('cors');

// This variable will enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// This creates the Express app
const app = express();

(async () => {
  try {
    
    // This will Test the connection to the database and log it to console//
    await sequelize.authenticate();
    console.log('Connection to the database was successful');

    // Sync the models
    await sequelize.sync();
    console.log('Models are synchronized with the database');

  }catch(err){
    
    console.log('Connection to the database was unsuccessful' + ' ' + err)

  }
})()
//setup cors
app.use(cors());

// setup morgan which gives us http request logging
app.use(morgan('dev'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// Api routes setup for users and courses//
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/courses'));

// Root route setup with greeting//
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to REST API project!',
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// Start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is running on http://localhost:${server.address().port}`);
});

