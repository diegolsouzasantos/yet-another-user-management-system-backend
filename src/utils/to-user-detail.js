const toPublicUser = require('./to-public-user');
const toEffectivePermissions = require('./to-effective-permissions');

function toUserDetail(user) {
  return {
    ...toPublicUser(user),
    roleGrantsAllPermissions: Boolean(user.Role && user.Role.grantsAllPermissions),
    groups: (user.Groups || []).map((group) => ({ id: group.id, name: group.name })),
    permissions: toEffectivePermissions(user),
  };
}

module.exports = toUserDetail;
