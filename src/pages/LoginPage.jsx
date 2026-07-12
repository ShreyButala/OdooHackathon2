import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Truck, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

/* ─── prefers-reduced-motion ─── */
function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const h = (e) => setReduced(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return reduced;
}

/* ─── Google Icon SVG ─── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

/* ─── Microsoft Icon SVG ─── */
const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
    <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
    <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
    <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
  </svg>
);

const ORG_CLIP_ID = 'transit-organic-clip';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const reduced = useReducedMotion();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post('/auth/login', { email, password });
      const { user, token } = res.data;
      
      login(user, token);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardAnim = {
    opacity:    reduced || mounted ? 1 : 0,
    transform:  reduced || mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.985)',
    transition: reduced
      ? 'opacity 0.3s ease'
      : 'opacity 0.55s cubic-bezier(0.22,1,0.36,1) 80ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) 80ms',
  };

  return (
    <div
      className="min-h-screen font-sans antialiased flex flex-col items-center justify-center p-4 sm:p-8 md:p-12"
      style={{ backgroundColor: '#F5F7F8' }}
    >
      {/* ── Back to site link ── */}
      <div className="w-full mb-5" style={{ maxWidth: 1080 }}>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: '#6B7280', textDecoration: 'none', transition: 'color 0.15s ease' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#163A5F')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
        >
          <ArrowLeft size={14} />
          Back to site
        </Link>
      </div>

      {/* ── Outer "app window" card ── */}
      <div
        className="w-full flex overflow-hidden"
        style={{
          maxWidth: 1080,
          minHeight: 640,
          borderRadius: 24,
          boxShadow: '0 8px 56px rgba(22,58,95,0.12), 0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #E5E7EB',
          ...cardAnim,
        }}
      >

        {/* ════════ LEFT PANEL — FORM ════════ */}
        <div
          className="flex flex-col w-full lg:w-[44%] bg-white shrink-0"
          style={{ padding: 'clamp(32px, 5vw, 56px)', minHeight: 640, zIndex: 2 }}
        >

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-10 group w-fit"
            aria-label="TransitOps Home"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: '#163A5F', transition: 'transform 0.18s ease' }}
              onMouseEnter={e => !reduced && (e.currentTarget.style.transform = 'scale(0.93)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight" style={{ color: '#163A5F' }}>
              TransitOps
            </span>
          </Link>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-2.5 bg-[#C94F4F]/5 border border-[#C94F4F]/20 rounded-lg px-3.5 py-3 text-sm text-[#C94F4F]">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs font-bold text-primary"
                >
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="fleet@transitops.com"
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-lg bg-background placeholder:text-text-secondary/60 text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold text-primary"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 pr-10 text-sm border border-border rounded-lg bg-background placeholder:text-text-secondary/60 text-text focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-primary transition-colors p-0.5"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-white text-sm font-semibold py-2.5 rounded-lg shadow-sm hover:bg-primary/95 transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo hint */}
            <div className="text-center pt-2 border-t border-border">
              <p className="text-xs text-text-secondary leading-relaxed">
                Demo Accounts:
                <br />
                <span className="font-semibold text-primary">manager_trips2@example.com</span> (Manager)
                <br />
                <span className="font-semibold text-primary">dispatch2@example.com</span> (Dispatcher)
                <br />
                <span className="font-semibold text-primary">finance@example.com</span> (Finance)
                <br />
                <span className="font-semibold text-primary">safety_trips2@example.com</span> (Safety)
                <br />
                Password for all: <span className="font-semibold text-primary">Password123</span>
              </p>
            </div>
          </div>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            {[
              { icon: <GoogleIcon />, label: 'Continue with Google' },
              { icon: <MicrosoftIcon />, label: 'Continue with Microsoft' },
            ].map(({ icon, label }) => (
              <button
                key={label}
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  border: '1px solid #E5E7EB',
                  color: '#111827',
                  backgroundColor: '#fff',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (reduced) return;
                  e.currentTarget.style.borderColor = '#163A5F';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(22,58,95,0.1)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span className="shrink-0">{icon}</span>
                <span className="flex-1 text-center">{label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
            <span className="text-xs font-medium px-1" style={{ color: '#6B7280' }}>Or</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm mb-4"
              style={{
                backgroundColor: 'rgba(201,79,79,0.06)',
                border: '1px solid rgba(201,79,79,0.22)',
                color: '#C94F4F',
              }}
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 flex-1" noValidate>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="login-email" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                Email address
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fleet@transitops.com"
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: 14,
                  borderRadius: 10,
                  border: '1px solid #E5E7EB',
                  backgroundColor: '#F5F7F8',
                  color: '#111827',
                  outline: 'none',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                  boxSizing: 'border-box',
                }}
                onFocus={e => {
                  e.target.style.borderColor = '#C96C2B';
                  e.target.style.boxShadow = '0 0 0 3px rgba(201,108,43,0.12)';
                  e.target.style.backgroundColor = '#fff';
                }}
                onBlur={e => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                }}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 42px 10px 14px',
                    fontSize: 14,
                    borderRadius: 10,
                    border: '1px solid #E5E7EB',
                    backgroundColor: '#F5F7F8',
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = '#C96C2B';
                    e.target.style.boxShadow = '0 0 0 3px rgba(201,108,43,0.12)';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = '#E5E7EB';
                    e.target.style.boxShadow = 'none';
                    e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#6B7280',
                    padding: 2,
                    lineHeight: 0,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#163A5F')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    width: 15,
                    height: 15,
                    accentColor: '#163A5F',
                    borderRadius: 4,
                    cursor: 'pointer',
                  }}
                />
                <span className="text-xs" style={{ color: '#6B7280' }}>Remember me</span>
              </label>
              <a
                href="#"
                className="text-xs underline"
                style={{ color: '#6B7280', transition: 'color 0.15s ease' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#163A5F')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
              >
                Forgot password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#163A5F',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                padding: '11px 0',
                borderRadius: 12,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                marginTop: 4,
                boxShadow: '0 2px 8px rgba(22,58,95,0.2)',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
              }}
              onMouseEnter={e => {
                if (isLoading || reduced) return;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(22,58,95,0.28)';
                e.currentTarget.style.backgroundColor = '#1a4875';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(22,58,95,0.2)';
                e.currentTarget.style.backgroundColor = '#163A5F';
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff',
                      display: 'inline-block',
                      animation: 'spin 0.7s linear infinite',
                    }}
                  />
                  Signing in…
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          {/* Spacer pushes footer to bottom */}
          <div className="flex-1" />

          {/* Demo hint */}
          <div
            className="mt-5 pt-4 text-center"
            style={{ borderTop: '1px solid #E5E7EB' }}
          >
            <p className="text-[11px] leading-relaxed" style={{ color: '#9CA3AF' }}>
              Demo mode — any email + password will work.{' '}
              <span className="font-semibold" style={{ color: '#163A5F' }}>
                Try: demo@transitops.com
              </span>
            </p>
          </div>

          {/* Sign-up link */}
          <p className="text-sm text-center mt-4" style={{ color: '#6B7280' }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              id="get-started-link"
              style={{
                color: '#C96C2B',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'opacity 0.15s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Get Started
            </Link>
          </p>
        </div>

        {/* ════════ RIGHT PANEL — ORGANIC SHAPE + IMAGE ════════ */}
        {/*
          The organic arched left-edge is achieved with an SVG clipPath.
          objectBoundingBox units mean coords are 0–1 relative to the element.
          The curve flows from top-left → bottom-left like a wavy arch.
        */}
        <div
          className="hidden lg:block flex-1 relative"
          style={{ backgroundColor: '#163A5F', overflow: 'hidden' }}
        >
          {/* SVG clip-path definition (0×0, invisible) */}
          <svg
            width="0"
            height="0"
            style={{ position: 'absolute', overflow: 'visible' }}
            aria-hidden="true"
          >
            <defs>
              <clipPath id={ORG_CLIP_ID} clipPathUnits="objectBoundingBox">
                {/* Organic wavy left edge — curves in and out creating the torn/arched shape */}
                <path d="M 0.10,0 C 0.10,0 0.04,0.07 0.03,0.17 C 0.01,0.27 0.07,0.35 0.07,0.50 C 0.07,0.65 0.01,0.73 0.03,0.83 C 0.04,0.93 0.10,1.00 0.10,1.00 L 1.00,1.00 L 1.00,0.00 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* Clipped inner panel */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `url(#${ORG_CLIP_ID})`,
              WebkitClipPath: `url(#${ORG_CLIP_ID})`,
            }}
          >
            {/* Fleet image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('/fleet-login.png')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center 30%',
                filter: 'brightness(0.68) saturate(1.15)',
              }}
              role="img"
              aria-label="Aerial view of a transit fleet"
            />

            {/* Top scrim — navy gradient for text legibility */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(180deg, rgba(22,58,95,0.88) 0%, rgba(22,58,95,0.30) 40%, rgba(22,58,95,0.08) 100%)',
              }}
            />

            {/* Bottom scrim — subtle darkening */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(0deg, rgba(13,35,58,0.62) 0%, transparent 42%)',
              }}
            />

            {/* Text content — top-aligned */}
            <div
              className="relative z-10 flex flex-col justify-between h-full"
              style={{ padding: 'clamp(36px,4vw,56px)' }}
            >
              {/* Top: badge + headline */}
              <div style={{ maxWidth: 340 }}>
                {/* Status pill */}
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 select-none"
                  style={{
                    backgroundColor: 'rgba(201,108,43,0.22)',
                    border: '1px solid rgba(201,108,43,0.38)',
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: '#C96C2B' }}
                  />
                  AI-Powered Logistics Platform
                </div>

                <h2
                  className="font-bold text-white leading-tight"
                  style={{ fontSize: 'clamp(22px, 2.5vw, 34px)', letterSpacing: '-0.025em' }}
                >
                  Real-time visibility
                  <br />
                  across your entire fleet.
                </h2>
                <p
                  className="mt-3 text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 310 }}
                >
                  From dispatch to delivery — monitor every vehicle, driver,
                  and route from a single unified console.
                </p>
              </div>

              {/* Bottom: stat chips + live badge */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  {[
                    { value: '99.8%', label: 'Dispatch accuracy' },
                    { value: '412',   label: 'Vehicles live' },
                    { value: '25K+',  label: 'Trips completed' },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="flex-1 rounded-xl px-3 py-2.5"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.10)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      <p className="text-base font-extrabold text-white leading-none">{s.value}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Live badge */}
                <div
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium w-fit"
                  style={{ color: 'rgba(255,255,255,0.55)' }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: '#2F7A5F',
                      boxShadow: '0 0 0 3px rgba(47,122,95,0.35)',
                      animation: 'login-pulse 2s ease-in-out infinite',
                    }}
                  />
                  Live data · Updated every 30s
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes login-pulse {
          0%, 100% { opacity: 0.5; }
          50%       { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
          [style*="transition"] { transition: opacity 0.3s ease !important; }
        }
      `}</style>
    </div>
  );
}
