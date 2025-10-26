import axios from "axios";

// Dynamically detect the environment and set the correct base URL
const baseURL =
  import.meta.env.DEV
    ? "http://localhost:5000/api" // Local backend during development
    : "/api"; // Vercel will handle /api routes automatically

// Create a reusable Axios instance
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies or credentials if needed
});

// 🔒 Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🚨 Handle global API response errors (like expired tokens)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized → remove token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.warn("Access denied: insufficient permissions");
    }
    return Promise.reject(error);
  }
);

// 🔑 Utility to manually set or clear auth token
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem("token", token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete api.defaults.headers.common.Authorization;
  }
}
