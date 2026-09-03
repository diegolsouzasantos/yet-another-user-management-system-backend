const fs = require('fs');
const path = require('path');
const { Sequelize } = require('sequelize');
const env = require('../../config/env');
const databaseConfig = require('../../config/database');

const config = databaseConfig[env.NODE_ENV];
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const db = { sequelize, Sequelize };

fs
  .readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file.endsWith('.model.js'))
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.values(db)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(db));

module.exports = db;
