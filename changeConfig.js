const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

// Read the JSON file
const configFile = './src/config/config.json';
const rawData = fs.readFileSync(configFile);
const config = JSON.parse(rawData);

// Modify values in the config object
config["development"].username = process.env.DB_USER;
config["development"].password = process.env.DB_PASSWORD;
config["development"].database = process.env.DB_NAME;
config["development"].port = process.env.DB_PORT;
config["development"].host = process.env.DB_HOST

// Write the modified JSON back to the file
const modifiedData = JSON.stringify(config, null, 2); // The third argument is the number of spaces for formatting
fs.writeFileSync(configFile, modifiedData);

console.log('Values in config.json have been updated.');
