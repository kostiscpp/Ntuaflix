// commands/newtitles.js
const axios = require('axios');
const fs = require('fs/promises');
const { endpoints } = require('../config');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  command: 'newepisode',
  describe: 'Upload new episode (admin only)',
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
      const isAdmin = storedToken === process.env.AUTH_ADMIN;

      if (!isAdmin) {
        console.log('You need to be an admin to upload new episode.');
        return;
      }

      // Read the TSV file
      const tsvData = await fs.readFile(argv.filename, 'utf-8');

      // Upload the TSV file to the admin endpoint
      const response = await axios.post(endpoints.newepisode, tsvData, {
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
