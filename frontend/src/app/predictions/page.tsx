'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

interface StockoutRiskItem {
  id: string;
  medicine: string;
  code: string;
  category: string;
  phc: string;
  district: string;
  currentStock: number;
  unit: string;
  predictedDemand: number;
  daysUntilStockout: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  riskBadge: string;
  recommendedAction: string;
  actionType: 'transfer' | 'replenish' | 'reorder' | 'monitor';
  isColdChain?: boolean;
}

interface DemandForecastItem {
  id: string;
  medicine: string;
  category: string;
  currentDailyDemand: number;
  predictedDailyDemand: number;
  expectedChange: string;
  percentageChange: number;
  forecastHorizon: string;
  trend: 'Surge' | 'Rising' | 'Stable' | 'Declining';
  trendColor: string;
  currentCapacityPct: number;
  predictedCapacityPct: number;
}

interface AIRecommendation {
  id: string;
  type: string;
  title: string;
  relatedEntity: string;
  reason: string;
  priority: 'Critical' | 'High' | 'Medium';
  priorityBadge: string;
  suggestedAction: string;
  actionLink: string;
  actionText: string;
  confidence: string;
}

export default function PredictionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [phcFilter, setPhcFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [forecastPeriod, setForecastPeriod] = useState('14');
  const [simulatedRunTimestamp, setSimulatedRunTimestamp] = useState('Just now (14:35)');

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Predictions & AI' },
  ];

  // Static Demonstration Data: Stockout Risk Dataset
  const riskDataset: StockoutRiskItem[] = [
    {
      id: 'RSK-001',
      medicine: 'Snake Antivenom (Polyvalent)',
      code: 'EDL-ANT-001',
      category: 'Emergency Antidotes',
      phc: 'PHC Junnar Rural',
      district: 'Pune',
      currentStock: 8,
      unit: 'Vials',
      predictedDemand: 10,
      daysUntilStockout: 0.8,
      riskLevel: 'Critical',
      riskBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      recommendedAction: 'Emergency transfer from Pune Central Warehouse (SHP-8812 en route)',
      actionType: 'transfer',
      isColdChain: true,
    },
    {
      id: 'RSK-002',
      medicine: 'Oxytocin Injection 10 IU/ml',
      code: 'EDL-MAT-014',
      category: 'Maternal Care',
      phc: 'PHC Ambegaon Central',
      district: 'Pune',
      currentStock: 25,
      unit: 'Ampoules',
      predictedDemand: 20,
      daysUntilStockout: 1.2,
      riskLevel: 'Critical',
      riskBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      recommendedAction: 'Transfer 40 ampoules from nearby PHC Junnar (Surplus hold)',
      actionType: 'transfer',
      isColdChain: true,
    },
    {
      id: 'RSK-003',
      medicine: 'Rabies Vaccine (PVRV 2.5 IU)',
      code: 'EDL-VAC-008',
      category: 'Vaccines & Cold-Chain',
      phc: 'PHC Shirur North',
      district: 'Pune',
      currentStock: 14,
      unit: 'Doses',
      predictedDemand: 9,
      daysUntilStockout: 1.5,
      riskLevel: 'Critical',
      riskBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      recommendedAction: 'Dispatch staged quota TRF-APP-9941 from Pune Hub Dock 2',
      actionType: 'replenish',
      isColdChain: true,
    },
    {
      id: 'RSK-004',
      medicine: 'Atropine Sulfate 0.6mg/ml',
      code: 'EDL-EMG-022',
      category: 'Emergency Antidotes',
      phc: 'PHC Daund South',
      district: 'Pune',
      currentStock: 12,
      unit: 'Ampoules',
      predictedDemand: 6,
      daysUntilStockout: 1.9,
      riskLevel: 'Critical',
      riskBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      recommendedAction: 'Expedite inter-district requisition from Baramati Reserve Depot',
      actionType: 'replenish',
    },
    {
      id: 'RSK-005',
      medicine: 'Paracetamol 500mg Tablets',
      code: 'EDL-ANA-002',
      category: 'Analgesics',
      phc: 'PHC Khed Rural',
      district: 'Pune',
      currentStock: 350,
      unit: 'Tablets',
      predictedDemand: 165,
      daysUntilStockout: 2.1,
      riskLevel: 'Critical',
      riskBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      recommendedAction: 'Release buffer box from District Reserve Store (Aundh)',
      actionType: 'replenish',
    },
    {
      id: 'RSK-006',
      medicine: 'Amoxicillin-Clavulanate 625mg',
      code: 'EDL-ABX-004',
      category: 'Antibiotics',
      phc: 'PHC Khed Rural',
      district: 'Pune',
      currentStock: 480,
      unit: 'Tablets',
      predictedDemand: 110,
      daysUntilStockout: 4.3,
      riskLevel: 'High',
      riskBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      recommendedAction: 'Increase monthly indent buffer +40% before monsoon peak',
      actionType: 'reorder',
    },
    {
      id: 'RSK-007',
      medicine: 'Human Regular Insulin 100 IU/ml',
      code: 'EDL-DIA-001',
      category: 'Chronic Care',
      phc: 'PHC Indapur East',
      district: 'Pune',
      currentStock: 42,
      unit: 'Vials',
      predictedDemand: 8,
      daysUntilStockout: 5.2,
      riskLevel: 'High',
      riskBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      recommendedAction: 'Verify cold-box inventory at Sub-centre Baramati & schedule drop',
      actionType: 'monitor',
      isColdChain: true,
    },
    {
      id: 'RSK-008',
      medicine: 'Azithromycin 500mg Tablets',
      code: 'EDL-ABX-007',
      category: 'Antibiotics',
      phc: 'PHC Shirur North',
      district: 'Pune',
      currentStock: 320,
      unit: 'Tablets',
      predictedDemand: 55,
      daysUntilStockout: 5.8,
      riskLevel: 'High',
      riskBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      recommendedAction: 'Automated notification sent to Pharmacist for reorder approval',
      actionType: 'reorder',
    },
    {
      id: 'RSK-009',
      medicine: 'Salbutamol Respiratory Solution',
      code: 'EDL-RES-005',
      category: 'Respiratory',
      phc: 'PHC Indapur East',
      district: 'Pune',
      currentStock: 85,
      unit: 'Respules',
      predictedDemand: 18,
      daysUntilStockout: 4.7,
      riskLevel: 'High',
      riskBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      recommendedAction: 'Initiate bulk quota top-up from District Warehouse',
      actionType: 'replenish',
    },
    {
      id: 'RSK-010',
      medicine: 'Tetanus Toxoid Vaccine 0.5ml',
      code: 'EDL-VAC-002',
      category: 'Vaccines',
      phc: 'PHC Junnar Rural',
      district: 'Pune',
      currentStock: 310,
      unit: 'Vials',
      predictedDemand: 12,
      daysUntilStockout: 25.8,
      riskLevel: 'Low',
      riskBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      recommendedAction: 'Maintain standard 30-day rolling consumption surveillance',
      actionType: 'monitor',
      isColdChain: true,
    },
    {
      id: 'RSK-011',
      medicine: 'Normal Saline (0.9% NaCl 500ml)',
      code: 'EDL-IVF-001',
      category: 'IV Fluids',
      phc: 'PHC Khed Rural',
      district: 'Pune',
      currentStock: 1250,
      unit: 'Bottles',
      predictedDemand: 24,
      daysUntilStockout: 52.0,
      riskLevel: 'Low',
      riskBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      recommendedAction: 'Surplus available for potential lateral transfer to deficit PHCs',
      actionType: 'monitor',
    },
    {
      id: 'RSK-012',
      medicine: 'Oral Rehydration Salts (ORS 20.5g)',
      code: 'EDL-REH-001',
      category: 'Essential Formulary',
      phc: 'PHC Ambegaon Central',
      district: 'Pune',
      currentStock: 3400,
      unit: 'Sachets',
      predictedDemand: 65,
      daysUntilStockout: 52.3,
      riskLevel: 'Low',
      riskBadge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      recommendedAction: 'Sufficient buffer across district monsoon baseline threshold',
      actionType: 'monitor',
    },
  ];

  // Static Demand Forecast Dataset
  const demandForecasts: DemandForecastItem[] = [
    {
      id: 'FST-01',
      medicine: 'Snake Antivenom (Polyvalent 10ml)',
      category: 'Emergency Antidotes',
      currentDailyDemand: 10,
      predictedDailyDemand: 16.5,
      expectedChange: '+65% Monsoon Surge',
      percentageChange: 65,
      forecastHorizon: 'Next 14 Days',
      trend: 'Surge',
      trendColor: 'text-rose-600 bg-rose-50 border-rose-200',
      currentCapacityPct: 50,
      predictedCapacityPct: 82,
    },
    {
      id: 'FST-02',
      medicine: 'Oral Rehydration Salts (ORS Sachets)',
      category: 'Gastroenteritis Season',
      currentDailyDemand: 65,
      predictedDailyDemand: 98,
      expectedChange: '+51% High Rainfall Risk',
      percentageChange: 51,
      forecastHorizon: 'Next 30 Days',
      trend: 'Surge',
      trendColor: 'text-rose-600 bg-rose-50 border-rose-200',
      currentCapacityPct: 45,
      predictedCapacityPct: 75,
    },
    {
      id: 'FST-03',
      medicine: 'Amoxicillin-Clavulanate 625mg',
      category: 'Respiratory Antibiotics',
      currentDailyDemand: 110,
      predictedDailyDemand: 148,
      expectedChange: '+34% Weather Transition',
      percentageChange: 34,
      forecastHorizon: 'Next 14 Days',
      trend: 'Rising',
      trendColor: 'text-amber-600 bg-amber-50 border-amber-200',
      currentCapacityPct: 60,
      predictedCapacityPct: 80,
    },
    {
      id: 'FST-04',
      medicine: 'Paracetamol 500mg Tablets',
      category: 'General Antipyretic',
      currentDailyDemand: 165,
      predictedDailyDemand: 215,
      expectedChange: '+30% Fever Clinic Spike',
      percentageChange: 30,
      forecastHorizon: 'Next 7 Days',
      trend: 'Rising',
      trendColor: 'text-amber-600 bg-amber-50 border-amber-200',
      currentCapacityPct: 65,
      predictedCapacityPct: 85,
    },
    {
      id: 'FST-05',
      medicine: 'Human Regular Insulin 100 IU/ml',
      category: 'Chronic Endocrine Care',
      currentDailyDemand: 8,
      predictedDailyDemand: 8.5,
      expectedChange: '+6% Steady Baseline',
      percentageChange: 6,
      forecastHorizon: 'Next 30 Days',
      trend: 'Stable',
      trendColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      currentCapacityPct: 50,
      predictedCapacityPct: 53,
    },
  ];

  // Static AI Recommendations
  const aiRecommendations: AIRecommendation[] = [
    {
      id: 'REC-01',
      type: 'Direct Warehouse Replenishment',
      title: 'Emergency Inward Dispatch of Snake Antivenom',
      relatedEntity: 'PHC Junnar Rural &bull; Antivenom (EDL-ANT-001)',
      reason:
        'Model predicts agricultural monsoon surge (+65%) will exhaust remaining 8 vials in 19 hours. Historical risk score: 98/100.',
      priority: 'Critical',
      priorityBadge: 'bg-rose-100 text-rose-800 border-rose-200',
      suggestedAction: 'Authorize emergency release of 150 vials from Pune Central Warehouse Dock 2.',
      actionLink: '/transfers',
      actionText: 'Dispatch Quota',
      confidence: '98.2% Model Confidence',
    },
    {
      id: 'REC-02',
      type: 'Lateral Inter-PHC Stock Transfer',
      title: 'Redistribute Surplus Oxytocin to High-Risk Facility',
      relatedEntity: 'PHC Ambegaon Central &bull; Oxytocin 10 IU/ml',
      reason:
        'PHC Ambegaon has 25 ampoules (1.2 days left). Neighboring PHC Junnar holds 140 ampoules with only 3 daily burn rate (46 days reserve).',
      priority: 'High',
      priorityBadge: 'bg-amber-100 text-amber-800 border-amber-200',
      suggestedAction: 'Route Reefer Van MH-12-BQ-8831 to perform lateral transfer of 40 ampoules from Junnar to Ambegaon.',
      actionLink: '/transfers',
      actionText: 'Create Transfer Request',
      confidence: '95.4% Model Confidence',
    },
    {
      id: 'REC-03',
      type: 'Proactive Indent Scaling',
      title: 'Advance Seasonal Buffer for Pediatric Antibiotics',
      relatedEntity: 'PHC Khed Rural &bull; Amoxicillin-Clavulanate 625mg',
      reason:
        'Time-series forecasting projects seasonal pediatric respiratory infection cases to peak +42% over the next 14 days.',
      priority: 'Medium',
      priorityBadge: 'bg-sky-100 text-sky-800 border-sky-200',
      suggestedAction: 'Scale upcoming monthly district indent from 2,000 to 3,200 tablets.',
      actionLink: '/inventory',
      actionText: 'Update Indent Target',
      confidence: '91.8% Model Confidence',
    },
    {
      id: 'REC-04',
      type: 'Consumption Surveillance Alert',
      title: 'Telemetry Flag: Accelerating Outpatient Outflow',
      relatedEntity: 'PHC Shirur North &bull; Azithromycin 500mg',
      reason:
        'Daily consumption doubled from 25 to 55 tablets/day over past 72h. Model flags potential localized bacterial outbreak cluster.',
      priority: 'Medium',
      priorityBadge: 'bg-sky-100 text-sky-800 border-sky-200',
      suggestedAction: 'Enable 6-hour sync telemetry and alert Medical Officer Dr. Anita Patil.',
      actionLink: '/alerts',
      actionText: 'Review Alert Stream',
      confidence: '89.6% Model Confidence',
    },
  ];

  // Filtering
  const filteredRiskItems = useMemo(() => {
    return riskDataset.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phc.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPhc = phcFilter === 'All' || item.phc === phcFilter;
      const matchesRisk = riskFilter === 'All' || item.riskLevel === riskFilter;

      return matchesSearch && matchesPhc && matchesRisk;
    });
  }, [searchQuery, phcFilter, riskFilter]);

  const handleSimulateRun = () => {
    const now = new Date();
    const formatted = `Just now (${now.getHours().toString().padStart(2, '0')}:${now
      .getMinutes()
      .toString()
      .padStart(2, '0')})`;
    setSimulatedRunTimestamp(formatted);
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        onClick={handleSimulateRun}
        className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-md text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
      >
        <svg
          className="w-3.5 h-3.5 mr-1.5 text-sky-600 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        Re-run AI Models (Demo)
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
        Apply AI Recommendations
      </Link>
    </div>
  );

  return (
    <DashboardLayout
      title="AI Predictions & Risk Intelligence"
      description="Predictive neural models and time-series forecasting to anticipate primary health centre stock-outs, model seasonal demand vectors, and automate proactive supply rebalancing."
      roleBadge="AI Engine v2.4 • Active"
      currentRole="central"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated={`Forecasts Generated: ${simulatedRunTimestamp}`}
      headerActions={headerActions}
    >
      <div className="space-y-8">
        {/* AI-Powered Prominent Header Banner */}
        <div className="rounded-lg bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white p-5 shadow-sm border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 text-sky-300">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
                    Machine Learning Intelligence Core
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                    Neural Models Active
                  </span>
                </div>
                <h1 className="text-lg font-bold text-white mt-0.5">
                  Predictive Demand & Stock-out Risk Surveillance
                </h1>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  Deep time-series algorithms continuously project future medicine requirements up to 30 days ahead, allowing healthcare administrators to preemptively triage supply deficits before emergency stock depletion occurs.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-col items-start md:items-end justify-between md:justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-700/60 pt-3 md:pt-0 md:pl-5 shrink-0 text-xs">
              <div className="text-slate-300">
                Model Confidence: <span className="font-bold text-emerald-400">94.6%</span>
              </div>
              <div className="text-slate-300">
                Forecast Horizon: <span className="font-bold text-sky-300">7 to 30 Days</span>
              </div>
              <div className="text-slate-400 text-[11px]">
                Monitored Facilities: <span className="text-white font-semibold">486 Clinics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Prediction KPI Cards (6 Cards) */}
        <section aria-labelledby="prediction-kpi-heading">
          <h2 id="prediction-kpi-heading" className="sr-only">
            AI Prediction Key Performance Indicators
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* KPI 1: High Stock-out Risk */}
            <StatCard
              title="Stock-out Risks"
              value="14"
              description="Medicines < 5 days runway"
              trend={{
                value: "+3 vs last run",
                direction: "up",
                isPositive: false,
                label: "Risk elevated",
              }}
              badge="Action Required"
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              }
            />

            {/* KPI 2: Predicted Shortages */}
            <StatCard
              title="Critical Shortages"
              value="5"
              description="Zero stock in < 72 hours"
              trend={{
                value: "2 critical deficits",
                direction: "up",
                isPositive: false,
                label: "Urgent triage",
              }}
              badge="Imminent"
              icon={
                <svg className="w-5 h-5 text-rose-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />

            {/* KPI 3: High Demand Medicines */}
            <StatCard
              title="High Demand Surge"
              value="22"
              description="Surge > 25% above baseline"
              trend={{
                value: "Monsoon vector",
                direction: "up",
                isPositive: true,
                label: "Seasonal pattern",
              }}
              badge="Surge Wave"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />

            {/* KPI 4: PHCs Requiring Attention */}
            <StatCard
              title="PHCs at Risk"
              value="6"
              description="Facilities needing top-up"
              trend={{
                value: "-2 resolved today",
                direction: "down",
                isPositive: true,
                label: "Rebalances active",
              }}
              badge="Triage Zone"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              }
            />

            {/* KPI 5: Forecast Accuracy */}
            <StatCard
              title="Forecast Accuracy"
              value="94.6%"
              description="MAE error rate: 4.8%"
              trend={{
                value: "+1.2% this quarter",
                direction: "up",
                isPositive: true,
                label: "Validated vs actual",
              }}
              badge="High Accuracy"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />

            {/* KPI 6: Predictions Generated */}
            <StatCard
              title="Predictions Run"
              value="1,240"
              description="Drug-facility forecasts"
              trend={{
                value: "Updated hourly",
                direction: "neutral",
                label: "Automated pipeline",
              }}
              badge="Model Live"
              icon={
                <svg className="w-5 h-5 text-sky-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              }
            />
          </div>
        </section>

        {/* Section 2: Overall Risk Distribution Summary */}
        <section
          aria-labelledby="risk-distribution-heading"
          className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <h2 id="risk-distribution-heading" className="text-sm font-bold text-slate-900">
                District-Wide Medicine Risk Distribution
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Current classification of 124 monitored medicines based on projected days until buffer exhaustion.
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              Total Monitored: 124 Medicines across 12 Facilities
            </span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="mt-4">
            <div className="w-full h-3 rounded-full bg-slate-100 flex overflow-hidden">
              <div className="bg-emerald-500 h-full" style={{ width: '67.7%' }} title="Low Risk: 84 items (67.7%)" />
              <div className="bg-sky-500 h-full" style={{ width: '16.9%' }} title="Medium Risk: 21 items (16.9%)" />
              <div className="bg-amber-500 h-full" style={{ width: '11.3%' }} title="High Risk: 14 items (11.3%)" />
              <div className="bg-rose-500 h-full" style={{ width: '4.1%' }} title="Critical Risk: 5 items (4.1%)" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 text-xs">
              {/* Low Risk */}
              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-800">Low Risk</span>
                  <span className="font-bold text-emerald-700">67.7%</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">84 Medicines</div>
                <p className="text-[11px] text-emerald-700 mt-0.5">&gt; 15 days supply reserve</p>
              </div>

              {/* Medium Risk */}
              <div className="p-3 rounded-lg bg-sky-50/60 border border-sky-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sky-800">Medium Risk</span>
                  <span className="font-bold text-sky-700">16.9%</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">21 Medicines</div>
                <p className="text-[11px] text-sky-700 mt-0.5">7 to 15 days supply reserve</p>
              </div>

              {/* High Risk */}
              <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-800">High Risk</span>
                  <span className="font-bold text-amber-700">11.3%</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">14 Medicines</div>
                <p className="text-[11px] text-amber-700 mt-0.5">3 to 7 days supply reserve</p>
              </div>

              {/* Critical Risk */}
              <div className="p-3 rounded-lg bg-rose-50/60 border border-rose-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-rose-800">Critical Risk</span>
                  <span className="font-bold text-rose-700">4.1%</span>
                </div>
                <div className="text-xl font-bold text-slate-900 mt-1">5 Medicines</div>
                <p className="text-[11px] text-rose-700 mt-0.5">&lt; 3 days imminent stock-out</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Stock-out Risk Surveillance Table */}
        <section aria-labelledby="stockout-table-heading" className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 id="stockout-table-heading" className="text-base font-bold text-slate-900">
                  Predicted Stock-Out Risk Matrix
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Algorithmically ranked items based on predicted daily consumption and runway hours before buffer exhaustion.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-200 text-slate-800 self-start sm:self-auto">
                Showing {filteredRiskItems.length} Monitored Items
              </span>
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center mt-4">
              <div className="lg:col-span-5 relative">
                <label htmlFor="risk-search" className="sr-only">
                  Search Medicine
                </label>
                <input
                  id="risk-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicine or facility name..."
                  className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                />
              </div>

              <div className="lg:col-span-3">
                <label htmlFor="phc-filter" className="sr-only">
                  Filter PHC
                </label>
                <select
                  id="phc-filter"
                  value={phcFilter}
                  onChange={(e) => setPhcFilter(e.target.value)}
                  className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="All">All Facilities</option>
                  <option value="PHC Junnar Rural">PHC Junnar Rural</option>
                  <option value="PHC Ambegaon Central">PHC Ambegaon Central</option>
                  <option value="PHC Shirur North">PHC Shirur North</option>
                  <option value="PHC Khed Rural">PHC Khed Rural</option>
                  <option value="PHC Daund South">PHC Daund South</option>
                  <option value="PHC Indapur East">PHC Indapur East</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label htmlFor="risk-filter" className="sr-only">
                  Filter Risk Level
                </label>
                <select
                  id="risk-filter"
                  value={riskFilter}
                  onChange={(e) => setRiskFilter(e.target.value)}
                  className="block w-full px-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Critical">Critical (&lt; 3 Days)</option>
                  <option value="High">High (&lt; 7 Days)</option>
                  <option value="Low">Low (&gt; 15 Days)</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setPhcFilter('All');
                    setRiskFilter('All');
                  }}
                  className="w-full inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-md text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-4 py-3">Medicine & Code</th>
                  <th scope="col" className="px-4 py-3">Facility (PHC)</th>
                  <th scope="col" className="px-4 py-3">Current Stock</th>
                  <th scope="col" className="px-4 py-3">Predicted Demand</th>
                  <th scope="col" className="px-4 py-3">Days to Stock-Out</th>
                  <th scope="col" className="px-4 py-3">Risk Level</th>
                  <th scope="col" className="px-4 py-3">AI Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredRiskItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No medicines match the selected filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredRiskItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Medicine */}
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          {item.medicine}
                          {item.isColdChain && (
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-50 text-sky-700 border border-sky-200"
                              title="Cold-chain monitored"
                            >
                              ❄ Cold-Chain
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {item.category} &bull; <span className="font-mono">{item.code}</span>
                        </div>
                      </td>

                      {/* PHC */}
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800">{item.phc}</div>
                        <div className="text-[11px] text-slate-400">{item.district} District</div>
                      </td>

                      {/* Current Stock */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.currentStock.toLocaleString()}
                        </span>{' '}
                        <span className="text-[11px] text-slate-500">{item.unit}</span>
                      </td>

                      {/* Predicted Demand */}
                      <td className="px-4 py-3 whitespace-nowrap text-slate-700">
                        <strong className="text-slate-900">{item.predictedDemand}</strong> {item.unit} / day
                      </td>

                      {/* Days until stockout */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            item.daysUntilStockout < 2
                              ? 'text-rose-700 font-mono text-sm'
                              : item.daysUntilStockout < 5
                              ? 'text-amber-700 font-mono'
                              : 'text-emerald-700 font-mono'
                          }`}
                        >
                          {item.daysUntilStockout} Days
                        </span>
                      </td>

                      {/* Risk Level Badge */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${item.riskBadge}`}>
                          {item.riskLevel}
                        </span>
                      </td>

                      {/* Recommended Action */}
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-800 font-medium">
                          {item.recommendedAction}
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
            {filteredRiskItems.map((item) => (
              <div key={item.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.medicine}</h3>
                    <p className="text-[11px] text-slate-500">{item.phc}</p>
                  </div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${item.riskBadge}`}>
                    {item.riskLevel}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Current Stock:</span>
                    <span className="font-bold text-slate-900">{item.currentStock} {item.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Days Remaining:</span>
                    <span className="font-bold text-rose-700">{item.daysUntilStockout} Days</span>
                  </div>
                </div>

                <div className="text-[11px] bg-slate-50 p-2 rounded border border-slate-200/80 text-slate-700 mt-2">
                  <strong className="text-sky-800">AI Recommendation:</strong> {item.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4 & Section 5: Demand Forecast & AI Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Section 4: Demand Forecast with CSS Visual Bars (7 Cols) */}
          <section
            aria-labelledby="demand-forecast-heading"
            className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 id="demand-forecast-heading" className="text-base font-bold text-slate-900">
                    Demand Forecast & Surge Trajectories
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comparison of current daily demand against algorithmically projected demand surge horizons.
                  </p>
                </div>
                <div className="flex items-center space-x-1.5 self-start sm:self-auto">
                  <span className="text-[11px] font-semibold text-slate-500">Period:</span>
                  <select
                    value={forecastPeriod}
                    onChange={(e) => setForecastPeriod(e.target.value)}
                    className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="7">Next 7 Days</option>
                    <option value="14">Next 14 Days</option>
                    <option value="30">Next 30 Days</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {demandForecasts.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{item.medicine}</span>
                        <span className="text-[11px] text-slate-500">{item.category}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${item.trendColor}`}>
                          {item.expectedChange}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">
                          Horizon: {item.forecastHorizon}
                        </span>
                      </div>
                    </div>

                    {/* CSS-based Demand Comparison Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>Baseline: <strong>{item.currentDailyDemand} units/day</strong></span>
                        <span>Forecast: <strong className="text-slate-900">{item.predictedDailyDemand} units/day</strong></span>
                      </div>

                      {/* Visual Demand Progress Stack */}
                      <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden flex">
                        <div
                          className="bg-sky-600 h-full rounded-l-full"
                          style={{ width: `${item.currentCapacityPct}%` }}
                          title={`Current Demand: ${item.currentDailyDemand}`}
                        />
                        <div
                          className="bg-rose-500 h-full rounded-r-full"
                          style={{ width: `${item.predictedCapacityPct - item.currentCapacityPct}%` }}
                          title={`Projected Surge Increment: +${item.percentageChange}%`}
                        />
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Current Baseline Load</span>
                        <span className="text-rose-600 font-semibold">+ Surge Load</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Projection based on rolling multi-year epidemiological seasonality.</span>
              <span className="font-semibold text-sky-700">No External Libraries</span>
            </div>
          </section>

          {/* Section 5: AI Recommendations (5 Cols) */}
          <section
            aria-labelledby="ai-recommendations-heading"
            className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-xs p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 id="ai-recommendations-heading" className="text-base font-bold text-slate-900">
                    Actionable AI Recommendations
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Prescriptive operational interventions generated by optimization algorithms.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
                  4 Active
                </span>
              </div>

              <div className="mt-4 space-y-3.5">
                {aiRecommendations.map((rec) => (
                  <article key={rec.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900 leading-tight">
                          {rec.title}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold border shrink-0 ${rec.priorityBadge}`}>
                        {rec.priority}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500" dangerouslySetInnerHTML={{ __html: rec.relatedEntity }} />

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rec.reason}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-700 font-semibold">
                        {rec.confidence}
                      </span>
                      <Link
                        href={rec.actionLink}
                        className="inline-flex items-center text-xs font-semibold text-sky-700 hover:text-sky-800"
                      >
                        {rec.actionText} &rarr;
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-500">
                All algorithmic recommendations can be authorized directly via the Transfers workspace.
              </span>
            </div>
          </section>
        </div>

        {/* Section 7: Forecast Methodology & Pipeline Information */}
        <section
          aria-labelledby="methodology-heading"
          className="bg-slate-900 text-slate-200 rounded-lg p-6 shadow-sm border border-slate-800"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-400/30">
                  Architecture Overview
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Pipeline: HSCIP-ML-V2
                </span>
              </div>
              <h2 id="methodology-heading" className="text-base font-bold text-white mt-1">
                Predictive Analytics & Stock-out Forecasting Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Demonstration schematic explaining how data flows from rural dispensaries into time-series predictive demand models.
              </p>
            </div>
            <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 self-start md:self-auto">
              Informational Demo UI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mt-5">
            {/* Step 1 */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Step 01
                </span>
                <h3 className="text-xs font-bold text-white mt-1">Historical Ingestion</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  3-year rolling dispensation logs across 2,840 primary health centres.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-700">
                Source: PHC Daily Registers
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Step 02
                </span>
                <h3 className="text-xs font-bold text-white mt-1">Real-Time Telemetry</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Live stock count, reefer temperature telemetry, and active transit status.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-700">
                Source: IoT & ILR Loggers
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Step 03
                </span>
                <h3 className="text-xs font-bold text-white mt-1">Seasonal Vectors</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Weather patterns, monsoon flood indices, and epidemiological disease curves.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-700">
                Source: State Health Met Data
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Step 04
                </span>
                <h3 className="text-xs font-bold text-white mt-1">Demand Forecasting</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Time-series projection of expected daily depletion across 7, 14, and 30-day horizons.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-700">
                Model: ARIMA / Prophet / LSTM
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">
                  Step 05
                </span>
                <h3 className="text-xs font-bold text-white mt-1">Stock-Out Triage</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Deficit modeling: Critical &lt;3d, High &lt;7d, Med &lt;15d, Low &gt;15d.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-700">
                Safety Stock Delta Check
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-3.5 rounded-lg bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Step 06
                </span>
                <h3 className="text-xs font-bold text-white mt-1">Prescriptive Actions</h3>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Automated rebalancing suggestions and inter-facility transfer manifest creation.
                </p>
              </div>
              <div className="text-[10px] text-slate-500 mt-3 pt-2 border-t border-slate-700">
                Action: Dispatch Pipeline
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
