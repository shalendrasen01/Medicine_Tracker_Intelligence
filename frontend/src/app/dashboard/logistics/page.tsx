import Link from 'next/link';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import StatCard from '../../../components/dashboard/StatCard';

export default function LogisticsDashboardPage() {
  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Dashboards' },
    { label: 'Logistics Fleet' },
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
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        Dispatch Queue (16)
      </Link>

      <Link
        href="/shipments"
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
        New Dispatch Manifest
      </Link>
    </div>
  );

  // Active Shipments Data
  const activeShipments = [
    {
      id: 'SHP-2026-8812',
      source: 'Pune Central Warehouse',
      destination: 'PHC Junnar Rural',
      medicine: 'Snake Antivenom (Polyvalent)',
      category: 'Critical Antidote',
      quantity: '150 Vials',
      status: 'In Transit',
      statusType: 'in-transit',
      vehicle: 'Reefer Van MH-14-GH-2219',
      driver: 'Rajesh Kumar (M: +91 98230-11204)',
      temp: '+3.8°C',
      tempStatus: 'normal',
      eta: '14:30 (Today)',
      priority: 'Emergency',
      priorityColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'SHP-2026-8815',
      source: 'Baramati Sub-District Depot',
      destination: 'PHC Ambegaon Central',
      medicine: 'Oxytocin Injection 10 IU/ml',
      category: 'Maternal Emergency',
      quantity: '500 Ampoules',
      status: 'Out for Delivery',
      statusType: 'out-for-delivery',
      vehicle: 'Reefer Van MH-12-BQ-8831',
      driver: 'Suresh Shinde (M: +91 94220-44912)',
      temp: '+4.2°C',
      tempStatus: 'normal',
      eta: '13:15 (Today)',
      priority: 'High',
      priorityColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      id: 'SHP-2026-8819',
      source: 'Pune Regional Depot',
      destination: 'PHC Shirur North',
      medicine: 'Rabies Vaccine (PVRV 2.5 IU)',
      category: 'Vaccine / Cold Chain',
      quantity: '300 Doses',
      status: 'Delayed - Weather',
      statusType: 'delayed',
      vehicle: 'Reefer Truck MH-12-RN-5541',
      driver: 'Vikas Jadhav (M: +91 97650-88310)',
      temp: '+7.8°C',
      tempStatus: 'warning',
      eta: '16:45 (Delayed +55m)',
      priority: 'Emergency',
      priorityColor: 'bg-rose-100 text-rose-800 border-rose-200',
    },
    {
      id: 'SHP-2026-8824',
      source: 'State Reserve Depot (Aundh)',
      destination: 'PHC Khed Rural',
      medicine: 'Amoxicillin-Clavulanate 625mg',
      category: 'Essential Antibiotic',
      quantity: '2,400 Tablets',
      status: 'In Transit',
      statusType: 'in-transit',
      vehicle: 'Transit Carrier MH-14-DT-4019',
      driver: 'Anil Salve (M: +91 91580-22194)',
      temp: 'Ambient (21°C)',
      tempStatus: 'ambient',
      eta: '15:20 (Today)',
      priority: 'Standard',
      priorityColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'SHP-2026-8830',
      source: 'District Medical Store (Pune)',
      destination: 'PHC Daund South',
      medicine: 'Oral Rehydration Salts (ORS 20.5g)',
      category: 'Public Health Essential',
      quantity: '1,800 Sachets',
      status: 'Checkpoint Cleared',
      statusType: 'checkpoint',
      vehicle: 'Delivery Van MH-12-KA-7712',
      driver: 'Mahesh Ghadge (M: +91 98900-55410)',
      temp: 'Ambient (22°C)',
      tempStatus: 'ambient',
      eta: '17:00 (Today)',
      priority: 'Standard',
      priorityColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'SHP-2026-8833',
      source: 'Pune Central Warehouse',
      destination: 'PHC Indapur East',
      medicine: 'Human Regular Insulin 100 IU/ml',
      category: 'Cold-Chain Hormone',
      quantity: '220 Vials',
      status: 'In Transit',
      statusType: 'in-transit',
      vehicle: 'Reefer Van MH-14-EX-9023',
      driver: 'Prakash Pawar (M: +91 98220-33418)',
      temp: '+3.4°C',
      tempStatus: 'normal',
      eta: '15:50 (Today)',
      priority: 'High',
      priorityColor: 'bg-amber-100 text-amber-800 border-amber-200',
    },
  ];

  // Dispatch Queue Data
  const dispatchQueue = [
    {
      transferId: 'TRF-APP-9941',
      source: 'Pune Central Hub Dock 2',
      destination: 'PHC Shirur North',
      resource: 'Rabies Vaccine (PVRV 2.5 IU)',
      quantity: '200 Doses',
      readiness: 'Vehicle Assigned',
      readinessBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      priority: 'Critical',
      priorityBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      estDeparture: '13:30 (In 25m)',
      assignedVehicle: 'Reefer Van MH-12-CH-4410',
    },
    {
      transferId: 'TRF-APP-9945',
      source: 'Baramati Regional Dock 1',
      destination: 'PHC Bhor West',
      resource: 'Snake Antivenom Serum',
      quantity: '80 Vials',
      readiness: 'Packaging Ready',
      readinessBadge: 'bg-sky-50 text-sky-700 border-sky-200',
      priority: 'Critical',
      priorityBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      estDeparture: '14:00 (In 55m)',
      assignedVehicle: 'Reefer Van MH-14-JK-3091',
    },
    {
      transferId: 'TRF-APP-9949',
      source: 'Pune Central Hub Dock 4',
      destination: 'PHC Junnar Rural',
      resource: 'Normal Saline 0.9% 500ml',
      quantity: '600 Bottles',
      readiness: 'Driver Pending',
      readinessBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      priority: 'High',
      priorityBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      estDeparture: '14:45 (Staged)',
      assignedVehicle: 'Cargo Van MH-12-PQ-9082',
    },
    {
      transferId: 'TRF-APP-9952',
      source: 'State Depot Dock 3',
      destination: 'PHC Ambegaon Central',
      resource: 'Azithromycin 500mg Tablets',
      quantity: '1,500 Tablets',
      readiness: 'Cold-Chain Loading',
      readinessBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      priority: 'Standard',
      priorityBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      estDeparture: '15:15 (Staged)',
      assignedVehicle: 'Reefer Van MH-14-BT-1102',
    },
    {
      transferId: 'TRF-APP-9958',
      source: 'Pune Central Hub Dock 1',
      destination: 'PHC Velhe Tribal Unit',
      resource: 'Paracetamol Syrup 120mg/5ml',
      quantity: '450 Bottles',
      readiness: 'Documentation Review',
      readinessBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      priority: 'Standard',
      priorityBadge: 'bg-slate-100 text-slate-700 border-slate-200',
      estDeparture: '16:00 (Pending)',
      assignedVehicle: 'Transit Van MH-12-FF-2201',
    },
  ];

  // Logistics Alerts Data
  const logisticsAlerts = [
    {
      id: 'ALT-LOG-01',
      type: 'Cold-Chain Warning',
      severity: 'Critical',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      timestamp: '12 mins ago',
      shipmentId: 'SHP-2026-8819',
      message:
        'Reefer Van MH-12-RN-5541 sensor reported +7.8°C (allowed threshold +2°C to +8°C). Approaching upper limit.',
      action: 'Driver alerted to inspect thermostat and backup compressor immediately.',
      icon: (
        <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    {
      id: 'ALT-LOG-02',
      type: 'Transit Delay',
      severity: 'High',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      timestamp: '28 mins ago',
      shipmentId: 'SHP-2026-8819',
      message:
        'Heavy downpour and waterlogging reported near Khed-Ghat on State Highway 52. Transit halted temporarily.',
      action: 'Automated detour via Chakan-Narayangaon corridor calculated (+18 mins).',
      icon: (
        <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 'ALT-LOG-03',
      type: 'Route Detour',
      severity: 'Moderate',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-200',
      timestamp: '45 mins ago',
      shipmentId: 'SHP-2026-8830',
      message:
        'Bridge maintenance work on Pune-Daund interior bypass. Vehicle routed via National Highway 65.',
      action: 'Telemetry confirmed new route; revised ETA adjusted from 16:30 to 17:00.',
      icon: (
        <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      id: 'ALT-LOG-04',
      type: 'Delivery Exception Resolved',
      severity: 'Low',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      timestamp: '1 hr 10m ago',
      shipmentId: 'SHP-2026-8798',
      message:
        'Late evening arrival at PHC Khed Sub-centre. Pharmacist on-call received shipment with verified temperature log (+3.5°C).',
      action: 'Consignment marked delivered with digitally signed e-POD receipt.',
      icon: (
        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  // Recent Logistics Activity Data
  const recentActivities = [
    {
      id: 'ACT-01',
      title: 'Consignment Handover Confirmed',
      description: 'PHC Junnar Rural confirmed receipt of 150 vials Snake Antivenom (SHP-2026-8802). Temp history logged at +3.7°C.',
      time: '14:22',
      badge: 'Delivered',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      actor: 'Dr. Anita Patil (MO)',
    },
    {
      id: 'ACT-02',
      title: 'Emergency Dispatch Initiated',
      description: 'Reefer Van MH-14-EX-9023 departed Pune Central Hub carrying Insulin and Oxytocin for PHC Indapur East.',
      time: '13:48',
      badge: 'Dispatched',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
      actor: 'Dispatcher D. Gaikwad',
    },
    {
      id: 'ACT-03',
      title: 'Inter-Facility Transfer Approved',
      description: 'State Health Directorate approved emergency quota reallocation TRF-APP-9941 for 200 doses Rabies vaccine.',
      time: '13:15',
      badge: 'Approved',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      actor: 'State Director Office',
    },
    {
      id: 'ACT-04',
      title: 'Transit Delay Acknowledged',
      description: 'Driver Vikas Jadhav logged road waterlogging on SH-52. Central Command recalculated arrival window.',
      time: '12:50',
      badge: 'Delayed',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
      actor: 'Driver V. Jadhav',
    },
    {
      id: 'ACT-05',
      title: 'Pre-Trip Cold-Chain Inspection Passed',
      description: 'Vehicle MH-12-BQ-8831 completed 20-minute compressor pre-cooling test (+4.0°C certified).',
      time: '12:10',
      badge: 'Inspected',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      actor: 'Fleet Tech Team',
    },
  ];

  // Transit Corridors (Static Route Overview)
  const transitCorridors = [
    {
      corridor: 'Corridor Alpha (Northern Rural Highway)',
      source: 'Pune Central Hub',
      waypoint1: 'Chakan Industrial Toll',
      waypoint2: 'Manchar Checkpoint',
      destination: 'PHC Junnar Rural',
      distance: '82 km',
      estTime: '2h 15m',
      activeVans: '3 Vehicles En Route',
      progress: 72,
      status: 'Clear & Flowing',
      statusClass: 'bg-emerald-500',
    },
    {
      corridor: 'Corridor Beta (Ghat Emergency Link)',
      source: 'Pune District Depot',
      waypoint1: 'Rajgurunagar Toll',
      waypoint2: 'Khed Ghat Pass',
      destination: 'PHC Ambegaon Central',
      distance: '64 km',
      estTime: '2h 45m',
      activeVans: '2 Vehicles En Route',
      progress: 45,
      status: 'Caution: Wet Pavement',
      statusClass: 'bg-amber-500',
    },
    {
      corridor: 'Corridor Gamma (Eastern Agricultural Valley)',
      source: 'Baramati Sub-District Depot',
      waypoint1: 'Daund Junction Bridge',
      waypoint2: 'Shirur South Checkpost',
      destination: 'PHC Shirur North',
      distance: '95 km',
      estTime: '2h 30m',
      activeVans: '4 Vehicles En Route',
      progress: 88,
      status: 'Clear & Flowing',
      statusClass: 'bg-emerald-500',
    },
  ];

  return (
    <DashboardLayout
      title="Logistics Fleet & Medicine Transit Command"
      description="Real-time multi-tier transport coordination, cold-chain telemetry, dispatch scheduling, and inter-facility medicine rebalancing."
      roleBadge="Logistics Coordinator (Fleet Ops)"
      currentRole="logistics"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="Live Fleet Telemetry (Sync: 15s)"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Section 1: KPI Summary Cards (6 Cards) */}
        <section aria-labelledby="logistics-kpi-heading">
          <h2 id="logistics-kpi-heading" className="sr-only">
            Logistics Fleet Key Performance Indicators
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* KPI 1: Active Shipments */}
            <StatCard
              title="Active Shipments"
              value="42"
              description="Consignments in motion"
              trend={{
                value: "+8 today",
                direction: "up",
                isPositive: true,
                label: "Fleet load",
              }}
              badge="100% Tracked"
              icon={
                <svg className="w-5 h-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />

            {/* KPI 2: Pending Dispatches */}
            <StatCard
              title="Pending Dispatches"
              value="16"
              description="Approved in warehouse queue"
              trend={{
                value: "6 ready for load",
                direction: "neutral",
                label: "Staging bay",
              }}
              badge="Dock Queue"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />

            {/* KPI 3: In-Transit Shipments */}
            <StatCard
              title="In-Transit Units"
              value="28"
              description="Active highway runs"
              trend={{
                value: "19 cold-chain",
                direction: "up",
                isPositive: true,
                label: "Reefer fleet",
              }}
              badge="Live GPS"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />

            {/* KPI 4: Deliveries Due Today */}
            <StatCard
              title="Due Today"
              value="23"
              description="Scheduled before 20:00"
              trend={{
                value: "14 delivered",
                direction: "up",
                isPositive: true,
                label: "61% on schedule",
              }}
              badge="Target Today"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* KPI 5: Delayed Shipments */}
            <StatCard
              title="Delayed Shipments"
              value="3"
              description="Behind schedule > 45m"
              trend={{
                value: "-2 vs yesterday",
                direction: "down",
                isPositive: true,
                label: "Rerouting active",
              }}
              badge="Attention"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* KPI 6: Completed Deliveries */}
            <StatCard
              title="Completed (Week)"
              value="138"
              description="Fulfilled across district"
              trend={{
                value: "98.6% on-time",
                direction: "up",
                isPositive: true,
                label: "OTP confirmed",
              }}
              badge="Verified"
              icon={
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 2: Delivery Status Overview & Fleet Telemetry Bar */}
        <section
          aria-labelledby="delivery-status-heading"
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 id="delivery-status-heading" className="text-base font-bold text-slate-900">
                Delivery Status & Cold-Chain Integrity Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time breakdown of 42 active consignments and cold-chain compliance telemetry across Pune District.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                Reefer Fleet: 19/19 Active
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                Avg. Transit Time: 2h 08m
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                1 Cold Excursion Warning
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {/* Status Item 1: On-Time */}
            <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  On-Schedule
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  73.8%
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">31 Shipments</div>
                <div className="w-full bg-emerald-200/60 rounded-full h-2 mt-2">
                  <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '74%' }} />
                </div>
                <p className="text-[11px] text-emerald-700 mt-2">Estimated within ±10m of original ETA</p>
              </div>
            </div>

            {/* Status Item 2: In Transit */}
            <div className="p-4 rounded-lg bg-sky-50/50 border border-sky-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                  In Highway Transit
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-sky-100 text-sky-800">
                  28 Live GPS
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">28 Vehicles</div>
                <div className="w-full bg-sky-200/60 rounded-full h-2 mt-2">
                  <div className="bg-sky-600 h-2 rounded-full" style={{ width: '67%' }} />
                </div>
                <p className="text-[11px] text-sky-700 mt-2">Average distance to destination: 34 km</p>
              </div>
            </div>

            {/* Status Item 3: Delayed */}
            <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
                  Delayed Transit
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800">
                  7.1%
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">3 Shipments</div>
                <div className="w-full bg-rose-200/60 rounded-full h-2 mt-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '15%' }} />
                </div>
                <p className="text-[11px] text-rose-700 mt-2">Weather & roadwork detours in progress</p>
              </div>
            </div>

            {/* Status Item 4: Delivered */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Delivered Today
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-slate-200 text-slate-800">
                  14 Target Reached
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900">14 PHC Handover</div>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                  <div className="bg-slate-700 h-2 rounded-full" style={{ width: '61%' }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-2">9 remaining scheduled before evening shift</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Active Shipment Tracking (Primary Operations Table) */}
        <section aria-labelledby="active-shipments-heading" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <div className="flex items-center space-x-2">
                <h2 id="active-shipments-heading" className="text-base font-bold text-slate-900">
                  Active Highway Shipments & Cold-Chain Telemetry
                </h2>
                <span className="px-2 py-0.5 text-xs font-bold bg-sky-100 text-sky-800 rounded-full">
                  6 Highlighted Live
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time tracking of inter-facility pharmaceutical transports, live temp sensors, and estimated arrival windows.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Link
                href="/shipments"
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors flex items-center"
              >
                View Complete Fleet Manifest
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Shipment / ID</th>
                  <th scope="col" className="px-4 py-3">Source & Destination</th>
                  <th scope="col" className="px-4 py-3">Medicine & Quantity</th>
                  <th scope="col" className="px-4 py-3">Carrier / Temp</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">ETA</th>
                  <th scope="col" className="px-4 py-3 text-right">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeShipments.map((shp) => (
                  <tr key={shp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Shipment ID & Vehicle */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{shp.id}</div>
                      <div className="text-[11px] text-slate-500 flex items-center mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1" />
                        {shp.vehicle}
                      </div>
                    </td>

                    {/* Source & Destination */}
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900 text-xs truncate max-w-[200px]" title={shp.source}>
                        From: {shp.source}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]" title={shp.destination}>
                        To: <span className="font-semibold text-slate-700">{shp.destination}</span>
                      </div>
                    </td>

                    {/* Medicine & Quantity */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 truncate max-w-[200px]" title={shp.medicine}>
                        {shp.medicine}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        Qty: <span className="font-medium text-slate-700">{shp.quantity}</span> &bull; {shp.category}
                      </div>
                    </td>

                    {/* Carrier & Temp */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-700 text-xs font-medium">{shp.driver.split('(')[0]}</div>
                      <div className="mt-0.5 flex items-center">
                        <span
                          className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${
                            shp.tempStatus === 'warning'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse'
                              : shp.tempStatus === 'normal'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {shp.tempStatus === 'normal' && '❄ '}
                          {shp.temp}
                        </span>
                      </div>
                    </td>

                    {/* Transport Status */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${
                          shp.statusType === 'delayed'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : shp.statusType === 'out-for-delivery'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : shp.statusType === 'checkpoint'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-sky-50 text-sky-700 border-sky-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            shp.statusType === 'delayed'
                              ? 'bg-rose-500'
                              : shp.statusType === 'out-for-delivery'
                              ? 'bg-indigo-500'
                              : shp.statusType === 'checkpoint'
                              ? 'bg-amber-500'
                              : 'bg-sky-500'
                          }`}
                        />
                        {shp.status}
                      </span>
                    </td>

                    {/* ETA */}
                    <td className="px-4 py-3 whitespace-nowrap text-slate-800 font-medium">
                      {shp.eta}
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${shp.priorityColor}`}>
                        {shp.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y divide-slate-100 md:hidden">
            {activeShipments.map((shp) => (
              <div key={shp.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{shp.id}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${shp.priorityColor}`}>
                    {shp.priority}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800">{shp.medicine} &bull; {shp.quantity}</div>
                <div className="text-[11px] text-slate-600">
                  <p><span className="text-slate-400">From:</span> {shp.source}</p>
                  <p><span className="text-slate-400">To:</span> {shp.destination}</p>
                </div>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                  <span className="text-slate-500">{shp.vehicle}</span>
                  <span className="font-semibold text-sky-700">{shp.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 & Section 5: Dispatch Queue & Logistics Alerts (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Section 4: Dispatch Queue (7 Cols) */}
          <section
            aria-labelledby="dispatch-queue-heading"
            className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 id="dispatch-queue-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Approved Transfer Dispatch Queue
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                      5 Ready
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pre-cleared inter-PHC quotas awaiting loading, gate verification, and carrier departure.
                  </p>
                </div>
                <Link
                  href="/transfers"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center"
                >
                  Transfer Log
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {dispatchQueue.map((item) => (
                  <article key={item.transferId} className="p-4 hover:bg-slate-50/60 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          {item.transferId}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${item.priorityBadge}`}>
                          {item.priority}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border ${item.readinessBadge}`}>
                          {item.readiness}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-slate-600">
                        Departure: <span className="text-slate-900">{item.estDeparture}</span>
                      </span>
                    </div>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Consignment:</span>
                        <span className="font-semibold text-slate-800">{item.resource}</span>
                        <span className="text-slate-500 ml-1.5">({item.quantity})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Assigned Carrier:</span>
                        <span className="text-slate-700 font-medium">{item.assignedVehicle}</span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center text-[11px] text-slate-500 pt-1.5 border-t border-slate-50">
                      <span className="truncate">From: <strong className="text-slate-700">{item.source}</strong></span>
                      <span className="mx-2">&rarr;</span>
                      <span className="truncate">To: <strong className="text-slate-700">{item.destination}</strong></span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <Link
                href="/transfers"
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors"
              >
                Manage All 16 Staged Warehouse Requests &rarr;
              </Link>
            </div>
          </section>

          {/* Section 5: Logistics Alerts (5 Cols) */}
          <section
            aria-labelledby="logistics-alerts-heading"
            className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 id="logistics-alerts-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                    Logistics & Route Exceptions
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                      4 Active
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Critical route delays, temperature spikes, and cold-chain sensor notifications.
                  </p>
                </div>
                <Link
                  href="/alerts"
                  className="text-xs font-semibold text-sky-700 hover:text-sky-800 flex items-center"
                >
                  All Alerts
                  <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {logisticsAlerts.map((alert) => (
                  <article key={alert.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 mt-0.5">{alert.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {alert.type}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {alert.timestamp}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border ${alert.badgeColor}`}>
                            {alert.severity}
                          </span>
                          <span className="text-[11px] font-mono text-slate-600 font-semibold">
                            {alert.shipmentId}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                          {alert.message}
                        </p>

                        <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded border border-slate-200/60 text-slate-700">
                          <strong className="text-sky-800">Response Action:</strong> {alert.action}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <span className="text-xs text-slate-500">
                All transport exceptions broadcasted to Central & District control stations.
              </span>
            </div>
          </section>
        </div>

        {/* Section 6 & Section 7: Transit Corridors (Static Route Overview) & Recent Logistics Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Section 6: Transit Corridors (Static Route UI - 7 Cols) */}
          <section
            aria-labelledby="corridors-heading"
            className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 id="corridors-heading" className="text-base font-bold text-slate-900 flex items-center gap-2">
                  Active Transit Corridors & Transport Waypoints
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    3 Corridors Monitored
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Static schematic representation of primary supply-chain arterial routes connecting District Warehouses to Rural PHCs.
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-400 self-start sm:self-auto">
                No GPS Maps Needed
              </span>
            </div>

            <div className="mt-5 space-y-5">
              {transitCorridors.map((c, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-900">
                      {c.corridor}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[11px] font-semibold text-slate-600">
                        {c.distance} &bull; {c.estTime}
                      </span>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border border-slate-200">
                        {c.activeVans}
                      </span>
                    </div>
                  </div>

                  {/* Waypoint Schematic Line */}
                  <div className="py-2">
                    <div className="relative flex items-center justify-between text-[11px]">
                      {/* Background Bar */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                      {/* Active Progress Bar */}
                      <div
                        className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 z-0 ${c.statusClass}`}
                        style={{ width: `${c.progress}%` }}
                      />

                      {/* Waypoint 1: Source */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[9px] border-2 border-white shadow-xs">
                          A
                        </div>
                        <span className="mt-1 font-semibold text-slate-800 text-[10px] text-center max-w-[80px] leading-tight">
                          {c.source}
                        </span>
                      </div>

                      {/* Waypoint 2: Interim 1 */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-[8px] border-2 border-white shadow-xs">
                          •
                        </div>
                        <span className="mt-1 text-slate-500 text-[10px] text-center max-w-[90px] leading-tight">
                          {c.waypoint1}
                        </span>
                      </div>

                      {/* Waypoint 3: Interim 2 */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-sky-700 text-white flex items-center justify-center font-bold text-[8px] border-2 border-white shadow-xs">
                          •
                        </div>
                        <span className="mt-1 text-slate-500 text-[10px] text-center max-w-[90px] leading-tight">
                          {c.waypoint2}
                        </span>
                      </div>

                      {/* Waypoint 4: Destination */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[9px] border-2 border-white shadow-xs">
                          B
                        </div>
                        <span className="mt-1 font-semibold text-emerald-800 text-[10px] text-center max-w-[80px] leading-tight">
                          {c.destination}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-200/60">
                    <span className="text-slate-500">
                      Corridor Health: <strong className="text-slate-800">{c.status}</strong>
                    </span>
                    <span className="text-slate-500">
                      Transit Progress: <strong className="text-slate-900">{c.progress}%</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7: Recent Logistics Activity & Audit Feed (5 Cols) */}
          <section
            aria-labelledby="activity-heading"
            className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 id="activity-heading" className="text-base font-bold text-slate-900">
                    Recent Fleet Activity & Handover Audit
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Chronological verification log of dispatches, transit updates, and facility receipts.
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live stream active" />
              </div>

              <div className="mt-4 space-y-4">
                {recentActivities.map((act) => (
                  <div key={act.id} className="flex items-start space-x-3 text-xs">
                    <div className="font-mono text-[11px] text-slate-400 font-semibold w-10 shrink-0 pt-0.5">
                      {act.time}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 truncate">
                          {act.title}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${act.badgeClass}`}>
                          {act.badge}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-400 block mt-1">
                        Logged by: {act.actor}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <Link
                href="/alerts"
                className="text-xs font-semibold text-sky-700 hover:text-sky-800 transition-colors"
              >
                Inspect Full Cryptographic Handover Audit Trail &rarr;
              </Link>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
