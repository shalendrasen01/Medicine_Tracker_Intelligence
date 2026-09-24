import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatCard from '../../../components/dashboard/StatCard';

export default function CentralAdminDashboardPage() {
  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Dashboards' },
    { label: 'Central Admin' },
  ];

  const headerActions = (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <svg
          className="w-3.5 h-3.5 mr-1.5 text-slate-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export National Manifest
      </button>

      <Link
        href="/transfers"
        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <svg
          className="w-3.5 h-3.5 mr-1.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Initiate Rebalancing
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Central Administration & National Surveillance"
      description="Sovereign monitoring of national pharmaceutical reserves, cross-state allocations, cold-chain telemetry, and critical supply bottlenecks."
      roleBadge="Central Authority (Tier-1)"
      currentRole="central"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="3 mins ago (Sync Rate: 60s)"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Section 1-5: KPI Summary Cards */}
        <section aria-labelledby="national-kpi-heading">
          <h2 id="national-kpi-heading" className="sr-only">
            National Health Supply Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* KPI 1: Total PHCs Monitored */}
            <StatCard
              title="Monitored PHCs"
              value="2,840"
              description="Active across 28 states & UTs"
              trend={{
                value: "+24 this month",
                direction: "up",
                isPositive: true,
                label: "Facility onboarded",
              }}
              badge="99.4% Online"
              icon={
                <svg className="w-5 h-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />

            {/* KPI 2: Critical Medicine Shortages */}
            <StatCard
              title="Critical Shortages"
              value="14"
              description="Medicines below safety buffer"
              trend={{
                value: "-3 vs last week",
                direction: "down",
                isPositive: true,
                label: "Deficit reduced",
              }}
              badge="Urgent Action"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* KPI 3: Active Transfer Requests */}
            <StatCard
              title="Active Transfers"
              value="87"
              description="Inter-district & state transfers"
              trend={{
                value: "32 pending review",
                direction: "neutral",
                label: "Awaiting dispatch",
              }}
              badge="Transit Queue"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
            />

            {/* KPI 4: Active Shipments */}
            <StatCard
              title="Active Shipments"
              value="142"
              description="En route cold & general consignments"
              trend={{
                value: "98.8% on-time",
                direction: "up",
                isPositive: true,
                label: "Lead time target",
              }}
              badge="In Transit"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />

            {/* KPI 5: Overall System Alerts */}
            <StatCard
              title="System Alerts"
              value="23"
              description="4 critical, 11 moderate, 8 info"
              trend={{
                value: "5 resolved today",
                direction: "down",
                isPositive: true,
                label: "Resolution rate",
              }}
              badge="Telemetry Active"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 6: Medicine Inventory Overview */}
        <section
          aria-labelledby="inventory-overview-heading"
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 id="inventory-overview-heading" className="text-base font-bold text-slate-900">
                National Essential Drug Reserve Surveillance
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated stock levels, days of supply (DOS), and replenishment triggers across central warehouses.
              </p>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 self-start sm:self-auto inline-flex items-center"
            >
              Full Drug Catalog &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3">Medicine & Specification</th>
                  <th scope="col" className="px-4 py-3">Therapeutic Category</th>
                  <th scope="col" className="px-4 py-3">National Stock</th>
                  <th scope="col" className="px-4 py-3">Days of Supply (DOS)</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Allocation Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {/* Row 1 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Amoxicillin Clavulanate 625mg</div>
                    <div className="text-[11px] text-slate-400 font-normal">SKU: ANT-AMX-625 • Strip of 10</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">Antibacterial / Essential</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">1,420,000 units</td>
                  <td className="px-4 py-3.5 text-slate-700">64 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Normal Reserve
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                      Allocate
                    </Link>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Insulin Human Injection (NPH) 40 IU/ml</div>
                    <div className="text-[11px] text-slate-400 font-normal">SKU: HOR-INS-40 • Cold-Chain 2-8°C</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">Endocrine / Cold Biological</td>
                  <td className="px-4 py-3.5 font-semibold text-rose-700">182,500 vials</td>
                  <td className="px-4 py-3.5 text-rose-700 font-semibold">11 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      Critical Shortage
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800"
                    >
                      Expedite Order
                    </Link>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Anti-Rabies Vaccine (ARV) 0.5ml</div>
                    <div className="text-[11px] text-slate-400 font-normal">SKU: VAC-RBV-05 • Cold-Chain 2-8°C</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">Vaccine / Post-Exposure</td>
                  <td className="px-4 py-3.5 font-semibold text-amber-700">410,000 doses</td>
                  <td className="px-4 py-3.5 text-amber-700 font-semibold">22 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Buffer Depleting
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                      Rebalance
                    </Link>
                  </td>
                </tr>

                {/* Row 4 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Oxytocin Injection 10 IU/ml</div>
                    <div className="text-[11px] text-slate-400 font-normal">SKU: MAT-OXY-10 • Maternal Critical</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">Obstetric Emergency</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">890,000 ampoules</td>
                  <td className="px-4 py-3.5 text-slate-700">48 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Normal Reserve
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                      Allocate
                    </Link>
                  </td>
                </tr>

                {/* Row 5 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Oral Rehydration Salts (ORS) WHO 20.5g</div>
                    <div className="text-[11px] text-slate-400 font-normal">SKU: REH-ORS-20 • Sachet Pack</div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">Pediatric & General</td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">5,800,000 sachets</td>
                  <td className="px-4 py-3.5 text-slate-700">92 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      Surplus Stock
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 7 & 8: Regional Operational Grid + Critical Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 7: Regional/PHC Operational Overview (2 Cols) */}
          <section
            aria-labelledby="regional-operational-heading"
            className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="regional-operational-heading" className="text-base font-bold text-slate-900">
                    Regional Medical Hubs & PHC Network Performance
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Surveillance of 5 macro administrative zones governing primary healthcare clusters.
                  </p>
                </div>
                <Link
                  href="/map"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 inline-flex items-center"
                >
                  Live Map &rarr;
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider">
                    <tr>
                      <th scope="col" className="px-5 py-3">Administrative Zone</th>
                      <th scope="col" className="px-4 py-3">PHCs Monitored</th>
                      <th scope="col" className="px-4 py-3">Cold Chain</th>
                      <th scope="col" className="px-4 py-3">Avg Lead Time</th>
                      <th scope="col" className="px-4 py-3">Shortage Incidents</th>
                      <th scope="col" className="px-5 py-3 text-right">Zone Health</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {/* Zone 1 */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        <div>Northern Region</div>
                        <div className="text-[11px] text-slate-400">HQ: Lucknow / Delhi</div>
                      </td>
                      <td className="px-4 py-3">740 PHCs</td>
                      <td className="px-4 py-3 font-medium text-emerald-700">99.6%</td>
                      <td className="px-4 py-3">28 hrs</td>
                      <td className="px-4 py-3 text-rose-600 font-semibold">4</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Stable
                        </span>
                      </td>
                    </tr>

                    {/* Zone 2 */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        <div>Western Region</div>
                        <div className="text-[11px] text-slate-400">HQ: Pune / Ahmedabad</div>
                      </td>
                      <td className="px-4 py-3">610 PHCs</td>
                      <td className="px-4 py-3 font-medium text-emerald-700">99.2%</td>
                      <td className="px-4 py-3">32 hrs</td>
                      <td className="px-4 py-3 text-slate-700">2</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Stable
                        </span>
                      </td>
                    </tr>

                    {/* Zone 3 */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        <div>Southern Region</div>
                        <div className="text-[11px] text-slate-400">HQ: Bengaluru / Chennai</div>
                      </td>
                      <td className="px-4 py-3">680 PHCs</td>
                      <td className="px-4 py-3 font-medium text-emerald-700">99.8%</td>
                      <td className="px-4 py-3">24 hrs</td>
                      <td className="px-4 py-3 text-slate-700">1</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Optimal
                        </span>
                      </td>
                    </tr>

                    {/* Zone 4 */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        <div>Eastern Region</div>
                        <div className="text-[11px] text-slate-400">HQ: Kolkata / Bhubaneswar</div>
                      </td>
                      <td className="px-4 py-3">520 PHCs</td>
                      <td className="px-4 py-3 font-medium text-amber-700">97.8%</td>
                      <td className="px-4 py-3">46 hrs</td>
                      <td className="px-4 py-3 text-rose-600 font-semibold">5</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Watchlist
                        </span>
                      </td>
                    </tr>

                    {/* Zone 5 */}
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3 font-medium text-slate-900">
                        <div>North-Eastern Remote Hub</div>
                        <div className="text-[11px] text-slate-400">HQ: Guwahati</div>
                      </td>
                      <td className="px-4 py-3">290 PHCs</td>
                      <td className="px-4 py-3 font-medium text-amber-700">96.4%</td>
                      <td className="px-4 py-3">58 hrs</td>
                      <td className="px-4 py-3 text-rose-600 font-semibold">2</td>
                      <td className="px-5 py-3 text-right">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                          Intervention
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <span>National Coverage: 100% of designated rural and tribal primary health circles.</span>
              <Link href="/dashboard/state" className="font-semibold text-sky-700 hover:text-sky-800">
                Drilldown by State &rarr;
              </Link>
            </div>
          </section>

          {/* Section 8: Recent Critical Alerts Stream (1 Col) */}
          <section
            aria-labelledby="critical-alerts-heading"
            className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="critical-alerts-heading" className="text-base font-bold text-slate-900">
                    Live Surveillance Stream
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time breach and supply interruptions.
                  </p>
                </div>
                <Link
                  href="/alerts"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                >
                  All Alerts
                </Link>
              </div>

              <div className="p-4 space-y-3.5">
                {/* Alert 1 */}
                <div className="p-3 rounded-md border border-rose-200 bg-rose-50/40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                      Critical Excursion
                    </span>
                    <span className="text-[11px] text-slate-400">12m ago</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-2">
                    Cold-Chain Temp Breach (+9.1°C)
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Vaccine Storage Unit #2 at PHC Basti (UP). 350 doses of Measles-Rubella vaccine affected.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Facility ID: UP-BST-014</span>
                    <Link href="/alerts" className="font-semibold text-rose-700 hover:text-rose-800">
                      Triage Excursion &rarr;
                    </Link>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-3 rounded-md border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                      Stockout Projected
                    </span>
                    <span className="text-[11px] text-slate-400">42m ago</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-2">
                    Zero-Stock Predicted: Anti-Snake Venom
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Sundarbans Delta PHCs. Current consumption pace exhausts local reserves in under 48 hours.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Region: Eastern Hub</span>
                    <Link href="/transfers" className="font-semibold text-amber-800 hover:text-amber-900">
                      Dispatch Emergency Batch &rarr;
                    </Link>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="p-3 rounded-md border border-sky-200 bg-sky-50/40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 uppercase tracking-wide">
                      Transit Update
                    </span>
                    <span className="text-[11px] text-slate-400">1h 15m ago</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-2">
                    Re-routed Freight: Heavy Rainfall Alert
                  </h3>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                    Reefer Truck #TR-9940 re-routed via bypass NH-27. ETA adjusted by +3.5 hours.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Carrier: Central Express</span>
                    <Link href="/shipments" className="font-semibold text-sky-700 hover:text-sky-800">
                      Track Fleet &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 border-t border-slate-200 text-center">
              <Link
                href="/alerts"
                className="text-xs font-semibold text-slate-700 hover:text-slate-900"
              >
                View All System Incident Logs &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
