/**
 * Authentication API service.
 *
 * Wraps the actual backend endpoints:
 *   POST /api/auth/register
 *   POST /api/auth/login
 *
 * Token type: JWT Bearer
 * Token payload: { userId: string; role: Role }
 * Login response: { token: string }
 *
 * Roles (from Prisma schema enum):
 *   CENTRAL_ADMIN | STATE_ADMIN | PHC_ADMIN | LOGISTICS_COORDINATOR
 */

import { apiClient, setToken, clearToken, setUser } from './client';

export type UserRole =
  | 'CENTRAL_ADMIN'
  | 'STATE_ADMIN'
  | 'PHC_ADMIN'
  | 'LOGISTICS_COORDINATOR';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

/** Raw response from POST /api/auth/login */
interface LoginApiResponse {
  token: string;
}

/**
 * A decoded representation of the JWT payload stored for UI use.
 * This is derived by the frontend from the token — the backend does not
 * return a user object on login, only a token.
 */
export interface AuthUser {
  userId: string;
  role: UserRole;
}

/**
 * Calls POST /api/auth/login.
 * On success, stores the token and a parsed user object in localStorage.
 * Returns the decoded user info so the caller can redirect accordingly.
 */
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const data = await apiClient.post<LoginApiResponse>(
    '/api/auth/login',
    payload,
    true // skipAuth — no token needed for login
  );

  // Store the raw token
  setToken(data.token);

  // Decode the JWT payload (no verification — server already verified)
  const user = decodeJwtPayload<AuthUser>(data.token);
  if (user) {
    setUser(user);
  }

  return user ?? { userId: '', role: 'PHC_ADMIN' };
}

/**
 * Calls POST /api/auth/register.
 * Registration creates a new user; does NOT auto-login.
 */
export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  return apiClient.post<RegisterResponse>('/api/auth/register', payload, true);
}

/**
 * Clears local token and user data (client-side logout).
 * The backend has no logout endpoint.
 */
export function logout(): void {
  clearToken();
}

/**
 * Decodes the base64url-encoded JWT payload without verification.
 * Used only to extract role/userId for UI routing after a successful login.
 */
function decodeJwtPayload<T>(token: string): T | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    // base64url → base64 → JSON
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as T;
  } catch {
    return null;
  }
}
