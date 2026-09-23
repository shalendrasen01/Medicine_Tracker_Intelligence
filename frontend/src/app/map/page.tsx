'use client';

import { useState, useMemo } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

type FacilityStatus = 'Healthy' | 'Low Stock' | 'Critical' | 'Cold-Chain Alert';
type MedicineRisk = 'Low' | 'Medium' | 'High' | 'Critical';

interface Facility {
  id: string;
  name: string;
  district: string;
  taluka: string;
  status: FacilityStatus;
  medicineRisk: MedicineRisk;
  bedsAvailable: number;
  totalBeds: number;
  staffAvailable: boolean;
  activeShipment: string | null;
  activeTransfer: string | null;
  lastUpdated: string;
  coldChainStatus: 'Normal' | 'Warning' | 'Alert' | 'N/A';
  tempReading: string;
  criticalMedicines: string[];
}

interface ColdChainSite {
  id: string;
  facilityName: string;
  district: string;
  alertStatus: 'Normal' | 'Warning' | 'Alert';
  tempReading: string;
  targetRange: string;
  lastChecked: string;
  associatedShipment: string | null;
  recommendation: string;
}

const FACILITIES: Facility[] = [
  {
    id: 'F01',
    name: 'PHC Junnar Rural',
    district: 'Pune',
    taluka: 'Junnar',
    status: 'Healthy',
    medicineRisk: 'Low',
    bedsAvailable: 6,
    totalBeds: 10,
    staffAvailable: true,
    activeShipment: 'SHP-8815',
    activeTransfer: 'TRF-0902',
    lastUpdated: '4 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+3.8°C',
    criticalMedicines: [],
  },
  {
    id: 'F02',
    name: 'PHC Ambegaon Central',
    district: 'Pune',
    taluka: 'Ambegaon',
    status: 'Critical',
    medicineRisk: 'Critical',
    bedsAvailable: 0,
    totalBeds: 8,
    staffAvailable: true,
    activeShipment: 'SHP-8812',
    activeTransfer: 'TRF-0901',
    lastUpdated: '2 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+4.1°C',
    criticalMedicines: ['Snake Antivenom (0 vials)', 'Oxytocin (12 ampoules)'],
  },
  {
    id: 'F03',
    name: 'PHC Khed Rural',
    district: 'Pune',
    taluka: 'Khed',
    status: 'Healthy',
    medicineRisk: 'Low',
    bedsAvailable: 5,
    totalBeds: 8,
    staffAvailable: true,
    activeShipment: null,
    activeTransfer: null,
    lastUpdated: '9 mins ago',
    coldChainStatus: 'Warning',
    tempReading: '+7.4°C',
    criticalMedicines: [],
  },
  {
    id: 'F04',
    name: 'PHC Shirur Central',
    district: 'Pune',
    taluka: 'Shirur',
    status: 'Healthy',
    medicineRisk: 'Medium',
    bedsAvailable: 4,
    totalBeds: 10,
    staffAvailable: true,
    activeShipment: null,
    activeTransfer: 'TRF-0899',
    lastUpdated: '6 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+3.2°C',
    criticalMedicines: ['Oxytocin (low runway)'],
  },
  {
    id: 'F05',
    name: 'PHC Baramati North',
    district: 'Pune',
    taluka: 'Baramati',
    status: 'Healthy',
    medicineRisk: 'Low',
    bedsAvailable: 7,
    totalBeds: 10,
    staffAvailable: true,
    activeShipment: 'SHP-8819',
    activeTransfer: 'TRF-0895',
    lastUpdated: '11 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+3.9°C',
    criticalMedicines: [],
  },
  {
    id: 'F06',
    name: 'PHC Indapur Rural',
    district: 'Pune',
    taluka: 'Indapur',
    status: 'Low Stock',
    medicineRisk: 'High',
    bedsAvailable: 3,
    totalBeds: 8,
    staffAvailable: false,
    activeShipment: null,
    activeTransfer: 'TRF-0895',
    lastUpdated: '14 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+4.5°C',
    criticalMedicines: ['Amoxicillin Suspension (18 bottles)', 'Paracetamol Syrup (22 bottles)'],
  },
  {
    id: 'F07',
    name: 'PHC Bhor West',
    district: 'Pune',
    taluka: 'Bhor',
    status: 'Healthy',
    medicineRisk: 'Low',
    bedsAvailable: 5,
    totalBeds: 8,
    staffAvailable: true,
    activeShipment: null,
    activeTransfer: null,
    lastUpdated: '20 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+3.6°C',
    criticalMedicines: [],
  },
  {
    id: 'F08',
    name: 'PHC Haveli East',
    district: 'Pune',
    taluka: 'Haveli',
    status: 'Low Stock',
    medicineRisk: 'High',
    bedsAvailable: 4,
    totalBeds: 10,
    staffAvailable: true,
    activeShipment: 'SHP-8810',
    activeTransfer: 'TRF-0890',
    lastUpdated: '3 mins ago',
    coldChainStatus: 'Alert',
    tempReading: '+9.2°C',
    criticalMedicines: ['ORS Sachets (65 remaining)', 'Zinc 20mg (low)'],
  },
  {
    id: 'F09',
    name: 'PHC Daund South',
    district: 'Pune',
    taluka: 'Daund',
    status: 'Healthy',
    medicineRisk: 'Medium',
    bedsAvailable: 6,
    totalBeds: 10,
    staffAvailable: true,
    activeShipment: null,
    activeTransfer: null,
    lastUpdated: '18 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+4.0°C',
    criticalMedicines: ['Metformin (replenished yesterday)'],
  },
  {
    id: 'F10',
    name: 'Sub-store Chakan Regional',
    district: 'Pune',
    taluka: 'Khed (Chakan)',
    status: 'Healthy',
    medicineRisk: 'Low',
    bedsAvailable: 0,
    totalBeds: 0,
    staffAvailable: true,
    activeShipment: null,
    activeTransfer: null,
    lastUpdated: '30 mins ago',
    coldChainStatus: 'Normal',
    tempReading: '+3.5°C',
    criticalMedicines: [],
  },
];

