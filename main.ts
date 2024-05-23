import 'reflect-metadata';
import app from '@src/app';
import dataSource from '@src/db/data-source';
import env from '@config/index';
import logger from '@src/utils/logger';
import { redisClient } from '@src/utils/redis';

(async () => {
  try {
    await dataSource.initialize();
    await redisClient.connect();
    logger.info('Data source has been initialized');

    app.listen(env.APP_PORT, () => {
      logger.info(`App is running on port ${env.APP_PORT}`);
    });
  } catch (err: any) {
    logger.error(err);
    await redisClient.disconnect();
  }
})();
