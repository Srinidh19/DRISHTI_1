import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { UserRole } from '../types';
import {
  Settings,
  Users,
  Video,
  MapPin,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck
} from 'lucide-react';

export const AdminScreen: React.FC = () => {
  const location = useLocation();
  const {
    users,
    currentUser,
    setCurrentUserRole,
    cameras,
    virtualFences,
    restrictedZones
  } = useRealtime();

  let activeSubTab: 'users' | 'cameras' | 'zones' | 'audit' = 'users';
  if (location.pathname.endsWith('/cameras')) activeSubTab = 'cameras';
  else if (location.pathname.endsWith('/zones')) activeSubTab = 'zones';
  else if (location.pathname.endsWith('/audit')) activeSubTab = 'audit';

  const isOperator = currentUser.role === 'OPERATOR';
  const isSupervisor = currentUser.role === 'SUPERVISOR';
  const isAdmin = currentUser.role === 'ADMIN';

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-y-auto select-none">
      {/* Top Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-text-muted" />
          <h1 className="text-sm font-bold text-text uppercase tracking-wider">
            System Administration & Security Governance
          </h1>
          <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs text-text-muted">
            Station: BOP-17 Ops Command
          </span>
        </div>

        {/* Subroutes Navigation */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded border border-border text-2xs overflow-x-auto max-w-full">
          <Link
            to="/app/admin/users"
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'users'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            USERS & ROLES
          </Link>
          <Link
            to="/app/admin/cameras"
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'cameras'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            CAMERA CONFIG
          </Link>
          <Link
            to="/app/admin/zones"
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'zones'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            ZONES & FENCES
          </Link>
          <Link
            to="/app/admin/audit"
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
              activeSubTab === 'audit'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            SYSTEM AUDIT
          </Link>
        </div>
      </div>

      {/* Role Permission Banner */}
      <div className="p-2.5 bg-surface-2 border-b border-border flex flex-wrap items-center justify-between gap-2 text-2xs">
        <div className="flex items-center gap-2">
          <UserCheck className="w-3.5 h-3.5 text-info" />
          <span>
            Active Operator Session: <strong className="text-text">{currentUser.id}</strong> (
            {currentUser.name})
          </span>
          <span className="px-1.5 py-0.2 rounded bg-surface border border-border text-info uppercase font-semibold">
            {currentUser.role}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-text-dim">Simulate Role:</span>
          {(['OPERATOR', 'SUPERVISOR', 'ADMIN'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setCurrentUserRole(role)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                currentUser.role === role
                  ? 'bg-info text-white border-info font-bold'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Warning if role has restricted privileges */}
      {isOperator && activeSubTab !== 'users' && (
        <div className="m-3 p-3 rounded bg-warning-bg border border-warning-border text-warning-text flex items-center gap-2 text-2xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>
            <strong>Read-Only Notice:</strong> Operator role (OP-042) cannot modify system configuration or zone geofences. Elevated permissions (Supervisor or Admin) required for editing.
          </span>
        </div>
      )}

      {/* Main Container */}
      <div className="p-4 space-y-4">
        {/* USERS SUBVIEW */}
        {activeSubTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded overflow-hidden">
              <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
                <span className="font-bold text-text uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-text-muted" />
                  <span>Authorized Personnel & Duty Stations</span>
                </span>
                <span className="text-2xs text-text-dim">3 Active Officers</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left font-mono">
                  <thead className="bg-surface border-b border-border text-2xs text-text-dim uppercase">
                    <tr>
                      <th className="py-2.5 px-3">Callsign / ID</th>
                      <th className="py-2.5 px-3">Officer Name</th>
                      <th className="py-2.5 px-3">Operational Role</th>
                      <th className="py-2.5 px-3">Badge Number</th>
                      <th className="py-2.5 px-3">Duty Station</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-surface-2">
                        <td className="py-2.5 px-3 font-bold text-text">{u.id}</td>
                        <td className="py-2.5 px-3 text-text font-semibold">{u.name}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-2xs font-bold ${
                              u.role === 'ADMIN'
                                ? 'bg-critical-bg text-critical-text border border-critical-border'
                                : u.role === 'SUPERVISOR'
                                ? 'bg-warning-bg text-warning-text border border-warning-border'
                                : 'bg-info-bg text-info-text border border-info-border'
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-text-muted">{u.badgeNumber}</td>
                        <td className="py-2.5 px-3 text-text-muted">{u.station}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-success flex items-center gap-1 text-2xs font-semibold">
                            <span>●</span>
                            <span>{u.status}</span>
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-text-dim whitespace-nowrap">{u.lastLogin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Role Privilege Matrix */}
            <div className="bg-surface border border-border rounded p-3">
              <div className="font-bold text-text uppercase text-2xs mb-2">
                Operational Role Privilege Matrix
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-2xs">
                <div className="p-2.5 rounded bg-surface-2 border border-border space-y-1.5">
                  <div className="font-bold text-info">OPERATOR (OP-042)</div>
                  <ul className="text-text-muted space-y-1 pl-3 list-disc">
                    <li>View live cameras & wall</li>
                    <li>Inspect incoming incidents</li>
                    <li>Confirm intrusions</li>
                    <li>Dismiss false positives</li>
                    <li>Annotate operational SITREP</li>
                  </ul>
                </div>
                <div className="p-2.5 rounded bg-surface-2 border border-border space-y-1.5">
                  <div className="font-bold text-warning">SUPERVISOR (SUP-011)</div>
                  <ul className="text-text-muted space-y-1 pl-3 list-disc">
                    <li>All Operator privileges</li>
                    <li>Escalate to Sector High Command</li>
                    <li>Assign incidents to officers</li>
                    <li>Export forensic evidence packages</li>
                    <li>Dispatch technical work orders</li>
                  </ul>
                </div>
                <div className="p-2.5 rounded bg-surface-2 border border-border space-y-1.5">
                  <div className="font-bold text-critical">ADMIN (ADM-001)</div>
                  <ul className="text-text-muted space-y-1 pl-3 list-disc">
                    <li>Full operational authority</li>
                    <li>User role management</li>
                    <li>Camera network configuration</li>
                    <li>Virtual fence & zone geofencing</li>
                    <li>Complete system audit log access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMERAS SUBVIEW */}
        {activeSubTab === 'cameras' && (
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-bold text-text uppercase text-2xs">
                  Camera Hardware & Stream Settings
                </span>
                <span className="text-2xs text-text-dim">RTSP Stream Gateways</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {cameras.slice(0, 4).map(cam => (
                  <div
                    key={cam.id}
                    className="p-2.5 rounded bg-surface-2 border border-border flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-text">{cam.name}</div>
                      <div className="text-2xs text-text-muted">{cam.location} • {cam.type}</div>
                      <div className="text-[10px] text-text-dim mt-0.5">
                        rtsp://10.14.82.10:554/live/{cam.id.toLowerCase()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-2xs px-1.5 py-0.5 rounded bg-surface border border-border text-text">
                        {cam.resolution}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ZONES SUBVIEW */}
        {activeSubTab === 'zones' && (
          <div className="space-y-4">
            <div className="bg-surface border border-border rounded p-3 space-y-2">
              <div className="font-bold text-text uppercase text-2xs mb-2">
                Active Geofences & Restricted Polygons
              </div>
              <div className="space-y-2">
                {virtualFences.map(f => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded bg-surface-2 border border-border flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-text">{f.name}</div>
                      <div className="text-2xs text-text-dim">{f.sector}</div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-2xs font-bold ${
                        f.status === 'BREACHED'
                          ? 'bg-critical-bg text-critical-text border border-critical-border'
                          : 'bg-success-bg text-success-text border border-success-border'
                      }`}
                    >
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* AUDIT SUBVIEW */}
        {activeSubTab === 'audit' && (
          <div className="bg-surface border border-border rounded p-3 space-y-2">
            <div className="font-bold text-text uppercase text-2xs mb-2">
              Immutable C4I Security Audit Log
            </div>
            <div className="space-y-2">
              {[
                { time: '02:18:42 IST', actor: 'SYSTEM (SHIELD)', action: 'FAULT_DETECTED', details: 'Lens obstruction classified on CAM-03 (confidence 0.94)' },
                { time: '02:15:10 IST', actor: 'OP-042', action: 'INCIDENT_CONFIRMED', details: 'Incident INC-2026-0142 confirmed by operator' },
                { time: '02:14:18 IST', actor: 'SYSTEM (SWAN)', action: 'HANDOFF_CONFIRMED', details: 'Track T-104 target handoff verified at CAM-04' },
                { time: '02:14:06 IST', actor: 'SYSTEM (YOLO)', action: 'FENCE_BREACH', details: 'Perimeter Virtual Fence Alpha breach detected' }
              ].map((log, i) => (
                <div
                  key={i}
                  className="p-2 rounded bg-surface-2 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-2xs"
                >
                  <div>
                    <span className="font-bold text-text">[{log.action}]</span>{' '}
                    <span className="text-text-muted">{log.details}</span>
                  </div>
                  <div className="text-left sm:text-right text-text-dim whitespace-nowrap sm:ml-4">
                    <span>{log.actor}</span> • <span>{log.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
