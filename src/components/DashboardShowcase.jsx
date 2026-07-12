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
  Settings
} from 'lucide-react';

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

      {/* Tabs Navigation */}
      <div ref={containerRef} className="border-b border-border bg-surface flex overflow-x-auto scrollbar-none relative">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              ref={(el) => (tabRefs.current[index] = el)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all shrink-0 relative z-10 ${
                isActive ? 'text-primary dark:text-accent' : 'text-text-secondary hover:text-primary dark:hover:text-text'
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
      <div className="p-6 bg-background min-h-[540px] pb-28 relative">
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
          {/* Leaflet Real Map integration */}
          <div className="bg-background border border-border rounded-lg h-64 relative overflow-hidden flex items-center justify-center z-0">
            <LiveMap />
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
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/vehicles').then(res => {
      setVehicles(res.data.data || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-sm text-text-secondary">Loading vehicles...</div>;

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
                <td className="p-4 font-mono font-bold text-primary">{v.id.substring(0,6)}</td>
                <td className="p-4 font-semibold text-text">{v.registrationNumber}</td>
                <td className="p-4 text-text-secondary">{v.vehicleName}</td>
                <td className="p-4 text-text-secondary">{v.vehicleType}</td>
                <td className="p-4 font-medium text-text">Unassigned</td>
                <td className="p-4 font-medium text-text">N/A</td>
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
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    v.status === 'ON_TRIP' ? 'bg-success/10 text-success' :
                    v.status === 'IN_SHOP' ? 'bg-danger/10 text-danger' :
                    v.status === 'AVAILABLE' ? 'bg-primary/10 text-primary' :
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

  if (loading) return <div className="p-4 text-sm text-text-secondary">Loading trips...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {trips.map((trip) => (
        <div key={trip.id} className="bg-surface p-5 rounded-custom border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono font-bold text-accent">{trip.id.substring(0,8)}</span>
              <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                trip.status === 'COMPLETED' ? 'bg-success/10 text-success' :
                trip.status === 'CANCELLED' ? 'bg-danger/10 text-danger' :
                'bg-primary/10 text-primary'
              }`}>
                {trip.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-text mb-1">{trip.source} → {trip.destination}</h4>
            <p className="text-xs text-text-secondary">Driver: <strong className="text-text font-medium">{trip.driver?.name || 'Unknown'}</strong></p>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Distance</span>
              <span>{trip.actualDistance || trip.plannedDistance} km</span>
            </div>
            <div className="w-full bg-background h-1.5 rounded-full overflow-hidden mb-3">
              <div 
                className="bg-primary h-full rounded-full transition-all duration-500" 
                style={{ width: trip.status === 'COMPLETED' ? '100%' : trip.status === 'DISPATCHED' ? '50%' : '0%' }}
              />
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-text-secondary">Vehicle:</span>
              <strong className="text-text font-semibold">{trip.vehicle?.registrationNumber || 'Unknown'}</strong>
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

  useEffect(() => {
    api.get('/reports?revenue=50000').then(res => {
      setReport(res.data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-sm text-text-secondary">Loading reports...</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chart 1: Vehicle Utilization */}
      <div className="bg-surface p-5 rounded-custom border border-border shadow-sm lg:col-span-2">
        <h4 className="text-sm font-semibold text-text mb-1">Vehicle Utilization Trend</h4>
        <p className="text-xs text-text-secondary mb-6">Percentage of fleet in active transport per day</p>
        
        <div className="h-48 flex items-end gap-3 px-2 border-b border-border">
          {[
            { label: 'Mon', val: 78 },
            { label: 'Tue', val: 82 },
            { label: 'Wed', val: 89 },
            { label: 'Thu', val: 85 },
            { label: 'Fri', val: 92 },
            { label: 'Sat', val: 65 },
            { label: 'Sun', val: 45 }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full bg-primary/10 hover:bg-primary/20 transition-colors rounded-t-sm h-36 flex items-end">
                <div 
                  className="w-full bg-primary group-hover:bg-accent transition-all rounded-t-sm"
                  style={{ height: `${bar.val}%` }}
                />
              </div>
              <span className="text-[10px] text-text-secondary font-medium">{bar.label}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-3 text-xs text-text-secondary">
          <span>Weekly Target: 85%</span>
          <span className="text-success font-semibold">Average: 76.5%</span>
        </div>
      </div>

      {/* Mini reports metrics */}
      <div className="space-y-4">
        <div className="bg-surface p-5 rounded-custom border border-border shadow-sm">
          <h4 className="text-sm font-semibold text-text mb-3">Operating Margins</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs border-b border-border pb-2">
              <span className="text-text-secondary">Total Operational Cost</span>
              <strong className="text-text font-semibold">₹{report?.fleetSummary?.operationalCost || 0}</strong>
            </div>
            <div className="flex justify-between text-xs border-b border-border pb-2">
              <span className="text-text-secondary">Average Fleet ROI</span>
              <strong className="text-success font-semibold">{report?.fleetSummary?.roi || 0}%</strong>
            </div>
            <div className="flex justify-between text-xs border-b border-border pb-2">
              <span className="text-text-secondary">Fuel Efficiency</span>
              <strong className="text-text font-semibold">{report?.fleetSummary?.fuelEfficiency || 0} km/L</strong>
            </div>
            <div className="flex justify-between text-xs border-b border-border pb-2">
              <span className="text-text-secondary">Maintenance Cost</span>
              <strong className="text-danger font-semibold">₹{report?.fleetSummary?.maintenanceCost || 0}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-text-secondary">Expense Cost</span>
              <strong className="text-warning font-semibold">₹{report?.fleetSummary?.expenseCost || 0}</strong>
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

  if (loading) return <div className="p-4 text-sm text-text-secondary">Loading fuel logs...</div>;

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
                  <td className="p-4 font-semibold text-text">{log.vehicle?.registrationNumber || log.vehicleId.substring(0,8)}</td>
                  <td className="p-4 font-bold text-primary">₹{log.cost}</td>
                  <td className="p-4 text-text-secondary">{log.liters} L</td>
                  <td className="p-4 font-semibold text-text">N/A</td>
                  <td className="p-4 text-text-secondary">{log.trip?.driver?.name || 'Unassigned'}</td>
                  <td className="p-4 text-text-secondary">{new Date(log.date).toLocaleDateString()}</td>
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

  if (loading) return <div className="p-4 text-sm text-text-secondary">Loading maintenance logs...</div>;

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
                  <td className="p-4 font-semibold text-text">{issue.vehicle?.registrationNumber || issue.vehicleId.substring(0,8)}</td>
                  <td className="p-4 text-text-secondary">{issue.description}</td>
                  <td className="p-4 font-bold text-primary">₹{issue.cost}</td>
                  <td className="p-4 text-text-secondary">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      issue.status === 'CLOSED' ? 'bg-success/10 text-success' :
                      issue.status === 'ACTIVE' ? 'bg-danger/10 text-danger' :
                      'bg-warning/10 text-warning'
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
