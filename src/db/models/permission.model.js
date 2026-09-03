module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    resource: { type: DataTypes.STRING, allowNull: false },
    action: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.STRING },
  }, {
    tableName: 'permissions',
    underscored: true,
    paranoid: true,
    indexes: [{ unique: true, fields: ['resource', 'action'], where: { deleted_at: null } }],
  });

  Permission.associate = (db) => {
    Permission.belongsToMany(db.Role, { through: db.RolePermission, foreignKey: 'permissionId' });
    Permission.belongsToMany(db.User, { through: db.UserPermission, foreignKey: 'permissionId' });
    Permission.belongsToMany(db.Group, { through: db.GroupPermission, foreignKey: 'permissionId' });
  };

  return Permission;
};
