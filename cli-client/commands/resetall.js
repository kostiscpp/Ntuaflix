const axios = require('axios');
const fs = require('fs/promises');
const readline = require('readline');
const { endpoints } = require('../config');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended in production)
});

module.exports = {
  command: 'resetall',
  describe: 'Reset all data (admin only)',
  handler: async () => {
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
        console.log('You need to be an admin to reset all data.');
        return;
      }

      //const rl = readline.createInterface({
      //  input: process.stdin,
      //  output: process.stdout,
      //});

      // Prompt the user for confirmation
      const confirmation = true;

      // Continue with the reset process if the user confirmed
      if (confirmation) {
        // Perform the reset by sending a post request
        const response = await axios.post(endpoints.resetall, {}, {
          httpsAgent: agent,
          headers: {
            'X-OBSERVATORY-AUTH': storedToken,
          },
        });

        console.log('Reset successful');
        // console.log('Response:', response.data);
      }
    } catch (error) {
      console.error('Reset failed:', error.message);
    }
  },
};
