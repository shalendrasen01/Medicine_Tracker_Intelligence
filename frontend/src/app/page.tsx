import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Government/Enterprise Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <span className="font-medium text-slate-200">National Health Supply Operations Portal</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Official Access Point</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Security Tier: Sovereign Level-3</span>
            <span>Support: +91 1800-MED-SUPPLY</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-xl shadow-inner">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                />
              </svg>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900 block leading-tight">
                Health Supply Chain
              </span>
              <span className="text-xs font-semibold tracking-wider text-sky-700 uppercase block">
                Intelligence Platform (HSCIP)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center text-xs text-slate-500 mr-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
              Operational Network Active
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-md text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Access Portal
              <svg
                className="w-4 h-4 ml-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-semibold uppercase tracking-wider mb-6">
                <span>Enterprise Logistics</span>
                <span>•</span>
                <span>Predictive Inventory</span>
                <span>•</span>
                <span>Cold Chain</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Intelligent Medicine Tracking & Distribution Network
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
                A unified surveillance and dispatch infrastructure connecting central procurement,
                state distribution hubs, and primary health centres to ensure zero-stockout healthcare delivery.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                >
                  Authorized Personnel Sign In
                  <svg
                    className="w-5 h-5 ml-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <a
                  href="#portal-roles"
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                >
                  View Role Portals
                </a>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-200 pt-8">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">99.8%</div>
                <div className="text-xs font-medium text-slate-600 mt-1 uppercase tracking-wide">
                  Cold-Chain Compliance
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">&lt; 48 Hrs</div>
                <div className="text-xs font-medium text-slate-600 mt-1 uppercase tracking-wide">
                  Transit Stock Turnaround
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">Zero Stockout</div>
                <div className="text-xs font-medium text-slate-600 mt-1 uppercase tracking-wide">
                  Predictive Alert Engine
                </div>
              </div>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-2xl font-bold text-slate-900">4-Tier</div>
                <div className="text-xs font-medium text-slate-600 mt-1 uppercase tracking-wide">
                  Autonomous Governance
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portals by Role Section */}
        <section id="portal-roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Departmental Operating Portals
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Role-based access tailored for state authorities, local clinics, and supply chain coordinators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Central Admin */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-md bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-semibold mb-4">
                  CA
                </div>
                <h3 className="text-base font-semibold text-slate-900">Central Admin</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  National inventory forecasting, central procurement allotments, policy compliance, and cross-state distribution oversight.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 inline-flex items-center"
                >
                  Central Access &rarr;
                </Link>
              </div>
            </div>

            {/* Card 2: State Admin */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center font-semibold mb-4">
                  SA
                </div>
                <h3 className="text-base font-semibold text-slate-900">State Admin</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Regional medical warehouses, inter-district transfers, emergency stock reserves, and district quota enforcement.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 inline-flex items-center"
                >
                  State Access &rarr;
                </Link>
              </div>
            </div>

            {/* Card 3: PHC Officer */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-md bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-semibold mb-4">
                  PHC
                </div>
                <h3 className="text-base font-semibold text-slate-900">PHC Administrator</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Local dispensary stock verification, daily medicine consumption logs, shelf-life monitoring, and stock indent requests.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 inline-flex items-center"
                >
                  PHC Access &rarr;
                </Link>
              </div>
            </div>

            {/* Card 4: Logistics Coordinator */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 transition-all shadow-sm">
              <div>
                <div className="w-10 h-10 rounded-md bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center font-semibold mb-4">
                  LC
                </div>
                <h3 className="text-base font-semibold text-slate-900">Logistics Coordinator</h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  Fleet dispatch tracking, cold-storage telemetry, transit routing optimization, and digital delivery verification.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 inline-flex items-center"
                >
                  Logistics Access &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Security & System Info Banner */}
        <section className="bg-slate-100 border-y border-slate-200 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 text-slate-700">
                <svg className="w-5 h-5 text-slate-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Restricted Access. All user sessions, queries, and dispatches are audited under governmental healthcare guidelines.
                </span>
              </div>
              <Link
                href="/login"
                className="text-xs font-semibold text-sky-800 bg-white border border-slate-300 px-3 py-1.5 rounded hover:bg-slate-50 transition-colors whitespace-nowrap"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Official Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Health Supply Chain Intelligence Platform. Public Health Sector Initiative.</p>
          <div className="flex space-x-6">
            <span>Security Guidelines</span>
            <span>Audit Protocol</span>
            <span>Help Desk</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
