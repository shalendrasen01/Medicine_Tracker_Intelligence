'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

interface AlertItem {
  id: string;
  code: string;
  title: string;
  category:
    | 'Medicine stock-out'
    | 'Low inventory'
    | 'Bed capacity'
    | 'Staff shortage'
    | 'Shipment delay'
    | 'Cold-chain warning'
    | 'Demand spike'
    | 'Facility operational issue';
  facility: string;
  district: string;
  resource: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Acknowledged' | 'Resolved';
  created: string;
  lastUpdated: string;
  recommendedResponse: string;
  assignedTo?: string;
}

export default function AlertsMonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Alerts & Outages' },
  ];

  // Static Demonstration Alerts Dataset
  const [alertsList, setAlertsList] = useState<AlertItem[]>([
    {
      id: 'ALT-CRIT-101',
      code: 'ALT-STK-001',
      title: 'Snake Antivenom Depleted Below Safety Minimum',
      category: 'Medicine stock-out',
      facility: 'PHC Junnar Rural',
      district: 'Pune',
      resource: 'Snake Antivenom (Polyvalent 10ml) • 8 Vials Left',
      severity: 'Critical',
      status: 'Open',
      created: '14 mins ago',
      lastUpdated: 'Just now',
      recommendedResponse: 'Emergency requisition required immediately. Reefer Van SHP-8812 en route from Central Warehouse.',
      assignedTo: 'Medical Officer Dr. Anita Patil',
    },
    {
      id: 'ALT-CRIT-102',
      code: 'ALT-CLD-004',
      title: 'Reefer Van Sensor Temperature Excursion (+7.8°C)',
      category: 'Cold-chain warning',
      facility: 'Transit Van MH-12-RN-5541 (SHP-8819)',
      district: 'Pune State Highway 52',
      resource: 'Rabies Vaccine (PVRV 2.5 IU) & Insulin Vials',
      severity: 'Critical',
      status: 'Acknowledged',
      created: '26 mins ago',
      lastUpdated: '8 mins ago',
      recommendedResponse: 'Instruct driver to check auxiliary cooling compressor; prepare emergency offload at Narayangaon chilling point.',
      assignedTo: 'Fleet Coordinator R. Jadhav',
    },
    {
      id: 'ALT-CRIT-103',
      code: 'ALT-BED-002',
      title: 'Maternal Emergency Ward at 100% Bed Capacity',
      category: 'Bed capacity',
      facility: 'PHC Ambegaon Central',
      district: 'Pune',
      resource: 'Maternity Stabilization Unit (8/8 Beds Occupied)',
      severity: 'Critical',
      status: 'Open',
      created: '42 mins ago',
      lastUpdated: '15 mins ago',
      recommendedResponse: 'Activate inter-facility diversion protocol to Manchar Community Health Centre (+14 km).',
      assignedTo: 'Staff Nurse In-Charge S. Kulkarni',
    },
    {
      id: 'ALT-CRIT-104',
      code: 'ALT-FAC-009',
      title: 'Grid Power Failure & Backup Diesel Generator Trip',
      category: 'Facility operational issue',
      facility: 'PHC Khed Rural',
      district: 'Pune',
      resource: 'Ice-Lined Refrigerator (ILR #1) & Emergency Lighting',
      severity: 'Critical',
      status: 'Acknowledged',
      created: '1 hr 05m ago',
      lastUpdated: '20 mins ago',
      recommendedResponse: 'District maintenance engineer on-site; solar inverter maintaining +3.9°C ILR holdover (7h remaining).',
      assignedTo: 'District Engineer M. Shinde',
    },
    {
      id: 'ALT-HIGH-201',
      code: 'ALT-STK-018',
      title: 'Oxytocin Injection Buffer Depleting (25 Ampoules Left)',
      category: 'Low inventory',
      facility: 'PHC Ambegaon Central',
      district: 'Pune',
      resource: 'Oxytocin 10 IU/ml Ampoules (1.2 Days Runway)',
      severity: 'High',
      status: 'Open',
      created: '35 mins ago',
      lastUpdated: '10 mins ago',
      recommendedResponse: 'Trigger lateral transfer of 40 ampoules from nearby PHC Junnar surplus holding.',
      assignedTo: 'Pharmacist V. Deshmukh',
    },
    {
      id: 'ALT-HIGH-202',
      code: 'ALT-SHP-007',
      title: 'Highway Waterlogging Causing Severe Transit Delay',
      category: 'Shipment delay',
      facility: 'State Highway 52 (Ghat Section)',
      district: 'Pune District',
      resource: 'Consignment SHP-2026-8819 (+55 mins delay)',
      severity: 'High',
      status: 'Acknowledged',
      created: '48 mins ago',
      lastUpdated: '12 mins ago',
      recommendedResponse: 'Automated detour calculated via Chakan-Narayangaon bypass; revised ETA broadcasted to receiving PHC.',
      assignedTo: 'Driver Vikas Jadhav',
    },
    {
      id: 'ALT-HIGH-203',
      code: 'ALT-STF-003',
      title: 'Staffing Shortage: Night Shift Pharmacist Unfilled',
      category: 'Staff shortage',
      facility: 'PHC Shirur North',
      district: 'Pune',
      resource: 'Emergency Dispensary Counter (20:00 - 08:00)',
      severity: 'High',
      status: 'Open',
      created: '1 hr 20m ago',
      lastUpdated: '45 mins ago',
      recommendedResponse: 'Request emergency pharmacist deployment from Baramati Sub-District pool roster.',
      assignedTo: 'Chief Medical Officer',
    },
    {
      id: 'ALT-HIGH-204',
      code: 'ALT-DEM-005',
      title: 'Unusual Outpatient Surge in Pediatric Antibiotic Demand',
      category: 'Demand spike',
      facility: 'PHC Shirur North',
      district: 'Pune',
      resource: 'Azithromycin 500mg Tablets (Consumption doubled)',
      severity: 'High',
      status: 'Acknowledged',
      created: '2 hrs 10m ago',
      lastUpdated: '1 hr ago',
      recommendedResponse: 'Model flags localized respiratory infection cluster; pre-approve emergency buffer replenishment.',
      assignedTo: 'Epidemiology Field Officer',
    },
    {
      id: 'ALT-MED-301',
      code: 'ALT-STK-029',
      title: 'Amoxicillin-Clavulanate Stock Approaching 4-Day Buffer',
      category: 'Low inventory',
      facility: 'PHC Khed Rural',
      district: 'Pune',
      resource: 'Amoxicillin-Clavulanate 625mg (480 / 1200 min)',
      severity: 'Medium',
      status: 'Open',
      created: '2 hrs 45m ago',
      lastUpdated: '1 hr 30m ago',
      recommendedResponse: 'Consignment included in tomorrow morning bulk district dispatch batch.',
      assignedTo: 'Storekeeper G. Pawar',
    },
    {
      id: 'ALT-MED-302',
      code: 'ALT-FAC-012',
      title: 'RO Water Filtration System Membrane Replacement Due',
      category: 'Facility operational issue',
      facility: 'PHC Daund South',
      district: 'Pune',
      resource: 'Facility Clean Water Treatment Unit #2',
      severity: 'Medium',
      status: 'Acknowledged',
      created: '3 hrs 15m ago',
      lastUpdated: '2 hrs ago',
      recommendedResponse: 'Service technician scheduled for preventive filter replacement during tomorrow afternoon maintenance window.',
      assignedTo: 'Facility Supervisor K. Joshi',
    },
    {
      id: 'ALT-MED-303',
      code: 'ALT-SHP-011',
      title: 'Bridge Maintenance Detour on Pune-Daund Interior Route',
      category: 'Shipment delay',
      facility: 'Pune-Daund Interior Route',
      district: 'Pune District',
      resource: 'Consignment SHP-2026-8830 (ORS & IV Fluids)',
      severity: 'Medium',
      status: 'Resolved',
      created: '4 hrs ago',
      lastUpdated: '35 mins ago',
      recommendedResponse: 'Transit vehicle cleared highway checkpost; successfully arrived at PHC Daund South.',
      assignedTo: 'Driver Mahesh Ghadge',
    },
    {
      id: 'ALT-LOW-401',
      code: 'ALT-CLD-009',
      title: 'Vaccine Refrigerator Door Open Sensor Warning (> 3m)',
      category: 'Cold-chain warning',
      facility: 'PHC Bhor West',
      district: 'Pune',
      resource: 'Main ILR Unit #1 (Door Seal Alarm)',
      severity: 'Low',
      status: 'Resolved',
      created: '5 hrs ago',
      lastUpdated: '4 hrs 40m ago',
      recommendedResponse: 'Staff inspected and properly shut refrigerator door; internal chamber temperature stabilized at +3.8°C.',
      assignedTo: 'Vaccine Cold-Chain Handler',
    },
    {
      id: 'ALT-LOW-402',
      code: 'ALT-STK-044',
      title: 'Salbutamol Respiratory Solution Buffer Health Check',
      category: 'Low inventory',
      facility: 'PHC Indapur East',
      district: 'Pune',
      resource: 'Salbutamol 5mg/ml 15ml Respules',
      severity: 'Low',
      status: 'Resolved',
      created: '6 hrs ago',
      lastUpdated: '5 hrs ago',
      recommendedResponse: 'Routine monthly warehouse replenishment delivered and checked into dispensary inventory register.',
      assignedTo: 'Dispensary Pharmacist',
    },
  ]);

  // Handle Action Controls (UI-only state updates for demonstration)
  const handleAcknowledgeAlert = (id: string) => {
    setAlertsList((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: 'Acknowledged', lastUpdated: 'Just now' } : alert
      )
    );
  };

  const handleResolveAlert = (id: string) => {
    setAlertsList((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, status: 'Resolved', lastUpdated: 'Just now' } : alert
      )
    );
  };

  // Filtered dataset
  const filteredAlerts = useMemo(() => {
    return alertsList.filter((alert) => {
      const matchesSearch =
        searchQuery === '' ||
        alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity =
        severityFilter === 'All' || alert.severity === severityFilter;

      const matchesCategory =
        categoryFilter === 'All' || alert.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'All' || alert.status === statusFilter;

      const matchesFacility =
        facilityFilter === 'All' || alert.facility.includes(facilityFilter);

      return (
        matchesSearch &&
        matchesSeverity &&
        matchesCategory &&
        matchesStatus &&
        matchesFacility
      );
    });
  }, [alertsList, searchQuery, severityFilter, categoryFilter, statusFilter, facilityFilter]);

  // Critical alerts for highlight section
  const criticalAlerts = useMemo(() => {
    return alertsList.filter((a) => a.severity === 'Critical');
  }, [alertsList]);

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSeverityFilter('All');
    setCategoryFilter('All');
    setStatusFilter('All');
    setFacilityFilter('All');
  };

  // Recent timeline events
  const timelineEvents = [
    {
      id: 'TL-01',
      time: '14:28',
      type: 'Alert Generated',
      title: 'Critical Stock Deficit Triggered',
      description: 'IoT inventory threshold sensor logged Snake Antivenom stock depletion (8 vials left) at PHC Junnar Rural.',
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    },
    {
      id: 'TL-02',
      time: '14:15',
      type: 'Alert Escalated',
      title: 'Cold-Chain Telemetry Incident Escalated',
      description: 'Reefer Van MH-12-RN-5541 sensor reported +7.8°C excursion; priority escalated to Fleet Operations Command.',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      id: 'TL-03',
      time: '13:50',
      type: 'Alert Acknowledged',
      title: 'Emergency Generator Fault Acknowledged',
      description: 'District technician M. Shinde acknowledged diesel generator trip at PHC Khed Rural; solar holdover engaged.',
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200',
    },
    {
      id: 'TL-04',
      time: '13:12',
      type: 'Alert Resolved',
      title: 'Shipment Detour Delay Cleared',
      description: 'Consignment SHP-2026-8830 successfully completed bypass route and safely delivered to PHC Daund South.',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'TL-05',
      time: '11:35',
      type: 'Alert Resolved',
      title: 'ILR Door Seal Alarm Normalized',
      description: 'Vaccine refrigerator door sealed at PHC Bhor West; internal sensor confirmed steady +3.8°C stability.',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
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
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
        Mute Non-Critical (Demo)
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Triage Emergency Transfers
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Alerts, Outages & Incident Command"
      description="Centralized real-time surveillance of pharmaceutical stockouts, cold-chain temperature excursions, facility bed capacities, staffing deficits, and transit delays."
      roleBadge="Incident Command • 24x7"
      currentRole="central"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="Telemetry Stream Live (Sync: 10s)"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Section 1: Alert KPI Summary Cards (5 Cards) */}
        <section aria-labelledby="alerts-kpi-heading">
          <h2 id="alerts-kpi-heading" className="sr-only">
            Incident Monitoring Key Performance Indicators
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* KPI 1: Critical Alerts */}
            <StatCard
              title="Critical Alerts"
              value="4"
              description="Immediate life/safety triage"
              trend={{
                value: "+1 in last 2h",
                direction: "up",
                isPositive: false,
                label: "Priority triage",
              }}
              badge="Action Required"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* KPI 2: High Priority Alerts */}
            <StatCard
              title="High Priority"
              value="9"
              description="Urgent logistics & deficits"
              trend={{
                value: "-3 resolved today",
                direction: "down",
                isPositive: true,
                label: "Active response",
              }}
              badge="High Risk"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* KPI 3: Unresolved Alerts */}
            <StatCard
              title="Unresolved Alerts"
              value="21"
              description="Open in dispatch queue"
              trend={{
                value: "7 acknowledged",
                direction: "neutral",
                label: "Under active review",
              }}
              badge="Active Queue"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              }
            />

            {/* KPI 4: Alerts Today */}
            <StatCard
              title="Alerts Today"
              value="38"
              description="Total automated triggers"
              trend={{
                value: "18m avg resolution",
                direction: "up",
                isPositive: true,
                label: "94.7% within SLA",
              }}
              badge="District Live"
              icon={
                <svg className="w-5 h-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
            />

            {/* KPI 5: Facilities Affected */}
            <StatCard
              title="Facilities Affected"
              value="8"
              description="Primary health centres"
              trend={{
                value: "8 of 12 reporting",
                direction: "down",
                isPositive: true,
                label: "Localized incidents",
              }}
              badge="8 PHCs"
              icon={
                <svg className="w-5 h-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 2: Critical Alerts Priority Callout */}
        <section aria-labelledby="critical-alerts-heading" className="bg-rose-50/70 border border-rose-200 rounded-lg p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-200/80">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-md bg-rose-600 text-white shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <div>
                <h2 id="critical-alerts-heading" className="text-sm font-bold text-rose-950">
                  Critical Incidents Requiring Immediate Command Intervention ({criticalAlerts.length})
                </h2>
                <p className="text-xs text-rose-700 mt-0.5">
                  High-severity incidents threatening cold-chain integrity, maternal care delivery, or emergency medicine availability.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-bold bg-rose-200 text-rose-900 border border-rose-300 self-start sm:self-auto">
              Sovereign SLA: Response &lt; 15 mins
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {criticalAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-4 rounded-md border border-rose-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                      {alert.id}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {alert.created}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-1.5 leading-snug">
                    {alert.title}
                  </h3>

                  <div className="text-[11px] text-slate-600 mt-1">
                    <p><strong className="text-slate-700">Facility:</strong> {alert.facility}</p>
                    <p><strong className="text-slate-700">Resource:</strong> {alert.resource}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-xs space-y-2">
                  <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200 text-slate-700">
                    <strong className="text-rose-800">Action:</strong> {alert.recommendedResponse}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
                        alert.status === 'Open'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      Status: {alert.status}
                    </span>

                    {alert.status === 'Open' && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="text-[11px] font-semibold text-sky-700 hover:text-sky-800 focus:outline-none"
                      >
                        Acknowledge &rarr;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Alert Filter Controls */}
        <section aria-labelledby="alert-filters-heading" className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h2 id="alert-filters-heading" className="sr-only">
            Alert Filters and Search
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <label htmlFor="alert-search" className="sr-only">
                Search Alerts
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="alert-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search alert title, resource, or clinic..."
                className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Severity Filter */}
            <div className="lg:col-span-2">
              <label htmlFor="severity-select" className="sr-only">
                Filter by Severity
              </label>
              <select
                id="severity-select"
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="lg:col-span-3">
              <label htmlFor="category-select" className="sr-only">
                Filter by Category
              </label>
              <select
                id="category-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="All">All Alert Categories</option>
                <option value="Medicine stock-out">Medicine stock-out</option>
                <option value="Low inventory">Low inventory</option>
                <option value="Cold-chain warning">Cold-chain warning</option>
                <option value="Bed capacity">Bed capacity</option>
                <option value="Staff shortage">Staff shortage</option>
                <option value="Shipment delay">Shipment delay</option>
                <option value="Demand spike">Demand spike</option>
                <option value="Facility operational issue">Facility operational issue</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="lg:col-span-2">
              <label htmlFor="status-select" className="sr-only">
                Filter by Status
              </label>
              <select
                id="status-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Acknowledged">Acknowledged</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            {/* Clear Button */}
            <div className="lg:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Displaying <strong className="text-slate-800">{filteredAlerts.length}</strong> of{' '}
              <strong className="text-slate-800">{alertsList.length}</strong> recorded incidents
            </span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                Open: {alertsList.filter((a) => a.status === 'Open').length}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
                Acknowledged: {alertsList.filter((a) => a.status === 'Acknowledged').length}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                Resolved: {alertsList.filter((a) => a.status === 'Resolved').length}
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Main Alerts Table / Feed */}
        <section aria-labelledby="alerts-table-heading" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
            <div>
              <h2 id="alerts-table-heading" className="text-base font-bold text-slate-900">
                Primary Incident & Telemetry Stream
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Comprehensive incident register with live severity triage, responder assignment, and audit timestamps.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Telemetry Stream Active
              </span>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Alert & ID</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Facility</th>
                  <th scope="col" className="px-4 py-3">Resource Affected</th>
                  <th scope="col" className="px-4 py-3">Severity</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Created</th>
                  <th scope="col" className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredAlerts.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                      No alerts match the specified filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredAlerts.map((alert) => (
                    <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Alert Title & Code */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-xs">
                          {alert.title}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {alert.id} &bull; {alert.code}
                        </div>
                      </td>

                      {/* Type / Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {alert.category}
                        </span>
                      </td>

                      {/* Facility */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{alert.facility}</div>
                        <div className="text-[11px] text-slate-500">{alert.district}</div>
                      </td>

                      {/* Resource Affected */}
                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-700">{alert.resource}</span>
                      </td>

                      {/* Severity */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                            alert.severity === 'Critical'
                              ? 'bg-rose-100 text-rose-800 border-rose-200'
                              : alert.severity === 'High'
                              ? 'bg-amber-100 text-amber-800 border-amber-200'
                              : alert.severity === 'Medium'
                              ? 'bg-sky-100 text-sky-800 border-sky-200'
                              : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                            alert.status === 'Open'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : alert.status === 'Acknowledged'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              alert.status === 'Open'
                                ? 'bg-rose-500'
                                : alert.status === 'Acknowledged'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          {alert.status}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-[11px]">
                        {alert.created}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {alert.status === 'Open' && (
                            <button
                              type="button"
                              onClick={() => handleAcknowledgeAlert(alert.id)}
                              className="px-2 py-1 text-[11px] font-semibold rounded text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors shadow-2xs"
                              title="Acknowledge alert"
                            >
                              Ack
                            </button>
                          )}

                          {alert.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => handleResolveAlert(alert.id)}
                              className="px-2 py-1 text-[11px] font-semibold rounded text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
                              title="Mark as resolved"
                            >
                              Resolve
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setSelectedAlert(alert)}
                            className="px-2 py-1 text-[11px] font-semibold rounded text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="p-4 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{alert.title}</h3>
                    <p className="text-[11px] text-slate-500">{alert.facility}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border shrink-0 ${
                      alert.severity === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : alert.severity === 'High'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-sky-100 text-sky-800 border-sky-200'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200/80">
                  <p><strong className="text-slate-900">Resource:</strong> {alert.resource}</p>
                  <p className="mt-1 text-[11px] text-slate-600"><strong className="text-sky-800">Response:</strong> {alert.recommendedResponse}</p>
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-400">Status: <strong className="text-slate-700">{alert.status}</strong></span>
                  <div className="flex items-center space-x-1.5">
                    {alert.status === 'Open' && (
                      <button
                        type="button"
                        onClick={() => handleAcknowledgeAlert(alert.id)}
                        className="px-2 py-1 text-[11px] font-semibold rounded text-amber-800 bg-amber-50 border border-amber-200"
                      >
                        Ack
                      </button>
                    )}
                    {alert.status !== 'Resolved' && (
                      <button
                        type="button"
                        onClick={() => handleResolveAlert(alert.id)}
                        className="px-2 py-1 text-[11px] font-semibold rounded text-emerald-800 bg-emerald-50 border border-emerald-200"
                      >
                        Resolve
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedAlert(alert)}
                      className="px-2 py-1 text-[11px] font-semibold rounded text-slate-700 bg-slate-100 border border-slate-300"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Modal Alert Detail Drawer (Conditional UI) */}
        {selectedAlert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-alert-title"
          >
            <div className="bg-white rounded-lg border border-slate-300 max-w-lg w-full p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {selectedAlert.id} &bull; {selectedAlert.code}
                  </span>
                  <h3 id="modal-alert-title" className="text-base font-bold text-slate-900 mt-0.5">
                    {selectedAlert.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedAlert(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                  aria-label="Close dialog"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Facility:</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.facility}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Category:</span>
                    <span className="font-semibold text-slate-800">{selectedAlert.category}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Severity:</span>
                    <span className="font-bold text-rose-700">{selectedAlert.severity}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Status:</span>
                    <span className="font-bold text-slate-900">{selectedAlert.status}</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Resource Involved:</span>
                  <span className="font-semibold text-slate-900">{selectedAlert.resource}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Recommended Response:</span>
                  <p className="text-slate-700 mt-1 leading-relaxed bg-amber-50/50 p-2.5 rounded border border-amber-200/60">
                    {selectedAlert.recommendedResponse}
                  </p>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">Assigned Personnel:</span>
                  <span className="text-slate-800 font-medium">{selectedAlert.assignedTo ?? 'Unassigned'}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <Link
                  href="/transfers"
                  className="inline-flex items-center text-xs font-semibold text-sky-700 hover:text-sky-800"
                >
                  Open Inter-PHC Transfers &rarr;
                </Link>

                <div className="flex items-center space-x-2">
                  {selectedAlert.status !== 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => {
                        handleResolveAlert(selectedAlert.id);
                        setSelectedAlert(null);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      Mark Resolved
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedAlert(null)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 6 & Section 7: Alert Activity Timeline & Severity Legend Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Section 6: Alert Activity Timeline (7 Cols) */}
          <section
            aria-labelledby="activity-timeline-heading"
            className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 id="activity-timeline-heading" className="text-base font-bold text-slate-900">
                    Incident Response & Audit Timeline
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live chronological event stream of alert generation, automated triage escalation, and supervisor handovers.
                  </p>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Live stream active" />
              </div>

              <div className="mt-4 space-y-4">
                {timelineEvents.map((evt) => (
                  <div key={evt.id} className="flex items-start space-x-3 text-xs">
                    <div className="font-mono text-[11px] text-slate-400 font-semibold w-10 shrink-0 pt-0.5">
                      {evt.time}
                    </div>
                    <div className="w-2 h-2 rounded-full bg-sky-600 mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 truncate">
                          {evt.title}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${evt.badgeClass}`}>
                          {evt.type}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed text-[11px]">
                        {evt.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">
                Audited against District Disaster Management Authority SLA (Standard: 15-minute emergency response).
              </span>
            </div>
          </section>

          {/* Section 7: Alert Severity Legend & Protocols (5 Cols) */}
          <section
            aria-labelledby="severity-legend-heading"
            className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="pb-4 border-b border-slate-100">
                <h2 id="severity-legend-heading" className="text-base font-bold text-slate-900">
                  Incident Severity Classification Protocol
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Standard Operating Procedures (SOP) governing triage tiers, escalation paths, and automated broadcast triggers.
                </p>
              </div>

              <div className="mt-4 space-y-3 text-xs">
                {/* Critical */}
                <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-rose-600 mr-1.5" />
                      Critical Tier-1 (Immediate Action)
                    </span>
                    <span className="text-[10px] font-bold text-rose-800">&lt; 15m SLA</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Immediate risk to patient life or irreversible loss. Includes &lt; 24h supply stockout, vaccine temperature breaches &gt; +8.0°C, and facility emergency power outage.
                  </p>
                </div>

                {/* High */}
                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-600 mr-1.5" />
                      High Priority (Urgent Triage)
                    </span>
                    <span className="text-[10px] font-bold text-amber-800">&lt; 1 hr SLA</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Sub-minimum buffer deficits (&lt; 72 hours), unexpected transit waterlogging or road closures, and acute clinic staffing shortages during active shifts.
                  </p>
                </div>

                {/* Medium */}
                <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-900 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-sky-600 mr-1.5" />
                      Medium Priority (Scheduled Queue)
                    </span>
                    <span className="text-[10px] font-bold text-sky-800">&lt; 4 hrs SLA</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Buffer depletion within 3-7 days, minor transit detours, and routine equipment maintenance requirements.
                  </p>
                </div>

                {/* Low */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-400 mr-1.5" />
                      Low Priority (Informational Log)
                    </span>
                    <span className="text-[10px] font-bold text-slate-600">24 hrs SLA</span>
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Door open sensor warnings subsequently normalized, routine inventory audits, and planned facility administrative check-ins.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">
                Complies with National Health Mission Incident Framework standards.
              </span>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
