export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'https://bokadoserver-production.up.railway.app';

export const buildMediaUrl = (path?: string | null): string => {
  if (!path) return '';
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
};