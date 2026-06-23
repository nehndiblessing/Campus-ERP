import axios from "axios";
import { toast } from "react-hot-toast";

const rawBaseURL = import.meta.env.DEV
  ? "http://localhost:8006/api"
  : (import.meta.env.VITE_API_URL?.trim() || "https://campus-erp.onrender.com/api");
const normalizedBaseURL = rawBaseURL.replace(/\/+$/, "");
const baseURL = normalizedBaseURL.endsWith("/api")
  ? normalizedBaseURL
  : `${normalizedBaseURL}/api`;

const api = axios.create({
  baseURL,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      toast.error("Session expired. Please login again.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
