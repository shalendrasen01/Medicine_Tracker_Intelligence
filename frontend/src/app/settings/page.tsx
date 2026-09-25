'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

type SettingsSection =
  | 'General'
  | 'Notifications'
  | 'Inventory'
  | 'Alerts'
  | 'AI & Predictions'
  | 'Logistics'
  | 'Security'
  | 'Account';

interface ToggleProps {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ id, label, description, checked, onChange }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-semibold text-slate-800 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
          checked ? 'bg-emerald-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

interface SelectFieldProps {
  id: string;
  label: string;
  description?: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

function SelectField({ id, label, description, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="py-3.5 border-b border-slate-100 last:border-0">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800 mb-1">
        {label}
      </label>
      {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full max-w-xs px-3 py-1.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

interface NumberFieldProps {
  id: string;
  label: string;
  description?: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (val: number) => void;
}

function NumberField({ id, label, description, value, min, max, unit, onChange }: NumberFieldProps) {
  return (
    <div className="py-3.5 border-b border-slate-100 last:border-0">
      <label htmlFor={id} className="block text-sm font-semibold text-slate-800 mb-1">
        {label}
      </label>
      {description && <p className="text-xs text-slate-500 mb-2">{description}</p>}
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-28 px-3 py-1.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
        />
        {unit && <span className="text-xs font-medium text-slate-500">{unit}</span>}
      </div>
    </div>
  );
}

const NAV_SECTIONS: { key: SettingsSection; icon: string }[] = [
  { key: 'General', icon: '⚙️' },
  { key: 'Notifications', icon: '🔔' },
  { key: 'Inventory', icon: '📦' },
  { key: 'Alerts', icon: '🚨' },
  { key: 'AI & Predictions', icon: '🤖' },
  { key: 'Logistics', icon: '🚚' },
  { key: 'Security', icon: '🔒' },
  { key: 'Account', icon: '👤' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('General');
  const [savedMessage, setSavedMessage] = useState(false);

  // --- General Settings State ---
  const [platformName, setPlatformName] = useState('Medicine Tracker Intelligence');
  const [defaultDashboard, setDefaultDashboard] = useState('Central Admin');
  const [language, setLanguage] = useState('English (India)');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST, UTC+5:30)');
  const [dateFormat, setDateFormat] = useState('DD MMM YYYY');
  const [refreshInterval, setRefreshInterval] = useState(5);

  // --- Notification Settings State ---
  const [notifCriticalStock, setNotifCriticalStock] = useState(true);
  const [notifStockoutPrediction, setNotifStockoutPrediction] = useState(true);
  const [notifShipmentDelay, setNotifShipmentDelay] = useState(true);
  const [notifColdChain, setNotifColdChain] = useState(true);
  const [notifTransferRequests, setNotifTransferRequests] = useState(true);
  const [notifSystem, setNotifSystem] = useState(true);
  const [notifEmail, setNotifEmail] = useState(false);
  const [notifInApp, setNotifInApp] = useState(true);

  // --- Inventory Settings State ---
  const [minStockThreshold, setMinStockThreshold] = useState(30);
  const [criticalStockThreshold, setCriticalStockThreshold] = useState(7);
  const [lowStockWarning, setLowStockWarning] = useState(15);
  const [reorderPeriod, setReorderPeriod] = useState(90);
  const [autoStockAlerts, setAutoStockAlerts] = useState(true);

  // --- Alerts Settings State ---
  const [alertEmailEnabled, setAlertEmailEnabled] = useState(true);
  const [alertSmsEnabled, setAlertSmsEnabled] = useState(false);
  const [alertCriticalOnly, setAlertCriticalOnly] = useState(false);
  const [alertEscalationEnabled, setAlertEscalationEnabled] = useState(true);
  const [alertEscalationDelay, setAlertEscalationDelay] = useState(30);

  // --- AI & Predictions Settings State ---
  const [forecastHorizon, setForecastHorizon] = useState('30 days');
  const [predictionSensitivity, setPredictionSensitivity] = useState('High');
  const [stockoutRiskThreshold, setStockoutRiskThreshold] = useState(20);
  const [demandSpikeThreshold, setDemandSpikeThreshold] = useState(40);
  const [aiRecommendationsEnabled, setAiRecommendationsEnabled] = useState(true);

  // --- Logistics Settings State ---
  const [defaultShipmentPriority, setDefaultShipmentPriority] = useState('Standard');
  const [deliveryDelayThreshold, setDeliveryDelayThreshold] = useState(30);
  const [coldChainMonitoring, setColdChainMonitoring] = useState(true);
  const [etaAlertThreshold, setEtaAlertThreshold] = useState(15);

  // --- Security Settings State ---
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const breadcrumbs = [
    { label: 'Portal', href: '/' },
    { label: 'Settings' },
  ];

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 4000);
  };

  const headerActions = (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSave}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
        Save Changes
      </button>
    </div>
  );

  return (
    <DashboardLayout
      title="Settings"
      description="Configure platform preferences, alert thresholds, inventory parameters, AI sensitivity, and account settings."
      roleBadge="Platform Configuration"
      currentRole="central"
      breadcrumbs={breadcrumbs}
      systemStatus="operational"
      headerActions={headerActions}
    >
      <div className="space-y-4">
        {/* Save Confirmation Toast */}
        {savedMessage && (
          <div role="alert" className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 shadow-sm">
            <div className="p-1.5 bg-emerald-200 rounded-full">
              <svg className="w-4 h-4 text-emerald-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold">Settings saved successfully. Changes will take effect immediately.</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Settings Sidebar Navigation */}
          <nav aria-label="Settings sections" className="lg:w-56 shrink-0">
            {/* Mobile: horizontal scroll tabs */}
            <div className="lg:hidden flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
              {NAV_SECTIONS.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    activeSection === key
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span>{icon}</span>
                  {key}
                </button>
              ))}
            </div>

            {/* Desktop: vertical sidebar */}
            <div className="hidden lg:flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {NAV_SECTIONS.map(({ key, icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium text-left border-b border-slate-100 last:border-0 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${
                    activeSection === key
                      ? 'bg-emerald-50 text-emerald-800 font-semibold border-l-2 border-l-emerald-600'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  aria-current={activeSection === key ? 'page' : undefined}
                >
                  <span className="text-base">{icon}</span>
                  {key}
                </button>
              ))}
            </div>
          </nav>

          {/* Settings Panel */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Section Header */}
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60">
                <h2 className="text-base font-bold text-slate-900">
                  {NAV_SECTIONS.find((s) => s.key === activeSection)?.icon} {activeSection}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {activeSection === 'General' && 'Core platform configuration and display preferences.'}
                  {activeSection === 'Notifications' && 'Control which events trigger alerts and through which channels.'}
                  {activeSection === 'Inventory' && 'Define thresholds for stock levels and automated alerts.'}
                  {activeSection === 'Alerts' && 'Configure alert delivery, escalation rules, and severity routing.'}
                  {activeSection === 'AI & Predictions' && 'Tune AI model sensitivity, forecast windows, and recommendation settings.'}
                  {activeSection === 'Logistics' && 'Fleet, shipment, and cold-chain operational defaults.'}
                  {activeSection === 'Security' && 'Session management, authentication, and access control settings.'}
                  {activeSection === 'Account' && 'Your profile, role, and organizational affiliation.'}
                </p>
              </div>

              <div className="px-6 py-2">
                {/* ── GENERAL ── */}
                {activeSection === 'General' && (
                  <div>
                    <div className="py-3.5 border-b border-slate-100">
                      <label htmlFor="platform-name" className="block text-sm font-semibold text-slate-800 mb-1">
                        Platform Name
                      </label>
                      <p className="text-xs text-slate-500 mb-2">Displayed in browser title and report headers.</p>
                      <input
                        id="platform-name"
                        type="text"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="w-full max-w-md px-3 py-1.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <SelectField
                      id="default-dashboard"
                      label="Default Dashboard"
                      description="The dashboard opened when you first log in."
                      value={defaultDashboard}
                      options={['Central Admin', 'State Admin', 'PHC Dispensary', 'Logistics Fleet']}
                      onChange={setDefaultDashboard}
                    />
                    <SelectField
                      id="language"
                      label="Default Language"
                      value={language}
                      options={['English (India)', 'Hindi', 'Marathi', 'Gujarati', 'Tamil']}
                      onChange={setLanguage}
                    />
                    <SelectField
                      id="timezone"
                      label="Time Zone"
                      value={timezone}
                      options={['Asia/Kolkata (IST, UTC+5:30)', 'UTC', 'Asia/Kolkata (IST)']}
                      onChange={setTimezone}
                    />
                    <SelectField
                      id="date-format"
                      label="Date Format"
                      value={dateFormat}
                      options={['DD MMM YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD', 'MM/DD/YYYY']}
                      onChange={setDateFormat}
                    />
                    <NumberField
                      id="refresh-interval"
                      label="Dashboard Refresh Interval"
                      description="How frequently dashboards auto-refresh data."
                      value={refreshInterval}
                      min={1}
                      max={60}
                      unit="minutes"
                      onChange={setRefreshInterval}
                    />
                  </div>
                )}

                {/* ── NOTIFICATIONS ── */}
                {activeSection === 'Notifications' && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-3 pb-1">Event Triggers</p>
                    <Toggle id="notif-critical-stock" label="Critical Stock Alerts" description="Alert when any medicine drops below the critical threshold." checked={notifCriticalStock} onChange={setNotifCriticalStock} />
                    <Toggle id="notif-stockout" label="Stock-out Predictions" description="Notify when AI predicts an imminent stock-out within the forecast window." checked={notifStockoutPrediction} onChange={setNotifStockoutPrediction} />
                    <Toggle id="notif-shipment-delay" label="Shipment Delays" description="Alert when an active shipment exceeds the configured delivery delay threshold." checked={notifShipmentDelay} onChange={setNotifShipmentDelay} />
                    <Toggle id="notif-cold-chain" label="Cold-Chain Temperature Alerts" description="Notify when ILR or reefer van temperatures deviate from the safe range." checked={notifColdChain} onChange={setNotifColdChain} />
                    <Toggle id="notif-transfers" label="Transfer Requests" description="Alert when a new inter-PHC resource transfer is submitted for approval." checked={notifTransferRequests} onChange={setNotifTransferRequests} />
                    <Toggle id="notif-system" label="System Notifications" description="Platform maintenance windows, sync errors, and infrastructure alerts." checked={notifSystem} onChange={setNotifSystem} />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider pt-4 pb-1">Delivery Channels</p>
                    <Toggle id="notif-email" label="Email Notifications" description="Receive alerts via the registered government email address." checked={notifEmail} onChange={setNotifEmail} />
                    <Toggle id="notif-inapp" label="In-App Notifications" description="Show real-time notification badges and alerts within the dashboard." checked={notifInApp} onChange={setNotifInApp} />
                  </div>
                )}

                {/* ── INVENTORY ── */}
                {activeSection === 'Inventory' && (
                  <div>
                    <NumberField
                      id="min-stock"
                      label="Minimum Stock Threshold"
                      description="Default buffer in days. Facilities below this threshold trigger a Low Stock warning."
                      value={minStockThreshold}
                      min={1}
                      unit="days runway"
                      onChange={setMinStockThreshold}
                    />
                    <NumberField
                      id="critical-stock"
                      label="Critical Stock Threshold"
                      description="Facilities below this runway trigger a Critical alert and emergency requisition."
                      value={criticalStockThreshold}
                      min={1}
                      unit="days runway"
                      onChange={setCriticalStockThreshold}
                    />
                    <NumberField
                      id="low-stock-warning"
                      label="Low-Stock Warning Threshold"
                      description="Facilities below this runway appear in the Low Stock monitoring queue."
                      value={lowStockWarning}
                      min={1}
                      unit="days runway"
                      onChange={setLowStockWarning}
                    />
                    <NumberField
                      id="reorder-period"
                      label="Default Reorder Period"
                      description="Standard procurement cycle used to calculate safe stock levels."
                      value={reorderPeriod}
                      min={7}
                      unit="days"
                      onChange={setReorderPeriod}
                    />
                    <Toggle
                      id="auto-stock-alerts"
                      label="Enable Automatic Stock Alerts"
                      description="Automatically trigger alerts when facilities cross configured stock thresholds."
                      checked={autoStockAlerts}
                      onChange={setAutoStockAlerts}
                    />
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <strong>Note:</strong> Inventory thresholds apply as defaults across all facilities. Individual PHC thresholds can be configured via the facility profile.
                    </div>
                  </div>
                )}

                {/* ── ALERTS ── */}
                {activeSection === 'Alerts' && (
                  <div>
                    <Toggle id="alert-email" label="Email Alert Delivery" description="Send alert notifications to the registered district administrator email." checked={alertEmailEnabled} onChange={setAlertEmailEnabled} />
                    <Toggle id="alert-sms" label="SMS Alert Delivery" description="Send critical alerts via SMS to registered mobile numbers (requires Telecom API configuration)." checked={alertSmsEnabled} onChange={setAlertSmsEnabled} />
                    <Toggle id="alert-critical-only" label="Critical Alerts Only" description="Suppress Medium and Low severity alerts. Only Critical and High alerts will be delivered." checked={alertCriticalOnly} onChange={setAlertCriticalOnly} />
                    <Toggle id="alert-escalation" label="Auto-Escalation" description="Automatically escalate unacknowledged Critical alerts to the District Health Officer after the configured delay." checked={alertEscalationEnabled} onChange={setAlertEscalationEnabled} />
                    <NumberField
                      id="escalation-delay"
                      label="Escalation Delay"
                      description="Minutes before an unacknowledged Critical alert is escalated."
                      value={alertEscalationDelay}
                      min={5}
                      max={120}
                      unit="minutes"
                      onChange={setAlertEscalationDelay}
                    />
                  </div>
                )}

                {/* ── AI & PREDICTIONS ── */}
                {activeSection === 'AI & Predictions' && (
                  <div>
                    <div className="mt-3 mb-4 p-3.5 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <svg className="w-4 h-4 text-purple-700" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.001z" />
                        </svg>
                        AI Model Configuration
                      </div>
                      These settings adjust the behaviour of the demand forecasting and redistribution recommendation engine. Higher sensitivity increases alert frequency but may generate more false positives.
                    </div>

                    <SelectField
                      id="forecast-horizon"
                      label="Forecast Horizon"
                      description="Period ahead the AI predicts medicine demand and stock-out risk."
                      value={forecastHorizon}
                      options={['7 days', '14 days', '30 days', '60 days', '90 days']}
                      onChange={setForecastHorizon}
                    />
                    <SelectField
                      id="prediction-sensitivity"
                      label="Prediction Alert Sensitivity"
                      description="Controls how aggressively the model flags risk. High = more alerts, Low = fewer alerts."
                      value={predictionSensitivity}
                      options={['Low', 'Medium', 'High', 'Very High']}
                      onChange={setPredictionSensitivity}
                    />
                    <NumberField
                      id="stockout-threshold"
                      label="Stock-Out Risk Threshold"
                      description="Probability (%) above which the AI flags a predicted stock-out as an active alert."
                      value={stockoutRiskThreshold}
                      min={5}
                      max={95}
                      unit="% probability"
                      onChange={setStockoutRiskThreshold}
                    />
                    <NumberField
                      id="demand-spike"
                      label="Demand Spike Threshold"
                      description="% increase over baseline that triggers a demand spike prediction alert."
                      value={demandSpikeThreshold}
                      min={10}
                      max={200}
                      unit="% over baseline"
                      onChange={setDemandSpikeThreshold}
                    />
                    <Toggle
                      id="ai-recommendations"
                      label="Enable AI Transfer Recommendations"
                      description="Show AI-generated surplus-to-shortage redistribution recommendations on the Transfers page."
                      checked={aiRecommendationsEnabled}
                      onChange={setAiRecommendationsEnabled}
                    />
                  </div>
                )}

                {/* ── LOGISTICS ── */}
                {activeSection === 'Logistics' && (
                  <div>
                    <SelectField
                      id="default-priority"
                      label="Default Shipment Priority"
                      description="Priority tier applied to new dispatch manifests unless overridden."
                      value={defaultShipmentPriority}
                      options={['Standard', 'Medium', 'High', 'Urgent']}
                      onChange={setDefaultShipmentPriority}
                    />
                    <NumberField
                      id="delivery-delay"
                      label="Delivery Delay Alert Threshold"
                      description="A shipment exceeding this delay beyond its scheduled ETA triggers a delay alert."
                      value={deliveryDelayThreshold}
                      min={5}
                      max={240}
                      unit="minutes"
                      onChange={setDeliveryDelayThreshold}
                    />
                    <Toggle
                      id="cold-chain-monitoring"
                      label="Cold-Chain Monitoring"
                      description="Continuously monitor ILR, vaccine refrigerator, and reefer van temperatures across the district."
                      checked={coldChainMonitoring}
                      onChange={setColdChainMonitoring}
                    />
                    <NumberField
                      id="eta-alert"
                      label="ETA Alert Window"
                      description="Alert the receiving facility when a shipment is within this many minutes of arrival."
                      value={etaAlertThreshold}
                      min={5}
                      max={120}
                      unit="minutes"
                      onChange={setEtaAlertThreshold}
                    />
                  </div>
                )}

                {/* ── SECURITY ── */}
                {activeSection === 'Security' && (
                  <div>
                    <NumberField
                      id="session-timeout"
                      label="Session Timeout"
                      description="Automatically log out after this period of inactivity to protect sensitive health data."
                      value={sessionTimeout}
                      min={5}
                      max={480}
                      unit="minutes"
                      onChange={setSessionTimeout}
                    />
                    <Toggle
                      id="two-factor"
                      label="Two-Factor Authentication (2FA)"
                      description="Require a secondary OTP via government-registered mobile number for all logins."
                      checked={twoFactorEnabled}
                      onChange={setTwoFactorEnabled}
                    />

                    {/* Login Activity */}
                    <div className="py-4 border-b border-slate-100">
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">Recent Login Activity</h3>
                      <div className="space-y-2">
                        {[
                          { time: '23 Sep 2026, 09:05 AM', ip: '103.21.44.18', location: 'Pune, MH', device: 'Chrome / Windows 11', status: 'Success' },
                          { time: '22 Sep 2026, 11:42 PM', ip: '103.21.44.18', location: 'Pune, MH', device: 'Chrome / Windows 11', status: 'Success' },
                          { time: '21 Sep 2026, 03:15 PM', ip: '117.196.88.42', location: 'Mumbai, MH', device: 'Firefox / macOS', status: 'Success' },
                        ].map((entry, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                            <div>
                              <div className="font-semibold text-slate-800">{entry.time}</div>
                              <div className="text-slate-500 mt-0.5">{entry.device} · {entry.location} · IP: {entry.ip}</div>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              {entry.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Password Controls */}
                    <div className="py-4">
                      <h3 className="text-sm font-semibold text-slate-800 mb-3">Password & Security Controls</h3>
                      <div className="flex flex-wrap gap-2">
                        <button className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400">
                          Change Password
                        </button>
                        <button className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400">
                          Manage 2FA Device
                        </button>
                        <button className="px-3.5 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400">
                          Terminate All Sessions
                        </button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        These actions will be processed via the Government Health Portal identity management service.
                      </p>
                    </div>
                  </div>
                )}

                {/* ── ACCOUNT ── */}
                {activeSection === 'Account' && (
                  <div>
                    {/* Profile Card */}
                    <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-700 text-xl font-extrabold shrink-0">
                        SR
                      </div>
                      <div>
                        <div className="text-base font-bold text-slate-900">Dr. Shalendra R.</div>
                        <div className="text-xs text-slate-500 mt-0.5">State Programme Officer (SPO) · Pune Division</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active Account
                          </span>
                          <span className="px-2 py-0.5 text-[11px] font-medium bg-sky-50 text-sky-800 border border-sky-200 rounded-full">
                            Central Admin Role
                          </span>
                          <span className="px-2 py-0.5 text-[11px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-full">
                            Clearance: State Tier-1
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Account Details */}
                    <div className="space-y-0">
                      {[
                        { label: 'Full Name', value: 'Dr. Shalendra Rathore', type: 'text' },
                        { label: 'Government Email', value: 'shalendra.r@health.mah.gov.in', type: 'email' },
                        { label: 'Employee ID', value: 'MH-SPO-2024-0881', type: 'text' },
                        { label: 'Mobile (Registered)', value: '+91 98230-XXXXX', type: 'tel' },
                      ].map((field) => (
                        <div key={field.label} className="py-3.5 border-b border-slate-100">
                          <label className="block text-sm font-semibold text-slate-800 mb-1">{field.label}</label>
                          <input
                            type={field.type}
                            defaultValue={field.value}
                            className="w-full max-w-md px-3 py-1.5 text-sm text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      ))}

                      {/* Read-only org info */}
                      <div className="py-3.5 border-b border-slate-100">
                        <label className="block text-sm font-semibold text-slate-800 mb-1">Role</label>
                        <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 max-w-md">
                          State Programme Officer — Central Administration
                        </div>
                      </div>
                      <div className="py-3.5 border-b border-slate-100">
                        <label className="block text-sm font-semibold text-slate-800 mb-1">Organisation</label>
                        <div className="text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 max-w-md">
                          Maharashtra Directorate of Health Services · Pune Division
                        </div>
                      </div>
                      <div className="py-3.5">
                        <label className="block text-sm font-semibold text-slate-800 mb-1">Account Status</label>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            Active · Verified Government User
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Save/Reset Actions */}
              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/60 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Changes are applied platform-wide. Some settings may require page reload.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSavedMessage(false)}
                    className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Reset to defaults — simplified for demo
                      setRefreshInterval(5);
                      setMinStockThreshold(30);
                      setCriticalStockThreshold(7);
                      setLowStockWarning(15);
                      setReorderPeriod(90);
                      setDeliveryDelayThreshold(30);
                      setEtaAlertThreshold(15);
                      setSessionTimeout(60);
                      setSavedMessage(false);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