// Map marker positions (approximate % positions in our CSS grid map)
const FACILITY_POSITIONS: Record<string, { x: number; y: number }> = {
  F01: { x: 35, y: 22 },
  F02: { x: 28, y: 32 },
  F03: { x: 48, y: 18 },
  F04: { x: 62, y: 28 },
  F05: { x: 55, y: 58 },
  F06: { x: 68, y: 65 },
  F07: { x: 22, y: 68 },
  F08: { x: 44, y: 44 },
  F09: { x: 72, y: 52 },
  F10: { x: 42, y: 30 },
};

const COLD_CHAIN_DATA: ColdChainSite[] = [
  {
    id: 'CC01',
    facilityName: 'PHC Haveli East',
    district: 'Pune',
    alertStatus: 'Alert',
    tempReading: '+9.2°C',
    targetRange: '+2°C to +8°C',
    lastChecked: '2 mins ago',
    associatedShipment: 'SHP-8810',
    recommendation: 'Immediate escalation to District Cold Chain Officer. Assess ILR backup status.',
  },
  {
    id: 'CC02',
    facilityName: 'PHC Khed Rural',
    district: 'Pune',
    alertStatus: 'Warning',
    tempReading: '+7.4°C',
    targetRange: '+2°C to +8°C',
    lastChecked: '9 mins ago',
    associatedShipment: null,
    recommendation: 'ILR door seal inspection required. Monitor for next 30 minutes.',
  },
  {
    id: 'CC03',
    facilityName: 'Reefer Van MH-14-GH-2219',
    district: 'En Route Pune',
    alertStatus: 'Normal',
    tempReading: '+3.8°C',
    targetRange: '+2°C to +8°C',
    lastChecked: '2 mins ago',
    associatedShipment: 'SHP-8812',
    recommendation: 'Cold-chain integrity maintained. No action required.',
  },
  {
    id: 'CC04',
    facilityName: 'Insulated Van MH-12-BQ-8831',
    district: 'En Route Pune',
    alertStatus: 'Normal',
    tempReading: '+4.2°C',
    targetRange: '+2°C to +8°C',
    lastChecked: '4 mins ago',
    associatedShipment: 'SHP-8815',
    recommendation: 'Cold-chain integrity maintained. No action required.',
  },
];

