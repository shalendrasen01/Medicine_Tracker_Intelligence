import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatCard from '../../../components/dashboard/StatCard';

export default function PHCAdminDashboardPage() {
  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Dashboards' },
    { label: 'PHC Junnar Rural' },
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New Medicine Indent
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Log Daily Dispensation
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Primary Health Centre - Junnar Rural"
      description="Facility ID: PHC-MH-PUN-042 • Pune District • 24x7 Maternal & Emergency Stabilization Centre."
      roleBadge="PHC Dispensary Unit"
      currentRole="phc"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="2 mins ago (Local Live Sync)"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Section 1: 6 KPI Cards */}
        <section aria-labelledby="phc-kpi-heading">
          <h2 id="phc-kpi-heading" className="sr-only">
            Primary Health Centre Operational Metrics
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* KPI 1: Total Medicine Items */}
            <StatCard
              title="Total Medicines"
              value="124"
              description="Cataloged EDL formulary"
              trend={{
                value: "100% compliant",
                direction: "neutral",
                label: "State formulary standard",
              }}
              badge="EDL Active"
              icon={
                <svg className="w-5 h-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              }
            />

            {/* KPI 2: Medicines in Low/Critical Stock */}
            <StatCard
              title="Stock Deficits"
              value="5"
              description="2 critical, 3 low stock"
              trend={{
                value: "-1 vs yesterday",
                direction: "down",
                isPositive: true,
                label: "Indent en route",
              }}
              badge="Action Required"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* KPI 3: Available Beds */}
            <StatCard
              title="Available Beds"
              value="6 / 18"
              description="66.7% occupancy rate"
              trend={{
                value: "2 discharges pending",
                direction: "up",
                isPositive: true,
                label: "Capacity easing",
              }}
              badge="Ward Status"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />

            {/* KPI 4: Today's Patient Count */}
            <StatCard
              title="Today's Patients"
              value="84"
              description="68 OPD • 16 Emergency"
              trend={{
                value: "+14% vs avg",
                direction: "up",
                label: "Monsoon fever surge",
              }}
              badge="High Intake"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />

            {/* KPI 5: Staff Available */}
            <StatCard
              title="Staff on Duty"
              value="11 / 14"
              description="78.6% roster present"
              trend={{
                value: "Roster complete",
                direction: "neutral",
                label: "Shift 1 active",
              }}
              badge="Duty Active"
              icon={
                <svg className="w-5 h-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />

            {/* KPI 6: Active Alerts */}
            <StatCard
              title="Active Alerts"
              value="3"
              description="1 critical, 2 moderate"
              trend={{
                value: "2 resolved today",
                direction: "down",
                isPositive: true,
                label: "Local technician response",
              }}
              badge="Local Triage"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 2: Medicine Inventory with Visual Critical Highlights */}
        <section
          aria-labelledby="phc-inventory-heading"
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 id="phc-inventory-heading" className="text-base font-bold text-slate-900">
                PHC Dispensary & Cold-Chain Medicine Stock
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                On-site inventory levels, safety thresholds, and days of stock remaining for this health centre.
              </p>
            </div>
            <Link
              href="/inventory"
              className="text-xs font-semibold text-sky-700 hover:text-sky-800 self-start sm:self-auto inline-flex items-center"
            >
              Full Dispensary Register &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3">Medicine & Specification</th>
                  <th scope="col" className="px-4 py-3">Current Stock</th>
                  <th scope="col" className="px-4 py-3">Safety Threshold</th>
                  <th scope="col" className="px-4 py-3">Days of Stock (DOS)</th>
                  <th scope="col" className="px-4 py-3">Stock Status</th>
                  <th scope="col" className="px-5 py-3 text-right">Dispensary Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                {/* Item 1: Critical Medicine with Red Highlighting */}
                <tr className="bg-rose-50/40 border-l-4 border-rose-500 hover:bg-rose-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">Polyvalent Anti-Snake Venom (ASV)</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-pulse" title="Immediate action required" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">Biological Cold-Chain 2-8°C • 10ml Lyophilized</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-rose-700">2 vials</td>
                  <td className="px-4 py-3.5 text-slate-600">10 vials min.</td>
                  <td className="px-4 py-3.5 font-bold text-rose-700">1.2 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      Critical Stock
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                    >
                      Urgent Indent
                    </Link>
                  </td>
                </tr>

                {/* Item 2: Critical Medicine with Red Highlighting */}
                <tr className="bg-rose-50/30 border-l-4 border-rose-500 hover:bg-rose-50/60 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-900">Anti-Rabies Vaccine (ARV) 0.5ml</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-600" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">Intramuscular / Intradermal • Refrigerator 4°C</div>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-rose-700">4 doses</td>
                  <td className="px-4 py-3.5 text-slate-600">15 doses min.</td>
                  <td className="px-4 py-3.5 font-bold text-rose-700">2.0 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      Critical Stock
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
                    >
                      Urgent Indent
                    </Link>
                  </td>
                </tr>

                {/* Item 3: Low Stock with Amber Highlighting */}
                <tr className="bg-amber-50/20 border-l-4 border-amber-400 hover:bg-amber-50/40 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div className="font-semibold text-slate-900">Oxytocin Injection 10 IU/ml</div>
                    <div className="text-[11px] text-slate-500 font-normal">Maternal Emergency Delivery • Cold-Chain 2-8°C</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-amber-700">18 ampoules</td>
                  <td className="px-4 py-3.5 text-slate-600">30 ampoules min.</td>
                  <td className="px-4 py-3.5 font-semibold text-amber-700">4.5 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200">
                      Low Stock
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/transfers"
                      className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                      Indent Buffer
                    </Link>
                  </td>
                </tr>

                {/* Item 4: Healthy */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div className="font-semibold text-slate-900">Amoxicillin 500mg Capsules</div>
                    <div className="text-[11px] text-slate-500 font-normal">Broad Spectrum Antibiotic • Strip of 10</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">850 capsules</td>
                  <td className="px-4 py-3.5 text-slate-600">300 capsules min.</td>
                  <td className="px-4 py-3.5 text-slate-700">18 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Healthy
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/inventory"
                      className="text-xs font-medium text-slate-600 hover:text-slate-800"
                    >
                      Details
                    </Link>
                  </td>
                </tr>

                {/* Item 5: Healthy */}
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-900">
                    <div className="font-semibold text-slate-900">Oral Rehydration Salts (ORS) 20.5g</div>
                    <div className="text-[11px] text-slate-500 font-normal">WHO Pediatric Rehydration • Sachets</div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-900">450 sachets</td>
                  <td className="px-4 py-3.5 text-slate-600">150 sachets min.</td>
                  <td className="px-4 py-3.5 text-slate-700">22 days</td>
                  <td className="px-4 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Healthy
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      href="/inventory"
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

        {/* Section 3 & 4: Bed Availability & Today's Patient Demand (Side-by-Side Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 3: Bed Availability */}
          <section
            aria-labelledby="bed-availability-heading"
            className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="bed-availability-heading" className="text-base font-bold text-slate-900">
                    Inpatient Bed Capacity & Ward Allocation
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time occupancy across designated PHC clinical wards.
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  66.7% Total Occupancy
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Total Stats Bar */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Total Beds</div>
                    <div className="text-xl font-bold text-slate-900 mt-0.5">18</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Occupied</div>
                    <div className="text-xl font-bold text-rose-600 mt-0.5">12</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Available</div>
                    <div className="text-xl font-bold text-emerald-600 mt-0.5">6</div>
                  </div>
                </div>

                {/* Overall Occupancy Visual Bar */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
                    <span>Overall Facility Occupancy</span>
                    <span>12 of 18 Beds (66.7%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex border border-slate-200">
                    <div className="bg-sky-700 h-full rounded-l-full" style={{ width: '66.7%' }} />
                    <div className="bg-slate-200 h-full flex-1" />
                  </div>
                </div>

                {/* Ward Breakdown */}
                <div className="space-y-3 pt-2">
                  {/* Ward 1: Maternity / Delivery */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-900">Maternity & Neonatal Ward</span>
                      <span className="text-rose-600 font-semibold">5 / 6 Occupied (1 Free)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '83.3%' }} />
                    </div>
                  </div>

                  {/* Ward 2: Emergency / Observation */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-900">Emergency & Observation Unit</span>
                      <span className="text-slate-600">2 / 4 Occupied (2 Free)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-sky-600 h-full rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>

                  {/* Ward 3: Female Inpatient Ward */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-900">Female General Ward</span>
                      <span className="text-slate-600">3 / 4 Occupied (1 Free)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '75%' }} />
                    </div>
                  </div>

                  {/* Ward 4: Male Inpatient Ward */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-900">Male General Ward</span>
                      <span className="text-emerald-700 font-semibold">2 / 4 Occupied (2 Free)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Next Expected Discharge: 14:00 (Post-natal ward)</span>
              <span className="text-slate-600 font-medium">Emergency reserve: Intact</span>
            </div>
          </section>

          {/* Section 4: Today's Patient Demand */}
          <section
            aria-labelledby="patient-demand-heading"
            className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="patient-demand-heading" className="text-base font-bold text-slate-900">
                    Today&apos;s Patient Demand & OPD Caseload
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live patient registrations and department caseload breakdown.
                  </p>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  84 Total Registrations
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Outpatient vs Emergency Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                    <div className="text-xs text-slate-500 font-medium">Outpatient (OPD)</div>
                    <div className="text-2xl font-bold text-slate-900 mt-1">68</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">General & specialized clinics</div>
                  </div>
                  <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/40">
                    <div className="text-xs text-rose-700 font-medium">Emergency & Labor</div>
                    <div className="text-2xl font-bold text-rose-800 mt-1">16</div>
                    <div className="text-[11px] text-rose-600 mt-0.5">3 snakebite, 4 labor, 9 acute</div>
                  </div>
                </div>

                {/* Caseload Breakdown with Visual Progress Bars */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Caseload by Therapeutic Department
                  </div>

                  {/* Dept 1 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-800">Fever & Respiratory Illness (OPD)</span>
                      <span>32 patients (38.1%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-sky-600 h-full rounded-full" style={{ width: '38.1%' }} />
                    </div>
                  </div>

                  {/* Dept 2 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-800">Maternal & Child Health (MCH)</span>
                      <span>22 patients (26.2%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: '26.2%' }} />
                    </div>
                  </div>

                  {/* Dept 3 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-800">Emergency, Trauma & Bites</span>
                      <span className="text-rose-600 font-semibold">16 patients (19.0%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: '19.0%' }} />
                    </div>
                  </div>

                  {/* Dept 4 */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 mb-1">
                      <span className="font-semibold text-slate-800">Non-Communicable Diseases (NCD)</span>
                      <span>14 patients (16.7%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden flex">
                      <div className="bg-teal-600 h-full rounded-full" style={{ width: '16.7%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Peak Intake Window: 09:30 - 12:30 IST</span>
              <span className="font-semibold text-sky-700">Dispensation counter: No queue backlog</span>
            </div>
          </section>
        </div>

        {/* Section 5: Staff Availability */}
        <section
          aria-labelledby="staff-availability-heading"
          className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 id="staff-availability-heading" className="text-base font-bold text-slate-900">
                Staff On-Duty Roster & Healthcare Personnel Availability
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Shift 1 (08:00 - 16:00 IST) staff headcount vs. sanctioned operational cadre.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
              11 of 14 Personnel Present (78.6%)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-slate-50/50">
            {/* Cadre 1: Medical Officers */}
            <div className="p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Medical Officers (Doctors)
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">2</span>
                  <span className="text-xs text-slate-500">/ 2 Sanctioned</span>
                </div>
                <div className="mt-1 text-xs text-emerald-700 font-medium">100% Present</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Dr. K. Patil (OPD), Dr. S. Rao (Emergency)
              </div>
            </div>

            {/* Cadre 2: Staff Nurses */}
            <div className="p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Staff Nurses (GNM / ANM)
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">4</span>
                  <span className="text-xs text-slate-500">/ 5 Sanctioned</span>
                </div>
                <div className="mt-1 text-xs text-amber-700 font-medium">1 on Leave (Sanctioned)</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Maternity: 2 • Emergency: 1 • General: 1
              </div>
            </div>

            {/* Cadre 3: Pharmacists */}
            <div className="p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Pharmacists
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">1</span>
                  <span className="text-xs text-slate-500">/ 1 Sanctioned</span>
                </div>
                <div className="mt-1 text-xs text-emerald-700 font-medium">100% Present</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Dispensation Counter & Cold-Log Active
              </div>
            </div>

            {/* Cadre 4: Laboratory Technicians */}
            <div className="p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Lab Technician
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">1</span>
                  <span className="text-xs text-slate-500">/ 1 Sanctioned</span>
                </div>
                <div className="mt-1 text-xs text-emerald-700 font-medium">100% Present</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Diagnostic Malaria/CBC Testing Active
              </div>
            </div>

            {/* Cadre 5: Support & ASHA Coordinator */}
            <div className="p-4 bg-white flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Support Staff & ASHA
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">3</span>
                  <span className="text-xs text-slate-500">/ 5 Sanctioned</span>
                </div>
                <div className="mt-1 text-xs text-amber-700 font-medium">2 on Field Survey</div>
              </div>
              <div className="mt-3 text-[11px] text-slate-500">
                Village Immunization Round in progress
              </div>
            </div>
          </div>
        </section>

        {/* Section 6: AI Prediction / Risk Section */}
        <section
          aria-labelledby="ai-prediction-heading"
          className="bg-white rounded-lg border border-sky-300 shadow-xs overflow-hidden"
        >
          <div className="px-5 py-4 bg-sky-50/70 border-b border-sky-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-2.5">
              <span className="w-8 h-8 rounded-md bg-sky-700 text-white flex items-center justify-center font-bold text-xs">
                AI
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="ai-prediction-heading" className="text-base font-bold text-slate-900">
                    Predictive Medicine Demand & Stockout Risk Engine
                  </h2>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-sky-200 text-sky-800 uppercase tracking-wide">
                    AI Forecast Active
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Algorithm combines local monsoon rainfall telemetry, 3-year epidemiological cycles, and current run-rate.
                </p>
              </div>
            </div>
            <span className="text-xs text-sky-800 font-medium self-start sm:self-auto">
              Confidence Score: 94.6%
            </span>
          </div>

          <div className="p-5 space-y-4">
            {/* Prediction 1: Critical High Risk */}
            <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                    92% Stockout Risk
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Anti-Snake Venom (ASV) Lyophilized
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  <span className="font-semibold text-slate-800">Forecasted Demand:</span> +35% surge over next 72 hours due to heavy rain in Junnar agricultural belt.{' '}
                  <span className="font-semibold text-rose-700">Expected Depletion:</span> Tomorrow by 18:00 IST (Current stock: 2 vials).
                </p>
                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Recommended AI Action:</span> Immediate emergency requisition of 20 vials from Pune Central Depot.
                </div>
              </div>
              <div className="shrink-0">
                <Link
                  href="/transfers"
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-xs"
                >
                  Confirm Requisition (20 Vials) &rarr;
                </Link>
              </div>
            </div>

            {/* Prediction 2: Moderate Risk */}
            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wide">
                    68% Stockout Risk
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Amoxicillin Pediatric Suspension 125mg
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  <span className="font-semibold text-slate-800">Forecasted Demand:</span> +25% consumption due to seasonal viral URTI in under-5 children.{' '}
                  <span className="font-semibold text-amber-800">Expected Depletion:</span> In 4.5 days (Current stock: 18 bottles).
                </p>
                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Recommended AI Action:</span> Schedule addition to standard Tuesday district supply manifest.
                </div>
              </div>
              <div className="shrink-0">
                <Link
                  href="/transfers"
                  className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Queue for Tuesday Dispatch
                </Link>
              </div>
            </div>

            {/* Prediction 3: Low Risk */}
            <div className="p-4 rounded-lg border border-emerald-200 bg-emerald-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                    4% Low Risk
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Oral Rehydration Salts (ORS) WHO Packets
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  <span className="font-semibold text-slate-800">Forecasted Demand:</span> Steady consumption. Current stock of 450 sachets provides safe 22-day runway.
                </p>
                <div className="text-xs text-slate-700">
                  <span className="font-semibold text-slate-900">Recommended AI Action:</span> No extraordinary requisition needed; maintain standard monthly indent.
                </div>
              </div>
              <div className="shrink-0">
                <span className="text-xs font-semibold text-emerald-700">
                  Buffer Healthy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 7 & 8: Resource Requests (Left) + Critical Alerts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section 7: Resource Request Section */}
          <section
            aria-labelledby="resource-requests-heading"
            className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="resource-requests-heading" className="text-base font-bold text-slate-900">
                    Outgoing Medicine & Equipment Indents
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Requisitions submitted by this PHC to District Warehouse.
                  </p>
                </div>
                <Link href="/transfers" className="text-xs font-semibold text-sky-700 hover:text-sky-800">
                  New Indent +
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Indent 1 */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-slate-900">IND-PHC-881</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                      Emergency
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    Polyvalent Anti-Snake Venom (ASV)
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Quantity: <strong className="text-slate-800">20 Vials</strong></span>
                    <span>Requested: Today, 08:30 IST</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center text-amber-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                      Pending District Sign-off
                    </span>
                    <Link href="/transfers" className="font-semibold text-sky-700 hover:text-sky-800">
                      Track Indent &rarr;
                    </Link>
                  </div>
                </div>

                {/* Indent 2 */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-slate-900">IND-PHC-879</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 uppercase tracking-wide">
                      High Priority
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    Anti-Rabies Vaccine (ARV) 0.5ml
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Quantity: <strong className="text-slate-800">50 Doses</strong></span>
                    <span>Requested: Yesterday, 16:40 IST</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center text-sky-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5" />
                      In Transit via Reefer #14 (ETA: 13:30)
                    </span>
                    <Link href="/shipments" className="font-semibold text-sky-700 hover:text-sky-800">
                      Track Van &rarr;
                    </Link>
                  </div>
                </div>

                {/* Indent 3 */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-semibold text-slate-900">IND-PHC-874</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 uppercase tracking-wide">
                      Routine
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    Oxytocin Injection & Syringe Kits
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>Quantity: <strong className="text-slate-800">100 Ampoules</strong></span>
                    <span>Requested: 2 days ago</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span className="inline-flex items-center text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                      Delivered & Stocked into Dispensary
                    </span>
                    <span className="text-slate-400">Batch #OXY-901</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <Link href="/transfers" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                View Past Indents & Dispensary Records &rarr;
              </Link>
            </div>
          </section>

          {/* Section 8: Critical Alerts Section */}
          <section
            aria-labelledby="phc-critical-alerts-heading"
            className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 id="phc-critical-alerts-heading" className="text-base font-bold text-slate-900">
                    Operational & Clinical Alerts
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time triggers for inventory, ward beds, and cold telemetry.
                  </p>
                </div>
                <Link href="/alerts" className="text-xs font-semibold text-sky-700 hover:text-sky-800">
                  Alert Log &rarr;
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {/* Alert 1: Medicine Shortage */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wide">
                        Critical Medicine
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Anti-Snake Venom Depletion
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">18m ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Only 2 vials remaining in refrigerator shelf #1. Daily consumption pace requires immediate top-up.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Threshold: 10 Vials</span>
                    <Link href="/transfers" className="font-semibold text-rose-700 hover:text-rose-800">
                      Emergency Reorder &rarr;
                    </Link>
                  </div>
                </div>

                {/* Alert 2: Bed Capacity Warning */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 uppercase tracking-wide">
                        Ward Capacity
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Maternity Ward at 83% Occupancy
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">45m ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    5 of 6 beds occupied. 2 active triage evaluations in labor room. Only 1 delivery cot free.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Observation Cot Available</span>
                    <span className="font-medium text-amber-700">Triage Alert Active</span>
                  </div>
                </div>

                {/* Alert 3: Staff Shortage / Night Shift Notice */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 uppercase tracking-wide">
                        Staff Roster
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Night Shift Nurse Handover Notice
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">2h ago</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Sister Sneha reporting for on-call emergency night shift. Relieving Staff Nurse Priya at 16:00.
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Roster #PHC-N-202</span>
                    <span className="text-emerald-700 font-medium">Replacement Confirmed</span>
                  </div>
                </div>

                {/* Alert 4: Cold Telemetry Status */}
                <div className="p-4 hover:bg-slate-50/70 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800 uppercase tracking-wide">
                        Cold Telemetry
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        Main Vaccine ILR Temp: 3.6°C
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Just now</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Solar inverter operating stably. Dual IoT temperature sensors report continuous safe storage window (2-8°C).
                  </p>
                  <div className="mt-2.5 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Sensor SENS-ILR-01</span>
                    <span className="text-emerald-700 font-semibold">100% Compliant</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <Link href="/alerts" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
                Open Full PHC Facility Telemetry &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
