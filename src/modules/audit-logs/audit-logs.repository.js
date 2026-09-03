const db = require('../../db/models');

const DEFAULT_ORDER = [['createdAt', 'DESC']];

function findAndCountAll({ limit, offset, order = DEFAULT_ORDER, where = {} }) {
  return db.AuditLog.findAndCountAll({
    where,
    limit,
    offset,
    order,
    include: [{ model: db.User, as: 'actor', attributes: ['id', 'email', 'firstName', 'lastName'] }],
  });
}

module.exports = { findAndCountAll };
