const { Sequelize } = require('sequelize');

function sequelizeCliResolver({ name, path: modulePath, context }) {
  const migration = require(modulePath);

  return {
    name,
    up: async () => migration.up(context, Sequelize),
    down: async () => migration.down(context, Sequelize),
  };
}

module.exports = sequelizeCliResolver;
