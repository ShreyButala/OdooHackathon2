import { useState } from 'react';
import { 
  BarChart3, 
  Truck, 
  MapPin, 
  TrendingUp, 
  Fuel, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Plus, 
  ArrowRight,
  Settings
} from 'lucide-react';

import { Switch } from './ui/material-design-3-switch';
import { Dock } from './ui/dock-two';

/**
 * DashboardShowcase — the live, interactive dashboard used at /dashboard.
 * Accepts isDark prop from DashboardPage to apply dark: context for all sub-components.
 */
const pageDetails = {
  overview: { title: "Overview & Telemetry", subtitle: "Real-time dispatch metrics and fleet performance" },
  vehicles: { title: "Vehicle Management", subtitle: "Monitor, filter, and configure active fleet assets" },
  trips: { title: "Trip Management", subtitle: "Live routing, ETA updates, and dispatch schedule" },
  reports: { title: "Reports & Analytics", subtitle: "Detailed fuel efficiency, operating margins, and fleet utilization" },
  fuel: { title: "Fuel Analytics", subtitle: "Fuel logs, efficiency patterns, and carbon offset tracking" },
  maintenance: { title: "Maintenance & Diagnostics", subtitle: "Preventive maintenance scheduling and active telemetry alerts" },
  settings: { title: "System Settings", subtitle: "Configure automated dispatch rules and preferences" }
};

export default function DashboardShowcase({ isDark = false, activeTab = 'overview', setActiveTab = () => {} }) {

  return (
    <div className="w-full bg-surface rounded-custom border border-border overflow-hidden shadow-sm font-sans">
      {/* Browser Chrome Header */}
      <div className="bg-background px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="bg-surface border border-border text-xs px-6 py-1 rounded-md text-text-secondary select-none font-sans w-1/3 text-center truncate">
          app.transitops.com/dashboard/{activeTab}
        </div>
        <div className="w-8" />
      </div>

      {/* Page Title & Orientation Block (Replacing Redundant Tab Navigation) */}
      <div className="px-6 pt-6 pb-4 border-b border-border bg-surface flex flex-col justify-center select-none">
        <h2 className="text-xl font-bold text-primary dark:text-[#C96C2B] font-sans">
          {pageDetails[activeTab]?.title}
        </h2>
        <p className="text-xs text-text-secondary font-sans mt-0.5">
          {pageDetails[activeTab]?.subtitle}
        </p>
      </div>

      {/* Dashboard Body — padded at bottom so content clears the fixed Dock */}
      <div className="p-6 bg-background min-h-[540px] pb-24">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'vehicles' && <VehiclesTab />}
        {activeTab === 'trips' && <TripsTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'fuel' && <FuelTab />}
        {activeTab === 'maintenance' && <MaintenanceTab />}
        {activeTab === 'settings' && <SettingsTab isDark={isDark} />}
      </div>
    </div>
  );
}

/* Exported so DashboardPage can render it fixed to the viewport */
export function DashboardDock({ activeTab, setActiveTab }) {
  const dockItems = [
    { icon: BarChart3, label: "Home",        onClick: () => setActiveTab('overview'),    active: activeTab === 'overview'    },
    { icon: Truck,     label: "Vehicles",    onClick: () => setActiveTab('vehicles'),    active: activeTab === 'vehicles'    },
    { icon: MapPin,    label: "Trips",       onClick: () => setActiveTab('trips'),       active: activeTab === 'trips'       },
    { icon: Wrench,    label: "Maintenance", onClick: () => setActiveTab('maintenance'), active: activeTab === 'maintenance' },
    { icon: Fuel,      label: "Fuel",        onClick: () => setActiveTab('fuel'),        active: activeTab === 'fuel'        },
    { icon: TrendingUp,label: "Reports",     onClick: () => setActiveTab('reports'),     active: activeTab === 'reports'     },
    { icon: Settings,  label: "Settings",    onClick: () => setActiveTab('settings'),    active: activeTab === 'settings'    },
    { icon: Plus,      label: "Add Trip",    onClick: () => alert("Dispatch routing system triggered: Assigning optimal vehicle for Delhi → Mumbai HQ!") }
  ];
  return <Dock items={dockItems} />;
}

