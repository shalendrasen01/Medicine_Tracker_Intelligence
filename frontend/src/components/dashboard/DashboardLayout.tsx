'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import DashboardHeader, {
  type BreadcrumbItem,
  type SystemStatusType,
} from './DashboardHeader';

export type DashboardRole = 'central' | 'state' | 'phc' | 'logistics';

export interface DashboardLayoutProps {
  /** Page content rendered inside the main content container */
  children: ReactNode;
  /** Primary dashboard title */
  title: string;
  /** Subtitle or explanatory description */
  description?: string;
  /** Departmental or role badge (e.g. "Central Authority", "State Tier-2") */
  roleBadge?: string;
  /** Active role type for role-tailored dashboard navigation */
  currentRole?: DashboardRole;
  /** Navigation breadcrumb path */
  breadcrumbs?: BreadcrumbItem[];
  /** Optional telemetry / sync status */
  systemStatus?: SystemStatusType;
  /** Last data refresh timestamp string */
  lastUpdated?: string;
  /** Action controls rendered in DashboardHeader (e.g. export, filter buttons) */
  headerActions?: ReactNode;
  /** Additional container styling */
  className?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: (props: { className?: string }) => ReactNode;
  badge?: string;
}

export default function DashboardLayout({
  children,
  title,
  description,
  roleBadge,
  currentRole = 'central',
  breadcrumbs,
  systemStatus,
  lastUpdated,
  headerActions,
  className = '',
}: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Role dashboard navigation mappings
  const roleDashboardLinks: Record<DashboardRole, { name: string; href: string }> = {
    central: { name: 'Central Admin', href: '/dashboard/central' },
    state: { name: 'State Admin', href: '/dashboard/state' },
    phc: { name: 'PHC Dispensary', href: '/dashboard/phc' },
    logistics: { name: 'Logistics Fleet', href: '/dashboard/logistics' },
  };

  const currentRoleDashboard = roleDashboardLinks[currentRole];

  // Core navigation sections
  const primaryNavItems: NavItem[] = [
    {
      name: currentRoleDashboard.name,
      href: currentRoleDashboard.href,
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      name: 'Inventory & Stock',
      href: '/inventory',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: 'Alerts & Outages',
      href: '/alerts',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      name: 'Predictions & AI',
      href: '/predictions',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      name: 'Transfers & Quotas',
      href: '/transfers',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
    },
    {
      name: 'Shipments & Fleet',
      href: '/shipments',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
    },
    {
      name: 'Facility & Cold Map',
      href: '/map',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
  ];

  const secondaryNavItems: NavItem[] = [
    {
      name: 'System Settings',
      href: '/settings',
      icon: ({ className = 'w-5 h-5' }) => (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 flex ${className}`.trim()}>
      {/* Mobile Menu Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        {/* Sidebar Header / Platform Branding */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <Link href="/" className="flex items-center space-x-2.5 focus:outline-none">
            <div className="w-8 h-8 rounded bg-sky-700 text-white flex items-center justify-center font-bold text-sm shadow-inner">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white block leading-none">
                HSCIP Portal
              </span>
              <span className="text-[10px] font-medium tracking-wider text-sky-400 uppercase block mt-1">
                Health Supply Intelligence
              </span>
            </div>
          </Link>

          {/* Close Button on Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Close navigation menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Current Active Role Switcher Preview */}
        <div className="px-3 py-3 border-b border-slate-800 bg-slate-950/40">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
            Role Workspace
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <Link
              href="/dashboard/central"
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                currentRole === 'central'
                  ? 'bg-sky-700 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Central
            </Link>
            <Link
              href="/dashboard/state"
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                currentRole === 'state'
                  ? 'bg-sky-700 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              State
            </Link>
            <Link
              href="/dashboard/phc"
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                currentRole === 'phc'
                  ? 'bg-sky-700 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              PHC
            </Link>
            <Link
              href="/dashboard/logistics"
              className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                currentRole === 'logistics'
                  ? 'bg-sky-700 text-white font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              Logistics
            </Link>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Operations & Tracking
            </div>
            <ul className="space-y-1">
              {primaryNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-2.5 py-2 text-xs font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                  >
                    <item.icon className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-sky-400 shrink-0" />
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-sky-900 text-sky-200 border border-sky-800">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Administration
            </div>
            <ul className="space-y-1">
              {secondaryNavItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex items-center px-2.5 py-2 text-xs font-medium rounded-md text-slate-300 hover:bg-slate-800 hover:text-white transition-colors group"
                  >
                    <item.icon className="w-4 h-4 mr-2.5 text-slate-400 group-hover:text-sky-400 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* User Session Footer Card */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-sky-400 shrink-0">
                SC
              </div>
              <div className="truncate">
                <div className="text-xs font-medium text-slate-200 truncate">
                  Personnel Session
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {roleBadge || 'Authorized User'}
                </div>
              </div>
            </div>
            <Link
              href="/login"
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Wrapper (offset by sidebar width on desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Mobile Top App Bar */}
        <div className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white border-b border-slate-200 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <span className="text-sm font-bold text-slate-900 truncate">
            {title}
          </span>

          <div className="flex items-center space-x-1">
            <Link
              href="/alerts"
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md focus:outline-none"
              aria-label="View alerts"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Reusable Dashboard Header */}
        <DashboardHeader
          title={title}
          description={description}
          roleBadge={roleBadge}
          breadcrumbs={breadcrumbs}
          systemStatus={systemStatus}
          lastUpdated={lastUpdated}
        >
          {headerActions}
        </DashboardHeader>

        {/* Dashboard Main Content Canvas */}
        <main
          id="main-content"
          role="main"
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
