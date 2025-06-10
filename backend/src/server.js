import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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
  app.use(
    cors({
      origin: 'https://test-contacts-indol.vercel.app',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
      credentials: true,
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
