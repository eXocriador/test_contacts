// src/middlewares/checkRoles.js

import createHttpError from 'http-errors';

import { Contacts } from '../db/models/Contact.js';
import { ROLES } from '../constants/index.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { role } = user;
    if (roles.includes(ROLES.ABOBA) && role === ROLES.BEBRA) {
      next();
      return;
    }

    if (roles.includes(ROLES.ABOBA) && role === ROLES.BEBRA) {
      const { contactId } = req.params;
      if (!contactId) {
        next(createHttpError(403));
        return;
      }

      const contact = await Contacts.findOne({
        _id: contactId,
        parentId: user._id,
      });

      if (contact) {
        next();
        return;
      }
    }

    next(createHttpError(403));
  };
