'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import StatCard from '../../components/dashboard/StatCard';

export type TransferStatus =
  | 'Pending'
  | 'Awaiting Approval'
  | 'Approved'
  | 'In Transit'
  | 'Delivered'
  | 'Rejected';

export type TransferPriority = 'Urgent' | 'High' | 'Medium' | 'Standard';

export interface TransferRecord {
  id: string;
  transferCode: string;
  medicine: string;
  dosageForm: string;
  category: string;
  sourcePhc: string;
  sourceDistrict: string;
  sourceAvailableStock: number;
  destinationPhc: string;
  destinationDistrict: string;
  destinationCurrentStock: number;
  quantity: number;
  unit: string;
  priority: TransferPriority;
  status: TransferStatus;
  requestedBy: string;
  requesterRole: string;
  requestedDate: string;
  lastUpdated: string;
  reason: string;
  isAiRecommended?: boolean;
  expectedImpact?: string;
  carrierVehicle?: string;
  temperatureRequirement?: string;
  batchNumber?: string;
  estimatedTransitTime?: string;
}

export interface AiRecommendation {
  id: string;
  recommendationCode: string;
  medicine: string;
  category: string;
  sourcePhc: string;
  sourceDistrict: string;
  sourceAvailableStock: number;
  sourceBufferMonths: string;
  destinationPhc: string;
  destinationDistrict: string;
  destinationShortageRisk: string;
  destinationCurrentStock: number;
  recommendedQuantity: number;
  unit: string;
  priority: TransferPriority;
  reason: string;
  expectedImpact: string;
  confidenceScore: number;
  distanceKm: number;
  estimatedTransitHours: number;
}

export interface ActivityEvent {
  id: string;
  transferId: string;
  eventType:
    | 'Transfer requested'
    | 'Transfer approved'
    | 'Shipment dispatched'
    | 'Transfer received'
    | 'Transfer rejected';
  timestamp: string;
  actor: string;
  actorRole: string;
  facility: string;
  notes: string;
}

