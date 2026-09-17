import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRealtime } from '../../context/RealtimeContext';
import { ObjectTrack } from '../../types';
import {
  Activity,
  Compass,
  Radio,
  Clock,
  ArrowRight,
  ExternalLink,
  Shield,
  FileCheck2,
  AlertTriangle,
  ChevronRight,
  Maximize2
} from 'lucide-react';

export const SwanActiveTracks: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeTracks,
    cameras,
    incidents,
    evidence,
    setSelectedIncidentId
  } = useRealtime();

  const [selectedTrackId, setSelectedTrackId] = useState<string>(
    activeTracks[0]?.id || 'T-104'
  );

  const currentTrack = activeTracks.find(t => t.id === selectedTrackId) || activeTracks[0];
  const linkedIncident = incidents.find(i => i.trackId === currentTrack?.id || i.id === currentTrack?.relatedIncidentId);
  const originCam = cameras.find(c => c.id === currentTrack?.originCamera);
  const currentCam = cameras.find(c => c.id === currentTrack?.currentCamera);
  const predictedCam = cameras.find(c => c.id === currentTrack?.predictedNextCamera);
  const relatedEvidence = evidence.filter(e => e.incidentId === linkedIncident?.id);

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-hidden select-none">
      {/* Subsystem Navigation Bar */}
      <div className="px-3 py-2 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded bg-surface-2 border border-border flex items-center justify-center">
            <Compass className="w-3.5 h-3.5 text-critical" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-text uppercase tracking-wider">SWAN</h1>
              <span className="text-2xs text-text-dim">|</span>
              <span className="text-xs text-text-muted">Active Persistent Target Tracks</span>
              <span className="text-[10px] text-critical font-bold px-1.5 py-0.2 rounded bg-critical-bg border border-critical-border">
                {activeTracks.length} PERSISTENT TARGETS
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Subroutes */}
        <div className="flex items-center gap-1 bg-surface-2 p-0.5 rounded border border-border text-2xs overflow-x-auto max-w-full">
          <Link
            to="/app/swan/overview"
            className="px-2.5 py-1 rounded text-text-muted hover:text-text hover:bg-surface-3/50 transition-colors"
          >
            OVERVIEW
          </Link>
          <Link
            to="/app/swan/tracks"
            className="px-2.5 py-1 rounded bg-surface-3 text-white font-bold transition-colors shadow"
          >
            ACTIVE TRACKS ({activeTracks.length})
          </Link>
          <Link
            to="/app/swan/coordination"
            className="px-2.5 py-1 rounded text-text-muted hover:text-text hover:bg-surface-3/50 transition-colors"
          >
            COORDINATION
          </Link>
        </div>
      </div>

      {/* Main Split Layout: Left Table List (40%) | Right Deep Track Workspace (60%) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT PANE: Filterable Track Registry */}
        <div className="lg:col-span-5 h-full border-r border-border bg-surface flex flex-col min-h-0 overflow-hidden">
          <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between text-2xs">
            <span className="font-bold text-text uppercase tracking-wider">Target Track Registry</span>
            <span className="text-text-dim">ByteTrack Correlation</span>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
            {activeTracks.map(track => {
              const isSelected = track.id === selectedTrackId;
              const isCrit = track.risk === 'CRITICAL' || track.risk === 'HIGH';

              return (
                <div
                  key={track.id}
                  onClick={() => setSelectedTrackId(track.id)}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-surface-3 border-l-2 border-critical' : 'hover:bg-surface-2'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-text text-xs">{track.id}</span>
                      <span className="px-1.5 py-0.2 rounded bg-surface border border-border text-[10px] text-text-muted">
                        {track.objectType}
                      </span>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                        isCrit
                          ? 'bg-critical-bg text-critical border-critical-border'
                          : 'bg-warning-bg text-warning border-warning-border'
                      }`}
                    >
                      {track.risk}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-text-muted mb-1.5">
                    <div>
                      <span className="text-text-dim">Current:</span>{' '}
                      <strong className="text-text">{track.currentCamera}</strong>
                    </div>
                    <div>
                      <span className="text-text-dim">Origin:</span>{' '}
                      <span className="text-text">{track.originCamera}</span>
                    </div>
                    <div>
                      <span className="text-text-dim">Speed:</span>{' '}
                      <span className="text-text">{track.currentSpeedKmh} km/h</span>
                    </div>
                    <div>
                      <span className="text-text-dim">Heading:</span>{' '}
                      <span className="text-text">{track.direction}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-text-dim pt-1 border-t border-border/50">
                    <span>Predicted Next: <strong className="text-info">{track.predictedNextCamera}</strong></span>
                    <span>Confidence: <strong className="text-success">{(track.confidence * 100).toFixed(0)}%</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT PANE: Deep Track Detail Workspace */}
        <div className="lg:col-span-7 h-full bg-bg flex flex-col min-h-0 overflow-y-auto p-3 space-y-3">
          {currentTrack ? (
            <>
              {/* Header Bar: Selected Target */}
              <div className="bg-surface border border-border rounded p-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-critical tracking-wider">
                      TARGET {currentTrack.id}
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-critical-bg text-critical border border-critical-border text-[10px] font-bold">
                      {currentTrack.risk} RISK
                    </span>
                    <span className="text-2xs text-text-dim">
                      Active Duration: 00:{currentTrack.activeDurationSeconds}s
                    </span>
                  </div>
                  <p className="text-2xs text-text-muted mt-0.5">
                    Classification: {currentTrack.objectType} (2 Pedestrians) • Trajectory: {currentTrack.direction}
                  </p>
                </div>

                {linkedIncident && (
                  <button
                    onClick={() => {
                      setSelectedIncidentId(linkedIncident.id);
                      navigate(`/app/incidents/${linkedIncident.id}`);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-critical/15 hover:bg-critical/25 border border-critical/40 rounded text-critical font-bold text-2xs transition-colors"
                    title="Open Incident Workspace"
                  >
                    <span>View Linked Incident ({linkedIncident.id})</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Camera Handoff Chain Diagram */}
              <div className="bg-surface border border-border rounded p-3 space-y-2">
                <span className="text-2xs text-text-dim uppercase tracking-wider font-semibold block">
                  Cross-Camera Handoff Progression
                </span>
                <div className="flex items-center justify-between gap-2 bg-surface-2 p-2.5 rounded border border-border text-2xs overflow-x-auto">
                  {/* Origin */}
                  <div className="p-2 rounded bg-surface border border-border flex-1 min-w-[110px]">
                    <span className="text-[10px] text-text-dim block">ORIGIN SENSOR</span>
                    <span className="font-bold text-text block mt-0.5">{currentTrack.originCamera}</span>
                    <span className="text-[10px] text-text-muted">{originCam?.name || 'Fence B IR'}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-text-dim shrink-0" />

                  {/* Current */}
                  <div className="p-2 rounded bg-surface border-2 border-critical flex-1 min-w-[120px] shadow">
                    <span className="text-[10px] text-critical block font-bold">CURRENT ACTIVE</span>
                    <span className="font-bold text-text block mt-0.5">{currentTrack.currentCamera}</span>
                    <span className="text-[10px] text-text-muted">{currentCam?.name || 'East Tower Optical'}</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-info shrink-0" />

                  {/* Predicted Next */}
                  <div className="p-2 rounded bg-surface border border-info flex-1 min-w-[110px]">
                    <span className="text-[10px] text-info block font-bold">PREDICTED NEXT</span>
                    <span className="font-bold text-text block mt-0.5">{currentTrack.predictedNextCamera}</span>
                    <span className="text-[10px] text-text-muted">{predictedCam?.name || 'Ridge Watch'}</span>
                  </div>
                </div>
              </div>

              {/* SWAN Reasoning Engine Log */}
              <div className="bg-surface border border-border rounded p-3 space-y-2">
                <div className="flex items-center justify-between border-b border-border pb-1.5">
                  <span className="text-2xs text-text-dim uppercase tracking-wider font-semibold">
                    SWAN Spatial Reasoning & Vector Analysis
                  </span>
                  <span className="text-[10px] text-success font-semibold">92% Correlation Confidence</span>
                </div>

                <div className="space-y-1.5 font-mono text-2xs">
                  <div className="p-2 rounded bg-surface-2 border border-border text-text leading-relaxed">
                    <span className="text-info font-semibold">[SWAN-ENGINE]</span> Velocity vector computed at{' '}
                    <strong className="text-text">168° South</strong> with ground traversal speed{' '}
                    <strong className="text-text">{currentTrack.currentSpeedKmh} km/h</strong>. Target projected to enter{' '}
                    <strong className="text-info">{currentTrack.predictedNextCamera}</strong> coverage cone in{' '}
                    <strong className="text-text">6.2 seconds</strong>.
                  </div>
                  <div className="p-2 rounded bg-surface-2 border border-border text-text leading-relaxed">
                    <span className="text-info font-semibold">[RE-ID-AI]</span> Extracted 512-d appearance embedding from{' '}
                    {currentTrack.originCamera} matches {currentTrack.currentCamera} optical detection with{' '}
                    <strong className="text-success">0.92 cosine similarity</strong>. Target continuity verified.
                  </div>
                </div>
              </div>

              {/* Waypoint Coordinate History */}
              <div className="bg-surface border border-border rounded p-3 space-y-2">
                <span className="text-2xs text-text-dim uppercase tracking-wider font-semibold block">
                  Trajectory Waypoints Recorded ({currentTrack.waypoints?.length || 0})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-2xs">
                  {currentTrack.waypoints?.map((w, idx) => (
                    <div key={idx} className="p-2 rounded bg-surface-2 border border-border">
                      <div className="flex items-center justify-between text-[10px] text-text-dim mb-0.5">
                        <span>WP-0{idx + 1}</span>
                        <span className="text-info">{w.camera}</span>
                      </div>
                      <div className="font-mono text-text font-medium">{w.lat.toFixed(4)}° N, {w.lng.toFixed(4)}° E</div>
                      <div className="text-[10px] text-text-muted mt-0.5">{w.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attached Forensic Evidence */}
              {relatedEvidence.length > 0 && (
                <div className="bg-surface border border-border rounded p-3 space-y-2">
                  <span className="text-2xs text-text-dim uppercase tracking-wider font-semibold block">
                    Linked Cryptographic Evidence ({relatedEvidence.length} items)
                  </span>
                  <div className="space-y-1.5">
                    {relatedEvidence.map(ev => (
                      <div key={ev.id} className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between text-2xs">
                        <div className="flex items-center gap-2">
                          <FileCheck2 className="w-3.5 h-3.5 text-success" />
                          <div>
                            <span className="font-bold text-text">{ev.id}</span>
                            <span className="text-text-dim text-[10px] ml-2">{ev.cameraName} ({ev.type})</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-text-dim">{ev.hashDigest.slice(0, 16)}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-text-muted font-mono">
              NO TARGET TRACK SELECTED
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
