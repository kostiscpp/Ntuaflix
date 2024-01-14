const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');

const supportedFormats = ['json', 'csv'];

module.exports = {
  command: 'searchname',
  describe: 'Search for a specific person',
  builder: (yargs) => {
    yargs
      .option('name', {
        describe: 'Specify the name ID for the requested person',
        demandOption: true,
        type: 'string',
      })
      .option('format', {
        describe: 'Specify the output format (json or csv)',
        type: 'string',
        choices: supportedFormats,
        default: 'json',
      })
      .option('full', {
        describe: 'Print the full response details',
        type: 'boolean',
        default: false,
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

      let searchNameUrl = `${endpoints.searchname}?namePart=${encodeURIComponent(argv.name)}`;
      if (argv.format === 'csv') {
        // If the format is CSV, update the URL
        searchTitleUrl = `${searchTitleUrl}&format=csv`;
      }

      const response = await axios.get(searchNameUrl, {
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

      console.log('Search result for name:');

      if (argv.format === 'json') {
        if (argv.full) {
          console.log(JSON.stringify(response.data, null, 2));
        } else {
          console.log(response.data);
        }
      } else if (argv.format === 'csv') {
        // Assuming the data is in CSV format, you may need to adjust based on the actual response format
        // const parsedData = parse(response.data, { columns: true });
        // console.log(parsedData);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to search for name:', error.message);
    }
  },
};
