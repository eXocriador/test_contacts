import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

import { typeList } from '../constants/contacts.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'string.empty': 'Name cannot be empty',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.base': 'Phone number should be a string',
      'string.pattern.base': 'Phone number must be in format +XXXXXXXXXXX',
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is required',
    }),
  contactType: Joi.string()
    .valid(...typeList)
    .required()
    .messages({
      'any.only': `Contact type must be one of [${typeList.join(', ')}]`,
      'any.required': 'Contact type is required',
    }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  isFavourite: Joi.boolean().optional(),
  parentId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      'string.pattern.base': 'Phone number must be in format +XXXXXXXXXXX',
    })
    .optional(),
  contactType: Joi.string()
    .valid(...typeList)
    .optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
});
