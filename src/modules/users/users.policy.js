const hasPermission = require('../../rbac/permission-check.service');
const ForbiddenError = require('../../errors/forbidden-error');

function canViewUser(actor, target) {
  if (hasPermission(actor, 'users', 'read', target)) {
    return true;
  }

  return target.id === actor.userId;
}

function assertRoleAssignable(actor, role) {
  if (!actor.grantsAll && role.grantsAllPermissions) {
    throw new ForbiddenError();
  }
}

module.exports = { canViewUser, assertRoleAssignable };
