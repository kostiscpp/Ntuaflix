// commands/logout.js
const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises'); // Use fs.promises for async file operations

module.exports = {
  command: 'logout',
  describe: 'Logout from the backend',
  handler: async () => {
    try {
      // Read the authentication token from the file
      const storedToken = await fs.readFile('authToken.txt', 'utf-8');

      if (!storedToken) {
        console.log('No authentication token found. Please log in first.');
        return;
      }

      const response = await axios.post(endpoints.logout, {}, {
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

      console.log('Logout successful');

      // Delete the authentication token file
      await fs.unlink('authToken.txt');
      // console.log('Token file deleted');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  },
};
