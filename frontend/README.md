# Contact Manager Frontend

A modern React application for managing contacts, built with Material-UI and Vite.

## Features

- User authentication (login/register)
- Contact management (create, read, update, delete)
- Pagination, sorting, and filtering of contacts
- Responsive design
- Modern UI with Material-UI components
- Toast notifications for user feedback

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:3000

## Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

## Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3001.

## Building for Production

To create a production build:

```bash
npm run build
# or
yarn build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── contexts/       # React contexts
  ├── pages/         # Page components
  ├── services/      # API services
  ├── theme.js       # Material-UI theme configuration
  ├── App.jsx        # Main application component
  └── main.jsx       # Application entry point
```

## Technologies Used

- React 18
- Material-UI 5
- React Router 6
- Axios
- Notistack
- Vite
- ESLint

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
