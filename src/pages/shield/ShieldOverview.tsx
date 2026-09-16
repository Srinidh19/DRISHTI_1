import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../../context/RealtimeContext';
import { CameraFeed } from '../../components/video/CameraFeed';
import { CommandMap } from '../../components/map/CommandMap';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle,
  Activity,
  Layers,
  Wrench,
  Radio,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export const ShieldOverview: React.FC = () => {
  const navigate = useNavigate();
  const { systemStatus, shieldFaults, cameras, simulateCameraFailure, dispatchMaintenance } = useRealtime();
  const [isSimulating, setIsSimulating] = useState(false);

  const fault = shieldFaults[0];
  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const camTower = cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[8];

  const handleSimulateFailure = () => {
    setIsSimulating(true);
    simulateCameraFailure();
    setTimeout(() => setIsSimulating(false), 6500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111315] text-[#e5e7eb] overflow-y-auto">
      {/* Tactical Sub-Header */}
      <div className="h-12 border-b border-[#30353b] bg-[#181b1f] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#3f8f68]" />
            <span className="text-sm font-semibold tracking-wider text-[#e5e7eb]">
              SHIELD HEALTH OVERVIEW
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] font-mono">
            AUTONOMOUS INFRASTRUCTURE DEFENSE & RESTORATION
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulateFailure}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded font-mono text-xs font-semibold transition-colors ${
              isSimulating
                ? 'bg-[#c28a28]/30 border-[#c28a28] text-white'
                : 'bg-[#c28a28] hover:bg-[#c28a28]/90 border-[#c28a28] text-black'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'SIMULATING RECOVERY...' : 'SIMULATE CAMERA FAILURE'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
          <div className="p-3.5 rounded bg-[#181b1f] border border-[#30353b]">
            <div className="text-[11px] text-[#8d949d]">TOTAL MONITORED NODES</div>
            <div className="text-2xl font-bold text-[#e5e7eb] mt-1">{systemStatus.totalCameras}</div>
            <div className="text-[10px] text-[#8d949d] mt-0.5">BOP-17 Sector Edge Grid</div>
          </div>

          <div className="p-3.5 rounded bg-[#181b1f] border border-[#3f8f68]/40">
            <div className="text-[11px] text-[#8d949d]">ONLINE & HEALTHY</div>
            <div className="text-2xl font-bold text-[#3f8f68] mt-1">{systemStatus.onlineCameras}</div>
            <div className="text-[10px] text-[#8d949d] mt-0.5">94% Operational Readiness</div>
          </div>

          <div className="p-3.5 rounded bg-[#181b1f] border border-[#c28a28]/40">
            <div className="text-[11px] text-[#8d949d]">DEGRADED / WARNING</div>
            <div className="text-2xl font-bold text-[#c28a28] mt-1">{systemStatus.warningCameras}</div>
            <div className="text-[10px] text-[#8d949d] mt-0.5">CAM-03 (Tamper / Obstruction)</div>
          </div>

          <div className="p-3.5 rounded bg-[#181b1f] border border-[#c93c3c]/40">
            <div className="text-[11px] text-[#8d949d]">OFFLINE NODES</div>
            <div className="text-2xl font-bold text-[#c93c3c] mt-1">{systemStatus.offlineCameras}</div>
            <div className="text-[10px] text-[#8d949d] mt-0.5">CAM-05 (Scheduled Line Maint)</div>
          </div>
        </div>

        {/* 2-Column Split: Active Incident/Fault + Realtime Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Fault Detail Card */}
          {fault && (
            <div className="bg-[#181b1f] border border-[#30353b] rounded flex flex-col overflow-hidden">
              <div className="p-3 bg-[#20242a] border-b border-[#30353b] flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#e5e7eb] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#c28a28]" />
                  <span>ACTIVE FAULT CLASSIFICATION: {fault.id}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#c28a28]/20 border border-[#c28a28]/40 text-[#c28a28] font-mono text-[10px] font-bold">
                  CRITICALITY: {fault.criticality}
                </span>
              </div>

              <div className="p-4 space-y-4 flex-1 flex flex-col justify-between font-mono text-xs">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#30353b] pb-2">
                    <span className="text-[#8d949d]">AFFECTED SENSOR:</span>
                    <span className="font-bold text-sm text-[#e5e7eb]">{fault.cameraName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d949d]">CONDITION CLASSIFIED:</span>
                    <span className="font-bold text-[#c28a28]">{fault.condition}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d949d]">DETECTION CONFIDENCE:</span>
                    <span className="font-bold text-[#e5e7eb]">
                      {(fault.detectionConfidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#8d949d]">HEARTBEAT DROP TIME:</span>
                    <span className="text-[#8d949d]">{fault.detectedAt}</span>
                  </div>
                </div>

                {/* Coverage Impact Matrix */}
                <div className="p-3 rounded bg-[#20242a] border border-[#30353b] space-y-2">
                  <div className="text-[10px] text-[#8d949d] uppercase font-semibold">
                    Sector Perimeter Impact Analysis
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="p-2 rounded bg-[#181b1f] border border-[#30353b]">
                      <div className="text-[#8d949d] text-[10px]">BEFORE</div>
                      <div className="font-bold text-[#e5e7eb] text-sm mt-0.5">100%</div>
                    </div>
                    <div className="p-2 rounded bg-[#181b1f] border border-[#c93c3c]/50">
                      <div className="text-[#c93c3c] text-[10px]">LOST</div>
                      <div className="font-bold text-[#c93c3c] text-sm mt-0.5">-{fault.coverageLostPercent}%</div>
                    </div>
                    <div className="p-2 rounded bg-[#181b1f] border border-[#3f8f68]/50">
                      <div className="text-[#3f8f68] text-[10px]">RECOVERED</div>
                      <div className="font-bold text-[#3f8f68] text-sm mt-0.5">+{fault.coverageRestoredPercent}%</div>
                    </div>
                    <div className="p-2 rounded bg-[#181b1f] border border-[#30353b]">
                      <div className="text-[#8d949d] text-[10px]">RESIDUAL</div>
                      <div className="font-bold text-[#c28a28] text-sm mt-0.5">{fault.residualBlindZonePercent}%</div>
                    </div>
                  </div>
                </div>

                {/* Backup Allocation */}
                <div className="space-y-2">
                  <div className="text-[10px] text-[#8d949d] uppercase font-semibold">
                    Backup Cameras Deployed
                  </div>
                  {fault.backupCameras.map((bk, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded bg-[#20242a] border border-[#30353b] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#477da8]" />
                        <span className="font-bold text-[#e5e7eb]">{bk.cameraName}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[#8d949d] text-[11px]">
                          Restoring +{bk.coverageContributionPercent}%
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-[#477da8]/20 text-[#477da8] text-[10px] font-bold border border-[#477da8]/40">
                          {bk.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#30353b] flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => navigate('/app/shield/coverage')}
                    className="px-3 py-1.5 bg-[#20242a] hover:bg-[#30353b] border border-[#30353b] rounded text-xs text-[#e5e7eb] transition-colors"
                  >
                    INSPECT COVERAGE MAP
                  </button>
                  <button
                    onClick={() => dispatchMaintenance(fault.id)}
                    disabled={fault.maintenanceDispatched}
                    className={`px-3 py-1.5 border rounded text-xs font-semibold flex items-center gap-1.5 ml-auto transition-colors ${
                      fault.maintenanceDispatched
                        ? 'bg-[#181b1f] border-[#30353b] text-[#3f8f68]'
                        : 'bg-[#477da8] hover:bg-[#477da8]/90 border-[#477da8] text-white'
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

          {/* Backup PTZ Slew & Verification Feeds */}
          <div className="bg-[#181b1f] border border-[#30353b] rounded flex flex-col overflow-hidden">
            <div className="p-3 bg-[#20242a] border-b border-[#30353b] flex items-center justify-between font-mono">
              <span className="font-bold text-xs text-[#e5e7eb]">
                AUTONOMOUS PTZ SLEW & RESTORATION FEEDS
              </span>
              <span className="text-[11px] text-[#8d949d]">SECTOR OVERLAP</span>
            </div>

            <div className="p-3 space-y-3 flex-1 flex flex-col justify-center font-mono">
              <div className="space-y-1">
                <div className="text-[11px] text-[#8d949d] flex justify-between px-1">
                  <span>FAILED SENSOR: {cam3.id} (Obstruction / Tamper)</span>
                  <span className="text-[#c93c3c] font-bold">FAULT DETECTED</span>
                </div>
                <div className="h-40">
                  <CameraFeed camera={cam3} showControls={false} />
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#30353b]/60">
                <div className="text-[11px] text-[#8d949d] flex justify-between px-1">
                  <span>BACKUP PTZ: {camTower.id} (Slewed to Fence Alpha)</span>
                  <span className="text-[#3f8f68] font-bold">RESTORATION 88%</span>
                </div>
                <div className="h-40">
                  <CameraFeed camera={camTower} showControls={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Map with Blind Zone and Recovery Cones */}
        <div className="bg-[#181b1f] border border-[#30353b] rounded flex flex-col overflow-hidden">
          <div className="p-3 bg-[#20242a] border-b border-[#30353b] flex items-center justify-between font-mono">
            <span className="font-bold text-xs text-[#e5e7eb] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#477da8]" />
              <span>TACTICAL BLIND ZONE & COVERAGE GAP VISUALIZER</span>
            </span>
            <span className="text-[11px] text-[#8d949d]">
              RED HATCHED: RESIDUAL BLIND ZONE (12%) | BLUE: PTZ RESTORATION CONE
            </span>
          </div>
          <div className="h-96 relative">
            <CommandMap />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShieldOverview;
