// Centralised API base URL - reads from environment in production, falls back to localhost in dev
// We use .replace(/\/$/, '') to safely remove any trailing slashes the user might have accidentally added in Vercel.
export const API_URL = (import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:5000')).replace(/\/$/, '');
