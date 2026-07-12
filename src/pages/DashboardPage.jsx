import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, LayoutDashboard, LogOut, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
} from '../components/ui/basic-dropdown';
import DashboardShowcase from '../components/DashboardShowcase';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen animate-colorful-mesh text-text flex flex-col font-sans antialiased relative">
      
      {/* Decorative Orbs */}
      <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Dashboard Top Bar ── */}
      <header className="sticky top-4 z-40 px-6 mx-auto w-[98%] max-w-7xl glass-panel-light rounded-full border border-white/50 shadow-sm flex items-center justify-between h-16 mt-4">
        {/* Logo */}
        <div className="flex items-center gap-3" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-[#163A5F] flex items-center justify-center text-white shadow-md">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">TransitOps</span>
          <span className="ml-2 hidden md:inline text-xs font-bold text-accent bg-accent/10 rounded-full px-3 py-1">
            Console
          </span>
        </div>

        {/* Right side — user info + avatar dropdown */}
        <div className="flex items-center gap-4">
          <span className="hidden sm:block text-sm font-semibold text-[#334155]">
            {user?.name || 'Fleet Manager'}
          </span>

          <Dropdown align="end">
            <DropdownTrigger>
              <div
                className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary text-sm font-bold border-2 border-white/80 shadow-md cursor-pointer hover:border-accent transition-colors select-none hover:scale-105"
                aria-label="Open profile menu"
              >
                {user?.initials || 'U'}
              </div>
            </DropdownTrigger>

            <DropdownContent>
              {/* User info */}
              <div className="px-3 py-2 mb-1">
                <p className="text-sm font-bold text-primary truncate">
                  {user?.name || 'Fleet Manager'}
                </p>
                <p className="text-[11px] font-medium text-[#64748B]">Administrator</p>
              </div>
              <DropdownSeparator />

              {/* Dashboard link */}
              <DropdownItem
                icon={<LayoutDashboard className="w-4 h-4" />}
                onClick={() => {}} // already on dashboard
              >
                Dashboard
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
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto w-full relative z-10">
        <DashboardShowcase />
      </main>
    </div>
  );
}
