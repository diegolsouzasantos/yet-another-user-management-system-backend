const buildRows = require('./helpers/build-role-permission-rows');

module.exports = {
  up: async (queryInterface) => {
    const [roles] = await queryInterface.sequelize.query('SELECT id, name FROM roles');
    const [permissions] = await queryInterface.sequelize.query('SELECT id, resource, action FROM permissions');
    const [existing] = await queryInterface.sequelize.query('SELECT role_id, permission_id FROM role_permissions');
    const existingKeys = new Set(existing.map((row) => `${row.role_id}:${row.permission_id}`));

    const rows = buildRows(roles, permissions, existingKeys);

    if (rows.length > 0) {
      await queryInterface.bulkInsert('role_permissions', rows);
    }
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  },
};
