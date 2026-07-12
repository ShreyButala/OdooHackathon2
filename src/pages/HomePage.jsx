import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  MapPin,
  BarChart3,
  Zap,
  Clock,
  Users,
  Phone,
  Eye,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Star,
  Activity,
  Navigation,
  Fuel,
  Wrench,
  FileText,
  Shield,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────
   UTILITY: useReducedMotion
───────────────────────────────────────────── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

/* ─────────────────────────────────────────────
   UTILITY: useInView
───────────────────────────────────────────── */
function useInView(threshold = 0.15, retrigger = false) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (retrigger) {
          setInView(false);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, retrigger]);
  return [ref, inView];
}

/* ─────────────────────────────────────────────
   STAGGERED HEADLINE (word-by-word reveal)
───────────────────────────────────────────── */
function StaggeredHeadline({ text, inView, reduced, baseDelay = 0, className = '' }) {
  const words = text.split(' ');
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: reduced || inView ? 1 : 0,
            transform: reduced || inView ? 'translateY(0)' : 'translateY(22px)',
            transition: reduced
              ? 'opacity 0.4s ease'
              : `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * 70}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${baseDelay + i * 70}ms`,
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </span>
  );
}

/* ─────────────────────────────────────────────
   SCROLL SECTION WRAPPER
───────────────────────────────────────────── */
function ScrollSection({ children, className = '', delay = 0 }) {
  const reduced = useReducedMotion();
  const [ref, inView] = useInView(0.1);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: reduced || inView ? 1 : 0,
        transform: reduced || inView ? 'translateY(0)' : 'translateY(28px)',
        transition: reduced
          ? 'opacity 0.4s ease'
          : `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING CARD (staggered rise on scroll)
───────────────────────────────────────────── */
function FloatCard({ children, className = '', delay = 0, parentInView, reduced }) {
  return (
    <div
      className={className}
      style={{
        opacity: reduced || parentInView ? 1 : 0,
        transform: reduced || parentInView ? 'translateY(0)' : 'translateY(32px)',
        transition: reduced
          ? 'opacity 0.4s ease'
          : `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   DONUT CHART — SVG ring that draws itself
───────────────────────────────────────────── */
function DonutChart({ segments, size = 100, strokeWidth = 13 }) {
  const [ref, inView] = useInView(0.2);
  const reduced = useReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;
  let cumulativePercent = 0;
  const drawn = reduced || inView;

  return (
    <div ref={ref} style={{ width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {segments.map((seg, i) => {
          const segPercent = seg.value / 100;
          const dashArray = circumference * segPercent;
          const startOffset = cumulativePercent * circumference;
          cumulativePercent += segPercent;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${drawn ? dashArray : 0} ${circumference}`}
              strokeDashoffset={-startOffset}
              strokeLinecap="round"
              style={{
                transition: drawn
                  ? `stroke-dasharray 0.9s cubic-bezier(0.22,1,0.36,1) ${i * 150}ms`
                  : 'none',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MINI BAR CHART (sparkline)
───────────────────────────────────────────── */
function MiniBarChart({ data, color = '#163A5F', height = 48 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-[3px]" style={{ height }}>
      {data.map((v, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm"
          style={{
            height: `${(v / max) * 100}%`,
            backgroundColor: i === data.length - 1 ? '#C96C2B' : color,
            opacity: i === data.length - 1 ? 1 : 0.3 + (i / data.length) * 0.55,
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   PILL BADGE
───────────────────────────────────────────── */
function PillBadge({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-accent/25 text-accent select-none" style={{ backgroundColor: 'rgba(201,108,43,0.08)' }}>
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   FEATURE TAG (pill with accent dot)
───────────────────────────────────────────── */
function FeatureTag({ children, delay = 0, inView, reduced }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-border text-primary shadow-sm"
      style={{
        opacity: reduced || inView ? 1 : 0,
        transform: reduced || inView ? 'scale(1)' : 'scale(0.93)',
        transition: reduced
          ? 'opacity 0.4s ease'
          : `opacity 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────
   STAT CHIP (floating overlay — spring pop-in)
───────────────────────────────────────────── */
function StatChip({ icon: Icon, label, value, visible, reduced }) {
  return (
    <div
      className="bg-white rounded-xl px-3 py-2 shadow-lg border border-border flex items-center gap-2 select-none"
      style={{
        opacity: reduced || visible ? 1 : 0,
        transform: reduced || visible ? 'scale(1)' : 'scale(0.88)',
        transition: reduced
          ? 'opacity 0.4s ease'
          : 'opacity 0.45s cubic-bezier(0.34,1.56,0.64,1) 480ms, transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 480ms',
      }}
    >
      {Icon && (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(47,122,95,0.12)' }}>
          <Icon className="w-3.5 h-3.5 text-success" />
        </div>
      )}
      <div>
        <p className="text-[10px] text-text-secondary font-medium leading-none">{label}</p>
        <p className="text-xs font-bold text-primary mt-0.5">{value}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRIP CARD (floating product card motif)
───────────────────────────────────────────── */
function TripCard() {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.08)] p-4 w-72 select-none">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-primary">Trip Overview</span>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-success" style={{ backgroundColor: 'rgba(47,122,95,0.12)' }}>In Progress</span>
      </div>
      <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-border">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
          RK
        </div>
        <div>
          <p className="text-xs font-semibold text-primary">Ravi Kumar</p>
          <div className="flex items-center gap-0.5">
            {[1,2,3,4].map(s => <Star key={s} className="w-2.5 h-2.5 fill-warning text-warning" />)}
            <Star className="w-2.5 h-2.5 text-border" />
            <span className="text-[10px] text-text-secondary ml-0.5">4.4</span>
          </div>
        </div>
        <span className="ml-auto text-[10px] font-mono text-text-secondary">MH-12 AB 4582</span>
      </div>
      <div className="space-y-2 mb-3">
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-success mt-1 shrink-0" />
          <div>
            <p className="text-[10px] text-text-secondary font-medium">Pickup Location</p>
            <p className="text-xs font-semibold text-primary">Bhiwandi Warehouse, Mumbai</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-accent mt-1 shrink-0" />
          <div>
            <p className="text-[10px] text-text-secondary font-medium">Drop-off Location</p>
            <p className="text-xs font-semibold text-primary">Pune Logistics Hub, Hadapsar</p>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mb-3 text-[10px] text-text-secondary">
        <Clock className="w-3 h-3" />
        <span>ETA: <strong className="text-primary">2h 34m</strong></span>
        <span className="ml-auto text-success font-semibold">● On Track</span>
      </div>
      <div className="flex gap-2">
        <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-border text-xs font-semibold text-primary hover:bg-background transition-colors duration-150">
          <Phone className="w-3 h-3" /> Contact
        </button>
        <button type="button" className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors duration-150">
          <Eye className="w-3 h-3" /> View Details
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TRUST STRIP NAMES
───────────────────────────────────────────── */
const trustNames = ['Reliance Logistics', 'BlueDart', 'Delhivery', 'DTDC', 'Maersk India', 'Gati KWE'];

/* ─────────────────────────────────────────────
   HOMEPAGE COMPONENT
───────────────────────────────────────────── */
export default function HomePage() {
  const reduced = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [heroIn, setHeroIn] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleCTA = useCallback(() => navigate(isLoggedIn ? '/dashboard' : '/login'), [isLoggedIn, navigate]);

  const [panelRef, panelInView] = useInView(0.12);
  const [statementRef, statementInView] = useInView(0.2, true);
  const [featuresRef, featuresInView] = useInView(0.08);
  const [tripRef, tripInView] = useInView(0.15);
  const [ctaRef, ctaInView] = useInView(0.1);

  const perfSegments = [
    { value: 68, color: '#2F7A5F', label: 'On-Time' },
    { value: 18, color: '#D9A441', label: 'In Transit' },
    { value: 14, color: '#C94F4F', label: 'Delayed' },
  ];

  const dispatchData = [32, 45, 38, 52, 48, 61, 55, 70, 64, 78, 72, 88];

  const featuresList = [
    { icon: Truck, title: 'Fleet Management', desc: 'Real-time telemetry, GPS tracking, and vehicle health in one unified view.' },
    { icon: Users, title: 'Driver Management', desc: 'Compliance audits, digital logs, scorecards, and automated payroll.' },
    { icon: Navigation, title: 'AI Trip Dispatch', desc: 'Optimize paths dynamically, schedule orders, avoid route conflicts.' },
    { icon: Wrench, title: 'Maintenance Alerts', desc: 'Predictive diagnostics and recurring service schedule automation.' },
    { icon: Fuel, title: 'Fuel & Expenses', desc: 'Audit toll spends, integrate fuel cards, and capture digital receipts.' },
    { icon: FileText, title: 'Reports & Analytics', desc: 'Cost-per-km trends, exportable logs, and executive dashboards.' },
    { icon: Shield, title: 'Compliance & Safety', desc: 'Enforce licensing, insurance, and load-limit checks before dispatch.' },
    { icon: Activity, title: 'Live Operations', desc: 'Fleet-wide situational map with real-time status overlays.' },
  ];

  return (
    <div className="min-h-screen bg-background text-text font-sans antialiased overflow-x-hidden" style={{ '--color-success': '#2F7A5F', '--color-warning': '#D9A441' }}>
      {/* NAVBAR */}
      <Navbar isScrolled={isScrolled} isAnnounceOpen={false} />

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative bg-background pt-20 pb-0 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">

          {/* Pill badge */}
          <div
            className="mb-6"
            style={{
              opacity: reduced || heroIn ? 1 : 0,
              transform: reduced || heroIn ? 'scale(1)' : 'scale(0.93)',
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.45s cubic-bezier(0.22,1,0.36,1) 80ms, transform 0.45s cubic-bezier(0.22,1,0.36,1) 80ms',
            }}
          >
            <PillBadge icon={Zap}>Built for Modern Fleet Operations</PillBadge>
          </div>

          {/* Headline */}
          <h1
            className="font-bold tracking-tight leading-[1.08] mb-5 max-w-4xl"
            style={{ fontSize: 'clamp(36px, 5.5vw, 76px)', color: '#111827' }}
          >
            <span className="block" style={{ color: '#163A5F' }}>
              <StaggeredHeadline text="Everything you need" inView={heroIn} reduced={reduced} baseDelay={140} />
            </span>
            <span className="block" style={{ color: '#111827' }}>
              <StaggeredHeadline text="to run modern transport." inView={heroIn} reduced={reduced} baseDelay={360} />
            </span>
          </h1>

          {/* Sub-copy */}
          <p
            className="text-base sm:text-lg max-w-xl mb-6 leading-relaxed"
            style={{
              color: '#6B7280',
              opacity: reduced || heroIn ? 1 : 0,
              transform: reduced || heroIn ? 'translateY(0)' : 'translateY(14px)',
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s cubic-bezier(0.22,1,0.36,1) 600ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) 600ms',
            }}
          >
            Manage deliveries, drivers, tracking, analytics, and customer operations from one intelligent platform.
          </p>

          {/* Feature tag row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {['AI Dispatch', 'Real-Time Tracking', 'Driver Management'].map((tag, i) => (
              <FeatureTag key={tag} delay={reduced ? 0 : 700 + i * 80} inView={heroIn} reduced={reduced}>
                {tag}
              </FeatureTag>
            ))}
          </div>

          {/* CTA buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-14"
            style={{
              opacity: reduced || heroIn ? 1 : 0,
              transform: reduced || heroIn ? 'translateY(0)' : 'translateY(16px)',
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s cubic-bezier(0.22,1,0.36,1) 820ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) 820ms',
            }}
          >
            <button
              type="button"
              onClick={handleCTA}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold active:scale-[0.98]"
              style={{
                backgroundColor: '#C96C2B',
                boxShadow: '0 4px 16px rgba(201,108,43,0.32)',
                transition: 'background-color 0.2s ease-out, transform 0.2s ease-out, box-shadow 0.2s ease-out',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 22px rgba(201,108,43,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,108,43,0.32)'; }}
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCTA}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-white text-sm font-semibold text-primary shadow-sm"
              style={{ transition: 'transform 0.2s ease-out, border-color 0.2s ease-out, background-color 0.2s ease-out' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = 'rgba(22,58,95,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = '#E5E7EB'; }}
            >
              Book Demo
            </button>
          </div>

          {/* Trust strip */}
          <div
            className="flex flex-col items-center gap-3 mb-16"
            style={{
              opacity: reduced || heroIn ? 1 : 0,
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s ease 1050ms',
            }}
          >
            <p className="text-xs font-medium" style={{ color: '#6B7280' }}>Trusted by 100+ logistics companies</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {trustNames.map((name) => (
                <span key={name} className="text-xs font-semibold tracking-wide uppercase select-none" style={{ color: 'rgba(107,114,128,0.45)' }}>
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* ── 3-PANEL CARD GRID ── */}
          <div ref={panelRef} className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 pb-0">

            {/* LEFT: Dispatch Center */}
            <FloatCard
              delay={0}
              parentInView={panelInView}
              reduced={reduced}
              className="bg-white rounded-2xl border border-border text-left"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div
                className="rounded-2xl border border-border bg-white p-5 text-left h-full"
                style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)', transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(22,58,95,0.1)' }}>
                      <Navigation className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-sm font-bold text-primary">Dispatch Center</span>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ color: '#2F7A5F', backgroundColor: 'rgba(47,122,95,0.1)' }}>● Live</span>
                </div>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: '#6B7280' }}>
                  Auto-assign drivers to orders and monitor real-time operation status.
                </p>
                <div className="rounded-xl p-3 mb-3" style={{ backgroundColor: '#F5F7F8' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: '#6B7280' }}>Dispatches Today</span>
                    <span className="text-xs font-bold text-primary">88</span>
                  </div>
                  <MiniBarChart data={dispatchData} color="#163A5F" height={40} />
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Auto-assign drivers', color: '#2F7A5F' },
                    { label: 'Route optimization', color: '#C96C2B' },
                    { label: 'Load balancing', color: '#163A5F' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-[11px] font-medium" style={{ color: '#6B7280' }}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </FloatCard>

            {/* CENTER: Fleet illustration with floating stat chip */}
            <FloatCard
              delay={110}
              parentInView={panelInView}
              reduced={reduced}
              className="relative rounded-2xl border border-border overflow-hidden min-h-[320px]"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div
                className="absolute inset-0 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, #163A5F 0%, #1e4d7a 50%, #0d2b45 100%)', transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
                onMouseEnter={e => { e.currentTarget.parentElement.style.transform = 'translateY(-4px)'; e.currentTarget.parentElement.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.parentElement.style.transform = 'translateY(0)'; e.currentTarget.parentElement.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}
              >
                {/* Grid overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
                {/* Truck SVG */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg viewBox="0 0 280 180" className="w-4/5 opacity-25" fill="none">
                    <rect x="0" y="140" width="280" height="40" rx="4" fill="#2a5f8f" />
                    <rect x="60" y="154" width="36" height="5" rx="2.5" fill="white" opacity="0.35"/>
                    <rect x="118" y="154" width="36" height="5" rx="2.5" fill="white" opacity="0.35"/>
                    <rect x="176" y="154" width="36" height="5" rx="2.5" fill="white" opacity="0.35"/>
                    <rect x="28" y="88" width="160" height="58" rx="7" fill="#C96C2B" opacity="0.95"/>
                    <rect x="168" y="72" width="62" height="74" rx="7" fill="#1e4d7a"/>
                    <rect x="175" y="80" width="46" height="32" rx="4" fill="#7bb8e8" opacity="0.65"/>
                    <circle cx="63" cy="144" r="16" fill="#0d2b45"/>
                    <circle cx="63" cy="144" r="8" fill="#4a7fa5"/>
                    <circle cx="155" cy="144" r="16" fill="#0d2b45"/>
                    <circle cx="155" cy="144" r="8" fill="#4a7fa5"/>
                    <circle cx="207" cy="144" r="14" fill="#0d2b45"/>
                    <circle cx="207" cy="144" r="7" fill="#4a7fa5"/>
                    <text x="108" y="118" textAnchor="middle" fontSize="10" fill="white" fontWeight="bold" opacity="0.85" fontFamily="sans-serif">TRANSITOPS</text>
                  </svg>
                </div>
                {/* Route path overlay */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                  <path d="M 40 290 Q 200 120 360 55" stroke="rgba(201,108,43,0.45)" strokeWidth="1.5" strokeDasharray="6 4" fill="none" />
                  <circle cx="40" cy="290" r="5" fill="#2F7A5F" opacity="0.8"/>
                  <circle cx="360" cy="55" r="5" fill="#C96C2B" opacity="0.8"/>
                </svg>
              </div>

              {/* Top label */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                <span className="text-white/80 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  Fleet Operations
                </span>
                <span className="text-white/60 text-[10px] font-mono px-2 py-1 rounded-full" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                  412 active
                </span>
              </div>

              {/* Floating stat chip — spring pop-in */}
              <div className="absolute bottom-4 left-4 z-10">
                <StatChip
                  icon={CheckCircle}
                  label="Dispatch Accuracy"
                  value="99.8%"
                  visible={panelInView}
                  reduced={reduced}
                />
              </div>
            </FloatCard>

            {/* RIGHT: Delivery Performance donut */}
            <FloatCard
              delay={220}
              parentInView={panelInView}
              reduced={reduced}
              className="bg-white rounded-2xl border border-border p-5 text-left"
              style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
            >
              <div
                className="h-full"
                style={{ transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
                onMouseEnter={e => { e.currentTarget.parentElement.style.transform = 'translateY(-4px)'; e.currentTarget.parentElement.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.parentElement.style.transform = 'translateY(0)'; e.currentTarget.parentElement.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06)'; }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(47,122,95,0.1)' }}>
                      <BarChart3 className="w-3.5 h-3.5" style={{ color: '#2F7A5F' }} />
                    </div>
                    <span className="text-sm font-bold text-primary">Delivery Performance</span>
                  </div>
                  <span className="text-[10px] font-medium" style={{ color: '#6B7280' }}>This Month</span>
                </div>
                <p className="text-xs mb-4 leading-relaxed" style={{ color: '#6B7280' }}>
                  Fleet-wide trip outcome breakdown by delivery status.
                </p>
                <div className="flex items-center gap-4">
                  <DonutChart segments={perfSegments} size={100} strokeWidth={13} />
                  <div className="flex flex-col gap-2.5 flex-1">
                    {perfSegments.map((seg) => (
                      <div key={seg.label} className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                        <span className="text-[11px] font-medium flex-1" style={{ color: '#6B7280' }}>{seg.label}</span>
                        <span className="text-xs font-bold text-primary">{seg.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px]" style={{ color: '#6B7280' }}>Customer Satisfaction</p>
                    <p className="text-lg font-extrabold text-primary">4.8 / 5.0</p>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4].map(s => <Star key={s} className="w-3.5 h-3.5 fill-warning text-warning" />)}
                    <Star className="w-3.5 h-3.5 text-border" />
                  </div>
                </div>
              </div>
            </FloatCard>
          </div>
        </div>
      </section>

      {/* ══════════════════ "BUILT FOR EVERY TEAM" ══════════════════ */}
      <section
        ref={statementRef}
        className="py-20 md:py-28 px-6 text-center bg-white border-y border-border"
      >
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-6" style={{ color: '#C96C2B' }}>Solutions</p>
          <h2
            className="font-bold tracking-tight leading-[1.1] mb-4"
            style={{ fontSize: 'clamp(28px, 4.5vw, 60px)', color: '#111827' }}
          >
            <StaggeredHeadline
              text="Built for every operations team, at any scale."
              inView={statementInView}
              reduced={reduced}
              baseDelay={0}
            />
          </h2>
          <p
            className="text-base max-w-xl mx-auto"
            style={{
              color: '#6B7280',
              opacity: reduced || statementInView ? 1 : 0,
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s ease 500ms',
            }}
          >
            Whether you're a lean startup or a global enterprise, TransitOps scales with your team.
          </p>
        </div>
      </section>

      {/* ══════════════════ FEATURES GRID ══════════════════ */}
      <section ref={featuresRef} id="features" className="py-16 md:py-24 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <ScrollSection className="mb-12 max-w-3xl">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#C96C2B' }}>Platform Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight leading-tight mb-3">
              One platform. Every workflow.
            </h2>
            <p className="text-sm max-w-lg" style={{ color: '#6B7280' }}>
              Ditch scattered legacy tools. TransitOps modules talk to each other so you operate with total clarity.
            </p>
          </ScrollSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuresList.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="bg-white rounded-2xl border border-border p-6 flex flex-col gap-3 cursor-default group"
                  style={{
                    opacity: reduced || featuresInView ? 1 : 0,
                    transform: reduced || featuresInView ? 'translateY(0)' : 'translateY(24px)',
                    transition: reduced
                      ? 'opacity 0.4s ease'
                      : `opacity 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(201,108,43,0.3)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = reduced || featuresInView ? 'translateY(0)' : 'translateY(24px)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    e.currentTarget.style.borderColor = '#E5E7EB';
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl border border-border flex items-center justify-center"
                    style={{ backgroundColor: '#F5F7F8' }}
                  >
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="text-sm font-bold text-primary">{feat.title}</h3>
                  <p className="text-xs leading-relaxed flex-1" style={{ color: '#6B7280' }}>{feat.desc}</p>
                  <div className="flex items-center gap-1 text-[11px] font-semibold mt-1" style={{ color: '#6B7280' }}>
                    Learn more <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════ TRIP CARD SECTION ══════════════════ */}
      <section ref={tripRef} className="py-16 md:py-24 px-6 bg-white border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left: copy */}
            <div
              style={{
                opacity: reduced || tripInView ? 1 : 0,
                transform: reduced || tripInView ? 'translateX(0)' : 'translateX(-24px)',
                transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
              }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: '#C96C2B' }}>Live Trip Intelligence</p>
              <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight leading-tight mb-4">
                Every trip, at a glance.
              </h2>
              <p className="text-sm leading-relaxed mb-6 max-w-lg" style={{ color: '#6B7280' }}>
                Real-time trip cards surface driver status, route progress, ETA, and one-tap contact — no dashboard digging required.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  'Driver scorecards and live contact',
                  'Color-coded route waypoints',
                  'ETA with live deviation alerts',
                  'One-tap View Details for full trip log',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#6B7280' }}>
                    <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#2F7A5F' }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCTA}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold"
                  style={{
                    backgroundColor: '#C96C2B',
                    boxShadow: '0 4px 14px rgba(201,108,43,0.28)',
                    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleCTA}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-background text-sm font-semibold text-primary"
                  style={{ transition: 'transform 0.2s ease-out' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  Book Demo
                </button>
              </div>
            </div>

            {/* Right: Trip card + secondary stat chip */}
            <div
              className="flex items-center justify-center relative"
              style={{
                opacity: reduced || tripInView ? 1 : 0,
                transform: reduced || tripInView ? 'translateX(0)' : 'translateX(24px)',
                transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.6s cubic-bezier(0.22,1,0.36,1) 150ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) 150ms',
              }}
            >
              <div
                className="absolute w-72 h-72 rounded-full pointer-events-none"
                style={{ backgroundColor: 'rgba(201,108,43,0.06)', filter: 'blur(48px)' }}
              />
              <div
                style={{ transition: 'transform 0.3s ease-out' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <TripCard />
              </div>
              <div className="absolute -top-4 -right-4 hidden lg:block">
                <div className="bg-white rounded-xl px-3 py-2 shadow-lg border border-border flex items-center gap-2 select-none">
                  <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(22,58,95,0.1)' }}>
                    <TrendingUp className="w-3 h-3 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px]" style={{ color: '#6B7280' }}>Trips Today</p>
                    <p className="text-xs font-bold text-primary">+12% ↑ 88</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ STATS ROW ══════════════════ */}
      <ScrollSection className="py-16 md:py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { value: '500+', label: 'Fleet Vehicles', desc: 'Connected trucks and loaders' },
            { value: '25K+', label: 'Trips Completed', desc: 'Secure dispatches successfully done' },
            { value: '99.8%', label: 'Dispatch Accuracy', desc: 'AI-matched routes without conflict' },
            { value: '40%', label: 'Ops Time Saved', desc: 'Automation replacing manual work' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-border p-6"
              style={{
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, border-color 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.07)';
                e.currentTarget.style.borderColor = 'rgba(201,108,43,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-primary mb-1">{stat.value}</p>
              <p className="text-sm font-bold text-primary mb-1">{stat.label}</p>
              <p className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>{stat.desc}</p>
            </div>
          ))}
        </div>
      </ScrollSection>

      {/* ══════════════════ CTA SECTION ══════════════════ */}
      <section ref={ctaRef} id="cta" className="py-16 md:py-24 px-6 relative overflow-hidden" style={{ backgroundColor: '#163A5F' }}>
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 25% 50%, rgba(201,108,43,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.04) 0%, transparent 40%)' }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-6"
            style={{
              color: '#C96C2B',
              opacity: reduced || ctaInView ? 1 : 0,
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s ease 100ms',
            }}
          >
            Get Started
          </p>
          <h2
            className="font-bold tracking-tight leading-[1.1] mb-5 text-white"
            style={{ fontSize: 'clamp(28px, 4.5vw, 60px)' }}
          >
            <StaggeredHeadline
              text="Ready to modernize your fleet operations?"
              inView={ctaInView}
              reduced={reduced}
              baseDelay={150}
            />
          </h2>
          <p
            className="text-base max-w-xl mx-auto mb-8"
            style={{
              color: 'rgba(255,255,255,0.6)',
              opacity: reduced || ctaInView ? 1 : 0,
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s ease 600ms',
            }}
          >
            Streamline dispatch cycles, control fuel expenses, and maximize asset longevity in a unified console.
          </p>
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{
              opacity: reduced || ctaInView ? 1 : 0,
              transform: reduced || ctaInView ? 'translateY(0)' : 'translateY(14px)',
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s cubic-bezier(0.22,1,0.36,1) 750ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) 750ms',
            }}
          >
            <button
              type="button"
              onClick={handleCTA}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-white font-semibold text-sm"
              style={{
                backgroundColor: '#C96C2B',
                boxShadow: '0 4px 20px rgba(201,108,43,0.4)',
                transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(201,108,43,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,108,43,0.4)'; }}
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleCTA}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white"
              style={{
                border: '1px solid rgba(255,255,255,0.25)',
                transition: 'transform 0.2s ease-out, background-color 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
            >
              Book a Demo
            </button>
          </div>
          <p
            className="text-xs mt-8"
            style={{
              color: 'rgba(255,255,255,0.35)',
              opacity: reduced || ctaInView ? 1 : 0,
              transition: reduced ? 'opacity 0.4s ease' : 'opacity 0.5s ease 900ms',
            }}
          >
            No credit card required · 14-day free trial · Cancel anytime
          </p>
        </div>
      </section>

      {/* ══════════════════ FOOTER ══════════════════ */}
      <footer className="bg-white border-t border-border pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-6 gap-8 pb-12 border-b border-border">
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2" aria-label="TransitOps Home">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-primary tracking-tight">TransitOps</span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: '#6B7280' }}>
              Smart Transport Operations Platform — consolidate operations, track assets, and optimize workflows.
            </p>
          </div>
          {[
            { heading: 'Product', links: ['Features', 'Enterprise Sandbox', 'Integrations', 'Pricing'] },
            { heading: 'Resources', links: ['Documentation', 'Support Center', 'Developer APIs', 'System Status'] },
            { heading: 'Company', links: ['About Us', 'Careers', 'Compliance', 'Security'] },
            { heading: 'Social', links: ['GitHub', 'Twitter / X', 'LinkedIn', 'YouTube'] },
          ].map((col) => (
            <div key={col.heading}>
              <h4 className="text-xs font-bold text-primary tracking-wider uppercase mb-4">{col.heading}</h4>
              <ul className="space-y-2.5 text-xs font-medium" style={{ color: '#6B7280' }}>
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-primary transition-colors duration-150">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium" style={{ color: '#6B7280' }}>
          <p>© 2026 TransitOps. Built for smarter fleet operations.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Preferences'].map((l) => (
              <a key={l} href="#" className="hover:text-primary transition-colors duration-150">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
