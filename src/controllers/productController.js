const { Product } = require('../models');
const Joi = require('joi');

const productSchema = Joi.object({
  lotNumber: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
  quantity: Joi.number().integer().min(0).required(),
  entryDate: Joi.date().required()
});

/**
 * @api {post} /api/products Crear un producto
 * @apiName CreateProduct
 * @apiGroup Products
 * @apiDescription Crea un nuevo producto validando los datos mediante Joi.
 *
 * @apiBody {String} lotNumber Número de lote.
 * @apiBody {String} name Nombre del producto.
 * @apiBody {Number} price Precio del producto (positivo, 2 decimales).
 * @apiBody {Number} quantity Cantidad disponible (entero >= 0).
 * @apiBody {String} entryDate Fecha de ingreso (ISO 8601).
 *
 * @apiSuccess {Boolean} response Estado de la operación.
 * @apiSuccess {Object} data Información del producto creado.
 *
 * @apiError (400) ValidationError Error en la validación del body.
 *
 * @apiParamExample {json} Ejemplo de Request:
 * {
 *   "lotNumber": "L-2025-12",
 *   "name": "Café Premium",
 *   "price": 25.50,
 *   "quantity": 100,
 *   "entryDate": "2025-11-26"
 * }
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": {
 *     "id": 1,
 *     "lotNumber": "L-2025-12",
 *     "name": "Café Premium",
 *     "price": 25.50,
 *     "quantity": 100,
 *     "entryDate": "2025-11-26"
 *   }
 * }
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ response: false, error: error.message });

    const p = await Product.create(value);
    res.json({ response: true, data: p });
  } catch (err) { next(err); }
};

/**
 * @api {get} /api/products Listar productos
 * @apiName ListProducts
 * @apiGroup Products
 * @apiDescription Obtiene la lista completa de productos.
 *
 * @apiSuccess {Boolean} response Estado de la operación.
 * @apiSuccess {Object[]} data Lista de productos.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": [
 *      {
 *         "id": 1,
 *         "lotNumber": "L-2025-12",
 *         "name": "Café Premium",
 *         "price": 25.50,
 *         "quantity": 100,
 *         "entryDate": "2025-11-26"
 *      }
 *   ]
 * }
 */
exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({ response: true, data: products });
  } catch (err) { next(err); }
};

/**
 * @api {get} /api/products/:id Obtener producto por ID
 * @apiName GetProduct
 * @apiGroup Products
 * @apiDescription Busca un producto mediante su ID.
 *
 * @apiParam {Number} id ID del producto.
 *
 * @apiSuccess {Boolean} response Estado de la operación.
 * @apiSuccess {Object} data Producto encontrado.
 *
 * @apiError (404) NotFound El producto no existe.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": {
 *      "id": 1,
 *      "lotNumber": "L-2025-12",
 *      "name": "Café Premium",
 *      "price": 25.50,
 *      "quantity": 100,
 *      "entryDate": "2025-11-26"
 *    }
 * }
 */
exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ response: false, error: 'Not found' });
    res.json({ response: true, data: p });
  } catch (err) { next(err); }
};

/**
 * @api {patch} /api/products/:id Actualizar un producto
 * @apiName UpdateProduct
 * @apiGroup Products
 * @apiDescription Actualiza los datos de un producto existente.
 *
 * @apiParam {Number} id ID del producto.
 *
 * @apiBody {String} [lotNumber] Número de lote.
 * @apiBody {String} [name] Nombre.
 * @apiBody {Number} [price] Precio.
 * @apiBody {Number} [quantity] Cantidad.
 * @apiBody {String} [entryDate] Fecha de ingreso.
 *
 * @apiSuccess {Boolean} response Estado de la operación.
 * @apiSuccess {Object} data Producto actualizado.
 *
 * @apiError (404) NotFound El producto no existe.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true,
 *   "data": {
 *      "id": 1,
 *      "lotNumber": "L-2025-12",
 *      "name": "Café Premium",
 *      "price": 30.00,
 *      "quantity": 120,
 *      "entryDate": "2025-11-26"
 *    }
 * }
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ response: false, error: 'Not found' });
    await p.update(req.body);
    res.json({ response: true, data: p });
  } catch (err) { next(err); }
};

/**
 * @api {delete} /api/products/:id Eliminar un producto
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiDescription Elimina un producto existente.
 *
 * @apiParam {Number} id ID del producto.
 *
 * @apiSuccess {Boolean} response Estado de la operación.
 *
 * @apiError (404) NotFound El producto no existe.
 *
 * @apiSuccessExample {json} Respuesta exitosa:
 * {
 *   "response": true
 * }
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ response: false, error: 'Not found' });
    await p.destroy();
    res.json({ response: true });
  } catch (err) { next(err); }
};
