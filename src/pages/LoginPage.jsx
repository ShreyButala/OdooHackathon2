import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Truck, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

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

  return (
    <div className="min-h-screen flex flex-col font-sans antialiased animate-colorful-mesh relative overflow-hidden text-text">
      
      {/* Decorative background elements (optional to enhance the mesh) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-overlay" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/20 rounded-full blur-[150px] pointer-events-none mix-blend-overlay" />

      {/* Top bar */}
      <header className="w-full px-6 py-6 flex items-center justify-between max-w-7xl mx-auto relative z-10">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Back to homepage">
          <div className="w-10 h-10 rounded-xl bg-white/40 backdrop-blur-md border border-white/60 flex items-center justify-center text-primary transition-all duration-300 group-hover:scale-105 shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xl font-black text-primary tracking-tight">TransitOps</span>
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-primary transition-colors py-2 px-4 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur-sm border border-white/40 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to site
        </Link>
      </header>

      {/* Main login area */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <motion.div 
          className="w-full max-w-[420px]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Light Glass Card */}
          <div className="glass-panel-light rounded-[32px] p-8 sm:p-10 relative overflow-hidden shadow-2xl border border-white/60">
            {/* Inner subtle glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 rounded-full blur-[60px] pointer-events-none" />

            <motion.div variants={itemVariants} className="space-y-2 mb-8 relative z-10">
              <h1 className="text-3xl font-black text-primary tracking-tight">Welcome back</h1>
              <p className="text-sm font-medium text-[#64748B]">
                Sign in to your intelligent fleet console.
              </p>
            </motion.div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-3 bg-danger/10 border border-danger/20 rounded-xl px-4 py-3.5 text-sm text-danger backdrop-blur-md shadow-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="font-bold leading-relaxed">{error}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10" noValidate>
              {/* Email */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="login-email"
                  className="block text-[13px] font-bold text-primary"
                >
                  Email Address
                </label>
                <div className="relative rounded-xl transition-all shadow-inner bg-white/50 border border-white/60">
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="manager@transitops.com"
                    className="w-full px-4 py-3.5 text-sm bg-transparent placeholder:text-[#94A3B8] font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl transition-all"
                    required
                  />
                </div>
              </motion.div>

              {/* Password */}
              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="login-password"
                    className="block text-[13px] font-bold text-primary"
                  >
                    Password
                  </label>
                  <a href="#" className="text-xs text-accent hover:text-accent/80 transition-colors font-bold">
                    Forgot password?
                  </a>
                </div>
                <div className="relative rounded-xl transition-all shadow-inner bg-white/50 border border-white/60">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 pr-12 text-sm bg-transparent placeholder:text-[#94A3B8] font-medium text-primary focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-xl transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-primary transition-colors p-1.5 rounded-md hover:bg-white/50"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </motion.div>

              {/* Submit */}
              <motion.div variants={itemVariants} className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-white text-[15px] font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:bg-primary/95 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:-translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Authenticating…
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </motion.div>
            </form>

            {/* Demo hint */}
            <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#E2E8F0] relative z-10">
              <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-sm text-center">
                <span className="block font-bold text-primary mb-2 text-xs uppercase tracking-wider">Demo Accounts</span>
                <p className="text-xs text-[#64748B] font-medium leading-relaxed">
                  manager_trips2@example.com <br />
                  dispatch2@example.com <br />
                  finance@example.com <br />
                  <span className="inline-block mt-3 px-3 py-1 bg-white/80 rounded-md border border-[#E2E8F0] font-bold text-primary">
                    Password: <span className="text-accent">Password123</span>
                  </span>
                </p>
              </div>
            </motion.div>
          </div>

          {/* Back link */}
          <motion.p variants={itemVariants} className="text-center text-sm font-medium text-[#64748B] mt-8 bg-white/40 backdrop-blur-md py-3 rounded-full border border-white/50 shadow-sm max-w-xs mx-auto">
            Don't have an account?{' '}
            <Link to="/#cta" className="font-bold text-primary hover:text-accent transition-colors">
              Request access
            </Link>
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
