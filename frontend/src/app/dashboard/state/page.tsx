import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatCard from '../../../components/dashboard/StatCard';

export default function StateAdminDashboardPage() {
  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Dashboards' },
    { label: 'State Admin' },
  ];

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Link
        href="/transfers"
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Approve Transfers (8)
      </Link>

      <Link
        href="/inventory"
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
        State Warehouse Reorder
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="State Health Supply & Allocation Directorate"
      description="District warehouse logistics, cold-chain compliance, emergency intra-state medicine transfers, and primary health centre stock health."
      roleBadge="State Admin (Tier-2)"
      currentRole="state"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="Just now (Sync: 30s)"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Section 1: 5 KPI Summary Cards */}
        <section aria-labelledby="state-kpi-heading">
          <h2 id="state-kpi-heading" className="sr-only">
            State Supply Chain Key Performance Indicators
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* KPI 1: Total PHCs in State */}
            <StatCard
              title="Total State PHCs"
              value="486"
              description="Across 12 health districts"
              trend={{
                value: "+4 new centres",
                direction: "up",
                isPositive: true,
                label: "Connected this month",
              }}
              badge="100% Monitored"
              icon={
                <svg className="w-5 h-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />

            {/* KPI 2: PHCs at Shortage Risk */}
            <StatCard
              title="PHCs at Shortage Risk"
              value="18"
              description="Stock reserves below 5 days"
              trend={{
                value: "-6 vs yesterday",
                direction: "down",
                isPositive: true,
                label: "Triage resolving",
              }}
              badge="Action Required"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* KPI 3: Pending Transfer Requests */}
            <StatCard
              title="Pending Transfers"
              value="29"
              description="14 inter-district, 15 intra-district"
              trend={{
                value: "8 require sign-off",
                direction: "neutral",
                label: "State coordinator queue",
              }}
              badge="Approval Queue"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              }
            />

            {/* KPI 4: Active Shipments */}
            <StatCard
              title="Active Shipments"
              value="42"
              description="State depot to district clinics"
              trend={{
                value: "97.6% on schedule",
                direction: "up",
                isPositive: true,
                label: "Transit timeliness",
              }}
              badge="In Transit"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />

            {/* KPI 5: Critical Alerts */}
            <StatCard
              title="Critical Alerts"
              value="7"
              description="2 temperature breaches, 5 deficits"
              trend={{
                value: "-3 in last 24h",
                direction: "down",
                isPositive: true,
                label: "Resolution progress",
              }}
              badge="Priority Feed"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 2: State Medicine Inventory Overview */}
        <section
          aria-labelledby="state-inventory-heading"
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 id="state-inventory-heading" className="text-base font-bold text-slate-900">
                State Medicine Inventory & PHC Distribution Health
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Centralized stock holding in State Medical Warehouse and affected local dispensaries.
              </p>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 self-start sm:self-auto inline-flex items-center"
            >
              Manage Inventory &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3">Medicine & Strength</th>
                  <th scope="col" className="px-4 py-3">Total Available Stock</th>
                  <th scope="col" className="px-4 py-3">PHCs Affected</th>
                  <th scope="col" className="px-4 py-3">Stock Status</th>
                  <th scope="col" className="px-5 py-3 text-right">State Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {/* Medicine 1 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Amoxicillin 500mg Capsules</div>
                    <div className="text-[11px] text-slate-400 font-normal">Primary Antibiotic • Oral Form</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">240,000 units</td>
                  <td className="px-4 py-3.5 text-slate-600">0 PHCs (Full Coverage)</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Healthy
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href="/transfers" className="text-xs font-medium text-sky-700 hover:text-sky-800">
                      Transfer Stock
                    </Link>
                  </td>
                </tr>

                {/* Medicine 2 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Anti-Rabies Vaccine (ARV) 0.5ml</div>
                    <div className="text-[11px] text-slate-400 font-normal">Biological Cold-Chain 2-8°C</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-rose-700">8,200 vials</td>
                  <td className="px-4 py-3.5 font-semibold text-rose-600">12 PHCs (Under 3-day supply)</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      Critical
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href="/transfers" className="text-xs font-semibold text-rose-700 hover:text-rose-800">
                      Emergency Push
                    </Link>
                  </td>
                </tr>

                {/* Medicine 3 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Paracetamol 500mg Tablets</div>
                    <div className="text-[11px] text-slate-400 font-normal">Antipyretic / Analgesic</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">680,000 tabs</td>
                  <td className="px-4 py-3.5 text-slate-600">0 PHCs (Buffer Intact)</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Healthy
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href="/transfers" className="text-xs font-medium text-slate-600 hover:text-slate-800">
                      Routine Quota
                    </Link>
                  </td>
                </tr>

                {/* Medicine 4 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Oxytocin Injection 10 IU/ml</div>
                    <div className="text-[11px] text-slate-400 font-normal">Maternal Emergency Delivery</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-amber-700">32,400 ampoules</td>
                  <td className="px-4 py-3.5 font-semibold text-amber-700">5 PHCs (Under 7-day reserve)</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Low Stock
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href="/transfers" className="text-xs font-medium text-sky-700 hover:text-sky-800">
                      Reallocate
                    </Link>
                  </td>
                </tr>

                {/* Medicine 5 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div>Oral Rehydration Salts (ORS) Sachets</div>
                    <div className="text-[11px] text-slate-400 font-normal">Standard 20.5g WHO Formulation</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">450,000 sachets</td>
                  <td className="px-4 py-3.5 text-slate-600">1 PHC (Reorder Logged)</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Healthy
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link href="/transfers" className="text-xs font-medium text-slate-600 hover:text-slate-800">
                      Standard
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: District/PHC Operational Overview */}
        <section
          aria-labelledby="district-operational-heading"
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 id="district-operational-heading" className="text-base font-bold text-slate-900">
                District Operational & PHC Shortage Breakdown
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Surveillance across primary healthcare centres grouped by administrative district.
              </p>
            </div>
            <span className="text-xs text-slate-500">12 Districts Active</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3">District Name</th>
                  <th scope="col" className="px-4 py-3">Total PHCs</th>
                  <th scope="col" className="px-4 py-3">Operational / At-Risk</th>
                  <th scope="col" className="px-4 py-3">Critical Shortages</th>
                  <th scope="col" className="px-4 py-3">Pending Requests</th>
                  <th scope="col" className="px-5 py-3 text-right">District Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {/* District 1 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">Pune Rural District</td>
                  <td className="px-4 py-3.5">54 PHCs</td>
                  <td className="px-4 py-3.5">
                    <span className="text-emerald-700 font-medium">52 Operational</span> / <span className="text-rose-600 font-medium">2 At-Risk</span>
                  </td>
                  <td className="px-4 py-3.5 text-rose-600 font-semibold">1 (ARV Vials)</td>
                  <td className="px-4 py-3.5">4 requests</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Normal
                    </span>
                  </td>
                </tr>

                {/* District 2 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">Nagpur Division</td>
                  <td className="px-4 py-3.5">48 PHCs</td>
                  <td className="px-4 py-3.5">
                    <span className="text-emerald-700 font-medium">43 Operational</span> / <span className="text-rose-600 font-medium">5 At-Risk</span>
                  </td>
                  <td className="px-4 py-3.5 text-rose-600 font-semibold">3 (Insulin, ARV)</td>
                  <td className="px-4 py-3.5">8 requests</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Elevated Risk
                    </span>
                  </td>
                </tr>

                {/* District 3 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">Nashik Tribal Belt</td>
                  <td className="px-4 py-3.5">42 PHCs</td>
                  <td className="px-4 py-3.5">
                    <span className="text-emerald-700 font-medium">36 Operational</span> / <span className="text-rose-600 font-medium">6 At-Risk</span>
                  </td>
                  <td className="px-4 py-3.5 text-rose-600 font-semibold">4 (Snake Venom, Oxytocin)</td>
                  <td className="px-4 py-3.5">9 requests</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                      High Priority
                    </span>
                  </td>
                </tr>

                {/* District 4 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">Thane Coastal Sector</td>
                  <td className="px-4 py-3.5">38 PHCs</td>
                  <td className="px-4 py-3.5">
                    <span className="text-emerald-700 font-medium">37 Operational</span> / <span className="text-rose-600 font-medium">1 At-Risk</span>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">0 critical</td>
                  <td className="px-4 py-3.5">2 requests</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Optimal
                    </span>
                  </td>
                </tr>

                {/* District 5 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-semibold text-slate-900">Aurangabad Marathwada</td>
                  <td className="px-4 py-3.5">46 PHCs</td>
                  <td className="px-4 py-3.5">
                    <span className="text-emerald-700 font-medium">42 Operational</span> / <span className="text-rose-600 font-medium">4 At-Risk</span>
                  </td>
                  <td className="px-4 py-3.5 text-rose-600 font-semibold">2 (Pediatric Drops)</td>
                  <td className="px-4 py-3.5">6 requests</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Elevated Risk
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: Resource Transfer Section */}
        <section
          aria-labelledby="resource-transfers-heading"
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 id="resource-transfers-heading" className="text-base font-bold text-slate-900">
                Inter-PHC Resource Transfer Authorization
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active rebalancing requests between primary health centres and district reserve caches.
              </p>
            </div>
            <Link
              href="/transfers"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 self-start sm:self-auto inline-flex items-center"
            >
              All 29 Transfer Logs &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3">Transfer ID</th>
                  <th scope="col" className="px-4 py-3">Source PHC / Depot</th>
                  <th scope="col" className="px-4 py-3">Destination PHC</th>
                  <th scope="col" className="px-4 py-3">Resource / Medicine</th>
                  <th scope="col" className="px-4 py-3">Quantity</th>
                  <th scope="col" className="px-4 py-3">Priority</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {/* Transfer 1 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-900">
                    TR-MH-841
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>District Central Depot</div>
                    <div className="text-[11px] text-slate-400">Pune Urban</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>PHC Junnar Hill</div>
                    <div className="text-[11px] text-slate-400">Pune Rural</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    Anti-Rabies Vaccine (ARV)
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    150 vials
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Emergency
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Approval
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 transition-colors"
                    >
                      Authorize
                    </Link>
                  </td>
                </tr>

                {/* Transfer 2 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-900">
                    TR-MH-839
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>PHC Baramati West</div>
                    <div className="text-[11px] text-slate-400">Surplus Stock</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>PHC Daund Junction</div>
                    <div className="text-[11px] text-slate-400">Stock Deficit</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    Oxytocin Injection 10 IU/ml
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    300 ampoules
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                      High
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                      In Transit (Reefer #14)
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/shipments"
                      className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                      Track Route
                    </Link>
                  </td>
                </tr>

                {/* Transfer 3 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-900">
                    TR-MH-834
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>State Medical Store</div>
                    <div className="text-[11px] text-slate-400">Nagpur Depot</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>PHC Igatpuri Valley</div>
                    <div className="text-[11px] text-slate-400">Nashik Belt</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    Polyvalent Snake Venom Antiserum
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    80 vials
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Emergency
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Dispatched
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/shipments"
                      className="text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      Manifest
                    </Link>
                  </td>
                </tr>

                {/* Transfer 4 */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-mono text-[11px] font-semibold text-slate-900">
                    TR-MH-827
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>PHC Alibaug Coast</div>
                    <div className="text-[11px] text-slate-400">Raigad District</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-800">
                    <div>PHC Roha Industrial</div>
                    <div className="text-[11px] text-slate-400">Raigad District</div>
                  </td>
                  <td className="px-4 py-3.5 font-medium text-slate-900">
                    Amoxicillin 500mg Capsules
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">
                    2,500 strips
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                      Normal
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      Pending Approval
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                      Review
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5 & 6: Critical Alerts (2 cols) + State Recent Events (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 5: Critical Alerts Section */}
          <section
            aria-labelledby="state-critical-alerts-heading"
            className="lg:col-span-2 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="state-critical-alerts-heading" className="text-base font-bold text-slate-900">
                    Critical State Supply & Cold-Chain Alerts
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Immediate telemetry excursions and inventory deficit thresholds.
                  </p>
                </div>
                <Link href="/alerts" className="text-xs font-semibold text-sky-700 hover:text-sky-800">
                  Open Alert Room &rarr;
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Alert 1 */}
                <div className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                        Critical Excursion
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Cold-Chain Temp Breach (+8.9°C)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">PHC Khed Rural (Pune)</span> • Medicine:{' '}
                      <span className="font-medium text-slate-800">Measles-Rubella Vaccine & ARV</span>
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Sensor ID: SENS-CC-9014 • Alert active for 22 minutes
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="text-[11px] text-slate-400">18m ago</span>
                    <Link
                      href="/alerts"
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800 inline-flex items-center"
                    >
                      Dispatch Technician &rarr;
                    </Link>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                        Severe Deficit
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Anti-Snake Venom Stockout (&lt;2 vials remaining)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">PHC Surgana (Nashik Belt)</span> • Medicine:{' '}
                      <span className="font-medium text-slate-800">Polyvalent ASV Vials</span>
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Daily incident load in monsoon sector exceeds safety cushion
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="text-[11px] text-slate-400">45m ago</span>
                    <Link
                      href="/transfers"
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800 inline-flex items-center"
                    >
                      Emergency Transfer &rarr;
                    </Link>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="p-4 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 uppercase tracking-wide">
                        Transit Delay
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Reefer Van #12 Breakdown on State Highway 4
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Nagpur to Wardha Route</span> • Resource:{' '}
                      <span className="font-medium text-slate-800">Insulin NPH Cold Batch (1,200 vials)</span>
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Auxiliary battery maintaining 4.1°C; backup vehicle dispatched
                    </div>
                  </div>
                  <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="text-[11px] text-slate-400">1h 10m ago</span>
                    <Link
                      href="/shipments"
                      className="text-xs font-semibold text-sky-700 hover:text-sky-800 inline-flex items-center"
                    >
                      Track Fleet &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <Link href="/alerts" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                View All System Alerts Across 12 Districts &rarr;
              </Link>
            </div>
          </section>

          {/* Section 6: State-Level Activity & Recent Events */}
          <section
            aria-labelledby="state-activity-heading"
            className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200">
                <h2 id="state-activity-heading" className="text-base font-bold text-slate-900">
                  Recent State Operations Log
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Audit trail of coordinator dispatches & approvals.
                </p>
              </div>

              <div className="p-4 space-y-4">
                {/* Event 1 */}
                <div className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-0 last:pb-0">
                  <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-emerald-700">Dispatch Verified</span>
                    <span>14m ago</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 mt-1">
                    Shipment #SH-8819 received at PHC Junnar
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Temperature logger logged at continuous 3.8°C. Cold-chain certified.
                  </p>
                </div>

                {/* Event 2 */}
                <div className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-0 last:pb-0">
                  <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-sky-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-sky-700">Transfer Approved</span>
                    <span>42m ago</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 mt-1">
                    Dr. Sharma approved TR-MH-839
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    300 ampoules Oxytocin shifted from Baramati to Daund.
                  </p>
                </div>

                {/* Event 3 */}
                <div className="relative pl-6 pb-2 border-l-2 border-slate-200 last:border-0 last:pb-0">
                  <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-indigo-700">Central Allotment</span>
                    <span>2h ago</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 mt-1">
                    National Depot allocated 15,000 ARV doses
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scheduled delivery to Pune Central Warehouse tomorrow morning.
                  </p>
                </div>

                {/* Event 4 */}
                <div className="relative pl-6 pb-0 border-l-2 border-transparent">
                  <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white" />
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-amber-700">Buffer Alert Resolved</span>
                    <span>3h 40m ago</span>
                  </div>
                  <p className="text-xs font-medium text-slate-900 mt-1">
                    PHC Alibaug restocked 5,000 ORS sachets
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    District inventory buffer restored to 45 days.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <span className="text-xs text-slate-500">
                Directorate Audit Session: Active & Synced
              </span>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
