// src/db/models/contact.js

import mongoose, { Schema } from 'mongoose';
import { typeList } from '../../constants/contacts.js';
import { handeSaveError, setUpdateSettings } from './hooks.js';
import { emailRegex } from '../../constants/auth.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: emailRegex,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: typeList,
      required: true,
      default: 'personal',
    },
    parentId: {
      // нова властивість
      type: Schema.Types.ObjectId,
      ref: 'users',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

contactSchema.post('save', handeSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', handeSaveError);

export const Contacts =
  mongoose.models.contact || mongoose.model('contact', contactSchema);
