'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseItem = sequelize.define('PurchaseItem', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  }, {
    tableName: 'purchase_items'
  });

  PurchaseItem.associate = function (models) {
    PurchaseItem.belongsTo(models.Purchase, { foreignKey: 'purchaseId' });
    PurchaseItem.belongsTo(models.Product, { foreignKey: 'productId' });
  };

  return PurchaseItem;
};
