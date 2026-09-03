const db = require('../../db/models');

const DEFAULT_ORDER = [['resource', 'ASC']];

function findAndCountAll({ limit, offset, order = DEFAULT_ORDER, where = {} }) {
  return db.Permission.findAndCountAll({ where, limit, offset, order });
}

function findById(id) {
  return db.Permission.findByPk(id);
}

module.exports = { findAndCountAll, findById };
