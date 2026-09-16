import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { UserRole } from '../types';
import { Radio, Shield, Lock, UserCheck, AlertTriangle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentUserRole, users } = useRealtime();
  const [selectedRole, setSelectedRole] = useState<UserRole>('OPERATOR');
  const [stationCode] = useState<string>('BOP-17-CONSOLE-01');
  const [badgeCode, setBadgeCode] = useState<string>('BSF-OP-9482');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'OPERATOR') setBadgeCode('BSF-OP-9482');
    else if (role === 'SUPERVISOR') setBadgeCode('BSF-SUP-2018');
    else if (role === 'ADMIN') setBadgeCode('TECH-SYS-0012');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUserRole(selectedRole);
    navigate('/app/command');
  };

  return (
    <div className="min-h-screen w-screen bg-bg flex flex-col justify-between p-6 select-none font-mono text-xs text-text">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-surface-2 border border-border flex items-center justify-center rounded">
            <Radio className="w-3.5 h-3.5 text-text" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-wider text-text">IBVAP</span>
            <span className="text-[10px] text-text-dim block">
              INTELLIGENT BORDER VIDEO ANALYTICS PLATFORM
            </span>
          </div>
        </div>
        <div className="text-2xs text-text-dim">
          NORTH SECTOR / BOP-17 • RESTRICTED ACCESS WORKSTATION
        </div>
      </div>

      {/* Center Login Terminal */}
      <div className="w-full max-w-md mx-auto bg-surface border border-border rounded shadow-2xl p-6 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-info">
            <Shield className="w-4 h-4" />
            <span className="font-bold uppercase tracking-wider text-xs">
              Operator Terminal Authentication
            </span>
          </div>
          <p className="text-2xs text-text-dim">
            Official operational console for Border Outpost 17 surveillance.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Station Identifier (Read-only) */}
          <div className="space-y-1">
            <label className="text-2xs text-text-dim uppercase">Active Workstation Terminal</label>
            <input
              type="text"
              value={stationCode}
              readOnly
              className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-xs text-text-muted focus:outline-none"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-2xs text-text-dim uppercase">Select Operational Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['OPERATOR', 'SUPERVISOR', 'ADMIN'] as UserRole[]).map(role => (
                <button
                  type="button"
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`py-2 px-1 rounded border text-center font-bold text-2xs transition-colors ${
                    selectedRole === role
                      ? 'bg-surface-3 border-info text-white'
                      : 'bg-surface-2 border-border text-text-muted hover:text-text'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Badge ID Input */}
          <div className="space-y-1">
            <label className="text-2xs text-text-dim uppercase">Officer Badge Token / ID</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-text-dim" />
              <input
                type="text"
                value={badgeCode}
                onChange={e => setBadgeCode(e.target.value)}
                required
                className="w-full bg-surface-2 border border-border rounded pl-9 pr-3 py-2 text-xs text-text focus:outline-none focus:border-info"
              />
            </div>
          </div>

          {/* Security Classification Note */}
          <div className="p-2.5 rounded bg-surface-2 border border-border text-[11px] text-text-dim flex items-start gap-2 leading-relaxed">
            <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
            <span>
              All camera interactions, AI triage confirmations, and PTZ adjustments are logged with cryptographic SHA-256 chain of custody.
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-surface-3 hover:bg-surface-2 border border-border hover:border-info text-text hover:text-white rounded font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-info" />
            <span>INITIALIZE CONSOLE SESSION</span>
          </button>
        </form>
      </div>

      {/* Footer Doctrine */}
      <div className="text-center text-2xs text-text-dim border-t border-border pt-3">
        IBVAP sees. SWAN follows. SHIELD recovers. The operator decides.
      </div>
    </div>
  );
};
