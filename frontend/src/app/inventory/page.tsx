'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

interface InventoryItem {
  id: string;
  code: string;
  name: string;
  strength: string;
  category: string;
  phc: string;
  district: string;
  availableStock: number;
  minThreshold: number;
  unit: string;
  dailyConsumption: number;
  daysRemaining: number;
  status: 'Healthy' | 'Low Stock' | 'Critical';
  lastUpdated: string;
  batchNumber: string;
  expiryDate: string;
  isColdChain?: boolean;
}

export default function MedicineInventoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [phcFilter, setPhcFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Inventory & Stock' },
  ];

  // Static Demonstration Inventory Data
  const initialInventory: InventoryItem[] = [
    {
      id: 'MED-001',
      code: 'EDL-ANT-001',
      name: 'Snake Antivenom (Polyvalent)',
      strength: '10ml Lyophilized Vial',
      category: 'Emergency Antidotes',
      phc: 'PHC Junnar Rural',
      district: 'Pune',
      availableStock: 8,
      minThreshold: 40,
      unit: 'Vials',
      dailyConsumption: 10,
      daysRemaining: 0.8,
      status: 'Critical',
      lastUpdated: '12 mins ago',
      batchNumber: 'SAV-2026-B09',
      expiryDate: 'Dec 2027',
      isColdChain: true,
    },
    {
      id: 'MED-002',
      code: 'EDL-MAT-014',
      name: 'Oxytocin Injection',
      strength: '10 IU / 1ml Ampoule',
      category: 'Maternal Care',
      phc: 'PHC Ambegaon Central',
      district: 'Pune',
      availableStock: 25,
      minThreshold: 120,
      unit: 'Ampoules',
      dailyConsumption: 20,
      daysRemaining: 1.2,
      status: 'Critical',
      lastUpdated: '25 mins ago',
      batchNumber: 'OXY-2026-X41',
      expiryDate: 'Nov 2026',
      isColdChain: true,
    },
    {
      id: 'MED-003',
      code: 'EDL-VAC-008',
      name: 'Rabies Vaccine (PVRV)',
      strength: '2.5 IU / 0.5ml Vial',
      category: 'Vaccines & Cold-Chain',
      phc: 'PHC Shirur North',
      district: 'Pune',
      availableStock: 14,
      minThreshold: 80,
      unit: 'Doses',
      dailyConsumption: 9,
      daysRemaining: 1.5,
      status: 'Critical',
      lastUpdated: '30 mins ago',
      batchNumber: 'RAB-2026-K12',
      expiryDate: 'Aug 2027',
      isColdChain: true,
    },
    {
      id: 'MED-004',
      code: 'EDL-EMG-022',
      name: 'Atropine Sulfate Injection',
      strength: '0.6 mg/ml Ampoule',
      category: 'Emergency Antidotes',
      phc: 'PHC Daund South',
      district: 'Pune',
      availableStock: 12,
      minThreshold: 50,
      unit: 'Ampoules',
      dailyConsumption: 6,
      daysRemaining: 1.9,
      status: 'Critical',
      lastUpdated: '40 mins ago',
      batchNumber: 'ATR-2026-H89',
      expiryDate: 'Jan 2028',
    },
    {
      id: 'MED-005',
      code: 'EDL-ANA-002',
      name: 'Paracetamol 500mg',
      strength: '500 mg Tablet',
      category: 'Analgesics & Antipyretics',
      phc: 'PHC Khed Rural',
      district: 'Pune',
      availableStock: 350,
      minThreshold: 1500,
      unit: 'Tablets',
      dailyConsumption: 165,
      daysRemaining: 2.1,
      status: 'Critical',
      lastUpdated: '50 mins ago',
      batchNumber: 'PCM-2026-Q10',
      expiryDate: 'Oct 2028',
    },
    {
      id: 'MED-006',
      code: 'EDL-ABX-004',
      name: 'Amoxicillin-Clavulanate',
      strength: '625 mg Tablet',
      category: 'Antibiotics',
      phc: 'PHC Khed Rural',
      district: 'Pune',
      availableStock: 480,
      minThreshold: 1200,
      unit: 'Tablets',
      dailyConsumption: 110,
      daysRemaining: 4.3,
      status: 'Low Stock',
      lastUpdated: '45 mins ago',
      batchNumber: 'AMX-2026-L55',
      expiryDate: 'Mar 2027',
    },
    {
      id: 'MED-007',
      code: 'EDL-DIA-001',
      name: 'Human Regular Insulin',
      strength: '100 IU/ml 10ml Vial',
      category: 'Chronic Care',
      phc: 'PHC Indapur East',
      district: 'Pune',
      availableStock: 42,
      minThreshold: 90,
      unit: 'Vials',
      dailyConsumption: 8,
      daysRemaining: 5.2,
      status: 'Low Stock',
      lastUpdated: '1 hr ago',
      batchNumber: 'INS-2026-D04',
      expiryDate: 'Jul 2027',
      isColdChain: true,
    },
    {
      id: 'MED-008',
      code: 'EDL-ABX-007',
      name: 'Azithromycin Tablets',
      strength: '500 mg Tablet',
      category: 'Antibiotics',
      phc: 'PHC Shirur North',
      district: 'Pune',
      availableStock: 320,
      minThreshold: 600,
      unit: 'Tablets',
      dailyConsumption: 55,
      daysRemaining: 5.8,
      status: 'Low Stock',
      lastUpdated: '1 hr ago',
      batchNumber: 'AZI-2026-F19',
      expiryDate: 'Feb 2028',
    },
    {
      id: 'MED-009',
      code: 'EDL-IVF-001',
      name: 'Normal Saline (0.9% NaCl)',
      strength: '500 ml IV Infusion',
      category: 'IV Fluids',
      phc: 'PHC Junnar Rural',
      district: 'Pune',
      availableStock: 1250,
      minThreshold: 300,
      unit: 'Bottles',
      dailyConsumption: 24,
      daysRemaining: 52.0,
      status: 'Healthy',
      lastUpdated: '2 hrs ago',
      batchNumber: 'NS-2026-N81',
      expiryDate: 'May 2028',
    },
    {
      id: 'MED-010',
      code: 'EDL-REH-001',
      name: 'Oral Rehydration Salts (ORS)',
      strength: '20.5 g WHO Sachet',
      category: 'Essential Formulary',
      phc: 'PHC Ambegaon Central',
      district: 'Pune',
      availableStock: 3400,
      minThreshold: 800,
      unit: 'Sachets',
      dailyConsumption: 65,
      daysRemaining: 52.3,
      status: 'Healthy',
      lastUpdated: '2 hrs ago',
      batchNumber: 'ORS-2026-W33',
      expiryDate: 'Sep 2028',
    },
    {
      id: 'MED-011',
      code: 'EDL-DIA-003',
      name: 'Metformin HCl',
      strength: '500 mg Tablet',
      category: 'Chronic Care',
      phc: 'PHC Daund South',
      district: 'Pune',
      availableStock: 8200,
      minThreshold: 2000,
      unit: 'Tablets',
      dailyConsumption: 140,
      daysRemaining: 58.5,
      status: 'Healthy',
      lastUpdated: '3 hrs ago',
      batchNumber: 'MET-2026-M44',
      expiryDate: 'Nov 2028',
    },
    {
      id: 'MED-012',
      code: 'EDL-VAC-002',
      name: 'Tetanus Toxoid Vaccine',
      strength: '0.5 ml Single Dose',
      category: 'Vaccines & Cold-Chain',
      phc: 'PHC Junnar Rural',
      district: 'Pune',
      availableStock: 310,
      minThreshold: 150,
      unit: 'Vials',
      dailyConsumption: 12,
      daysRemaining: 25.8,
      status: 'Healthy',
      lastUpdated: '2 hrs ago',
      batchNumber: 'TT-2026-T19',
      expiryDate: 'Apr 2027',
      isColdChain: true,
    },
    {
      id: 'MED-013',
      code: 'EDL-PAR-003',
      name: 'Albendazole 400mg',
      strength: '400 mg Chewable',
      category: 'Essential Formulary',
      phc: 'PHC Bhor West',
      district: 'Pune',
      availableStock: 1800,
      minThreshold: 500,
      unit: 'Tablets',
      dailyConsumption: 35,
      daysRemaining: 51.4,
      status: 'Healthy',
      lastUpdated: '4 hrs ago',
      batchNumber: 'ALB-2026-P01',
      expiryDate: 'Jan 2029',
    },
    {
      id: 'MED-014',
      code: 'EDL-RES-005',
      name: 'Salbutamol Respiratory Solution',
      strength: '5 mg/ml 15ml Respule',
      category: 'Emergency Antidotes',
      phc: 'PHC Indapur East',
      district: 'Pune',
      availableStock: 85,
      minThreshold: 150,
      unit: 'Respules',
      dailyConsumption: 18,
      daysRemaining: 4.7,
      status: 'Low Stock',
      lastUpdated: '3 hrs ago',
      batchNumber: 'SLB-2026-R14',
      expiryDate: 'Jun 2027',
    },
  ];

  // Filtered and Paginated Items
  const filteredInventory = useMemo(() => {
    return initialInventory.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === 'All' || item.category === categoryFilter;

      const matchesPhc =
        phcFilter === 'All' || item.phc === phcFilter;

      return matchesSearch && matchesStatus && matchesCategory && matchesPhc;
    });
  }, [searchQuery, statusFilter, categoryFilter, phcFilter]);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredInventory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredInventory, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setCategoryFilter('All');
    setPhcFilter('All');
    setCurrentPage(1);
  };

  // Critical items for highlight banner
  const criticalItems = useMemo(() => {
    return initialInventory.filter((i) => i.status === 'Critical');
  }, []);

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
        Export Stock Manifest
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
        Initiate Stock Rebalance
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="Medicine Inventory & Stock Surveillance"
      description="Centralized multi-facility pharmaceutical reserve visibility, EDL threshold compliance monitoring, and automated stockout triage."
      roleBadge="National EDL Formulary • Multi-Facility"
      currentRole="central"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="Live Inventory Telemetry (Sync: 30s)"
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* Section 1: Inventory KPI Cards (5 Cards) */}
        <section aria-labelledby="inventory-kpi-heading">
          <h2 id="inventory-kpi-heading" className="sr-only">
            Medicine Inventory Key Performance Indicators
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* KPI 1: Total Medicines */}
            <StatCard
              title="Total Medicines"
              value="124"
              description="Essential Drugs List (EDL)"
              trend={{
                value: "100% cataloged",
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

            {/* KPI 2: Medicines Low in Stock */}
            <StatCard
              title="Low Stock Items"
              value="18"
              description="Reserve < 7 days safety buffer"
              trend={{
                value: "-4 vs yesterday",
                direction: "down",
                isPositive: true,
                label: "Replenishment en route",
              }}
              badge="Warning"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* KPI 3: Critical Stock Items */}
            <StatCard
              title="Critical Items"
              value="5"
              description="Reserve < 3 days / imminent deficit"
              trend={{
                value: "2 emergency orders",
                direction: "up",
                isPositive: false,
                label: "Urgent triage active",
              }}
              badge="Action Required"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* KPI 4: Total Units Available */}
            <StatCard
              title="Total Units Stock"
              value="148,650"
              description="Physical inventory on-hand"
              trend={{
                value: "+12,400 this week",
                direction: "up",
                isPositive: true,
                label: "Inward warehouse receipts",
              }}
              badge="Adequate"
              icon={
                <svg className="w-5 h-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              }
            />

            {/* KPI 5: PHCs with Stock Issues */}
            <StatCard
              title="PHCs at Risk"
              value="8"
              description="Facilities needing rebalance"
              trend={{
                value: "-3 resolved today",
                direction: "down",
                isPositive: true,
                label: "Inter-PHC rebalancing",
              }}
              badge="Triage Active"
              icon={
                <svg className="w-5 h-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 2: Critical Stock Urgent Action Callout */}
        <section aria-labelledby="critical-stock-heading" className="bg-rose-50/70 border border-rose-200 rounded-lg p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-200/80">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-md bg-rose-600 text-white shrink-0">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              <div>
                <h2 id="critical-stock-heading" className="text-sm font-bold text-rose-950">
                  Critical Stock Triage: 5 Priority Deficits Requiring Immediate Attention
                </h2>
                <p className="text-xs text-rose-700 mt-0.5">
                  These medicines have fallen below the mandatory 3-day emergency buffer threshold and require expedited reallocation.
                </p>
              </div>
            </div>
            <Link
              href="/transfers"
              className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold bg-rose-700 text-white hover:bg-rose-800 transition-colors shadow-xs shrink-0 self-start sm:self-auto"
            >
              Dispatch Emergency Quota &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
            {criticalItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3.5 rounded-md border border-rose-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <span className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                      {item.code}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      {item.daysRemaining} Days Left
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">{item.phc}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-baseline justify-between">
                    <span className="text-slate-500 text-[11px]">Current:</span>
                    <span className="font-bold text-rose-700">
                      {item.availableStock} {item.unit}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-[11px] text-slate-400 mt-0.5">
                    <span>Min Safety:</span>
                    <span>{item.minThreshold} {item.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Inventory Controls & Filtering Bar */}
        <section aria-labelledby="filter-controls-heading" className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <h2 id="filter-controls-heading" className="sr-only">
            Inventory Filter & Search Controls
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="lg:col-span-4 relative">
              <label htmlFor="inventory-search" className="sr-only">
                Search Medicine or EDL Code
              </label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="inventory-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search medicine name, code, or facility..."
                className="block w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-slate-50/50"
              />
            </div>

            {/* Filter by Stock Status */}
            <div className="lg:col-span-2">
              <label htmlFor="status-select" className="sr-only">
                Filter by Stock Status
              </label>
              <select
                id="status-select"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="All">All Stock Statuses</option>
                <option value="Critical">Critical (&lt; 3 Days)</option>
                <option value="Low Stock">Low Stock (&lt; 7 Days)</option>
                <option value="Healthy">Healthy Reserves</option>
              </select>
            </div>

            {/* Filter by Category */}
            <div className="lg:col-span-3">
              <label htmlFor="category-select" className="sr-only">
                Filter by Category
              </label>
              <select
                id="category-select"
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="All">All Therapeutic Categories</option>
                <option value="Emergency Antidotes">Emergency Antidotes</option>
                <option value="Maternal Care">Maternal Care</option>
                <option value="Vaccines & Cold-Chain">Vaccines & Cold-Chain</option>
                <option value="Antibiotics">Antibiotics</option>
                <option value="Chronic Care">Chronic Care</option>
                <option value="IV Fluids">IV Fluids</option>
                <option value="Analgesics & Antipyretics">Analgesics & Antipyretics</option>
                <option value="Essential Formulary">Essential Formulary</option>
              </select>
            </div>

            {/* Filter by Facility */}
            <div className="lg:col-span-2">
              <label htmlFor="phc-select" className="sr-only">
                Filter by Facility
              </label>
              <select
                id="phc-select"
                value={phcFilter}
                onChange={(e) => {
                  setPhcFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="block w-full px-3 py-2 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 bg-white"
              >
                <option value="All">All Primary Health Centres</option>
                <option value="PHC Junnar Rural">PHC Junnar Rural</option>
                <option value="PHC Ambegaon Central">PHC Ambegaon Central</option>
                <option value="PHC Shirur North">PHC Shirur North</option>
                <option value="PHC Khed Rural">PHC Khed Rural</option>
                <option value="PHC Daund South">PHC Daund South</option>
                <option value="PHC Indapur East">PHC Indapur East</option>
                <option value="PHC Bhor West">PHC Bhor West</option>
              </select>
            </div>

            {/* Reset Filter Button */}
            <div className="lg:col-span-1 flex justify-end">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-md text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                title="Reset all filters"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing <strong className="text-slate-800">{filteredInventory.length}</strong> of{' '}
              <strong className="text-slate-800">{initialInventory.length}</strong> cataloged medicines
            </span>
            <div className="flex items-center space-x-3">
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                Healthy: {initialInventory.filter((i) => i.status === 'Healthy').length}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5" />
                Low Stock: {initialInventory.filter((i) => i.status === 'Low Stock').length}
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" />
                Critical: {initialInventory.filter((i) => i.status === 'Critical').length}
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: Main Inventory Table */}
        <section aria-labelledby="inventory-table-heading" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
            <div>
              <h2 id="inventory-table-heading" className="text-base font-bold text-slate-900">
                Primary Pharmaceutical Stock Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time facility inventory count, minimum safety buffer thresholds, and daily depletion rate telemetry.
              </p>
            </div>
            <div className="text-xs text-slate-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Medicine & Code</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Facility / PHC</th>
                  <th scope="col" className="px-4 py-3">Available Stock</th>
                  <th scope="col" className="px-4 py-3">Min. Threshold</th>
                  <th scope="col" className="px-4 py-3">Daily Burn</th>
                  <th scope="col" className="px-4 py-3">Days Left</th>
                  <th scope="col" className="px-4 py-3">Status</th>
                  <th scope="col" className="px-4 py-3">Last Sync</th>
                  <th scope="col" className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-4 py-8 text-center text-slate-500">
                      No medicines match the selected filter criteria. Try resetting filters.
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Medicine & Code */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                          {item.name}
                          {item.isColdChain && (
                            <span
                              className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-sky-50 text-sky-700 border border-sky-200"
                              title="Cold-Chain (+2°C to +8°C) Monitored"
                            >
                              ❄ Cold-Chain
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.strength} &bull; <span className="font-mono">{item.code}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-slate-700 font-medium">{item.category}</span>
                      </td>

                      {/* PHC */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{item.phc}</div>
                        <div className="text-[11px] text-slate-500">{item.district} District</div>
                      </td>

                      {/* Available Stock */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.availableStock.toLocaleString()}
                        </span>{' '}
                        <span className="text-[11px] text-slate-500">{item.unit}</span>
                      </td>

                      {/* Minimum Threshold */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        {item.minThreshold.toLocaleString()} {item.unit}
                      </td>

                      {/* Daily Consumption */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                        ~{item.dailyConsumption} / day
                      </td>

                      {/* Days Remaining */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            item.daysRemaining < 3
                              ? 'text-rose-700'
                              : item.daysRemaining < 7
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                          }`}
                        >
                          {item.daysRemaining} Days
                        </span>
                      </td>

                      {/* Stock Status Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                            item.status === 'Critical'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : item.status === 'Low Stock'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                              item.status === 'Critical'
                                ? 'bg-rose-500'
                                : item.status === 'Low Stock'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />
                          {item.status}
                        </span>
                      </td>

                      {/* Last Updated */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-[11px]">
                        {item.lastUpdated}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        {item.status === 'Critical' || item.status === 'Low Stock' ? (
                          <Link
                            href="/transfers"
                            className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded text-white bg-sky-700 hover:bg-sky-800 transition-colors shadow-xs"
                          >
                            Rebalance
                          </Link>
                        ) : (
                          <button
                            type="button"
                            className="inline-flex items-center px-2.5 py-1 text-[11px] font-semibold rounded text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors border border-slate-300"
                          >
                            Details
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="divide-y divide-slate-100 md:hidden">
            {paginatedItems.map((item) => (
              <div key={item.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.name}</h3>
                    <p className="text-[11px] text-slate-500">{item.strength} &bull; {item.code}</p>
                  </div>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block">Facility:</span>
                    <span className="font-medium text-slate-800">{item.phc}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current Stock:</span>
                    <span className="font-bold text-slate-900">
                      {item.availableStock} {item.unit}
                    </span>{' '}
                    <span className="text-slate-400">/ min {item.minThreshold}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-bold text-rose-700">
                    {item.daysRemaining} Days Reserve
                  </span>
                  <Link
                    href="/transfers"
                    className="text-xs font-semibold text-sky-700 hover:text-sky-800"
                  >
                    Transfer Request &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Section 8: Pagination Controls */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Showing page <strong className="text-slate-800">{currentPage}</strong> of{' '}
              <strong className="text-slate-800">{totalPages}</strong>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors ${
                      currentPage === page
                        ? 'bg-sky-700 text-white'
                        : 'text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-300 bg-white font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* Section 7: Inventory Summary & Reserve Health Overview */}
        <section
          aria-labelledby="inventory-summary-heading"
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs"
        >
          <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 id="inventory-summary-heading" className="text-base font-bold text-slate-900">
                Formulary Compliance & Reserve Distribution Overview
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated state and district pharmaceutical security metrics across all registered primary health units.
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              National Health Supply Audit: Compliant
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 text-xs">
            {/* Summary Block 1 */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[11px]">
                Essential Drugs List (EDL) Compliance
              </span>
              <div className="text-2xl font-bold text-slate-900">94.2%</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                117 of 124 mandated primary healthcare medicines are in active stock across Pune District clinics, meeting national standards.
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className="bg-sky-600 h-1.5 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            {/* Summary Block 2 */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[11px]">
                Cold-Chain Refrigerated Integrity
              </span>
              <div className="text-2xl font-bold text-slate-900">100% Certified</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                All 18 cold-chain medicines (including Antivenom, Rabies, Insulin, and TT) are actively protected in calibrated ILRs (+2°C to +8°C).
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Summary Block 3 */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-slate-500 font-semibold uppercase tracking-wider block text-[11px]">
                Average District Buffer Horizon
              </span>
              <div className="text-2xl font-bold text-slate-900">24.5 Days</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mean operational run-time across all essential medicines based on rolling 30-day average daily consumption metrics.
              </p>
              <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
                <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
