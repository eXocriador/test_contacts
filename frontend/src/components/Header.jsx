import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useTheme } from "../contexts/ThemeContext";
import {
  Button,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  Home,
  Contacts,
  Logout
} from "@mui/icons-material";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, user } = useSelector((state) => state.auth);
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Contact Manager
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton color="inherit" component={Link} to="/">
            <Home />
          </IconButton>

          {accessToken && (
            <IconButton color="inherit" component={Link} to="/contacts">
              <Contacts />
            </IconButton>
          )}

          <IconButton color="inherit" onClick={toggleTheme}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          {accessToken ? (
            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
