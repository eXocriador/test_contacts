# Contacts App

A full-stack contacts management application with authentication and CRUD operations.

## Project Structure

```
project/
├── frontend/          # React frontend
├── backend/           # Node.js backend
└── package.json       # Root package.json for monorepo
```

## Development

1. Install dependencies:

```bash
npm run install:all
```

2. Start development servers:

```bash
npm run dev
```

This will start both frontend and backend servers concurrently.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend URL (e.g., https://your-backend-url.onrender.com)

### Backend (Render)

1. Push your code to GitHub
2. Create a new Web Service in Render
3. Connect your repository
4. Configure environment variables in Render dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT tokens
   - `JWT_REFRESH_SECRET`: Secret for refresh tokens
   - `CORS_ORIGIN`: Your frontend URL (e.g., https://your-frontend-url.vercel.app)

## Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/contacts
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
CORS_ORIGIN=http://localhost:5173
```

## Available Scripts

- `npm run dev` - Start development servers
- `npm run build` - Build both frontend and backend
- `npm run start` - Start production servers
- `npm run install:all` - Install all dependencies
