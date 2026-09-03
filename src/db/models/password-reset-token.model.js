module.exports = (sequelize, DataTypes) => {
  const PasswordResetToken = sequelize.define('PasswordResetToken', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    tokenHash: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    usedAt: { type: DataTypes.DATE },
  }, { tableName: 'password_reset_tokens', underscored: true });

  PasswordResetToken.associate = (db) => {
    PasswordResetToken.belongsTo(db.User, { foreignKey: 'userId' });
  };

  return PasswordResetToken;
};
