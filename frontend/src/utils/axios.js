import axios from 'axios';

// Create a customized Axios instance for API communication
// This instance includes interceptors for automatic authentication and error handling
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

// Request interceptor: Automatically attach JWT token to outgoing requests
// This ensures all API calls include authentication headers when user is logged in
api.interceptors.request.use((config) => {
  // Retrieve the authentication token from localStorage
  const token = localStorage.getItem('token');
  // If token exists, add it to the Authorization header as a Bearer token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Return the modified config to proceed with the request
  return config;
});

// Response interceptor: Handle authentication errors globally
// This provides centralized error handling for unauthorized access
api.interceptors.response.use(
  // On successful response, pass it through unchanged
  (res) => res,
  // On error, check for 401 status and handle authentication failure
  (err) => {
    // If the error is a 401 Unauthorized, clear user session and redirect to login
    if (err.response?.status === 401) {
      // Clear all stored authentication data to prevent further unauthorized requests
      localStorage.clear();
      // Redirect user to login page to re-authenticate
      window.location.href = '/login';
    }
    // Reject the promise to propagate the error to the calling component
    return Promise.reject(err);
  }
);

// Export the configured Axios instance for use throughout the application
export default api;