const db = require('../../db/models');

const DEFAULT_ORDER = [['createdAt', 'ASC']];

function findAndCountAll({ limit, offset, order = DEFAULT_ORDER, where = {} }) {
  return db.Group.findAndCountAll({
    where, limit, offset, order, distinct: true, include: [db.Permission, db.User],
  });
}

function findById(id) {
  return db.Group.findByPk(id, { include: [db.Permission, db.User] });
}

function findByName(name) {
  return db.Group.findOne({ where: { name }, paranoid: false });
}

async function create({ permissionIds, userIds, ...data }) {
  const group = await db.Group.create(data);
  if (permissionIds) await group.setPermissions(permissionIds);
  if (userIds) await group.setUsers(userIds);
  return group;
}

async function update(group, { permissionIds, userIds, ...data }) {
  await group.update(data);
  if (permissionIds) await group.setPermissions(permissionIds);
  if (userIds) await group.setUsers(userIds);
  return group;
}

function remove(group) {
  return group.destroy();
}

module.exports = { findAndCountAll, findById, findByName, create, update, remove };
