module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    roleId: { type: DataTypes.UUID, allowNull: false },
    isOwner: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  }, { tableName: 'users', underscored: true, paranoid: true });

  User.associate = (db) => {
    User.belongsTo(db.Role, { foreignKey: 'roleId' });
    User.belongsToMany(db.Permission, { through: db.UserPermission, foreignKey: 'userId' });
    User.belongsToMany(db.Group, { through: db.UserGroup, foreignKey: 'userId' });
    User.hasMany(db.RefreshToken, { foreignKey: 'userId' });
  };

  return User;
};
