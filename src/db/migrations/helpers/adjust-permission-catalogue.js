const { randomUUID } = require('crypto');

const OBSOLETE = ['create', 'update', 'delete'];
const ADDED = ['grant', 'revoke'];

async function ensurePermissions(queryInterface, now) {
  await queryInterface.bulkDelete('permissions', { resource: 'permissions', action: OBSOLETE });
  const [existing] = await queryInterface.sequelize.query(
    "SELECT action FROM permissions WHERE resource = 'permissions'",
  );
  const have = new Set(existing.map((row) => row.action));
  const rows = ADDED.filter((action) => !have.has(action)).map((action) => ({
    id: randomUUID(), resource: 'permissions', action, created_at: now, updated_at: now,
  }));
  if (rows.length) await queryInterface.bulkInsert('permissions', rows);
}

async function linkContributor(queryInterface, now) {
  const [[role]] = await queryInterface.sequelize.query("SELECT id FROM roles WHERE name = 'Contributor'");
  if (!role) return;
  const [perms] = await queryInterface.sequelize.query(
    "SELECT id FROM permissions WHERE resource = 'permissions' AND action IN ('grant', 'revoke')",
  );
  const [linked] = await queryInterface.sequelize.query(
    'SELECT permission_id FROM role_permissions WHERE role_id = :roleId',
    { replacements: { roleId: role.id } },
  );
  const linkedSet = new Set(linked.map((row) => row.permission_id));
  const rows = perms.filter((perm) => !linkedSet.has(perm.id)).map((perm) => ({
    id: randomUUID(), role_id: role.id, permission_id: perm.id, created_at: now, updated_at: now,
  }));
  if (rows.length) await queryInterface.bulkInsert('role_permissions', rows);
}

async function adjustPermissionCatalogue(queryInterface) {
  const now = new Date();
  await ensurePermissions(queryInterface, now);
  await linkContributor(queryInterface, now);
}

module.exports = adjustPermissionCatalogue;
