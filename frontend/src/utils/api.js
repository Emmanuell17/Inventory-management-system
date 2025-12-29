// API configuration utility
// In development: uses proxy from package.json (empty string = relative paths)
// In production: uses REACT_APP_API_URL environment variable

const getApiBaseUrl = () => {
  // If REACT_APP_API_URL is set, use it (production)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  // Otherwise, use empty string for relative paths (development with proxy)
  return '';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs
export const getApiUrl = (endpoint) => {
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_BASE_URL}/${cleanEndpoint}`;
};
