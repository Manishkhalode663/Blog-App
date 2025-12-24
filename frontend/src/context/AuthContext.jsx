import React, { createContext, useState, useEffect, useContext } from 'react';
import { authApi } from '../api/authApi';
 
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Is the app still checking session?

  // Check session on page load (Persistence)
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userData = await authApi.getCurrentUser();
        if (userData) setUser(userData);
      } catch {
        console.log("Not logged in");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  // Login Action
  const login = async (credentials) => {
    const userData = await authApi.login(credentials);
    setUser(userData);
  };

  // Signup Action
  const signup = async (data) => {
    const userData = await authApi.signup(data);
    setUser(userData);
  };

  // Logout Action
  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};



// Custom hook to use auth easily
export const useAuth = () => useContext(AuthContext);
