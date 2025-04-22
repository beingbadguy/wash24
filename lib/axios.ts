import axios from "axios";
import { useAuthStore } from "../store/store";
import Cookies from "js-cookie";

// Create axios instance with default config
const api = axios.create({
  baseURL: "https://civilian-mole-parivartanx-812f67f6.koyeb.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Enable cookies
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from cookie
    const token = Cookies.get("wash24");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      window.location.pathname !== "/auth/login"
    ) {
      Cookies.remove("wash24");
      useAuthStore.getState().clearAuth();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
