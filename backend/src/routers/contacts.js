import express from 'express';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  patchContactController,
  updateContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateContact } from '../middlewares/validateContact.js';
import { validateId } from '../middlewares/validateId.js';
import { validateQuery } from '../middlewares/validateQuery.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// Add CORS headers middleware
const corsHeaders = (req, res, next) => {
  const origin = req.headers.origin;
  console.log('Request origin:', origin);

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

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }

  console.log('CORS headers set:', {
    'Access-Control-Allow-Origin': res.getHeader('Access-Control-Allow-Origin'),
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
};

// Apply CORS headers to all routes
router.use(corsHeaders);

router.get('/', auth, validateQuery, ctrlWrapper(getContactsController));
router.get(
  '/:contactId',
  auth,
  isValidId,
  ctrlWrapper(getContactByIdController),
);
router.post('/', auth, validateContact, ctrlWrapper(createContactController));
router.delete(
  '/:contactId',
  auth,
  isValidId,
  ctrlWrapper(deleteContactController),
);
router.put(
  '/:contactId',
  auth,
  isValidId,
  validateContact,
  ctrlWrapper(updateContactController),
);
router.patch(
  '/:contactId',
  auth,
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
