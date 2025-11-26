const { Product } = require('../models');
const Joi = require('joi');

const productSchema = Joi.object({
  lotNumber: Joi.string().required(),
  name: Joi.string().required(),
  price: Joi.number().positive().precision(2).required(),
  quantity: Joi.number().integer().min(0).required(),
  entryDate: Joi.date().required()
});

exports.createProduct = async (req, res, next) => {
  try {
    const { error, value } = productSchema.validate(req.body);
    if (error) return res.status(400).json({ response: false, error: error.message });

    const p = await Product.create(value);
    res.json({ response: true, data: p });
  } catch (err) { next(err); }
};

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll();
    res.json({ response: true, data: products });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ response: false, error: 'Not found' });
    res.json({ response: true, data: p });
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ response: false, error: 'Not found' });
    await p.update(req.body);
    res.json({ response: true, data: p });
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const p = await Product.findByPk(req.params.id);
    if (!p) return res.status(404).json({ response: false, error: 'Not found' });
    await p.destroy();
    res.json({ response: true });
  } catch (err) { next(err); }
};
