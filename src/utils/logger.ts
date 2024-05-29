import { join } from 'path';
import pino from 'pino';

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
        destination: join(__dirname, '../logs/error_log.log'),
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
