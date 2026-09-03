const { randomUUID } = require('crypto');

const ROLES = [
  { name: 'Administrator', grants_all_permissions: true, is_system_role: true },
  { name: 'Contributor', grants_all_permissions: false, is_system_role: true },
  { name: 'Reader', grants_all_permissions: false, is_system_role: true },
];

async function fetchExistingNames(queryInterface) {
  const [rows] = await queryInterface.sequelize.query('SELECT name FROM roles');
  return new Set(rows.map((row) => row.name));
}

module.exports = {
  up: async (queryInterface) => {
    const existing = await fetchExistingNames(queryInterface);
    const now = new Date();
    const missing = ROLES.filter((role) => !existing.has(role.name));
    const rows = missing.map((role) => ({ id: randomUUID(), ...role, created_at: now, updated_at: now }));

    if (rows.length > 0) {
      await queryInterface.bulkInsert('roles', rows);
    }
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', { name: ROLES.map((role) => role.name) });
  },
};
