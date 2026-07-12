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
import { motion, AnimatePresence } from 'framer-motion';

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

const DashboardPreview = () => (
  <motion.div
    initial={{ opacity: 0, y: 60 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1.2, delay: 0.6, type: 'spring', bounce: 0.4 }}
    className="w-full max-w-5xl mx-auto mt-16 relative [perspective:1200px]"
  >
    {/* Glow behind the preview */}
    <div className="absolute -inset-4 bg-gradient-to-tr from-accent/20 to-primary/20 blur-2xl rounded-[2.5rem] opacity-50 pointer-events-none" />
    
    <div className="relative bg-white/70 backdrop-blur-2xl border border-white/60 shadow-[0_20px_50px_rgba(15,40,66,0.2)] rounded-3xl overflow-hidden flex flex-col transform md:rotate-x-[4deg] md:scale-95 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out h-[350px] md:h-[500px]">
      
      {/* Mock Browser Header */}
      <div className="bg-white/50 border-b border-white/60 p-3 flex items-center gap-2">
        <div className="flex gap-1.5 ml-2">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="mx-auto w-1/3 bg-white/60 rounded-md h-6 border border-white/50 flex items-center justify-center shadow-inner">
          <div className="w-1/2 h-1.5 bg-[#94A3B8]/30 rounded-full" />
        </div>
      </div>

      {/* Mock App Content */}
      <div className="flex flex-1 p-4 md:p-6 gap-6 bg-gradient-to-br from-[#F8FAFC]/50 to-white/50 pointer-events-none">
        
        {/* Mock Sidebar */}
        <div className="w-48 hidden md:flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded bg-primary/20" />
            <div className="h-4 bg-primary/20 rounded w-2/3" />
          </div>
          <div className="h-8 bg-primary/10 rounded-lg w-full border border-primary/10" />
          <div className="h-4 bg-[#E2E8F0] rounded-md w-3/4 ml-2 mt-2" />
          <div className="h-4 bg-[#E2E8F0] rounded-md w-full ml-2" />
          <div className="h-4 bg-[#E2E8F0] rounded-md w-5/6 ml-2" />
          
          <div className="h-px w-full bg-[#E2E8F0] my-2" />
          <div className="h-4 bg-[#E2E8F0] rounded-md w-4/5 ml-2" />
          <div className="h-4 bg-[#E2E8F0] rounded-md w-full ml-2" />
        </div>

        {/* Mock Main Content */}
        <div className="flex-1 flex flex-col gap-5">
          <div className="flex justify-between items-center">
             <div className="space-y-2 w-1/3">
               <div className="h-6 bg-primary/30 rounded-md w-full" />
               <div className="h-3 bg-[#E2E8F0] rounded w-2/3" />
             </div>
             <div className="h-10 bg-accent text-white rounded-xl w-32 shadow-lg flex items-center justify-center text-[10px] font-bold uppercase tracking-wider">
               <div className="w-16 h-2 bg-white/40 rounded-full" />
             </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {[1, 2, 3].map((card, i) => (
               <div key={i} className="bg-white border border-white/80 p-5 rounded-2xl shadow-sm flex flex-col justify-center gap-3 relative overflow-hidden">
                 <div className="h-3 bg-[#E2E8F0] rounded w-1/2" />
                 <div className={`h-8 rounded w-1/3 ${i === 2 ? 'bg-accent/30' : 'bg-primary/30'}`} />
                 <div className="absolute right-[-10%] bottom-[-20%] w-16 h-16 rounded-full bg-primary/5 blur-xl" />
               </div>
             ))}
          </div>

          <div className="flex-1 bg-white border border-white/80 rounded-2xl shadow-sm p-5 flex flex-col gap-4 relative overflow-hidden">
             <div className="flex justify-between items-center mb-2">
               <div className="h-4 bg-[#E2E8F0] rounded w-1/4" />
               <div className="h-4 bg-[#E2E8F0] rounded w-12" />
             </div>
             
             {/* Beautiful abstract bar chart */}
             <div className="flex-1 flex items-end gap-2 md:gap-3 pb-2 border-b border-[#E2E8F0]">
                {[40, 70, 45, 90, 65, 80, 55, 100, 75, 85].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: 1 + (i * 0.1), ease: "easeOut" }}
                    className="flex-1 rounded-t-md relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-primary/40 group-hover:to-primary/60 transition-colors" />
                  </motion.div>
                ))}
             </div>
          </div>
        </div>
      </div>

    </div>
  </motion.div>
);

const TransitBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Map Grid */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#163A5F 2px, transparent 2px)', backgroundSize: '40px 40px' }} />
      
      {/* SVG Network */}
      <svg className="absolute inset-0 w-full h-full opacity-30" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1000 800">
        <defs>
          <linearGradient id="pathGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#163A5F" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#163A5F" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#163A5F" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="pathGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C96C2B" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#C96C2B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C96C2B" stopOpacity="0.1" />
          </linearGradient>
          
          <path id="route1" d="M -100 200 C 200 100, 400 300, 1100 200" fill="none" />
          <path id="route2" d="M 200 -100 C 300 300, 600 500, 1100 600" fill="none" />
          <path id="route3" d="M 800 -100 C 700 200, 500 400, 200 900" fill="none" />
          <path id="route4" d="M -100 600 C 200 600, 400 400, 1100 800" fill="none" />
        </defs>

        {/* Drawn Paths */}
        <path d="M -100 200 C 200 100, 400 300, 1100 200" fill="none" stroke="url(#pathGrad1)" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M 200 -100 C 300 300, 600 500, 1100 600" fill="none" stroke="url(#pathGrad2)" strokeWidth="2" strokeDasharray="6 6" />
        <path d="M 800 -100 C 700 200, 500 400, 200 900" fill="none" stroke="url(#pathGrad1)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M -100 600 C 200 600, 400 400, 1100 800" fill="none" stroke="url(#pathGrad2)" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Animated Vehicles on Paths */}
        <circle r="6" fill="#163A5F" filter="drop-shadow(0 0 6px #163A5F)">
          <animateMotion dur="15s" repeatCount="indefinite">
            <mpath href="#route1" />
          </animateMotion>
        </circle>
        <circle r="7" fill="#C96C2B" filter="drop-shadow(0 0 8px #C96C2B)">
          <animateMotion dur="18s" repeatCount="indefinite">
            <mpath href="#route2" />
          </animateMotion>
        </circle>
        <circle r="4.5" fill="#163A5F" filter="drop-shadow(0 0 5px #163A5F)">
          <animateMotion dur="12s" repeatCount="indefinite">
            <mpath href="#route3" />
          </animateMotion>
        </circle>
        <circle r="5" fill="#C96C2B" filter="drop-shadow(0 0 6px #C96C2B)">
          <animateMotion dur="20s" repeatCount="indefinite">
            <mpath href="#route4" />
          </animateMotion>
        </circle>

        {/* Moving dashed line effect */}
        <path d="M -100 200 C 200 100, 400 300, 1100 200" fill="none" stroke="#163A5F" strokeWidth="1.5" strokeDasharray="30 200">
           <animate attributeName="stroke-dashoffset" from="230" to="0" dur="8s" repeatCount="indefinite" />
        </path>
        <path d="M 200 -100 C 300 300, 600 500, 1100 600" fill="none" stroke="#C96C2B" strokeWidth="1.5" strokeDasharray="30 200">
           <animate attributeName="stroke-dashoffset" from="230" to="0" dur="10s" repeatCount="indefinite" />
        </path>

        {/* Hubs */}
        <circle cx="270" cy="160" r="10" fill="#163A5F" opacity="0.3">
           <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="270" cy="160" r="5" fill="#163A5F" />
        
        <circle cx="430" cy="380" r="12" fill="#C96C2B" opacity="0.3">
           <animate attributeName="r" values="12;20;12" dur="4s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0.3;0;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="430" cy="380" r="6" fill="#C96C2B" />

        <circle cx="630" cy="270" r="10" fill="#163A5F" opacity="0.3">
           <animate attributeName="r" values="10;16;10" dur="2.5s" repeatCount="indefinite" />
           <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="630" cy="270" r="5" fill="#163A5F" />
      </svg>

      {/* Decorative Orbs to maintain lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[150px] mix-blend-overlay" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-[150px] mix-blend-overlay" />
    </div>
  );
};

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
    <div className="min-h-screen animate-colorful-mesh text-text flex flex-col font-sans antialiased selection:bg-accent/20 selection:text-primary relative overflow-hidden">
      
      {/* Animated Logistics Background */}
      <TransitBackground />

      {/* 1. Announcement Bar */}
      <AnimatePresence>
        {isAnnounceOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-primary to-[#163A5F] text-white text-xs py-2.5 px-4 sticky top-0 z-50 flex items-center justify-between shadow-md select-none overflow-hidden"
          >
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
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Navbar */}
      <Navbar isScrolled={isScrolled} isAnnounceOpen={isAnnounceOpen} />

      {/* 3. Hero */}
      <header
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="min-h-[calc(100vh-64px)] flex flex-col justify-between px-6 py-12 md:py-28 max-w-7xl mx-auto w-full relative overflow-hidden z-10"
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="my-auto max-w-5xl space-y-10 relative z-10 mx-auto text-center flex flex-col items-center pt-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel-light border border-white/50 shadow-sm mb-4">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-bold text-primary tracking-wide uppercase">v2.0 is live</span>
          </div>

          <h1
            style={{ fontSize: 'clamp(36px, 5vw, 80px)' }}
            className="font-bold tracking-tighter select-none font-sans text-center max-w-none leading-[1.05] flex flex-col items-center gap-2 text-primary"
          >
            <div className="whitespace-normal md:whitespace-nowrap">
              {headlineLine1.map((w, idx) => (
                <span key={idx} className="inline-block drop-shadow-sm">
                  <MagneticWord mousePos={mousePos} disabled={isTouchDevice || prefersReducedMotion}>
                    <span>{w.text}</span>
                  </MagneticWord>
                  {idx < headlineLine1.length - 1 && '\u00A0'}
                </span>
              ))}
            </div>
            <div className="whitespace-normal md:whitespace-nowrap">
              {headlineLine2.map((el, idx) => (
                <span key={idx} className="inline-block drop-shadow-sm">
                  <MagneticWord mousePos={mousePos} disabled={isTouchDevice || prefersReducedMotion}>
                    {el.type === 'text' ? (
                      <span className={el.accent ? 'text-accent' : ''}>
                        {el.text}
                      </span>
                    ) : (
                      <TextMorph words={el.words} loop className="text-accent animate-none" />
                    )}
                  </MagneticWord>
                  {idx < headlineLine2.length - 1 && '\u00A0'}
                </span>
              ))}
            </div>
          </h1>

          <div className="max-w-2xl space-y-8 pt-4 text-center mx-auto flex flex-col items-center">
            <p className="text-lg sm:text-xl text-[#334155] leading-relaxed font-medium">
              Consolidate your entire fleet, drivers, dispatch, maintenance, and analytics in one beautiful platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full">
              <button
                type="button"
                onClick={handleDashboardCTA}
                className="bg-primary text-white text-base font-semibold px-8 py-4 rounded-full shadow-[0_8px_30px_rgba(15,40,66,0.3)] hover:shadow-[0_12px_40px_rgba(15,40,66,0.4)] hover:bg-[#0B1420] transition-all text-center hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
              >
                Get Started Now
              </button>
              <a
                href="#dashboard-preview"
                className="glass-panel-light text-primary border border-white/50 text-base font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all text-center flex items-center justify-center gap-2 hover:-translate-y-1 active:translate-y-0 w-full sm:w-auto"
              >
                Explore Dashboard <ChevronRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Dashboard UI Preview below buttons */}
        <DashboardPreview />
      </header>

      {/* 4. Wave Text */}
      <ScrollReveal className="py-20 md:py-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-6">Mission Statement</span>
          <div className="glass-panel-light rounded-[3rem] p-12 md:p-24 shadow-xl border border-white/60">
            <WaveText text="Built for operations that never stop moving." />
          </div>
        </div>
      </ScrollReveal>

      {/* 5. Stats */}
      <ScrollReveal className="max-w-7xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'Fleet Vehicles Managed', desc: 'Active trucks, mini loaders, and logistics vehicles connected.' },
            { value: '25K+', label: 'Trips Completed', desc: 'Secure local and cross-state dispatches successfully completed.' },
            { value: '99.8%', label: 'Dispatch Accuracy', desc: 'AI routes matched without delay or dispatch planning conflict.' },
            { value: '40%', label: 'Manual Operations Saved', desc: 'Automation of fuel logs, invoices, and scheduling spreadsheets.' },
          ].map((stat, i) => (
            <motion.div 
              whileHover={{ y: -5, scale: 1.02 }}
              key={i} 
              className="glass-panel-light p-8 rounded-3xl border border-white/50 shadow-lg flex flex-col justify-between"
            >
              <div>
                <h3 className="text-4xl sm:text-5xl font-extrabold text-primary font-sans bg-clip-text text-transparent bg-gradient-to-br from-primary to-accent">
                  <Counter value={stat.value} />
                </h3>
                <p className="text-sm font-bold text-primary mt-3">{stat.label}</p>
              </div>
              <p className="text-xs text-[#475569] mt-5 leading-relaxed font-medium">{stat.desc}</p>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* 6. Features Grid */}
      <ScrollReveal id="features" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="space-y-16">
          <div className="max-w-4xl text-center mx-auto">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Platform Capabilities</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
              Everything your fleet needs — <TextMorph loop /> — in one platform.
            </h2>
            <p className="text-base sm:text-lg text-[#334155] mt-6 max-w-2xl mx-auto font-medium">
              Ditch scattered legacy software. Our unified modules talk to each other so you can operate with absolute clarity.
            </p>
          </div>
          <div className="glass-panel-light rounded-[3rem] border border-white/60 overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                  className="p-10 border-b border-r border-white/30 hover:bg-white/40 transition-all duration-300 group flex flex-col justify-between min-h-[260px] cursor-pointer"
                >
                  <div className="space-y-5">
                    <div className="p-4 bg-white rounded-2xl w-fit shadow-sm transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                      <Icon className="w-6 h-6 text-primary group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                    <p className="text-sm text-[#475569] leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* 7. Workflow Timeline */}
      <div id="workflow" ref={workflowRef} className="w-full px-6 py-20 relative">
        <div className="max-w-7xl mx-auto glass-panel-light rounded-[3rem] border border-white/60 shadow-2xl p-10 md:p-20 relative overflow-hidden">
          <div className="max-w-3xl text-left mb-16 relative z-10">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Operations Lifecycle</span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-primary">Smarter Workflows from Day One</h2>
            <p className="text-base text-[#334155] mt-4 max-w-xl font-medium">
              TransitOps structures the complete dispatch workflow, ensuring validation, compliance, and reporting occur naturally in one loop.
            </p>
          </div>
          <div className="relative pl-12 lg:pl-0 z-10">
            <div className="absolute top-6 left-[8%] right-[8%] h-1 bg-white/50 rounded-full hidden lg:block z-0 shadow-inner">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300 ease-out" style={{ width: prefersReducedMotion ? '100%' : `${workflowProgress * 100}%` }} />
            </div>
            <div className="absolute left-6 top-6 bottom-6 w-1 bg-white/50 rounded-full lg:hidden z-0 shadow-inner">
              <div className="w-full bg-gradient-to-b from-primary to-accent rounded-full transition-all duration-300 ease-out" style={{ height: prefersReducedMotion ? '100%' : `${workflowProgress * 100}%` }} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 lg:gap-6 relative z-10">
              {workflowStages.map((stage, i) => {
                const isActive = prefersReducedMotion || workflowProgress >= workflowThresholds[i];
                const Icon = stage.icon;
                return (
                  <div key={i} className="flex flex-row lg:flex-col items-start lg:items-center gap-6 lg:gap-4 group">
                    <div className="relative shrink-0 lg:mx-auto">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm font-mono transition-all duration-500 relative z-20 ${
                        isActive ? 'bg-primary text-white shadow-xl scale-110' : 'bg-white text-[#94A3B8] shadow-sm border border-white/50'
                      }`}>
                        {stage.step}
                      </div>
                    </div>
                    <div className="flex-1 space-y-3 lg:text-center text-left">
                      <div className="flex items-center lg:justify-center gap-2">
                        <Icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-accent' : 'text-[#94A3B8]'}`} />
                        <h3 className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-primary' : 'text-[#64748B]'}`}>{stage.title}</h3>
                      </div>
                      <p className="text-xs text-[#475569] font-medium leading-relaxed max-w-[185px] lg:mx-auto">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Static Dashboard Preview */}
      <ScrollReveal id="dashboard-preview" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="space-y-12">
          <div className="max-w-4xl text-center mx-auto">
            <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-4">Live Operations Console</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-primary">
              Take Control of Your Fleet Operations
            </h2>
            <p className="text-base text-[#334155] mt-4 font-medium max-w-2xl mx-auto">
              A unified console built for fleet managers — real-time dispatch, vehicle health, fuel analytics, and custom reports.
            </p>
          </div>

          <div className="w-full glass-panel-light rounded-[2rem] border border-white/60 overflow-hidden shadow-2xl p-4">
            <div className="bg-white/80 rounded-[1.5rem] overflow-hidden border border-white/40 shadow-inner">
              <div className="bg-[#F8FAFC] px-6 py-4 flex items-center justify-between border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 shadow-sm" />
                  <div className="w-3.5 h-3.5 rounded-full bg-green-400 shadow-sm" />
                </div>
                <div className="bg-white border border-[#E2E8F0] shadow-sm text-xs px-8 py-1.5 rounded-full text-[#64748B] font-semibold w-1/2 text-center truncate">
                  app.transitops.com/dashboard
                </div>
                <div className="w-12" />
              </div>

              <div className="p-8 bg-[#F1F5F9]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: 'Active Vehicles', value: '412', badge: '+12 today' },
                    { label: 'Trips Completed', value: '25,482', badge: '99.8% on-time' },
                    { label: 'Fuel Spend (MTD)', value: '₹14.2L', badge: '-4.2% efficiency' },
                    { label: 'Pending Services', value: '8', badge: '3 urgent alerts' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
                      <p className="text-[11px] text-[#64748B] font-bold tracking-wider uppercase">{kpi.label}</p>
                      <h3 className="text-3xl font-bold text-primary mt-2 font-sans">{kpi.value}</h3>
                      <p className="text-xs text-success mt-4 font-bold bg-success/10 w-fit px-2 py-1 rounded-md"> {kpi.badge}</p>
                    </div>
                  ))}
                </div>

                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E2E8F0]">
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-6">
                    <p className="text-lg font-bold text-primary text-center">Ready to see the real thing?</p>
                    <div className="flex gap-4">
                      <button
                        onClick={handleDashboardCTA}
                        className="bg-primary text-white text-sm font-semibold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-1 transition-all"
                      >
                        {isLoggedIn ? 'Open Dashboard' : 'Get Started for Free'}
                      </button>
                    </div>
                  </div>
                  <div className="h-64 bg-white p-6 flex flex-col gap-4">
                    <div className="w-1/3 h-6 bg-[#E2E8F0] rounded-md animate-pulse"></div>
                    <div className="w-full h-full bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 9. Why TransitOps */}
      <ScrollReveal id="why-transitops" className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold text-accent tracking-widest uppercase block mb-3">Why TransitOps</span>
              <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight leading-tight">
                Replace operational chaos with automation.
              </h2>
            </div>
            <p className="text-base text-[#334155] leading-relaxed font-medium">
              Consolidating fleet operations avoids administrative errors, prevents diagnostic issues from escalating, and provides real-time data to protect your profit margins.
            </p>
            <div className="space-y-5 pt-6 border-t border-white/40">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <p className="text-sm text-[#334155] leading-relaxed font-medium">
                  <strong className="text-primary font-bold block mb-1">Unified logs:</strong> Never lose track of fuel slips, invoices, or licensing dates again.
                </p>
              </div>
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-accent" />
                </div>
                <p className="text-sm text-[#334155] leading-relaxed font-medium">
                  <strong className="text-primary font-bold block mb-1">Reduced liabilities:</strong> Enforce compliance checks automatically before starting any trip dispatch.
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-primary/10 blur-[100px] -z-10" />
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl p-8 space-y-6 shadow-sm">
              <h3 className="text-xs font-bold text-[#64748B] uppercase tracking-widest">Legacy Workflows</h3>
              <ul className="space-y-4 text-sm text-[#475569] font-medium">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-400" /> Manual spreadsheet coordination</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-400" /> Driver and load scheduling conflicts</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-red-400" /> Scattered diagnostic & service records</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-primary to-[#163A5F] text-white rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-accent/30 blur-3xl pointer-events-none group-hover:bg-accent/50 transition-all" />
              <h3 className="text-xs font-bold text-accent uppercase tracking-widest">TransitOps Platform</h3>
              <ul className="space-y-4 text-sm text-white/90 font-semibold relative z-10">
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#C96C2B]" /> Centralized, unified platform</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#C96C2B]" /> Real-time fleet tracking & dispatch visibility</li>
                <li className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_#C96C2B]" /> Automated rule-based validations</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 10. CTA */}
      <ScrollReveal id="cta" className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="glass-panel-light rounded-[3rem] border border-white/60 p-12 md:p-20 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="max-w-3xl mx-auto space-y-8 relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-primary leading-tight">
              Ready to Modernize Your Fleet Operations?
            </h2>
            <p className="text-lg text-[#334155] leading-relaxed font-medium">
              Get started with TransitOps today. Streamline your dispatch cycles, control fuel expenses, and maximize asset longevity in a unified console.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                type="button"
                onClick={handleDashboardCTA}
                className="bg-primary text-white text-base font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-primary/95 transition-all w-full sm:w-auto hover:-translate-y-1"
              >
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 11. Footer */}
      <footer className="glass-panel-light border-t border-white/50 mt-auto pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 pb-12 border-b border-white/40">
          <Link to="/" className="flex items-center gap-3 group" aria-label="TransitOps Home">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">TransitOps</span>
          </Link>
          <div className="flex gap-8 text-sm font-semibold text-[#475569]">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#dashboard-preview" className="hover:text-primary transition-colors">Dashboard</a>
            <a href="#why-transitops" className="hover:text-primary transition-colors">About</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B] font-medium">
          <p>© 2026 TransitOps. Built for smarter fleet operations.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
