const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');
// const parse = require('csv-parse/lib/sync');

const supportedFormats = ['json', 'csv'];

module.exports = {
  command: 'title',
  describe: 'Get information for a specific title',
  builder: (yargs) => {
    yargs.option('titleID', {
      describe: 'Specify the title ID for the requested title',
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

      let titleUrl = `${endpoints.title}/${argv.titleID}`;

      if (argv.format === 'csv') {
        // If the format is CSV, update the URL
        titleUrl = `${titleUrl}?format=csv`;
      }

      const response = await axios.get(titleUrl, {
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

      console.log('Title information:');

      if (argv.format === 'json') {
        console.log(response.data);
      } else if (argv.format === 'csv') {
        // Assuming the data is in CSV format, you may need to adjust based on the actual response format
        // const parsedData = parse(response.data, { columns: true });
        // console.log(parsedData);
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch title information:', error.message);
    }
  },
};
