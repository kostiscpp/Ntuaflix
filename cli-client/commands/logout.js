// commands/logout.js
const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises'); // Use fs.promises for async file operations
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended in production)
});

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
        httpsAgent: agent,
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });
      
      console.log('Logout successful');

      // Delete the authentication token file
      await fs.unlink('authToken.txt');
      // console.log('Token file deleted');
    } catch (error) {
      await fs.unlink('authToken.txt');
      console.error('Logout failed:', error.message);
    }
  },
};
