const { Purchase, PurchaseItem, Product, User, sequelize } = require('../models');
const Joi = require('joi');

const purchaseSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required()
  })).min(1).required()
});

exports.createPurchase = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { error, value } = purchaseSchema.validate(req.body);
    if (error) { await t.rollback(); return res.status(400).json({ response: false, error: error.message }); }

    // load products and check stock
    const productIds = value.items.map(i => i.productId);
    const products = await Product.findAll({ where: { id: productIds }, transaction: t });
    if (products.length !== productIds.length) { await t.rollback(); return res.status(400).json({ response: false, error: 'Invalid product id' }); }

    // compute total and update stock
    let total = 0;
    for (const it of value.items) {
      const prod = products.find(p => p.id === it.productId);
      if (prod.quantity < it.quantity) { await t.rollback(); return res.status(400).json({ response: false, error: `Insufficient stock for ${prod.name}` }); }
      total += parseFloat(prod.price) * it.quantity;
      prod.quantity -= it.quantity;
      await prod.save({ transaction: t });
    }

    const purchase = await Purchase.create({ userId: req.user.id, total }, { transaction: t });
    const itemsToCreate = value.items.map(it => ({
      purchaseId: purchase.id,
      productId: it.productId,
      quantity: it.quantity,
      price: products.find(p => p.id === it.productId).price
    }));
    await PurchaseItem.bulkCreate(itemsToCreate, { transaction: t });
    await t.commit();

    res.json({ response: true, data: { purchaseId: purchase.id } });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

exports.getInvoice = async (req, res, next) => {
  try {
    const purchase = await Purchase.findByPk(req.params.id, {
      include: [
        { model: PurchaseItem, as: 'items', include: [{ model: Product }] },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });
    if (!purchase) return res.status(404).json({ response: false, error: 'Not found' });
    // access control: owner or admin
    if (req.user.role !== 'admin' && purchase.userId !== req.user.id) return res.status(403).json({ response: false, error: 'Forbidden' });

    res.json({ response: true, data: purchase });
  } catch (err) { next(err); }
};

exports.getHistory = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [{ model: PurchaseItem, as: 'items', include: [{ model: Product }] }]
    });
    res.json({ response: true, data: purchases });
  } catch (err) { next(err); }
};

exports.adminListPurchases = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        { model: PurchaseItem, as: 'items', include: [{ model: Product }] }
      ],
      order: [['date', 'DESC']]
    });
    res.json({ response: true, data: purchases });
  } catch (err) { next(err); }
};
