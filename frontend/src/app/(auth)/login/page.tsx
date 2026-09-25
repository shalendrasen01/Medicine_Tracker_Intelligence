'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, ApiError } from '@/lib/api';
import type { UserRole } from '@/lib/api';

/**
 * Login Page — connects to POST /api/auth/login on the Express backend.
 *
 * On success: stores JWT token + decoded user (userId, role) in localStorage
 * and redirects to the role-appropriate dashboard:
 *   CENTRAL_ADMIN       → /dashboard/central
 *   STATE_ADMIN         → /dashboard/state
 *   PHC_ADMIN           → /dashboard/phc
 *   LOGISTICS_COORDINATOR → /dashboard/logistics
 */

const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  CENTRAL_ADMIN: '/dashboard/central',
  STATE_ADMIN: '/dashboard/state',
  PHC_ADMIN: '/dashboard/phc',
  LOGISTICS_COORDINATOR: '/dashboard/logistics',
};

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const user = await login({ email, password });
      const destination = ROLE_DASHBOARD_MAP[user.role] ?? '/dashboard/central';
      router.push(destination);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else {
          setErrorMessage(`Login failed: ${err.message}`);
        }
      } else {
        setErrorMessage(
          'Unable to reach the server. Please check that the backend is running.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      {/* Government header strip */}
      <div className="w-full bg-slate-900 text-slate-300 text-xs py-2 px-4 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-200">
            National Health Supply Operations Portal
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Restricted Access</span>
        </div>
      </div>

      <div className="mt-16 w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-sky-700 flex items-center justify-center shadow-md mb-3">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Health Supply Chain Intelligence
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorized Personnel Sign In
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Error banner */}
            {errorMessage && (
              <div
                role="alert"
                className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs"
              >
                {errorMessage}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Official Email Address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@health.gov.in"
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              id="login-submit-btn"
              className="w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold rounded-md text-white bg-sky-700 hover:bg-sky-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Authenticating…
                </>
              ) : (
                'Sign In to Portal'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className="mt-4 text-center text-xs text-slate-500">
          <Link href="/" className="font-semibold text-sky-700 hover:text-sky-800">
            ← Back to public portal
          </Link>
        </p>

        {/* Security notice */}
        <p className="mt-6 text-center text-[11px] text-slate-400">
          All sessions are audited under governmental healthcare guidelines.
        </p>
      </div>
    </div>
  );
}
