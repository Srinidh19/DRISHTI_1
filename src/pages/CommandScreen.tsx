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
  ArrowLeft
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

  // 6 Priority Sector Feeds: CAM-03, CAM-04, CAM-06, CAM-07, CAM-11, CAM-TOWER-01
  const bottomCameras = [
    cameras.find(c => c.id === 'CAM-03') || cameras[0],
    cameras.find(c => c.id === 'CAM-04') || cameras[1],
    cameras.find(c => c.id === 'CAM-06') || cameras[2],
    cameras.find(c => c.id === 'CAM-07') || cameras[3],
    cameras.find(c => c.id === 'CAM-11') || cameras[4],
    cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[5]
  ].filter(Boolean);

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
      {/* 2x2 Grid Workspace:
          COLUMNS: [Map (1fr)] [Incident Panel (360px)]
          ROWS:    [Main Map + Panel (1fr)] [Priority Camera Wall (200px)]
      */}
      <div
        className="w-full h-full min-h-0 min-w-0 overflow-hidden grid"
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
