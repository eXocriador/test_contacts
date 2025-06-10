// src/routers/index.js

import { Router } from 'express';
import contactsRouter from './contacts.js';
import authRouter from './auth.js';
import welcomeRoute from './welcome.js';

const router = Router();

router.use('/', welcomeRoute);
router.use('/contacts', contactsRouter);
router.use('/auth', authRouter);

export default router;
