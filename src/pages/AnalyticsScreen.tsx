import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import {
  BarChart3,
  TrendingUp,
  Activity,
  Shield,
  Clock,
  Video,
  CheckCircle,
  AlertTriangle,
  Cpu
} from 'lucide-react';

export const AnalyticsScreen: React.FC = () => {
  const { incidents, cameras, swanRequests, shieldFaults } = useRealtime();
  const [activeTab, setActiveTab] = useState<
    'INCIDENTS' | 'CAMERA PERFORMANCE' | 'SWAN' | 'SHIELD' | 'AI PERFORMANCE'
  >('INCIDENTS');

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-y-auto select-none">
      {/* Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-info" />
          <h1 className="text-sm font-bold text-text uppercase tracking-wider">
            Operational Intelligence & Telemetry Analytics
          </h1>
          <span className="text-2xs text-text-muted">Sector Command View (BOP-17)</span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded border border-border text-2xs">
          {(['INCIDENTS', 'CAMERA PERFORMANCE', 'SWAN', 'SHIELD', 'AI PERFORMANCE'] as const).map(
            tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  activeTab === tab
                    ? 'bg-surface-3 text-white'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Analytics Canvas */}
      <div className="p-4 space-y-4">
        {/* INCIDENTS TAB */}
        {activeTab === 'INCIDENTS' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">TOTAL 24H INCIDENTS</div>
                <div className="text-2xl font-bold text-text mt-1">{incidents.length}</div>
                <div className="text-[11px] text-text-muted mt-0.5">3 Critical Breaches</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">MEAN OPERATOR RESPONSE</div>
                <div className="text-2xl font-bold text-success mt-1">18.4s</div>
                <div className="text-[11px] text-text-muted mt-0.5">SLA Target: &lt; 30s</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">CRITICAL SEVERITY SHARE</div>
                <div className="text-2xl font-bold text-critical mt-1">33%</div>
                <div className="text-[11px] text-text-muted mt-0.5">Multi-sensor confirmed</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">FALSE POSITIVE DISMISSALS</div>
                <div className="text-2xl font-bold text-info mt-1">14%</div>
                <div className="text-[11px] text-text-muted mt-0.5">Wildlife & Cattle filters</div>
              </div>
            </div>

            {/* Incidents by Hour & Sector Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 rounded bg-surface border border-border">
                <div className="font-bold text-text uppercase mb-3 text-2xs">
                  Incidents Distribution by Hour (IST)
                </div>
                <div className="space-y-2">
                  {[
                    { hour: '20:00 - 22:00', count: 1, pct: 20 },
                    { hour: '22:00 - 00:00', count: 2, pct: 40 },
                    { hour: '00:00 - 02:00', count: 4, pct: 85 },
                    { hour: '02:00 - 04:00', count: 3, pct: 60 },
                    { hour: '04:00 - 06:00', count: 1, pct: 20 }
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-2xs text-text-muted">
                        <span>{bar.hour}</span>
                        <span className="font-semibold text-text">{bar.count} Incidents</span>
                      </div>
                      <div className="h-2 w-full bg-surface-2 rounded overflow-hidden">
                        <div
                          className="h-full bg-info rounded"
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded bg-surface border border-border">
                <div className="font-bold text-text uppercase mb-3 text-2xs">
                  Incidents by Border Zone
                </div>
                <div className="space-y-2.5 text-2xs">
                  {[
                    { zone: 'Zone Fence-B (North Sector / Zero Line)', count: 4, sev: 'CRITICAL' },
                    { zone: 'Zone Gate-Alpha (Road Approach)', count: 2, sev: 'HIGH' },
                    { zone: 'Zone Alpha Entry (Vehicle Checkpoint)', count: 1, sev: 'LOW' },
                    { zone: 'Zone South-11 (Perimeter Flank)', count: 1, sev: 'INFORMATIONAL' }
                  ].map((z, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-text">{z.zone}</div>
                        <div className="text-text-dim text-[10px]">Active surveillance</div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-text text-sm">{z.count}</span>
                        <div className="text-[10px] text-text-dim">{z.sev}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA PERFORMANCE TAB */}
        {activeTab === 'CAMERA PERFORMANCE' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">FLEET AVAILABILITY</div>
                <div className="text-2xl font-bold text-success mt-1">98.2%</div>
                <div className="text-[11px] text-text-muted mt-0.5">47 / 50 Cameras Online</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">STREAM INTERRUPTIONS</div>
                <div className="text-2xl font-bold text-warning mt-1">2 Events</div>
                <div className="text-[11px] text-text-muted mt-0.5">CAM-03 & CAM-05</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">AVERAGE RTSP LATENCY</div>
                <div className="text-2xl font-bold text-text mt-1">38.4 ms</div>
                <div className="text-[11px] text-text-muted mt-0.5">Edge FFmpeg pipeline</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">COVERAGE UPTIME</div>
                <div className="text-2xl font-bold text-info mt-1">99.4%</div>
                <div className="text-[11px] text-text-muted mt-0.5">SHIELD PTZ fallback enabled</div>
              </div>
            </div>
          </div>
        )}

        {/* SWAN TAB */}
        {activeTab === 'SWAN' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">CROSS-CAMERA HANDOFFS</div>
                <div className="text-2xl font-bold text-info mt-1">12</div>
                <div className="text-[11px] text-text-muted mt-0.5">100% Confirmation Rate</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">AVERAGE HANDOFF LATENCY</div>
                <div className="text-2xl font-bold text-success mt-1">1.4s</div>
                <div className="text-[11px] text-text-muted mt-0.5">Predictive routing</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">ACTIVE WATCH REQUESTS</div>
                <div className="text-2xl font-bold text-text mt-1">{swanRequests.length}</div>
                <div className="text-[11px] text-text-muted mt-0.5">T-104 Corridor</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">CORRELATION CONFIDENCE</div>
                <div className="text-2xl font-bold text-success mt-1">92.4%</div>
                <div className="text-[11px] text-text-muted mt-0.5">Multi-feature re-ID</div>
              </div>
            </div>
          </div>
        )}

        {/* SHIELD TAB */}
        {activeTab === 'SHIELD' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">FAULTS DETECTED (24H)</div>
                <div className="text-2xl font-bold text-warning mt-1">{shieldFaults.length}</div>
                <div className="text-[11px] text-text-muted mt-0.5">1 Lens Obstruction / Tamper</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">MEAN TIME TO HEALING (MTTH)</div>
                <div className="text-2xl font-bold text-success mt-1">3.2s</div>
                <div className="text-[11px] text-text-muted mt-0.5">Automated PTZ Slew</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">COVERAGE RESTORED</div>
                <div className="text-2xl font-bold text-success mt-1">88.0%</div>
                <div className="text-[11px] text-text-muted mt-0.5">CAM-TOWER-01 & ROAD-05</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">RESIDUAL BLIND ZONE</div>
                <div className="text-2xl font-bold text-warning mt-1">12.0%</div>
                <div className="text-[11px] text-text-muted mt-0.5">Overwatch corridor maintained</div>
              </div>
            </div>
          </div>
        )}

        {/* AI PERFORMANCE TAB */}
        {activeTab === 'AI PERFORMANCE' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">YOLO DETECTION ACCURACY</div>
                <div className="text-2xl font-bold text-success mt-1">94.8%</div>
                <div className="text-[11px] text-text-muted mt-0.5">mAP@50 on Border Dataset</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">BYTETRACK PERSISTENCE</div>
                <div className="text-2xl font-bold text-text mt-1">98.1%</div>
                <div className="text-[11px] text-text-muted mt-0.5">Low ID Switch Rate</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">EDGE INFERENCE TIME</div>
                <div className="text-2xl font-bold text-text mt-1">14.2 ms</div>
                <div className="text-[11px] text-text-muted mt-0.5">TensorRT / Jetson Orin</div>
              </div>
              <div className="p-3 rounded bg-surface border border-border">
                <div className="text-2xs text-text-dim">THERMAL / IR RECOGNITION</div>
                <div className="text-2xl font-bold text-info mt-1">91.6%</div>
                <div className="text-[11px] text-text-muted mt-0.5">Night signature model</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
