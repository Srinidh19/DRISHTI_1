import React, { useState, useEffect } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { Radio, User as UserIcon, Menu } from 'lucide-react';

interface TopBarProps {
  onToggleMobileMenu?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu }) => {
  const { systemStatus, currentUser, setCurrentUserRole, users, cameras } = useRealtime();
  const [istTime, setIstTime] = useState<string>('16:40:00 IST');
  const [showRoleMenu, setShowRoleMenu] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setIstTime(`${new Intl.DateTimeFormat('en-GB', options).format(now)} IST`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const onlineCams = cameras.filter(c => c.health === 'ONLINE').length;
  const totalCams = cameras.length;

  return (
    <header className="h-11 bg-surface border-b border-border px-2 sm:px-3 flex items-center justify-between select-none z-30 shrink-0 font-mono text-xs">
      {/* Brand & Sector Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Nav Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-1 rounded bg-surface-2 hover:bg-surface-3 border border-border text-text-muted hover:text-text transition-colors"
          title="Open Navigation Menu"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-4 h-4 text-info" />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-5 h-5 bg-surface-2 border border-border flex items-center justify-center rounded">
            <Radio className="w-3 h-3 text-info" />
          </div>
          <span className="font-bold text-sm tracking-wider text-text">
            DRISHTI
          </span>
        </div>

        <div className="h-3.5 w-px bg-border mx-0.5 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <span className="px-1.5 sm:px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs font-semibold text-text tracking-wide uppercase">
            <span className="hidden sm:inline">{systemStatus.sector || 'NORTH SECTOR'} / </span>{systemStatus.bopCode || 'BOP-17'}
          </span>
          <span className="hidden lg:inline-flex px-1.5 py-0.5 rounded bg-surface-2 border border-border/60 text-[9px] font-mono text-text-dim tracking-wider" title="Production Build Release">
            BUILD 2026.09.1-PROD
          </span>
        </div>
      </div>

      {/* Core Operational Status */}
      {/* Full Desktop / Tablet Status Bar */}
      <div className="hidden md:flex items-center gap-2 text-2xs">
        {/* SYSTEM STATUS */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-2 border border-border">
          <span className="text-text-muted">SYSTEM</span>
          <span className="text-success text-[10px]">●</span>
        </div>

        {/* SWAN STATUS */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-2 border border-border">
          <span className="text-text-muted">SWAN</span>
          <span className="text-info text-[10px]">●</span>
        </div>

        {/* SHIELD STATUS */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-2 border border-border">
          <span className="text-text-muted">SHIELD</span>
          <span className="text-success text-[10px]">●</span>
        </div>

        {/* CAMERA ONLINE COUNTER */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-2 border border-border">
          <span className="text-text-muted">CAM</span>
          <span className="font-semibold text-text">
            {onlineCams}/{totalCams}
          </span>
        </div>
      </div>

      {/* Mobile Condensed Status Indicator */}
      <div className="flex md:hidden items-center gap-1.5 px-1.5 py-0.5 rounded bg-surface-2 border border-border text-2xs">
        <span className="text-success text-[8px]" title="System & SHIELD Operational">●</span>
        <span className="text-info text-[8px]" title="SWAN Active">●</span>
        <span className="font-semibold text-text text-[10px]">{onlineCams}/{totalCams}</span>
      </div>

      {/* Clock & Operator Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* IST Clock */}
        <div className="text-2xs font-semibold text-text px-1.5 sm:px-2 py-0.5 bg-surface-2 border border-border rounded whitespace-nowrap">
          <span className="hidden sm:inline">{istTime}</span>
          <span className="sm:hidden">{istTime.replace(' IST', '')}</span>
        </div>

        {/* Operator Badge & Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded bg-surface-2 hover:bg-surface-3 border border-border transition-colors text-2xs"
            title="Switch operational role"
          >
            <UserIcon className="w-3 h-3 text-text-muted" />
            <span className="font-semibold text-text hidden sm:inline">{currentUser.id}</span>
            <span className="text-[10px] text-text-dim uppercase hidden sm:inline">[{currentUser.role}]</span>
            <span className="font-semibold text-text sm:hidden">{currentUser.id.replace('BSF-', '').replace('TECH-', '')}</span>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-surface-2 border border-border rounded shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1 text-2xs text-text-muted border-b border-border uppercase tracking-wider">
                Operator Station Switcher
              </div>
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    setCurrentUserRole(u.role);
                    setShowRoleMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-surface-3 transition-colors ${
                    currentUser.id === u.id ? 'bg-surface-3 text-text font-semibold' : 'text-text-muted'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-text">{u.id} — {u.name}</span>
                    <span className="text-2xs text-text-dim">{u.station}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface border border-border">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
