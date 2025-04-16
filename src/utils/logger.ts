import env from '@config/index';
import { join } from 'path';
import pino, { type TransportPipelineOptions } from 'pino';

const transport = pino.transport({
  targets: [
    {
      level: 'info',
      target: 'pino-pretty'
    },
    env.NODE_ENV === 'production'
      ? {
          level: 'error',
          target: 'pino-roll',
          options: {
            file: join(process.cwd(), '/logs/error'),
            frequency: 'daily',
            extension: '.log',
            dateFormat: 'yyyy-MM-dd',
            mkdir: true
          }
        }
      : ({} as TransportPipelineOptions)
  ]
});

const logger = pino(transport);

export default logger;
