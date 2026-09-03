function toRoleDetail(role) {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    isSystemRole: role.isSystemRole,
    grantsAllPermissions: role.grantsAllPermissions,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
    permissions: (role.Permissions || []).map((permission) => ({
      id: permission.id, resource: permission.resource, action: permission.action,
    })),
  };
}

module.exports = toRoleDetail;
