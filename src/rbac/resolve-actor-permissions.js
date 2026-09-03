function toKey(permission) {
  return `${permission.resource}:${permission.action}`;
}

function collectPermissions(user) {
  const rolePermissions = (user.Role && user.Role.Permissions) || [];
  const directPermissions = user.Permissions || [];
  const groupPermissions = (user.Groups || []).flatMap((group) => group.Permissions || []);

  return [...rolePermissions, ...directPermissions, ...groupPermissions].map(toKey);
}

function resolveActorPermissions(user) {
  return {
    userId: user.id,
    roleId: user.roleId,
    grantsAll: Boolean(user.Role && user.Role.grantsAllPermissions),
    isOwner: user.isOwner,
    permissionSet: new Set(collectPermissions(user)),
  };
}

module.exports = resolveActorPermissions;
