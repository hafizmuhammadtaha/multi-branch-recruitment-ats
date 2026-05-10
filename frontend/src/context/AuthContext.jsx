import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Rehydrate from localStorage
    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');
      
      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      }
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    // Backend returns flat: { success, _id, name, email, role, profilePicUrl, token }
    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      profilePicUrl: data.profilePicUrl
    };
    
    setUser(userData);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      updateUser,
      isAuthenticated: !!token,
      role: user?.role,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
