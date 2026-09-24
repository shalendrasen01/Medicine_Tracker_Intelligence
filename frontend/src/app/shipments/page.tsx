'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

export type ShipmentStatus =
  | 'Pending Dispatch'
  | 'Dispatched'
  | 'In Transit'
  | 'Delayed'
  | 'Delivered'
  | 'Cancelled';

export type ShipmentPriority = 'Urgent' | 'High' | 'Medium' | 'Standard';

export interface ShipmentRecord {
  id: string;
  shipmentCode: string;
  transferId: string;
  medicine: string;
  dosageForm: string;
  quantity: number;
  unit: string;
  sourcePhc: string;
  sourceDistrict: string;
  destinationPhc: string;
  destinationDistrict: string;
  vehicle: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  coordinatorName: string;
  status: ShipmentStatus;
  priority: ShipmentPriority;
  eta: string;
  dispatchTime: string;
  currentLocation: string;
  currentStage: string;
  progressPercent: number;
  tempChamber: string;
  tempStatus: 'normal' | 'warning' | 'alert' | 'ambient';
  delayDuration?: string;
  delayReason?: string;
  recommendedAction?: string;
  batchNumber: string;
  lastPing: string;
}

export interface ActivityEvent {
  id: string;
  shipmentCode: string;
  eventType:
    | 'Shipment dispatched'
    | 'Shipment entered transit'
    | 'ETA updated'
    | 'Shipment delayed'
    | 'Shipment delivered';
  timestamp: string;
  actor: string;
  actorRole: string;
  details: string;
}

