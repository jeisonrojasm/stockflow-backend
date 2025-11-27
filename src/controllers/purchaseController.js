const { Purchase, PurchaseItem, Product, User, sequelize } = require('../models');
const Joi = require('joi');

const purchaseSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    productId: Joi.string().uuid().required(),
    quantity: Joi.number().integer().min(1).required()
  })).min(1).required()
});

/**
 * @api {post} /api/purchases Crear una compra
 * @apiName CreatePurchase
 * @apiGroup Purchases
 * @apiDescription
 * Crea una compra realizando las siguientes validaciones y procesos:
 * - Valida el payload con Joi.
 * - Verifica existencia de productos.
 * - Verifica stock disponible.
 * - Actualiza stock.
 * - Calcula total.
 * - Crea Purchase y PurchaseItems en una transacción.
 *
 * @apiHeader {String} Authorization Token JWT del usuario (Bearer Token).
 *
 * @apiBody {Object[]} items Lista de ítems de compra.
 * @apiBody {String} items.productId UUID del producto.
 * @apiBody {Number} items.quantity Cantidad a comprar (>= 1).
 *
 * @apiSuccess {Boolean} response Estado de la operación.
 * @apiSuccess {Object} data Información de la compra.
 * @apiSuccess {String} data.purchaseId ID de la compra creada.
 *
 * @apiError (400) ValidationError Error en los datos enviados.
 * @apiError (400) InsufficientStock Algún producto no tiene stock suficiente.
 * @apiError (400) InvalidProductID Uno o más IDs de producto no existen.
 *
 * @apiParamExample {json} Ejemplo de Request:
 * {
 *   "items": [
 *     { "productId": "8c12614e-2083-4bc5-8fab-8a1f123cd112", "quantity": 2 }
 *   ]
 * }
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": {
 *     "purchaseId": "74a8b52e-d087-41bd-8bd7-1ae51d8dee20"
 *   }
 * }
 */
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

/**
 * @api {get} /api/purchases/invoice/:id Obtener factura (invoice)
 * @apiName GetInvoice
 * @apiGroup Purchases
 * @apiDescription
 * Retorna la información completa de una compra:
 * - Items
 * - Productos asociados
 * - Información básica del usuario
 *
 * Restringido a:
 * - El dueño de la compra
 * - Administradores
 *
 * @apiHeader {String} Authorization Token JWT del usuario.
 *
 * @apiParam {String} id ID de la compra.
 *
 * @apiSuccess {Boolean} response Estado.
 * @apiSuccess {Object} data Factura completa.
 *
 * @apiError (404) NotFound Compra no encontrada.
 * @apiError (403) Forbidden No autorizado para ver esta compra.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": {
 *     "id": "74a8b52e-d087-41bd-8bd7-1ae51d8dee20",
 *     "total": 120.50,
 *     "items": [
 *        {
 *          "quantity": 2,
 *          "price": 25.50,
 *          "Product": {
 *             "name": "Café Premium",
 *             "price": 25.50
 *          }
 *        }
 *      ],
 *     "User": {
 *        "id": "9fbb1231-31af-4f2d-9c92-f891da92c100",
 *        "name": "Juan Pérez",
 *        "email": "juan@example.com"
 *     }
 *   }
 * }
 */
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

/**
 * @api {get} /api/purchases/history Historial del usuario
 * @apiName GetPurchaseHistory
 * @apiGroup Purchases
 * @apiDescription
 * Devuelve todas las compras del usuario autenticado junto con sus items y productos.
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiSuccess {Boolean} response Estado.
 * @apiSuccess {Object[]} data Historial de compras.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": [
 *     {
 *       "id": "74a8b52e-d087-41bd-8bd7-1ae51d8dee20",
 *       "total": 120.50,
 *       "items": [...]
 *     }
 *   ]
 * }
 */
exports.getHistory = async (req, res, next) => {
  try {
    const purchases = await Purchase.findAll({
      where: { userId: req.user.id },
      include: [{ model: PurchaseItem, as: 'items', include: [{ model: Product }] }]
    });
    res.json({ response: true, data: purchases });
  } catch (err) { next(err); }
};

/**
 * @api {get} /api/purchases/admin Listar todas las compras (ADMIN)
 * @apiName AdminListPurchases
 * @apiGroup Purchases
 * @apiDescription
 * Devuelve todas las compras del sistema.  
 * Solo accesible para usuarios con rol **admin**.
 *
 * Incluye:
 * - Usuario asociado
 * - Items
 * - Productos
 *
 * @apiHeader {String} Authorization Token JWT.
 *
 * @apiSuccess {Boolean} response Estado.
 * @apiSuccess {Object[]} data Listado de compras.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": [
 *     {
 *       "id": "74a8b52e-d087-41bd-8bd7-1ae51d8dee20",
 *       "User": {
 *         "id": "9fbb12...",
 *         "name": "Juan Pérez",
 *         "email": "juan@example.com"
 *       },
 *       "items": [...]
 *     }
 *   ]
 * }
 */
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
