const { sequelize } = require('../db/models');

const MAX_ATTEMPTS = 10;
const DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDatabase() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      await sequelize.authenticate();
      return;
    } catch (error) {
      console.warn(`Database not ready (attempt ${attempt}/${MAX_ATTEMPTS}): ${error.message}`);
      await sleep(DELAY_MS);
    }
  }

  throw new Error('Could not connect to the database.');
}

module.exports = waitForDatabase;
