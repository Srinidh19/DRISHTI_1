import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Compass,
  AlertTriangle,
  Video,
  Activity,
  Shield,
  FileCheck2,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { useRealtime } from '../../context/RealtimeContext';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const { incidents, shieldFaults } = useRealtime();

  const activeIncidentsCount = incidents.filter(
    i => i.status === 'NEW' || i.status === 'CONFIRMED' || i.status === 'ESCALATED'
  ).length;

  const activeFaultsCount = shieldFaults.length;

  const isSurveillanceActive = location.pathname.startsWith('/app/surveillance');
  const isSwanActive = location.pathname.startsWith('/app/swan');
  const isShieldActive = location.pathname.startsWith('/app/shield');
  const isEvidenceActive = location.pathname.startsWith('/app/evidence');
  const isAdminActive = location.pathname.startsWith('/app/admin');

  const navContent = (onItemClick?: () => void) => (
    <>
      <div className="py-2.5 px-2 space-y-1">
        {/* COMMAND */}
        <NavLink
          to="/app/command"
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-1.5 rounded transition-colors ${
              isActive
                ? 'bg-surface-3 text-white border-l-2 border-info font-medium'
                : 'text-text-muted hover:bg-surface-2 hover:text-text'
            }`
          }
        >
          <Compass className="w-4 h-4 shrink-0 text-info" />
          <span className="tracking-wide">COMMAND</span>
        </NavLink>

        {/* INCIDENTS */}
        <NavLink
          to="/app/incidents"
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center justify-between px-2.5 py-1.5 rounded transition-colors ${
              isActive
                ? 'bg-surface-3 text-white border-l-2 border-critical font-medium'
                : 'text-text-muted hover:bg-surface-2 hover:text-text'
            }`
          }
        >
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 text-critical" />
            <span className="tracking-wide">INCIDENTS</span>
          </div>
          {activeIncidentsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded bg-critical-bg text-critical-text border border-critical-border text-2xs font-semibold">
              {activeIncidentsCount}
            </span>
          )}
        </NavLink>

        {/* SURVEILLANCE GROUP */}
        <div className="pt-2">
          <div className="flex items-center gap-2 px-2.5 py-1 text-2xs font-semibold text-text-dim uppercase tracking-wider">
            <Video className="w-3.5 h-3.5" />
            <span>Surveillance</span>
          </div>
          <div className="pl-4 space-y-0.5 mt-0.5">
            <NavLink
              to="/app/surveillance/cameras"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Camera Network
            </NavLink>
            <NavLink
              to="/app/surveillance/live"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Live Wall
            </NavLink>
            <NavLink
              to="/app/surveillance/tracks"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Tracks
            </NavLink>
          </div>
        </div>

        {/* SWAN GROUP */}
        <div className="pt-2">
          <div className="flex items-center gap-2 px-2.5 py-1 text-2xs font-semibold text-text-dim uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-info" />
            <span>SWAN</span>
          </div>
          <div className="pl-4 space-y-0.5 mt-0.5">
            <NavLink
              to="/app/swan/overview"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive || location.pathname === '/app/swan' ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/app/swan/tracks"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Active Tracks
            </NavLink>
            <NavLink
              to="/app/swan/coordination"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Coordination
            </NavLink>
          </div>
        </div>

        {/* SHIELD GROUP */}
        <div className="pt-2">
          <div className="flex items-center justify-between px-2.5 py-1 text-2xs font-semibold text-text-dim uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-success" />
              <span>SHIELD</span>
            </div>
            {activeFaultsCount > 0 && (
              <span className="px-1 py-0.2 rounded bg-warning-bg text-warning-text border border-warning-border text-2xs font-semibold">
                {activeFaultsCount}
              </span>
            )}
          </div>
          <div className="pl-4 space-y-0.5 mt-0.5">
            <NavLink
              to="/app/shield/overview"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive || location.pathname === '/app/shield' ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/app/shield/faults"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Faults
            </NavLink>
            <NavLink
              to="/app/shield/coverage"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Coverage
            </NavLink>
            <NavLink
              to="/app/shield/recovery"
              onClick={onItemClick}
              className={({ isActive }) =>
                `block px-2.5 py-1 rounded transition-colors ${
                  isActive ? 'bg-surface-3 text-white font-medium' : 'text-text-muted hover:bg-surface-2 hover:text-text'
                }`
              }
            >
              Recovery
            </NavLink>
          </div>
        </div>

        {/* EVIDENCE */}
        <div className="pt-2">
          <NavLink
            to="/app/evidence"
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded transition-colors ${
                isActive
                  ? 'bg-surface-3 text-white border-l-2 border-text font-medium'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text'
              }`
            }
          >
            <FileCheck2 className="w-4 h-4 shrink-0 text-text-muted" />
            <span className="tracking-wide">EVIDENCE</span>
          </NavLink>
        </div>

        {/* ANALYTICS */}
        <div>
          <NavLink
            to="/app/analytics"
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded transition-colors ${
                isActive
                  ? 'bg-surface-3 text-white border-l-2 border-text font-medium'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text'
              }`
            }
          >
            <BarChart3 className="w-4 h-4 shrink-0 text-text-muted" />
            <span className="tracking-wide">ANALYTICS</span>
          </NavLink>
        </div>

        {/* ADMIN */}
        <div className="pt-2 border-t border-border mt-2">
          <NavLink
            to="/app/admin/users"
            onClick={onItemClick}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-1.5 rounded transition-colors ${
                isActive || isAdminActive
                  ? 'bg-surface-3 text-white border-l-2 border-text font-medium'
                  : 'text-text-muted hover:bg-surface-2 hover:text-text'
              }`
            }
          >
            <Settings className="w-4 h-4 shrink-0 text-text-muted" />
            <span className="tracking-wide">ADMIN</span>
          </NavLink>
        </div>
      </div>

      {/* Operator Doctrine Footer */}
      <div className="p-2.5 bg-surface-2 border-t border-border text-[9px] text-text-dim leading-tight">
        <p className="font-semibold text-text-muted mb-0.5">DRISHTI DOCTRINE</p>
        <p>Detect locally → verify through multiple signals → correlate → assess risk → preserve evidence → human operator decides.</p>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar (Unchanged w-56) */}
      <aside className="w-56 bg-surface border-r border-border hidden md:flex flex-col justify-between select-none shrink-0 font-mono text-xs overflow-y-auto">
        {navContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-xs transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 max-w-[80vw] bg-surface border-r border-border z-50 flex flex-col justify-between select-none font-mono text-xs overflow-y-auto md:hidden transform transition-transform duration-200 ease-in-out shadow-2xl ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b border-border flex items-center justify-between bg-surface-2">
          <div className="flex items-center gap-2 font-bold text-xs tracking-wider text-text">
            <span>DRISHTI C4I CONSOLE</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-text-muted hover:text-text hover:bg-surface-3 transition-colors"
            title="Close Menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {navContent(onCloseMobile)}
      </aside>
    </>
  );
};

