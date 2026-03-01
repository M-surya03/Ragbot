import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
});

export const loginUser = (data) => API.post("/login", data);

export const googleLogin = (token) =>
  API.post("/google", { token });

export const setPassword = (data) =>
  API.post("/set-password", data);
