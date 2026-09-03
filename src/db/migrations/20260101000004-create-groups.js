module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('groups', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('groups', ['name'], {
      unique: true,
      name: 'groups_name_unique',
      where: { deleted_at: null },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('groups');
  },
};
