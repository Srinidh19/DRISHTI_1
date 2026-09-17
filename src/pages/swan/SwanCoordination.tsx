import React, { useState } from 'react';
import {
  GitMerge,
  ArrowRight,
  ShieldAlert,
  Radio,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  Filter,
  Compass,
  Zap,
  Video,
} from 'lucide-react';
import { CameraFeed } from '../../components/video/CameraFeed';
import { useRealtime } from '../../context/RealtimeContext';
import type { Camera } from '../../types';

interface CoordinationEvent {
  id: string;
  timestamp: string;
  sourceCameraId: string;
  targetTrackId: string;
  classification: string;
  candidateCameras: {
    id: string;
    distanceMeters: number;
    score: number;
    status: 'selected' | 'standby' | 'rejected';
    reason: string;
  }[];
  selectedCameraId: string;
  watchRequestSent: string;
  confirmationTime: string;
  latencyMs: number;
  riskScore: number;
  predictedNextCameraId: string;
  unifiedIncidentId: string;
  reasoningNotes: string[];
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'REJECTED';
}

const COORDINATION_EVENTS: CoordinationEvent[] = [
  {
    id: 'COORD-2026-089',
    timestamp: '16:48:12 IST',
    sourceCameraId: 'CAM-03',
    targetTrackId: 'T-104',
    classification: 'Person (Infiltrator)',
    candidateCameras: [
      { id: 'CAM-04', distanceMeters: 48, score: 0.94, status: 'selected', reason: 'Optimal line-of-sight & forward corridor velocity match' },
      { id: 'CAM-06', distanceMeters: 140, score: 0.72, status: 'standby', reason: 'Secondary downstream camera along heading 042°' },
      { id: 'CAM-07', distanceMeters: 280, score: 0.31, status: 'rejected', reason: 'Obstructed by ridge elevation slope' },
    ],
    selectedCameraId: 'CAM-04',
    watchRequestSent: '16:48:14 IST',
    confirmationTime: '16:48:15 IST',
    latencyMs: 38,
    riskScore: 92,
    predictedNextCameraId: 'CAM-06',
    unifiedIncidentId: 'INC-2026-0142',
    reasoningNotes: [
      'Trajectory model predicts breach progression through Gully Bravo at 1.8 m/s',
      'CAM-04 PTZ slew command executed (+28° az, -4° el) via edge broker',
      'Feature vector embedding match: 94.2% cosine similarity across IR & thermal',
      'Distributed lock acquired by SWAN master node at BOP-17 edge cluster',
    ],
    status: 'CONFIRMED',
  },
  {
    id: 'COORD-2026-088',
    timestamp: '16:32:05 IST',
    sourceCameraId: 'CAM-06',
    targetTrackId: 'T-118',
    classification: 'Vehicle (All-Terrain)',
    candidateCameras: [
      { id: 'CAM-ROAD-05', distanceMeters: 85, score: 0.89, status: 'selected', reason: 'Roadway intersection coverage' },
      { id: 'CAM-TOWER-01', distanceMeters: 220, score: 0.65, status: 'standby', reason: 'Elevated panoramic backup' },
    ],
    selectedCameraId: 'CAM-ROAD-05',
    watchRequestSent: '16:32:07 IST',
    confirmationTime: '16:32:09 IST',
    latencyMs: 54,
    riskScore: 78,
    predictedNextCameraId: 'CAM-TOWER-01',
    unifiedIncidentId: 'INC-2026-0143',
    reasoningNotes: [
      'Vehicle velocity 34 km/h approaching perimeter track junction',
      'Optical OCR license tag scan initiated on CAM-ROAD-05',
      'SWAN handoff packet relayed through MQTT broker on edge gateway',
    ],
    status: 'CONFIRMED',
  },
  {
    id: 'COORD-2026-085',
    timestamp: '15:58:40 IST',
    sourceCameraId: 'CAM-11',
    targetTrackId: 'T-203',
    classification: 'UAV / Drone',
    candidateCameras: [
      { id: 'CAM-TOWER-01', distanceMeters: 160, score: 0.91, status: 'selected', reason: 'High-elevation optical tracker with 30x zoom' },
      { id: 'CAM-07', distanceMeters: 190, score: 0.44, status: 'standby', reason: 'Ground level acoustic verification only' },
    ],
    selectedCameraId: 'CAM-TOWER-01',
    watchRequestSent: '15:58:42 IST',
    confirmationTime: '15:58:44 IST',
    latencyMs: 42,
    riskScore: 84,
    predictedNextCameraId: 'CAM-TOWER-01',
    unifiedIncidentId: 'INC-2026-0139',
    reasoningNotes: [
      'RF micro-doppler radar matched rotary wing acoustic signature',
      'CAM-TOWER-01 skyward tilt elevated to +38°',
      'Visual acquisition confirmed at 140m AGL altitude',
    ],
    status: 'CONFIRMED',
  },
];

