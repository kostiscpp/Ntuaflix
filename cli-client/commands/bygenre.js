const axios = require('axios');
const { endpoints } = require('../config');
const fs = require('fs/promises');

const supportedFormats = ['json', 'csv'];

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

      let byGenreUrl = `${endpoints.bygenre}?qgenre=${argv.genre}&minrating=${argv.min}`;

      if (argv.from) {
        byGenreUrl += `&yrFrom=${argv.from}`;
      }

      if (argv.to) {
        byGenreUrl += `&yrTo=${argv.to}`;
      }

      if (argv.format === 'csv') {
        byGenreUrl += `&format=csv`;
      }

      const response = await axios.get(byGenreUrl, {
        headers: { 'X-OBSERVATORY-AUTH': storedToken },
      });

      console.log('Movies by Genre:');

      if (argv.format === 'json') {
        if (argv.full) {
            console.log(JSON.stringify(response.data, null, 2));
        } else {
            console.log(response.data);
        }
      } else if (argv.format === 'csv') {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch movies by genre:', error.message);
    }
  },
};
