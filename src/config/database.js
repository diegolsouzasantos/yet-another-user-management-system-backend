const env = require('./env');

const base = {
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: 'postgres',
  logging: false,
};

module.exports = {
  development: base,
  test: { ...base, database: `${env.DB_NAME}_test` },
  production: { ...base, dialect: 'postgres', dialectOptions: { ssl: false } },
};
