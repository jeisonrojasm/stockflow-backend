const express = require('express');
const router = express.Router();
const { createProduct, listProducts, getProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticate } = require('../middlewares/auth');
const { permit } = require('../middlewares/roles');

router.get('/', authenticate, listProducts);
router.post('/', authenticate, permit('admin'), createProduct);
router.get('/:id', authenticate, getProduct);
router.patch('/:id', authenticate, permit('admin'), updateProduct);
router.delete('/:id', authenticate, permit('admin'), deleteProduct);

module.exports = router;
