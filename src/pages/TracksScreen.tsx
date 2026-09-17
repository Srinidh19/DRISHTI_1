import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { ObjectTrack } from '../types';
import { CommandMap } from '../components/map/CommandMap';
import { Activity, ArrowRight, User, Car, Clock, ShieldAlert, Crosshair, ExternalLink } from 'lucide-react';

export const TracksScreen: React.FC = () => {
  const navigate = useNavigate();
  const { activeTracks, setSelectedIncidentId } = useRealtime();
  const [selectedTrackId, setSelectedTrackId] = useState<string>(activeTracks[0]?.id || 'T-104');
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');

  const selectedTrack = activeTracks.find(t => t.id === selectedTrackId) || activeTracks[0];

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-hidden select-none">
      {/* Header */}
      <div className="p-2.5 sm:p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-info" />
          <h1 className="text-xs sm:text-sm font-bold text-text uppercase tracking-wider">
            Active Target Tracking Registry
          </h1>
          <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs text-text-muted">
            {activeTracks.length} Persistent Targets
          </span>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex md:hidden items-center gap-1 bg-surface-2 p-0.5 rounded border border-border text-2xs">
          <button
            onClick={() => setMobileView('list')}
            className={`px-2 py-1 rounded font-semibold ${
              mobileView === 'list' ? 'bg-surface-3 text-white' : 'text-text-muted'
            }`}
          >
            Entities ({activeTracks.length})
          </button>
          <button
            onClick={() => setMobileView('detail')}
            className={`px-2 py-1 rounded font-semibold ${
              mobileView === 'detail' ? 'bg-surface-3 text-white' : 'text-text-muted'
            }`}
          >
            Map & Detail
          </button>
        </div>
      </div>

      {/* 2-Column Split: Tracks List & Track Detail / GIS Map */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Left Column: List of Active Tracks */}
        <div className={`w-full md:w-80 border-r border-border bg-surface flex flex-col overflow-y-auto shrink-0 ${
          mobileView === 'detail' ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-2 border-b border-border bg-surface-2 text-2xs text-text-dim uppercase tracking-wider font-semibold">
            Track Entities
          </div>
          <div className="divide-y divide-border">
            {activeTracks.map(track => {
              const isSelected = track.id === selectedTrack?.id;
              return (
                <div
                  key={track.id}
                  onClick={() => {
                    setSelectedTrackId(track.id);
                    setMobileView('detail');
                  }}
                  className={`p-3 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-surface-3 border-l-4 border-critical'
                      : 'hover:bg-surface-2 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-text flex items-center gap-1.5">
                      {track.objectType === 'PERSON' ? (
                        <User className="w-3.5 h-3.5 text-text-muted" />
                      ) : (
                        <Car className="w-3.5 h-3.5 text-text-muted" />
                      )}
                      <span>{track.id}</span>
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-2xs font-bold ${
                        track.risk === 'CRITICAL'
                          ? 'bg-critical-bg text-critical-text border border-critical-border'
                          : track.risk === 'HIGH'
                          ? 'bg-warning-bg text-warning-text border border-warning-border'
                          : 'bg-info-bg text-info-text border border-info-border'
                      }`}
                    >
                      {track.risk}
                    </span>
                  </div>

                  <div className="text-2xs text-text-muted space-y-1">
                    <div className="flex items-center gap-1">
                      <span className="text-text-dim">NODES:</span>
                      <span className="text-text font-medium">
                        {track.originCamera} → {track.currentCamera}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-text-dim">DIRECTION:</span>
                      <span className="text-text">{track.direction}</span>
                    </div>
                    <div className="flex items-center justify-between text-text-dim pt-1 border-t border-border/40">
                      <span>Active: 00:{track.activeDurationSeconds}</span>
                      <span>Confidence: {(track.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Track Detail & Map Corridor */}
        {selectedTrack && (
          <div className={`flex-1 flex flex-col min-w-0 bg-bg ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
            {/* Top Track Summary Banner */}
            <div className="p-2 sm:p-3 bg-surface border-b border-border grid grid-cols-2 md:grid-cols-5 gap-2 sm:gap-3">
              <div className="col-span-2 md:hidden pb-1 border-b border-border/40">
                <button
                  onClick={() => setMobileView('list')}
                  className="flex items-center gap-1 text-2xs text-info hover:underline"
                >
                  <ArrowRight className="w-3 h-3 rotate-180" />
                  <span>Back to Entities List</span>
                </button>
              </div>
              <div>
                <div className="text-2xs text-text-dim uppercase">Origin Camera</div>
                <div className="text-xs sm:text-sm font-bold text-text">{selectedTrack.originCamera}</div>
              </div>
              <div>
                <div className="text-2xs text-text-dim uppercase">Current Camera</div>
                <div className="text-xs sm:text-sm font-bold text-critical">{selectedTrack.currentCamera}</div>
              </div>
              <div>
                <div className="text-2xs text-text-dim uppercase">Direction Vector</div>
                <div className="text-xs sm:text-sm font-bold text-text">{selectedTrack.direction}</div>
              </div>
              <div>
                <div className="text-2xs text-text-dim uppercase">Predicted Next Camera</div>
                <div className="text-xs sm:text-sm font-bold text-info">
                  {selectedTrack.predictedNextCamera}
                </div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="text-2xs text-text-dim uppercase">Related Incident</div>
                <button
                  onClick={() => {
                    setSelectedIncidentId(selectedTrack.relatedIncidentId);
                    navigate(`/app/incidents/${selectedTrack.relatedIncidentId}`);
                  }}
                  className="flex items-center gap-1 text-xs sm:text-sm font-bold text-info hover:underline"
                >
                  <span>{selectedTrack.relatedIncidentId}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Tactical Map with Waypoint Vector Overlay */}
            <div className="flex-1 relative min-h-[220px]">
              <CommandMap />
            </div>

            {/* Waypoints History Table */}
            <div className="h-44 bg-surface border-t border-border flex flex-col shrink-0 overflow-auto">
              <div className="p-2 bg-surface-2 border-b border-border text-2xs text-text-dim uppercase tracking-wider font-semibold">
                Trajectory Waypoints Log ({selectedTrack.id})
              </div>
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left font-mono">
                  <thead className="bg-surface sticky top-0 border-b border-border text-2xs text-text-dim uppercase">
                    <tr>
                      <th className="py-1 px-3">Timestamp</th>
                      <th className="py-1 px-3">Sensor Node</th>
                      <th className="py-1 px-3">Latitude</th>
                      <th className="py-1 px-3">Longitude</th>
                      <th className="py-1 px-3">Speed</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {selectedTrack.waypoints.map((wp, idx) => (
                      <tr key={idx} className="hover:bg-surface-2">
                        <td className="py-1 px-3 text-text-dim">{wp.timestamp}</td>
                        <td className="py-1 px-3 font-semibold text-text">{wp.camera}</td>
                        <td className="py-1 px-3 text-text-muted">{wp.lat.toFixed(5)}°N</td>
                        <td className="py-1 px-3 text-text-muted">{wp.lng.toFixed(5)}°E</td>
                        <td className="py-1 px-3 text-text">{selectedTrack.currentSpeedKmh} km/h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
