'use strict';
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    total: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    tableName: 'purchases'
  });

  Purchase.associate = function (models) {
    Purchase.belongsTo(models.User, { foreignKey: 'userId' });
    Purchase.hasMany(models.PurchaseItem, { foreignKey: 'purchaseId', as: 'items' });
  };

  return Purchase;
};
