// commands/healthcheck.js
const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');
const dotenv = require('dotenv');

const supportedFormats = ['json', 'csv'];

dotenv.config(); // Load environment variables from .env file

module.exports = {
  command: 'healthcheck',
  describe: 'Perform health check (admin only)',
  builder: (yargs) => {
    yargs.option('format', {
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
      const isAdmin = storedToken === process.env.AUTH_ADMIN;

      if (!isAdmin) {
        console.log('You need to be an admin to perform the health check.');
        return;
      }

      let healthcheckUrl = endpoints.healthcheck;

      if (argv.format === 'csv') {
        // If the format is CSV, update the URL
        healthcheckUrl = `${endpoints.healthcheck}?format=csv`;
      }

      const response = await axios.get(healthcheckUrl, {
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

    //   console.log('Health check successful');

      if (argv.format === 'json') {
        console.log(response.data);
      } else if (argv.format === 'csv') {
        // Implement CSV formatting logic here
        console.log(response.data);
      }
    } catch (error) {
      console.error('Health check failed:', error.message);
    }
  },
};
