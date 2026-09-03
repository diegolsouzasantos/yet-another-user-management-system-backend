const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('../db/models');
const resolve = require('./sequelize-cli-resolver');

const SEEDS_GLOB = path.join(__dirname, '..', 'db', 'seeders', '*.js').replace(/\\/g, '/');

async function runPendingSeeds() {
  const umzug = new Umzug({
    migrations: { glob: SEEDS_GLOB, resolve },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'sequelize_seeder_meta' }),
    logger: console,
  });

  const applied = await umzug.up();
  return applied.map((seed) => seed.name);
}

module.exports = runPendingSeeds;
