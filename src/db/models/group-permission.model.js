module.exports = (sequelize, DataTypes) => {
  const GroupPermission = sequelize.define('GroupPermission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    groupId: { type: DataTypes.UUID, allowNull: false },
    permissionId: { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: 'group_permissions',
    underscored: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ['group_id', 'permission_id'], where: { deleted_at: null } }],
  });

  return GroupPermission;
};
