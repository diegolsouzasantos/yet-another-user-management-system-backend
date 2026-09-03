const env = require('./env');

module.exports = env.CORS_ORIGIN.split(',').map((origin) => origin.trim());
