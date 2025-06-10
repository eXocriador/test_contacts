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

  // Basic middleware
  app.use(express.json());
  app.use(cookieParser());

  // CORS configuration
  const corsOptions = {
    origin: 'https://test-contacts-indol.vercel.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
  };

  // Apply CORS
  app.use(cors(corsOptions));

  // Routes
  app.use('/', router);

  // Error handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, cLogs);
};
