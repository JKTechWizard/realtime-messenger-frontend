// src/config/env.ts
const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:5000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL as string || 'http://localhost:5000',
  ENV: import.meta.env.VITE_ENV as string || 'development',
};

export default env;
