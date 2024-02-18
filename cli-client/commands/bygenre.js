const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');

const supportedFormats = ['json', 'csv'];
const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false, // Ignore SSL certificate validation (not recommended in production)
});
module.exports = {
  command: 'bygenre',
  describe: 'Get movies by genre with minimum rating and time range',
  builder: (yargs) => {
    yargs
      .option('genre', {
        describe: 'Specify the genre for the requested movies',
        demandOption: true,
        type: 'string',
      })
      .option('min', {
        describe: 'Specify the minimum rating for the requested movies',
        demandOption: true,
        type: 'number',
      })
      .option('from', {
        describe: 'Specify the start year for the time range',
        type: 'number',
      })
      .option('to', {
        describe: 'Specify the end year for the time range',
        type: 'number',
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
      const storedToken = await fs.readFile('authToken.txt', 'utf-8');

      if (!storedToken) {
        console.log('No authentication token found. Please log in first.');
        return;
      }

      let byGenreUrl = `${endpoints.bygenre}`;
      data = {
        qgenre: argv.genre,
        minrating: argv.min.toString(),
      };

      if (argv.from) {
        data.yrFrom = argv.from;
      }

      if (argv.to) {
        data.yrTo = argv.to;
      }

      if (argv.format === 'csv') {
        byGenreUrl += `?format=csv`;
      }

      const response = await axios.get(byGenreUrl, {
        httpsAgent : agent,
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
        data: data,
      });


      if (argv.format === 'json') {
        console.log(JSON.stringify(response.data, null, 2));
      } else if (argv.format === 'csv') {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch movies by genre:', error.message);
    }
  },
};
