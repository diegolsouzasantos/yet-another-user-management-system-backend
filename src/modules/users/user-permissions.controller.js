const db = require('../../db/models');
const repository = require('./users.repository');
const { assertCanRevokeFromUser } = require('../permissions/permissions.policy');
const { recordChange } = require('../../audit/audit-log.service');
const { sendCreated, sendNoContent } = require('../../utils/response.util');

async function grant(req, res) {
  const { permissionIds } = req.body;
  await db.sequelize.transaction(async (transaction) => {
    await Promise.all(
      permissionIds.map((permissionId) => repository.addPermission(req.target, permissionId, { transaction })),
    );
    await recordChange(
      req.actor.userId,
      'User',
      req.target.id,
      permissionIds.map((permissionId) => ({ field: 'permissions', oldValue: null, newValue: permissionId })),
      transaction,
    );
  });
  return sendCreated(res, { success: true, added: permissionIds.length });
}

async function revoke(req, res) {
  assertCanRevokeFromUser(req.actor, req.target);
  await repository.removePermission(req.target, req.params.permissionId);
  await recordChange(req.actor.userId, 'User', req.target.id, [
    { field: 'permissions', oldValue: req.params.permissionId, newValue: null },
  ]);
  return sendNoContent(res);
}

module.exports = { grant, revoke };
