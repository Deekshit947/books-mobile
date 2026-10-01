import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://openlibrary.org',
  timeout: 12_000,
  headers: {Accept: 'application/json'},
});

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') return 'The request timed out. Check your connection and try again.';
    if (!error.response) return 'We could not reach Open Library. Check your connection and try again.';
    if (error.response.status === 429) return 'Open Library is receiving too many requests. Please wait a moment.';
  }
  return 'Something went wrong while loading books. Please try again.';
}
