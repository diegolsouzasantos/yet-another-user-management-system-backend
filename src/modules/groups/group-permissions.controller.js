const db = require('../../db/models');
const { recordChange } = require('../../audit/audit-log.service');
const { sendCreated, sendNoContent } = require('../../utils/response.util');

async function add(req, res) {
  const { permissionIds } = req.body;
  await db.sequelize.transaction(async (transaction) => {
    await req.target.addPermissions(permissionIds, { transaction });
    await recordChange(
      req.actor.userId,
      'Group',
      req.target.id,
      permissionIds.map((permissionId) => ({ field: 'permissions', oldValue: null, newValue: permissionId })),
      transaction,
    );
  });
  return sendCreated(res, { success: true, added: permissionIds.length });
}

async function remove(req, res) {
  await req.target.removePermission(req.params.permissionId);
  await recordChange(req.actor.userId, 'Group', req.target.id, [
    { field: 'permissions', oldValue: req.params.permissionId, newValue: null },
  ]);
  return sendNoContent(res);
}

module.exports = { add, remove };
