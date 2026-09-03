module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('role_permissions', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
        onDelete: 'CASCADE',
      },
      permission_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'permissions', key: 'id' },
        onDelete: 'CASCADE',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('role_permissions', ['role_id', 'permission_id'], {
      unique: true,
      where: { deleted_at: null },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('role_permissions');
  },
};
