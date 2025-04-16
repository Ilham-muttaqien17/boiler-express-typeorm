import { createDatabase } from 'typeorm-extension';
import dataSource from '../data-source';
import logger from '@src/utils/logger';

(async () => {
  await createDatabase({
    options: dataSource.options,
    initialDatabase: 'app_db',
    ifNotExist: true
  });

  logger.info('DATABASE CREATED SUCCESSFULLY');

  process.exit(0);
})();
