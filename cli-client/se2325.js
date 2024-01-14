#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
require('dotenv').config();
const { getAsciiArt } = require('./asciiArt'); // Import the getAsciiArt function

// Import individual command objects
const loginCommand = require('./commands/login');
const logoutCommand = require('./commands/logout');
const healthcheckCommand = require('./commands/healthcheck');
const userCommand = require('./commands/user');
const addUserCommand = require('./commands/addUser');
const resetAllCommand = require('./commands/resetall');
const newTitlesCommand = require('./commands/newtitles');
const newAkasCommand = require('./commands/newakas');
const newNamesCommand = require('./commands/newnames');
const newCrewCommand = require('./commands/newcrew');
const newEpisodeCommand = require('./commands/newepisode');
const newPrincipalsCommand = require('./commands/newprincipals');
const newRatingsCommand = require('./commands/newratings');
const titleCommand = require('./commands/title');
const searchTitleCommand = require('./commands/searchtitle');
const byGenreCommand = require('./commands/bygenre');
const nameCommand = require('./commands/name');
const searchNameCommand = require('./commands/searchname');

// Import the config object
const config = require('./config');

// console.log(getAsciiArt());

const argv = yargs(hideBin(process.argv))
  .version(require('./package.json').version)
  .scriptName('se2325')
  .usage('CLI for interacting with the ntuaflix REST API')
  .help()
  .strict()
  .demandCommand(1) // Require at least one command before showing help
  .recommendCommands()
  .command(loginCommand)
  .command(logoutCommand)
  .command(healthcheckCommand)
  .command(userCommand)
  .command(addUserCommand)
  .command(resetAllCommand)
  .command(newTitlesCommand)
  .command(newAkasCommand)
  .command(newNamesCommand)
  .command(newCrewCommand)
  .command(newEpisodeCommand)
  .command(newPrincipalsCommand)
  .command(newRatingsCommand)
  .command(titleCommand)
  .command(searchTitleCommand)
  .command(byGenreCommand)
  .command(nameCommand)
  .command(searchNameCommand)
  .epilogue('For more information, visit the documentation at https://your-docs-url.com')
  .argv;

