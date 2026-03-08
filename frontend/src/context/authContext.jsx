import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CHECK AUTH WHEN APP LOADS
  const checkAuth = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

     const response = await axios.get("/api/auth/me", {
  withCredentials: true,
});

      setUser(response.data.user);

    } catch (error) {

      console.error("Auth check failed:", error.response?.data);
      setUser(null);

    } finally {

      setLoading(false);

    }

  };



  // LOGIN
  const login = async (email, password) => {

    try {

      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data && response.data.user) {

        // SAVE TOKEN
        localStorage.setItem("token", response.data.token);

        setUser(response.data.user);

        return { success: true };

      }

      return { success: false, error: "Invalid server response" };

    } catch (error) {

      console.error("Login failed:", error.response?.data);

      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };

    }

  };



  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");
    setUser(null);

  };



  // REGISTER
  const register = async (name, email, password) => {

    try {

      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      if (response.data) {

        return { success: true };

      }

      return { success: false };

    } catch (error) {

      console.error("Registration failed:", error.response?.data);

      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };

    }

  };



  useEffect(() => {

    checkAuth();

  }, []);



  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>

  );

};