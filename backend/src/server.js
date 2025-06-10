import express from 'express';
import cors from 'cors';
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
const CORS_ORIGIN = getEnvVar('CORS_ORIGIN', 'http://localhost:5173');

export const serverSetup = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        CORS_ORIGIN,
        'http://localhost:5173',
        'http://localhost:3001',
        'https://test-contacts-indol.vercel.app',
        'https://contacts-app-frontend.vercel.app',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      exposedHeaders: ['Set-Cookie'],
    }),
  );

  app.use(express.json());
  app.use(cookieParser());
  // app.use(logger);

  app.use('/', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, cLogs);
};
