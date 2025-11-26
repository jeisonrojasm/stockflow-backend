'use strict';
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    lotNumber: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    entryDate: { type: DataTypes.DATEONLY, allowNull: false }
  }, {
    tableName: 'products'
  });

  Product.associate = function (models) {
    Product.hasMany(models.PurchaseItem, { foreignKey: 'productId' });
  };

  return Product;
};
