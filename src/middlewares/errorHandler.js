const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(err.stack || err.toString());
  res.status(500).json({ response: false, error: 'Internal Server Error' });
};
