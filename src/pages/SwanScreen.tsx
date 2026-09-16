import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { CameraFeed } from '../components/video/CameraFeed';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  Cpu
} from 'lucide-react';

export const SwanScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    activeTracks,
    swanRequests,
    cameras,
    simulateTrack,
    currentDemoStep,
    runDemoStep
  } = useRealtime();

  const [isSimulating, setIsSimulating] = useState(false);

  // Subview tab
  let currentTab: 'overview' | 'tracks' | 'coordination' = 'overview';
  if (location.pathname.endsWith('/tracks')) currentTab = 'tracks';
  else if (location.pathname.endsWith('/coordination')) currentTab = 'coordination';

  const activeTrack = activeTracks.find(t => t.id === 'T-104') || activeTracks[0];

  const handleSimulateTrack = () => {
    setIsSimulating(true);
    simulateTrack();
    setTimeout(() => setIsSimulating(false), 4000);
  };

  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const cam4 = cameras.find(c => c.id === 'CAM-04') || cameras[3];
  const cam6 = cameras.find(c => c.id === 'CAM-06') || cameras[5];

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-y-auto select-none">
      {/* Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-surface-2 border border-border flex items-center justify-center">
            <Activity className="w-4 h-4 text-info" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-text uppercase tracking-wider">SWAN</h1>
              <span className="text-2xs text-text-muted">|</span>
              <span className="text-xs text-text-muted">SMART WATCH AND ALERT NETWORK</span>
              <span className="flex items-center gap-1 text-2xs text-info font-bold px-2 py-0.5 rounded bg-info-bg border border-info-border">
                <span className="w-1.5 h-1.5 rounded-full bg-info animate-pulse" />
                ACTIVE
              </span>
            </div>
            <p className="text-2xs text-text-dim mt-0.5">
              Multi-camera tracking • Neighbouring camera handoff • Predictive routing
            </p>
          </div>
        </div>

        {/* Action Button: SIMULATE TRACK */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateTrack}
            disabled={isSimulating}
            className={`flex items-center gap-1.5 px-3 py-1.5 border rounded font-semibold text-xs transition-colors ${
              isSimulating
                ? 'bg-info/30 border-info text-white'
                : 'bg-info hover:bg-info/80 border-info text-white'
            }`}
            title="Execute live SWAN tracking and camera handoff simulation"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'SIMULATING HANDOFF...' : 'SIMULATE TRACK'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-3 py-1.5 bg-surface-2 border-b border-border flex items-center gap-2 text-2xs">
        <Link
          to="/app/swan"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'overview'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          COORDINATION CONSOLE
        </Link>
        <Link
          to="/app/swan/tracks"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'tracks'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          ACTIVE TARGETS ({activeTracks.length})
        </Link>
        <Link
          to="/app/swan/coordination"
          className={`px-3 py-1 rounded transition-colors ${
            currentTab === 'coordination'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          WATCH REQUEST MATRIX ({swanRequests.length})
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="p-3 space-y-3">
        {/* Top 3-Column Split: Active Watch Panel | Camera Topology Graph | Handoff Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Panel 1: Active Watch Details */}
          <div className="bg-surface border border-border rounded flex flex-col">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-info" />
                <span>Active Watch</span>
              </span>
              <span className="text-2xs text-critical font-bold">PRIORITY: HIGH</span>
            </div>

            <div className="p-3 space-y-3">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="text-text-dim uppercase text-2xs">TARGET IDENTIFIER</span>
                <span className="font-bold text-base text-critical">Track {activeTrack.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-2xs">
                <div className="p-2 rounded bg-surface-2 border border-border">
                  <span className="text-text-dim block">ORIGIN</span>
                  <span className="text-sm font-bold text-text">{activeTrack.originCamera}</span>
                </div>
                <div className="p-2 rounded bg-surface-2 border border-border">
                  <span className="text-text-dim block">CURRENT</span>
                  <span className="text-sm font-bold text-critical">{activeTrack.currentCamera}</span>
                </div>
                <div className="p-2 rounded bg-surface-2 border border-border">
                  <span className="text-text-dim block">DIRECTION</span>
                  <span className="text-sm font-bold text-text">{activeTrack.direction}</span>
                </div>
                <div className="p-2 rounded bg-surface-2 border border-border">
                  <span className="text-text-dim block">PREDICTED NEXT</span>
                  <span className="text-sm font-bold text-info">
                    {activeTrack.predictedNextCamera}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-surface-2 border border-border space-y-1 text-2xs">
                <div className="flex justify-between text-text-muted">
                  <span>Persistence:</span>
                  <span className="text-text font-bold">00:{activeTrack.activeDurationSeconds}s</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Speed:</span>
                  <span className="text-text font-bold">{activeTrack.currentSpeedKmh} km/h</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Fusion Confidence:</span>
                  <span className="text-success font-bold">
                    {(activeTrack.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Panel 2: Camera Topology Graph */}
          <div className="bg-surface border border-border rounded flex flex-col">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-info" />
                <span>SWAN Camera Graph Topology</span>
              </span>
              <span className="text-2xs text-text-dim">Spatial Adjacency</span>
            </div>

            <div className="p-4 flex-1 flex flex-col items-center justify-around space-y-2">
              {/* CAM-03 NODE */}
              <div className="w-full max-w-xs p-2 rounded bg-surface-2 border border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-success" />
                  <span className="font-bold text-text">CAM-03 (Fence B IR)</span>
                </div>
                <span className="text-2xs text-text-dim">ORIGIN ACQUIRED</span>
              </div>

              <div className="flex items-center gap-2 text-text-dim">
                <ArrowDown className="w-4 h-4 text-info animate-bounce" />
                <span className="text-2xs text-info">Target Handoff Vector (168°)</span>
              </div>

              {/* CAM-04 NODE */}
              <div className="w-full max-w-xs p-2 rounded bg-surface-3 border-2 border-critical flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-critical animate-ping" />
                  <span className="font-bold text-text">CAM-04 (East Tower)</span>
                </div>
                <span className="text-2xs px-1.5 py-0.2 rounded bg-critical-bg text-critical font-bold">
                  ACTIVE TRACK
                </span>
              </div>

              <div className="flex items-center gap-2 text-text-dim">
                <ArrowDown className="w-4 h-4 text-text-muted" />
                <span className="text-2xs text-text-muted">Predictive Watch Handoff</span>
              </div>

              {/* CAM-06 NODE */}
              <div className="w-full max-w-xs p-2 rounded bg-surface-2 border border-info flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-info" />
                  <span className="font-bold text-text">CAM-06 (Ridge Watch)</span>
                </div>
                <span className="text-2xs px-1.5 py-0.2 rounded bg-info-bg text-info font-bold">
                  PREDICTED NEXT
                </span>
              </div>
            </div>
          </div>

          {/* Panel 3: Live Synchronized Feeds along the Corridor */}
          <div className="bg-surface border border-border rounded flex flex-col">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider">
                Corridor Sensor Feeds
              </span>
              <span className="text-2xs text-text-dim">CAM-03 & CAM-04</span>
            </div>
            <div className="p-2 space-y-2 flex-1 flex flex-col justify-center">
              <div className="h-28">
                <CameraFeed camera={cam3} showControls={false} />
              </div>
              <div className="h-28">
                <CameraFeed camera={cam4} showControls={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom 2-Grid: Watch Requests Table & Event Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Watch Request Table */}
          <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider">
                SWAN Watch Requests Registry
              </span>
              <span className="text-2xs text-text-dim">{swanRequests.length} Published</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left font-mono text-2xs">
                <thead className="bg-surface border-b border-border text-text-dim uppercase">
                  <tr>
                    <th className="py-2 px-3">Routing Handoff</th>
                    <th className="py-2 px-3">Target Track</th>
                    <th className="py-2 px-3">ETA to Entry</th>
                    <th className="py-2 px-3">Confidence</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {swanRequests.map(req => (
                    <tr key={req.id} className="hover:bg-surface-2">
                      <td className="py-2.5 px-3 font-semibold text-text">
                        {req.fromCamera} → {req.toCamera}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-critical">{req.trackId}</td>
                      <td className="py-2.5 px-3 text-text-muted">{req.predictedTimeToEntrySeconds}s</td>
                      <td className="py-2.5 px-3 text-text-muted">
                        {(req.confidenceScore * 100).toFixed(0)}%
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                            req.status === 'CONFIRMED'
                              ? 'bg-success-bg text-success-text border border-success-border'
                              : 'bg-info-bg text-info-text border border-info-border'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SWAN Timeline */}
          <div className="bg-surface border border-border rounded flex flex-col">
            <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-info" />
                <span>SWAN Autonomous Decision Sequence</span>
              </span>
              <span className="text-2xs text-text-dim">Sub-second Latency</span>
            </div>

            <div className="p-3 space-y-2.5 overflow-y-auto max-h-60 pl-4">
              <div className="border-l-2 border-border pl-3 space-y-2.5 text-2xs">
                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-surface border border-text-muted" />
                  <div className="text-text-dim">02:14:06 IST</div>
                  <div className="font-bold text-text">CAM-03 detected target</div>
                  <div className="text-text-muted text-[11px]">2 human silhouettes classified at outer perimeter</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-surface border border-critical" />
                  <div className="text-text-dim">02:14:12 IST</div>
                  <div className="font-bold text-critical">Virtual fence crossed</div>
                  <div className="text-text-muted text-[11px]">Breach of Perimeter Virtual Fence Alpha detected</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-surface border border-info" />
                  <div className="text-text-dim">02:14:13 IST</div>
                  <div className="font-bold text-text">SWAN selected CAM-04</div>
                  <div className="text-text-muted text-[11px]">Optimal angle of intercept computed: 168°</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-surface border border-info" />
                  <div className="text-text-dim">02:14:15 IST</div>
                  <div className="font-bold text-text">Watch request published</div>
                  <div className="text-text-muted text-[11px]">Edge MQTT message delivered in 22ms</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-surface border border-success" />
                  <div className="text-text-dim">02:14:18 IST</div>
                  <div className="font-bold text-success">CAM-04 confirmed target</div>
                  <div className="text-text-muted text-[11px]">Target T-104 re-identified with 0.92 feature similarity</div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-surface border border-critical" />
                  <div className="text-text-dim">02:14:20 IST</div>
                  <div className="font-bold text-critical">Risk fusion → HIGH (92/100)</div>
                  <div className="text-text-muted text-[11px]">Multi-camera correlation confirms intentional deep penetration</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
