module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define('AuditLog', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    actorUserId: { type: DataTypes.UUID, allowNull: true },
    entityType: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.UUID, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    fieldName: { type: DataTypes.STRING },
    oldValue: { type: DataTypes.TEXT },
    newValue: { type: DataTypes.TEXT },
  }, { tableName: 'audit_logs', underscored: true, updatedAt: false });

  AuditLog.associate = (db) => {
    AuditLog.belongsTo(db.User, { foreignKey: 'actorUserId', as: 'actor' });
  };

  return AuditLog;
};
