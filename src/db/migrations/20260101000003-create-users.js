module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      email: { type: Sequelize.STRING, allowNull: false },
      password_hash: { type: Sequelize.STRING, allowNull: false },
      first_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      role_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'roles', key: 'id' },
      },
      is_owner: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
      deleted_at: { type: Sequelize.DATE },
    });
    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_unique',
      where: { deleted_at: null },
    });
    await queryInterface.addIndex('users', ['is_owner'], {
      unique: true,
      where: { is_owner: true, deleted_at: null },
      name: 'users_single_owner_idx',
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('users');
  },
};
