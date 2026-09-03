const waitForDatabase = require('./wait-for-database');
const runPendingMigrations = require('./run-pending-migrations');
const runPendingSeeds = require('./run-pending-seeds');

async function startup() {
  await waitForDatabase();

  const migrations = await runPendingMigrations();
  console.log(`Migrations applied: ${migrations.length ? migrations.join(', ') : 'none pending'}`);

  const seeds = await runPendingSeeds();
  console.log(`Seeds applied: ${seeds.length ? seeds.join(', ') : 'none pending'}`);
}

module.exports = startup;
