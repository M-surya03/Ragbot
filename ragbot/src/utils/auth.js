import { jwtDecode } from "jwt-decode";

export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
