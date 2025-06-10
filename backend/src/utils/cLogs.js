const PORT = process.env.PORT || 3000;

export const cLogs = () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ Server is running on http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}\n`);
};
