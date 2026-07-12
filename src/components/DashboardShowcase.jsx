import { useState, useEffect, useRef } from 'react';
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
  Settings,
  X,
  Download,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import LiveMap from './LiveMap';


import { Switch } from './ui/material-design-3-switch';
import { Dock } from './ui/dock-two';

/**
 * DashboardShowcase — the live, interactive dashboard used at /dashboard.
 * Accepts isDark prop from DashboardPage to apply dark: context for all sub-components.
 */
export default function DashboardShowcase({ isDark = false }) {
  const { user } = useAuth();
  const role = user?.role || 'FLEET_MANAGER';

  const [activeTab, setActiveTab] = useState('overview');
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef([]);
  const containerRef = useRef(null);

  const allTabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, roles: ['FLEET_MANAGER', 'DISPATCHER', 'FINANCIAL_ANALYST', 'SAFETY_OFFICER'] },
    { id: 'vehicles', label: 'Vehicle Management', icon: Truck, roles: ['FLEET_MANAGER', 'DISPATCHER'] },
    { id: 'trips', label: 'Trip Management', icon: MapPin, roles: ['FLEET_MANAGER', 'DISPATCHER'] },
    { id: 'reports', label: 'Reports & Analytics', icon: TrendingUp, roles: ['FLEET_MANAGER', 'FINANCIAL_ANALYST'] },
    { id: 'fuel', label: 'Fuel Analytics', icon: Fuel, roles: ['FLEET_MANAGER', 'DISPATCHER'] },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, roles: ['FLEET_MANAGER'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'] }
  ];

  const tabs = allTabs.filter(t => t.roles.includes(role));

  // Default active tab to the first available if current is not allowed
  useEffect(() => {
    if (!tabs.find(t => t.id === activeTab) && tabs.length > 0) {
      setActiveTab(tabs[0].id);
    }
  }, [role, tabs, activeTab]);

  // Adjust sliding underline position when active tab changes or window resizes
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeBtn = tabRefs.current[activeIndex];
    if (activeBtn) {
      setUnderlineStyle({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
    }
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
      const activeBtn = tabRefs.current[activeIndex];
      if (activeBtn) {
        setUnderlineStyle({ left: activeBtn.offsetLeft, width: activeBtn.offsetWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // Persistent bottom-center quick-action dock items (filtered by role)
  const dockItems = allTabs
    .filter(t => t.roles.includes(role))
    .map(t => ({
      icon: t.icon,
      label: t.label.split(' ')[0],
      onClick: () => setActiveTab(t.id)
    }));

  if (['FLEET_MANAGER', 'DISPATCHER'].includes(role)) {
    dockItems.push({ 
      icon: Plus, 
      label: "Add Trip", 
      onClick: () => {
        alert("Dispatch routing system triggered: Assigning optimal vehicle for Delhi -> Mumbai HQ!");
      } 
    });
  }

  return (
    <div className="w-full glass-panel-light rounded-[2rem] border border-white/60 overflow-hidden shadow-2xl font-sans relative">
      {/* Browser Chrome Header */}
      <div className="bg-white/40 backdrop-blur-md px-6 py-4 border-b border-white/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm" />
          <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm" />
          <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
        </div>
        <div className="bg-white/80 border border-white/60 shadow-inner text-xs px-8 py-1.5 rounded-full text-primary font-semibold w-1/3 text-center truncate">
          app.transitops.com/dashboard/{activeTab}
        </div>
        <div className="w-12" />
      </div>

      {/* Tabs Navigation */}
      <div ref={containerRef} className="border-b border-white/40 bg-white/30 flex overflow-x-auto scrollbar-none relative backdrop-blur-sm">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-8 py-5 text-sm font-bold transition-all shrink-0 relative z-10 ${
                isActive ? 'text-primary bg-white/60 shadow-[inset_0_1px_4px_rgba(0,0,0,0.05)] rounded-t-xl' : 'text-[#64748B] hover:text-primary hover:bg-white/20'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
        {/* Sliding underline element */}
        <div 
          className="absolute bottom-0 h-[2.5px] bg-accent transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ left: `${underlineStyle.left}px`, width: `${underlineStyle.width}px` }}
        />
      </div>

      {/* Dashboard Body */}
      <div className="p-8 bg-transparent min-h-[540px] pb-28 relative">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'vehicles' && <VehiclesTab />}
        {activeTab === 'trips' && <TripsTab />}
        {activeTab === 'reports' && <ReportsTab />}
        {activeTab === 'fuel' && <FuelTab />}
        {activeTab === 'maintenance' && <MaintenanceTab />}
        {activeTab === 'settings' && <SettingsTab isDark={isDark} />}

        {/* Floating Quick Action Dock */}
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
          <div className="pointer-events-auto">
            <Dock items={dockItems} />
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. Overview Tab
function OverviewTab() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard').then(res => {
      setData(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-sm text-text-secondary">Loading dashboard...</div>;

  const stats = [
    { label: 'Active Vehicles', value: data?.activeVehicles || 0, change: 'Live status', icon: Truck },
    { label: 'Available Vehicles', value: data?.availableVehicles || 0, change: 'Ready for dispatch', icon: CheckCircle2 },
    { label: 'Drivers On Duty', value: data?.driversOnDuty || 0, change: 'Active on road', icon: MapPin },
    { label: 'Vehicles In Shop', value: data?.vehiclesInShop || 0, change: 'Currently in maintenance', icon: Wrench }
  ];

  const criticalAlerts = [
    { id: 'AL-104', type: 'info', message: `Fleet utilization is at ${data?.fleetUtilization}%`, time: 'Just now', severity: 'info' },
    { id: 'AL-105', type: 'trip', message: `${data?.tripsActive} trips are currently dispatched`, time: 'Just now', severity: 'info' },
    { id: 'AL-106', type: 'trip', message: `${data?.tripsPending} trips are pending dispatch`, time: 'Just now', severity: 'warning' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Real-time map simulation */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-base font-bold text-primary">Live Fleet Operations</h4>
              <p className="text-xs text-[#64748B] font-medium mt-1">Tracking active dispatches across primary hubs</p>
            </div>
            <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-pulse-opacity rounded-full h-2 w-2 bg-success" />
              </span>
              <span className="text-xs font-bold text-success uppercase tracking-wider">Live Tracking</span>
            </div>
          </div>
          {/* Leaflet Real Map integration */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl h-72 relative overflow-hidden flex items-center justify-center z-0 shadow-inner">
            <LiveMap />
          </div>
        </div>

        {/* Alerts & Tasks Panel */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg flex flex-col">
          <h4 className="text-base font-bold text-primary mb-6 flex items-center gap-2">
            <div className="p-1.5 bg-accent/10 rounded-md">
              <AlertTriangle className="w-4 h-4 text-accent" />
            </div>
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
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ registrationNumber: '', vehicleName: '', vehicleType: 'TRUCK' });
  const [submitting, setSubmitting] = useState(false);

  const fetchVehicles = () => {
    setLoading(true);
    api.get('/vehicles').then(res => {
      setVehicles(res.data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.post('/vehicles', newVehicle);
      setIsAddModalOpen(false);
      setNewVehicle({ registrationNumber: '', vehicleName: '', vehicleType: 'TRUCK' });
      fetchVehicles(); // refresh list
    } catch (err) {
      console.error('Failed to add vehicle:', err);
      alert('Failed to add vehicle. Ensure registration number is unique.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg overflow-hidden">
      {/* Modal for adding vehicle */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md border border-white/60 relative"
            >
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 text-[#64748B] hover:text-primary hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-primary mb-1">Add New Vehicle</h3>
              <p className="text-xs text-[#64748B] mb-6">Register a new asset to your fleet operations.</p>
              
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#334155]">Registration Number</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. MH 01 AB 1234"
                    value={newVehicle.registrationNumber}
                    onChange={e => setNewVehicle({...newVehicle, registrationNumber: e.target.value.toUpperCase()})}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#334155]">Vehicle Model Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. Tata Prima 4028"
                    value={newVehicle.vehicleName}
                    onChange={e => setNewVehicle({...newVehicle, vehicleName: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#334155]">Vehicle Type</label>
                  <select 
                    value={newVehicle.vehicleType}
                    onChange={e => setNewVehicle({...newVehicle, vehicleType: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
                  >
                    <option value="TRUCK">Heavy Truck</option>
                    <option value="VAN">Delivery Van</option>
                    <option value="CAR">Sedan / Fleet Car</option>
                    <option value="BIKE">Two Wheeler</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full mt-4 bg-primary text-white text-sm font-bold py-3 rounded-xl shadow-lg hover:bg-primary/95 transition-all disabled:opacity-70 flex justify-center items-center"
                >
                  {submitting ? 'Registering...' : 'Register Vehicle'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search vehicles, drivers, IDs..." 
            className="w-full pl-9 pr-4 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white text-primary placeholder:text-[#94A3B8] focus:outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-xs border border-[#E2E8F0] rounded-xl font-bold text-[#64748B] hover:text-primary hover:bg-[#F1F5F9] transition-colors">
            Filter
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 text-xs bg-primary text-white rounded-xl font-bold flex items-center gap-1.5 shadow-md hover:bg-primary/95 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" /> Add Vehicle
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
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
          <tbody className="divide-y divide-[#E2E8F0]">
            {vehicles.map((v) => (
              <tr key={v.id} className="hover:bg-[#F1F5F9]/50 transition-colors bg-white">
                <td className="p-4 font-mono font-bold text-accent">{v.id.substring(0,6)}</td>
                <td className="p-4 font-bold text-primary">{v.registrationNumber}</td>
                <td className="p-4 text-[#64748B] font-medium">{v.vehicleName}</td>
                <td className="p-4 text-[#64748B] font-medium">{v.vehicleType}</td>
                <td className="p-4 font-medium text-primary">Unassigned</td>
                <td className="p-4 font-medium text-primary">N/A</td>
                <td className="p-4 text-center">
                  <div className="inline-flex justify-center items-center">
                    <Switch 
                      size="sm" 
                      haptic="light" 
                      checked={v.status === 'ON_TRIP'} 
                    />
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    v.status === 'ON_TRIP' ? 'bg-success/10 text-success border border-success/20' :
                    v.status === 'IN_SHOP' ? 'bg-danger/10 text-danger border border-danger/20' :
                    v.status === 'AVAILABLE' ? 'bg-primary/10 text-primary border border-primary/20' :
                    'bg-warning/10 text-warning border border-warning/20'
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
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/trips').then(res => {
      setTrips(res.data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-sm text-[#64748B]">Loading trips...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {trips.map((trip) => (
        <div key={trip.id} className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-mono font-bold text-accent bg-accent/10 px-2 py-1 rounded">{trip.id.substring(0,8)}</span>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                trip.status === 'COMPLETED' ? 'bg-success/10 text-success border-success/20' :
                trip.status === 'CANCELLED' ? 'bg-danger/10 text-danger border-danger/20' :
                'bg-primary/10 text-primary border-primary/20'
              }`}>
                {trip.status}
              </span>
            </div>
            <h4 className="text-base font-bold text-primary mb-1">{trip.source} → {trip.destination}</h4>
            <p className="text-xs text-[#64748B] font-medium">Driver: <strong className="text-primary">{trip.driver?.name || 'Unassigned'}</strong></p>
          </div>
          <div className="mt-6 pt-6 border-t border-[#E2E8F0]">
            <div className="flex justify-between text-xs text-[#64748B] mb-2 font-medium">
              <span>Trip Progress</span>
              <span className="font-bold text-primary">{trip.actualDistance || trip.plannedDistance} km</span>
            </div>
            <div className="w-full bg-[#F1F5F9] h-2 rounded-full overflow-hidden mb-4 shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ width: trip.status === 'COMPLETED' ? '100%' : trip.status === 'DISPATCHED' ? '50%' : '0%' }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B] font-medium flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Vehicle:</span>
              <strong className="text-primary font-bold bg-[#F8FAFC] px-2 py-1 border border-[#E2E8F0] rounded">{trip.vehicle?.registrationNumber || 'Pending'}</strong>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 4. Reports Tab
function ReportsTab() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    api.get('/reports?revenue=50000').then(res => {
      setReport(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleDownloadPDF = () => {
    setIsDownloading(true);
    // Simulate generation delay, then trigger native print dialogue which allows saving as PDF
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 800);
  };

  if (loading) return <div className="p-4 text-sm text-[#64748B]">Loading reports...</div>;

  const chartData = [
    { label: 'Mon', val: 78 },
    { label: 'Tue', val: 82 },
    { label: 'Wed', val: 89 },
    { label: 'Thu', val: 85 },
    { label: 'Fri', val: 92 },
    { label: 'Sat', val: 65 },
    { label: 'Sun', val: 45 }
  ];

  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/60 shadow-md">
        <div>
          <h3 className="text-lg font-bold text-primary">Fleet Analytics Overview</h3>
          <p className="text-xs text-[#64748B] font-medium mt-0.5">Comprehensive report for {new Date().toLocaleDateString()}</p>
        </div>
        <button 
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg hover:bg-primary/95 transition-all flex items-center gap-2 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {isDownloading ? (
            <span className="flex items-center gap-2"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Settings className="w-4 h-4" /></motion.div> Generating PDF...</span>
          ) : (
            <span className="flex items-center gap-2"><Download className="w-4 h-4" /> Download Report (PDF)</span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart 1: Realistic Bar Chart */}
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h4 className="text-lg font-bold text-primary">Vehicle Utilization Trend</h4>
              <p className="text-xs font-medium text-[#64748B] mt-1">Percentage of fleet in active transport per day</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary">76.5%</span>
              <p className="text-[10px] font-bold text-success uppercase tracking-wider">Avg This Week</p>
            </div>
          </div>
          
          {/* Mathematically precise chart rendering */}
          <div className="relative h-64 flex-1 mt-auto ml-6 border-b border-[#E2E8F0] flex items-end justify-between px-4 pb-2">
            {/* Y-Axis Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between z-0 pointer-events-none">
              {[100, 75, 50, 25, 0].map((tick) => (
                <div key={tick} className="w-full border-t border-[#E2E8F0] border-dashed flex items-center relative">
                  <span className="absolute -left-8 text-[10px] font-bold text-[#94A3B8] -translate-y-1/2">{tick}%</span>
                </div>
              ))}
            </div>

            {/* Bars */}
            {chartData.map((bar, i) => (
              <div key={i} className="relative z-10 w-full flex flex-col items-center group h-full justify-end group">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                  {bar.val}% utilization
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45" />
                </div>
                
                {/* Animated Bar Segment */}
                <div className="w-8 md:w-12 bg-[#F1F5F9] rounded-t-lg flex items-end overflow-hidden border border-[#E2E8F0] shadow-inner relative group-hover:border-accent/40 transition-colors" style={{ height: '100%' }}>
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${bar.val}%` }}
                    transition={{ duration: 1, type: 'spring', bounce: 0.2, delay: i * 0.1 }}
                    className="w-full rounded-t-md relative bg-gradient-to-t from-[#163A5F] to-primary group-hover:from-accent/80 group-hover:to-accent transition-colors"
                  />
                </div>
                
                {/* X-Axis Label */}
                <span className="absolute -bottom-6 text-[11px] font-bold text-[#64748B]">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mini reports metrics */}
        <div className="space-y-6">
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg">
            <h4 className="text-base font-bold text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" /> Operating Margins
            </h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm border-b border-[#E2E8F0] pb-3">
                <span className="text-[#64748B] font-medium">Total Operational Cost</span>
                <strong className="text-primary font-bold">₹{report?.fleetSummary?.operationalCost?.toLocaleString() || '124,500'}</strong>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[#E2E8F0] pb-3">
                <span className="text-[#64748B] font-medium">Average Fleet ROI</span>
                <strong className="text-success font-bold bg-success/10 px-2 py-0.5 rounded">{report?.fleetSummary?.roi || '18.2'}%</strong>
              </div>
              <div className="flex justify-between items-center text-sm border-b border-[#E2E8F0] pb-3">
                <span className="text-[#64748B] font-medium">Fuel Efficiency</span>
                <strong className="text-primary font-bold">{report?.fleetSummary?.fuelEfficiency || '4.2'} km/L</strong>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#64748B] font-medium">Maintenance Cost</span>
                <strong className="text-danger font-bold">₹{report?.fleetSummary?.maintenanceCost?.toLocaleString() || '12,400'}</strong>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-[#163A5F] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
            <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="w-32 h-32" />
            </div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wide">Automated Dispatch</span>
            <h4 className="text-xl font-bold mt-2 mb-3">99.8% Accuracy</h4>
            <p className="text-xs text-white/80 leading-relaxed font-medium">
              AI-optimized load matching has reduced route delays by 42% over the last quarter. Efficiency targets exceeded.
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] bg-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Detailed Activity Logs</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="p-4">Log ID</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4">Impact / Value</th>
                <th className="p-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {[
                { id: 'LOG-001', type: 'Route Optimization', date: 'Today, 08:30 AM', impact: 'Saved 12km', status: 'Applied' },
                { id: 'LOG-002', type: 'Fuel Audit', date: 'Yesterday, 14:15 PM', impact: '₹4,500 Processed', status: 'Cleared' },
                { id: 'LOG-003', type: 'Driver Reassignment', date: 'Yesterday, 10:00 AM', impact: 'Covered Shift A', status: 'Completed' },
                { id: 'LOG-004', type: 'Maintenance Alert', date: 'Jul 10, 09:45 AM', impact: 'Scheduled Service', status: 'Pending' },
              ].map((log, i) => (
                <tr key={i} className="hover:bg-[#F1F5F9]/50 transition-colors bg-white">
                  <td className="p-4 font-mono font-bold text-accent">{log.id}</td>
                  <td className="p-4 font-bold text-primary">{log.type}</td>
                  <td className="p-4 text-[#64748B] font-medium">{log.date}</td>
                  <td className="p-4 text-[#64748B] font-medium">{log.impact}</td>
                  <td className="p-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      log.status === 'Applied' || log.status === 'Cleared' || log.status === 'Completed' ? 'bg-success/10 text-success border border-success/20' :
                      'bg-warning/10 text-warning border border-warning/20'
                    }`}>
                      {log.status}
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
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fuel').then(res => {
      setLogs(res.data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-sm text-[#64748B]">Loading fuel logs...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg hover:-translate-y-1 transition-transform">
          <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Avg Fuel Price (Diesel)</p>
          <h3 className="text-3xl font-bold text-primary mt-2">₹94.50 <span className="text-sm font-medium text-[#64748B]">/ L</span></h3>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase mt-2 block">National average estimate</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg hover:-translate-y-1 transition-transform">
          <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Monthly Fuel Consumed</p>
          <h3 className="text-3xl font-bold text-primary mt-2">14,890 <span className="text-sm font-medium text-[#64748B]">L</span></h3>
          <span className="text-[10px] bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded uppercase font-bold mt-2 inline-block">-540 L from last month</span>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg hover:-translate-y-1 transition-transform">
          <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Carbon Offsets (MTD)</p>
          <h3 className="text-3xl font-bold text-success mt-2">4.2 <span className="text-sm font-medium text-[#64748B]">Tons</span></h3>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase mt-2 block">Driven by route optimization</span>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] bg-white flex items-center gap-2">
          <Fuel className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Recent Fuel Entries</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Cost</th>
                <th className="p-4">Fuel Volume</th>
                <th className="p-4">Measured Efficiency</th>
                <th className="p-4">Driver</th>
                <th className="p-4">Refueling Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {logs.map((log, i) => (
                <tr key={i} className="hover:bg-[#F1F5F9]/50 transition-colors bg-white">
                  <td className="p-4 font-bold text-primary">{log.vehicle?.registrationNumber || log.vehicleId.substring(0,8)}</td>
                  <td className="p-4 font-bold text-accent">₹{log.cost}</td>
                  <td className="p-4 text-[#64748B] font-medium">{log.liters} L</td>
                  <td className="p-4 font-medium text-[#94A3B8]">N/A</td>
                  <td className="p-4 text-[#64748B] font-medium">{log.trip?.driver?.name || 'Unassigned'}</td>
                  <td className="p-4 text-[#64748B] font-medium">{new Date(log.date).toLocaleDateString()}</td>
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
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/maintenance').then(res => {
      setIssues(res.data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-sm text-[#64748B]">Loading maintenance logs...</div>;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl">
            <AlertTriangle className="w-7 h-7 text-danger" />
          </div>
          <div>
            <h4 className="text-base font-bold text-primary">Critical Diagnostics</h4>
            <p className="text-xs text-[#64748B] font-medium mt-1">1 vehicle requires immediate attention (Engine fault active).</p>
          </div>
        </div>
        <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/60 shadow-lg flex items-center gap-5 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-success/10 border border-success/20 rounded-xl">
            <CheckCircle2 className="w-7 h-7 text-success" />
          </div>
          <div>
            <h4 className="text-base font-bold text-primary">Compliance Rate</h4>
            <p className="text-xs text-[#64748B] font-medium mt-1">96.4% of regular preventive maintenance completed on schedule.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg overflow-hidden">
        <div className="p-5 border-b border-[#E2E8F0] bg-white flex items-center gap-2">
          <Wrench className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold text-primary uppercase tracking-wider">Service Queue & Diagnostics</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] text-[#64748B] font-bold uppercase tracking-wider border-b border-[#E2E8F0]">
                <th className="p-4">Vehicle</th>
                <th className="p-4">Reported Issue / Task</th>
                <th className="p-4">Estimated Cost</th>
                <th className="p-4">Scheduled Date</th>
                <th className="p-4">Work Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {issues.map((issue, i) => (
                <tr key={i} className="hover:bg-[#F1F5F9]/50 transition-colors bg-white">
                  <td className="p-4 font-bold text-primary">{issue.vehicle?.registrationNumber || issue.vehicleId.substring(0,8)}</td>
                  <td className="p-4 text-[#64748B] font-medium">{issue.description}</td>
                  <td className="p-4 font-bold text-accent">₹{issue.cost}</td>
                  <td className="p-4 text-[#64748B] font-medium">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                      issue.status === 'CLOSED' ? 'bg-success/10 text-success border border-success/20' :
                      issue.status === 'ACTIVE' ? 'bg-danger/10 text-danger border border-danger/20' :
                      'bg-warning/10 text-warning border border-warning/20'
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
    <div className="bg-white/90 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg p-8 max-w-2xl mx-auto space-y-8">
      <div className="border-b border-[#E2E8F0] pb-4">
        <h4 className="text-lg font-bold text-primary">System Preferences</h4>
        <p className="text-xs text-[#64748B] font-medium mt-1">Configure rules, notification settings, and automation toggles</p>
      </div>

      <div className="space-y-6 divide-y divide-[#E2E8F0] pt-2">
        {/* Toggle 1: Auto-Dispatch */}
        <div className="flex items-center justify-between py-2">
          <div className="space-y-1">
            <label className="text-sm font-bold text-primary">Auto-Dispatch Engine</label>
            <p className="text-[11px] text-[#64748B] font-medium">Automatically assign incoming loads to nearest available drivers.</p>
          </div>
          <Switch 
            checked={autoDispatch} 
            onCheckedChange={setAutoDispatch} 
            haptic="light" 
          />
        </div>

        {/* Toggle 2: Diagnostic Alerts */}
        <div className="flex items-center justify-between py-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-primary">Critical Diagnostics Alerts</label>
            <p className="text-[11px] text-[#64748B] font-medium">Send instant SMS updates when telemetry fault codes trigger.</p>
          </div>
          <Switch 
            checked={diagAlerts} 
            onCheckedChange={setDiagAlerts} 
            haptic="light" 
            showIcons={true}
          />
        </div>

        {/* Toggle 3: Force Maintenance Routing */}
        <div className="flex items-center justify-between py-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-danger">Strict Maintenance Lockout</label>
            <p className="text-[11px] text-[#64748B] font-medium max-w-[80%]">Automatically suspend vehicles from dispatch if service odometer limit is exceeded.</p>
          </div>
          <Switch 
            checked={forceRouting} 
            onCheckedChange={setForceRouting} 
            variant="destructive" 
            haptic="heavy" 
            showIcons={true}
          />
        </div>

        {/* Theme Settings Note */}
        <div className="flex items-center justify-between py-6">
          <div className="space-y-1">
            <label className="text-sm font-bold text-primary">System Theme Locked</label>
            <p className="text-[11px] text-[#64748B] font-medium max-w-[80%]">
              Dark mode has been disabled at a system level to enforce the new premium Light Glassmorphism brand aesthetic.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 shadow-sm">
            Light Mode Only
          </span>
        </div>
      </div>
    </div>
  );
}
