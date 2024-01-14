const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');

const supportedFormats = ['json', 'csv'];

module.exports = {
  command: 'name',
  describe: 'Get information for a specific person',
  builder: (yargs) => {
    yargs.option('nameid', {
      describe: 'Specify the name ID for the requested person',
      demandOption: true,
      type: 'string',
    }).option('format', {
      describe: 'Specify the output format (json or csv)',
      type: 'string',
      choices: supportedFormats,
      default: 'json',
    });
  },
  handler: async (argv) => {
    try {
      // Assume you retrieve the authentication token from some storage
      const storedToken = await fs.readFile('authToken.txt', 'utf-8');

      if (!storedToken) {
        console.log('No authentication token found. Please log in first.');
        return;
      }

      let nameUrl = `${endpoints.name}/${argv.nameid}`;

      if (argv.format === 'csv') {
        // If the format is CSV, update the URL
        nameUrl = `${nameUrl}?format=csv`;
      }

      const response = await axios.get(nameUrl, {
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

      console.log('Person information:');

      if (argv.format === 'json') {
        console.log(response.data);
      } else if (argv.format === 'csv') {
        // Assuming the data is in CSV format, you may need to adjust based on the actual response format
        // const parsedData = parse(response.data, { columns: true });
        // console.log(parsedData);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch person information:', error.message);
    }
  },
};
