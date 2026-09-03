module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      resource: { type: Sequelize.STRING, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('permissions', ['resource', 'action'], {
      unique: true,
      where: { deleted_at: null },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('permissions');
  },
};
