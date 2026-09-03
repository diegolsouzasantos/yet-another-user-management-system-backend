const isProtectedTarget = require('./protected-target.policy');

function hasPermission(actor, resource, action, target = null) {
  if (actor.grantsAll) {
    return true;
  }

  if (target && isProtectedTarget(target)) {
    return false;
  }

  return actor.permissionSet.has(`${resource}:${action}`);
}

module.exports = hasPermission;
