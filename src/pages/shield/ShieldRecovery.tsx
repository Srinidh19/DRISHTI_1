import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { CameraFeed } from '../../components/video/CameraFeed';
import {
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Activity,
  Radio,
  Cpu,
  RefreshCw,
  Compass
} from 'lucide-react';

export const ShieldRecovery: React.FC = () => {
  const { cameras, shieldFaults, simulateCameraFailure } = useRealtime();
  const [isSimulating, setIsSimulating] = useState(false);

  const fault = shieldFaults[0];
  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const camTower = cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[8];

  const handleSimulate = () => {
    setIsSimulating(true);
    simulateCameraFailure();
    setTimeout(() => setIsSimulating(false), 6500);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111315] text-[#e5e7eb] overflow-y-auto">
      {/* Header */}
      <div className="min-h-[3rem] h-auto md:h-12 border-b border-[#30353b] bg-[#181b1f] px-4 py-2 md:py-0 flex flex-wrap items-center justify-between gap-2 shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-[#3f8f68]" />
          <span className="text-sm font-semibold tracking-wider text-[#e5e7eb]">
            SHIELD AUTONOMOUS RECOVERY PIPELINE
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hidden sm:inline-block">
            SELF-HEALING EDGE COVERAGE ENGINE
          </span>
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className={`flex items-center gap-1.5 px-3 py-1.5 border rounded font-mono text-xs font-semibold transition-colors ${
            isSimulating
              ? 'bg-[#c28a28]/30 border-[#c28a28] text-white'
              : 'bg-[#c28a28] hover:bg-[#c28a28]/90 border-[#c28a28] text-black'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>{isSimulating ? 'RUNNING RECOVERY SEQUENCE...' : 'TRIGGER RECOVERY SEQUENCE'}</span>
        </button>
      </div>

      <div className="p-4 space-y-4 font-mono">
        {/* Operational Workflow Steps */}
        <div className="bg-[#181b1f] border border-[#30353b] rounded p-4">
          <div className="text-xs text-[#8d949d] uppercase mb-3 flex flex-wrap items-center justify-between gap-2">
            <span>AUTONOMOUS RESTORATION EXECUTION PIPELINE</span>
            <span className="text-[#3f8f68]">ACTIVE EDGE LOOP &bull; 100ms CYCLE</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">STAGE 1</div>
              <div className="font-bold text-[#e5e7eb] mt-1">CAMERA HEALTHY</div>
              <div className="text-[10px] text-[#3f8f68] mt-1">NOMINAL 30 FPS</div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">STAGE 2</div>
              <div className="font-bold text-[#e5e7eb] mt-1">HEARTBEAT LOST</div>
              <div className="text-[10px] text-[#c93c3c] mt-1">TIMEOUT &gt; 3.0s</div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">STAGE 3</div>
              <div className="font-bold text-[#e5e7eb] mt-1">FAULT CLASSIFIED</div>
              <div className="text-[10px] text-[#c28a28] mt-1">TAMPER / BLOCK</div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">STAGE 4</div>
              <div className="font-bold text-[#e5e7eb] mt-1">BLIND ZONE EST.</div>
              <div className="text-[10px] text-[#c93c3c] mt-1">-32% SECTOR GAP</div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#477da8]/50 bg-[#477da8]/10">
              <div className="text-[10px] text-[#477da8]">STAGE 5</div>
              <div className="font-bold text-[#477da8] mt-1">PTZ SELECTED</div>
              <div className="text-[10px] text-[#477da8] mt-1">CAM-TOWER-01</div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#3f8f68]/50 bg-[#3f8f68]/10">
              <div className="text-[10px] text-[#3f8f68]">STAGE 6</div>
              <div className="font-bold text-[#3f8f68] mt-1">COVERAGE RESTORED</div>
              <div className="text-[10px] text-[#3f8f68] mt-1">+20% RESTORATION</div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">STAGE 7</div>
              <div className="font-bold text-[#e5e7eb] mt-1">MONITORING</div>
              <div className="text-[10px] text-[#3f8f68] mt-1">CONTINUOUS LOCK</div>
            </div>
          </div>
        </div>

        {/* Dual Verification Feeds: Failed vs Slewed Backup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#181b1f] border border-[#30353b] rounded p-3 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#8d949d]">FAILED NODE ({cam3.id})</span>
              <span className="text-[#c93c3c] font-bold">OBSTRUCTED / FAULT</span>
            </div>
            <div className="h-56 border border-[#30353b] rounded overflow-hidden">
              <CameraFeed camera={cam3} showControls={false} />
            </div>
            <div className="text-[11px] text-[#8d949d] p-2 bg-[#20242a] rounded">
              Physical obstruction on optical lens. Zero optical detections.
            </div>
          </div>

          <div className="bg-[#181b1f] border border-[#30353b] rounded p-3 space-y-2">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[#8d949d]">AUTONOMOUS BACKUP ({camTower.id})</span>
              <span className="text-[#3f8f68] font-bold">SLEWED +32° AZIMUTH &bull; RESTORING</span>
            </div>
            <div className="h-56 border border-[#30353b] rounded overflow-hidden">
              <CameraFeed camera={camTower} showControls={false} />
            </div>
            <div className="text-[11px] text-[#8d949d] p-2 bg-[#20242a] rounded">
              PTZ motor actuated in 1.4s. 88% visual sector perimeter overlap restored.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShieldRecovery;
