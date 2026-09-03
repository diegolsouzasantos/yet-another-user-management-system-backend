const RESOURCES = {
  USERS: 'users',
  GROUPS: 'groups',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  AUDIT_LOGS: 'audit-logs',
};

const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  GRANT: 'grant',
  REVOKE: 'revoke',
};

const PERMISSIONS_CATALOGUE = [
  { resource: RESOURCES.USERS, action: ACTIONS.READ },
  { resource: RESOURCES.USERS, action: ACTIONS.CREATE },
  { resource: RESOURCES.USERS, action: ACTIONS.UPDATE },
  { resource: RESOURCES.USERS, action: ACTIONS.DELETE },
  { resource: RESOURCES.GROUPS, action: ACTIONS.READ },
  { resource: RESOURCES.GROUPS, action: ACTIONS.CREATE },
  { resource: RESOURCES.GROUPS, action: ACTIONS.UPDATE },
  { resource: RESOURCES.GROUPS, action: ACTIONS.DELETE },
  { resource: RESOURCES.ROLES, action: ACTIONS.READ },
  { resource: RESOURCES.ROLES, action: ACTIONS.CREATE },
  { resource: RESOURCES.ROLES, action: ACTIONS.UPDATE },
  { resource: RESOURCES.ROLES, action: ACTIONS.DELETE },
  { resource: RESOURCES.PERMISSIONS, action: ACTIONS.READ },
  { resource: RESOURCES.PERMISSIONS, action: ACTIONS.GRANT },
  { resource: RESOURCES.PERMISSIONS, action: ACTIONS.REVOKE },
  { resource: RESOURCES.AUDIT_LOGS, action: ACTIONS.READ },
];

module.exports = { RESOURCES, ACTIONS, PERMISSIONS_CATALOGUE };
