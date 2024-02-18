// commands/newtitles.js
const axios = require('axios');
const fs = require('fs/promises');
const { endpoints } = require('../config');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended in production)
});

module.exports = {
  command: 'newratings',
  describe: 'Upload new titles (admin only)',
  builder: (yargs) => {
    yargs.option('filename', {
      describe: 'Specify the filepath of the TSV file',
      demandOption: true,
      type: 'string',
    });
  },
  handler: async (argv) => {
    try {
      // Read the authentication token from the file
      const storedToken = await fs.readFile('authToken.txt', 'utf-8');

      if (!storedToken) {
        console.log('No authentication token found. Please log in first.');
        return;
      }

      // Check if the user is an admin (use process.env for comparison)
      const isAdmin = jwt.verify(storedToken, process.env.JWT_SECRET_KEY).role === 'admin';

      if (!isAdmin) {
        console.log('You need to be an admin to upload new ratings.');
        return;
      }

      // Read the TSV file
      const tsvData = await fs.readFile(argv.filename, 'utf-8');

      // Upload the TSV file to the admin endpoint
      const response = await axios.post(endpoints.newratings, tsvData, {
        httpsAgent: agent,
        headers: {
          'X-OBSERVATORY-AUTH': storedToken,
          'content-type': 'text/tab-separated-values',
        },
      });

      console.log('Upload successful');
      // console.log('Response:', response.data);
    } catch (error) {
      console.error('Upload failed:', error.message);
    }
  },
};
