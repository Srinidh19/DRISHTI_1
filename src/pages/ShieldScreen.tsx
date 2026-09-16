import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { CameraFeed } from '../components/video/CameraFeed';
import { CommandMap } from '../components/map/CommandMap';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle,
  Wrench,
  Video,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu
} from 'lucide-react';

export const ShieldScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    systemStatus,
    shieldFaults,
    cameras,
    simulateCameraFailure,
    dispatchMaintenance
  } = useRealtime();

  const [isSimulating, setIsSimulating] = useState(false);

  // Subview tab
  let currentTab: 'overview' | 'faults' | 'coverage' | 'recovery' = 'overview';
  if (location.pathname.endsWith('/faults')) currentTab = 'faults';
  else if (location.pathname.endsWith('/coverage')) currentTab = 'coverage';
  else if (location.pathname.endsWith('/recovery')) currentTab = 'recovery';

  const fault = shieldFaults[0];
  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const camTower = cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[8];
  const camRoad = cameras.find(c => c.id === 'CAM-ROAD-05') || cameras[9];

  const handleSimulateFailure = () => {
    setIsSimulating(true);
    simulateCameraFailure();
    setTimeout(() => setIsSimulating(false), 6500);
  };

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-y-auto select-none">
      {/* Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface-2 border border-border flex items-center justify-center">
            <Shield className="w-4 h-4 text-success" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-text uppercase tracking-wider">SHIELD</h1>
              <span className="text-2xs text-text-muted">|</span>
              <span className="text-xs text-text-muted">
                SELF-HEALING INTELLIGENT EDGE-LED DEFENSE
              </span>
              <span className="flex items-center gap-1 text-2xs text-success font-bold px-2 py-0.5 rounded bg-success-bg border border-success-border">
                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                ACTIVE
              </span>
            </div>
            <p className="text-2xs text-text-dim mt-0.5">
              Automated fault detection • Tamper identification • PTZ backup slewing • Coverage gap healing
            </p>
          </div>
        </div>

        {/* Action Button: SIMULATE CAMERA FAILURE */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateFailure}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded font-semibold text-xs transition-colors ${
              isSimulating
                ? 'bg-warning/30 border-warning text-white'
                : 'bg-warning hover:bg-warning/80 border-warning text-black'
            }`}
            title="Simulate CAM-03 failure, blind zone calculation, and automated PTZ backup restoration"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'SIMULATING RECOVERY...' : 'SIMULATE CAMERA FAILURE'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-3 py-1.5 bg-surface-2 border-b border-border flex items-center gap-2 text-2xs">
        <Link
          to="/app/shield"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'overview'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          HEALTH OVERVIEW
        </Link>
        <Link
          to="/app/shield/faults"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'faults'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          ACTIVE FAULTS ({shieldFaults.length})
        </Link>
        <Link
          to="/app/shield/coverage"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'coverage'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          COVERAGE & BLIND ZONES
        </Link>
        <Link
          to="/app/shield/recovery"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'recovery'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          AUTONOMOUS RECOVERY
        </Link>
      </div>

      {/* Main Body */}
      <div className="p-3 space-y-3">
        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded bg-surface border border-border">
            <div className="text-2xs text-text-dim">TOTAL MONITORED CAMERAS</div>
            <div className="text-2xl font-bold text-text mt-1">{systemStatus.totalCameras}</div>
            <div className="text-2xs text-text-muted mt-0.5">BOP-17 Sector Nodes</div>
          </div>

          <div className="p-3 rounded bg-surface border border-success-border/50">
            <div className="text-2xs text-text-dim">ONLINE & HEALTHY</div>
            <div className="text-2xl font-bold text-success mt-1">{systemStatus.onlineCameras}</div>
            <div className="text-2xs text-text-muted mt-0.5">94% Operational Readiness</div>
          </div>

          <div className="p-3 rounded bg-surface border border-warning-border/50">
            <div className="text-2xs text-text-dim">DEGRADED / WARNING</div>
            <div className="text-2xl font-bold text-warning mt-1">{systemStatus.warningCameras}</div>
            <div className="text-2xs text-text-muted mt-0.5">CAM-03 (Tamper / Obstruction)</div>
          </div>

          <div className="p-3 rounded bg-surface border border-critical-border/50">
            <div className="text-2xs text-text-dim">OFFLINE NODES</div>
            <div className="text-2xl font-bold text-critical mt-1">{systemStatus.offlineCameras}</div>
            <div className="text-2xs text-text-muted mt-0.5">CAM-05 (Scheduled Line Maint)</div>
          </div>
        </div>

        {/* 2-Column Split: Active Fault Detail & Coverage Restoration Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Fault Detail Card */}
          {fault && (
            <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
              <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
                <span className="font-bold text-text uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning" />
                  <span>Fault Classification: {fault.id}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-warning-bg border border-warning-border text-warning-text font-bold text-2xs">
                  CRITICALITY: {fault.criticality}
                </span>
              </div>

              <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-border pb-2">
                    <span className="text-text-dim">FAILED CAMERA:</span>
                    <span className="font-bold text-sm text-text">{fault.cameraName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-dim">CONDITION CLASSIFIED:</span>
                    <span className="font-bold text-warning">{fault.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-dim">DETECTION CONFIDENCE:</span>
                    <span className="font-bold text-text">
                      {(fault.detectionConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-dim">DETECTED AT:</span>
                    <span className="text-text-muted">{fault.detectedAt}</span>
                  </div>
                </div>

                {/* Coverage Stats Box */}
                <div className="p-2.5 rounded bg-surface-2 border border-border space-y-2 text-2xs">
                  <div className="text-2xs text-text-dim uppercase font-semibold">
                    Sector Perimeter Impact
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-1.5 rounded bg-surface border border-border">
                      <div className="text-text-dim">BEFORE</div>
                      <div className="font-bold text-text text-sm">100%</div>
                    </div>
                    <div className="p-1.5 rounded bg-surface border border-critical-border">
                      <div className="text-critical text-2xs">LOST</div>
                      <div className="font-bold text-critical text-sm">-{fault.coverageLostPercent}%</div>
                    </div>
                    <div className="p-1.5 rounded bg-surface border border-success-border">
                      <div className="text-success text-2xs">RECOVERY</div>
                      <div className="font-bold text-success text-sm">+{fault.coverageRestoredPercent}%</div>
                    </div>
                    <div className="p-1.5 rounded bg-surface border border-border">
                      <div className="text-text-dim">RESIDUAL</div>
                      <div className="font-bold text-warning text-sm">{fault.residualBlindZonePercent}%</div>
                    </div>
                  </div>
                </div>

                {/* Backup Cameras Deployed */}
                <div className="space-y-1.5 text-2xs">
                  <div className="text-text-dim uppercase font-semibold">
                    Backup Cameras Deployed
                  </div>
                  {fault.backupCameras.map((bk, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-info" />
                        <span className="font-bold text-text">{bk.cameraName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-text-dim">
                          Restoring +{bk.coverageContributionPercent}%
                        </span>
                        <span className="px-1.5 py-0.2 rounded bg-info-bg text-info text-[10px] font-bold border border-info-border">
                          {bk.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Operator Actions */}
                <div className="pt-2 border-t border-border flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigate('/app/command')}
                    className="px-2.5 py-1.5 bg-surface hover:bg-surface-2 border border-border rounded text-2xs text-text transition-colors"
                  >
                    VIEW COVERAGE MAP
                  </button>
                  <button
                    onClick={() => navigate('/app/surveillance/live')}
                    className="px-2.5 py-1.5 bg-surface hover:bg-surface-2 border border-border rounded text-2xs text-text transition-colors"
                  >
                    OPEN LIVE FEEDS
                  </button>
                  <button
                    onClick={() => dispatchMaintenance(fault.id)}
                    disabled={fault.maintenanceDispatched}
                    className={`px-3 py-1.5 border rounded text-2xs font-semibold flex items-center gap-1.5 ml-auto transition-colors ${
                      fault.maintenanceDispatched
                        ? 'bg-surface border-border text-success'
                        : 'bg-info hover:bg-info/80 border-info text-white'
                    }`}
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>
                      {fault.maintenanceDispatched
                        ? `DISPATCHED (${fault.maintenanceTicketId})`
                        : 'DISPATCH MAINTENANCE'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Backup Feeds & Stream State */}
          <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider">
                Backup PTZ Slew & Verification Feeds
              </span>
              <span className="text-2xs text-text-dim">Sector Overlap</span>
            </div>

            <div className="p-2 space-y-2 flex-1 flex flex-col justify-center">
              <div className="space-y-1">
                <div className="text-2xs text-text-dim flex justify-between">
                  <span>FAILED: {cam3.id} (Obstruction / Tamper)</span>
                  <span className="text-critical font-bold">FAULT DETECTED</span>
                </div>
                <div className="h-28">
                  <CameraFeed camera={cam3} showControls={false} />
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-2xs text-text-dim flex justify-between">
                  <span>BACKUP: {camTower.id} (Repositioned to Fence B)</span>
                  <span className="text-success font-bold">RESTORATION 88%</span>
                </div>
                <div className="h-28">
                  <CameraFeed camera={camTower} showControls={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Map with Blind Zone and Recovery Cones */}
        <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
          <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
            <span className="font-bold text-text uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-info" />
              <span>Tactical Coverage Gap & Blind Zone Visualizer</span>
            </span>
            <span className="text-2xs text-text-dim">
              Red Hatched = Residual Blind Zone (12%) | Blue = Backup PTZ Restoration
            </span>
          </div>
          <div className="h-80 relative">
            <CommandMap />
          </div>
        </div>
      </div>
    </div>
  );
};
