import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { CommandMap } from '../../components/map/CommandMap';
import {
  Layers,
  Shield,
  Eye,
  AlertTriangle,
  Compass,
  CheckCircle2,
  RefreshCw,
  Info
} from 'lucide-react';

export const ShieldCoverage: React.FC = () => {
  const { cameras, shieldFaults } = useRealtime();
  const [selectedBop, setSelectedBop] = useState<string>('BOP-17');

  const fault = shieldFaults[0];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111315] text-[#e5e7eb] overflow-hidden">
      {/* Header */}
      <div className="min-h-[3rem] h-auto md:h-12 border-b border-[#30353b] bg-[#181b1f] px-4 py-2 md:py-0 flex flex-wrap items-center justify-between gap-2 shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#477da8]" />
          <span className="text-sm font-semibold tracking-wider text-[#e5e7eb]">
            SHIELD COVERAGE & SECTOR BLIND ZONES
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hidden sm:inline-block">
            SECTOR: BOP-17 NORTH
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3f8f68]" />
            <span className="text-[#8d949d]">ACTIVE COVERAGE:</span>
            <span className="font-bold text-[#e5e7eb]">88.4%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c93c3c]" />
            <span className="text-[#8d949d]">BLIND GAP:</span>
            <span className="font-bold text-[#c93c3c]">11.6%</span>
          </div>
        </div>
      </div>

      {/* Main Coverage Viewport: Full GIS Map with Sector Overlay Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-y-auto md:overflow-hidden">
        {/* Central Map Surface */}
        <div className="w-full h-80 md:h-full md:flex-1 relative min-h-[300px] md:min-h-0 bg-[#0f1114] shrink-0 md:shrink">
          <CommandMap />
        </div>

        {/* Right Sector Analysis Column */}
        <div className="w-full md:w-80 bg-[#181b1f] border-t md:border-t-0 md:border-l border-[#30353b] flex flex-col min-h-0 p-4 font-mono text-xs overflow-y-auto">
          <div className="pb-3 border-b border-[#30353b] mb-4">
            <div className="text-[10px] text-[#8d949d]">SECTOR PROFILE</div>
            <div className="text-sm font-bold text-[#e5e7eb]">BOP-17 / NORTH PERIMETER</div>
            <div className="text-[11px] text-[#8d949d] mt-0.5">Coverage Boundary: 2.8 km Linear Fence</div>
          </div>

          {/* Overlapping Camera Matrix */}
          <div className="space-y-3 mb-4">
            <div className="text-[10px] text-[#8d949d] uppercase font-semibold">
              Sensor Node Overlap Status
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#e5e7eb]">CAM-03 &rarr; CAM-04</span>
                <span className="text-[10px] text-[#3f8f68]">NORMAL OVERLAP</span>
              </div>
              <div className="text-[11px] text-[#8d949d]">
                48m visual overlap across Ridge Point 1.
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#c28a28]/40 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#e5e7eb]">CAM-03 (IMPAIRED)</span>
                <span className="text-[10px] text-[#c28a28]">PTZ BACKUP ACTIVE</span>
              </div>
              <div className="text-[11px] text-[#8d949d]">
                CAM-TOWER-01 slewed +32° azimuth to cover gap. Residual blind zone: 11.6%.
              </div>
            </div>

            <div className="p-2.5 rounded bg-[#20242a] border border-[#30353b] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#e5e7eb]">CAM-06 &rarr; CAM-ROAD-05</span>
                <span className="text-[10px] text-[#3f8f68]">100% COVERED</span>
              </div>
              <div className="text-[11px] text-[#8d949d]">
                Continuous IR illumination across vehicle roadway.
              </div>
            </div>
          </div>

          {/* Sector Coverage Metric Breakdown */}
          <div className="p-3 rounded bg-[#20242a] border border-[#30353b] space-y-2 mt-auto">
            <div className="text-[10px] text-[#8d949d] uppercase font-semibold">
              Perimeter Readiness Index
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8d949d]">Thermal Optics:</span>
                <span className="text-[#3f8f68] font-bold">100%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8d949d]">Acoustic / Seismic:</span>
                <span className="text-[#3f8f68] font-bold">96%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8d949d]">Optical CCTV:</span>
                <span className="text-[#c28a28] font-bold">88.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8d949d]">PTZ Slew Backups:</span>
                <span className="text-[#477da8] font-bold">2 / 2 Deployed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShieldCoverage;
