const express = require('express');
const router = express.Router();
const { createPurchase, getInvoice, getHistory, adminListPurchases } = require('../controllers/purchaseController');
const { authenticate } = require('../middlewares/auth');
const { permit } = require('../middlewares/roles');

router.post('/', authenticate, createPurchase); // cliente crea compra
router.get('/invoice/:id', authenticate, getInvoice); // ver factura completa
router.get('/history', authenticate, getHistory); // historial del cliente
router.get('/admin', authenticate, permit('admin'), adminListPurchases); // admin ve todas las compras

module.exports = router;