export const SwanCoordination: React.FC = () => {
  const { cameras, activeTracks } = useRealtime();
  const [selectedEventId, setSelectedEventId] = useState<string>('COORD-2026-089');
  const [filterQuery, setFilterQuery] = useState('');

  const selectedEvent = COORDINATION_EVENTS.find((e) => e.id === selectedEventId) || COORDINATION_EVENTS[0];
  const sourceCam = cameras.find((c: Camera) => c.id === selectedEvent.sourceCameraId);
  const selectedCam = cameras.find((c: Camera) => c.id === selectedEvent.selectedCameraId);

  const filteredEvents = COORDINATION_EVENTS.filter(
    (e) =>
      e.id.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.targetTrackId.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.sourceCameraId.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111315] text-[#e5e7eb] overflow-hidden">
      {/* Tactical Sub-Header */}
      <div className="min-h-12 py-2 border-b border-[#30353b] bg-[#181b1f] px-3 sm:px-4 flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <GitMerge className="w-4 h-4 text-[#477da8]" />
            <span className="text-sm font-semibold tracking-wider text-[#e5e7eb]">
              SWAN COORDINATION ENGINE
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] font-mono hidden sm:inline">
            DISTRIBUTED EDGE FUSION & HANDOFF PIPELINE
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs font-mono flex-wrap">
          <div className="flex items-center gap-1.5 text-[#8d949d]">
            <Radio className="w-3.5 h-3.5 text-[#3f8f68] animate-pulse" />
            <span>SWAN BROKER:</span>
            <span className="text-[#e5e7eb]">ONLINE</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#8d949d]">
            <Activity className="w-3.5 h-3.5 text-[#477da8]" />
            <span>LATENCY:</span>
            <span className="text-[#3f8f68]">38 MS</span>
          </div>
          <button className="px-2 py-1 rounded bg-[#20242a] border border-[#30353b] hover:bg-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] flex items-center gap-1 transition-colors">
            <RefreshCw className="w-3 h-3" />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {/* 3-Column Tactical Workspace (Stacks on mobile, 3-col on desktop) */}
      <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 min-h-0 divide-y lg:divide-y-0 lg:divide-x divide-[#30353b] overflow-y-auto lg:overflow-hidden">
        {/* LEFT COLUMN: Coordination & Handoff Event Log (col-span-3) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col min-h-[220px] max-h-[300px] lg:max-h-none lg:min-h-0 bg-[#14171a] shrink-0">
          <div className="p-3 border-b border-[#30353b] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-[#8d949d]">
              <span className="font-semibold text-[#e5e7eb]">COORDINATION QUEUE</span>
              <span>{filteredEvents.length} EVENTS</span>
            </div>
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8d949d]" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter by ID, track, or camera..."
                className="w-full bg-[#181b1f] border border-[#30353b] rounded pl-8 pr-3 py-1.5 text-xs text-[#e5e7eb] placeholder-[#8d949d] focus:outline-none focus:border-[#477da8]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-[#30353b]/60">
            {filteredEvents.map((evt) => {
              const isSelected = evt.id === selectedEventId;
              return (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEventId(evt.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-[#20242a] border-l-2 border-l-[#477da8]'
                      : 'hover:bg-[#181b1f]/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-semibold text-[#e5e7eb]">
                      {evt.id}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#3f8f68]/20 text-[#3f8f68] border border-[#3f8f68]/40">
                      {evt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono mb-2">
                    <span className="text-[#8d949d]">{evt.sourceCameraId}</span>
                    <ArrowRight className="w-3 h-3 text-[#477da8]" />
                    <span className="text-[#3f8f68] font-bold">{evt.selectedCameraId}</span>
                    <span className="text-[#8d949d] ml-auto">({evt.targetTrackId})</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#8d949d]">
                    <span>{evt.timestamp}</span>
                    <span className="font-mono text-[#c93c3c]">RISK: {evt.riskScore}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER COLUMN: Visual Handoff & Dual Synchronized Surveillance Feeds (col-span-5) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col min-h-0 bg-[#111315] p-3 gap-3 overflow-y-auto">
          {/* Handoff Step Pipeline */}
          <div className="bg-[#181b1f] border border-[#30353b] rounded p-3">
            <div className="text-xs font-mono text-[#8d949d] mb-2 flex items-center justify-between">
              <span>PIPELINE EXECUTION FLOW</span>
              <span className="text-[#3f8f68]">CONFIRMED &bull; {selectedEvent.latencyMs}ms</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px] font-mono">
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[#8d949d] text-[10px]">STEP 1</div>
                <div className="text-[#e5e7eb] font-semibold mt-0.5">DETECTION</div>
                <div className="text-[10px] text-[#477da8] mt-1">{selectedEvent.sourceCameraId}</div>
              </div>
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[#8d949d] text-[10px]">STEP 2</div>
                <div className="text-[#e5e7eb] font-semibold mt-0.5">WATCH REQ</div>
                <div className="text-[10px] text-[#c28a28] mt-1">BROADCAST</div>
              </div>
              <div className="p-2 rounded bg-[#20242a] border border-[#3f8f68]/40 bg-[#3f8f68]/10">
                <div className="text-[#3f8f68] text-[10px]">STEP 3</div>
                <div className="text-[#3f8f68] font-semibold mt-0.5">CONFIRM</div>
                <div className="text-[10px] text-[#3f8f68] mt-1">{selectedEvent.selectedCameraId}</div>
              </div>
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[#8d949d] text-[10px]">STEP 4</div>
                <div className="text-[#e5e7eb] font-semibold mt-0.5">PREDICTION</div>
                <div className="text-[10px] text-[#8d949d] mt-1">{selectedEvent.predictedNextCameraId}</div>
              </div>
            </div>
          </div>

          {/* Synchronized Feeds: Source vs Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-mono text-[#8d949d] flex items-center justify-between px-1">
                <span>ORIGIN CAMERA FEED</span>
                <span className="text-[#e5e7eb] font-semibold">{selectedEvent.sourceCameraId}</span>
              </div>
              {sourceCam ? (
                <CameraFeed camera={sourceCam} showControls={false} />
              ) : (
                <div className="h-44 bg-[#181b1f] border border-[#30353b] rounded flex items-center justify-center text-xs text-[#8d949d]">
                  FEED OFFLINE
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="text-[11px] font-mono text-[#8d949d] flex items-center justify-between px-1">
                <span>HANDOFF TARGET FEED</span>
                <span className="text-[#3f8f68] font-semibold">{selectedEvent.selectedCameraId}</span>
              </div>
              {selectedCam ? (
                <CameraFeed camera={selectedCam} showControls={false} />
              ) : (
                <div className="h-44 bg-[#181b1f] border border-[#30353b] rounded flex items-center justify-center text-xs text-[#8d949d]">
                  FEED OFFLINE
                </div>
              )}
            </div>
          </div>

          {/* Candidate Adjacency Evaluation Matrix */}
          <div className="bg-[#181b1f] border border-[#30353b] rounded p-3 flex-1 flex flex-col min-h-0">
            <div className="text-xs font-mono text-[#8d949d] mb-2 flex items-center justify-between">
              <span>CANDIDATE NEIGHBOR EVALUATION MATRIX</span>
              <span>{selectedEvent.candidateCameras.length} CANDIDATES</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {selectedEvent.candidateCameras.map((cand) => (
                <div
                  key={cand.id}
                  className={`p-2.5 rounded border text-xs font-mono ${
                    cand.status === 'selected'
                      ? 'bg-[#3f8f68]/10 border-[#3f8f68]/50'
                      : cand.status === 'standby'
                      ? 'bg-[#20242a] border-[#30353b]'
                      : 'bg-[#20242a]/40 border-[#30353b]/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Video className="w-3.5 h-3.5 text-[#8d949d]" />
                      <span className="font-bold text-[#e5e7eb]">{cand.id}</span>
                      <span className="text-[10px] text-[#8d949d]">
                        {cand.distanceMeters}m away
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#8d949d]">SCORE:</span>
                      <span
                        className={`font-semibold ${
                          cand.score >= 0.8
                            ? 'text-[#3f8f68]'
                            : cand.score >= 0.5
                            ? 'text-[#c28a28]'
                            : 'text-[#c93c3c]'
                        }`}
                      >
                        {(cand.score * 100).toFixed(0)}%
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                          cand.status === 'selected'
                            ? 'bg-[#3f8f68]/20 text-[#3f8f68]'
                            : cand.status === 'standby'
                            ? 'bg-[#c28a28]/20 text-[#c28a28]'
                            : 'bg-[#30353b] text-[#8d949d]'
                        }`}
                      >
                        {cand.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-[11px] text-[#8d949d] pl-5">{cand.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Coordination Event Detail & Reasoning (col-span-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col min-h-0 bg-[#181b1f] p-3 sm:p-4 overflow-y-auto">
          <div className="flex items-center justify-between pb-3 border-b border-[#30353b] mb-4">
            <div>
              <div className="text-xs font-mono text-[#8d949d]">HANDOFF DOSSIER</div>
              <div className="text-base font-bold text-[#e5e7eb] font-mono">{selectedEvent.id}</div>
            </div>
            <div className="text-right font-mono">
              <div className="text-[10px] text-[#8d949d]">UNIFIED INCIDENT</div>
              <div className="text-xs font-semibold text-[#c93c3c]">{selectedEvent.unifiedIncidentId}</div>
            </div>
          </div>

          {/* Key Parameters */}
          <div className="space-y-3 mb-4">
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">TARGET TRACK</div>
                <div className="text-[#e5e7eb] font-semibold mt-0.5">{selectedEvent.targetTrackId}</div>
                <div className="text-[10px] text-[#8d949d] truncate mt-0.5">{selectedEvent.classification}</div>
              </div>
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">RISK FUSION SCORE</div>
                <div className="text-[#c93c3c] font-bold text-sm mt-0.5">{selectedEvent.riskScore} / 100</div>
                <div className="text-[10px] text-[#8d949d] mt-0.5">CRITICAL BREACH</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">WATCH REQ SENT</div>
                <div className="text-[#e5e7eb] mt-0.5">{selectedEvent.watchRequestSent}</div>
              </div>
              <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">CONFIRMATION</div>
                <div className="text-[#3f8f68] font-semibold mt-0.5">{selectedEvent.confirmationTime}</div>
              </div>
            </div>

            <div className="p-2 rounded bg-[#20242a] border border-[#30353b] text-xs font-mono">
              <div className="text-[10px] text-[#8d949d]">PREDICTED NEXT VECTOR</div>
              <div className="flex items-center gap-2 mt-1">
                <Compass className="w-3.5 h-3.5 text-[#477da8]" />
                <span className="text-[#e5e7eb]">SECTOR 4 INTERCEPT VIA</span>
                <span className="text-[#3f8f68] font-bold">{selectedEvent.predictedNextCameraId}</span>
              </div>
            </div>
          </div>

          {/* SWAN Reasoning Engine Log */}
          <div className="border border-[#30353b] rounded bg-[#111315] p-3 mb-4 flex-1">
            <div className="text-xs font-mono text-[#8d949d] mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#477da8]" />
              <span className="font-semibold text-[#e5e7eb]">SWAN DISTRIBUTED REASONING LOG</span>
            </div>
            <div className="space-y-2 text-xs font-mono text-[#8d949d]">
              {selectedEvent.reasoningNotes.map((note, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-[#477da8]">&bull;</span>
                  <span className="text-[#e5e7eb]/90 leading-relaxed">{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operator Verification Actions */}
          <div className="pt-3 border-t border-[#30353b] flex gap-2">
            <button className="flex-1 py-2 rounded bg-[#3f8f68] hover:bg-[#3f8f68]/90 text-white font-mono text-xs font-semibold transition-colors">
              CONFIRM HANDOFF
            </button>
            <button className="px-3 py-2 rounded bg-[#20242a] border border-[#30353b] hover:bg-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] font-mono text-xs transition-colors">
              OVERRIDE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SwanCoordination;
