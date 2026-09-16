import React from 'react';
import { Link } from 'react-router-dom';
import { useRealtime } from '../../context/RealtimeContext';
import {
  Activity,
  ArrowRight,
  ArrowDown,
  Radio,
  CheckCircle2,
  Clock,
  Layers,
  Shield,
  AlertTriangle,
  Play,
  Cpu,
  Compass,
  ExternalLink
} from 'lucide-react';

export const SwanOverview: React.FC = () => {
  const {
    activeTracks,
    swanRequests,
    cameras,
    simulateTrack,
    currentDemoStep
  } = useRealtime();

  const activeTrack = activeTracks.find(t => t.id === 'T-104') || activeTracks[0];

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
              <span className="text-xs text-text-muted">Distributed Intelligence & Handoff Network</span>
              <span className="flex items-center gap-1 text-[10px] text-info font-bold px-1.5 py-0.2 rounded bg-info-bg border border-info-border">
                <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Real Navigation Subroutes */}
        <div className="flex items-center gap-1 bg-surface-2 p-0.5 rounded border border-border text-2xs">
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

      {/* Main Overview Body */}
      <div className="p-3 space-y-3">
        {/* KPI Strip: System Status & Coordination Health */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-2xs">
          <div className="p-2.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase">COORDINATION STATE</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-bold text-text">FULLY ENGAGED</span>
            </div>
            <span className="text-[10px] text-text-muted mt-0.5 block">Handoff latency: 14ms</span>
          </div>

          <div className="p-2.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase">ACTIVE COORDINATED TRACKS</span>
            <div className="text-sm font-bold text-critical mt-1">
              {activeTracks.length} Target ({activeTrack?.id || 'T-104'})
            </div>
            <span className="text-[10px] text-text-muted mt-0.5 block">Cross-camera correlation verified</span>
          </div>

          <div className="p-2.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase">RE-ID EMBEDDING MATCH</span>
            <div className="text-sm font-bold text-success mt-1">92% Cosine Sim</div>
            <span className="text-[10px] text-text-muted mt-0.5 block">CAM-03 ↔ CAM-04 corroborate</span>
          </div>

          <div className="p-2.5 rounded bg-surface border border-border">
            <span className="text-text-dim block text-[10px] uppercase">PREDICTIVE LEAD TIME</span>
            <div className="text-sm font-bold text-info mt-1">6.2s to CAM-06</div>
            <span className="text-[10px] text-text-muted mt-0.5 block">Heading: 168° South (4.5 km/h)</span>
          </div>
        </div>

        {/* SECTION: OPERATIONAL MULTI-CAMERA RELATIONSHIP FLOW */}
        <div className="bg-surface border border-border rounded p-3 space-y-2">
          <div className="flex items-center justify-between border-b border-border pb-1.5">
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-info" />
              <span className="font-bold text-text uppercase tracking-wider text-xs">
                Operational Correlation & Decision Chain
              </span>
            </div>
            <span className="text-[10px] text-text-dim font-mono">
              Live Scenario Flow (Target T-104 Corridor)
            </span>
          </div>

          {/* Operational Relationship Chain Diagram */}
          <div className="p-3 bg-surface-2 rounded border border-border flex flex-wrap items-center justify-between gap-2 text-2xs overflow-x-auto">
            {/* Step 1: CAM-03 Detection */}
            <div className="p-2 rounded bg-surface border border-border min-w-[120px] shrink-0">
              <div className="text-text-dim text-[10px]">ORIGIN SENSOR</div>
              <div className="font-bold text-text text-xs mt-0.5">CAM-03</div>
              <div className="text-[10px] text-success">Acquires Target</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 2: Target T-104 */}
            <div className="p-2 rounded bg-surface border border-critical min-w-[120px] shrink-0">
              <div className="text-text-dim text-[10px]">TARGET ACQUIRED</div>
              <div className="font-bold text-critical text-xs mt-0.5">T-104 (Person x2)</div>
              <div className="text-[10px] text-text-muted">ByteTrack established</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 3: Fence Cross */}
            <div className="p-2 rounded bg-surface border border-warning min-w-[130px] shrink-0">
              <div className="text-text-dim text-[10px]">PERIMETER EVENT</div>
              <div className="font-bold text-warning text-xs mt-0.5">Fence Alpha Cross</div>
              <div className="text-[10px] text-text-muted">High-security breach</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 4: SWAN Node Selection */}
            <div className="p-2 rounded bg-surface border border-info min-w-[130px] shrink-0">
              <div className="text-text-dim text-[10px]">SWAN GRAPH ANALYST</div>
              <div className="font-bold text-info text-xs mt-0.5">CAM-04 Selected</div>
              <div className="text-[10px] text-text-muted">Adjacency vector 168°</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 5: CAM-04 Corroboration */}
            <div className="p-2 rounded bg-surface border border-success min-w-[130px] shrink-0">
              <div className="text-text-dim text-[10px]">MULTI-CAM VERIFY</div>
              <div className="font-bold text-success text-xs mt-0.5">CAM-04 Confirms</div>
              <div className="text-[10px] text-text-muted">Re-ID Cosine: 0.92</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 6: Risk Escalation */}
            <div className="p-2 rounded bg-surface border border-critical min-w-[130px] shrink-0">
              <div className="text-text-dim text-[10px]">FUSED RISK SCORE</div>
              <div className="font-bold text-critical text-xs mt-0.5">92/100 CRITICAL</div>
              <div className="text-[10px] text-text-muted">Multi-sensor corroborated</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 7: Predictive Next Node */}
            <div className="p-2 rounded bg-surface border border-border min-w-[130px] shrink-0">
              <div className="text-text-dim text-[10px]">PREDICTIVE HANDOFF</div>
              <div className="font-bold text-info text-xs mt-0.5">CAM-06 (Ridge)</div>
              <div className="text-[10px] text-text-muted">Watch request dispatched</div>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-text-dim shrink-0" />

            {/* Step 8: Master Incident */}
            <div className="p-2 rounded bg-surface border border-critical min-w-[120px] shrink-0">
              <div className="text-text-dim text-[10px]">CONSOLIDATED INCIDENT</div>
              <div className="font-bold text-critical text-xs mt-0.5">INC-2026-0142</div>
              <div className="text-[10px] text-text-muted">Ready for operator</div>
            </div>
          </div>
        </div>

        {/* 2-COLUMN SECTION: Camera Adjacency Topology & Recent SWAN Confirmations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Spatial Neighbor Adjacency Topology */}
          <div className="bg-surface border border-border rounded flex flex-col">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-info" />
                <span>Sector Camera Graph Adjacency</span>
              </span>
              <span className="text-[10px] text-text-dim">Spatial Field-of-View Overlaps</span>
            </div>

            <div className="p-3 space-y-2">
              <div className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between text-2xs">
                <div>
                  <span className="font-bold text-text">CAM-03 (Fence B IR)</span>
                  <span className="text-text-dim text-[10px] block">Coordinates: 32.7350° N, 74.8640° E</span>
                </div>
                <div className="text-right">
                  <span className="text-info font-semibold text-[10px]">Neighbors: CAM-04, CAM-07</span>
                  <span className="text-success text-[10px] block font-medium">Handoff Link Active</span>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between text-2xs">
                <div>
                  <span className="font-bold text-text">CAM-04 (East Tower Optical)</span>
                  <span className="text-text-dim text-[10px] block">Coordinates: 32.7335° N, 74.8680° E</span>
                </div>
                <div className="text-right">
                  <span className="text-info font-semibold text-[10px]">Neighbors: CAM-03, CAM-06</span>
                  <span className="text-critical text-[10px] block font-bold">Tracking T-104</span>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between text-2xs">
                <div>
                  <span className="font-bold text-text">CAM-06 (Ridge Watch)</span>
                  <span className="text-text-dim text-[10px] block">Coordinates: 32.7315° N, 74.8720° E</span>
                </div>
                <div className="text-right">
                  <span className="text-info font-semibold text-[10px]">Neighbors: CAM-04, CAM-11</span>
                  <span className="text-warning text-[10px] block font-medium">Pre-alert Active</span>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between text-2xs">
                <div>
                  <span className="font-bold text-text">CAM-TOWER-01 (High Ground PTZ)</span>
                  <span className="text-text-dim text-[10px] block">Coordinates: 32.7360° N, 74.8610° E</span>
                </div>
                <div className="text-right">
                  <span className="text-[#477da8] font-semibold text-[10px]">SHIELD Backup Ready</span>
                  <span className="text-text-muted text-[10px] block">Standby Overwatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent SWAN Events & Confirmations */}
          <div className="bg-surface border border-border rounded flex flex-col">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-text-muted" />
                <span>SWAN Event Timeline</span>
              </span>
              <span className="text-[10px] text-text-dim">Last 15 minutes</span>
            </div>

            <div className="p-3 space-y-2 text-2xs overflow-y-auto max-h-64">
              <div className="p-2 rounded bg-surface-2 border-l-2 border-critical flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-critical shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">CAM-04 Confirms Target T-104</span>
                    <span className="text-text-dim text-[10px]">14:32:45 IST</span>
                  </div>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Multi-camera Re-ID confirmed with 92% confidence. Fused risk score escalated to 92/100 (CRITICAL).
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-2 border-l-2 border-info flex items-start gap-2">
                <Radio className="w-3.5 h-3.5 text-info shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">Watch Request Dispatched (SWAN-REQ-0042)</span>
                    <span className="text-text-dim text-[10px]">14:32:38 IST</span>
                  </div>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    SWAN calculated trajectory vector heading 168° from CAM-03 toward CAM-04 field-of-view.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-2 border-l-2 border-warning flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">Virtual Fence Alpha Breached</span>
                    <span className="text-text-dim text-[10px]">14:32:20 IST</span>
                  </div>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    Target crossed Zero Line restricted boundary into secondary buffer zone.
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-surface-2 border-l-2 border-success flex items-start gap-2">
                <Activity className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-text">Target T-104 Acquired by YOLO Edge AI</span>
                    <span className="text-text-dim text-[10px]">14:31:58 IST</span>
                  </div>
                  <p className="text-text-muted text-[11px] mt-0.5">
                    CAM-03 registered 2 human pedestrian signatures in North Sector patrol strip.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
