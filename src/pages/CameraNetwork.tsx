import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { CameraHealthBadge } from '../components/status/SeverityBadge';
import { Camera, CameraType, CameraHealthStatus } from '../types';
import { Video, Search, Filter, Activity, Radio, AlertCircle } from 'lucide-react';

export const CameraNetwork: React.FC = () => {
  const { cameras, setSelectedCameraId } = useRealtime();

  const [search, setSearch] = useState('');
  const [healthFilter, setHealthFilter] = useState<'ALL' | CameraHealthStatus>('ALL');
  const [typeFilter, setTypeFilter] = useState<'ALL' | CameraType>('ALL');
  const [bopFilter, setBopFilter] = useState<'ALL' | 'BOP-17' | 'BOP-18' | 'BOP-19'>('ALL');

  const filteredCameras = cameras.filter(cam => {
    if (healthFilter !== 'ALL' && cam.health !== healthFilter) return false;
    if (typeFilter !== 'ALL' && cam.type !== typeFilter) return false;
    if (bopFilter !== 'ALL' && cam.bop !== bopFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        cam.id.toLowerCase().includes(q) ||
        cam.location.toLowerCase().includes(q) ||
        cam.zone.toLowerCase().includes(q) ||
        cam.bop.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-hidden select-none">
      {/* Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-info" />
          <h1 className="text-sm font-bold text-text uppercase tracking-wider">
            Border Camera Surveillance Network
          </h1>
          <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs text-text-muted">
            {cameras.length} Total Nodes ({cameras.filter(c => c.health === 'ONLINE').length} Online)
          </span>
        </div>

        {/* Quick Health Stats Counters */}
        <div className="flex items-center gap-2 text-2xs">
          <div className="px-2 py-1 rounded bg-success-bg border border-success-border text-success-text flex items-center gap-1.5 font-medium">
            <span>✓</span>
            <span>{cameras.filter(c => c.health === 'ONLINE').length} ONLINE</span>
          </div>
          <div className="px-2 py-1 rounded bg-warning-bg border border-warning-border text-warning-text flex items-center gap-1.5 font-medium">
            <span>!</span>
            <span>{cameras.filter(c => c.health === 'WARNING').length} WARNING</span>
          </div>
          <div className="px-2 py-1 rounded bg-critical-bg border border-critical-border text-critical-text flex items-center gap-1.5 font-medium">
            <span>×</span>
            <span>{cameras.filter(c => c.health === 'OFFLINE').length} OFFLINE</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-2.5 bg-surface-2 border-b border-border flex flex-wrap items-center justify-between gap-2">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search camera ID, post, zone..."
            className="w-full bg-surface border border-border rounded pl-8 pr-3 py-1.5 text-xs text-text placeholder-text-dim focus:outline-none focus:border-info"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 text-2xs flex-wrap">
          {/* BOP Filter */}
          <div className="flex items-center gap-1">
            <span className="text-text-dim">BOP:</span>
            <select
              value={bopFilter}
              onChange={e => setBopFilter(e.target.value as any)}
              className="bg-surface border border-border rounded px-2 py-1 text-text focus:outline-none focus:border-info"
            >
              <option value="ALL">ALL BOPS</option>
              <option value="BOP-17">BOP-17 (North)</option>
              <option value="BOP-18">BOP-18 (Central)</option>
              <option value="BOP-19">BOP-19 (East)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <span className="text-text-dim">TYPE:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="bg-surface border border-border rounded px-2 py-1 text-text focus:outline-none focus:border-info"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="Fixed">Fixed</option>
              <option value="PTZ">PTZ</option>
              <option value="IR">IR</option>
              <option value="Thermal">Thermal</option>
            </select>
          </div>

          {/* Health Filter */}
          <div className="flex items-center gap-1">
            <span className="text-text-dim">HEALTH:</span>
            <select
              value={healthFilter}
              onChange={e => setHealthFilter(e.target.value as any)}
              className="bg-surface border border-border rounded px-2 py-1 text-text focus:outline-none focus:border-info"
            >
              <option value="ALL">ALL HEALTH</option>
              <option value="ONLINE">ONLINE</option>
              <option value="WARNING">WARNING</option>
              <option value="OFFLINE">OFFLINE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dense Operational Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-left font-mono">
          <thead className="bg-surface sticky top-0 border-b border-border text-2xs text-text-dim uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-3">Camera</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Location / Post</th>
              <th className="py-2.5 px-3">BOP / Sector</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Resolution</th>
              <th className="py-2.5 px-3">FPS</th>
              <th className="py-2.5 px-3">Latency</th>
              <th className="py-2.5 px-3">Last Heartbeat</th>
              <th className="py-2.5 px-3">Edge Analytics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredCameras.map(cam => (
              <tr
                key={cam.id}
                onClick={() => setSelectedCameraId(cam.id)}
                className="hover:bg-surface-2 cursor-pointer transition-colors"
              >
                <td className="py-2 px-3 font-bold text-text flex items-center gap-2">
                  <span>{cam.name}</span>
                  {cam.isPtzBackup && (
                    <span className="text-[10px] px-1 py-0.2 rounded bg-info-bg text-info border border-info-border">
                      PTZ BACKUP
                    </span>
                  )}
                </td>
                <td className="py-2 px-3">
                  <CameraHealthBadge health={cam.health} />
                </td>
                <td className="py-2 px-3 text-text font-medium">{cam.location}</td>
                <td className="py-2 px-3 text-text-muted">{cam.bop}</td>
                <td className="py-2 px-3 text-text-muted">{cam.type}</td>
                <td className="py-2 px-3 text-text-muted">{cam.resolution}</td>
                <td className="py-2 px-3 text-text font-medium">{cam.fps > 0 ? `${cam.fps} fps` : '--'}</td>
                <td className="py-2 px-3 text-text-muted">{cam.latencyMs > 0 ? `${cam.latencyMs} ms` : '--'}</td>
                <td className="py-2 px-3 text-text-dim">{cam.lastHeartbeat}</td>
                <td className="py-2 px-3">
                  {cam.analyticsActive ? (
                    <span className="inline-flex items-center gap-1 text-success font-semibold text-2xs">
                      <span>●</span>
                      <span>YOLO / SWAN</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-text-dim text-2xs">
                      <span>○</span>
                      <span>INACTIVE</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
