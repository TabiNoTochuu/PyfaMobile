/**
 * Axios wrapper for the local FastAPI backend.
 *
 * The backend runs on localhost:8765 inside the app process (Chaquopy
 * Android service in prod, or `uvicorn backend.api.main:app` in dev).
 */
import axios from 'axios';

export const BASE_URL = 'http://localhost:8765';

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/** Poll /health until the backend is ready, then resolve. */
export async function waitForBackend(
  intervalMs = 500,
  maxAttempts = 60,
): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const res = await api.get('/health', { timeout: 2000 });
      if (res.data?.status === 'ok') return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error('Backend did not start within the expected time.');
}
