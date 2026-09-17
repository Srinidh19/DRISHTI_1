import React, { useState } from 'react';
import { DrishtiMaplibre } from '../components/map/DrishtiMaplibre';
import { IncidentQueue } from '../components/incidents/IncidentQueue';
import { SelectedIncidentPanel } from '../components/incidents/SelectedIncidentPanel';
import { CameraFeed } from '../components/video/CameraFeed';
import { useRealtime } from '../context/RealtimeContext';
import {
  Video,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { Incident } from '../types';

export const CommandScreen: React.FC = () => {
  const {
    cameras,
    incidents,
    overlaySettings,
    setOverlaySettings,
    selectedIncidentId,
    setSelectedIncidentId
  } = useRealtime();

  const [isIncidentPanelOpen, setIsIncidentPanelOpen] = useState(true);
  const [isCameraStripOpen, setIsCameraStripOpen] = useState(true);
  const [activeIncidentTab, setActiveIncidentTab] = useState<'queue' | 'detail'>('queue');
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [mobileTab, setMobileTab] = useState<'map' | 'incidents' | 'feeds'>('map');

  // 6 Priority Sector Feeds: CAM-03, CAM-04, CAM-06, CAM-07, CAM-11, CAM-TOWER-01
  const bottomCameras = [
    cameras.find(c => c.id === 'CAM-03') || cameras[0],
    cameras.find(c => c.id === 'CAM-04') || cameras[1],
    cameras.find(c => c.id === 'CAM-06') || cameras[2],
    cameras.find(c => c.id === 'CAM-07') || cameras[3],
    cameras.find(c => c.id === 'CAM-11') || cameras[4],
    cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[5]
  ].filter(Boolean);

  const activeIncidents = incidents.filter(
    i => i.status !== 'DISMISSED' && i.status !== 'RESOLVED'
  );

  const handleSelectIncidentFromQueue = (incident: Incident) => {
    setSelectedIncidentId(incident.id);
    setActiveIncidentTab('detail');
  };

  const handleToggleFullscreen = () => {
    setIsFullscreenMap(!isFullscreenMap);
    if (!isFullscreenMap) {
      setIsIncidentPanelOpen(false);
      setIsCameraStripOpen(false);
    } else {
      setIsIncidentPanelOpen(true);
      setIsCameraStripOpen(true);
    }
  };

  return (
    <div className="relative w-full h-full min-h-0 min-w-0 overflow-hidden bg-bg font-mono select-none">
      {/* =========================================================================
          1. MOBILE WORKSPACE (< md): DELIBERATE OPERATIONAL TACTICAL LAYOUT
          Preserves Mission → Situation → Incident → Evidence → AI Reasoning → Operator Decision
      ========================================================================= */}
      <div className="md:hidden flex flex-col h-full w-full min-h-0 min-w-0 overflow-hidden">
        {/* Mobile Operational Mode Switcher Bar */}
        <div className="h-10 shrink-0 bg-surface-2 border-b border-border flex items-center px-1.5 gap-1 select-none z-20">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 text-2xs font-semibold transition-colors ${
              mobileTab === 'map'
                ? 'bg-surface-3 text-white border border-info'
                : 'text-text-muted hover:text-text bg-surface'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-info" />
            <span>SITREP MAP</span>
          </button>

          <button
            onClick={() => setMobileTab('incidents')}
            className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 text-2xs font-semibold transition-colors ${
              mobileTab === 'incidents'
                ? 'bg-surface-3 text-white border border-critical'
                : 'text-text-muted hover:text-text bg-surface'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-critical" />
            <span>INCIDENTS ({activeIncidents.length})</span>
          </button>

          <button
            onClick={() => setMobileTab('feeds')}
            className={`flex-1 py-1.5 px-2 rounded flex items-center justify-center gap-1.5 text-2xs font-semibold transition-colors ${
              mobileTab === 'feeds'
                ? 'bg-surface-3 text-white border border-info'
                : 'text-text-muted hover:text-text bg-surface'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-info" />
            <span>FEEDS (6)</span>
          </button>
        </div>

        {/* Mobile View Body */}
        <div className="flex-1 min-h-0 min-w-0 relative overflow-hidden flex flex-col">
          {/* TAB 1: SITREP MAP */}
          {mobileTab === 'map' && (
            <div className="w-full h-full min-h-0 relative">
              <DrishtiMaplibre
                onSelectIncident={(inc) => {
                  handleSelectIncidentFromQueue(inc);
                  setMobileTab('incidents');
                }}
                isFullscreen={false}
              />

              {/* Floating Quick Incident Pill if active */}
              {activeIncidents.length > 0 && (
                <div
                  onClick={() => setMobileTab('incidents')}
                  className="absolute bottom-2 left-2 right-2 p-2 rounded bg-surface-2/95 border border-critical/80 text-2xs text-text shadow-2xl backdrop-blur-sm flex items-center justify-between cursor-pointer z-30"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-critical animate-ping" />
                    <span className="font-bold text-critical">ACTIVE THREAT:</span>
                    <span className="truncate max-w-[170px] text-text font-semibold">{activeIncidents[0].title}</span>
                  </div>
                  <span className="text-info font-bold text-2xs">Triage &rarr;</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INCIDENT QUEUE & TRIAGE WORKSPACE */}
          {mobileTab === 'incidents' && (
            <div className="w-full h-full min-h-0 flex flex-col bg-surface overflow-hidden">
              {/* Incident Header Tabs */}
              <div className="h-9 shrink-0 border-b border-border bg-surface-2 flex items-center justify-between px-2 text-2xs select-none">
                <div className="flex items-center gap-1 w-full">
                  <button
                    onClick={() => setActiveIncidentTab('queue')}
                    className={`flex-1 px-2 py-1 rounded transition-colors font-semibold ${
                      activeIncidentTab === 'queue'
                        ? 'bg-surface-3 text-white'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    QUEUE ({activeIncidents.length})
                  </button>

                  <button
                    onClick={() => setActiveIncidentTab('detail')}
                    className={`flex-1 px-2 py-1 rounded transition-colors font-semibold ${
                      activeIncidentTab === 'detail'
                        ? 'bg-surface-3 text-white'
                        : 'text-text-muted hover:text-text'
                    }`}
                  >
                    TRIAGE & DETAIL
                  </button>
                </div>
              </div>

              {/* Panel Content Body */}
              <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
                {activeIncidentTab === 'queue' ? (
                  <IncidentQueue onSelectIncident={handleSelectIncidentFromQueue} />
                ) : (
                  <div className="h-full min-h-0 flex flex-col">
                    <div className="px-2.5 py-1 bg-surface-2 border-b border-border flex items-center justify-between">
                      <button
                        onClick={() => setActiveIncidentTab('queue')}
                        className="flex items-center gap-1 text-2xs text-text-muted hover:text-white"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Back to Queue</span>
                      </button>
                      <span className="text-2xs text-text-dim">ID: {selectedIncidentId}</span>
                    </div>
                    <div className="flex-1 min-h-0 overflow-y-auto">
                      <SelectedIncidentPanel />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SURVEILLANCE FEEDS */}
          {mobileTab === 'feeds' && (
            <div className="w-full h-full min-h-0 flex flex-col bg-surface-2 overflow-hidden">
              {/* Feeds Subheader */}
              <div className="p-2 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-1.5 text-2xs">
                <span className="font-bold tracking-wider text-text">BOP-17 VIDEO MATRIX</span>
                <div className="flex items-center gap-2 text-2xs">
                  <label className="flex items-center gap-1 cursor-pointer text-text-muted">
                    <input
                      type="checkbox"
                      checked={overlaySettings.showDetections}
                      onChange={e =>
                        setOverlaySettings(s => ({ ...s, showDetections: e.target.checked }))
                      }
                      className="rounded bg-surface border-border text-info focus:ring-0 w-2.5 h-2.5"
                    />
                    <span>Detect</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer text-text-muted">
                    <input
                      type="checkbox"
                      checked={overlaySettings.showTrackIds}
                      onChange={e =>
                        setOverlaySettings(s => ({ ...s, showTrackIds: e.target.checked }))
                      }
                      className="rounded bg-surface border-border text-info focus:ring-0 w-2.5 h-2.5"
                    />
                    <span>Tracks</span>
                  </label>
                </div>
              </div>

              {/* Video Grid for Mobile */}
              <div className="flex-1 min-h-0 overflow-y-auto p-2 space-y-2">
                {bottomCameras.map(cam => (
                  <div
                    key={cam.id}
                    className="w-full bg-surface border border-border rounded overflow-hidden shadow-md"
                  >
                    <div className="h-44">
                      <CameraFeed camera={cam} aspectRatio="h-full w-full" showControls={true} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. DESKTOP WORKSPACE (md: and above): 100% UNCHANGED SECURITY WORKSTATION
      ========================================================================= */}
      <div
        className="w-full h-full min-h-0 min-w-0 overflow-hidden hidden md:grid"
        style={{
          gridTemplateColumns: isIncidentPanelOpen ? 'minmax(0, 1fr) 360px' : 'minmax(0, 1fr) 0px',
          gridTemplateRows: isCameraStripOpen ? 'minmax(0, 1fr) 200px' : 'minmax(0, 1fr) 0px',
          transition: 'grid-template-columns 200ms ease, grid-template-rows 200ms ease'
        }}
      >
        {/* ROW 1, COL 1: MAP VIEWPORT (DOMINANT REAL MAP WORKSPACE) */}
        <div className="relative w-full h-full min-w-0 min-h-0 overflow-hidden bg-[#0f1114]">
          <DrishtiMaplibre
            onSelectIncident={handleSelectIncidentFromQueue}
            isFullscreen={isFullscreenMap}
            onToggleFullscreen={handleToggleFullscreen}
          />

          {/* Collapsible Trigger for Right Incident Panel */}
          <button
            onClick={() => setIsIncidentPanelOpen(!isIncidentPanelOpen)}
            className="absolute top-1/2 -translate-y-1/2 right-0 z-30 bg-surface-2/90 hover:bg-surface-3 border-l border-y border-border text-text-muted hover:text-text px-1 py-4 rounded-l shadow transition-colors"
            title={isIncidentPanelOpen ? 'Collapse Incident Panel' : 'Expand Incident Panel'}
          >
            {isIncidentPanelOpen ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {/* Collapsible Trigger for Bottom Camera Strip */}
          <button
            onClick={() => setIsCameraStripOpen(!isCameraStripOpen)}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-30 bg-surface-2/90 hover:bg-surface-3 border-t border-x border-border text-text-muted hover:text-text py-0.5 px-6 rounded-t shadow transition-colors"
            title={isCameraStripOpen ? 'Collapse Camera Strip' : 'Expand Camera Strip'}
          >
            {isCameraStripOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* ROW 1, COL 2: INCIDENT PANEL (DEDICATED 360px PHYSICAL COLUMN) */}
        <div
          className={`h-full min-h-0 min-w-0 overflow-hidden bg-surface border-l border-border flex flex-col ${
            isIncidentPanelOpen ? 'block' : 'hidden'
          }`}
        >
          {/* Header Switcher Tabs */}
          <div className="h-9 shrink-0 border-b border-border bg-surface-2 flex items-center justify-between px-2 text-2xs select-none">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveIncidentTab('queue')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  activeIncidentTab === 'queue'
                    ? 'bg-surface-3 text-white'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                INCIDENT QUEUE ({incidents.filter(i => i.status !== 'DISMISSED' && i.status !== 'RESOLVED').length})
              </button>

              <button
                onClick={() => setActiveIncidentTab('detail')}
                className={`px-2.5 py-1 rounded transition-colors font-semibold ${
                  activeIncidentTab === 'detail'
                    ? 'bg-surface-3 text-white'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                TRIAGE & DETAIL
              </button>
            </div>

            <button
              onClick={() => setIsIncidentPanelOpen(false)}
              className="text-text-dim hover:text-text p-1"
              title="Collapse Panel"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Panel Content Body */}
          <div className="flex-1 min-h-0 overflow-hidden relative flex flex-col">
            {activeIncidentTab === 'queue' ? (
              <IncidentQueue onSelectIncident={handleSelectIncidentFromQueue} />
            ) : (
              <div className="h-full min-h-0 flex flex-col">
                <div className="px-2.5 py-1 bg-surface-2 border-b border-border flex items-center justify-between">
                  <button
                    onClick={() => setActiveIncidentTab('queue')}
                    className="flex items-center gap-1 text-2xs text-text-muted hover:text-white"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    <span>Back to Queue</span>
                  </button>
                  <span className="text-2xs text-text-dim">ID: {selectedIncidentId}</span>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <SelectedIncidentPanel />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2, COL 1 & 2: PRIORITY SURVEILLANCE WALL (200px PHYSICAL ROW) */}
        <div
          className={`col-span-2 h-[200px] w-full min-w-0 overflow-hidden bg-surface-2 border-t border-border flex flex-col ${
            isCameraStripOpen ? 'block' : 'hidden'
          }`}
        >
          {/* Sub-header Controls Bar (24px) */}
          <div className="h-6 shrink-0 px-3 bg-surface border-b border-border flex items-center justify-between text-2xs select-none">
            <div className="flex items-center gap-2 text-text">
              <Video className="w-3 h-3 text-info" />
              <span className="font-bold tracking-wider uppercase text-2xs">BOP-17 Priority Video Matrix</span>
              <span className="text-2xs text-text-dim border-l border-border pl-2">6 SYNCHRONIZED SURVEILLANCE STREAMS</span>
            </div>

            <div className="flex items-center gap-3 text-2xs">
              <label className="flex items-center gap-1 cursor-pointer text-text-muted hover:text-text">
                <input
                  type="checkbox"
                  checked={overlaySettings.showDetections}
                  onChange={e =>
                    setOverlaySettings(s => ({ ...s, showDetections: e.target.checked }))
                  }
                  className="rounded bg-surface border-border text-info focus:ring-0 w-2.5 h-2.5"
                />
                <span>Detections</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-text-muted hover:text-text">
                <input
                  type="checkbox"
                  checked={overlaySettings.showTrackIds}
                  onChange={e =>
                    setOverlaySettings(s => ({ ...s, showTrackIds: e.target.checked }))
                  }
                  className="rounded bg-surface border-border text-info focus:ring-0 w-2.5 h-2.5"
                />
                <span>Track IDs</span>
              </label>

              <label className="flex items-center gap-1 cursor-pointer text-text-muted hover:text-text">
                <input
                  type="checkbox"
                  checked={overlaySettings.showMotionVectors}
                  onChange={e =>
                    setOverlaySettings(s => ({ ...s, showMotionVectors: e.target.checked }))
                  }
                  className="rounded bg-surface border-border text-info focus:ring-0 w-2.5 h-2.5"
                />
                <span>Vectors</span>
              </label>

              <button
                onClick={() => setIsCameraStripOpen(false)}
                className="text-text-dim hover:text-text ml-2"
                title="Hide Camera Strip"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 6 Feeds Scrollable Surveillance Wall Row */}
          <div className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden flex items-center gap-2.5 p-2 scrollbar-thin">
            {bottomCameras.map(cam => (
              <div
                key={cam.id}
                className="w-64 shrink-0 h-full min-h-0 bg-surface border border-border rounded overflow-hidden shadow-md"
              >
                <CameraFeed camera={cam} aspectRatio="h-full" showControls={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
