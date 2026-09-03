module.exports = (sequelize, DataTypes) => {
  const UserPermission = sequelize.define('UserPermission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    permissionId: { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: 'user_permissions',
    underscored: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ['user_id', 'permission_id'], where: { deleted_at: null } }],
  });

  return UserPermission;
};
