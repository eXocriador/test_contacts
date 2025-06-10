import { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { refreshUserToken } from './store/slices/authSlice';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContactsPage } from './pages/ContactsPage';
import { LandingPage } from './pages/LandingPage';

function App() {
  const dispatch = useDispatch();
  const { accessToken, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !accessToken) {
      dispatch(refreshUserToken());
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/login"
                element={
                  accessToken ? (
                    <Navigate to="/contacts" replace />
                  ) : (
                    <LoginPage />
                  )
                }
              />
              <Route
                path="/register"
                element={
                  accessToken ? (
                    <Navigate to="/contacts" replace />
                  ) : (
                    <RegisterPage />
                  )
                }
              />
              <Route
                path="/contacts"
                element={
                  <PrivateRoute>
                    <ContactsPage />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
