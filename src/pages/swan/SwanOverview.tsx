import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRealtime } from '../../context/RealtimeContext';
import {
  Activity,
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  Clock,
  Layers,
  ChevronDown,
  ChevronUp,
  Radio,
  Compass,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

export const SwanOverview: React.FC = () => {
  const { activeTracks, swanRequests } = useRealtime();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState<boolean>(false);

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-y-auto select-none">
      {/* Subsystem Navigation Bar */}
      <div className="px-3 py-2 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-surface-2 border border-border flex items-center justify-center">
            <Activity className="w-3.5 h-3.5 text-info" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-text uppercase tracking-wider">SWAN</h1>
              <span className="text-2xs text-text-dim">|</span>
              <span className="text-xs text-text-muted">SMART WATCH & ALERT NETWORK</span>
              <span className="flex items-center gap-1 text-[10px] text-info font-bold px-1.5 py-0.2 rounded bg-info-bg border border-info-border">
                <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Real Navigation Subroutes */}
        <div className="flex items-center gap-1 bg-surface-2 p-0.5 rounded border border-border text-2xs overflow-x-auto max-w-full">
          <Link
            to="/app/swan/overview"
            className="px-2.5 py-1 rounded bg-surface-3 text-white font-bold transition-colors shadow"
          >
            OVERVIEW
          </Link>
          <Link
            to="/app/swan/tracks"
            className="px-2.5 py-1 rounded text-text-muted hover:text-text hover:bg-surface-3/50 transition-colors"
          >
            ACTIVE TRACKS ({activeTracks.length})
          </Link>
          <Link
            to="/app/swan/coordination"
            className="px-2.5 py-1 rounded text-text-muted hover:text-text hover:bg-surface-3/50 transition-colors"
          >
            COORDINATION ({swanRequests.length})
          </Link>
        </div>
      </div>

      {/* Main Operational Body */}
      <div className="p-4 space-y-4 max-w-5xl mx-auto w-full">
        {/* Core KPI Strip: Clean, restrained operational counts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase font-semibold tracking-wider">
              ACTIVE TRACKS
            </span>
            <div className="text-2xl font-bold text-critical mt-1">2</div>
            <span className="text-[10px] text-text-muted mt-0.5 block">
              Coordinated Target Handoffs
            </span>
          </div>

          <div className="p-3.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase font-semibold tracking-wider">
              CAMERAS COORDINATING
            </span>
            <div className="text-2xl font-bold text-info mt-1">4</div>
            <span className="text-[10px] text-text-muted mt-0.5 block">
              CAM-03 &bull; CAM-04 &bull; CAM-06 &bull; CAM-07
            </span>
          </div>

          <div className="p-3.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase font-semibold tracking-wider">
              ACTIVE HANDOFFS
            </span>
            <div className="text-2xl font-bold text-success mt-1">1</div>
            <span className="text-[10px] text-text-muted mt-0.5 block">
              Sector Corridor Beta Traversal
            </span>
          </div>
        </div>

        {/* Main Operational Visualization Card */}
        <div className="bg-surface border border-border rounded p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-info" />
              <span className="font-bold text-text uppercase tracking-wider text-xs">
                OPERATIONAL HANDOFF PIPELINE & TARGET CONTINUITY
              </span>
            </div>
            <span className="text-2xs text-text-dim font-mono">
              TARGET T-104 MULTI-CAMERA SEQUENCE
            </span>
          </div>

          {/* Core Pipeline Visualization: CAM-03 -> T-104 -> CAM-04 -> CAM-06 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1: CAM-03 (DETECTED) */}
            <div className="p-3.5 rounded bg-surface-2 border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-text-dim font-bold">NODE 01</span>
                <span className="px-1.5 py-0.5 rounded bg-info-bg text-info border border-info-border text-[9px] font-bold">
                  DETECTED
                </span>
              </div>
              <div className="text-sm font-bold text-text">CAM-03</div>
              <div className="text-[11px] text-text-muted">
                Initial boundary acquisition at North Fence Corridor.
              </div>
            </div>

            {/* Step 2: Target T-104 (PREDICTED) */}
            <div className="p-3.5 rounded bg-surface-2 border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-text-dim font-bold">TARGET ENTITY</span>
                <span className="px-1.5 py-0.5 rounded bg-warning-bg text-warning border border-warning-border text-[9px] font-bold">
                  PREDICTED
                </span>
              </div>
              <div className="text-sm font-bold text-critical">T-104</div>
              <div className="text-[11px] text-text-muted">
                Bearing 138° SE. Trajectory calculated toward Sector Beta.
              </div>
            </div>

            {/* Step 3: CAM-04 (TRACKING REQUESTED) */}
            <div className="p-3.5 rounded bg-surface-2 border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-text-dim font-bold">NODE 02</span>
                <span className="px-1.5 py-0.5 rounded bg-info-bg text-info border border-info-border text-[9px] font-bold">
                  TRACKING REQUESTED
                </span>
              </div>
              <div className="text-sm font-bold text-text">CAM-04</div>
              <div className="text-[11px] text-text-muted">
                Neighbouring camera pre-alerted. Field of view armed.
              </div>
            </div>

            {/* Step 4: CAM-06 (CONFIRMED) */}
            <div className="p-3.5 rounded bg-surface-2 border border-border space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-2xs text-text-dim font-bold">NODE 03</span>
                <span className="px-1.5 py-0.5 rounded bg-success-bg text-success border border-success-border text-[9px] font-bold">
                  CONFIRMED
                </span>
              </div>
              <div className="text-sm font-bold text-text">CAM-06</div>
              <div className="text-[11px] text-text-muted">
                PTZ overwatch locked. 94% Re-ID cosine similarity match.
              </div>
            </div>
          </div>

          {/* Operational Doctrine Summary */}
          <div className="p-3 rounded bg-surface-2 border border-border/80 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
            <p className="text-xs text-text-muted leading-relaxed">
              <strong className="text-text font-semibold">SWAN Doctrine: </strong>
              SWAN coordinates relevant neighbouring cameras to maintain target continuity, verify observations and consolidate events into a single, unified incident.
            </p>
          </div>
        </div>

        {/* Expandable Technical Details Section */}
        <div className="bg-surface border border-border rounded overflow-hidden">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full p-3 bg-surface-2 hover:bg-surface-3 flex items-center justify-between text-xs font-bold text-text transition-colors"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-info" />
              <span>TECHNICAL ARCHITECTURE & PROTOCOL TELEMETRY</span>
            </span>
            <div className="flex items-center gap-1.5 text-text-dim text-2xs font-normal">
              <span>{showTechnicalDetails ? 'HIDE' : 'VIEW DETAILS'}</span>
              {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </div>
          </button>

          {showTechnicalDetails && (
            <div className="p-4 space-y-4 border-t border-border bg-surface text-2xs font-mono">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded bg-surface-2 border border-border space-y-2">
                  <div className="font-bold text-text text-xs uppercase">
                    Spatial Adjacency Graph
                  </div>
                  <div className="space-y-1.5 text-text-muted">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>CAM-03 &rarr; CAM-04:</span>
                      <span className="text-success font-semibold">48m Visual Overlap (138° SE)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>CAM-04 &rarr; CAM-06:</span>
                      <span className="text-success font-semibold">62m Elevation Overlap (168° S)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Gossip Protocol Latency:</span>
                      <span className="text-info font-semibold">8ms Inter-Node ZeroMQ</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-surface-2 border border-border space-y-2">
                  <div className="font-bold text-text text-xs uppercase">
                    Deep Feature Re-ID Engine
                  </div>
                  <div className="space-y-1.5 text-text-muted">
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>Embedding Model:</span>
                      <span className="text-text font-semibold">OSNet Hardened (512-dim)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-border/50">
                      <span>Cosine Similarity Threshold:</span>
                      <span className="text-info font-semibold">&gt; 0.85 (Achieved: 0.94)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Kalman State Filter:</span>
                      <span className="text-success font-semibold">Continuous Velocity Lock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SwanOverview;
