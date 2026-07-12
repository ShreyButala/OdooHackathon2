import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Truck, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from './ui/basic-dropdown';

/**
 * Shared public navbar — used on the homepage (/).
 * Reads from AuthContext (single source of truth).
 * Logged-out: Login + Get Started buttons.
 * Logged-in: circular avatar with initials + profile dropdown.
 */
export default function Navbar({ isScrolled, isAnnounceOpen }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <nav
      className={`sticky ${isAnnounceOpen ? 'top-8' : 'top-0'} z-40 transition-all duration-300 w-full border-b ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-border/80 shadow-sm'
          : 'bg-white/50 backdrop-blur-none border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" aria-label="TransitOps Home">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white transition-transform duration-200 group-hover:scale-95">
            <Truck className="w-4 h-4" />
          </div>
          <span className="text-lg font-bold text-primary font-sans tracking-tight">TransitOps</span>
        </Link>

        {/* Links Center */}
        <div className="hidden lg:flex items-center gap-8">
          <a href="/#features" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Features</a>
          <a href="/#workflow" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Solutions</a>
          <a href="/#dashboard-preview" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Dashboard</a>
          <a href="/#why-transitops" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">About</a>
          <a href="/#cta" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Contact</a>
        </div>

        {/* Actions Right */}
        <div className="hidden sm:flex items-center gap-4">
          {isLoggedIn ? (
            <Dropdown align="end">
              <DropdownTrigger>
                {/* Avatar circle — 36px, navy bg, white initials */}
                <div
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border-2 border-border cursor-pointer hover:border-primary/40 transition-colors select-none"
                  aria-label="Open profile menu"
                >
                  {user?.initials || 'U'}
                </div>
              </DropdownTrigger>
              <DropdownContent>
                {/* User info row */}
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs font-semibold text-[#111827] truncate">{user?.name || 'Fleet Manager'}</p>
                  <p className="text-[11px] text-[#6B7280]">Fleet Administrator</p>
                </div>
                <DropdownSeparator />
                <DropdownItem
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem
                  icon={<LogOut className="w-4 h-4" />}
                  destructive
                  onClick={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors px-4 py-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                to="/login"
                className="text-sm font-semibold bg-primary text-white hover:bg-primary/95 transition-all px-4 py-2 rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] hover:shadow-md"
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
          className="lg:hidden p-2 text-primary hover:bg-[#F5F7F8] rounded-lg transition-colors"
          aria-label="Toggle mobile menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white p-6 space-y-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <a href="/#features" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary py-2 border-b border-border/50">Features</a>
            <a href="/#workflow" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary py-2 border-b border-border/50">Solutions</a>
            <a href="/#dashboard-preview" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary py-2 border-b border-border/50">Dashboard</a>
            <a href="/#why-transitops" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary py-2 border-b border-border/50">About</a>
            <a href="/#cta" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-semibold text-text-secondary py-2 border-b border-border/50">Contact</a>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            {isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                  className="text-sm font-semibold text-primary border border-border w-full py-2.5 rounded-lg hover:bg-background flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </button>
                <button
                  type="button"
                  onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                  className="text-sm font-semibold text-[#C94F4F] border border-[#C94F4F]/30 w-full py-2.5 rounded-lg hover:bg-[#C94F4F]/5"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold text-primary border border-border w-full py-2.5 rounded-lg hover:bg-background text-center"
                >
                  Login
                </Link>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-sm font-semibold bg-primary text-white w-full py-2.5 rounded-lg text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
