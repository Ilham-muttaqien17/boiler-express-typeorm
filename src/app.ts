import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import limiter from '@src/middlewares/rate-limiter';
import sanitizer from '@src/middlewares/sanitizer';
import routes from '@src/routes';
import HttpResponse from '@src/utils/response';
import logger from '@src/utils/logger';
import compression from 'compression';
import { useDayjs } from '@src/utils/dayjs';
import requestIp from 'request-ip';
import requestId from '@src/middlewares/request-id';
import swaggerUi from 'swagger-ui-express';
import { openApiDoc } from '@docs/openapi';

const app = express();

/* Custom request id */
app.use(requestId);

/* Retrieve client ip address */
app.use(requestIp.mw());

/* Compress http response */
app.use(compression());

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

/* OpenAPI docs route */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDoc));

/* Configure CORS */
app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200
  })
);

/* Static directory */
app.use('/public', express.static('uploads'));

/* Api Route */
app.use('/api', routes);

/** Error handler */
// eslint-disable-next-line no-unused-vars, @ts-eslint/no-unused-vars
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const errData = {
    path: req.path,
    method: req.method,
    statusCode: err?.statusCode,
    ua: req.headers['user-agent'],
    ip: req.clientIp,
    requestId: req.requestId,
    requestTime: useDayjs(new Date()).format(),
    stack: err?.stack ?? undefined
  };
  logger.error(errData, err.message);
  HttpResponse.error(res, err);
});

/** Handle unmatched route */
app.use((_req, res) => {
  res.status(404).send({
    status: 404,
    message: 'Resource not found'
  });
});

export default app;
