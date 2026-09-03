module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('group_permissions', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      group_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'groups', key: 'id' },
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
    await queryInterface.addIndex('group_permissions', ['group_id', 'permission_id'], {
      unique: true,
      where: { deleted_at: null },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('group_permissions');
  },
};
