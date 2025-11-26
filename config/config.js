require('dotenv').config();

// Definir configuración de la base de datos para diferentes entornos, en este caso solo desarrollo por el momento.
module.exports = {
  development: {
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: process.env.DATABASE_NAME || 'stock_db',
    host: process.env.DATABASE_HOST || '127.0.0.1',
    dialect: 'postgres'
  }
};
