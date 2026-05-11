import { createContext, useState, useEffect } from 'react';

// Create a context for authentication state management
// This allows components throughout the app to access and modify user authentication data
export const AuthContext = createContext();

// AuthProvider component wraps the entire app to provide authentication context
// It manages user state, handles login/logout, and persists data to localStorage
export const AuthProvider = ({ children }) => {
  // State to hold current user information (token, role, name, id, profilePicUrl)
  const [user, setUser] = useState(null);
  // Loading state to prevent rendering until authentication check is complete
  const [loading, setLoading] = useState(true);

  // Effect runs once on component mount to restore user session from localStorage
  // This ensures users stay logged in across browser sessions
  useEffect(() => {
    // Retrieve authentication data from browser's local storage
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');
    const name  = localStorage.getItem('name');
    const id    = localStorage.getItem('id');
    const pic   = localStorage.getItem('profilePicUrl');
    // If token exists, reconstruct user object and set it in state
    if (token) setUser({ token, role, name, id, profilePicUrl: pic });
    // Mark loading as complete regardless of whether user was found
    setLoading(false);
  }, []);

  // Login function: Stores user data in localStorage and updates state
  // Called after successful authentication from the backend
  const login = (data) => {
    // Persist authentication data to localStorage for session persistence
    localStorage.setItem('token', data.token);
    localStorage.setItem('role',  data.role);
    localStorage.setItem('name',  data.name);
    localStorage.setItem('id',    data._id);
    localStorage.setItem('profilePicUrl', data.profilePicUrl);
    // Update component state with user data
    setUser(data);
  };

  // Logout function: Clears all stored authentication data and resets state
  // This ensures complete session termination
  const logout = () => {
    // Remove all authentication-related items from localStorage
    localStorage.clear();
    // Reset user state to null, effectively logging out the user
    setUser(null);
  };

  // Provide authentication context to all child components
  // Exposes user data, login/logout functions, and loading state
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};