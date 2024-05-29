import env from '@config/index';
import { join } from 'path';
import pino from 'pino';

const errorPath =
  env.NODE_ENV === 'production' ? '../../../logs/production.errors.log' : '../../logs/development.errors.log';

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty'
    },
    {
      level: 'error',
      target: 'pino/file',
      options: {
        destination: join(__dirname, errorPath),
        mkdir: true
      }
    }
  ]
});

// const logger = pino({
//   transport: {
//     target: 'pino-pretty',
//     options: {}
//   }
// });

const logger = pino(transport);

export default logger;
