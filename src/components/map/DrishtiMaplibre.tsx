import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl, { GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRealtime } from '../../context/RealtimeContext';
import { Camera, Incident } from '../../types';
import {
  Layers,
  Crosshair,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Compass,
  Search,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Info,
  RefreshCw,
  X
} from 'lucide-react';
import { MAP_CONFIG } from '../../services/map/mapConfig';
import { resolveMapProvider, ProviderResolution } from '../../services/map/mapProvider';
import { MAP_STYLES } from '../../services/map/mapStyles';
import {
  cameraToFeature,
  incidentToFeature,
  trackToFeature,
  predictedPathToFeature,
  fenceToFeature,
  zoneToFeature,
  coverageToFeature,
  blindZoneToFeature,
  swanLinkToFeature
} from '../../services/map/geoJsonUtils';
import { Z_INDEX } from '../../styles/zIndex';

interface DrishtiMaplibreProps {
  onSelectIncident?: (incident: Incident) => void;
  onSelectCamera?: (camera: Camera) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export const DrishtiMaplibre: React.FC<DrishtiMaplibreProps> = ({
  onSelectIncident,
  onSelectCamera,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const {
    cameras,
    incidents,
    activeTracks,
    virtualFences,
    restrictedZones,
    shieldFaults,
    swanRequests,
    selectedCameraId,
    setSelectedCameraId,
    selectedIncidentId,
    setSelectedIncidentId
  } = useRealtime();

  // Map state
  const [coords, setCoords] = useState<string>('32.7325° N, 74.8645° E');
  const [activeStyleId, setActiveStyleId] = useState<string>('dataviz-dark');
  const [providerInfo, setProviderInfo] = useState<ProviderResolution>(() =>
    resolveMapProvider('dataviz-dark')
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  // Layer Visibility
  const [layers, setLayers] = useState({
    cameras: true,
    incidents: true,
    tracks: true,
    predictedPaths: true,
    fences: true,
    zones: true,
    coverage: false,
    blindZones: true,
    swanLinks: true
  });

  // 1. Initialize MapLibre GL instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resolution = resolveMapProvider(activeStyleId);
    setProviderInfo(resolution);

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: resolution.style,
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        minZoom: MAP_CONFIG.minZoom,
        maxZoom: MAP_CONFIG.maxZoom,
        attributionControl: false
      });

      map.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        setupGeoJsonSourcesAndLayers(map);
      });

      map.on('error', (e) => {
        // Suppress benign tile loading errors from breaking the map UI
        if (e.error?.message && !e.error.message.includes('404')) {
          console.warn('[DRISHTI Cartography] Map event:', e.error.message);
        }
      });

      map.on('mousemove', (e) => {
        setCoords(`${e.lngLat.lat.toFixed(4)}° N, ${e.lngLat.lng.toFixed(4)}° E`);
      });

      mapRef.current = map;

      // Attach ResizeObserver to auto-handle sidebar / drawer size shifts
      const resizeObserver = new ResizeObserver(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        markersRef.current.forEach(m => m.remove());
        markersRef.current = [];
        map.remove();
        mapRef.current = null;
        setMapLoaded(false);
      };
    } catch (err: any) {
      console.error('[DRISHTI Cartography] Init failed:', err);
      setMapError(err?.message || 'Failed to initialize MapLibre GL engine.');
    }
  }, [activeStyleId]);

  // 2. Setup Vector GeoJSON Sources & Render Layers
  const setupGeoJsonSourcesAndLayers = (map: maplibregl.Map) => {
    // A. Restricted Zones
    if (!map.getSource('zones-source')) {
      map.addSource('zones-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'zones-fill-layer',
        type: 'fill',
        source: 'zones-source',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.14
        }
      });
      map.addLayer({
        id: 'zones-outline-layer',
        type: 'line',
        source: 'zones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.5,
          'line-dasharray': [3, 2]
        }
      });
    }

    // B. Virtual Fences
    if (!map.getSource('fences-source')) {
      map.addSource('fences-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'fences-line-layer',
        type: 'line',
        source: 'fences-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 3,
          'line-dasharray': [4, 2]
        }
      });
    }

    // C. Camera Coverage (FOV Cones)
    if (!map.getSource('coverage-source')) {
      map.addSource('coverage-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'coverage-fill-layer',
        type: 'fill',
        source: 'coverage-source',
        paint: {
          'fill-color': '#477da8',
          'fill-opacity': 0.12
        }
      });
      map.addLayer({
        id: 'coverage-line-layer',
        type: 'line',
        source: 'coverage-source',
        paint: {
          'line-color': '#477da8',
          'line-width': 1,
          'line-opacity': 0.4
        }
      });
    }

    // D. Blind Zones (SHIELD Failures)
    if (!map.getSource('blind-zones-source')) {
      map.addSource('blind-zones-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'blind-zones-fill-layer',
        type: 'fill',
        source: 'blind-zones-source',
        paint: {
          'fill-color': '#c93c3c',
          'fill-opacity': 0.25
        }
      });
      map.addLayer({
        id: 'blind-zones-line-layer',
        type: 'line',
        source: 'blind-zones-source',
        paint: {
          'line-color': '#c93c3c',
          'line-width': 2,
          'line-dasharray': [2, 2]
        }
      });
    }

    // E. SWAN Links
    if (!map.getSource('swan-links-source')) {
      map.addSource('swan-links-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'swan-links-line-layer',
        type: 'line',
        source: 'swan-links-source',
        paint: {
          'line-color': '#c28a28',
          'line-width': 2,
          'line-dasharray': [3, 2]
        }
      });
    }

    // F. Active Tracks (Confirmed Trajectory)
    if (!map.getSource('tracks-source')) {
      map.addSource('tracks-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'tracks-line-layer',
        type: 'line',
        source: 'tracks-source',
        paint: {
          'line-color': '#c93c3c',
          'line-width': 3.5
        }
      });
    }

    // G. Predicted Paths
    if (!map.getSource('predicted-paths-source')) {
      map.addSource('predicted-paths-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'predicted-paths-line-layer',
        type: 'line',
        source: 'predicted-paths-source',
        paint: {
          'line-color': '#477da8',
          'line-width': 2.5,
          'line-dasharray': [4, 3]
        }
      });
    }

    syncGeoJsonData(map);
  };

  // 3. Update GeoJSON Source Data incrementally without map destruction
  const syncGeoJsonData = useCallback((mapInstance?: maplibregl.Map) => {
    const map = mapInstance || mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    // Zones
    const zonesSource = map.getSource('zones-source') as GeoJSONSource;
    if (zonesSource && layers.zones) {
      zonesSource.setData({
        type: 'FeatureCollection',
        features: restrictedZones.map(zoneToFeature)
      });
    } else if (zonesSource) {
      zonesSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // Fences
    const fencesSource = map.getSource('fences-source') as GeoJSONSource;
    if (fencesSource && layers.fences) {
      fencesSource.setData({
        type: 'FeatureCollection',
        features: virtualFences.map(fenceToFeature)
      });
    } else if (fencesSource) {
      fencesSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // Coverage
    const coverageSource = map.getSource('coverage-source') as GeoJSONSource;
    if (coverageSource && layers.coverage) {
      coverageSource.setData({
        type: 'FeatureCollection',
        features: cameras.map(coverageToFeature)
      });
    } else if (coverageSource) {
      coverageSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // Blind Zones
    const blindSource = map.getSource('blind-zones-source') as GeoJSONSource;
    if (blindSource && layers.blindZones) {
      const activeFaults = shieldFaults.filter(f => f.coverageLostPercent > 0);
      const features = activeFaults
        .map(f => blindZoneToFeature(f, cameras.find(c => c.id === f.cameraId)))
        .filter(Boolean) as GeoJSON.Feature<GeoJSON.Polygon>[];
      blindSource.setData({ type: 'FeatureCollection', features });
    } else if (blindSource) {
      blindSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // SWAN Links
    const swanSource = map.getSource('swan-links-source') as GeoJSONSource;
    if (swanSource && layers.swanLinks) {
      const features = swanRequests
        .map(r =>
          swanLinkToFeature(
            r,
            cameras.find(c => c.id === r.fromCamera),
            cameras.find(c => c.id === r.toCamera)
          )
        )
        .filter(Boolean) as GeoJSON.Feature<GeoJSON.LineString>[];
      swanSource.setData({ type: 'FeatureCollection', features });
    } else if (swanSource) {
      swanSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // Active Tracks
    const tracksSource = map.getSource('tracks-source') as GeoJSONSource;
    if (tracksSource && layers.tracks) {
      tracksSource.setData({
        type: 'FeatureCollection',
        features: activeTracks.map(trackToFeature)
      });
    } else if (tracksSource) {
      tracksSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // Predicted Paths
    const predictedSource = map.getSource('predicted-paths-source') as GeoJSONSource;
    if (predictedSource && layers.predictedPaths) {
      const features = activeTracks
        .map(t => {
          // Point towards CAM-06 if in sector
          const cam6 = cameras.find(c => c.id === 'CAM-06');
          const dest: [number, number] | undefined = cam6
            ? [cam6.coordinates[1], cam6.coordinates[0]]
            : undefined;
          return predictedPathToFeature(t, dest);
        })
        .filter(Boolean) as GeoJSON.Feature<GeoJSON.LineString>[];
      predictedSource.setData({ type: 'FeatureCollection', features });
    } else if (predictedSource) {
      predictedSource.setData({ type: 'FeatureCollection', features: [] });
    }
  }, [
    cameras,
    activeTracks,
    virtualFences,
    restrictedZones,
    shieldFaults,
    swanRequests,
    layers
  ]);

  // Sync GeoJSON data whenever dependencies change
  useEffect(() => {
    syncGeoJsonData();
  }, [syncGeoJsonData]);

  // 4. Tactical DOM Markers for Cameras, Incidents, and Target Pulses
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // A. Camera Markers
    if (layers.cameras) {
      cameras.slice(0, 15).forEach(cam => {
        const isSel = selectedCameraId === cam.id;
        const color =
          cam.health === 'WARNING'
            ? '#c28a28'
            : cam.health === 'OFFLINE'
            ? '#c93c3c'
            : cam.isPtzBackup
            ? '#477da8'
            : '#3f8f68';

        const el = document.createElement('div');
        el.className = 'cursor-pointer select-none transition-transform hover:scale-110';
        el.style.zIndex = isSel ? '45' : '25';
        el.innerHTML = `
          <div style="
            background: #181b1f;
            border: 1px solid ${isSel ? '#ffffff' : color};
            border-radius: 3px;
            padding: 2px 6px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 10px;
            font-weight: 600;
            color: #e5e7eb;
            display: flex;
            align-items: center;
            gap: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.85);
          ">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${color};box-shadow:0 0 6px ${color};"></span>
            <span>${cam.id}</span>
          </div>
        `;

        el.onclick = (e) => {
          e.stopPropagation();
          setSelectedCameraId(cam.id);
          if (onSelectCamera) onSelectCamera(cam);
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([cam.coordinates[1], cam.coordinates[0]])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // B. Incident Markers
    if (layers.incidents) {
      incidents
        .filter(inc => inc.status !== 'DISMISSED' && inc.status !== 'RESOLVED')
        .forEach(inc => {
          const primCam = cameras.find(c => c.id === inc.primaryCamera);
          if (!primCam) return;

          const isSel = selectedIncidentId === inc.id;
          const isCrit = inc.severity === 'CRITICAL';
          const color = isCrit ? '#c93c3c' : inc.severity === 'HIGH' ? '#c28a28' : '#477da8';

          const el = document.createElement('div');
          el.className = 'cursor-pointer select-none transition-transform hover:scale-110';
          el.style.zIndex = isSel ? '55' : '40';
          el.innerHTML = `
            <div style="
              background: #181b1f;
              border: 2px solid ${isSel ? '#ffffff' : color};
              border-radius: 4px;
              padding: 2px 6px;
              font-family: 'IBM Plex Mono', monospace;
              font-size: 10px;
              font-weight: bold;
              color: ${color};
              box-shadow: 0 0 12px ${color}99;
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span>▲</span>
              <span>${inc.id.replace('INC-2026-', 'INC-')}</span>
              <span style="font-size:8px;padding:1px 3px;background:${color}22;border-radius:2px;">${inc.riskScore}</span>
            </div>
          `;

          el.onclick = (e) => {
            e.stopPropagation();
            setSelectedIncidentId(inc.id);
            if (onSelectIncident) onSelectIncident(inc);
          };

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([primCam.coordinates[1] + 0.0007, primCam.coordinates[0] + 0.0007])
            .addTo(map);

          markersRef.current.push(marker);
        });
    }

    // C. Target T-104 Real-time Tracking Pulse
    if (layers.tracks && activeTracks.length > 0) {
      const activeTrack = activeTracks.find(t => t.id === 'T-104') || activeTracks[0];
      const lastWaypoint = activeTrack.waypoints[activeTrack.waypoints.length - 1];

      if (lastWaypoint) {
        const el = document.createElement('div');
        el.className = 'select-none pointer-events-none';
        el.innerHTML = `
          <div style="position:relative;display:flex;align-items:center;justify-content:center;">
            <div style="
              position:absolute;
              width:24px;
              height:24px;
              border-radius:50%;
              background:#c93c3c;
              opacity:0.35;
              animation:tactical-pulse 1.8s infinite ease-out;
            "></div>
            <div style="
              width:12px;
              height:12px;
              border-radius:50%;
              background:#c93c3c;
              border:2px solid #ffffff;
              box-shadow:0 0 8px #c93c3c;
              z-index:10;
            "></div>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lastWaypoint.lng, lastWaypoint.lat])
          .addTo(map);

        markersRef.current.push(marker);
      }
    }
  }, [
    mapLoaded,
    cameras,
    incidents,
    activeTracks,
    layers.cameras,
    layers.incidents,
    layers.tracks,
    selectedCameraId,
    selectedIncidentId,
    onSelectCamera,
    onSelectIncident
  ]);

  // Search Location / Object handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toUpperCase();
    if (!q || !mapRef.current) return;

    // Camera match
    const cam = cameras.find(c => c.id.toUpperCase() === q || c.name.toUpperCase().includes(q));
    if (cam) {
      mapRef.current.flyTo({
        center: [cam.coordinates[1], cam.coordinates[0]],
        zoom: 16.5,
        essential: true
      });
      setSelectedCameraId(cam.id);
      setSearchMessage(`Centered on ${cam.id}`);
      setTimeout(() => setSearchMessage(null), 3000);
      return;
    }

    // Incident match
    const inc = incidents.find(i => i.id.toUpperCase().includes(q));
    if (inc) {
      const camRef = cameras.find(c => c.id === inc.primaryCamera);
      if (camRef) {
        mapRef.current.flyTo({
          center: [camRef.coordinates[1], camRef.coordinates[0]],
          zoom: 16.5,
          essential: true
        });
        setSelectedIncidentId(inc.id);
        setSearchMessage(`Centered on ${inc.id}`);
        setTimeout(() => setSearchMessage(null), 3000);
        return;
      }
    }

    // Default sector search
    if (q.includes('BOP') || q.includes('SECTOR')) {
      mapRef.current.flyTo({
        center: MAP_CONFIG.defaultCenter,
        zoom: 14.8,
        essential: true
      });
      setSearchMessage('Centered on BOP-17 Sector');
      setTimeout(() => setSearchMessage(null), 3000);
      return;
    }

    setSearchMessage(`No asset found for "${searchQuery}"`);
    setTimeout(() => setSearchMessage(null), 3000);
  };

  // Zoom controls
  const handleZoomIn = () => mapRef.current?.zoomIn();
  const handleZoomOut = () => mapRef.current?.zoomOut();
  const handleResetCompass = () => mapRef.current?.resetNorthPitch({ duration: 500 });
  const handleRecenterSector = () => {
    mapRef.current?.flyTo({
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      essential: true
    });
  };

  return (
    <div
      className="relative w-full h-full min-w-0 min-h-0 overflow-hidden select-none bg-[#0f1114] font-mono"
      style={{ zIndex: Z_INDEX.MAP_CANVAS }}
    >
      {/* 1. Underlying MapLibre GL Canvas (occupies 100% of viewport) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: Z_INDEX.MAP_CANVAS }}
      />

      {/* 2. Loading State */}
      {!mapLoaded && !mapError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#0f1114]/80 text-text backdrop-blur-sm"
          style={{ zIndex: Z_INDEX.MAP_STATUS }}
        >
          <div className="flex flex-col items-center gap-3 p-4 bg-surface border border-border rounded shadow-2xl">
            <RefreshCw className="w-5 h-5 text-info animate-spin" />
            <div className="text-xs font-semibold tracking-wider">LOADING MAPLIBRE GIS CARTOGRAPHY</div>
            <div className="text-2xs text-text-dim">Synchronizing geographic sources & tactical layers...</div>
          </div>
        </div>
      )}

      {/* 3. Fatal Error State */}
      {mapError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#0f1114]/90 text-text p-6"
          style={{ zIndex: Z_INDEX.MAP_STATUS }}
        >
          <div className="max-w-md w-full bg-surface border border-critical p-4 rounded shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-critical text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Map Service Error</span>
            </div>
            <p className="text-2xs text-text-muted">{mapError}</p>
            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setMapError(null);
                  setActiveStyleId('fallback-dark');
                }}
                className="px-3 py-1 bg-surface-2 border border-border hover:bg-surface rounded text-xs text-text"
              >
                Switch to Fallback Raster Tiles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Dedicated Overlay Layer (Zero event blocking on canvas) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: Z_INDEX.MAP_OVERLAY_LAYER }}
      >
        {/* TOP LEFT: Operational Header & Quick Search */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 max-w-sm pointer-events-auto">
          {/* Status Badge & Coords */}
          <div className="bg-surface/95 border border-border px-2.5 py-1.5 rounded shadow-lg flex items-center gap-2.5 text-xs backdrop-blur-sm">
            <Crosshair className="w-3.5 h-3.5 text-info shrink-0" />
            <span className="font-bold text-text tracking-wide whitespace-nowrap">
              BOP-17 / NORTH SECTOR
            </span>
            <span className="text-2xs text-text-dim border-l border-border pl-2 whitespace-nowrap">
              {coords}
            </span>
          </div>

          {/* Clean Contained Map Service Configuration State (If MapTiler key is missing) */}
          {providerInfo.status === 'KEY_MISSING' && (
            <div className="bg-surface/95 border border-border p-2.5 rounded text-2xs shadow-xl backdrop-blur-sm space-y-1 max-w-[240px]">
              <div className="text-text-muted font-bold tracking-wider uppercase text-[10px]">MAP SERVICE</div>
              <div className="text-text flex items-center justify-between">
                <span className="text-text-dim">Provider:</span>
                <span className="font-semibold text-text">MapTiler</span>
              </div>
              <div className="text-text flex items-center justify-between">
                <span className="text-text-dim">Status:</span>
                <span className="text-warning font-semibold">Configuration required</span>
              </div>
              <button
                onClick={() => setShowConfigModal(true)}
                className="mt-1 w-full px-2 py-1 bg-surface-2 hover:bg-surface-3 border border-border rounded text-2xs text-info font-semibold transition-colors text-center block"
              >
                Configure map
              </button>
            </div>
          )}

          {/* Search Asset Bar */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search camera (CAM-03) or incident..."
              className="w-64 bg-surface/95 border border-border rounded px-2.5 py-1 text-xs text-text placeholder-text-dim focus:outline-none focus:border-info shadow"
            />
            <button
              type="submit"
              className="absolute right-1 text-text-dim hover:text-text p-0.5"
              title="Locate Asset"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {searchMessage && (
            <div className="bg-surface-2/95 border border-border px-2 py-0.5 rounded text-2xs text-info shadow">
              {searchMessage}
            </div>
          )}
        </div>

        {/* TOP RIGHT: Clean Map Toolbar (MAP: VECTOR | Layers | Fullscreen) */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-auto">
          {/* Active Style Indicator */}
          <button
            onClick={() => setShowLayerMenu(prev => !prev)}
            className="px-2.5 py-1 bg-surface/95 border border-border hover:bg-surface-2 rounded text-xs font-semibold text-text shadow-lg transition-colors backdrop-blur-sm flex items-center gap-1.5"
            title="Change Map Style in Layers Popover"
          >
            <span className="text-text-dim">MAP:</span>
            <span className="text-info">{MAP_STYLES[activeStyleId]?.name || 'VECTOR'}</span>
          </button>

          {/* Layer Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-surface/95 border border-border hover:bg-surface-2 rounded text-xs text-text shadow-lg transition-colors backdrop-blur-sm"
              title="Toggle Tactical Map Layers & Cartography"
            >
              <Layers className="w-3.5 h-3.5 text-info" />
              <span>Layers</span>
            </button>

            {showLayerMenu && (
              <div
                className="absolute right-0 mt-1 w-60 bg-surface-2/95 border border-border rounded shadow-2xl p-3 space-y-3 text-xs backdrop-blur-md"
                style={{ zIndex: Z_INDEX.MAP_CONTROLS }}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-border">
                  <span className="text-2xs text-text-dim uppercase tracking-wider font-semibold">
                    Map Settings & Layers
                  </span>
                  <button
                    onClick={() => setShowLayerMenu(false)}
                    className="text-text-dim hover:text-text"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Base Cartography Selector */}
                <div className="space-y-1.5 pb-2 border-b border-border">
                  <span className="text-2xs text-text-dim uppercase tracking-wider font-semibold block">
                    Base Cartography
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {Object.entries(MAP_STYLES).map(([key, style]) => (
                      <button
                        key={key}
                        onClick={() => setActiveStyleId(key)}
                        className={`px-2 py-1 rounded text-2xs text-left transition-colors truncate ${
                          activeStyleId === key
                            ? 'bg-info text-white font-bold'
                            : 'bg-surface hover:bg-surface-3 text-text-muted hover:text-text'
                        }`}
                      >
                        {style.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.cameras}
                      onChange={e => setLayers(l => ({ ...l, cameras: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Cameras (50 Nodes)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.incidents}
                      onChange={e => setLayers(l => ({ ...l, incidents: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Incidents & Priority Nodes</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.tracks}
                      onChange={e => setLayers(l => ({ ...l, tracks: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Active Tracks (T-104)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.predictedPaths}
                      onChange={e => setLayers(l => ({ ...l, predictedPaths: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Predicted Trajectories</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.fences}
                      onChange={e => setLayers(l => ({ ...l, fences: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Virtual Fences (VF-01/02)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.zones}
                      onChange={e => setLayers(l => ({ ...l, zones: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Restricted Buffer Zones</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.coverage}
                      onChange={e => setLayers(l => ({ ...l, coverage: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>Camera FOV Coverage Cones</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.blindZones}
                      onChange={e => setLayers(l => ({ ...l, blindZones: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>SHIELD Blind Zones</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.swanLinks}
                      onChange={e => setLayers(l => ({ ...l, swanLinks: e.target.checked }))}
                      className="rounded bg-surface border-border text-info focus:ring-0"
                    />
                    <span>SWAN Cross-Camera Links</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Button */}
          {onToggleFullscreen && (
            <button
              onClick={onToggleFullscreen}
              className="p-1 bg-surface/95 border border-border hover:bg-surface-2 rounded text-text shadow-lg transition-colors backdrop-blur-sm"
              title={isFullscreen ? 'Exit Fullscreen Map' : 'Enter Fullscreen Map'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* BOTTOM LEFT: Scale / Legend Toggle */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1.5 pointer-events-auto">
          {showLegend && (
            <div
              className="bg-surface/95 border border-border p-2 rounded shadow-2xl text-2xs space-y-1.5 backdrop-blur-sm max-w-xs"
              style={{ zIndex: Z_INDEX.MAP_LEGEND }}
            >
              <div className="flex items-center justify-between pb-1 border-b border-border font-bold text-text">
                <span>TACTICAL SYMBOLOGY</span>
                <button onClick={() => setShowLegend(false)} className="text-text-dim hover:text-text">
                  <X className="w-3 h-3" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3f8f68]"></span>
                  <span className="text-text-muted">Camera Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c93c3c]"></span>
                  <span className="text-text-muted">Camera Offline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#477da8]"></span>
                  <span className="text-text-muted">PTZ Recovery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-critical font-bold">▲</span>
                  <span className="text-text-muted">Critical Incident</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-[#c93c3c]"></span>
                  <span className="text-text-muted">Target Trajectory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-b border-dashed border-[#477da8]"></span>
                  <span className="text-text-muted">Predicted Path</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 border-b border-dashed border-[#3f8f68]"></span>
                  <span className="text-text-muted">Virtual Fence</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#c28a28] opacity-30 border border-[#c28a28]"></span>
                  <span className="text-text-muted">Restricted Buffer</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-2 py-0.5 bg-surface/95 border border-border hover:bg-surface-2 rounded text-2xs text-text shadow backdrop-blur-sm"
            >
              {showLegend ? 'Hide Legend' : 'Legend'}
            </button>
            <span className="text-2xs text-text-dim font-mono bg-surface/90 px-1.5 py-0.5 rounded border border-border">
              SCALE: 1 : 15,000 | WGS84
            </span>
          </div>
        </div>

        {/* BOTTOM RIGHT: Navigation / Zoom Controls */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 pointer-events-auto">
          <button
            onClick={handleZoomIn}
            className="p-1.5 bg-surface/95 border border-border hover:bg-surface-2 text-text rounded shadow backdrop-blur-sm"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 bg-surface/95 border border-border hover:bg-surface-2 text-text rounded shadow backdrop-blur-sm"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetCompass}
            className="p-1.5 bg-surface/95 border border-border hover:bg-surface-2 text-text rounded shadow backdrop-blur-sm"
            title="Reset North Orientation"
          >
            <Compass className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRecenterSector}
            className="p-1.5 bg-surface/95 border border-border hover:bg-surface-2 text-info rounded shadow backdrop-blur-sm"
            title="Recenter on BOP-17 Sector"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. Map Provider Configuration Modal */}
      {showConfigModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ zIndex: Z_INDEX.MODAL }}
        >
          <div className="bg-surface border border-border rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-info" />
                <span className="font-bold text-sm text-text">Map Provider Configuration</span>
              </div>
              <button onClick={() => setShowConfigModal(false)} className="text-text-muted hover:text-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-text-muted leading-relaxed">
              <p>
                DRISHTI uses <span className="text-text font-semibold">MapLibre GL JS</span> for tactical vector rendering.
                To enable MapTiler high-resolution vector tiles or satellite imagery:
              </p>
              <ol className="list-decimal list-inside space-y-1 bg-surface-2 p-3 rounded border border-border font-mono text-2xs text-text">
                <li>Create a free account at <span className="text-info">maptiler.com</span></li>
                <li>Add your key to <span className="text-warning">.env</span>:</li>
                <li className="text-text-muted">VITE_MAP_PROVIDER=maptiler</li>
                <li className="text-text-muted">VITE_MAPTILER_API_KEY=your_key_here</li>
                <li>Restart the Vite frontend dev server</li>
              </ol>
              <p className="text-2xs text-text-dim">
                Note: In development and offline environments, DRISHTI automatically activates keyless tactical dark tiles with full vector layer support. No operational downtime occurs.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowConfigModal(false)}
                className="px-4 py-1.5 bg-info hover:bg-info/90 text-white font-semibold rounded text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
