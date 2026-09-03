const isProtectedTarget = require('../../rbac/protected-target.policy');
const ForbiddenError = require('../../errors/forbidden-error');

function assertCanRevokeFromUser(actor, targetUser) {
  if (actor.grantsAll) {
    return;
  }

  if (isProtectedTarget(targetUser) || targetUser.roleId === actor.roleId) {
    throw new ForbiddenError();
  }
}

module.exports = { assertCanRevokeFromUser };
