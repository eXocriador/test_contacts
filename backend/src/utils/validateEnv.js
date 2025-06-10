// src/utils/validateEnv.js

export const validateEnv = () => {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'PORT',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar],
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingEnvVars.join(', ')}`,
    );
  }

  // Validate MongoDB URI format
  if (
    !process.env.MONGODB_URI.startsWith('mongodb://') &&
    !process.env.MONGODB_URI.startsWith('mongodb+srv://')
  ) {
    throw new Error('Invalid MONGODB_URI format');
  }

  // Validate PORT is a number
  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port)) {
    throw new Error('PORT must be a number');
  }

  // Validate JWT secrets
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  if (process.env.JWT_REFRESH_SECRET.length < 32) {
    throw new Error('JWT_REFRESH_SECRET must be at least 32 characters long');
  }

  console.log('✅ Environment variables validated successfully');
};
