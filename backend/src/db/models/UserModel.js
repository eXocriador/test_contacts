// src/db/models/user.js
import { model, Schema } from 'mongoose';
import { handeSaveError, setUpdateSettings } from './hooks.js';
import { emailRegex } from '../../constants/auth.js';
import { ROLES } from '../../constants/index.js';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, match: emailRegex, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: [ROLES.ABOBA, ROLES.BEBRA],
      default: ROLES.BEBRA,
    },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.post('save', handeSaveError);
usersSchema.pre('findOneAndUpdate', setUpdateSettings);
usersSchema.post('findOneAndUpdate', handeSaveError);

export const UsersCollection = model('users', usersSchema);
