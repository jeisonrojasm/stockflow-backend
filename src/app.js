const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
// const purchaseRoutes = require('./routes/purchases');
const { requestLogger } = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
// app.use('/api/purchases', purchaseRoutes);

app.get('/', (req, res) => res.json({ ok: true, msg: 'Inventory API' }));
app.use(errorHandler);

module.exports = app;
