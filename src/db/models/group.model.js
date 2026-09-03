module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define('Group', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING },
  }, { tableName: 'groups', underscored: true, paranoid: true });

  Group.associate = (db) => {
    Group.belongsToMany(db.User, { through: db.UserGroup, foreignKey: 'groupId' });
    Group.belongsToMany(db.Permission, { through: db.GroupPermission, foreignKey: 'groupId' });
  };

  return Group;
};
