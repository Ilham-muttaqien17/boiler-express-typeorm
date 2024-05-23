import pino from 'pino';

// const transport = pino.transport({
//   targets: [
//     {
//       level: 'info',
//       target: 'pino-pretty'
//     },
//     {
//       level: 'error',
//       target: 'pino/file',
//       options: { destination: join(__dirname, '../logs/app_log.log') }
//     }
//   ]
// });

// const destination = pino.destination({
//   dest: join(__dirname, '../logs/app_log.log'),
//   sync: true
// });

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {}
  }
});

export default logger;
