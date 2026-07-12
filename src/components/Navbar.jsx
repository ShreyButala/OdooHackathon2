import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from './ui/basic-dropdown';

export default function Navbar({ isScrolled, isAnnounceOpen }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`fixed ${isAnnounceOpen ? 'top-10' : 'top-4'} left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-7xl rounded-full ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-2'
          : 'bg-transparent border-transparent py-4'
      }`}
    >
      <div className="px-6 h-12 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" aria-label="TransitOps Home">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
            isScrolled ? 'bg-primary text-white shadow-md' : 'bg-primary/10 text-primary backdrop-blur-md'
          }`}>
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-primary font-sans tracking-tight">TransitOps</span>
        </Link>

        {/* Links Center */}
        <div className="hidden lg:flex items-center gap-8 px-8 py-2 rounded-full bg-white/30 backdrop-blur-md border border-white/40 shadow-inner">
          <a href="/#features" className="text-sm font-semibold text-[#334155] hover:text-primary transition-colors">Features</a>
          <a href="/#workflow" className="text-sm font-semibold text-[#334155] hover:text-primary transition-colors">Solutions</a>
          <a href="/#dashboard-preview" className="text-sm font-semibold text-[#334155] hover:text-primary transition-colors">Dashboard</a>
          <a href="/#why-transitops" className="text-sm font-semibold text-[#334155] hover:text-primary transition-colors">About</a>
        </div>

        {/* Actions Right */}
        <div className="hidden sm:flex items-center gap-4">
          {isLoggedIn ? (
            <Dropdown align="end">
              <DropdownTrigger>
                <div
                  className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border-2 border-white/80 shadow-sm cursor-pointer hover:border-primary/40 transition-colors select-none group-hover:scale-105"
                  aria-label="Open profile menu"
                >
                  {user?.initials || 'U'}
                </div>
              </DropdownTrigger>
              <DropdownContent>
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs font-semibold text-primary truncate">{user?.name || 'Fleet Manager'}</p>
                  <p className="text-[11px] text-text-secondary">Fleet Administrator</p>
                </div>
                <DropdownSeparator />
                <DropdownItem icon={<LayoutDashboard className="w-4 h-4" />} onClick={() => navigate('/dashboard')}>
                  Dashboard
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<LogOut className="w-4 h-4" />} destructive onClick={handleSignOut}>
                  Sign Out
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-[#334155] hover:text-primary transition-colors px-4 py-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold bg-gradient-to-r from-primary to-[#163A5F] text-white hover:shadow-lg transition-all px-5 py-2.5 rounded-full hover:scale-[1.02] active:scale-[0.98]"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-primary hover:bg-white/50 rounded-xl transition-colors backdrop-blur-sm"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden absolute top-[110%] left-0 w-full glass-panel-light rounded-3xl p-6 space-y-4"
          >
            <div className="flex flex-col gap-3">
              <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-[#334155] py-2 border-b border-white/50">Features</a>
              <a href="/#workflow" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-[#334155] py-2 border-b border-white/50">Solutions</a>
              <a href="/#dashboard-preview" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-[#334155] py-2 border-b border-white/50">Dashboard</a>
              <a href="/#why-transitops" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-[#334155] py-2 border-b border-white/50">About</a>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              {isLoggedIn ? (
                <>
                  <button onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="text-sm font-semibold text-primary bg-white/50 border border-white/80 w-full py-3 rounded-xl flex items-center justify-center gap-2">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                  <button onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }} className="text-sm font-semibold text-[#C94F4F] bg-red-50/50 border border-[#C94F4F]/20 w-full py-3 rounded-xl">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-primary bg-white/50 border border-white/80 w-full py-3 rounded-xl text-center">
                    Login
                  </Link>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold bg-primary text-white w-full py-3 rounded-xl text-center shadow-md">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
