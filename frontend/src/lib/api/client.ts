/**
 * Centralized API client for the Health Supply Chain Intelligence Platform.
 *
 * Reads the backend base URL from the NEXT_PUBLIC_API_URL environment variable.
 * Attaches JWT Bearer token from localStorage on every authenticated request.
 * Handles non-2xx responses by throwing a structured ApiError.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const getBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) {
    // Fallback for local development — backend defaults to port 5000
    return 'http://localhost:5000';
  }
  return url;
};

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('hscip_token');
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hscip_token', token);
  }
};

export const clearToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hscip_token');
    localStorage.removeItem('hscip_user');
  }
};

export const setUser = (user: object): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hscip_user', JSON.stringify(user));
  }
};

export const getUser = <T = Record<string, unknown>>(): T | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('hscip_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  /** Set to true to skip attaching the Authorization header */
  skipAuth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, skipAuth = false } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!skipAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) message = errorBody.message;
    } catch {
      // Ignore parse errors on error responses
    }
    throw new ApiError(response.status, message);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, skipAuth = false) =>
    request<T>(path, { method: 'GET', skipAuth }),

  post: <T>(path: string, body: unknown, skipAuth = false) =>
    request<T>(path, { method: 'POST', body, skipAuth }),

  patch: <T>(path: string, body: unknown, skipAuth = false) =>
    request<T>(path, { method: 'PATCH', body, skipAuth }),

  put: <T>(path: string, body: unknown, skipAuth = false) =>
    request<T>(path, { method: 'PUT', body, skipAuth }),

  delete: <T>(path: string, skipAuth = false) =>
    request<T>(path, { method: 'DELETE', skipAuth }),
};
