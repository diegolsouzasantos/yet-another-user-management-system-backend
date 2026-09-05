const db = require('../../db/models');
const { recordChange } = require('../../audit/audit-log.service');
const { sendCreated, sendNoContent } = require('../../utils/response.util');

async function add(req, res) {
  const { groupIds } = req.body;
  await db.sequelize.transaction(async (transaction) => {
    await req.target.addGroups(groupIds, { transaction });
    await recordChange(
      req.actor.userId,
      'User',
      req.target.id,
      groupIds.map((groupId) => ({ field: 'groups', oldValue: null, newValue: groupId })),
      transaction,
    );
  });
  return sendCreated(res, { success: true, added: groupIds.length });
}

async function remove(req, res) {
  await req.target.removeGroup(req.params.groupId);
  await recordChange(req.actor.userId, 'User', req.target.id, [
    { field: 'groups', oldValue: req.params.groupId, newValue: null },
  ]);
  return sendNoContent(res);
}

module.exports = { add, remove };
