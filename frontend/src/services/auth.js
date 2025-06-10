import api from "./api";

export const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    return response;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const response = await api.post("/auth/refresh");
    return response;
  } catch (error) {
    throw error;
  }
};
