const { randomUUID } = require('crypto');
const { PERMISSIONS_CATALOGUE } = require('../../config/constants/permissions.constants');

async function fetchExisting(queryInterface) {
  const [rows] = await queryInterface.sequelize.query('SELECT resource, action FROM permissions');
  return new Set(rows.map((row) => `${row.resource}:${row.action}`));
}

module.exports = {
  up: async (queryInterface) => {
    const existing = await fetchExisting(queryInterface);
    const now = new Date();
    const missing = PERMISSIONS_CATALOGUE.filter((p) => !existing.has(`${p.resource}:${p.action}`));
    const rows = missing.map((p) => ({ id: randomUUID(), ...p, created_at: now, updated_at: now }));

    if (rows.length > 0) {
      await queryInterface.bulkInsert('permissions', rows);
    }
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  },
};
