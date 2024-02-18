
require('dotenv').config();
const app = require('./app');
const express = require('express');
const PORT = process.env.PORT || 3000;
const HOST = process.env.DB_HOST || 'localhost';
var path = require('path');
const https = require('https');
const fs = require('fs');

// options for https
const options = {
  key: fs.readFileSync(path.join( '..','certs', 'ntuaflix_server.key.pem')),
  cert: fs.readFileSync(path.join('..', 'certs','ntuaflix_server.cert.pem'))
};

//initialize port for node application to run
https.createServer(options, app).listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));

app.get('/ntuaflix_api', (req, res) => {
    res.send('Hello World!');
  });
  



