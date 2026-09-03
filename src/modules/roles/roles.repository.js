const db = require('../../db/models');

const DEFAULT_ORDER = [['createdAt', 'ASC']];

function findAndCountAll({ limit, offset, order = DEFAULT_ORDER, where = {} }) {
  return db.Role.findAndCountAll({
    where, limit, offset, order, distinct: true, include: [db.Permission],
  });
}

function findById(id) {
  return db.Role.findByPk(id, { include: [db.Permission] });
}

function findByName(name) {
  return db.Role.findOne({ where: { name }, paranoid: false });
}

function countUsers(roleId) {
  return db.User.count({ where: { roleId } });
}

async function create({ permissionIds, ...data }) {
  const role = await db.Role.create({ ...data, isSystemRole: false });
  if (permissionIds) await role.setPermissions(permissionIds);
  return role;
}

async function update(role, { permissionIds, ...data }) {
  await role.update(data);
  if (permissionIds) await role.setPermissions(permissionIds);
  return role;
}

function remove(role) {
  return role.destroy();
}

module.exports = {
  findAndCountAll, findById, findByName, countUsers, create, update, remove,
};
