import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { CameraFeed } from '../../components/video/CameraFeed';
import {
  ShieldAlert,
  AlertTriangle,
  Wrench,
  Camera,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Layers,
  EyeOff
} from 'lucide-react';

export const ShieldFaults: React.FC = () => {
  const { shieldFaults, cameras, dispatchMaintenance } = useRealtime();
  const [selectedFaultId, setSelectedFaultId] = useState<string>(shieldFaults[0]?.id || 'FLT-2026-081');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [mobileTab, setMobileTab] = useState<'queue' | 'dossier'>('queue');

  const selectedFault = shieldFaults.find(f => f.id === selectedFaultId) || shieldFaults[0];
  const affectedCam = cameras.find(c => c.id === selectedFault?.cameraId) || cameras[2];

  const filteredFaults = shieldFaults.filter(f => {
    if (filterSeverity !== 'ALL' && f.criticality !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111315] text-[#e5e7eb] overflow-hidden">
      {/* Header */}
      <div className="min-h-[3rem] h-auto md:h-12 border-b border-[#30353b] bg-[#181b1f] px-4 py-2 md:py-0 flex flex-wrap items-center justify-between gap-2 shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#c28a28]" />
          <span className="text-sm font-semibold tracking-wider text-[#e5e7eb]">
            SHIELD ACTIVE FAULTS & DIAGNOSTICS
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hidden sm:inline-block">
            {filteredFaults.length} Active Anomalies
          </span>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-[#20242a] p-0.5 rounded border border-[#30353b] text-xs">
          <button
            onClick={() => setMobileTab('queue')}
            className={`px-2.5 py-1 rounded font-bold transition-colors ${
              mobileTab === 'queue' ? 'bg-[#30353b] text-white' : 'text-[#8d949d]'
            }`}
          >
            QUEUE ({filteredFaults.length})
          </button>
          <button
            onClick={() => setMobileTab('dossier')}
            className={`px-2.5 py-1 rounded font-bold transition-colors ${
              mobileTab === 'dossier' ? 'bg-[#30353b] text-white' : 'text-[#8d949d]'
            }`}
          >
            DOSSIER
          </button>
        </div>
      </div>

      {/* 2-Column Split: Faults Registry vs Selected Diagnostic Dossier */}
      <div className="flex-1 grid grid-cols-12 min-h-0 lg:divide-x divide-[#30353b]">
        {/* Left Column: Faults Registry */}
        <div
          className={`${
            mobileTab === 'queue' ? 'flex' : 'hidden'
          } lg:flex col-span-12 lg:col-span-5 flex-col min-h-0 bg-[#14171a] font-mono`}
        >
          <div className="p-3 border-b border-[#30353b] flex items-center justify-between">
            <span className="text-xs font-semibold text-[#e5e7eb]">FAULT LOG QUEUE</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8d949d]">SEVERITY:</span>
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="bg-[#181b1f] border border-[#30353b] rounded px-2 py-1 text-xs text-[#e5e7eb] focus:outline-none focus:border-[#477da8]"
              >
                <option value="ALL">ALL</option>
                <option value="HIGH">HIGH</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#30353b]/60">
            {filteredFaults.map(flt => {
              const isSelected = flt.id === selectedFault?.id;
              return (
                <div
                  key={flt.id}
                  onClick={() => {
                    setSelectedFaultId(flt.id);
                    setMobileTab('dossier');
                  }}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#20242a] border-l-2 border-l-[#c28a28]' : 'hover:bg-[#181b1f]/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#e5e7eb]">{flt.id}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border font-semibold ${
                        flt.criticality === 'HIGH' || flt.criticality === 'CRITICAL'
                          ? 'bg-[#c93c3c]/20 text-[#c93c3c] border-[#c93c3c]/40'
                          : 'bg-[#c28a28]/20 text-[#c28a28] border-[#c28a28]/40'
                      }`}
                    >
                      {flt.criticality}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-[#c28a28] mb-1">
                    {flt.condition}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8d949d]">
                    <span>Node: <strong className="text-[#e5e7eb]">{flt.cameraName}</strong></span>
                    <span>{flt.detectedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Diagnostic Dossier */}
        {selectedFault ? (
          <div
            className={`${
              mobileTab === 'dossier' ? 'flex' : 'hidden'
            } lg:flex col-span-12 lg:col-span-7 flex-col min-h-0 bg-[#181b1f] p-4 overflow-y-auto font-mono text-xs`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#30353b] mb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileTab('queue')}
                  className="lg:hidden px-2 py-1 bg-[#20242a] border border-[#30353b] rounded text-[#8d949d] hover:text-[#e5e7eb] text-xs font-bold"
                >
                  &larr; QUEUE
                </button>
                <div>
                  <div className="text-[10px] text-[#8d949d]">FAULT IDENTIFIER</div>
                  <div className="text-base font-bold text-[#e5e7eb]">{selectedFault.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-[#8d949d]">RECOVERY STATE</div>
                <div className="text-xs font-bold text-[#3f8f68]">AUTONOMOUS BACKUP ACTIVE</div>
              </div>
            </div>

            {/* Camera Diagnostics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">CAMERA SENSOR</div>
                <div className="text-sm font-bold text-[#e5e7eb] mt-0.5">{selectedFault.cameraName}</div>
                <div className="text-[10px] text-[#8d949d] mt-0.5">Fixed Thermal/Optical Sector Line</div>
              </div>

              <div className="p-3 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">CLASSIFICATION CONFIDENCE</div>
                <div className="text-sm font-bold text-[#c28a28] mt-0.5">
                  {(selectedFault.detectionConfidence * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-[#8d949d] mt-0.5">Physical Tamper / Lens Spray Detected</div>
              </div>
            </div>

            {/* Visual Feed from affected camera */}
            <div className="mb-4 space-y-1.5">
              <div className="text-[11px] text-[#8d949d] flex justify-between px-1">
                <span>FAULT FEED DIAGNOSTIC (OPTICAL CHANNEL)</span>
                <span className="text-[#c93c3c] font-bold">STREAM IMPAIRED</span>
              </div>
              <div className="h-48 border border-[#30353b] rounded overflow-hidden">
                <CameraFeed camera={affectedCam} showControls={false} />
              </div>
            </div>

            {/* Perimeter Coverage Impact */}
            <div className="p-3 rounded bg-[#20242a] border border-[#30353b] mb-4 space-y-2">
              <div className="text-[10px] text-[#8d949d] uppercase font-semibold">
                Perimeter Gap Impact Analysis
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-[#181b1f] border border-[#c93c3c]/40">
                  <div className="text-[10px] text-[#c93c3c]">COVERAGE LOST</div>
                  <div className="text-sm font-bold text-[#c93c3c] mt-0.5">-{selectedFault.coverageLostPercent}%</div>
                </div>
                <div className="p-2 rounded bg-[#181b1f] border border-[#3f8f68]/40">
                  <div className="text-[10px] text-[#3f8f68]">PTZ RESTORED</div>
                  <div className="text-sm font-bold text-[#3f8f68] mt-0.5">+{selectedFault.coverageRestoredPercent}%</div>
                </div>
                <div className="p-2 rounded bg-[#181b1f] border border-[#c28a28]/40">
                  <div className="text-[10px] text-[#c28a28]">RESIDUAL GAP</div>
                  <div className="text-sm font-bold text-[#c28a28] mt-0.5">{selectedFault.residualBlindZonePercent}%</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#30353b] flex items-center justify-between mt-auto">
              <div className="text-[11px] text-[#8d949d]">
                SHIELD Engine maintains active PTZ slew lock.
              </div>
              <button
                onClick={() => dispatchMaintenance(selectedFault.id)}
                disabled={selectedFault.maintenanceDispatched}
                className={`px-4 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                  selectedFault.maintenanceDispatched
                    ? 'bg-[#181b1f] border border-[#30353b] text-[#3f8f68]'
                    : 'bg-[#477da8] hover:bg-[#477da8]/90 text-white'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>
                  {selectedFault.maintenanceDispatched
                    ? `DISPATCHED (${selectedFault.maintenanceTicketId})`
                    : 'DISPATCH FIELD REPAIR'}
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`${
              mobileTab === 'dossier' ? 'flex' : 'hidden'
            } lg:flex col-span-12 lg:col-span-7 items-center justify-center text-xs text-[#8d949d] font-mono p-8`}
          >
            SELECT A FAULT TO INSPECT
          </div>
        )}
      </div>
    </div>
  );
};
export default ShieldFaults;
