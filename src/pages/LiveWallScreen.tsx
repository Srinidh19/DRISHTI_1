import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { CameraFeed } from '../components/video/CameraFeed';
import { LayoutGrid, Grid3X3, Grid2X2, Check, Video, Sliders } from 'lucide-react';

export const LiveWallScreen: React.FC = () => {
  const { cameras, overlaySettings, setOverlaySettings } = useRealtime();
  const [gridSize, setGridSize] = useState<4 | 6 | 9 | 12>(6);
  const [selectedBop, setSelectedBop] = useState<string>('ALL');

  const filteredCameras = cameras
    .filter(c => (selectedBop === 'ALL' ? true : c.bop === selectedBop))
    .slice(0, gridSize);

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-hidden select-none">
      {/* Top Controls Bar */}
      <div className="p-2.5 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-info" />
          <h1 className="text-sm font-bold text-text uppercase tracking-wider">
            Operational CCTV Live Wall
          </h1>
          <span className="text-2xs text-text-dim">
            Displaying {filteredCameras.length} Synchronized Streams
          </span>
        </div>

        {/* Global Detection & Overlay Toggles */}
        <div className="flex items-center gap-3 text-2xs">
          <div className="flex items-center gap-3 px-2 py-1 rounded bg-surface-2 border border-border">
            <label className="flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text">
              <input
                type="checkbox"
                checked={overlaySettings.showDetections}
                onChange={e =>
                  setOverlaySettings(s => ({ ...s, showDetections: e.target.checked }))
                }
                className="rounded bg-surface border-border text-info focus:ring-0 w-3.5 h-3.5"
              />
              <span>Detection overlays</span>
            </label>

            <div className="h-3 w-px bg-border" />

            <label className="flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text">
              <input
                type="checkbox"
                checked={overlaySettings.showTrackIds}
                onChange={e =>
                  setOverlaySettings(s => ({ ...s, showTrackIds: e.target.checked }))
                }
                className="rounded bg-surface border-border text-info focus:ring-0 w-3.5 h-3.5"
              />
              <span>Track IDs</span>
            </label>

            <div className="h-3 w-px bg-border" />

            <label className="flex items-center gap-1.5 cursor-pointer text-text-muted hover:text-text">
              <input
                type="checkbox"
                checked={overlaySettings.showMotionVectors}
                onChange={e =>
                  setOverlaySettings(s => ({ ...s, showMotionVectors: e.target.checked }))
                }
                className="rounded bg-surface border-border text-info focus:ring-0 w-3.5 h-3.5"
              />
              <span>Motion vectors</span>
            </label>
          </div>

          {/* BOP Filter */}
          <div className="flex items-center gap-1">
            <span className="text-text-dim">SECTOR:</span>
            <select
              value={selectedBop}
              onChange={e => setSelectedBop(e.target.value)}
              className="bg-surface-2 border border-border rounded px-2 py-1 text-text focus:outline-none focus:border-info text-2xs"
            >
              <option value="ALL">ALL BOPS</option>
              <option value="BOP-17">BOP-17</option>
              <option value="BOP-18">BOP-18</option>
              <option value="BOP-19">BOP-19</option>
            </select>
          </div>

          {/* Grid Layout Switcher: 4, 6, 9, 12 */}
          <div className="flex items-center gap-1 bg-surface-2 p-0.5 rounded border border-border">
            {([4, 6, 9, 12] as const).map(size => (
              <button
                key={size}
                onClick={() => setGridSize(size)}
                className={`px-2 py-1 rounded text-2xs font-semibold transition-colors ${
                  gridSize === size
                    ? 'bg-surface-3 text-white'
                    : 'text-text-muted hover:text-text'
                }`}
              >
                {size} CAM
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Layout Canvas */}
      <div className="flex-1 p-2 overflow-y-auto min-h-0">
        <div
          className={`grid gap-2 h-full grid-cols-1 sm:grid-cols-2 ${
            gridSize === 4
              ? 'md:grid-cols-2 md:grid-rows-2'
              : gridSize === 6
              ? 'md:grid-cols-3 md:grid-rows-2'
              : gridSize === 9
              ? 'md:grid-cols-3 md:grid-rows-3'
              : 'md:grid-cols-4 md:grid-rows-3'
          }`}
        >
          {filteredCameras.map(cam => (
            <div key={cam.id} className="min-h-[180px] sm:min-h-[160px] h-52 sm:h-full">
              <CameraFeed camera={cam} aspectRatio="h-full w-full" showControls={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
