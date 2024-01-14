const axios = require('axios');
const fs = require('fs/promises');
const readline = require('readline');
const { endpoints } = require('../config');
const dotenv = require('dotenv');

dotenv.config();

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
      const isAdmin = storedToken === process.env.AUTH_ADMIN;

      if (!isAdmin) {
        console.log('You need to be an admin to reset all data.');
        return;
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      // Prompt the user for confirmation
      const confirmation = await new Promise((resolve) => {
        rl.question('Are you sure you want to reset all data? ([Y]es/[N]o): ', (answer) => {
          if (['y', 'yes'].includes(answer.toLowerCase())) {
            resolve(true);
          } else {
            console.log('Reset aborted.');
            resolve(false);
          }
          rl.close();
        });
      });

      // Continue with the reset process if the user confirmed
      if (confirmation) {
        // Perform the reset by sending a post request
        const response = await axios.post(endpoints.resetall, {}, {
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
