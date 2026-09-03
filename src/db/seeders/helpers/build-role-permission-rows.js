const { randomUUID } = require('crypto');
const GRANTS_BY_ROLE = require('./role-permission-grants');

function buildRows(roles, permissions, existingKeys) {
  const now = new Date();
  const rows = [];

  Object.entries(GRANTS_BY_ROLE).forEach(([roleName, grants]) => {
    const role = roles.find((r) => r.name === roleName);
    grants.forEach((grant) => {
      const permission = permissions.find((p) => p.resource === grant.resource && p.action === grant.action);
      const key = `${role.id}:${permission.id}`;

      if (!existingKeys.has(key)) {
        rows.push({ id: randomUUID(), role_id: role.id, permission_id: permission.id, created_at: now, updated_at: now });
      }
    });
  });

  return rows;
}

module.exports = buildRows;
