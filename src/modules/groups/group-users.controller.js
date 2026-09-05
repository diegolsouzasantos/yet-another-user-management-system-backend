const db = require('../../db/models');
const isProtectedTarget = require('../../rbac/protected-target.policy');
const { recordChange } = require('../../audit/audit-log.service');
const NotFoundError = require('../../errors/not-found-error');
const ForbiddenError = require('../../errors/forbidden-error');
const { sendCreated, sendNoContent } = require('../../utils/response.util');

async function loadUser(actor, userId) {
  const user = await db.User.findByPk(userId, { include: [db.Role] });
  if (!user) throw new NotFoundError();
  if (!actor.grantsAll && isProtectedTarget(user)) throw new ForbiddenError();
  return user;
}

async function add(req, res) {
  const { userIds } = req.body;
  await Promise.all(userIds.map((userId) => loadUser(req.actor, userId)));
  await db.sequelize.transaction(async (transaction) => {
    await req.target.addUsers(userIds, { transaction });
    await recordChange(
      req.actor.userId,
      'Group',
      req.target.id,
      userIds.map((userId) => ({ field: 'users', oldValue: null, newValue: userId })),
      transaction,
    );
  });
  return sendCreated(res, { success: true, added: userIds.length });
}

async function remove(req, res) {
  const user = await loadUser(req.actor, req.params.userId);
  await req.target.removeUser(user.id);
  await recordChange(req.actor.userId, 'Group', req.target.id, [
    { field: 'users', oldValue: user.id, newValue: null },
  ]);
  return sendNoContent(res);
}

module.exports = { add, remove };
