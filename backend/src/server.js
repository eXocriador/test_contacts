import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
// import { logger } from './middlewares/logger.js';
import { cLogs } from './utils/cLogs.js';

dotenv.config();
const PORT = Number(getEnvVar('PORT', '3000'));

export const serverSetup = () => {
  const app = express();

  // Enable CORS for all routes
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log('Server CORS - Request origin:', origin);

    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, Cookie',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Set-Cookie');

    if (req.method === 'OPTIONS') {
      console.log('Server CORS - Handling OPTIONS request');
      return res.status(200).end();
    }

    console.log('Server CORS headers set:', {
      'Access-Control-Allow-Origin': res.getHeader(
        'Access-Control-Allow-Origin',
      ),
      'Access-Control-Allow-Methods': res.getHeader(
        'Access-Control-Allow-Methods',
      ),
      'Access-Control-Allow-Headers': res.getHeader(
        'Access-Control-Allow-Headers',
      ),
      'Access-Control-Allow-Credentials': res.getHeader(
        'Access-Control-Allow-Credentials',
      ),
    });

    next();
  });

  app.use(express.json());
  app.use(cookieParser());
  // app.use(logger);

  app.use('/', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, cLogs);
};
