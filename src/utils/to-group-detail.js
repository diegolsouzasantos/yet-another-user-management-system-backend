function toGroupDetail(group) {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    users: (group.Users || []).map((user) => ({
      id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email,
    })),
    permissions: (group.Permissions || []).map((permission) => ({
      id: permission.id, resource: permission.resource, action: permission.action,
    })),
  };
}

module.exports = toGroupDetail;
