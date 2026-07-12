import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Truck, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a protected route, go back there after login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    // Simulate async auth (replace with real API call)
    await new Promise((r) => setTimeout(r, 800));

    // Extract name from email for initials
    const name = email.split('@')[0].replace(/[._-]/g, ' ')
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    login({ name });
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans antialiased">
      {/* Top bar */}
      <header className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2 group" aria-label="Back to homepage">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-95">
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-primary tracking-tight">TransitOps</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
      </header>

      {/* Main login card */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-custom border border-border shadow-sm p-8 space-y-6">
            {/* Heading */}
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-primary tracking-tight">Welcome back</h1>
              <p className="text-sm text-text-secondary">
                Sign in to your TransitOps fleet console.
              </p>
            </div>

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
                Demo mode — any email + password will work.
                <br />
                <span className="font-semibold text-primary">
                  Try: demo@transitops.com / fleet123
                </span>
              </p>
            </div>
          </div>

          {/* Back link */}
          <p className="text-center text-xs text-text-secondary mt-6">
            Don't have an account?{' '}
            <Link to="/#cta" className="font-semibold text-primary hover:underline">
              Request access
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
