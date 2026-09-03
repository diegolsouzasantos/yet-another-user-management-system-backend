const db = require('../../db/models');
const { mergeWhere, resolveJoinWhere } = require('../../utils/filter.util');

const DEFAULT_ORDER = [['createdAt', 'ASC']];

async function findAndCountAll({ limit, offset, order = DEFAULT_ORDER, where = {}, joins = [] }) {
  const joinWhere = await resolveJoinWhere(joins);
  return db.User.findAndCountAll({
    where: mergeWhere(where, joinWhere),
    limit,
    offset,
    order,
    include: [db.Role],
  });
}

function findById(id) {
  return db.User.findByPk(id, {
    include: [
      { model: db.Role, include: [db.Permission] },
      { model: db.Group, include: [db.Permission] },
      { model: db.Permission },
    ],
  });
}

function findByEmail(email) {
  return db.User.findOne({ where: { email }, paranoid: false });
}

function findRoleById(roleId) {
  return db.Role.findByPk(roleId);
}

function create(data) {
  return db.User.create(data);
}

function update(user, data) {
  return user.update(data);
}

function remove(user) {
  return user.destroy();
}

function addPermission(user, permissionId) {
  return user.addPermission(permissionId);
}

function removePermission(user, permissionId) {
  return user.removePermission(permissionId);
}

module.exports = {
  findAndCountAll, findById, findByEmail, findRoleById, create, update, remove, addPermission, removePermission,
};
