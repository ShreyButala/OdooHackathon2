import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Check,
  ChevronRight,
  ArrowUpRight,
  Truck,
  Users,
  MapPin,
  Wrench,
  Fuel,
  FileText,
  Clock,
  BarChart3,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';

import ScrollReveal from '../components/ScrollReveal';
import Counter from '../components/Counter';
import WaveText from '../components/WaveText';
import TextMorph from '../components/TextMorph';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// Cursor-interactive Magnetic Word Component
function MagneticWord({ children, mousePos, disabled }) {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled || !ref.current || !mousePos.active) {
      setTransform({ x: 0, y: 0 });
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    const wordCenterX = rect.left + rect.width / 2;
    const wordCenterY = rect.top + rect.height / 2;
    const dx = mousePos.x - wordCenterX;
    const dy = mousePos.y - wordCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 160;
    if (distance < radius) {
      const power = (radius - distance) / radius;
      const shiftX = -(dx / distance) * 5 * power;
      const shiftY = -(dy / distance) * 5 * power;
      setTransform({ x: shiftX, y: shiftY });
    } else {
      setTransform({ x: 0, y: 0 });
    }
  }, [mousePos, disabled]);

  return (
    <span
      ref={ref}
      style={{
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: 'transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }}
      className="inline-block"
    >
      {children}
    </span>
  );
}

export default function HomePage() {
  const [isAnnounceOpen, setIsAnnounceOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, active: false });
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const workflowRef = useRef(null);
  const [workflowInView, setWorkflowInView] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(0);

  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTouch = () =>
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    checkTouch();
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const listener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) { setWorkflowProgress(1); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setWorkflowInView(true);
      } else if (entry.boundingClientRect.top > 0) {
        setWorkflowInView(false);
        setWorkflowProgress(0);
      }
    }, { threshold: 0.15 });
    if (workflowRef.current) observer.observe(workflowRef.current);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (!workflowInView || prefersReducedMotion || workflowProgress === 1) return;
    const duration = 1500;
    const startTime = performance.now();
    let animId;
    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setWorkflowProgress(progress);
      if (progress < 1) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [workflowInView, prefersReducedMotion]);

  const handleMouseMove = (e) => {
    if (isTouchDevice || prefersReducedMotion) return;
    setMousePos({ x: e.clientX, y: e.clientY, active: true });
  };
  const handleMouseLeave = () => setMousePos((prev) => ({ ...prev, active: false }));

  const headlineLine1 = [
    { text: 'Modern', accent: false },
    { text: 'Transport', accent: false },
    { text: 'Operations.', accent: false },
  ];

  const headlineLine2 = [
    { type: 'text', text: 'One', accent: false },
    { type: 'text', text: 'Intelligent', accent: false },
    { type: 'morph', words: ['Platform', 'System', 'Network', 'Solution'], accent: true },
  ];

  const workflowStages = [
    { step: '01', title: 'Vehicle Registration', desc: 'Securely upload diagnostic records and load capacity.', icon: Truck },
    { step: '02', title: 'Driver Assignment', desc: 'Verify licensing status, profile check, and allocate routes.', icon: Users },
    { step: '03', title: 'Trip Dispatch', desc: 'Match loads automatically using our algorithm.', icon: MapPin },
    { step: '04', title: 'Live Tracking', desc: 'Monitor telemetry and fuel drops via live dashboard.', icon: Clock },
    { step: '05', title: 'Maintenance', desc: 'Receive diagnostic alerts before failures happen.', icon: Wrench },
    { step: '06', title: 'Reports', desc: 'Analyze profitability, cost metrics, and fuel compliance.', icon: FileText },
  ];

  const workflowThresholds = [0.05, 0.22, 0.40, 0.58, 0.75, 0.92];

  const handleDashboardCTA = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col font-sans antialiased selection:bg-accent/20 selection:text-primary">

      {/* 1. Announcement Bar */}
      {isAnnounceOpen && (
        <div className="bg-primary text-white text-xs py-2.5 px-4 sticky top-0 z-50 flex items-center justify-between border-b border-white/10 select-none transition-all">
          <div className="flex-1 flex items-center justify-center gap-1.5 md:gap-4 overflow-hidden truncate">
            <span className="inline-flex items-center gap-1 font-medium">Built for modern fleet operations</span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline font-medium">Real-time tracking</span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline font-medium">Smart dispatch</span>
            <span className="hidden md:inline text-white/50">•</span>
            <span className="hidden md:inline font-medium">Operational analytics</span>
          </div>
          <button
            type="button"
            onClick={() => setIsAnnounceOpen(false)}
            className="p-1 hover:bg-white/10 rounded transition-colors text-white/80 hover:text-white"
            aria-label="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. Navbar */}
      <Navbar isScrolled={isScrolled} isAnnounceOpen={isAnnounceOpen} />

      {/* 3. Hero */}
      <header
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="min-h-[calc(100vh-64px)] flex flex-col justify-between px-6 py-12 md:py-20 max-w-7xl mx-auto w-full relative overflow-hidden"
      >
        <div className="my-auto max-w-5xl space-y-8 relative z-10 mx-auto text-center flex flex-col items-center">
          <h1
            style={{ fontSize: 'clamp(28px, 3.6vw, 64px)' }}
            className="font-bold tracking-tighter select-none font-sans text-center max-w-none leading-[1.1] flex flex-col items-center gap-2"
          >
            <div className="whitespace-normal md:whitespace-nowrap">
              {headlineLine1.map((w, idx) => (
                <span key={idx} className="inline-block">
                  <MagneticWord mousePos={mousePos} disabled={isTouchDevice || prefersReducedMotion}>
                    <span className="text-primary font-bold">{w.text}</span>
                  </MagneticWord>
                  {idx < headlineLine1.length - 1 && '\u00A0'}
                </span>
              ))}
            </div>
            <div className="whitespace-normal md:whitespace-nowrap">
              {headlineLine2.map((el, idx) => (
                <span key={idx} className="inline-block">
                  <MagneticWord mousePos={mousePos} disabled={isTouchDevice || prefersReducedMotion}>
                    {el.type === 'text' ? (
                      <span className={el.accent ? 'text-accent font-semibold' : 'text-primary font-bold'}>
                        {el.text}
                      </span>
                    ) : (
                      <TextMorph words={el.words} loop className="text-accent font-semibold animate-none" />
                    )}
                  </MagneticWord>
                  {idx < headlineLine2.length - 1 && '\u00A0'}
                </span>
              ))}
            </div>
          </h1>

          <div className="max-w-2xl space-y-6 pt-4 text-center mx-auto flex flex-col items-center">
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-normal">
              Consolidate your entire fleet, drivers, dispatch, maintenance, and analytics in one smart platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full">
              <button
                type="button"
                onClick={handleDashboardCTA}
                className="bg-primary text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-primary/95 transition-all text-center hover:scale-[1.02] active:scale-[0.98] hover:shadow-md w-full sm:w-auto"
              >
                Get Started
              </button>
              <a
                href="#dashboard-preview"
                className="border border-primary text-primary hover:bg-[#F5F7F8] text-sm font-semibold px-6 py-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                Explore Dashboard <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 pt-6 text-xs font-semibold text-primary border-t border-border/80 w-full max-w-2xl">
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Enterprise Ready</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Role-Based Access Control</span>
            <span className="flex items-center gap-2"><Check className="w-4 h-4 text-success" /> Real-Time Fleet Visibility</span>
          </div>
        </div>

        <div className="flex flex-col items-center pt-8 md:pt-0 animate-[pulse_2s_infinite] mx-auto">
          <span className="text-xs font-bold text-text-secondary tracking-widest uppercase mb-2">Scroll to explore</span>
          <div className="w-[1.5px] h-8 bg-border overflow-hidden">
            <div className="w-full h-1/2 bg-accent animate-[bounce_2s_infinite]"></div>
          </div>
        </div>
      </header>

      {/* 4. Wave Text */}
      <ScrollReveal className="bg-white border-y border-border py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto text-left">
          <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Mission Statement</span>
          <WaveText text="Built for operations that never stop moving." />
        </div>
      </ScrollReveal>

      {/* 5. Stats */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Fleet Vehicles Managed', desc: 'Active trucks, mini loaders, and logistics vehicles connected.' },
            { value: '25K+', label: 'Trips Completed', desc: 'Secure local and cross-state dispatches successfully completed.' },
            { value: '99.8%', label: 'Dispatch Accuracy', desc: 'AI routes matched without delay or dispatch planning conflict.' },
            { value: '40%', label: 'Manual Operations Saved', desc: 'Automation of fuel logs, invoices, and scheduling spreadsheets.' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-custom border border-border shadow-sm flex flex-col justify-between hover:border-accent/40 transition-colors">
              <div>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-primary font-sans">
                  <Counter value={stat.value} />
                </h3>
                <p className="text-sm font-bold text-primary mt-2">{stat.label}</p>
              </div>
              <p className="text-xs text-text-secondary mt-4 leading-relaxed">{stat.desc}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      {/* 6. Features Grid */}
      <ScrollReveal id="features" className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="space-y-12">
          <div className="max-w-4xl text-left">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Platform Capabilities</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              Everything your fleet needs — <TextMorph loop /> — in one platform.
            </h2>
            <p className="text-sm sm:text-base text-text-secondary mt-4 max-w-xl">
              Ditch scattered legacy software. Our unified modules talk to each other so you can operate with absolute clarity.
            </p>
          </div>
          <div className="border border-border rounded-custom overflow-hidden bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Truck, title: 'Fleet Management', desc: 'Real-time telemetry, location tracking, and vehicle diagnostics in a single view.' },
              { icon: Users, title: 'Driver Management', desc: 'Compliance audits, digital logs, driver scorecards, and custom automated payroll.' },
              { icon: MapPin, title: 'Trip Dispatch', desc: 'Optimize paths dynamically, schedule orders, and avoid route overlapping.' },
              { icon: Wrench, title: 'Maintenance', desc: 'Set recurring diagnostic schedules to extend fleet life and minimize downtime.' },
              { icon: Fuel, title: 'Fuel & Expenses', desc: 'Audit toll spends, integrate corporate fuel cards, and capture digital receipt logs.' },
              { icon: FileText, title: 'Reports & Analytics', desc: 'Generate instantly exportable logs, cost-per-km trends, and diagnostic dashboards.' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="p-8 border-b border-r border-border hover:bg-[#F5F7F8]/20 transition-all duration-300 group flex flex-col justify-between min-h-[220px] hover:-translate-y-[2px]"
                >
                  <div className="space-y-4">
                    <div className="p-3 bg-[#F5F7F8] rounded-lg w-fit transition-all duration-300 group-hover:bg-accent/10 group-hover:-translate-y-[2px]">
                      <Icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors duration-300" />
                    </div>
                    <h3 className="text-base font-bold text-primary">{feature.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{feature.desc}</p>
                  </div>
                  <div className="mt-6 flex items-center text-xs font-semibold text-primary group-hover:text-accent transition-colors gap-1">
                    Learn Module <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* 7. Workflow Timeline */}
      <div id="workflow" ref={workflowRef} className="w-full bg-primary text-white py-20 md:py-28 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-16 relative">
          <div className="max-w-3xl text-left">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Operations Lifecycle</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Smarter Workflows from Day One</h2>
            <p className="text-sm text-white/70 mt-3 max-w-xl">
              TransitOps structures the complete dispatch workflow, ensuring validation, compliance, and reporting occur naturally in one loop.
            </p>
          </div>
          <div className="relative pl-12 lg:pl-0">
            <div className="absolute top-5 left-[8%] right-[8%] h-0.5 bg-white/10 -translate-y-1/2 hidden lg:block z-0">
              <div className="h-full bg-accent transition-all duration-300 ease-out" style={{ width: prefersReducedMotion ? '100%' : `${workflowProgress * 100}%` }} />
            </div>
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-white/10 lg:hidden z-0">
              <div className="w-full bg-accent transition-all duration-300 ease-out" style={{ height: prefersReducedMotion ? '100%' : `${workflowProgress * 100}%` }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-6 relative z-10">
              {workflowStages.map((stage, i) => {
                const isActive = prefersReducedMotion || workflowProgress >= workflowThresholds[i];
                const Icon = stage.icon;
                return (
                  <div key={i} className="flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-4 group">
                    <div className="relative shrink-0 lg:mx-auto">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm font-mono transition-all duration-500 relative z-20 ${
                        isActive ? 'bg-accent border-accent text-white shadow-[0_0_12px_rgba(201,108,43,0.45)]' : 'border-white/20 text-white/40 bg-primary'
                      }`}>
                        {stage.step}
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 lg:text-center text-left">
                      <div className="flex items-center lg:justify-center gap-2">
                        <Icon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-accent fill-accent/20 scale-110' : 'text-white/40'}`} />
                        <h3 className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60'}`}>{stage.title}</h3>
                      </div>
                      <p className="text-xs text-white/60 leading-relaxed max-w-[185px] lg:mx-auto">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Static Dashboard Preview — NO live components */}
      <ScrollReveal id="dashboard-preview" className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="space-y-12">
          <div className="max-w-4xl text-left">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Live Operations Console</span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
              Take Control of Your Fleet Operations
            </h2>
            <p className="text-sm text-text-secondary mt-3">
              A unified console built for fleet managers — real-time dispatch, vehicle health, fuel analytics, and custom reports.
            </p>
          </div>

          {/* Static preview card — visual only, no interactive state */}
          <div className="w-full bg-white rounded-custom border border-border overflow-hidden shadow-sm">
            {/* Browser chrome */}
            <div className="bg-[#F5F7F8] px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="bg-white border border-border text-xs px-6 py-1 rounded-md text-text-secondary select-none font-sans w-1/3 text-center truncate">
                app.transitops.com/dashboard
              </div>
              <div className="w-8" />
            </div>

            {/* Mock tabs row */}
            <div className="border-b border-border bg-white flex overflow-x-auto scrollbar-none">
              {[
                { label: 'Overview', icon: BarChart3, active: true },
                { label: 'Vehicle Management', icon: Truck, active: false },
                { label: 'Trip Management', icon: MapPin, active: false },
                { label: 'Reports & Analytics', icon: TrendingUp, active: false },
                { label: 'Fuel Analytics', icon: Fuel, active: false },
                { label: 'Maintenance', icon: Wrench, active: false },
              ].map((tab, i) => {
                const Icon = tab.icon;
                return (
                  <div
                    key={i}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium shrink-0 border-b-2 transition-colors ${
                      tab.active ? 'text-primary border-accent' : 'text-text-secondary border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </div>
                );
              })}
            </div>

            {/* Mock KPI grid */}
            <div className="p-6 bg-[#F5F7F8]">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Active Vehicles', value: '412', badge: '+12 today' },
                  { label: 'Trips Completed', value: '25,482', badge: '99.8% on-time' },
                  { label: 'Fuel Spend (MTD)', value: '₹14.2L', badge: '-4.2% efficiency' },
                  { label: 'Pending Services', value: '8', badge: '3 urgent alerts' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-5 rounded-custom border border-border shadow-sm">
                    <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">{kpi.label}</p>
                    <h3 className="text-2xl font-bold text-primary mt-1 font-sans">{kpi.value}</h3>
                    <p className="text-xs text-success mt-3 font-medium">● {kpi.badge}</p>
                  </div>
                ))}
              </div>

              {/* CTA overlay */}
              <div className="relative rounded-custom overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent z-10 flex flex-col items-center justify-end pb-8 gap-4">
                  <p className="text-sm font-semibold text-primary">Sign in to access the live fleet console</p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleDashboardCTA}
                      className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:bg-primary/95 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
                    >
                      {isLoggedIn ? 'Open Dashboard' : 'Get Started — Free'} <ArrowRight className="w-4 h-4" />
                    </button>
                    {!isLoggedIn && (
                      <Link
                        to="/login"
                        className="border border-primary text-primary hover:bg-[#F5F7F8] text-sm font-semibold px-5 py-2.5 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                </div>
                {/* Blurred mock data rows */}
                <div className="blur-sm pointer-events-none bg-white rounded-custom border border-border overflow-hidden">
                  <div className="p-4 border-b border-border flex justify-between items-center">
                    <span className="text-xs font-bold text-primary">Live Fleet Map</span>
                    <span className="text-xs text-success font-semibold flex items-center gap-1.5">● Live Tracking</span>
                  </div>
                  <div className="h-40 bg-[#F5F7F8] flex items-center justify-center">
                    <span className="text-text-secondary text-sm font-medium">Real-time map visualization</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 9. Why TransitOps (Comparison) */}
      <ScrollReveal id="why-transitops" className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block">Why TransitOps</span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight leading-tight">
              Replace operational chaos with automation.
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Consolidating fleet operations avoids administrative errors, prevents diagnostic issues from escalating, and provides real-time data to protect your profit margins.
            </p>
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <strong className="text-primary font-bold">Unified logs:</strong> Never lose track of fuel slips, invoices, or licensing dates again.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-accent" />
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <strong className="text-primary font-bold">Reduced liabilities:</strong> Enforce compliance checks automatically before starting any trip dispatch.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/60 border border-border rounded-custom p-8 space-y-6">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Legacy Workflows</h3>
              <ul className="space-y-3.5 text-xs text-text-secondary font-medium">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> Manual spreadsheet coordination</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> Driver and load scheduling conflicts</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> Scattered diagnostic & service records</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> Missed preventive maintenance schedule</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-danger" /> Limited, delayed operational reporting</li>
              </ul>
            </div>
            <div className="bg-primary text-white border border-primary rounded-custom p-8 space-y-6 shadow-lg relative overflow-hidden group hover:shadow-[0_0_50px_rgba(201,108,43,0.12)] transition-shadow duration-500">
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-accent/20 blur-2xl pointer-events-none group-hover:bg-accent/30 transition-all" />
              <h3 className="text-xs font-bold text-accent uppercase tracking-widest">TransitOps Platform</h3>
              <ul className="space-y-3.5 text-xs text-white/90 font-semibold">
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Centralized, unified platform</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Real-time fleet tracking & dispatch visibility</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Automated rule-based validations</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Predictive maintenance diagnostic alerts</li>
                <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> Advanced real-time business analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 10. Benefits */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="space-y-12">
          <div className="max-w-3xl text-left">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Core Outcomes</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary">Empower your coordinators & drivers</h2>
            <p className="text-sm text-text-secondary mt-3 max-w-xl">
              Optimize driver scheduling, vehicle maintenance budgets, and route planning margins with automated processes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'Reduce Manual Work', desc: 'Automate schedules, fuel card syncs, and dispatch notifications. Reclaim coordination hours and reduce double-entry errors.' },
              { title: 'Improve Fleet Utilization', desc: 'Consolidate multiple orders, analyze route profitability, and ensure vehicles spend less time waiting at depot hubs.' },
              { title: 'Prevent Operational Errors', desc: 'System validation prevents dispatching vehicles with active diagnostics or drivers with expired licenses.' },
              { title: 'Make Better Decisions', desc: 'Analyze clean dashboard logs and cost per kilometer trends. Renegotiate fueling and parts contract vendor terms with real data.' },
            ].map((benefit, i) => (
              <div key={i} className="bg-white p-8 rounded-custom border border-border shadow-sm flex flex-col justify-between hover:border-accent/30 transition-all">
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-primary">{benefit.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* 11. CTA */}
      <ScrollReveal id="cta" className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div
          className="border border-border rounded-custom p-8 md:p-16 text-center max-w-5xl mx-auto shadow-sm relative overflow-hidden bg-white"
          style={{ backgroundImage: `radial-gradient(circle at 10% 20%, rgba(22,58,95,0.03) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(201,108,43,0.03) 0%, transparent 40%)` }}
        >
          <div className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary leading-tight">
              Ready to Modernize Your Fleet Operations?
            </h2>
            <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-xl mx-auto">
              Get started with TransitOps today. Streamline your dispatch cycles, control fuel expenses, and maximize asset longevity in a unified console.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                type="button"
                onClick={handleDashboardCTA}
                className="bg-primary text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-sm hover:bg-primary/95 transition-all w-full sm:w-auto hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
              >
                Get Started Now
              </button>
              <button
                type="button"
                onClick={handleDashboardCTA}
                className="border border-primary text-primary hover:bg-[#F5F7F8] text-sm font-semibold px-6 py-3 rounded-lg transition-all w-full sm:w-auto flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                View Dashboard Demo <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 12. Footer */}
      <footer className="bg-white border-t border-border mt-auto pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-border">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2" aria-label="TransitOps Home">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-primary tracking-tight">TransitOps</span>
            </Link>
            <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
              Smart Transport Operations Platform. We consolidate operations, track assets, and optimize workflows to drive down enterprise logistics costs.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary tracking-wider uppercase mb-4">Product</h4>
            <ul className="space-y-2.5 text-xs text-text-secondary font-medium">
              <li><a href="#features" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#dashboard-preview" className="hover:text-primary transition-colors">Enterprise Sandbox</a></li>
              <li><a href="#workflow" className="hover:text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary tracking-wider uppercase mb-4">Resources</h4>
            <ul className="space-y-2.5 text-xs text-text-secondary font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Developer APIs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">System Status</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-text-secondary font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-primary tracking-wider uppercase mb-4">Social</h4>
            <ul className="space-y-2.5 text-xs text-text-secondary font-medium">
              <li><a href="#" className="hover:text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Twitter / X</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-text-secondary font-medium">
          <p>© 2026 TransitOps. Built for smarter fleet operations.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Cookie Preferences</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
