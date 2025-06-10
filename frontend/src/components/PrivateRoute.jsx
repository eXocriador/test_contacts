import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, CircularProgress } from "@mui/material";

export const PrivateRoute = ({ children }) => {
  const { accessToken, loading } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
