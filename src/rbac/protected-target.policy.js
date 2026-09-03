function isProtectedTarget(target) {
  return Boolean(target && target.Role && target.Role.grantsAllPermissions);
}

module.exports = isProtectedTarget;
