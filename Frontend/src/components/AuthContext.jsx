import React, { createContext, useState, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Provider component to wrap around the part of your app where you need access to authentication
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext in other components
export const useAuth = () => useContext(AuthContext);
