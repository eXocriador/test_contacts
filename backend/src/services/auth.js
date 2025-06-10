// src/services/auth.js

import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';

import { UsersCollection } from '../db/models/UserModel.js';
import { SessionsCollection } from '../db/models/Session.js';
import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const hashPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: hashPassword,
  });

  // Remove password from the response
  const { password, ...userWithoutPassword } = newUser.toObject();
  return userWithoutPassword;
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  // Delete all existing sessions for this user
  await SessionsCollection.deleteMany({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  // Remove password from user object
  const { password, ...userWithoutPassword } = user.toObject();

  return {
    ...session.toObject(),
    user: userWithoutPassword,
  };
};

export const logoutUser = async (sessionId) => {
  const result = await SessionsCollection.deleteOne({ _id: sessionId });
  if (!result.deletedCount) {
    throw createHttpError(404, 'Session not found');
  }
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};
