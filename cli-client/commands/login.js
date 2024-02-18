// commands/login.js
const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises'); // Use fs.promises for async file operations
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended in production)
});


module.exports = {
  command: 'login',
  describe: 'Login to the backend',
  builder: (yargs) => {
    yargs.option('username', {
      describe: 'Specify the username',
      demandOption: true,
      type: 'string',
    }).option('passw', {  // Change 'password' to 'passw' here
      describe: 'Specify the password',
      demandOption: true,
      type: 'string',
    });
  },
  handler: async (argv) => {
    try {
      // Check if the file containing the authentication token exists
      const tokenFileExists = await fs.access('authToken.txt').then(() => true).catch(() => false);

      if (tokenFileExists) {
        console.log('You are already logged in.');
        return;
      }

      const formData = new URLSearchParams();
      formData.append('username', argv.username);
      formData.append('password', argv.passw);  // Change 'password' to 'passw' here

      const response = await axios.post(endpoints.login, formData, {
        httpsAgent: agent,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      });

      const authToken = response.data.token;

      console.log('Login successful');
      console.log(`Hello, ${argv.username}!`);
      // console.log('Token:', authToken);

      // Save the token to a file or some storage mechanism
      await fs.writeFile('authToken.txt', authToken);
    } catch (error) {
      console.error('Login failed:', error.response ? error.response.data : error.message);
    }
  },
};
