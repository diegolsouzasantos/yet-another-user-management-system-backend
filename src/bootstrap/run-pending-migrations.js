const path = require('path');
const { Umzug, SequelizeStorage } = require('umzug');
const { sequelize } = require('../db/models');
const resolve = require('./sequelize-cli-resolver');

const MIGRATIONS_GLOB = path.join(__dirname, '..', 'db', 'migrations', '*.js').replace(/\\/g, '/');

async function runPendingMigrations() {
  const umzug = new Umzug({
    migrations: { glob: MIGRATIONS_GLOB, resolve },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize, tableName: 'sequelize_meta' }),
    logger: console,
  });

  const applied = await umzug.up();
  return applied.map((migration) => migration.name);
}

module.exports = runPendingMigrations;
