module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('roles', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      grants_all_permissions: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_system_role: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('roles', ['name'], {
      unique: true,
      name: 'roles_name_unique',
      where: { deleted_at: null },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('roles');
  },
};
