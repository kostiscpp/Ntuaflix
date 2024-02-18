// commands/users.js
const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const supportedFormats = ['json', 'csv'];

dotenv.config(); // Load environment variables from .env file
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended in production)
});

module.exports = {
  command: 'user',
  describe: 'Create a new user (admin only)',
  builder: (yargs) => {
    yargs.option('username', {
      describe: 'Specify the username for the new user',
      type: 'string',
      demandOption: true,
    }).option('format', {
      describe: 'Specify the output format (json or csv)',
      type: 'string',
      choices: supportedFormats,
      default: 'json',
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
        console.log('You need to be an admin to create a new user.');
        return;
      }

      // Append the username to the usersUrl
      let usersUrl = `${endpoints.users}/${argv.username}`;
      if (argv.format === 'csv') {
        // If the format is CSV, update the URL
        usersUrl = `${usersUrl}?format=csv`;
      }
  
      const response = await axios.get(usersUrl, {
        httpsAgent: agent,
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

      console.log('User search successful');

      if (argv.format === 'json') {
        console.log(response.data);
      } else if (argv.format === 'csv') {
        console.log(response.data);
      }
    } catch (error) {
      console.error('User search failed:', error.message);
    }
  },
};
