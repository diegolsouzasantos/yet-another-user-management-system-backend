module.exports = (sequelize, DataTypes) => {
  const RefreshToken = sequelize.define('RefreshToken', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    tokenHash: { type: DataTypes.STRING, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    revokedAt: { type: DataTypes.DATE },
  }, { tableName: 'refresh_tokens', underscored: true });

  RefreshToken.associate = (db) => {
    RefreshToken.belongsTo(db.User, { foreignKey: 'userId' });
  };

  return RefreshToken;
};
