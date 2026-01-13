// API configuration utility
// In development: uses proxy from package.json (empty string = relative paths)
// In production: uses REACT_APP_API_URL environment variable (e.g., Render backend URL)

const getApiBaseUrl = () => {
  // If REACT_APP_API_URL is set, use it (production - e.g., Render backend)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Otherwise, use empty string for relative paths (development with proxy to localhost:5001)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};

// Log API configuration in development for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('API Base URL:', API_BASE_URL || 'Using proxy (localhost:5001)');
}
