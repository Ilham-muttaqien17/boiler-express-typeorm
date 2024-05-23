import 'reflect-metadata';
import app from '@src/app';
import dataSource from '@src/db/data-source';
import env from '@config/index';
import logger from '@src/utils/logger';

(async () => {
  try {
    await dataSource.initialize();
    logger.info('Data source has been initialized');

    app.listen(env.APP_PORT, () => {
      logger.info(`App is running on port ${env.APP_PORT}`);
    });
  } catch (err: any) {
    console.error(err);
  }
})();
