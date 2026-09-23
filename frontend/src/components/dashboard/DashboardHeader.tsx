import type { ReactNode } from 'react';
import Link from 'next/link';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export type SystemStatusType = 'operational' | 'degraded' | 'syncing' | 'offline';

export interface DashboardHeaderProps {
  /** Primary dashboard title */
  title: string;
  /** Subtitle or explanatory description */
  description?: string;
  /** Departmental or role badge (e.g. "Central Tier-1", "PHC Dispensary") */
  roleBadge?: string;
  /** Navigation breadcrumb path */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional telemetry/sync status */
  systemStatus?: SystemStatusType;
  /** Last data refresh timestamp string */
  lastUpdated?: string;
  /** Action buttons, date pickers, or export triggers */
  children?: ReactNode;
  /** Additional container styling */
  className?: string;
}

export default function DashboardHeader({
  title,
  description,
  roleBadge,
  breadcrumbs,
  systemStatus,
  lastUpdated,
  children,
  className = '',
}: DashboardHeaderProps) {
  const getStatusBadge = (status: SystemStatusType) => {
    switch (status) {
      case 'operational':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
            Live Telemetry
          </span>
        );
      case 'syncing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-50 text-sky-700 border border-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" aria-hidden="true" />
            Syncing Records
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" aria-hidden="true" />
            Latency Elevated
          </span>
        );
      case 'offline':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" aria-hidden="true" />
            Offline Mode
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <header
      className={`bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5 ${className}`.trim()}
    >
      {/* Optional Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3">
          <ol className="flex items-center space-x-1.5 text-xs text-slate-500">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;

              return (
                <li key={crumb.label} className="flex items-center">
                  {index > 0 && (
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 mx-1 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {isLast || !crumb.href ? (
                    <span
                      className={`font-medium ${isLast ? 'text-slate-800' : 'text-slate-500'}`}
                      aria-current={isLast ? 'page' : undefined}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="hover:text-slate-900 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      {/* Main Header Container */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Title & Metadata */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h1>

            {roleBadge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
                {roleBadge}
              </span>
            )}

            {systemStatus && getStatusBadge(systemStatus)}
          </div>

          {description && (
            <p className="mt-1 text-sm text-slate-500 leading-normal max-w-3xl">
              {description}
            </p>
          )}

          {lastUpdated && (
            <div className="mt-2 flex items-center text-xs text-slate-400">
              <svg
                className="w-3.5 h-3.5 mr-1 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last synchronized: {lastUpdated}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        {children && (
          <div className="flex items-center flex-wrap gap-2.5 shrink-0">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