// 1. Overview Tab
function OverviewTab() {
  const stats = [
    { label: 'Active Vehicles', value: '412', change: '+12 today', icon: Truck },
    { label: 'Trips Completed', value: '25,482', change: '99.8% on-time', icon: MapPin },
    { label: 'Fuel Spend (MTD)', value: '₹14,20,500', change: '-4.2% efficiency gain', icon: Fuel },
    { label: 'Pending Services', value: '8', change: '3 urgent alerts', icon: Wrench }
  ];

  const criticalAlerts = [
    { id: 'AL-104', type: 'fuel', message: 'Sudden fuel drop detected: MH-12-QW-8842', time: '12 mins ago', severity: 'danger' },
    { id: 'AL-105', type: 'maintenance', message: 'Engine diagnostic alert: KA-03-MM-4491', time: '45 mins ago', severity: 'warning' },
    { id: 'AL-106', type: 'trip', message: 'Unscheduled stop detected: UP-16-AA-2390', time: '1 hr ago', severity: 'info' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-surface p-5 rounded-custom border border-border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-primary mt-1 font-sans">{stat.value}</h3>
                </div>
                <div className="p-2 bg-background rounded-lg">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-success mt-3 font-medium flex items-center gap-1">
                <span>●</span> {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time map simulation */}
        <div className="lg:col-span-2 bg-surface p-5 rounded-custom border border-border shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h4 className="text-sm font-semibold text-primary">Live Fleet Operations</h4>
              <p className="text-xs text-text-secondary">Tracking active dispatches across primary hubs</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-pulse-opacity rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs font-semibold text-success">Live Tracking</span>
            </div>
          </div>
          {/* Simulated Map Schematic */}
          <div className="bg-background border border-border rounded-lg h-64 relative overflow-hidden flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#163A5F" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <path d="M 50 180 Q 200 60 400 120 T 600 200" fill="none" stroke="#E5E7EB" strokeWidth="3" strokeDasharray="5,5" />
              <path d="M 120 220 Q 300 100 480 80 T 700 140" fill="none" stroke="#163A5F" strokeWidth="2" opacity="0.3" />
              <path d="M 50 180 Q 200 60 400 120" fill="none" stroke="#C96C2B" strokeWidth="3" strokeDasharray="100" strokeDashoffset="50" className="animate-[dash_10s_linear_infinite]" />
            </svg>
            <div className="absolute top-1/4 left-1/4 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-primary border-2 border-white shadow" />
              <span className="text-[10px] font-semibold text-primary bg-surface px-1.5 py-0.5 rounded shadow mt-1">Delhi Hub</span>
            </div>
            <div className="absolute top-1/2 left-2/3 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-success border-2 border-white shadow" />
              <span className="text-[10px] font-semibold text-primary bg-surface px-1.5 py-0.5 rounded shadow mt-1">Mumbai HQ</span>
            </div>
            <div className="absolute bottom-1/4 left-1/2 flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-accent border-2 border-white shadow" />
              <span className="text-[10px] font-semibold text-primary bg-surface px-1.5 py-0.5 rounded shadow mt-1">Pune Depot</span>
            </div>
            <div className="absolute top-[32%] left-[45%] flex items-center gap-1.5 bg-surface border border-border py-1 px-2 rounded-full shadow-lg">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-[9px] font-bold text-primary font-sans">MH-12-TR-9981 (Active)</span>
            </div>
          </div>
        </div>

        {/* Alerts & Tasks Panel */}
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm flex flex-col">
          <h4 className="text-sm font-semibold text-primary mb-4 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-accent" />
            Operations Alerts
          </h4>
          <div className="space-y-3 flex-1 overflow-y-auto">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="p-3 border border-border rounded-lg flex items-start gap-3 hover:bg-background transition-colors">
                <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                  alert.severity === 'danger' ? 'bg-danger' :
                  alert.severity === 'warning' ? 'bg-warning' : 'bg-primary'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-text font-medium">{alert.message}</p>
                  <div className="flex justify-between items-center mt-1.5">
                    <span className="text-[10px] text-text-secondary font-mono">{alert.id}</span>
                    <span className="text-[10px] text-text-secondary">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-xs font-semibold text-accent flex items-center justify-center gap-1.5 pt-3 border-t border-border hover:text-accent/80 transition-colors">
            Manage All Alerts <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Vehicles Tab (Incorporates Switch component for "On Duty")
function VehiclesTab() {
  const vehicles = [
    { id: 'V-8842', plate: 'MH-12-QW-8842', model: 'Tata Signa 4825.T', driver: 'Rajesh Kumar', type: 'Heavy Truck', status: 'In Transit', fuel: '74%' },
    { id: 'V-4491', plate: 'KA-03-MM-4491', model: 'Ashok Leyland Partner', driver: 'Amit Sharma', type: 'LVC', status: 'Maintenance', fuel: '21%' },
    { id: 'V-2390', plate: 'UP-16-AA-2390', model: 'BharatBenz 3523R', driver: 'Satish Pal', type: 'Medium Duty', status: 'Active', fuel: '92%' },
    { id: 'V-7711', plate: 'MH-14-GH-7711', model: 'Tata Intra V30', driver: 'Vikram Singh', type: 'Mini Truck', status: 'Idle', fuel: '88%' },
    { id: 'V-0504', plate: 'DL-01-EE-0504', model: 'Mahindra Blazo X', driver: 'Gurpreet Singh', type: 'Heavy Truck', status: 'In Transit', fuel: '45%' }
  ];

  return (
    <div className="bg-surface rounded-custom border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 bg-surface">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search vehicles, drivers, IDs..." 
            className="w-full pl-9 pr-4 py-1.5 text-xs border border-border rounded-lg bg-background text-text placeholder:text-text-secondary focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs border border-border rounded-lg font-medium text-text-secondary hover:text-primary hover:bg-background transition-colors">
            Filter
          </button>
          <button className="px-3 py-1.5 text-xs bg-primary text-white rounded-lg font-semibold flex items-center gap-1.5 hover:bg-primary/95 transition-colors">
            <Plus className="w-3.5 h-3.5" /> Add Vehicle
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-background text-text-secondary font-medium uppercase tracking-wider border-b border-border">
              <th className="p-4">Vehicle ID</th>
              <th className="p-4">License Plate</th>
              <th className="p-4">Model</th>
              <th className="p-4">Type</th>
              <th className="p-4">Assigned Driver</th>
              <th className="p-4">Fuel Level</th>
              <th className="p-4 text-center">On Duty</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-background transition-colors">
                <td className="p-4 font-mono font-bold text-primary">{v.id}</td>
                <td className="p-4 font-semibold text-text">{v.plate}</td>
                <td className="p-4 text-text-secondary">{v.model}</td>
                <td className="p-4 text-text-secondary">{v.type}</td>
                <td className="p-4 font-medium text-text">{v.driver}</td>
                <td className="p-4 font-medium text-text">{v.fuel}</td>
                <td className="p-4 text-center">
                  <div className="inline-flex justify-center items-center">
                    <Switch 
                      size="sm" 
                      haptic="light" 
                      defaultChecked={v.status === 'Active' || v.status === 'In Transit'} 
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    v.status === 'In Transit' ? 'bg-success/10 text-success' :
                    v.status === 'Maintenance' ? 'bg-danger/10 text-danger' :
                    v.status === 'Active' ? 'bg-primary/10 text-primary' :
                    'bg-warning/10 text-warning'
                  }`}>
                    {v.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. Trips Tab
function TripsTab() {
  const trips = [
    { id: 'T-9981', route: 'Delhi Hub → Mumbai HQ', driver: 'Rajesh Kumar', eta: '4 hrs', progress: 75, status: 'On Schedule' },
    { id: 'T-9982', route: 'Pune Depot → Chennai Port', driver: 'Satish Pal', eta: 'Delayed (1.5h)', progress: 40, status: 'Delayed' },
    { id: 'T-9983', route: 'Mumbai HQ → Nagpur Warehouses', driver: 'Gurpreet Singh', eta: '12 hrs', progress: 15, status: 'On Schedule' },
    { id: 'T-9984', route: 'Kolkata Depot → Delhi Hub', driver: 'Vikram Singh', eta: 'Completed', progress: 100, status: 'Completed' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trips.map((trip) => (
        <div key={trip.id} className="bg-surface p-5 rounded-custom border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono font-bold text-accent">{trip.id}</span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                trip.status === 'On Schedule' ? 'bg-success/10 text-success' :
                trip.status === 'Delayed' ? 'bg-danger/10 text-danger' :
                'bg-primary/10 text-primary'
              }`}>
                {trip.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-text mb-1">{trip.route}</h4>
            <p className="text-xs text-text-secondary">Driver: <strong className="text-text font-medium">{trip.driver}</strong></p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Progress</span>
              <span>{trip.progress}%</span>
            </div>
            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: `${trip.progress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">ETA / Status:</span>
              <strong className="text-text font-semibold">{trip.eta}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. Reports Tab
function ReportsTab() {
  const summaryStats = [
    { label: 'Total Trips MTD', value: '25,482', change: '+14.2% YoY', icon: MapPin, color: 'text-primary dark:text-[#C96C2B]' },
    { label: 'Avg. Cost per Km', value: '₹18.42', change: '-2.1% efficiency gain', icon: TrendingUp, color: 'text-accent' },
    { label: 'On-Time SLA Rate', value: '99.8%', change: 'Target: 98.5%', icon: CheckCircle2, color: 'text-success' },
    { label: 'Avg Fuel Efficiency', value: '6.8 km/L', change: '+5.4% MTD improvement', icon: Fuel, color: 'text-warning' }
  ];

  const recentCosts = [
    { vehicle: 'MH-12-QW-8842', model: 'Tata Signa 4825.T', distance: '12,450 km', fuel: '2,590 L', cost: '₹1,14,500', efficiency: '4.8 km/L' },
    { vehicle: 'KA-03-MM-4491', model: 'Ashok Leyland Partner', distance: '4,890 km', fuel: '1,018 L', cost: '₹46,200', efficiency: '4.8 km/L' },
    { vehicle: 'UP-16-AA-2390', model: 'BharatBenz 3523R', distance: '15,200 km', fuel: '2,923 L', cost: '₹1,44,000', efficiency: '5.2 km/L' },
    { vehicle: 'MH-14-GH-7711', model: 'Tata Intra V30', distance: '2,150 km', fuel: '173 L', cost: '₹16,400', efficiency: '12.4 km/L' },
    { vehicle: 'DL-01-EE-0504', model: 'Mahindra Blazo X', distance: '9,840 km', fuel: '2,186 L', cost: '₹92,800', efficiency: '4.5 km/L' }
  ];

  return (
    <div className="space-y-6">
      {/* 4a. Summary stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-surface p-5 rounded-custom border border-border shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-primary dark:text-[#F5F7F8] mt-1 font-sans">{stat.value}</h3>
                </div>
                <div className="p-2 bg-background rounded-lg">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
              <p className="text-xs text-success mt-3 font-medium flex items-center gap-1">
                <span>●</span> {stat.change}
              </p>
            </div>
          );
        })}
      </div>

      {/* 4b. Grid row 1: Pie/Donut + Line chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart: Trip Status */}
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary dark:text-text mb-1">Trip Status Breakdown</h4>
            <p className="text-xs text-text-secondary mb-6">Real-time status of all dispatched routes MTD</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
            {/* SVG Donut */}
            <div className="relative w-32 h-32 shrink-0">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="-rotate-90">
                {/* Background circle */}
                <circle cx="50" cy="50" r="36" fill="transparent" stroke="var(--color-border)" strokeWidth="10" />
                
                {/* Segments: On-Time (65%, Circumference = 226.2, strokeDasharray="147.03 226.2", offset = 0) */}
                <circle cx="50" cy="50" r="36" fill="transparent" stroke="#2F7A5F" strokeWidth="10" 
                  strokeDasharray="147.03 226.2" strokeDashoffset="0" />
                
                {/* Delayed (15%, dash = 33.93, offset = -147.03) */}
                <circle cx="50" cy="50" r="36" fill="transparent" stroke="#C94F4F" strokeWidth="10" 
                  strokeDasharray="33.93 226.2" strokeDashoffset="-147.03" />
                
                {/* In Transit (12%, dash = 27.14, offset = -180.96) */}
                <circle cx="50" cy="50" r="36" fill="transparent" stroke="#163A5F" strokeWidth="10" 
                  strokeDasharray="27.14 226.2" strokeDashoffset="-180.96" />
                
                {/* Cancelled (8%, dash = 18.1, offset = -208.1) */}
                <circle cx="50" cy="50" r="36" fill="transparent" stroke="#D9A441" strokeWidth="10" 
                  strokeDasharray="18.1 226.2" strokeDashoffset="-208.1" />
              </svg>
              {/* Inner Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center font-sans">
                <span className="text-lg font-bold text-primary dark:text-[#F5F7F8]">25K+</span>
                <span className="text-[9px] text-text-secondary uppercase tracking-wide">Trips</span>
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1 space-y-2 text-xs w-full sm:w-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2F7A5F]" />
                  <span className="text-text-secondary font-medium">On-Time</span>
                </div>
                <span className="font-bold text-text">65%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C94F4F]" />
                  <span className="text-text-secondary font-medium">Delayed</span>
                </div>
                <span className="font-bold text-text">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#163A5F]" />
                  <span className="text-text-secondary font-medium">In Transit</span>
                </div>
                <span className="font-bold text-text">12%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]" />
                  <span className="text-text-secondary font-medium">Cancelled</span>
                </div>
                <span className="font-bold text-text">8%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Chart: Trips Completed Trend */}
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm lg:col-span-2">
          <h4 className="text-sm font-semibold text-primary dark:text-text mb-1">Trips Completed Trend</h4>
          <p className="text-xs text-text-secondary mb-4">Trips dispatched and completed weekly (volume in thousands)</p>
          
          {/* Fixed-height wrapper — SVG scales to width, preserves aspect ratio */}
          <div className="relative w-full" style={{ paddingBottom: '36%', minHeight: 160 }}>
            <svg
              viewBox="0 0 500 180"
              preserveAspectRatio="xMidYMid meet"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#163A5F" stopOpacity="0.2"/>
                  <stop offset="100%" stopColor="#163A5F" stopOpacity="0.0"/>
                </linearGradient>
              </defs>
              {/* Grid lines */}
              <line x1="40" y1="20"    x2="460" y2="20"    stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="52.5" x2="460" y2="52.5" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="85"   x2="460" y2="85"   stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="117.5" x2="460" y2="117.5" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="3,3" />
              <line x1="40" y1="150" x2="460" y2="150" stroke="var(--color-border)" strokeWidth="0.75" />
              {/* Area */}
              <path d="M 40 150 L 40 132.7 L 124 102.3 L 208 111 L 292 72 L 376 85 L 460 54.7 L 460 150 Z" fill="url(#areaGrad)" />
              {/* Line */}
              <path d="M 40 132.7 L 124 102.3 L 208 111 L 292 72 L 376 85 L 460 54.7" fill="none" stroke="#163A5F" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {/* Data points */}
              {[
                { x: 40,  y: 132.7, val: '3.4K' },
                { x: 124, y: 102.3, val: '4.1K' },
                { x: 208, y: 111,   val: '3.9K' },
                { x: 292, y: 72,    val: '4.8K' },
                { x: 376, y: 85,    val: '4.5K' },
                { x: 460, y: 54.7,  val: '5.2K' },
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="12" fill="transparent" />
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill="#fff" stroke="#163A5F" strokeWidth="2" />
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" fill="#163A5F" fontSize="8" fontWeight="700" fontFamily="sans-serif">{pt.val}</text>
                </g>
              ))}
              {/* Y labels */}
              <text x="14" y="24"    textAnchor="end" fill="#6B7280" fontSize="8" fontFamily="sans-serif">6K</text>
              <text x="14" y="56.5" textAnchor="end" fill="#6B7280" fontSize="8" fontFamily="sans-serif">5K</text>
              <text x="14" y="89"   textAnchor="end" fill="#6B7280" fontSize="8" fontFamily="sans-serif">4K</text>
              <text x="14" y="121.5" textAnchor="end" fill="#6B7280" fontSize="8" fontFamily="sans-serif">3K</text>
              {/* X labels */}
              {[
                { x: 40,  label: 'Wk 1' }, { x: 124, label: 'Wk 2' }, { x: 208, label: 'Wk 3' },
                { x: 292, label: 'Wk 4' }, { x: 376, label: 'Wk 5' }, { x: 460, label: 'Wk 6' },
              ].map(({ x, label }) => (
                <text key={label} x={x} y="165" textAnchor="middle" fill="#6B7280" fontSize="8" fontFamily="sans-serif">{label}</text>
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* 4c. Grid row 2: Bar chart + Operating margin details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart: Monthly Fuel Spend */}
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm lg:col-span-2">
          <h4 className="text-sm font-semibold text-primary dark:text-text mb-1">Fuel Spend by Month</h4>
          <p className="text-xs text-text-secondary mb-6">Total spend on diesel refueling over the last 6 months</p>
          
          <div className="h-44 flex items-end gap-3 px-2 border-b border-border">
            {[
              { label: 'Jan', val: 78, display: '₹12.4L' },
              { label: 'Feb', val: 72, display: '₹11.8L' },
              { label: 'Mar', val: 89, display: '₹14.2L' },
              { label: 'Apr', val: 85, display: '₹13.5L' },
              { label: 'May', val: 98, display: '₹15.8L' },
              { label: 'Jun', val: 89, display: '₹14.2L' }
            ].map((bar, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors rounded-t-sm h-32 flex items-end">
                  <div 
                    className="w-full bg-[#C96C2B] group-hover:bg-[#163A5F] transition-all rounded-t-sm relative"
                    style={{ height: `${bar.val}%` }}
                  >
                    {/* Tooltip inside bar */}
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#111827] dark:text-[#F5F7F8] opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap font-sans">
                      {bar.display}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-text-secondary font-medium">{bar.label}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 text-xs text-text-secondary">
            <span>Target Monthly Cap: ₹16.0L</span>
            <span className="text-success font-semibold">Average Spend: ₹13.65L</span>
          </div>
        </div>

        {/* Operating Margins & Callout */}
        <div className="space-y-4">
          <div className="bg-surface p-5 rounded-custom border border-border shadow-sm">
            <h4 className="text-sm font-semibold text-primary dark:text-text mb-3">Operating Margins</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs border-b border-border pb-2">
                <span className="text-text-secondary">Fleet Cost per Km</span>
                <strong className="text-text">₹18.42</strong>
              </div>
              <div className="flex justify-between text-xs border-b border-border pb-2">
                <span className="text-text-secondary">Average Trip Margin</span>
                <strong className="text-success">+24.8%</strong>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-secondary">Idle Cost Losses</span>
                <strong className="text-danger">₹28,500</strong>
              </div>
            </div>
          </div>
          <div className="bg-primary text-white p-5 rounded-custom border border-transparent shadow-sm relative overflow-hidden">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
              <TrendingUp className="w-32 h-32" />
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wide">Automated Dispatch</span>
            <h4 className="text-lg font-bold mt-1 mb-2">99.8% Accuracy</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              AI-optimized load matching has reduced route delays by 42% over the last quarter.
            </p>
          </div>
        </div>
      </div>

      {/* 4d. Data Table: Cost Breakdown by Vehicle */}
      <div className="bg-surface rounded-custom border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface">
          <h4 className="text-xs font-bold text-primary dark:text-text uppercase tracking-wider">Vehicle Cost Breakdown</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-background text-text-secondary font-medium uppercase tracking-wider border-b border-border">
                <th className="p-4">Vehicle ID</th>
                <th className="p-4">Model</th>
                <th className="p-4">Total Distance</th>
                <th className="p-4">Fuel Spent</th>
                <th className="p-4">Operating Cost</th>
                <th className="p-4">Efficiency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentCosts.map((c, i) => (
                <tr key={i} className="hover:bg-background transition-colors">
                  <td className="p-4 font-mono font-bold text-primary dark:text-accent">{c.vehicle}</td>
                  <td className="p-4 font-medium text-text">{c.model}</td>
                  <td className="p-4 text-text-secondary">{c.distance}</td>
                  <td className="p-4 text-text-secondary">{c.fuel}</td>
                  <td className="p-4 font-bold text-primary dark:text-text">{c.cost}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-success/10 text-success">
                      {c.efficiency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 5. Fuel Analytics Tab
function FuelTab() {
  const logs = [
    { vehicle: 'MH-12-QW-8842', amount: '₹18,500', volume: '190 L', eff: '4.8 km/L', driver: 'Rajesh Kumar', date: 'Jul 11, 2026' },
    { vehicle: 'UP-16-AA-2390', amount: '₹22,100', volume: '228 L', eff: '5.2 km/L', driver: 'Satish Pal', date: 'Jul 10, 2026' },
    { vehicle: 'DL-01-EE-0504', amount: '₹14,200', volume: '145 L', eff: '4.5 km/L', driver: 'Gurpreet Singh', date: 'Jul 09, 2026' },
    { vehicle: 'MH-14-GH-7711', amount: '₹6,400', volume: '66 L', eff: '12.4 km/L', driver: 'Vikram Singh', date: 'Jul 08, 2026' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm">
          <p className="text-xs text-text-secondary font-medium">Avg Fuel Price (Diesel)</p>
          <h3 className="text-xl font-bold text-text mt-1">₹94.50 / L</h3>
          <span className="text-[10px] text-text-secondary">National average estimate</span>
        </div>
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm">
          <p className="text-xs text-text-secondary font-medium">Monthly Fuel Consumed</p>
          <h3 className="text-xl font-bold text-text mt-1">14,890 L</h3>
          <span className="text-[10px] text-success font-semibold">-540 L from last month</span>
        </div>
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm">
          <p className="text-xs text-text-secondary font-medium">Carbon Offsets (MTD)</p>
          <h3 className="text-xl font-bold text-success mt-1">4.2 Metric Tons</h3>
          <span className="text-[10px] text-text-secondary">Driven by route optimization</span>
        </div>
      </div>

      <div className="bg-surface rounded-custom border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface">
          <h4 className="text-xs font-bold text-text uppercase tracking-wider">Recent Fuel Entries</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-background text-text-secondary font-medium border-b border-border">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Fuel Volume</th>
                <th className="p-4">Measured Efficiency</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Refueling Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-background transition-colors">
                  <td className="p-4 font-semibold text-text">{log.vehicle}</td>
                  <td className="p-4 font-bold text-primary">{log.amount}</td>
                  <td className="p-4 text-text-secondary">{log.volume}</td>
                  <td className="p-4 font-semibold text-text">{log.eff}</td>
                  <td className="p-4 text-text-secondary">{log.driver}</td>
                  <td className="p-4 text-text-secondary">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 6. Maintenance Tab
function MaintenanceTab() {
  const issues = [
    { vehicle: 'MH-12-QW-8842', issue: 'Scheduled Brake Pad Replacement', cost: '₹8,500', status: 'Completed', date: 'Jul 10, 2026' },
    { vehicle: 'KA-03-MM-4491', issue: 'Engine Overheating Diagnostic Check', cost: '₹12,400', status: 'In Service', date: 'Jul 12, 2026' },
    { vehicle: 'UP-16-AA-2390', issue: 'Suspension Bushing Replacement', cost: '₹6,200', status: 'Scheduled', date: 'Jul 15, 2026' },
    { vehicle: 'DL-01-EE-0504', issue: 'Odometer Sensor Error Recalibration', cost: '₹3,800', status: 'Pending Approval', date: 'Jul 18, 2026' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-danger/10 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text">Critical Diagnostics</h4>
            <p className="text-xs text-text-secondary mt-0.5">1 vehicle requires immediate attention (Engine diagnostic check active).</p>
          </div>
        </div>
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-success/10 rounded-lg">
            <CheckCircle2 className="w-6 h-6 text-success" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-text">Compliance Rate</h4>
            <p className="text-xs text-text-secondary mt-0.5">96.4% of regular preventive maintenance completed on schedule.</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-custom border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface">
          <h4 className="text-xs font-bold text-text uppercase tracking-wider">Service Queue & Diagnostics</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-background text-text-secondary font-medium border-b border-border">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Reported Issue / Task</th>
                <th className="p-4">Estimated Cost</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Work Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {issues.map((issue, i) => (
                <tr key={i} className="hover:bg-background transition-colors">
                  <td className="p-4 font-semibold text-text">{issue.vehicle}</td>
                  <td className="p-4 text-text-secondary">{issue.issue}</td>
                  <td className="p-4 font-bold text-primary">{issue.cost}</td>
                  <td className="p-4 text-text-secondary">{issue.date}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      issue.status === 'Completed' ? 'bg-success/10 text-success' :
                      issue.status === 'In Service' ? 'bg-primary/10 text-primary' :
                      issue.status === 'Scheduled' ? 'bg-warning/10 text-warning' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {issue.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// 7. Settings Tab
function SettingsTab({ isDark }) {
  const [autoDispatch, setAutoDispatch] = useState(true);
  const [diagAlerts, setDiagAlerts] = useState(true);
  const [forceRouting, setForceRouting] = useState(false);

  return (
    <div className="bg-surface rounded-custom border border-border shadow-sm p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-text">System Preferences</h4>
        <p className="text-xs text-text-secondary">Configure rules, notification settings, and automation toggles</p>
      </div>

      <div className="space-y-4 divide-y divide-border pt-2">
        {/* Toggle 1: Auto-Dispatch */}
        <div className="flex items-center justify-between py-3">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-text">Auto-Dispatch Engine</label>
            <p className="text-[11px] text-text-secondary">Automatically assign incoming loads to nearest available drivers.</p>
          </div>
          <Switch 
            checked={autoDispatch} 
            onCheckedChange={setAutoDispatch} 
            haptic="light" 
          />
        </div>

        {/* Toggle 2: Diagnostic Alerts */}
        <div className="flex items-center justify-between py-3">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-text">Critical Diagnostics Alerts</label>
            <p className="text-[11px] text-text-secondary">Send instant SMS updates when telemetry fault codes trigger.</p>
          </div>
          <Switch 
            checked={diagAlerts} 
            onCheckedChange={setDiagAlerts} 
            haptic="light" 
            showIcons={true}
          />
        </div>

        {/* Toggle 3: Force Maintenance Routing */}
        <div className="flex items-center justify-between py-3">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-danger">Strict Maintenance Lockout</label>
            <p className="text-[11px] text-text-secondary">Automatically suspend vehicles from dispatch if service odometer limit is exceeded.</p>
          </div>
          <Switch 
            checked={forceRouting} 
            onCheckedChange={setForceRouting} 
            variant="destructive" 
            haptic="heavy" 
            showIcons={true}
          />
        </div>

        {/* Toggle 4: Dark Mode — shows live state from parent */}
        <div className="flex items-center justify-between py-3">
          <div className="space-y-0.5">
            <label className="text-xs font-bold text-text">System Dark Mode</label>
            <p className="text-[11px] text-text-secondary">
              {isDark ? 'Currently active — toggle in the profile menu above.' : 'Toggle from the profile avatar menu in the top bar.'}
            </p>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${isDark ? 'bg-primary/10 text-primary' : 'bg-background text-text-secondary border border-border'}`}>
            {isDark ? 'Dark' : 'Light'}
          </span>
        </div>
      </div>
    </div>
  );
}
