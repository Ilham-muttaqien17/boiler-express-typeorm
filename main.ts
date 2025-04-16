import 'reflect-metadata';
import app from '@src/app';
import dataSource from '@src/db/data-source';
import env from '@config/index';
import logger from '@src/utils/logger';
import { redisClient } from '@src/utils/redis';
import type { Server } from 'http';

let server: Server;

async function gracefulShutdown(signal: NodeJS.Signals) {
  logger.info(`Received ${signal}, closing server...`);
  server.close(async () => {
    // Disconnect redis connection
    redisClient.disconnect();

    logger.info('Worker stopped');
    logger.info('HTTP server closed');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

(async () => {
  try {
    // Initialize db connection
    await dataSource.initialize();

    logger.info('Data source has been initialized');
    logger.info(`Environment: ${env.NODE_ENV}`);

    server = app.listen(env.APP_PORT, () => {
      logger.info(`App is running on port ${env.APP_PORT}`);
    });
  } catch (err: any) {
    logger.error(err);
    process.kill(process.pid, 'SIGINT');
  }
})();
