import { dropDatabase } from 'typeorm-extension';
import dataSource from '../data-source';
import logger from '@src/utils/logger';

(async () => {
  await dropDatabase({
    options: dataSource.options,
    initialDatabase: 'app_db',
    ifExist: true
  });

  logger.info('DATABASE DROPPED SUCCESSFULLY');

  process.exit(0);
})();
