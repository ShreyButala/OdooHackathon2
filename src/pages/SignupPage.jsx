import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck, Eye, EyeOff, AlertCircle, ArrowLeft,
  Check, User, Mail, Lock, Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── prefers-reduced-motion hook ─── */
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

/* ─── Google Icon ─── */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

/* ─── Microsoft Icon ─── */
const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <rect x="0"   y="0"   width="8.5" height="8.5" fill="#F25022"/>
    <rect x="9.5" y="0"   width="8.5" height="8.5" fill="#7FBA00"/>
    <rect x="0"   y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
    <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
  </svg>
);

/* ─── Password strength meter ─── */
function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: 'transparent' };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (pw.length >= 12)          score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = [
    { label: '',         color: 'transparent' },
    { label: 'Weak',     color: '#C94F4F' },
    { label: 'Fair',     color: '#D9A441' },
    { label: 'Good',     color: '#C96C2B' },
    { label: 'Strong',   color: '#2F7A5F' },
    { label: 'Excellent',color: '#163A5F' },
  ];
  return map[Math.min(score, 5)];
}

/* ─── Plans ─── */
const PLANS = [
  { id: 'starter',    label: 'Starter',     desc: 'Up to 25 vehicles',   price: 'Free' },
  { id: 'pro',        label: 'Pro',          desc: 'Up to 200 vehicles',  price: '$49/mo' },
  { id: 'enterprise', label: 'Enterprise',   desc: 'Unlimited + SLA',     price: 'Custom' },
];

const ORG_CLIP_ID_SIGNUP = 'transit-signup-clip';

