'use strict';
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'client'), defaultValue: 'client' }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
        user.password = await bcrypt.hash(user.password, saltRounds);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const saltRounds = parseInt(process.env.BCRYPT_SALT || '10', 10);
          user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });

  User.prototype.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
  };

  User.associate = function (models) {
    User.hasMany(models.Purchase, { foreignKey: 'userId' });
  };

  return User;
};
