import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8006/api",
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