import { useState, useEffect } from "react";
import AuthContext from "./AuthContextCore";
import api from "../services/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedUser = getStoredUser();

      if (!storedUser?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        login({ ...data, token: storedUser.token });
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
