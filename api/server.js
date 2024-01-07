
require('dotenv').config();
const app = require('./app');
const express = require('express');
const PORT = process.env.PORT || 3000;
var path = require('path');



//initialize port for node application to run
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}!`));

app.get('/ntuaflix_api', (req, res) => {
    res.send('Hello World!');
  });
  



