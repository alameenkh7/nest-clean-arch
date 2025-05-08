const dotenv = require('dotenv');
const path = require('path');

// Load .env file explicitly
dotenv.config({ path: path.resolve(__dirname, '.env') });

require('ts-node/register');
require('./src/scripts/seed-firebase.ts');
