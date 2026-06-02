import type { AxiosError } from 'axios';

export const getErrorMessage = (error: unknown, fallback = 'Щось пішло не так'): string => {
  const e = error as AxiosError<{ message?: string }>;
  return e.response?.data?.message ?? (error instanceof Error ? error.message : fallback);
};