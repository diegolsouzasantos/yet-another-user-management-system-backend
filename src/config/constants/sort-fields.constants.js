module.exports = {
  USERS: ['firstName', 'lastName', 'email', 'isOwner', 'isActive', 'createdAt', 'updatedAt'],
  GROUPS: ['name', 'createdAt', 'updatedAt'],
  ROLES: ['name', 'isSystemRole', 'createdAt', 'updatedAt'],
  PERMISSIONS: ['resource', 'action', 'createdAt', 'updatedAt'],
  AUDIT_LOGS: ['createdAt', 'entityType', 'action'],
};
