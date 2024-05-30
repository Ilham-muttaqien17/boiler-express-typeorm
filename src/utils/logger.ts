import env from '@config/index';
import { join } from 'path';
import pino from 'pino';

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty'
    },
    env.NODE_ENV === 'production'
      ? {
          level: 'error',
          target: 'pino/file',
          options: {
            destination: join(process.cwd(), '/logs/error.log'),
            mkdir: true
          }
        }
      : { level: 'error', target: 'pino-pretty' }
  ]
});

const logger = pino(transport);

export default logger;
