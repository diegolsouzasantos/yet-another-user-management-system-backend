const { assertNotSystemRole } = require('./roles.policy');
const { recordChange } = require('../../audit/audit-log.service');
const { sendCreated, sendNoContent } = require('../../utils/response.util');

async function add(req, res) {
  assertNotSystemRole(req.target);
  const { permissionIds } = req.body;
  await req.target.addPermissions(permissionIds);
  await recordChange(
    req.actor.userId,
    'Role',
    req.target.id,
    permissionIds.map((permissionId) => ({ field: 'permissions', oldValue: null, newValue: permissionId })),
  );
  return sendCreated(res, { success: true, added: permissionIds.length });
}

async function remove(req, res) {
  assertNotSystemRole(req.target);
  await req.target.removePermission(req.params.permissionId);
  await recordChange(req.actor.userId, 'Role', req.target.id, [
    { field: 'permissions', oldValue: req.params.permissionId, newValue: null },
  ]);
  return sendNoContent(res);
}

module.exports = { add, remove };