export default function TransfersManagementPage() {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [destinationFilter, setDestinationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [timeframeFilter, setTimeframeFilter] = useState('All');

  // UI Modal / Action States
  const [selectedTransfer, setSelectedTransfer] = useState<TransferRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewTransferModalOpen, setIsNewTransferModalOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Resource Transfers' },
  ];

  // Static Realistic Demonstration Transfers Dataset
  const [transfers, setTransfers] = useState<TransferRecord[]>([
    {
      id: 'TRF-2026-0901',
      transferCode: 'TRF-0901',
      medicine: 'Snake Antivenom (Polyvalent Lyophilized)',
      dosageForm: '10ml Injectable Vial',
      category: 'Emergency Antivenom',
      sourcePhc: 'PHC Junnar Rural',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 54,
      destinationPhc: 'PHC Ambegaon Central',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 0,
      quantity: 15,
      unit: 'vials',
      priority: 'Urgent',
      status: 'Awaiting Approval',
      requestedBy: 'Dr. Anita Patil',
      requesterRole: 'Medical Officer In-Charge',
      requestedDate: '23 Sep 2026, 09:15 AM',
      lastUpdated: '18 mins ago',
      reason: 'Zero stock emergency: 2 suspected viper envenomations admitted; nearest district hospital is 45km away.',
      isAiRecommended: true,
      expectedImpact: 'Prevents stock-out mortality; protects critical 48-hour trauma emergency intake.',
      carrierVehicle: 'Reefer Van MH-12-RN-5541 (Cold-chain active)',
      temperatureRequirement: '+2°C to +8°C Cold Chain',
      batchNumber: 'SAV-2026-B812',
      estimatedTransitTime: '1 hr 15 mins (38 km)',
    },
    {
      id: 'TRF-2026-0902',
      transferCode: 'TRF-0902',
      medicine: 'Rabies Vaccine (PVRV Human)',
      dosageForm: '0.5ml Reconstituted Vial',
      category: 'Vaccine / Biological',
      sourcePhc: 'PHC Khed Rural',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 140,
      destinationPhc: 'PHC Junnar Rural',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 8,
      quantity: 40,
      unit: 'doses',
      priority: 'Urgent',
      status: 'Awaiting Approval',
      requestedBy: 'Dr. Sachin Narvekar',
      requesterRole: 'Deputy Medical Officer',
      requestedDate: '23 Sep 2026, 08:40 AM',
      lastUpdated: '45 mins ago',
      reason: 'Surge in canine bite reports across tribal belt; stock runway below 1.5 days.',
      isAiRecommended: true,
      expectedImpact: 'Restores mandatory 14-day post-exposure prophylaxis buffer for 12 villages.',
      carrierVehicle: 'Insulated Vaccine Carrier Box #04',
      temperatureRequirement: '+2°C to +8°C Cold Chain',
      batchNumber: 'PVRV-MH-9941',
      estimatedTransitTime: '55 mins (29 km)',
    },
    {
      id: 'TRF-2026-0899',
      transferCode: 'TRF-0899',
      medicine: 'Oxytocin Injection 10 IU/ml',
      dosageForm: '1ml Glass Ampoule',
      category: 'Maternal Health / Essential',
      sourcePhc: 'PHC Shirur Central',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 320,
      destinationPhc: 'PHC Ambegaon Central',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 12,
      quantity: 60,
      unit: 'ampoules',
      priority: 'Urgent',
      status: 'Pending',
      requestedBy: 'Sister S. Kulkarni',
      requesterRole: 'Head Maternity Staff Nurse',
      requestedDate: '23 Sep 2026, 10:05 AM',
      lastUpdated: '12 mins ago',
      reason: 'Maternity stabilization unit at 100% occupancy with 5 active labor inductions expected today.',
      isAiRecommended: true,
      expectedImpact: 'Averts postpartum hemorrhage risk for expectant mothers during institutional deliveries.',
      carrierVehicle: 'Dedicated Medical Courier Unit #2',
      temperatureRequirement: '+2°C to +8°C Cold Chain',
      batchNumber: 'OXY-IN-4421',
      estimatedTransitTime: '1 hr 30 mins (46 km)',
    },
    {
      id: 'TRF-2026-0895',
      transferCode: 'TRF-0895',
      medicine: 'Amoxicillin Oral Suspension 250mg/5ml',
      dosageForm: '60ml Dry Powder Bottle',
      category: 'Antibiotic / Pediatric',
      sourcePhc: 'PHC Baramati North',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 260,
      destinationPhc: 'PHC Indapur Rural',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 18,
      quantity: 80,
      unit: 'bottles',
      priority: 'High',
      status: 'Approved',
      requestedBy: 'Dr. Vivek Shinde',
      requesterRole: 'Child Health Officer',
      requestedDate: '22 Sep 2026, 04:30 PM',
      lastUpdated: '2 hrs ago',
      reason: 'Seasonal pediatric upper-respiratory tract infection outbreak following monsoon flash floods.',
      isAiRecommended: false,
      expectedImpact: 'Assures uninterrupted pediatric antimicrobial coverage for 80 children.',
      carrierVehicle: 'Logistics Van MH-14-GH-3022',
      temperatureRequirement: 'Ambient Controlled (< 25°C)',
      batchNumber: 'AMX-2026-092',
      estimatedTransitTime: '1 hr 10 mins (34 km)',
    },
    {
      id: 'TRF-2026-0890',
      transferCode: 'TRF-0890',
      medicine: 'Oral Rehydration Salts (ORS IP) & Zinc 20mg',
      dosageForm: 'Combo Rehydration Kit',
      category: 'Gastroenterology / Emergency',
      sourcePhc: 'PHC Junnar Rural',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 1850,
      destinationPhc: 'PHC Haveli East',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 65,
      quantity: 500,
      unit: 'sachets',
      priority: 'High',
      status: 'In Transit',
      requestedBy: 'Dr. Meena Gaikwad',
      requesterRole: 'District Epidemiologist',
      requestedDate: '22 Sep 2026, 02:15 PM',
      lastUpdated: '35 mins ago',
      reason: 'Localized water contamination advisory issued; proactive community dispensing initiated.',
      isAiRecommended: true,
      expectedImpact: 'Mitigates pediatric dehydration cases in high-risk taluka zones.',
      carrierVehicle: 'Fast Dispatch Courier MH-12-CV-7811',
      temperatureRequirement: 'Ambient Dry (< 30°C)',
      batchNumber: 'ORS-ZN-6601',
      estimatedTransitTime: 'Arriving in 25 mins',
    },
    {
      id: 'TRF-2026-0888',
      transferCode: 'TRF-0888',
      medicine: 'Metformin Hydrochloride 500mg Tablets',
      dosageForm: 'Blister Strip 10x10',
      category: 'NCD / Chronic Care',
      sourcePhc: 'Sub-store Chakan Regional',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 22000,
      destinationPhc: 'PHC Daund South',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 420,
      quantity: 4000,
      unit: 'tablets',
      priority: 'Standard',
      status: 'Delivered',
      requestedBy: 'Pharmacist R. Thorat',
      requesterRole: 'Dispensary Pharmacist',
      requestedDate: '21 Sep 2026, 11:00 AM',
      lastUpdated: 'Yesterday, 05:40 PM',
      reason: 'Monthly NCD clinic quota replenishment for registered diabetic cohort.',
      isAiRecommended: false,
      expectedImpact: 'Guaranteed 30-day supply for 130 registered chronic care patients.',
      carrierVehicle: 'District Supply Truck MH-12-PQ-9102',
      temperatureRequirement: 'Ambient Controlled (< 25°C)',
      batchNumber: 'MET-500-1120',
      estimatedTransitTime: 'Completed (Verified)',
    },
    {
      id: 'TRF-2026-0882',
      transferCode: 'TRF-0882',
      medicine: 'N95 Particulate Respirator Masks & Sterile Gloves',
      dosageForm: 'Box of 50 Pieces',
      category: 'PPE / Infection Control',
      sourcePhc: 'PHC Khed Rural',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 950,
      destinationPhc: 'PHC Bhor West',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 40,
      quantity: 200,
      unit: 'pieces',
      priority: 'Medium',
      status: 'Delivered',
      requestedBy: 'Facility Supervisor K. Joshi',
      requesterRole: 'Administrative Officer',
      requestedDate: '20 Sep 2026, 09:30 AM',
      lastUpdated: '22 Sep 2026',
      reason: 'Infection prevention protocol upgrade ahead of state healthcare accreditation review.',
      isAiRecommended: false,
      expectedImpact: 'Supplies surgical and casualty staff with certified respiratory protection.',
      carrierVehicle: 'Routine Courier Unit #05',
      temperatureRequirement: 'Standard Storage',
      batchNumber: 'PPE-N95-2026',
      estimatedTransitTime: 'Completed (Signed)',
    },
    {
      id: 'TRF-2026-0879',
      transferCode: 'TRF-0879',
      medicine: 'Ceftriaxone Sodium 1g Powder for Injection',
      dosageForm: 'Single Dose Dry Vial',
      category: 'Antibiotic / Broad Spectrum',
      sourcePhc: 'PHC Daund South',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 80,
      destinationPhc: 'PHC Manchar Rural',
      destinationDistrict: 'Pune',
      destinationCurrentStock: 120,
      quantity: 50,
      unit: 'vials',
      priority: 'Standard',
      status: 'Rejected',
      requestedBy: 'Dr. P. Gokhale',
      requesterRole: 'Medical Officer',
      requestedDate: '19 Sep 2026, 03:00 PM',
      lastUpdated: '20 Sep 2026',
      reason: 'Stock request rejected by district authority: Destination PHC had adequate 22-day runway; source buffer was below minimum threshold.',
      isAiRecommended: false,
      expectedImpact: 'Requisition redirected to Central Medical Store for direct batch dispatch.',
      carrierVehicle: 'N/A',
      temperatureRequirement: 'Standard Storage',
      batchNumber: 'CEF-1G-8802',
      estimatedTransitTime: 'Cancelled',
    },
  ]);

  // Static AI Recommendations Generated from Surplus / Shortage Optimization Models
  const [aiRecommendations, setAiRecommendations] = useState<AiRecommendation[]>([
    {
      id: 'AI-REC-01',
      recommendationCode: 'OPT-REDIST-01',
      medicine: 'Snake Antivenom (Polyvalent Lyophilized)',
      category: 'Emergency Antivenom',
      sourcePhc: 'PHC Junnar Rural',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 54,
      sourceBufferMonths: '2.4 Months (Surplus +32 vials)',
      destinationPhc: 'PHC Ambegaon Central',
      destinationDistrict: 'Pune',
      destinationShortageRisk: 'CRITICAL (0 vials remaining / Stockout)',
      destinationCurrentStock: 0,
      recommendedQuantity: 15,
      unit: 'vials',
      priority: 'Urgent',
      reason: 'Acute regional deficit detected: Ambegaon has zero antivenom while Junnar holds a 72-day excess buffer.',
      expectedImpact: 'Restores trauma emergency readiness; reduces stockout mortality probability to < 1.2%.',
      confidenceScore: 98.4,
      distanceKm: 38,
      estimatedTransitHours: 1.2,
    },
    {
      id: 'AI-REC-02',
      recommendationCode: 'OPT-REDIST-02',
      medicine: 'Rabies Vaccine (PVRV Human)',
      category: 'Vaccine / Biological',
      sourcePhc: 'PHC Khed Rural',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 140,
      sourceBufferMonths: '3.1 Months (Surplus +75 doses)',
      destinationPhc: 'PHC Junnar Rural',
      destinationDistrict: 'Pune',
      destinationShortageRisk: 'HIGH RISK (8 doses left / 1.5 Days Runway)',
      destinationCurrentStock: 8,
      recommendedQuantity: 40,
      unit: 'doses',
      priority: 'Urgent',
      reason: 'Predicted +60% demand spike due to reported stray canine bites in Junnar agricultural zones.',
      expectedImpact: 'Maintains 14-day anti-rabies vaccination protocol without requiring expensive state emergency requisition.',
      confidenceScore: 96.1,
      distanceKm: 29,
      estimatedTransitHours: 0.9,
    },
    {
      id: 'AI-REC-03',
      recommendationCode: 'OPT-REDIST-03',
      medicine: 'Oxytocin Injection 10 IU/ml',
      category: 'Maternal Health',
      sourcePhc: 'PHC Shirur Central',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 320,
      sourceBufferMonths: '2.8 Months (Surplus +140 ampoules)',
      destinationPhc: 'PHC Ambegaon Central',
      destinationDistrict: 'Pune',
      destinationShortageRisk: 'HIGH RISK (12 ampoules left / 2 Days Runway)',
      destinationCurrentStock: 12,
      recommendedQuantity: 60,
      unit: 'ampoules',
      priority: 'Urgent',
      reason: 'Maternity unit load exceeding baseline capacity; transfer neutralizes impending delivery room outage.',
      expectedImpact: 'Guarantees safe obstetric care and eliminates preventable maternal hemorrhage complications.',
      confidenceScore: 94.7,
      distanceKm: 46,
      estimatedTransitHours: 1.5,
    },
    {
      id: 'AI-REC-04',
      recommendationCode: 'OPT-REDIST-04',
      medicine: 'Paracetamol Pediatric Oral Syrup 120mg/5ml',
      category: 'Analgesic / Pediatric',
      sourcePhc: 'Sub-store Chakan Regional',
      sourceDistrict: 'Pune',
      sourceAvailableStock: 480,
      sourceBufferMonths: '3.5 Months (Surplus +220 bottles)',
      destinationPhc: 'PHC Daund South',
      destinationDistrict: 'Pune',
      destinationShortageRisk: 'MEDIUM RISK (22 bottles left / 4 Days Runway)',
      destinationCurrentStock: 22,
      recommendedQuantity: 90,
      unit: 'bottles',
      priority: 'High',
      reason: 'Early monsoon viral fever syndrome clustering detected in Daund South pediatric outpatient log.',
      expectedImpact: 'Prevents out-of-pocket pharmacy spending for rural pediatric fever cases.',
      confidenceScore: 91.2,
      distanceKm: 52,
      estimatedTransitHours: 1.4,
    },
  ]);

  // Recent Transfer Activity Stream
  const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
    {
      id: 'ACT-01',
      transferId: 'TRF-0890',
      eventType: 'Shipment dispatched',
      timestamp: '35 mins ago',
      actor: 'Vikas Jadhav',
      actorRole: 'Fleet Logistics Driver',
      facility: 'PHC Junnar Rural → PHC Haveli East',
      notes: 'Carrier vehicle MH-12-CV-7811 departed facility gate; GPS tracking beacon online.',
    },
    {
      id: 'ACT-02',
      transferId: 'TRF-0895',
      eventType: 'Transfer approved',
      timestamp: '2 hrs ago',
      actor: 'Dr. Hemant Kulkarni',
      actorRole: 'District Health Officer (DHO)',
      facility: 'PHC Baramati North → PHC Indapur Rural',
      notes: 'Approved via Administrative Portal; assigned to scheduled regional replenishment route.',
    },
    {
      id: 'ACT-03',
      transferId: 'TRF-0901',
      eventType: 'Transfer requested',
      timestamp: '09:15 AM today',
      actor: 'Dr. Anita Patil',
      actorRole: 'Medical Officer In-Charge',
      facility: 'PHC Ambegaon Central',
      notes: 'Emergency lateral transfer requisition generated following 2 acute snake envenomations.',
    },
    {
      id: 'ACT-04',
      transferId: 'TRF-0888',
      eventType: 'Transfer received',
      timestamp: 'Yesterday, 05:40 PM',
      actor: 'R. Thorat',
      actorRole: 'Dispensary Pharmacist',
      facility: 'PHC Daund South',
      notes: 'Consignment verified against manifest; 4,000 tabs Metformin taken into dispensary register.',
    },
    {
      id: 'ACT-05',
      transferId: 'TRF-0879',
      eventType: 'Transfer rejected',
      timestamp: '20 Sep 2026',
      actor: 'District Health Administration',
      actorRole: 'Central Logistics Reviewer',
      facility: 'PHC Daund South → PHC Manchar Rural',
      notes: 'Rejected due to sufficient destination stock balance (22 days runway). Requisition redirected.',
    },
  ]);

  // KPI Calculations
  const kpis = useMemo(() => {
    const pending = transfers.filter((t) => t.status === 'Pending').length;
    const awaitingApproval = transfers.filter((t) => t.status === 'Awaiting Approval').length;
    const approved = transfers.filter((t) => t.status === 'Approved').length;
    const inTransit = transfers.filter((t) => t.status === 'In Transit').length;
    const completed = transfers.filter((t) => t.status === 'Delivered').length;
    const urgent = transfers.filter((t) => t.priority === 'Urgent').length;
    return { pending, awaitingApproval, approved, inTransit, completed, urgent };
  }, [transfers]);

  // Unique PHC lists for filter dropdowns
  const uniqueSourcePhcs = useMemo(() => {
    const list = Array.from(new Set(transfers.map((t) => t.sourcePhc)));
    return ['All', ...list];
  }, [transfers]);

  const uniqueDestinationPhcs = useMemo(() => {
    const list = Array.from(new Set(transfers.map((t) => t.destinationPhc)));
    return ['All', ...list];
  }, [transfers]);

  // Filtered Transfers
  const filteredTransfers = useMemo(() => {
    return transfers.filter((t) => {
      const matchSearch =
        searchQuery === '' ||
        t.medicine.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.transferCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.sourcePhc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.destinationPhc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requestedBy.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSource = sourceFilter === 'All' || t.sourcePhc === sourceFilter;
      const matchDestination =
        destinationFilter === 'All' || t.destinationPhc === destinationFilter;
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || t.priority === priorityFilter;

      return matchSearch && matchSource && matchDestination && matchStatus && matchPriority;
    });
  }, [transfers, searchQuery, sourceFilter, destinationFilter, statusFilter, priorityFilter]);

  // Transfers requiring immediate administrative approval
  const pendingApprovals = useMemo(() => {
    return transfers.filter((t) => t.status === 'Awaiting Approval' || t.status === 'Pending');
  }, [transfers]);

  // Handlers for UI Actions (Frontend-only state changes)
  const handleApproveTransfer = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Approved',
              lastUpdated: 'Just now',
            }
          : t
      )
    );
    const target = transfers.find((t) => t.id === id);
    if (target) {
      setActivityFeed((prev) => [
        {
          id: `ACT-${Date.now()}`,
          transferId: target.transferCode,
          eventType: 'Transfer approved',
          timestamp: 'Just now',
          actor: 'State Administrative Officer (You)',
          actorRole: 'Authorized Approver',
          facility: `${target.sourcePhc} → ${target.destinationPhc}`,
          notes: `Transfer of ${target.quantity} ${target.unit} ${target.medicine} officially approved for dispatch.`,
        },
        ...prev,
      ]);
      setNotificationMessage(
        `Transfer ${target.transferCode} successfully approved. Vehicle dispatch instruction queued.`
      );
      setTimeout(() => setNotificationMessage(null), 5000);
    }
    if (selectedTransfer && selectedTransfer.id === id) {
      setSelectedTransfer((prev) => (prev ? { ...prev, status: 'Approved' } : null));
    }
  };

  const handleRejectTransfer = (id: string) => {
    setTransfers((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: 'Rejected',
              lastUpdated: 'Just now',
            }
          : t
      )
    );
    const target = transfers.find((t) => t.id === id);
    if (target) {
      setActivityFeed((prev) => [
        {
          id: `ACT-${Date.now()}`,
          transferId: target.transferCode,
          eventType: 'Transfer rejected',
          timestamp: 'Just now',
          actor: 'State Administrative Officer (You)',
          actorRole: 'Authorized Approver',
          facility: `${target.sourcePhc} → ${target.destinationPhc}`,
          notes: `Transfer request declined during administrative screening.`,
        },
        ...prev,
      ]);
      setNotificationMessage(
        `Transfer ${target.transferCode} was rejected. Requester notified with feedback.`
      );
      setTimeout(() => setNotificationMessage(null), 5000);
    }
    if (selectedTransfer && selectedTransfer.id === id) {
      setSelectedTransfer((prev) => (prev ? { ...prev, status: 'Rejected' } : null));
    }
  };

  const handleAcceptAiRecommendation = (rec: AiRecommendation) => {
    const newRecord: TransferRecord = {
      id: `TRF-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      transferCode: `TRF-${Math.floor(1000 + Math.random() * 9000)}`,
      medicine: rec.medicine,
      dosageForm: 'Standard Pack',
      category: rec.category,
      sourcePhc: rec.sourcePhc,
      sourceDistrict: rec.sourceDistrict,
      sourceAvailableStock: rec.sourceAvailableStock,
      destinationPhc: rec.destinationPhc,
      destinationDistrict: rec.destinationDistrict,
      destinationCurrentStock: rec.destinationCurrentStock,
      quantity: rec.recommendedQuantity,
      unit: rec.unit,
      priority: rec.priority,
      status: 'Awaiting Approval',
      requestedBy: 'AI Redistribution Engine',
      requesterRole: 'Automated Optimization Agent',
      requestedDate: 'Just now',
      lastUpdated: 'Just now',
      reason: rec.reason,
      isAiRecommended: true,
      expectedImpact: rec.expectedImpact,
      carrierVehicle: 'Assigned upon approval',
      temperatureRequirement:
        rec.category.includes('Antivenom') || rec.category.includes('Vaccine')
          ? '+2°C to +8°C Cold Chain'
          : 'Ambient Controlled (< 25°C)',
      batchNumber: 'BATCH-AUTO-RESERVE',
      estimatedTransitTime: `${rec.estimatedTransitHours} hrs (${rec.distanceKm} km)`,
    };

    setTransfers((prev) => [newRecord, ...prev]);
    setAiRecommendations((prev) => prev.filter((r) => r.id !== rec.id));

    setActivityFeed((prev) => [
      {
        id: `ACT-${Date.now()}`,
        transferId: newRecord.transferCode,
        eventType: 'Transfer requested',
        timestamp: 'Just now',
        actor: 'AI Redistribution System',
        actorRole: 'Autonomous Demand Optimizer',
        facility: `${rec.sourcePhc} → ${rec.destinationPhc}`,
        notes: `AI recommendation converted into formal transfer requisition with ${rec.confidenceScore}% confidence.`,
      },
      ...prev,
    ]);

    setNotificationMessage(
      `AI Recommendation converted! New Transfer ${newRecord.transferCode} created and queued for review.`
    );
    setTimeout(() => setNotificationMessage(null), 5000);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSourceFilter('All');
    setDestinationFilter('All');
    setStatusFilter('All');
    setPriorityFilter('All');
    setTimeframeFilter('All');
  };

  const openDetails = (transfer: TransferRecord) => {
    setSelectedTransfer(transfer);
    setIsDetailModalOpen(true);
  };

  // Helper Badge Renderers
  const renderPriorityBadge = (priority: TransferPriority) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
            Urgent
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Medium
          </span>
        );
      case 'Standard':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Standard
          </span>
        );
    }
  };

  const renderStatusBadge = (status: TransferStatus) => {
    switch (status) {
      case 'Awaiting Approval':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-300">
            Awaiting Approval
          </span>
        );
      case 'Pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
            Pending Review
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-300">
            Approved
          </span>
        );
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-800 border border-sky-300">
            <svg
              className="w-3.5 h-3.5 text-sky-600 animate-spin"
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
      case 'Delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-300">
            Delivered
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-800 border border-rose-300">
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  // Header Actions UI
  const headerActions = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-medium text-emerald-800">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Redistribution Network Synchronized</span>
      </div>

      <button
        onClick={() => {
          setNotificationMessage('Transfer manifests exported to encrypted state audit CSV.');
          setTimeout(() => setNotificationMessage(null), 4000);
        }}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
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
        onClick={() => setIsNewTransferModalOpen(true)}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Initiate Transfer Request
      </button>
    </div>
  );

  return (
    <DashboardLayout
      title="Resource Transfers"
      description="Centralized administration for inter-PHC medicine requisition, surplus-to-shortage redistribution, and cold-chain resource balancing."
      roleBadge="State Health Resource Directorate"
      currentRole="state"
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
            className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-300 rounded-xl shadow-sm text-emerald-900 animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-emerald-200 text-emerald-800 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium">{notificationMessage}</p>
            </div>
            <button
              onClick={() => setNotificationMessage(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold px-2 py-1"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 1. Transfer KPI Cards */}
        <section aria-labelledby="kpi-heading">
          <h2 id="kpi-heading" className="sr-only">
            Transfer Operations Key Performance Indicators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            <StatCard
              title="Pending Requests"
              value={kpis.pending}
              description="Awaiting initial verification"
              badge="Draft / Queue"
              icon={
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              }
            />

            <StatCard
              title="Awaiting Approval"
              value={kpis.awaitingApproval}
              description="Action required by officer"
              badge="Action Required"
              trend={{
                value: 'Needs Review',
                direction: 'neutral',
              }}
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
              title="Approved Transfers"
              value={kpis.approved}
              description="Dispatches authorized"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />

            <StatCard
              title="In Transit"
              value={kpis.inTransit}
              description="Active delivery vehicles"
              badge="Active Road"
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
              title="Completed"
              value={kpis.completed}
              description="Handed over & verified"
              trend={{
                value: '+14% vs last mo',
                direction: 'up',
                isPositive: true,
              }}
              icon={
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              }
            />

            <StatCard
              title="Urgent Transfers"
              value={kpis.urgent}
              description="Stockout / life-saving"
              badge="Priority 1"
              trend={{
                value: 'Zero SLA Breaches',
                direction: 'up',
                isPositive: true,
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
          </div>
        </section>

        {/* 2. Transfer Lifecycle Workflow Banner */}
        <section
          aria-labelledby="workflow-heading"
          className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-5 sm:p-6 text-white shadow-md border border-slate-700/60"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-700/80 pb-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                Standard Operating Procedure
              </span>
              <h2 id="workflow-heading" className="text-lg font-bold text-slate-100">
                Inter-PHC Redistribution Protocol Workflow
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Every resource relocation is governed by multi-tier verification ensuring cold-chain integrity,
                dispensary buffer validation, and digital chain-of-custody transfer receipts.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Average Inter-PHC Turnaround: <span className="font-semibold text-emerald-300">2.8 Hours</span>
            </div>
          </div>

          {/* Stepper Representation */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative">
            {/* Step 1: Request */}
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3.5 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Origin</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Request</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Demand surge or lateral shortage flagged by Medical Officer or AI model.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-medium text-indigo-300">
                SLA: &lt; 15 mins
              </div>
            </div>

            {/* Step 2: Review */}
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3.5 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Inventory</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Review</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Source PHC runway verified to prevent inducing secondary deficits.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-medium text-indigo-300">
                SLA: &lt; 20 mins
              </div>
            </div>

            {/* Step 3: Approval */}
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3.5 border border-amber-500/40 flex flex-col justify-between relative shadow-sm">
              <span className="absolute -top-2 right-2 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[9px] rounded-full uppercase">
                Active Tier
              </span>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Admin</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Approval</h3>
                <p className="text-xs text-slate-400 mt-1">
                  District Health Officer authorizes transfer manifest and allocates vehicle.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-medium text-amber-300">
                SLA: &lt; 30 mins
              </div>
            </div>

            {/* Step 4: Dispatch */}
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3.5 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Packaging</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Dispatch</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Pharmacist packs stock with cold-chain datalogger; handover to fleet driver.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-medium text-sky-300">
                SLA: &lt; 25 mins
              </div>
            </div>

            {/* Step 5: In Transit */}
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3.5 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 flex items-center justify-center text-xs font-bold">
                    5
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Transit</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">In Transit</h3>
                <p className="text-xs text-slate-400 mt-1">
                  GPS route monitoring with live refrigerated telemetry alerts.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-medium text-sky-300">
                Typical: 45–90 mins
              </div>
            </div>

            {/* Step 6: Delivered */}
            <div className="bg-slate-800/80 backdrop-blur rounded-xl p-3.5 border border-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center text-xs font-bold">
                    6
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Complete</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Delivered</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Receiving pharmacist verifies batch, checks cold chain, and confirms ledger intake.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-700/60 text-[11px] font-medium text-teal-300">
                Finalized
              </div>
            </div>
          </div>
        </section>

        {/* 3. Pending Approval Callout Section */}
        {pendingApprovals.length > 0 && (
          <section aria-labelledby="pending-approvals-heading" className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
                <h2 id="pending-approvals-heading" className="text-base font-bold text-slate-900">
                  Transfers Requiring Administrative Approval ({pendingApprovals.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500">
                Action needed to clear emergency requisitions and dispatch vehicles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingApprovals.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-amber-200/90 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {item.transferCode}
                        </span>
                        {item.isAiRecommended && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded">
                            <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            AI Initiated
                          </span>
                        )}
                      </div>
                      {renderPriorityBadge(item.priority)}
                    </div>

                    {/* Medicine & Quantity */}
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{item.medicine}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-lg font-black text-slate-900">
                        {item.quantity.toLocaleString()} {item.unit}
                      </span>
                      <span className="text-xs text-slate-500">• {item.dosageForm}</span>
                    </div>

                    {/* Directional Flow: Source -> Destination */}
                    <div className="mt-3 p-2.5 bg-slate-50 rounded-lg border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-semibold text-slate-800 truncate" title={item.sourcePhc}>
                            {item.sourcePhc}
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono shrink-0">
                          Surplus: {item.sourceAvailableStock}
                        </span>
                      </div>

                      <div className="flex items-center justify-center text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
                          <span className="font-semibold text-slate-800 truncate" title={item.destinationPhc}>
                            {item.destinationPhc}
                          </span>
                        </div>
                        <span className="text-[11px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-mono shrink-0">
                          Current: {item.destinationCurrentStock}
                        </span>
                      </div>
                    </div>

                    {/* Requester & Reason */}
                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2">
                      <span className="font-medium text-slate-700">Reason:</span> {item.reason}
                    </p>
                    <div className="text-[11px] text-slate-500 mt-1">
                      Requested by <span className="font-medium text-slate-700">{item.requestedBy}</span> ({item.requesterRole})
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => openDetails(item)}
                      className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      View Details
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRejectTransfer(item.id)}
                        className="px-2.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApproveTransfer(item.id)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. AI Recommended Resource Redistribution Section */}
        <section
          aria-labelledby="ai-recommendations-heading"
          className="bg-white rounded-2xl border border-purple-200/90 shadow-sm p-5 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-purple-100 pb-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 text-white rounded-xl shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.001z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 id="ai-recommendations-heading" className="text-base font-bold text-slate-900">
                    AI Recommended Resource Redistributions
                  </h2>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 rounded-full border border-purple-200">
                    Algorithmic Surplus &amp; Shortage Balancing
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Proactive recommendations generated by continuous monitoring of regional consumption spikes,
                  epidemiological alerts, and dispensary stockout probabilities.
                </p>
              </div>
            </div>

            <div className="text-xs font-medium text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 self-start sm:self-auto">
              {aiRecommendations.length} Optimized Transfer Opportunities Identified
            </div>
          </div>

          {aiRecommendations.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              No active AI recommendations pending. The district supply network is currently in optimal equilibrium.
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {aiRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-gradient-to-b from-purple-50/40 via-white to-white rounded-xl border border-purple-200 p-4 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                          {rec.recommendationCode}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">• {rec.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {rec.confidenceScore}% Confidence
                        </span>
                        {renderPriorityBadge(rec.priority)}
                      </div>
                    </div>

                    {/* Medicine & Recommended Quantity */}
                    <div className="mt-1">
                      <h3 className="text-base font-bold text-slate-900">{rec.medicine}</h3>
                      <div className="text-xs text-purple-900 font-medium mt-0.5">
                        Recommended Transfer Quantity:{' '}
                        <span className="font-extrabold text-sm text-slate-900">
                          {rec.recommendedQuantity.toLocaleString()} {rec.unit}
                        </span>
                      </div>
                    </div>

                    {/* Source -> Destination Visual Routing */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                      {/* Source Side */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] uppercase tracking-wider">
                          <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          Source PHC (Surplus)
                        </div>
                        <div className="font-bold text-slate-900">{rec.sourcePhc}</div>
                        <div className="text-[11px] text-slate-500">{rec.sourceDistrict} District</div>
                        <div className="text-[11px] text-emerald-700 font-medium">
                          Available: {rec.sourceAvailableStock} ({rec.sourceBufferMonths})
                        </div>
                      </div>

                      {/* Destination Side */}
                      <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-3">
                        <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px] uppercase tracking-wider">
                          <svg className="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          Destination PHC (Shortage)
                        </div>
                        <div className="font-bold text-slate-900">{rec.destinationPhc}</div>
                        <div className="text-[11px] text-slate-500">{rec.destinationDistrict} District</div>
                        <div className="text-[11px] text-rose-700 font-semibold">
                          Risk: {rec.destinationShortageRisk}
                        </div>
                      </div>
                    </div>

                    {/* Reason & Expected Impact */}
                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div>
                        <span className="font-semibold text-slate-800">Optimization Reason:</span> {rec.reason}
                      </div>
                      <div className="text-emerald-800 bg-emerald-50/80 p-2 rounded border border-emerald-200/60">
                        <span className="font-semibold">Expected Impact:</span> {rec.expectedImpact}
                      </div>
                    </div>

                    {/* Transit Telemetry */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-3 pt-2 border-t border-slate-100">
                      <span>Distance: <strong className="text-slate-700">{rec.distanceKm} km</strong></span>
                      <span>Transit Estimate: <strong className="text-slate-700">~{rec.estimatedTransitHours} hrs</strong></span>
                      <span>Routing: <strong className="text-slate-700">State Highway Corridor</strong></span>
                    </div>
                  </div>

                  {/* Accept / Dismiss Buttons */}
                  <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setAiRecommendations((prev) => prev.filter((r) => r.id !== rec.id));
                        setNotificationMessage(`Recommendation ${rec.recommendationCode} dismissed.`);
                        setTimeout(() => setNotificationMessage(null), 3000);
                      }}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => handleAcceptAiRecommendation(rec)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Accept &amp; Create Transfer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 5. Transfer Filters Toolbar */}
        <section
          aria-labelledby="filters-heading"
          className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 space-y-3"
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
              Filter Resource Transfers
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Showing <strong className="text-slate-800">{filteredTransfers.length}</strong> of{' '}
                <strong className="text-slate-800">{transfers.length}</strong> transfers
              </span>
              {(searchQuery ||
                sourceFilter !== 'All' ||
                destinationFilter !== 'All' ||
                statusFilter !== 'All' ||
                priorityFilter !== 'All') && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 underline ml-2"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-1">
              <label htmlFor="transfer-search" className="block text-xs font-semibold text-slate-700 mb-1">
                Search Resource / ID
              </label>
              <div className="relative">
                <input
                  id="transfer-search"
                  type="text"
                  placeholder="e.g. Antivenom, TRF-0901..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder-slate-400"
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

            {/* Source PHC Dropdown */}
            <div>
              <label htmlFor="source-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Source PHC (Origin)
              </label>
              <select
                id="source-filter"
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {uniqueSourcePhcs.map((phc) => (
                  <option key={phc} value={phc}>
                    {phc}
                  </option>
                ))}
              </select>
            </div>

            {/* Destination PHC Dropdown */}
            <div>
              <label htmlFor="dest-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Destination PHC (Target)
              </label>
              <select
                id="dest-filter"
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {uniqueDestinationPhcs.map((phc) => (
                  <option key={phc} value={phc}>
                    {phc}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div>
              <label htmlFor="status-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending Review</option>
                <option value="Awaiting Approval">Awaiting Approval</option>
                <option value="Approved">Approved</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            {/* Priority Dropdown */}
            <div>
              <label htmlFor="priority-filter" className="block text-xs font-semibold text-slate-700 mb-1">
                Priority Level
              </label>
              <select
                id="priority-filter"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="All">All Priorities</option>
                <option value="Urgent">Urgent (Priority 1)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>
        </section>

        {/* 6. Main Transfer Requests Table */}
        <section aria-labelledby="main-table-heading" className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 id="main-table-heading" className="text-base font-bold text-slate-900">
                Inter-Facility Resource Transfer Register
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active requests, shipments, and completed distribution records across the district network.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Legend:</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Source (Origin)
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Destination (Target)
              </span>
            </div>
          </div>

          {/* Desktop & Tablet Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th scope="col" className="py-3 px-4">Transfer ID</th>
                  <th scope="col" className="py-3 px-4">Resource / Medicine</th>
                  <th scope="col" className="py-3 px-4">Source PHC</th>
                  <th scope="col" className="py-3 px-4 text-center">Direction</th>
                  <th scope="col" className="py-3 px-4">Destination PHC</th>
                  <th scope="col" className="py-3 px-4 text-right">Quantity</th>
                  <th scope="col" className="py-3 px-4">Priority</th>
                  <th scope="col" className="py-3 px-4">Requested By</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTransfers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-slate-500">
                      No transfer records match your selected search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransfers.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/90 transition-colors group"
                    >
                      {/* Transfer ID */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{item.transferCode}</span>
                          {item.isAiRecommended && (
                            <span title="Generated from AI optimization" className="text-purple-600">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                              </svg>
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Medicine */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.medicine}</div>
                        <div className="text-[11px] text-slate-500">{item.dosageForm}</div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="font-semibold text-slate-800">{item.sourcePhc}</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1 rounded ml-3.5">
                          Avail: {item.sourceAvailableStock}
                        </span>
                      </td>

                      {/* Direction Arrow */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </span>
                      </td>

                      {/* Destination */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0"></span>
                          <span className="font-semibold text-slate-800">{item.destinationPhc}</span>
                        </div>
                        <span className="text-[10px] text-rose-700 bg-rose-50 px-1 rounded ml-3.5">
                          Stock: {item.destinationCurrentStock}
                        </span>
                      </td>

                      {/* Quantity */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.quantity.toLocaleString()} <span className="text-[11px] font-normal text-slate-500">{item.unit}</span>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderPriorityBadge(item.priority)}
                      </td>

                      {/* Requester */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-800">{item.requestedBy}</div>
                        <div className="text-[10px] text-slate-400">{item.requestedDate}</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {renderStatusBadge(item.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => openDetails(item)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded border border-indigo-200 transition-colors"
                          >
                            Details
                          </button>
                          {item.status === 'In Transit' && (
                            <button
                              onClick={() => {
                                openDetails(item);
                              }}
                              className="px-2 py-1 text-xs font-medium text-sky-700 bg-sky-50 hover:bg-sky-100 rounded border border-sky-200 transition-colors"
                              title="Track GPS vehicle"
                            >
                              Track
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

        {/* 7. Lower Intelligence Grid: Activity Log & Redistribution Protocols */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transfer Activity Feed (2 Cols) */}
          <section
            aria-labelledby="recent-activity-heading"
            className="lg:col-span-2 bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 flex flex-col justify-between"
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
                    Recent Transfer Audit &amp; Event Activity
                  </h2>
                </div>
                <span className="text-xs text-slate-500">Live Chain-of-Custody Log</span>
              </div>

              <div className="space-y-4">
                {activityFeed.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-3 relative">
                    {/* Event Icon Pillar */}
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border shadow-xs bg-slate-50 border-slate-200 text-slate-600">
                        {event.eventType === 'Shipment dispatched' ? (
                          <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : event.eventType === 'Transfer approved' ? (
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : event.eventType === 'Transfer requested' ? (
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : event.eventType === 'Transfer received' ? (
                          <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </div>
                      {idx < activityFeed.length - 1 && (
                        <div className="w-0.5 h-10 bg-slate-200 mt-1"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{event.eventType}</span>
                          <span className="text-xs font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                            {event.transferId}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{event.timestamp}</span>
                      </div>
                      <div className="text-xs text-slate-700 font-medium mt-0.5">
                        {event.actor} • <span className="text-slate-500 font-normal">{event.actorRole}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {event.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <span className="text-xs text-slate-400">
                End of recent transmission logs • Audit hash cryptographically sealed
              </span>
            </div>
          </section>

          {/* Lateral Transfer Guidelines & Cold-Chain Protocol (1 Col) */}
          <section
            aria-labelledby="protocols-heading"
            className="bg-slate-900 text-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
                <span className="p-1.5 bg-slate-800 text-emerald-400 rounded-lg">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </span>
                <h2 id="protocols-heading" className="text-sm font-bold text-white">
                  State Redistribution Regulations
                </h2>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    Cold-Chain Biologicals Protection
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Vaccines, Insulins, and Antivenoms must remain continuously sealed at +2°C to +8°C in validated
                    reefer compartments or conditioned cold boxes equipped with calibrated dataloggers.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    Source Safety Stock Protection
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    No PHC may approve an outgoing lateral transfer if it drives their remaining stock buffer below
                    the mandatory 30-day baseline runway, unless explicitly sanctioned by the State Director.
                  </p>
                </div>

                <div className="bg-slate-800/80 rounded-lg p-3 border border-slate-700">
                  <h3 className="font-semibold text-white mb-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                    Chain-of-Custody Verification
                  </h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Both dispatching and receiving pharmacists must sign the dual digital manifest. Delivery receipts
                    automatically synchronize with state Central Registry ledgers.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Directive: HSD-MAH-2026</span>
              <span className="text-emerald-400 font-medium">Compliance: 99.4%</span>
            </div>
          </section>
        </div>
      </div>

      {/* 8. Transfer Detail & Action Modal Dialog */}
      {isDetailModalOpen && selectedTransfer && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-transfer-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 text-xs font-mono font-bold bg-slate-800 border border-slate-700 rounded text-emerald-300">
                    {selectedTransfer.transferCode}
                  </span>
                  {renderPriorityBadge(selectedTransfer.priority)}
                  {renderStatusBadge(selectedTransfer.status)}
                </div>
                <h3 id="modal-transfer-title" className="text-lg font-bold text-white">
                  {selectedTransfer.medicine}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Requisitioned by {selectedTransfer.requestedBy} ({selectedTransfer.requesterRole}) on {selectedTransfer.requestedDate}
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
              {/* Quantities & Route Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Requisition Qty</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {selectedTransfer.quantity.toLocaleString()} {selectedTransfer.unit}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Dosage Form</span>
                  <span className="text-xs font-bold text-slate-800">{selectedTransfer.dosageForm}</span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Batch Number</span>
                  <span className="text-xs font-mono font-bold text-indigo-700">
                    {selectedTransfer.batchNumber || 'Assigned at dispatch'}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] text-slate-500 font-medium">Transit SLA</span>
                  <span className="text-xs font-bold text-slate-800">
                    {selectedTransfer.estimatedTransitTime || '45 mins'}
                  </span>
                </div>
              </div>

              {/* Source -> Destination Map Diagram */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Logistics Route Manifest
                </span>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  {/* Source PHC */}
                  <div className="flex-1 p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider">
                        Origin Source
                      </span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold">
                        Avail: {selectedTransfer.sourceAvailableStock}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{selectedTransfer.sourcePhc}</div>
                    <div className="text-[11px] text-slate-500">{selectedTransfer.sourceDistrict} District Dispensary</div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <span className="text-[11px] font-semibold text-slate-500 mb-1">Lateral Route</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>

                  {/* Destination PHC */}
                  <div className="flex-1 p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-left w-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase text-indigo-800 tracking-wider">
                        Target Destination
                      </span>
                      <span className="text-[11px] font-mono text-rose-700 font-semibold">
                        Current: {selectedTransfer.destinationCurrentStock}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900">{selectedTransfer.destinationPhc}</div>
                    <div className="text-[11px] text-slate-500">{selectedTransfer.destinationDistrict} District Dispensary</div>
                  </div>
                </div>
              </div>

              {/* Justification & Operational Details */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Clinical / Operational Justification:</span>
                  <p className="text-slate-600 leading-relaxed">{selectedTransfer.reason}</p>
                </div>

                {selectedTransfer.expectedImpact && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="font-bold text-emerald-900 block mb-1">Projected Outcome &amp; Patient Safety Impact:</span>
                    <p className="text-emerald-800 leading-relaxed">{selectedTransfer.expectedImpact}</p>
                  </div>
                )}
              </div>

              {/* Transit & Cold Chain Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Allocated Transport Carrier</span>
                  <div className="text-slate-900 font-medium">
                    {selectedTransfer.carrierVehicle || 'Carrier MH-12-RN-5541 (Cold-chain active)'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-1">Storage Condition Standard</span>
                  <div className="text-slate-900 font-medium">
                    {selectedTransfer.temperatureRequirement || '+2°C to +8°C Cold Chain'}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] text-slate-500">
                Last modified: <strong className="text-slate-700">{selectedTransfer.lastUpdated}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>

                {(selectedTransfer.status === 'Awaiting Approval' || selectedTransfer.status === 'Pending') && (
                  <>
                    <button
                      onClick={() => {
                        handleRejectTransfer(selectedTransfer.id);
                        setIsDetailModalOpen(false);
                      }}
                      className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
                    >
                      Reject Request
                    </button>
                    <button
                      onClick={() => {
                        handleApproveTransfer(selectedTransfer.id);
                        setIsDetailModalOpen(false);
                      }}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                    >
                      Authorize &amp; Approve
                    </button>
                  </>
                )}

                {selectedTransfer.status === 'In Transit' && (
                  <button
                    onClick={() => {
                      setNotificationMessage(
                        `Carrier ${selectedTransfer.carrierVehicle} pinged. Telemetry: Speed 42 km/h, Chamber Temp +3.4°C.`
                      );
                      setIsDetailModalOpen(false);
                      setTimeout(() => setNotificationMessage(null), 5000);
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors shadow-sm"
                  >
                    Ping Vehicle GPS
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. Initiate New Transfer Modal (Frontend Demonstration Form) */}
      {isNewTransferModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-new-transfer-title"
          className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 id="modal-new-transfer-title" className="text-base font-bold text-white">
                  Initiate Inter-PHC Resource Transfer
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Requisition emergency stock or lateral surplus from another facility.
                </p>
              </div>
              <button
                onClick={() => setIsNewTransferModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsNewTransferModalOpen(false);
                setNotificationMessage(
                  'Emergency transfer request created successfully! Forwarded to District Review queue.'
                );
                setTimeout(() => setNotificationMessage(null), 5000);
              }}
              className="p-6 space-y-4 text-xs"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medicine / Medical Resource
                </label>
                <input
                  type="text"
                  required
                  defaultValue="Snake Antivenom (Polyvalent Lyophilized)"
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Source Facility (Origin)
                  </label>
                  <select className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>PHC Junnar Rural (Surplus: 54)</option>
                    <option>PHC Khed Rural (Surplus: 140)</option>
                    <option>PHC Shirur Central (Surplus: 320)</option>
                    <option>Sub-store Chakan Regional (Surplus: 480)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Target Facility (Destination)
                  </label>
                  <select className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>PHC Ambegaon Central (Shortage: 0)</option>
                    <option>PHC Haveli East (Low stock)</option>
                    <option>PHC Daund South (Low stock)</option>
                    <option>PHC Bhor West (Low stock)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Requisition Quantity
                  </label>
                  <input
                    type="number"
                    required
                    defaultValue={20}
                    className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Priority Level
                  </label>
                  <select className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option value="Urgent">Urgent (Stockout / Trauma)</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Standard">Standard Routine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical &amp; Operational Justification
                </label>
                <textarea
                  rows={3}
                  required
                  defaultValue="Emergency stock depletion due to regional viper snakebite emergency admissions. Immediate replenishment requested."
                  className="w-full px-3 py-2 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTransferModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Submit Transfer Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