/* ─── Input component (DRY) ─── */
function Field({ id, label, type = 'text', value, onChange, placeholder, required, autoComplete, children }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          onFocus={e => {
            setFocused(true);
            e.target.style.borderColor     = '#C96C2B';
            e.target.style.boxShadow       = '0 0 0 3px rgba(201,108,43,0.12)';
            e.target.style.backgroundColor = '#fff';
          }}
          onBlur={e => {
            setFocused(false);
            e.target.style.borderColor     = '#E5E7EB';
            e.target.style.boxShadow       = 'none';
            e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
          }}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 14,
            borderRadius: 10,
            border: '1px solid #E5E7EB',
            backgroundColor: '#F5F7F8',
            color: '#111827',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
          }}
        />
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════ */
export default function SignupPage() {
  const [fullName,        setFullName]        = useState('');
  const [company,         setCompany]         = useState('');
  const [email,           setEmail]           = useState('');
  const [password,        setPassword]        = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword,    setShowPassword]    = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [plan,            setPlan]            = useState('starter');
  const [agreedToTerms,   setAgreedToTerms]   = useState(false);
  const [isLoading,       setIsLoading]       = useState(false);
  const [error,           setError]           = useState('');
  const [mounted,         setMounted]         = useState(false);

  const reduced  = useReducedMotion();
  const { login } = useAuth();
  const navigate  = useNavigate();
  const strength  = getPasswordStrength(password);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim())               { setError('Please enter your full name.'); return; }
    if (!email.trim())                  { setError('Please enter your email address.'); return; }
    if (password.length < 8)            { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword)   { setError('Passwords do not match.'); return; }
    if (!agreedToTerms)                 { setError('Please accept the terms to continue.'); return; }

    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1100));
    login({ name: fullName.trim() });
    navigate('/dashboard', { replace: true });
  };

  const cardAnim = {
    opacity:    reduced || mounted ? 1 : 0,
    transform:  reduced || mounted ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.985)',
    transition: reduced
      ? 'opacity 0.3s ease'
      : 'opacity 0.55s cubic-bezier(0.22,1,0.36,1) 80ms, transform 0.55s cubic-bezier(0.22,1,0.36,1) 80ms',
  };

  /* eye-toggle button style */
  const eyeBtn = {
    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: '#6B7280',
    padding: 2, lineHeight: 0, transition: 'color 0.15s ease',
  };

  return (
    <div
      className="min-h-screen font-sans antialiased flex flex-col items-center justify-center p-4 sm:p-6 md:p-10"
      style={{ backgroundColor: '#F5F7F8' }}
    >
      {/* Back to site */}
      <div className="w-full mb-5" style={{ maxWidth: 1100 }}>
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

      {/* Outer card */}
      <div
        className="w-full flex overflow-hidden"
        style={{
          maxWidth: 1100,
          minHeight: 700,
          borderRadius: 24,
          boxShadow: '0 8px 56px rgba(22,58,95,0.12), 0 2px 12px rgba(0,0,0,0.06)',
          border: '1px solid #E5E7EB',
          ...cardAnim,
        }}
      >
        {/* ════ LEFT PANEL — FORM ════ */}
        <div
          className="flex flex-col w-full lg:w-[52%] bg-white shrink-0"
          style={{ padding: 'clamp(28px, 4vw, 48px)', minHeight: 700, zIndex: 2 }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 mb-8 w-fit"
            aria-label="TransitOps Home"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: '#163A5F', transition: 'transform 0.18s ease, box-shadow 0.18s ease' }}
              onMouseEnter={e => {
                if (reduced) return;
                e.currentTarget.style.transform = 'scale(0.93)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(22,58,95,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Truck className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight select-none" style={{ color: '#163A5F' }}>
              TransitOps
            </span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h1
              className="font-bold mb-1.5"
              style={{ color: '#111827', fontSize: 'clamp(20px, 2.8vw, 28px)', letterSpacing: '-0.025em', lineHeight: 1.2 }}
            >
              Create your account
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: '#6B7280' }}>
              Start managing your fleet in minutes. No credit card required.
            </p>
          </div>

          {/* SSO buttons */}
          <div className="flex gap-3 mb-5">
            {[
              { id: 'google',    icon: <GoogleIcon />,    label: 'Google' },
              { id: 'microsoft', icon: <MicrosoftIcon />, label: 'Microsoft' },
            ].map(({ id, icon, label }) => (
              <button
                key={id}
                type="button"
                id={`signup-sso-${id}`}
                className="flex-1 flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium select-none"
                style={{
                  border: '1px solid #E5E7EB',
                  color: '#111827',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={e => {
                  if (reduced) return;
                  e.currentTarget.style.borderColor = '#163A5F';
                  e.currentTarget.style.boxShadow   = '0 2px 12px rgba(22,58,95,0.1)';
                  e.currentTarget.style.transform   = 'translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E5E7EB';
                  e.currentTarget.style.boxShadow   = 'none';
                  e.currentTarget.style.transform   = 'translateY(0)';
                }}
              >
                {icon}
                <span>Continue with {label}</span>
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
            <span className="text-xs font-medium px-1 select-none" style={{ color: '#6B7280' }}>Or sign up with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: '#E5E7EB' }} />
          </div>

          {/* Error banner */}
          {error && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-sm mb-4"
              role="alert"
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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Name + Company row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full name */}
              <div className="space-y-1.5">
                <label htmlFor="signup-name" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                  Full name
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Jane Smith"
                    required
                    style={{
                      width: '100%', padding: '10px 14px 10px 38px',
                      fontSize: 14, borderRadius: 10,
                      border: '1px solid #E5E7EB', backgroundColor: '#F5F7F8',
                      color: '#111827', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor     = '#C96C2B';
                      e.target.style.boxShadow       = '0 0 0 3px rgba(201,108,43,0.12)';
                      e.target.style.backgroundColor = '#fff';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor     = '#E5E7EB';
                      e.target.style.boxShadow       = 'none';
                      e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                    }}
                  />
                  <User size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <label htmlFor="signup-company" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                  Company <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-company"
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="Acme Logistics"
                    style={{
                      width: '100%', padding: '10px 14px 10px 38px',
                      fontSize: 14, borderRadius: 10,
                      border: '1px solid #E5E7EB', backgroundColor: '#F5F7F8',
                      color: '#111827', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor     = '#C96C2B';
                      e.target.style.boxShadow       = '0 0 0 3px rgba(201,108,43,0.12)';
                      e.target.style.backgroundColor = '#fff';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor     = '#E5E7EB';
                      e.target.style.boxShadow       = 'none';
                      e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                    }}
                  />
                  <Building2 size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="signup-email" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                Work email
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jane@acme.com"
                  required
                  style={{
                    width: '100%', padding: '10px 14px 10px 38px',
                    fontSize: 14, borderRadius: 10,
                    border: '1px solid #E5E7EB', backgroundColor: '#F5F7F8',
                    color: '#111827', outline: 'none', boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor     = '#C96C2B';
                    e.target.style.boxShadow       = '0 0 0 3px rgba(201,108,43,0.12)';
                    e.target.style.backgroundColor = '#fff';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor     = '#E5E7EB';
                    e.target.style.boxShadow       = 'none';
                    e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                  }}
                />
                <Mail size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
              </div>
            </div>

            {/* Password + Confirm row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label htmlFor="signup-password" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    style={{
                      width: '100%', padding: '10px 40px 10px 38px',
                      fontSize: 14, borderRadius: 10,
                      border: '1px solid #E5E7EB', backgroundColor: '#F5F7F8',
                      color: '#111827', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor     = '#C96C2B';
                      e.target.style.boxShadow       = '0 0 0 3px rgba(201,108,43,0.12)';
                      e.target.style.backgroundColor = '#fff';
                    }}
                    onBlur={e => {
                      e.target.style.borderColor     = '#E5E7EB';
                      e.target.style.boxShadow       = 'none';
                      e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                    }}
                  />
                  <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={eyeBtn}
                    onMouseEnter={e => (e.currentTarget.style.color = '#163A5F')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Strength bar */}
                {password && (
                  <div>
                    <div className="flex gap-1 mt-1.5">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          style={{
                            flex: 1, height: 3, borderRadius: 2,
                            backgroundColor: i <= strength.score ? strength.color : '#E5E7EB',
                            transition: 'background-color 0.2s ease',
                          }}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <p className="text-[10px] mt-1" style={{ color: strength.color }}>
                        {strength.label}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div className="space-y-1.5">
                <label htmlFor="signup-confirm" className="block text-xs font-semibold" style={{ color: '#163A5F' }}>
                  Confirm password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="signup-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    required
                    style={{
                      width: '100%', padding: '10px 40px 10px 38px',
                      fontSize: 14, borderRadius: 10,
                      border: `1px solid ${confirmPassword && confirmPassword !== password ? '#C94F4F' : '#E5E7EB'}`,
                      backgroundColor: '#F5F7F8',
                      color: '#111827', outline: 'none', boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
                    }}
                    onFocus={e => {
                      e.target.style.borderColor     = '#C96C2B';
                      e.target.style.boxShadow       = '0 0 0 3px rgba(201,108,43,0.12)';
                      e.target.style.backgroundColor = '#fff';
                    }}
                    onBlur={e => {
                      const mismatch = e.target.value && e.target.value !== password;
                      e.target.style.borderColor     = mismatch ? '#C94F4F' : '#E5E7EB';
                      e.target.style.boxShadow       = 'none';
                      e.target.style.backgroundColor = e.target.value ? '#fff' : '#F5F7F8';
                    }}
                  />
                  <Lock size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', pointerEvents: 'none' }} />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                    style={eyeBtn}
                    onMouseEnter={e => (e.currentTarget.style.color = '#163A5F')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {/* Match indicator */}
                {confirmPassword && (
                  <p
                    className="text-[10px] mt-1"
                    style={{ color: confirmPassword === password ? '#2F7A5F' : '#C94F4F' }}
                  >
                    {confirmPassword === password ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>

            {/* Plan selector */}
            <div className="space-y-2">
              <p className="text-xs font-semibold" style={{ color: '#163A5F' }}>Choose your plan</p>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map(p => {
                  const selected = plan === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      id={`plan-${p.id}`}
                      onClick={() => setPlan(p.id)}
                      className="flex flex-col items-start p-3 rounded-xl text-left"
                      style={{
                        border: selected ? '1.5px solid #163A5F' : '1px solid #E5E7EB',
                        backgroundColor: selected ? 'rgba(22,58,95,0.04)' : '#fff',
                        cursor: 'pointer',
                        transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: selected ? '0 0 0 3px rgba(22,58,95,0.08)' : 'none',
                      }}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-xs font-bold" style={{ color: selected ? '#163A5F' : '#111827' }}>
                          {p.label}
                        </span>
                        {selected && (
                          <span
                            className="w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: '#163A5F' }}
                          >
                            <Check size={9} color="#fff" strokeWidth={3} />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] leading-tight" style={{ color: '#6B7280' }}>{p.desc}</span>
                      <span
                        className="text-[11px] font-semibold mt-1.5"
                        style={{ color: p.id === 'starter' ? '#2F7A5F' : '#C96C2B' }}
                      >
                        {p.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                id="signup-terms"
                checked={agreedToTerms}
                onChange={e => setAgreedToTerms(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#163A5F', cursor: 'pointer', marginTop: 2, flexShrink: 0 }}
              />
              <span className="text-xs leading-relaxed" style={{ color: '#6B7280' }}>
                I agree to the{' '}
                <a href="#" style={{ color: '#163A5F', fontWeight: 600, textDecoration: 'underline' }}>Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: '#163A5F', fontWeight: 600, textDecoration: 'underline' }}>Privacy Policy</a>
              </span>
            </label>

            {/* Submit CTA */}
            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                backgroundColor: '#163A5F',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                padding: '12px 0',
                borderRadius: 12,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.72 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                letterSpacing: '0.01em',
                boxShadow: '0 2px 10px rgba(22,58,95,0.22)',
                fontFamily: 'inherit',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
              }}
              onMouseEnter={e => {
                if (isLoading || reduced) return;
                e.currentTarget.style.transform       = 'translateY(-2px)';
                e.currentTarget.style.boxShadow       = '0 8px 24px rgba(22,58,95,0.28)';
                e.currentTarget.style.backgroundColor = '#1a4875';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform       = 'translateY(0)';
                e.currentTarget.style.boxShadow       = '0 2px 10px rgba(22,58,95,0.22)';
                e.currentTarget.style.backgroundColor = '#163A5F';
              }}
            >
              {isLoading ? (
                <>
                  <span
                    style={{
                      width: 15, height: 15, borderRadius: '50%',
                      border: '2px solid rgba(255,255,255,0.35)',
                      borderTopColor: '#fff', display: 'inline-block',
                      animation: 'signup-spin 0.7s linear infinite',
                    }}
                  />
                  Creating account…
                </>
              ) : (
                'Create Free Account'
              )}
            </button>
          </form>

          {/* Sign-in link */}
          <p className="text-sm text-center mt-5" style={{ color: '#6B7280' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              id="signin-link"
              style={{ color: '#C96C2B', fontWeight: 600, textDecoration: 'none', transition: 'opacity 0.15s ease' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Log In
            </Link>
          </p>
        </div>

        {/* ════ RIGHT PANEL — ORGANIC SHAPE ════ */}
        <div
          className="hidden lg:block flex-1 relative"
          style={{ backgroundColor: '#163A5F', overflow: 'hidden' }}
        >
          {/* SVG clip-path definition */}
          <svg width="0" height="0" style={{ position: 'absolute', overflow: 'visible' }} aria-hidden="true">
            <defs>
              <clipPath id={ORG_CLIP_ID_SIGNUP} clipPathUnits="objectBoundingBox">
                <path d="M 0.10,0 C 0.10,0 0.04,0.07 0.03,0.17 C 0.01,0.27 0.07,0.35 0.07,0.50 C 0.07,0.65 0.01,0.73 0.03,0.83 C 0.04,0.93 0.10,1.00 0.10,1.00 L 1.00,1.00 L 1.00,0.00 Z" />
              </clipPath>
            </defs>
          </svg>

          {/* Clipped inner panel */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: `url(#${ORG_CLIP_ID_SIGNUP})`,
              WebkitClipPath: `url(#${ORG_CLIP_ID_SIGNUP})`,
            }}
          >
            {/* Fleet image */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "url('/fleet-login.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center 60%',
                filter: 'brightness(0.62) saturate(1.2)',
              }}
              role="img"
              aria-label="Fleet vehicles"
            />

            {/* Top scrim */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(22,58,95,0.92) 0%, rgba(22,58,95,0.35) 45%, rgba(22,58,95,0.10) 100%)' }}
            />
            {/* Bottom scrim */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(0deg, rgba(13,35,58,0.65) 0%, transparent 45%)' }}
            />

            {/* Content */}
            <div
              className="relative z-10 flex flex-col justify-between h-full"
              style={{ padding: 'clamp(36px,4vw,52px)' }}
            >
              {/* Top section */}
              <div style={{ maxWidth: 320 }}>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-5 select-none"
                  style={{
                    backgroundColor: 'rgba(201,108,43,0.22)',
                    border: '1px solid rgba(201,108,43,0.38)',
                    color: 'rgba(255,255,255,0.92)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C96C2B' }} />
                  Trusted by 500+ fleets worldwide
                </div>

                <h2
                  className="font-bold text-white leading-tight"
                  style={{ fontSize: 'clamp(20px, 2.2vw, 30px)', letterSpacing: '-0.025em' }}
                >
                  Everything your fleet needs,
                  <br />
                  in one place.
                </h2>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 300 }}>
                  Route optimization, live tracking, driver management, and analytics — all connected and ready in minutes.
                </p>
              </div>

              {/* Feature list */}
              <div className="flex flex-col gap-2 mb-4">
                {[
                  'Live GPS tracking across all vehicles',
                  'AI-powered route optimization',
                  'Driver performance & safety scoring',
                  'Automated compliance reporting',
                  '24/7 priority support',
                ].map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5"
                    style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13 }}
                  >
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: 'rgba(201,108,43,0.25)', border: '1px solid rgba(201,108,43,0.4)' }}
                    >
                      <Check size={10} color="#C96C2B" strokeWidth={3} />
                    </span>
                    {feat}
                  </div>
                ))}
              </div>

              {/* Testimonial card */}
              <div
                className="rounded-2xl p-4"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.14)',
                }}
              >
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  "TransitOps cut our fuel costs by 18% in the first quarter. The visibility is game-changing."
                </p>
                <div className="flex items-center gap-2.5 mt-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: '#C96C2B' }}
                  >
                    MR
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-none">Marcus Reid</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>Fleet Director, NorthLine Transit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes signup-spin {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </div>
  );
}