import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, LayoutDashboard, LogOut, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../components/ui/basic-dropdown';
import { Switch } from '../components/ui/material-design-3-switch';
import DashboardShowcase from '../components/DashboardShowcase';

const DARK_MODE_KEY = 'transitops-dark';

/**
 * DashboardPage — the protected /dashboard route.
 * Dark mode is scoped to this page's root div (.dark class).
 * Auth guard is handled by ProtectedRoute in App.jsx.
 */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Read persisted dark mode preference
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(DARK_MODE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Persist dark mode preference
  useEffect(() => {
    try {
      localStorage.setItem(DARK_MODE_KEY, String(isDark));
    } catch {}
  }, [isDark]);

  const toggleDark = useCallback(() => setIsDark((d) => !d), []);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className={`min-h-screen bg-background text-text flex flex-col font-sans antialiased${
        isDark ? ' dark theme-transition' : ' theme-transition'
      }`}
    >
      {/* ── Dashboard Top Bar ── */}
      <header className="sticky top-0 z-40 bg-surface border-b border-border shadow-sm">
        <div className="max-w-full px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <span className="text-base font-bold text-primary tracking-tight">TransitOps</span>
            <span className="ml-2 hidden sm:inline text-xs font-semibold text-text-secondary border border-border rounded px-1.5 py-0.5">
              Dashboard
            </span>
          </div>

          {/* Right side — user info + avatar dropdown */}
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs font-medium text-text-secondary">
              {user?.name || 'Fleet Manager'}
            </span>

            <Dropdown align="end">
              <DropdownTrigger>
                <div
                  className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold border-2 border-border cursor-pointer hover:border-primary/40 transition-colors select-none"
                  aria-label="Open profile menu"
                >
                  {user?.initials || 'U'}
                </div>
              </DropdownTrigger>

              <DropdownContent>
                {/* User info */}
                <div className="px-3 py-2 mb-1">
                  <p className="text-xs font-semibold text-[#111827] dark:text-[#F5F7F8] truncate">
                    {user?.name || 'Fleet Manager'}
                  </p>
                  <p className="text-[11px] text-[#6B7280]">Fleet Administrator</p>
                </div>
                <DropdownSeparator />

                {/* Dashboard link */}
                <DropdownItem
                  icon={<LayoutDashboard className="w-4 h-4" />}
                  onClick={() => {}} // already on dashboard
                >
                  Dashboard
                </DropdownItem>

                {/* Dark mode toggle row — inline Switch */}
                <DropdownItem
                  icon={<Moon className="w-4 h-4" />}
                  asRow
                  className="justify-between"
                >
                  <span className="flex-1">Dark mode</span>
                  <Switch
                    size="sm"
                    checked={isDark}
                    onCheckedChange={toggleDark}
                    haptic="light"
                    aria-label="Toggle dark mode"
                  />
                </DropdownItem>

                <DropdownSeparator />

                {/* Sign out */}
                <DropdownItem
                  icon={<LogOut className="w-4 h-4" />}
                  destructive
                  onClick={handleSignOut}
                >
                  Sign Out
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 p-6 max-w-full overflow-x-hidden">
        <DashboardShowcase isDark={isDark} />
      </main>
    </div>
  );
}
#DASHBOARD,HOMEPAGE AND LOGINPAGE IS WORKING FINE.