module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define('UserGroup', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    userId: { type: DataTypes.UUID, allowNull: false },
    groupId: { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: 'user_groups',
    underscored: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ['user_id', 'group_id'], where: { deleted_at: null } }],
  });

  return UserGroup;
};