export default function ShipmentsFleetPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [timeframeFilter, setTimeframeFilter] = useState('All');

  // UI Interactive States
  const [selectedShipment, setSelectedShipment] = useState<ShipmentRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isNewManifestModalOpen, setIsNewManifestModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Shipments & Fleet' },
  ];

  // Static Demonstration Shipments Dataset
  const [shipments, setShipments] = useState<ShipmentRecord[]>([
    {
      id: 'SHP-2026-8812',
      shipmentCode: 'SHP-8812',
      transferId: 'TRF-0901',
      medicine: 'Snake Antivenom (Polyvalent Lyophilized)',
      dosageForm: '10ml Injectable Vial',
      quantity: 15,
      unit: 'vials',
      sourcePhc: 'PHC Junnar Rural',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Ambegaon Central',
      destinationDistrict: 'Pune',
      vehicle: 'Reefer Van MH-14-GH-2219',
      vehicleType: 'Active Cold-Chain Van (+2°C to +8°C)',
      driverName: 'Rajesh Kumar',
      driverPhone: '+91 98230-11204',
      coordinatorName: 'K. Deshmukh (Pune District Fleet)',
      status: 'In Transit',
      priority: 'Urgent',
      eta: '13:45 Today (~25 mins)',
      dispatchTime: '23 Sep 2026, 11:20 AM',
      currentLocation: 'Narayangaon Bypass (Mile 24 of 38 km)',
      currentStage: 'In Transit - Final Highway Corridor',
      progressPercent: 68,
      tempChamber: '+3.8°C',
      tempStatus: 'normal',
      batchNumber: 'SAV-2026-B812',
      lastPing: '2 mins ago',
    },
    {
      id: 'SHP-2026-8815',
      shipmentCode: 'SHP-8815',
      transferId: 'TRF-0902',
      medicine: 'Rabies Vaccine (PVRV Human)',
      dosageForm: '0.5ml Reconstituted Vial',
      quantity: 40,
      unit: 'doses',
      sourcePhc: 'PHC Khed Rural',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Junnar Rural',
      destinationDistrict: 'Pune',
      vehicle: 'Insulated Van Carrier MH-12-BQ-8831',
      vehicleType: 'Insulated Cold Carrier Unit',
      driverName: 'Suresh Shinde',
      driverPhone: '+91 94220-44912',
      coordinatorName: 'K. Deshmukh (Pune District Fleet)',
      status: 'In Transit',
      priority: 'Urgent',
      eta: '14:15 Today (~50 mins)',
      dispatchTime: '23 Sep 2026, 11:45 AM',
      currentLocation: 'Chakan Industrial Outer Ring (Mile 16 of 29 km)',
      currentStage: 'In Transit - Midpoint Checkpoint',
      progressPercent: 55,
      tempChamber: '+4.2°C',
      tempStatus: 'normal',
      batchNumber: 'PVRV-MH-9941',
      lastPing: '4 mins ago',
    },
    {
      id: 'SHP-2026-8819',
      shipmentCode: 'SHP-8819',
      transferId: 'TRF-0895',
      medicine: 'Amoxicillin Oral Suspension 250mg/5ml',
      dosageForm: '60ml Dry Powder Bottle',
      quantity: 80,
      unit: 'bottles',
      sourcePhc: 'PHC Baramati North',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Indapur Rural',
      destinationDistrict: 'Pune',
      vehicle: 'Logistics Van MH-14-GH-3022',
      vehicleType: 'Standard Cargo Van',
      driverName: 'Vikas Jadhav',
      driverPhone: '+91 98901-22450',
      coordinatorName: 'M. Shinde (Baramati Regional Fleet)',
      status: 'Delayed',
      priority: 'High',
      eta: '15:30 Today (+55m revised)',
      dispatchTime: '23 Sep 2026, 10:15 AM',
      currentLocation: 'State Highway 52 Ghat Pass (Mile 14 of 34 km)',
      currentStage: 'Delayed - Inclement Weather Detour',
      progressPercent: 42,
      tempChamber: '+22.5°C',
      tempStatus: 'ambient',
      delayDuration: '55 mins',
      delayReason: 'Heavy monsoon flash waterlogging and tree debris clearance at Ghat pass.',
      recommendedAction: 'Automated alternate route via Chakan bypass assigned; receiving facility informed of revised delivery window.',
      batchNumber: 'AMX-2026-092',
      lastPing: 'Just now',
    },
    {
      id: 'SHP-2026-8822',
      shipmentCode: 'SHP-8822',
      transferId: 'TRF-0899',
      medicine: 'Oxytocin Injection 10 IU/ml',
      dosageForm: '1ml Glass Ampoule',
      quantity: 60,
      unit: 'ampoules',
      sourcePhc: 'PHC Shirur Central',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Ambegaon Central',
      destinationDistrict: 'Pune',
      vehicle: 'Cold Courier Unit MH-12-RN-5541',
      vehicleType: 'High-Speed Medical Express Reefer',
      driverName: 'Amit Deshmukh',
      driverPhone: '+91 97654-32110',
      coordinatorName: 'K. Deshmukh (Pune District Fleet)',
      status: 'Pending Dispatch',
      priority: 'Urgent',
      eta: '16:30 Today',
      dispatchTime: 'Estimated 12:45 PM',
      currentLocation: 'PHC Shirur Central Loading Dock',
      currentStage: 'Pre-Departure Cold-Chain Audit',
      progressPercent: 12,
      tempChamber: '+3.1°C',
      tempStatus: 'normal',
      batchNumber: 'OXY-IN-4421',
      lastPing: '8 mins ago',
    },
    {
      id: 'SHP-2026-8810',
      shipmentCode: 'SHP-8810',
      transferId: 'TRF-0890',
      medicine: 'Oral Rehydration Salts (ORS IP) & Zinc 20mg',
      dosageForm: 'Combo Rehydration Kit',
      quantity: 500,
      unit: 'sachets',
      sourcePhc: 'PHC Junnar Rural',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Haveli East',
      destinationDistrict: 'Pune',
      vehicle: 'Fast Dispatch Courier MH-12-CV-7811',
      vehicleType: 'Light Cargo Van',
      driverName: 'Nitin Chavan',
      driverPhone: '+91 91580-99881',
      coordinatorName: 'R. Thorat (Sub-depot Hub)',
      status: 'Dispatched',
      priority: 'High',
      eta: '14:45 Today (~1 hr 20m)',
      dispatchTime: '23 Sep 2026, 12:10 PM',
      currentLocation: 'Departed Junnar Regional Gate (Mile 6 of 52 km)',
      currentStage: 'Dispatched - En Route to Pune Arterial Highway',
      progressPercent: 24,
      tempChamber: '+24.1°C',
      tempStatus: 'ambient',
      batchNumber: 'ORS-ZN-6601',
      lastPing: '10 mins ago',
    },
    {
      id: 'SHP-2026-8804',
      shipmentCode: 'SHP-8804',
      transferId: 'TRF-0888',
      medicine: 'Metformin Hydrochloride 500mg Tablets',
      dosageForm: 'Blister Strip 10x10',
      quantity: 4000,
      unit: 'tablets',
      sourcePhc: 'Sub-store Chakan Regional',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Daund South',
      destinationDistrict: 'Pune',
      vehicle: 'District Supply Truck MH-12-PQ-9102',
      vehicleType: 'Heavy Multi-Facility Cargo Truck',
      driverName: 'Mahesh Ghadge',
      driverPhone: '+91 98223-34455',
      coordinatorName: 'R. Thorat (Sub-depot Hub)',
      status: 'Delivered',
      priority: 'Standard',
      eta: 'Delivered (Yesterday 17:40)',
      dispatchTime: '22 Sep 2026, 01:15 PM',
      currentLocation: 'PHC Daund South (Handover Confirmed)',
      currentStage: 'Completed - Manifest Signed',
      progressPercent: 100,
      tempChamber: '+23.0°C',
      tempStatus: 'ambient',
      batchNumber: 'MET-500-1120',
      lastPing: 'Yesterday',
    },
    {
      id: 'SHP-2026-8798',
      shipmentCode: 'SHP-8798',
      transferId: 'TRF-0882',
      medicine: 'N95 Particulate Respirator Masks & Sterile Gloves',
      dosageForm: 'Box of 50 Pieces',
      quantity: 200,
      unit: 'pieces',
      sourcePhc: 'PHC Khed Rural',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Bhor West',
      destinationDistrict: 'Pune',
      vehicle: 'Routine Courier Unit #05',
      vehicleType: 'Utility Dispatch Van',
      driverName: 'Sunil Kamble',
      driverPhone: '+91 94231-77889',
      coordinatorName: 'M. Shinde (Baramati Regional Fleet)',
      status: 'Delivered',
      priority: 'Medium',
      eta: 'Delivered (22 Sep 16:15)',
      dispatchTime: '22 Sep 2026, 10:00 AM',
      currentLocation: 'PHC Bhor West Medical Store Room',
      currentStage: 'Completed - Stock Logged',
      progressPercent: 100,
      tempChamber: '+24.5°C',
      tempStatus: 'ambient',
      batchNumber: 'PPE-N95-2026',
      lastPing: '22 Sep',
    },
    {
      id: 'SHP-2026-8791',
      shipmentCode: 'SHP-8791',
      transferId: 'TRF-0879',
      medicine: 'Ceftriaxone Sodium 1g Powder for Injection',
      dosageForm: 'Single Dose Dry Vial',
      quantity: 50,
      unit: 'vials',
      sourcePhc: 'PHC Daund South',
      sourceDistrict: 'Pune',
      destinationPhc: 'PHC Manchar Rural',
      destinationDistrict: 'Pune',
      vehicle: 'Unassigned',
      vehicleType: 'Cargo Van',
      driverName: 'Unassigned',
      driverPhone: 'N/A',
      coordinatorName: 'District Health Administration',
      status: 'Cancelled',
      priority: 'Standard',
      eta: 'Cancelled by District Administration',
      dispatchTime: 'Cancelled',
      currentLocation: 'Transfer Requisition Rescinded',
      currentStage: 'Cancelled',
      progressPercent: 0,
      tempChamber: 'N/A',
      tempStatus: 'ambient',
      batchNumber: 'CEF-1G-8802',
      lastPing: '20 Sep',
    },
  ]);

  // Recent Shipment Activity Feed
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    {
      id: 'ACT-SHP-01',
      shipmentCode: 'SHP-8819',
      eventType: 'Shipment delayed',
      timestamp: '18 mins ago',
      actor: 'Vikas Jadhav',
      actorRole: 'Fleet Driver',
      details: 'Reported heavy waterlogging on State Highway 52 Ghat section. Route recalculation underway.',
    },
    {
      id: 'ACT-SHP-02',
      shipmentCode: 'SHP-8812',
      eventType: 'Shipment entered transit',
      timestamp: '32 mins ago',
      actor: 'Rajesh Kumar',
      actorRole: 'Fleet Driver',
      details: 'Cleared Narayangaon toll checkpoint; cold-chain chamber telemetry holding steady at +3.8°C.',
    },
    {
      id: 'ACT-SHP-03',
      shipmentCode: 'SHP-8810',
      eventType: 'Shipment dispatched',
      timestamp: '12:10 PM today',
      actor: 'R. Thorat',
      actorRole: 'Sub-depot Dispatcher',
      details: '500 sachets ORS loaded into Courier MH-12-CV-7811; security seal #0912 verified.',
    },
    {
      id: 'ACT-SHP-04',
      shipmentCode: 'SHP-8815',
      eventType: 'ETA updated',
      timestamp: '11:45 AM today',
      actor: 'Automated Route Telemetry',
      actorRole: 'Fleet System',
      details: 'ETA revised to 14:15 following slight traffic congestion along Chakan bypass.',
    },
    {
      id: 'ACT-SHP-05',
      shipmentCode: 'SHP-8804',
      eventType: 'Shipment delivered',
      timestamp: 'Yesterday 17:40',
      actor: 'Mahesh Ghadge & Pharmacist',
      actorRole: 'Driver & Receiving Pharmacist',
      details: '4,000 tabs Metformin handed over at PHC Daund South; electronic bill-of-lading stamped.',
    },
  ]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const active = shipments.filter(
      (s) => s.status === 'Pending Dispatch' || s.status === 'Dispatched' || s.status === 'In Transit' || s.status === 'Delayed'
    ).length;
    const pendingDispatch = shipments.filter((s) => s.status === 'Pending Dispatch').length;
    const inTransit = shipments.filter((s) => s.status === 'In Transit').length;
    const dueToday = shipments.filter(
      (s) => s.status !== 'Delivered' && s.status !== 'Cancelled' && s.eta.toLowerCase().includes('today')
    ).length;
    const delayed = shipments.filter((s) => s.status === 'Delayed').length;
    const deliveredThisWeek = shipments.filter((s) => s.status === 'Delivered').length + 16; // Static realistic baseline
    return { active, pendingDispatch, inTransit, dueToday, delayed, deliveredThisWeek };
  }, [shipments]);

  // Distinct Source and Destination PHCs for Filter Dropdowns
  const uniqueSourcePhcs = useMemo(() => {
    const list = Array.from(new Set(shipments.map((s) => s.sourcePhc)));
    return ['All', ...list];
  }, [shipments]);

  const uniqueDestinationPhcs = useMemo(() => {
    const list = Array.from(new Set(shipments.map((s) => s.destinationPhc)));
    return ['All', ...list];
  }, [shipments]);

  // Filtered Shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchSearch =
        searchQuery === '' ||
        s.shipmentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.transferId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sourcePhc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.destinationPhc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.vehicle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || s.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || s.priority === priorityFilter;
      const matchSource = sourceFilter === 'All' || s.sourcePhc === sourceFilter;
      const matchDestination =
        destinationFilter === 'All' || s.destinationPhc === destinationFilter;

      return matchSearch && matchStatus && matchPriority && matchSource && matchDestination;
    });
  }, [shipments, searchQuery, statusFilter, priorityFilter, sourceFilter, destinationFilter]);

  // Filter for Active Shipments Section (In Transit / Dispatched / Pending Dispatch)
  const activeShipmentsList = useMemo(() => {
    return shipments.filter(
      (s) => s.status === 'In Transit' || s.status === 'Dispatched' || s.status === 'Pending Dispatch'
    );
  }, [shipments]);

  // Filter for Delayed Shipments Section
  const delayedShipmentsList = useMemo(() => {
    return shipments.filter((s) => s.status === 'Delayed');
  }, [shipments]);

  // Action Handlers (UI-only in-memory state manipulation)
  const handleMarkDelivered = (id: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: 'Delivered',
              progressPercent: 100,
              eta: 'Delivered Just Now',
              currentStage: 'Completed - Handover Confirmed',
              currentLocation: `${s.destinationPhc} (Dispensary)`,
              lastPing: 'Just now',
            }
          : s
      )
    );
    const target = shipments.find((s) => s.id === id);
    if (target) {
      setActivityFeed((prev) => [
        {
          id: `ACT-SHP-${Date.now()}`,
          shipmentCode: target.shipmentCode,
          eventType: 'Shipment delivered',
          timestamp: 'Just now',
          actor: `${target.driverName} & Receiving MO`,
          actorRole: 'Delivery Team',
          details: `Consignment ${target.shipmentCode} (${target.quantity} ${target.unit} ${target.medicine}) verified and signed into dispensary stock.`,
        },
        ...prev,
      ]);
      setNotificationMessage(
        `Shipment ${target.shipmentCode} marked as Delivered! Destination stock ledger updated.`
      );
      setTimeout(() => setNotificationMessage(null), 5000);
    }
    if (selectedShipment && selectedShipment.id === id) {
      setSelectedShipment((prev) =>
        prev
          ? {
              ...prev,
              status: 'Delivered',
              progressPercent: 100,
              eta: 'Delivered Just Now',
            }
          : null
      );
    }
  };

  const handleUpdateStatus = (id: string, newStatus: ShipmentStatus) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: newStatus,
              lastPing: 'Just now',
            }
          : s
      )
    );
    const target = shipments.find((s) => s.id === id);
    if (target) {
      setActivityFeed((prev) => [
        {
          id: `ACT-SHP-${Date.now()}`,
          shipmentCode: target.shipmentCode,
          eventType: 'ETA updated',
          timestamp: 'Just now',
          actor: 'Logistics Coordinator',
          actorRole: 'Fleet Admin',
          details: `Status of ${target.shipmentCode} manually updated to ${newStatus}.`,
        },
        ...prev,
      ]);
      setNotificationMessage(`Shipment ${target.shipmentCode} status changed to ${newStatus}.`);
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setSourceFilter('All');
    setDestinationFilter('All');
    setTimeframeFilter('All');
  };

  const openDetails = (shipment: ShipmentRecord) => {
    setSelectedShipment(shipment);
    setIsDetailModalOpen(true);
  };

  const openContact = (shipment: ShipmentRecord) => {
    setSelectedShipment(shipment);
    setIsContactModalOpen(true);
  };

  // Helper Badge Renderers
  const renderStatusBadge = (status: ShipmentStatus) => {
    switch (status) {
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-300">
            <svg
              className="w-3 h-3 text-sky-600 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            In Transit
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Delayed
          </span>
        );
      case 'Pending Dispatch':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
            Pending Dispatch
          </span>
        );
      case 'Dispatched':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            Dispatched
          </span>
        );
      case 'Delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Delivered
          </span>
        );
      case 'Cancelled':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Cancelled
          </span>
        );
    }
  };

  const renderPriorityBadge = (priority: ShipmentPriority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
            Medium
          </span>
        );
      case 'Standard':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            Standard
          </span>
        );
    }
  };

  // Header Actions UI
  const headerActions = (
    <div className="flex flex-wrap items-center gap-2.5">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-sky-50 border border-sky-200 rounded-lg text-xs font-semibold text-sky-900">
        <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
        <span>Fleet GPS &amp; Reefer Sensor Telemetry Active</span>
      </div>

      <button
        onClick={() => {
          setNotificationMessage('Shipment routing manifests downloaded in secure PDF format.');
          setTimeout(() => setNotificationMessage(null), 4000);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
      >
        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export Manifests
      </button>

      <button
        onClick={() => setIsNewManifestModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-colors shadow-xs"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        New Dispatch Manifest
      </button>
    </div>
  );

  return (
    <DashboardLayout
      title="Shipments & Fleet"
      description="Real-time execution, tracking, and telemetry monitoring for approved healthcare resource transfers from dispatch to delivery."
      roleBadge="Logistics & Fleet Operations"
      currentRole="logistics"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      lastUpdated="Live Telemetry Sync"
      headerActions={headerActions}
    >
      <div className="space-y-6">
        {/* User Notification Toast */}
        {notificationMessage && (
          <div
            role="alert"
            className="flex items-center justify-between p-4 bg-sky-50 border border-sky-300 rounded-xl shadow-sm text-sky-950 animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-sky-200 text-sky-800 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold">{notificationMessage}</p>
            </div>
            <button
              onClick={() => setNotificationMessage(null)}
              className="text-sky-700 hover:text-sky-900 text-xs font-bold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Shipment KPI Cards */}
        <section aria-labelledby="shipment-kpi-heading">
          <h2 id="shipment-kpi-heading" className="sr-only">
            Shipment Operations Key Metrics
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <StatCard
              title="Active Shipments"
              value={kpis.active}
              description="Vehicles on route/scheduled"
              badge="Fleet Active"
              icon={
                <svg className="w-5 h-5 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              }
            />

            <StatCard
              title="Pending Dispatch"
              value={kpis.pendingDispatch}
              description="Pre-departure staging"
              badge="Staging Area"
              icon={
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <StatCard
              title="In Transit"
              value={kpis.inTransit}
              description="Live highway transport"
              trend={{
                value: 'On Schedule',
                direction: 'up',
                isPositive: true,
              }}
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              }
            />

            <StatCard
              title="Deliveries Due Today"
              value={kpis.dueToday}
              description="Expected before 20:00"
              badge="Daily Target"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Delayed Shipments"
              value={kpis.delayed}
              description="Active weather/road alerts"
              badge="Attention"
              trend={{
                value: 'Rerouting Active',
                direction: 'down',
                isPositive: false,
              }}
              icon={
                <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Delivered This Week"
              value={kpis.deliveredThisWeek}
              description="Full chain verified"
              trend={{
                value: '+8% vs prev week',
                direction: 'up',
                isPositive: true,
              }}
              icon={
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              }
            />
          </div>
        </section>

        {/* 2. Delayed Shipments Alert Section (Requirement 7) */}
        {delayedShipmentsList.length > 0 && (
          <section aria-labelledby="delayed-shipments-heading" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <h2 id="delayed-shipments-heading" className="text-base font-bold text-slate-900">
                  Delayed Shipments Requiring Intervention ({delayedShipmentsList.length})
                </h2>
              </div>
              <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                Logistics Incident Active
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {delayedShipmentsList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-rose-200 shadow-sm p-4.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                          {item.shipmentCode}
                        </span>
                        <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {item.transferId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          +{item.delayDuration} Delay
                        </span>
                        {renderPriorityBadge(item.priority)}
                      </div>
                    </div>

                    {/* Medicine & Route */}
                    <h3 className="text-base font-bold text-slate-900">{item.medicine}</h3>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">
                      Quantity: <span className="text-slate-900 font-extrabold">{item.quantity} {item.unit}</span> ({item.dosageForm})
                    </div>

                    {/* Route Flow */}
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-800 my-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-emerald-700 font-bold">{item.sourcePhc}</span>
                      <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-indigo-700 font-bold">{item.destinationPhc}</span>
                    </div>

                    {/* Delay Details */}
                    <div className="space-y-1.5 text-xs">
                      <div className="p-2.5 bg-rose-50/80 rounded-lg border border-rose-200 text-rose-900">
                        <span className="font-bold">Delay Cause:</span> {item.delayReason}
                      </div>
                      <div className="p-2.5 bg-sky-50/80 rounded-lg border border-sky-200 text-sky-950">
                        <span className="font-bold">Recommended Mitigation:</span> {item.recommendedAction}
                      </div>
                    </div>

                    {/* Driver & Location */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                      <span>Location: <strong className="text-slate-700">{item.currentLocation}</strong></span>
                      <span>Carrier: <strong className="text-slate-700">{item.vehicle}</strong></span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openDetails(item)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      View Incident Manifest
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openContact(item)}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        Contact Driver ({item.driverName})
                      </button>
                      <button
                        onClick={() => {
                          setNotificationMessage(
                            `Dispatched automated priority detour to vehicle MH-14-GH-3022 navigation screen.`
                          );
                          setTimeout(() => setNotificationMessage(null), 4000);
                        }}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg transition-colors shadow-xs"
                      >
                        Push Reroute Directives
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. Active Shipment Tracking Section (Requirement 6) */}
        <section aria-labelledby="active-tracking-heading" className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                <h2 id="active-tracking-heading" className="text-base font-bold text-slate-900">
                  Active Shipment Progress &amp; Route Telemetry
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time milestone progress, chamber temperature verification, and estimated arrival intervals.
              </p>
            </div>
            <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-3 py-1 rounded-full border border-sky-200 self-start sm:self-auto">
              {activeShipmentsList.length} Consignments En Route
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeShipmentsList.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50/70 rounded-xl border border-slate-200/90 p-4 flex flex-col justify-between hover:border-sky-300 transition-colors shadow-2xs"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.shipmentCode}
                      </span>
                      {renderPriorityBadge(item.priority)}
                    </div>
                    {renderStatusBadge(item.status)}
                  </div>

                  {/* Resource */}
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.medicine}</h3>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {item.quantity} {item.unit} • {item.dosageForm}
                  </div>

                  {/* Directional Flow */}
                  <div className="flex items-center justify-between text-xs font-medium my-3 p-2 bg-white rounded-lg border border-slate-200/80">
                    <span className="text-emerald-700 font-bold truncate max-w-[42%]" title={item.sourcePhc}>
                      {item.sourcePhc}
                    </span>
                    <span className="text-slate-400 font-bold">→</span>
                    <span className="text-indigo-700 font-bold truncate max-w-[42%]" title={item.destinationPhc}>
                      {item.destinationPhc}
                    </span>
                  </div>

                  {/* Simple CSS Progress Bar */}
                  <div className="space-y-1.5 my-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Route Completion</span>
                      <span className="font-extrabold text-slate-800 font-mono">{item.progressPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          item.status === 'Delayed'
                            ? 'bg-rose-500'
                            : item.status === 'Pending Dispatch'
                            ? 'bg-amber-500'
                            : 'bg-sky-600'
                        }`}
                        style={{ width: `${item.progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                      <span className="truncate max-w-[65%]" title={item.currentLocation}>
                        Loc: {item.currentLocation}
                      </span>
                      <span className="font-semibold text-slate-700 shrink-0">{item.eta}</span>
                    </div>
                  </div>

                  {/* Cold Chain Chamber Status */}
                  <div className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200/70">
                    <span className="text-slate-500 font-medium">Cargo Chamber:</span>
                    <span className="font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {item.tempChamber} ({item.tempStatus.toUpperCase()})
                    </span>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openDetails(item)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    View Details
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openContact(item)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      Call Driver
                    </button>
                    <button
                      onClick={() => handleMarkDelivered(item.id)}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                    >
                      Mark Delivered
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Static Shipment Lifecycle Timeline Banner (Requirement 8) */}
        <section
          aria-labelledby="delivery-lifecycle-heading"
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-700/60"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5 border-b border-slate-700/80 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30 mb-1">
                Standard Logistics Lifecycle
              </span>
              <h2 id="delivery-lifecycle-heading" className="text-base sm:text-lg font-bold text-slate-100">
                End-to-End Healthcare Consignment Dispatch Progression
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Every approved medical transfer transitions through strict pre-departure temperature validation,
                driver custody seals, and real-time electronic bill-of-lading verification.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              State Delivery Compliance Rate: <span className="font-semibold text-emerald-300">98.6%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Stage 1 */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Authorization</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Transfer Approved</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Medical Officer signs off on lateral stock requisition.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Staging</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Dispatch Scheduled</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Carrier vehicle &amp; driver assigned; cold boxes packed.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold border border-indigo-400/30">
                  3
                </span>
                <span className="text-[10px] uppercase font-bold text-indigo-300">Departure</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Dispatched</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Vehicle clears origin facility gate with security seal # verified.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-sky-500/40 relative shadow-sm">
              <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-sky-500 text-slate-950 font-bold text-[9px] rounded-full uppercase">
                Active Tier
              </span>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center text-xs font-bold border border-sky-400/40">
                  4
                </span>
                <span className="text-[10px] uppercase font-bold text-sky-400">Highway</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">In Transit</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                GPS telemetry stream with ongoing temperature datalogging.
              </p>
            </div>

            {/* Stage 5 */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                  5
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400">Arrival</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Arrived at Dest</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Driver reaches destination receiving bay; cold box unsealed.
              </p>
            </div>

            {/* Stage 6 */}
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700">
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center text-xs font-bold border border-teal-400/30">
                  6
                </span>
                <span className="text-[10px] uppercase font-bold text-teal-400">Finalized</span>
              </div>
              <h3 className="text-xs font-bold text-slate-100">Delivered</h3>
              <p className="text-[11px] text-slate-400 mt-1">
                Dispensary ledger updated &amp; signed digital manifest issued.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Shipment Filters Toolbar (Requirement 3) */}
        <section
          aria-labelledby="filters-heading"
          className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <h2 id="filters-heading" className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter Consignments &amp; Fleet Routes
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-800">{filteredShipments.length}</strong> of{' '}
                <strong className="text-slate-800">{shipments.length}</strong> shipments
              </span>
              {(searchQuery ||
                statusFilter !== 'All' ||
                priorityFilter !== 'All' ||
                sourceFilter !== 'All' ||
                destinationFilter !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-1">
              <label htmlFor="shipment-search" className="block text-xs font-semibold text-slate-700 mb-1">
                Search Consignments
              </label>
              <div className="relative">
                <input
                  id="shipment-search"
                  type="text"
                  placeholder="ID, Medicine, PHC, Driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 placeholder-slate-400"
                />
                <svg
                  className="w-4 h-4 text-slate-400 absolute left-2.5 top-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Status Dropdown */}
            <div>
              <label htmlFor="status-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Shipment Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending Dispatch">Pending Dispatch</option>
                <option value="Dispatched">Dispatched</option>
                <option value="In Transit">In Transit</option>
                <option value="Delayed">Delayed</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label htmlFor="priority-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Tier
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent (Stockout Critical)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Standard">Standard Routine</option>
              </select>
            </div>

            {/* Source PHC */}
            <div>
              <label htmlFor="source-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Origin Facility
              </label>
              <select
                id="source-filter"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {uniqueSourcePhcs.map((phc) => (
                  <option key={phc} value={phc}>
                    {phc}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination PHC */}
            <div>
              <label htmlFor="dest-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Target Facility
              </label>
              <select
                id="dest-filter"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {uniqueDestinationPhcs.map((phc) => (
                  <option key={phc} value={phc}>
                    {phc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* 6. Main Shipment Tracking Table (Requirement 4) */}
        <section aria-labelledby="main-table-heading" className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 id="main-table-heading" className="text-base font-bold text-slate-900">
                Live Shipment &amp; Fleet Execution Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detailed consignment movement records, designated drivers, transport temperatures, and live delivery ETAs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Route Flow:</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Origin Source
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Target Destination
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-3.5">Shipment ID</th>
                  <th scope="col" className="py-3 px-3.5">Transfer ID</th>
                  <th scope="col" className="py-3 px-3.5">Resource / Medicine</th>
                  <th scope="col" className="py-3 px-3.5 text-right">Quantity</th>
                  <th scope="col" className="py-3 px-3.5">Source PHC</th>
                  <th scope="col" className="py-3 px-3.5 text-center">Route</th>
                  <th scope="col" className="py-3 px-3.5">Destination PHC</th>
                  <th scope="col" className="py-3 px-3.5">Vehicle</th>
                  <th scope="col" className="py-3 px-3.5">Driver / Phone</th>
                  <th scope="col" className="py-3 px-3.5">Status</th>
                  <th scope="col" className="py-3 px-3.5">ETA</th>
                  <th scope="col" className="py-3 px-3.5">Priority</th>
                  <th scope="col" className="py-3 px-3.5 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-10 text-center text-slate-500">
                      No shipment records found matching the active search and filter constraints.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors group"
                    >
                      {/* Shipment ID */}
                      <td className="py-3.5 px-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {item.shipmentCode}
                      </td>

                      {/* Transfer ID */}
                      <td className="py-3.5 px-3.5 font-mono text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-medium">
                          {item.transferId}
                        </span>
                      </td>

                      {/* Resource */}
                      <td className="py-3.5 px-3.5">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.medicine}</div>
                        <div className="text-[11px] text-slate-500">{item.dosageForm}</div>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-3.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.quantity.toLocaleString()}{' '}
                        <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-semibold text-slate-800">{item.sourcePhc}</span>
                        </div>
                      </td>

                      {/* Route Arrow */}
                      <td className="py-3.5 px-3.5 text-center">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-600 transition-colors">
                          →
                        </span>
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                          <span className="font-semibold text-slate-800">{item.destinationPhc}</span>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{item.vehicle}</div>
                        <div className="text-[10px] text-emerald-700 font-mono font-semibold">
                          Chamber: {item.tempChamber}
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{item.driverName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.driverPhone}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* ETA */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap font-medium text-slate-800">
                        {item.eta}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3.5 whitespace-nowrap">
                        {renderPriorityBadge(item.priority)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-3.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openDetails(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors"
                          >
                            Details
                          </button>
                          {item.status !== 'Delivered' && item.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleMarkDelivered(item.id)}
                              className="px-2 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                              title="Mark Delivered"
                            >
                              Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* 7. Lower Intelligence Grid: Activity Stream & Fleet Standards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Shipment Activity Feed (2 Cols) */}
          <section
            aria-labelledby="recent-activity-heading"
            className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h2 id="recent-activity-heading" className="text-sm font-bold text-slate-900">
                    Recent Fleet Events &amp; Electronic Manifest Log
                  </h2>
                </div>
                <span className="text-xs text-slate-500">Live Logistics Feed</span>
              </div>

              <div className="space-y-4">
                {activityFeed.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-3 relative">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border bg-slate-50 border-slate-200 text-slate-700 shadow-2xs">
                        {event.eventType === 'Shipment delivered' ? (
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : event.eventType === 'Shipment delayed' ? (
                          <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        ) : event.eventType === 'Shipment entered transit' ? (
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      {idx < activityFeed.length - 1 && (
                        <div className="w-0.5 h-10 bg-slate-200 mt-1"></div>
                      )}
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{event.eventType}</span>
                          <span className="text-xs font-mono font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded">
                            {event.shipmentCode}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{event.timestamp}</span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium mt-0.5">
                        {event.actor} • <span className="text-slate-500 font-normal">{event.actorRole}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {event.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-400">
              End of transmission records • State Health Logistics Infrastructure
            </div>
          </section>

          {/* Logistics SOP Guidelines (1 Col) */}
          <section
            aria-labelledby="fleet-sop-heading"
            className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <span className="p-1.5 bg-slate-800 text-sky-400 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                <h2 id="fleet-sop-heading" className="text-sm font-bold text-white">
                  Fleet Operational Standards
                </h2>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    Continuous Chamber Telemetry
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Vehicles transporting vaccines or antivenoms transmit real-time telemetry every 120 seconds. Any
                    excursion beyond +2°C to +8°C automatically alerts the State Monitoring Center.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Dual Physical Security Seals
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Serialized tamper-evident tags must match manifest records upon dispatch and arrival. Broken
                    seals require immediate medical officer inspection before inventory acceptance.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Electronic Proof-of-Delivery
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Receiving pharmacists scan consignment QR codes upon delivery, synchronizing balance registers
                    and relieving the carrier of chain-of-custody liability.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Fleet Regulation: GOV-LOG-2026</span>
              <span className="text-sky-400 font-medium">On-Time Rate: 97.4%</span>
            </div>
          </section>
        </div>
      </div>

      {/* 8. Shipment Details Modal (Requirement 9) */}
      {isDetailModalOpen && selectedShipment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-shipment-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-800 border border-slate-700 rounded text-sky-300">
                    {selectedShipment.shipmentCode}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-mono font-medium bg-slate-800 text-slate-300 rounded">
                    Transfer Ref: {selectedShipment.transferId}
                  </span>
                  {renderPriorityBadge(selectedShipment.priority)}
                  {renderStatusBadge(selectedShipment.status)}
                </div>
                <h3 id="modal-shipment-title" className="text-lg font-bold text-white">
                  {selectedShipment.medicine}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Vehicle: {selectedShipment.vehicle} • Dispatched: {selectedShipment.dispatchTime}
                </p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Close dialog"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Quantity</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedShipment.quantity.toLocaleString()} {selectedShipment.unit}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Chamber Temp</span>
                  <span className="text-base font-mono font-extrabold text-emerald-700">
                    {selectedShipment.tempChamber}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Progress</span>
                  <span className="text-base font-mono font-extrabold text-sky-800">
                    {selectedShipment.progressPercent}%
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Current ETA</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{selectedShipment.eta}</span>
                </div>
              </div>

              {/* Route Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Logistics Route Manifest
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Origin */}
                  <div className="flex-1 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left w-full">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block mb-1">
                      Origin Facility
                    </span>
                    <div className="font-bold text-sm text-slate-900">{selectedShipment.sourcePhc}</div>
                    <div className="text-[11px] text-slate-500">{selectedShipment.sourceDistrict} District</div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 mb-1">Transit Corridor</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
                      →
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="flex-1 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-left w-full">
                    <span className="text-[10px] font-bold uppercase text-indigo-800 tracking-wider block mb-1">
                      Destination Facility
                    </span>
                    <div className="font-bold text-sm text-slate-900">{selectedShipment.destinationPhc}</div>
                    <div className="text-[11px] text-slate-500">{selectedShipment.destinationDistrict} District</div>
                  </div>
                </div>
              </div>

              {/* Live Location & Stage */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">Current Milestone Stage:</span>
                  <span className="font-semibold text-sky-800">{selectedShipment.currentStage}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Current Physical Location:</span>
                  <span className="font-medium text-slate-800">{selectedShipment.currentLocation}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>Batch Serial Number:</span>
                  <span className="font-mono font-medium text-slate-800">{selectedShipment.batchNumber}</span>
                </div>
              </div>

              {/* Carrier & Crew Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Driver Details</span>
                  <div className="font-bold text-slate-900">{selectedShipment.driverName}</div>
                  <div className="text-slate-500 font-mono text-[11px]">{selectedShipment.driverPhone}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Fleet Coordinator</span>
                  <div className="font-bold text-slate-900">{selectedShipment.coordinatorName}</div>
                  <div className="text-slate-500 text-[11px]">State Logistics Command</div>
                </div>
              </div>

              {/* Delayed Advisory if applicable */}
              {selectedShipment.delayReason && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
                  <span className="font-bold block mb-1">Delay Report:</span>
                  <p>{selectedShipment.delayReason}</p>
                  <p className="mt-1 font-medium text-rose-800">
                    Action: {selectedShipment.recommendedAction}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                Last GPS ping: <strong className="text-slate-700">{selectedShipment.lastPing}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openContact(selectedShipment);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-800 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors"
                >
                  Contact Driver
                </button>
                {selectedShipment.status !== 'Delivered' && (
                  <button
                    onClick={() => {
                      handleMarkDelivered(selectedShipment.id);
                      setIsDetailModalOpen(false);
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-2xs"
                  >
                    Confirm Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Contact Coordinator / Driver Modal Dialog (Requirement 9) */}
      {isContactModalOpen && selectedShipment && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-contact-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 id="modal-contact-title" className="text-base font-bold text-white">
                  Fleet Driver Communications
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Consignment Ref: {selectedShipment.shipmentCode}
                </p>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 space-y-1">
                <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block">
                  Designated Carrier Driver
                </span>
                <div className="text-base font-bold text-slate-900">{selectedShipment.driverName}</div>
                <div className="text-xs font-mono font-semibold text-slate-700">
                  Mobile: {selectedShipment.driverPhone}
                </div>
                <div className="text-[11px] text-slate-500">
                  Vehicle: {selectedShipment.vehicle}
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  District Fleet Coordinator
                </span>
                <div className="font-bold text-slate-800">{selectedShipment.coordinatorName}</div>
                <div className="text-[11px] text-slate-500">Radio Channel: VHF Sub-Band 4 (District Net)</div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <span className="font-bold block mb-1">Simulated Direct Dispatch Call:</span>
                <p className="text-[11px]">
                  Driver is active on mobile frequency. In actual field deployment, this initiates a VOIP bridge to
                  the cabin hands-free terminal.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsContactModalOpen(false);
                    setNotificationMessage(
                      `Calling Driver ${selectedShipment.driverName} at ${selectedShipment.driverPhone}...`
                    );
                    setTimeout(() => setNotificationMessage(null), 4000);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-2xs"
                >
                  Dial Driver Mobile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. New Dispatch Manifest Modal Form (Frontend Demo) */}
      {isNewManifestModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-manifest-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 id="modal-manifest-title" className="text-base font-bold text-white">
                  Create New Dispatch Manifest
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Allocate vehicle, driver, and temperature logging sensors to an approved transfer.
                </p>
              </div>
              <button
                onClick={() => setIsNewManifestModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewManifestModalOpen(false);
                setNotificationMessage(
                  'Dispatch manifest created! Vehicle queued for pre-departure cold-chain audit.'
                );
                setTimeout(() => setNotificationMessage(null), 5000);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approved Transfer Reference
                </label>
                <select className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                  <option>TRF-0901: Snake Antivenom (PHC Junnar → PHC Ambegaon)</option>
                  <option>TRF-0902: Rabies Vaccine (PHC Khed → PHC Junnar)</option>
                  <option>TRF-0899: Oxytocin Injection (PHC Shirur → PHC Ambegaon)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Carrier Vehicle
                  </label>
                  <select className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                    <option>Reefer Van MH-14-GH-2219 (+2°C to +8°C)</option>
                    <option>Insulated Van MH-12-BQ-8831 (Cold Carrier)</option>
                    <option>Logistics Van MH-14-GH-3022 (Cargo)</option>
                    <option>Fast Dispatch Courier MH-12-CV-7811</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Fleet Driver
                  </label>
                  <select className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500">
                    <option>Rajesh Kumar (+91 98230-11204)</option>
                    <option>Suresh Shinde (+91 94220-44912)</option>
                    <option>Vikas Jadhav (+91 98901-22450)</option>
                    <option>Amit Deshmukh (+91 97654-32110)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Scheduled Departure Time
                  </label>
                  <input
                    type="text"
                    defaultValue="13:30 Today"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Cold-Chain Sensor Tag #
                  </label>
                  <input
                    type="text"
                    defaultValue="IOT-TEMP-9981"
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Routing &amp; Special Handling Instructions
                </label>
                <textarea
                  rows={3}
                  defaultValue="Maintain temperature between +2°C and +8°C. Priority transit via State Highway 52. Direct delivery to PHC emergency cold room."
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewManifestModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-700 hover:bg-sky-800 rounded-lg shadow-2xs"
                >
                  Issue Dispatch Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
