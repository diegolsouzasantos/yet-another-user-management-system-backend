module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('password_reset_tokens', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
      },
      token_hash: { type: Sequelize.STRING, allowNull: false },
      expires_at: { type: Sequelize.DATE, allowNull: false },
      used_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
    await queryInterface.addIndex('password_reset_tokens', ['token_hash']);
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('password_reset_tokens');
  },
};
