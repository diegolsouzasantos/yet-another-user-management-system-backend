const { RESOURCES, ACTIONS } = require('../../../config/constants/permissions.constants');

const CONTRIBUTOR_GRANTS = [
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
  { resource: RESOURCES.PERMISSIONS, action: ACTIONS.READ },
  { resource: RESOURCES.PERMISSIONS, action: ACTIONS.GRANT },
  { resource: RESOURCES.PERMISSIONS, action: ACTIONS.REVOKE },
  { resource: RESOURCES.AUDIT_LOGS, action: ACTIONS.READ },
];

const READER_GRANTS = [];

module.exports = { Contributor: CONTRIBUTOR_GRANTS, Reader: READER_GRANTS };
