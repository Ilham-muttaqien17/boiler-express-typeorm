import express from 'express';
import type { NextFunction, Request, Response, Errback } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import limiter from '@src/middlewares/rate-limiter';
import sanitizer from '@src/middlewares/sanitizer';
import routes from '@src/routes';
import HttpResponse from '@src/utils/response';
import logger from '@src/utils/logger';

const app = express();

/* Parse request body to json */
app.use(express.json());

/* Parse request body to x-www-form-urlencoded */
app.use(express.urlencoded({ extended: true }));

/* Rate limiter for each request based on ip address */
app.use(limiter);

/* Secure Express by set HTTP response headers */
app.use(helmet());

/* Sanitize request data */
app.use(sanitizer);

/* Configure CORS */
app.use(
  cors({
    origin: ['*'],
    optionsSuccessStatus: 200
  })
);

/* Static directory */
app.use('/public', express.static('uploads'));

/* Api Route */
app.use('/api', routes);

/** Error handler */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Errback, req: Request, res: Response, next: NextFunction) => {
  logger.error(err);
  HttpResponse.error(res, err);
});

/** Handle unmatched route */
app.use('*', (req, res) => {
  res.status(404).send({
    status: 404,
    message: 'Resouce not found'
  });
});

export default app;
