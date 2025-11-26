require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 3000;

(
  async () => {
    try {
      await sequelize.authenticate();
      logger.info('Database connected successfully.');

      app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      process.exit(1);
    }
  }
)()