export default function FacilityMapPage() {
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(FACILITIES[1]); // Default to Critical one
  const [districtFilter, setDistrictFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [shipmentFilter, setShipmentFilter] = useState('All');

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Facility & Supply Chain Map' },
  ];

  // KPI calculations
  const kpis = useMemo(() => {
    const total = FACILITIES.filter((f) => f.totalBeds > 0).length; // PHCs only (not sub-stores)
    const healthy = FACILITIES.filter((f) => f.status === 'Healthy').length;
    const atRisk = FACILITIES.filter((f) => f.status === 'Low Stock').length;
    const critical = FACILITIES.filter((f) => f.status === 'Critical').length;
    const activeShipments = FACILITIES.filter((f) => f.activeShipment !== null).length;
    return { total, healthy, atRisk, critical, activeShipments };
  }, []);

  const filteredFacilities = useMemo(() => {
    return FACILITIES.filter((f) => {
      const matchDistrict = districtFilter === 'All' || f.district === districtFilter;
      const matchStatus = statusFilter === 'All' || f.status === statusFilter;
      const matchRisk = riskFilter === 'All' || f.medicineRisk === riskFilter;
      const matchShipment =
        shipmentFilter === 'All' ||
        (shipmentFilter === 'Active' && f.activeShipment !== null) ||
        (shipmentFilter === 'None' && f.activeShipment === null);
      return matchDistrict && matchStatus && matchRisk && matchShipment;
    });
  }, [districtFilter, statusFilter, riskFilter, shipmentFilter]);

  const handleClearFilters = () => {
    setDistrictFilter('All');
    setStatusFilter('All');
    setRiskFilter('All');
    setShipmentFilter('All');
  };

  const getStatusColor = (status: FacilityStatus) => {
    switch (status) {
      case 'Healthy':
        return 'bg-emerald-500';
      case 'Low Stock':
        return 'bg-amber-500';
      case 'Critical':
        return 'bg-rose-600';
      case 'Cold-Chain Alert':
        return 'bg-purple-600';
    }
  };

  const getStatusBadge = (status: FacilityStatus) => {
    switch (status) {
      case 'Healthy':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Healthy
          </span>
        );
      case 'Low Stock':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Low Stock
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>Critical
          </span>
        );
      case 'Cold-Chain Alert':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>Cold-Chain Alert
          </span>
        );
    }
  };

  const getRiskBadge = (risk: MedicineRisk) => {
    switch (risk) {
      case 'Low':
        return <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">Low Risk</span>;
      case 'Medium':
        return <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Medium Risk</span>;
      case 'High':
        return <span className="text-[11px] font-medium text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded">High Risk</span>;
      case 'Critical':
        return <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">Critical Risk</span>;
    }
  };

  const headerActions = (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>10 Facilities Monitored · Live</span>
      </div>
      <button
        onClick={() => {}}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
      >
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Report
      </button>
    </div>
  );

  return (
    <DashboardLayout
      title="Facility & Supply Chain Map"
      description="Geographic visibility of PHC locations, inventory risk zones, active shipment routes, cold-chain status, and facility operational health across the district network."
      roleBadge="District Health Monitoring"
      currentRole="central"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="Live Telemetry Sync"
      headerActions={headerActions}
    >
      <div className="space-y-5">

        {/* 1. KPI Cards */}
        <section aria-labelledby="map-kpi-heading">
          <h2 id="map-kpi-heading" className="sr-only">Facility Network Key Metrics</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <StatCard
              title="Total PHCs"
              value={kpis.total + 1}
              description="Active healthcare facilities"
              icon={
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
            <StatCard
              title="Healthy Facilities"
              value={kpis.healthy}
              description="Operating within SLA norms"
              trend={{ value: '70%', direction: 'up', isPositive: true, label: 'of network' }}
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="At-Risk Facilities"
              value={kpis.atRisk}
              description="Low stock or monitoring alert"
              badge="Needs Review"
              trend={{ value: '2', direction: 'neutral' }}
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />
            <StatCard
              title="Critical Facilities"
              value={kpis.critical}
              description="Immediate intervention needed"
              badge="Emergency"
              trend={{ value: 'Stockout Active', direction: 'down', isPositive: false }}
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Active Shipments"
              value={kpis.activeShipments}
              description="Consignments with live ETAs"
              trend={{ value: 'On Schedule', direction: 'up', isPositive: true }}
              icon={
                <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              }
            />
          </div>
        </section>

        {/* 2. Map Filters */}
        <section aria-labelledby="map-filters-heading" className="bg-white rounded-xl border border-slate-200 shadow-sm p-3.5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="map-filters-heading" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mr-1">
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Map
            </h2>

            <div className="flex flex-wrap gap-2 flex-1">
              <div>
                <label htmlFor="district-filter" className="sr-only">District</label>
                <select
                  id="district-filter"
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Districts</option>
                  <option value="Pune">Pune</option>
                </select>
              </div>

              <div>
                <label htmlFor="status-filter" className="sr-only">Facility Status</label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Statuses</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Critical">Critical</option>
                  <option value="Cold-Chain Alert">Cold-Chain Alert</option>
                </select>
              </div>

              <div>
                <label htmlFor="risk-filter" className="sr-only">Medicine Risk</label>
                <select
                  id="risk-filter"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Low">Low Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Critical">Critical Risk</option>
                </select>
              </div>

              <div>
                <label htmlFor="shipment-filter" className="sr-only">Shipment Status</label>
                <select
                  id="shipment-filter"
                  value={shipmentFilter}
                  onChange={(e) => setShipmentFilter(e.target.value)}
                  className="px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Shipments</option>
                  <option value="Active">Active Shipment</option>
                  <option value="None">No Active Shipment</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                <strong className="text-slate-800">{filteredFacilities.length}</strong> / {FACILITIES.length} facilities
              </span>
              {(districtFilter !== 'All' || statusFilter !== 'All' || riskFilter !== 'All' || shipmentFilter !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3. Main Map + Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* CSS MAP PANEL (2 columns wide on desktop) */}
          <section
            aria-labelledby="map-panel-heading"
            className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 id="map-panel-heading" className="text-sm font-bold text-slate-900">
                  Pune District Healthcare Facility Network
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click a facility marker to view detailed operational status
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Monitoring
              </div>
            </div>

            {/* Map Visual Area */}
            <div
              className="relative w-full overflow-hidden"
              style={{ height: '480px', background: 'linear-gradient(135deg, #e8f4f0 0%, #d4e8f7 25%, #e8f0f4 50%, #ddeee8 75%, #e0eaf5 100%)' }}
              role="img"
              aria-label="Geographic map of Pune district showing PHC facility locations and status"
            >
              {/* Grid overlay to simulate map texture */}
              <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#map-grid)" />
              </svg>

              {/* Decorative road/river lines */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Main highway lines */}
                <path d="M 5% 50% Q 30% 35% 60% 45% T 95% 55%" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="0" opacity="0.4"/>
                <path d="M 20% 10% Q 40% 40% 50% 80% T 60% 95%" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="0" opacity="0.35"/>
                <path d="M 0% 70% Q 35% 65% 65% 70% T 100% 60%" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.3"/>
                {/* River/water feature */}
                <path d="M 15% 20% Q 35% 30% 55% 25% T 85% 35%" fill="none" stroke="#7dd3fc" strokeWidth="3" opacity="0.45"/>
                {/* Secondary roads */}
                <path d="M 30% 5% L 28% 70%" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,5" opacity="0.4"/>
                <path d="M 65% 15% L 70% 85%" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,5" opacity="0.4"/>
                <path d="M 5% 35% L 95% 40%" fill="none" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3,5" opacity="0.3"/>
              </svg>

              {/* Topographic shading blocks for visual realism */}
              <div className="absolute inset-0 opacity-8">
                <div className="absolute rounded-full blur-3xl" style={{ top: '10%', left: '20%', width: '180px', height: '120px', background: 'rgba(134,239,172,0.2)' }}></div>
                <div className="absolute rounded-full blur-3xl" style={{ top: '55%', left: '55%', width: '200px', height: '140px', background: 'rgba(147,197,253,0.2)' }}></div>
                <div className="absolute rounded-full blur-3xl" style={{ top: '30%', left: '60%', width: '150px', height: '100px', background: 'rgba(167,243,208,0.15)' }}></div>
              </div>

              {/* District Label */}
              <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/80 text-xs font-bold text-slate-700 shadow-sm">
                🗺 Pune District, Maharashtra
              </div>

              {/* Scale indicator */}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200/80 text-[10px] font-medium text-slate-600 shadow-sm flex items-center gap-1.5">
                <div className="w-8 h-0.5 bg-slate-600"></div>
                ~25 km
              </div>

              {/* Compass */}
              <div className="absolute bottom-10 right-4 w-8 h-8 bg-white/80 rounded-full border border-slate-200 flex items-center justify-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-700">N</span>
              </div>

              {/* Facility Markers */}
              {filteredFacilities.map((facility) => {
                const pos = FACILITY_POSITIONS[facility.id];
                if (!pos) return null;
                const isSelected = selectedFacility?.id === facility.id;
                const markerColor =
                  facility.status === 'Critical'
                    ? 'bg-rose-600 border-rose-300 shadow-rose-300'
                    : facility.status === 'Low Stock'
                    ? 'bg-amber-500 border-amber-300 shadow-amber-200'
                    : facility.coldChainStatus === 'Alert'
                    ? 'bg-purple-600 border-purple-300 shadow-purple-200'
                    : 'bg-emerald-500 border-emerald-300 shadow-emerald-200';

                return (
                  <button
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility)}
                    title={`${facility.name} — ${facility.status}`}
                    aria-label={`Select ${facility.name}, status: ${facility.status}`}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10 focus:outline-none focus:ring-2 focus:ring-sky-500 rounded-full"
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    {/* Outer pulse ring for critical/active */}
                    {(facility.status === 'Critical' || facility.activeShipment) && (
                      <span className={`absolute inline-flex rounded-full h-8 w-8 -top-1 -left-1 opacity-40 animate-ping ${facility.status === 'Critical' ? 'bg-rose-500' : 'bg-sky-400'}`}></span>
                    )}

                    {/* Marker dot */}
                    <div
                      className={`w-6 h-6 rounded-full border-2 shadow-lg flex items-center justify-center transition-transform group-hover:scale-125 ${markerColor} ${isSelected ? 'scale-125 ring-2 ring-white ring-offset-1' : ''}`}
                    >
                      {facility.activeShipment && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h1.05A2.5 2.5 0 0117 9.34V15a1 1 0 01-1 1h-.05a2.5 2.5 0 01-4.9 0H11V7h3z"/>
                        </svg>
                      )}
                    </div>

                    {/* Tooltip label */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900/90 text-white text-[10px] font-semibold rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg z-20">
                      {facility.name}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900/90"></div>
                    </div>
                  </button>
                );
              })}

              {/* Map Legend */}
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200/80 p-3 shadow-sm">
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-2">Legend</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-700">
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-emerald-300 shrink-0"></span>
                    Healthy
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-700">
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-500 border border-amber-300 shrink-0"></span>
                    Low Stock
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-700">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-rose-300 shrink-0 animate-pulse"></span>
                    Critical
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-700">
                    <span className="w-3.5 h-3.5 rounded-full bg-purple-600 border border-purple-300 shrink-0"></span>
                    Cold-Chain Alert
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-700">
                    <svg className="w-3.5 h-3.5 text-sky-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                    </svg>
                    Shipment In Transit
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Facility Sidebar */}
          <section
            aria-labelledby="facility-sidebar-heading"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden"
          >
            <div className="px-4 py-3.5 border-b border-slate-200">
              <h2 id="facility-sidebar-heading" className="text-sm font-bold text-slate-900">
                Facility Status Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {filteredFacilities.length} facilities · Select to inspect
              </p>
            </div>

            <div className="overflow-y-auto flex-1" style={{ maxHeight: '435px' }}>
              {filteredFacilities.map((facility) => {
                const isSelected = selectedFacility?.id === facility.id;
                return (
                  <button
                    key={facility.id}
                    onClick={() => setSelectedFacility(facility)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors group focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500 ${isSelected ? 'bg-sky-50/80 border-l-2 border-l-sky-500' : ''}`}
                    aria-pressed={isSelected}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${getStatusColor(facility.status)} ${facility.status === 'Critical' ? 'animate-pulse' : ''}`}></span>
                          <span className="text-xs font-bold text-slate-900 truncate">{facility.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 ml-4">{facility.taluka} Taluka, {facility.district}</div>
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 ml-4">
                          {getStatusBadge(facility.status)}
                          {getRiskBadge(facility.medicineRisk)}
                        </div>
                        <div className="flex items-center gap-3 mt-1.5 ml-4 text-[11px] text-slate-500">
                          {facility.totalBeds > 0 && (
                            <span>
                              Beds: <strong className="text-slate-700">{facility.bedsAvailable}/{facility.totalBeds}</strong>
                            </span>
                          )}
                          {facility.activeShipment && (
                            <span className="text-sky-700 font-medium flex items-center gap-0.5">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1V5a1 1 0 00-1-1H3z"/>
                              </svg>
                              {facility.activeShipment}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 shrink-0 pt-0.5">{facility.lastUpdated}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* 4. Selected Facility Detail Panel */}
        {selectedFacility && (
          <section
            aria-labelledby="facility-detail-heading"
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className={`px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 ${selectedFacility.status === 'Critical' ? 'bg-rose-50' : selectedFacility.status === 'Low Stock' ? 'bg-amber-50' : 'bg-white'}`}>
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedFacility.status === 'Critical' ? 'bg-rose-100 text-rose-700' : selectedFacility.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="facility-detail-heading" className="text-base font-bold text-slate-900">{selectedFacility.name}</h2>
                    {getStatusBadge(selectedFacility.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedFacility.taluka} Taluka, {selectedFacility.district} District · Last updated {selectedFacility.lastUpdated}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                  View Full Profile
                </button>
                {selectedFacility.status === 'Critical' && (
                  <button className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors shadow-sm">
                    Escalate Emergency
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 divide-x divide-y divide-slate-100">
              {/* Facility Status */}
              <div className="p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Status</p>
                <div className="mt-1">{getStatusBadge(selectedFacility.status)}</div>
              </div>

              {/* Medicine Risk */}
              <div className="p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Medicine Risk</p>
                <div className="mt-1">{getRiskBadge(selectedFacility.medicineRisk)}</div>
              </div>

              {/* Beds */}
              {selectedFacility.totalBeds > 0 ? (
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Beds Available</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-extrabold text-slate-900">{selectedFacility.bedsAvailable}</span>
                    <span className="text-xs text-slate-500">/ {selectedFacility.totalBeds}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1.5">
                    <div
                      className={`h-1.5 rounded-full ${selectedFacility.bedsAvailable === 0 ? 'bg-rose-500' : selectedFacility.bedsAvailable <= selectedFacility.totalBeds * 0.3 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${(selectedFacility.bedsAvailable / selectedFacility.totalBeds) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</p>
                  <span className="text-xs font-medium text-slate-700">Regional Sub-Store</span>
                </div>
              )}

              {/* Staff */}
              <div className="p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Staff Status</p>
                <div className="mt-1">
                  {selectedFacility.staffAvailable ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Full Capacity
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>Understaffed
                    </span>
                  )}
                </div>
              </div>

              {/* Active Shipment */}
              <div className="p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Active Shipment</p>
                {selectedFacility.activeShipment ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200 mt-1">
                    {selectedFacility.activeShipment}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 mt-1 block">None active</span>
                )}
              </div>

              {/* Cold Chain */}
              <div className="p-4">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Cold Chain</p>
                <div className="mt-1">
                  {selectedFacility.coldChainStatus === 'Alert' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-pulse"></span>
                      {selectedFacility.tempReading} ⚠
                    </span>
                  ) : selectedFacility.coldChainStatus === 'Warning' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                      {selectedFacility.tempReading}
                    </span>
                  ) : selectedFacility.coldChainStatus === 'N/A' ? (
                    <span className="text-xs text-slate-400">N/A</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {selectedFacility.tempReading}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Critical Medicines */}
            {selectedFacility.criticalMedicines.length > 0 && (
              <div className="px-5 py-3.5 border-t border-slate-100 bg-rose-50/50">
                <p className="text-xs font-bold text-rose-800 mb-2">⚠ Critical / Low-Stock Medicines at this Facility:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedFacility.criticalMedicines.map((med, i) => (
                    <span key={i} className="text-xs font-medium text-rose-900 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-200">
                      {med}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 5. Cold-Chain Monitoring Section */}
        <section aria-labelledby="cold-chain-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h2 id="cold-chain-heading" className="text-base font-bold text-slate-900">
                  Cold-Chain Temperature Monitoring
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time ILR, vaccine refrigerator, and in-transit reefer telemetry for biologic integrity assurance.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                1 Alert Active
              </span>
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                1 Warning
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Facility / Vehicle</th>
                  <th scope="col" className="py-3 px-4">District</th>
                  <th scope="col" className="py-3 px-4">Alert Status</th>
                  <th scope="col" className="py-3 px-4 text-right">Temperature</th>
                  <th scope="col" className="py-3 px-4">Target Range</th>
                  <th scope="col" className="py-3 px-4">Last Checked</th>
                  <th scope="col" className="py-3 px-4">Associated</th>
                  <th scope="col" className="py-3 px-4">Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COLD_CHAIN_DATA.map((site) => (
                  <tr key={site.id} className={`hover:bg-slate-50 transition-colors ${site.alertStatus === 'Alert' ? 'bg-rose-50/40' : site.alertStatus === 'Warning' ? 'bg-amber-50/30' : ''}`}>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{site.facilityName}</td>
                    <td className="py-3.5 px-4 text-slate-600">{site.district}</td>
                    <td className="py-3.5 px-4">
                      {site.alertStatus === 'Alert' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>Alert
                        </span>
                      ) : site.alertStatus === 'Warning' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Warning
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Normal
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      <span className={
                        site.alertStatus === 'Alert' ? 'text-rose-700' :
                        site.alertStatus === 'Warning' ? 'text-amber-700' :
                        'text-emerald-700'
                      }>
                        {site.tempReading}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{site.targetRange}</td>
                    <td className="py-3.5 px-4 text-slate-500">{site.lastChecked}</td>
                    <td className="py-3.5 px-4">
                      {site.associatedShipment ? (
                        <span className="text-[11px] font-mono font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                          {site.associatedShipment}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">Facility ILR</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-slate-700 leading-relaxed line-clamp-2">{site.recommendation}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Full Facility Status Table */}
        <section aria-labelledby="facility-table-heading" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 id="facility-table-heading" className="text-base font-bold text-slate-900">
              District Facility Network Status Register
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Complete status snapshot for all monitored primary health centres and sub-stores.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Facility</th>
                  <th scope="col" className="py-3 px-4">Taluka / District</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4">Medicine Risk</th>
                  <th scope="col" className="py-3 px-4 text-center">Beds</th>
                  <th scope="col" className="py-3 px-4">Cold Chain</th>
                  <th scope="col" className="py-3 px-4">Active Shipment</th>
                  <th scope="col" className="py-3 px-4">Last Updated</th>
                  <th scope="col" className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFacilities.map((f) => (
                  <tr
                    key={f.id}
                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${selectedFacility?.id === f.id ? 'bg-sky-50/60' : ''}`}
                    onClick={() => setSelectedFacility(f)}
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">{f.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {f.taluka} · {f.district}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getStatusBadge(f.status)}</td>
                    <td className="py-3.5 px-4 whitespace-nowrap">{getRiskBadge(f.medicineRisk)}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {f.totalBeds > 0 ? `${f.bedsAvailable}/${f.totalBeds}` : '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${f.coldChainStatus === 'Alert' ? 'bg-rose-600 animate-pulse' : f.coldChainStatus === 'Warning' ? 'bg-amber-500' : f.coldChainStatus === 'N/A' ? 'bg-slate-300' : 'bg-emerald-500'}`}></span>
                        <span className="font-mono text-slate-700">{f.tempReading}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {f.activeShipment ? (
                        <span className="text-[11px] font-mono font-semibold text-sky-700">{f.activeShipment}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">{f.lastUpdated}</td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFacility(f); }}
                        className="px-2.5 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
