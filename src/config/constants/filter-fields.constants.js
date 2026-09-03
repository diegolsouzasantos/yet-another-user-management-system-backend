const USERS = {
  firstName: { type: 'text', column: 'firstName' },
  lastName: { type: 'text', column: 'lastName' },
  email: { type: 'text', column: 'email' },
  isOwner: { type: 'boolean', column: 'isOwner' },
  isActive: { type: 'boolean', column: 'isActive' },
  createdAt: { type: 'date', column: 'createdAt' },
  roleId: { type: 'relation', column: 'roleId' },
  groupId: { type: 'relationJoin', joinModel: 'UserGroup', joinLocalKey: 'userId', joinForeignKey: 'groupId' },
};

const GROUPS = {
  name: { type: 'text', column: 'name' },
  description: { type: 'text', column: 'description' },
  createdAt: { type: 'date', column: 'createdAt' },
};

const ROLES = {
  name: { type: 'text', column: 'name' },
  description: { type: 'text', column: 'description' },
  isSystemRole: { type: 'boolean', column: 'isSystemRole' },
  grantsAllPermissions: { type: 'boolean', column: 'grantsAllPermissions' },
  createdAt: { type: 'date', column: 'createdAt' },
};

const PERMISSIONS = {
  resource: { type: 'text', column: 'resource' },
  action: { type: 'text', column: 'action' },
  description: { type: 'text', column: 'description' },
};

const AUDIT_LOGS = {
  entityType: { type: 'enum', column: 'entityType', values: ['User', 'Group', 'Role', 'Permission'] },
  action: { type: 'enum', column: 'action', values: ['created', 'updated', 'deleted'] },
  entityId: { type: 'text', column: 'entityId' },
  actorUserId: { type: 'relation', column: 'actorUserId' },
  createdAt: { type: 'date', column: 'createdAt' },
};

module.exports = { USERS, GROUPS, ROLES, PERMISSIONS, AUDIT_LOGS };
