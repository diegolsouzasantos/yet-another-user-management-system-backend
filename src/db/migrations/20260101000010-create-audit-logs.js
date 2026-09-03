module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('audit_logs', {
      id: { type: Sequelize.UUID, allowNull: false, primaryKey: true },
      actor_user_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onDelete: 'SET NULL',
      },
      entity_type: { type: Sequelize.STRING, allowNull: false },
      entity_id: { type: Sequelize.UUID, allowNull: false },
      action: { type: Sequelize.STRING, allowNull: false },
      field_name: { type: Sequelize.STRING },
      old_value: { type: Sequelize.TEXT },
      new_value: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('audit_logs');
  },
};
