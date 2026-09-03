module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
    grantsAllPermissions: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isSystemRole: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, { tableName: 'roles', underscored: true, paranoid: true });

  Role.associate = (db) => {
    Role.hasMany(db.User, { foreignKey: 'roleId' });
    Role.belongsToMany(db.Permission, { through: db.RolePermission, foreignKey: 'roleId' });
  };

  return Role;
};
