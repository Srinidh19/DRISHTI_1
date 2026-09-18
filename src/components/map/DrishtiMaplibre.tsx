import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl, { GeoJSONSource, LngLatBounds } from 'maplibre-gl';
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
  AlertTriangle,
  Radio,
  Info,
  RefreshCw,
  X,
  Navigation,
  Globe,
  Focus,
  Eye,
  Activity,
  Shield,
  ShieldAlert,
  CheckCircle2,
  MapPin
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
  swanLinkToFeature,
  bopBoundaryToFeature
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
  const [currentZoom, setCurrentZoom] = useState<number>(MAP_CONFIG.defaultZoom);
  const [scaleDistance, setScaleDistance] = useState<string>('500 m');
  const [scaleWidthPx, setScaleWidthPx] = useState<number>(80);
  const [activeStyleId, setActiveStyleId] = useState<string>(MAP_CONFIG.defaultStyle || 'satellite-hybrid');
  const [providerInfo, setProviderInfo] = useState<ProviderResolution>(() =>
    resolveMapProvider(MAP_CONFIG.defaultStyle || 'satellite-hybrid')
  );
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoNotice, setGeoNotice] = useState<string | null>(null);

  // Operational Layer Visibility toggles
  const [layers, setLayers] = useState({
    cameras: true,
    incidents: true,
    tracks: true,
    predictedPaths: true,
    fences: true,
    zones: true,
    coverage: false,
    blindZones: true,
    swanLinks: true,
    bopBoundaries: true
  });

  // Calculate dynamic metric scale based on latitude and current zoom
  const updateScaleBar = useCallback((zoom: number, lat: number) => {
    // Meters per pixel at equator is ~156543.03392, adjusted for latitude
    const metersPerPixel = (156543.03392 * Math.cos((lat * Math.PI) / 180)) / Math.pow(2, zoom);
    // Desired scale bar display range between 50px and 120px
    const targetMeters = metersPerPixel * 80;

    let displayMeters: number;
    let label: string;

    if (targetMeters >= 5000) {
      displayMeters = Math.round(targetMeters / 5000) * 5000;
      label = `${displayMeters / 1000} km`;
    } else if (targetMeters >= 1000) {
      displayMeters = Math.round(targetMeters / 1000) * 1000;
      label = `${displayMeters / 1000} km`;
    } else if (targetMeters >= 500) {
      displayMeters = 500;
      label = '500 m';
    } else if (targetMeters >= 200) {
      displayMeters = 200;
      label = '200 m';
    } else if (targetMeters >= 100) {
      displayMeters = 100;
      label = '100 m';
    } else {
      displayMeters = 50;
      label = '50 m';
    }

    const calculatedPx = Math.max(30, Math.min(140, Math.round(displayMeters / metersPerPixel)));
    setScaleDistance(label);
    setScaleWidthPx(calculatedPx);
    setCurrentZoom(zoom);
  }, []);

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
        pitch: 15,
        attributionControl: false,
        doubleClickZoom: true,
        dragRotate: true,
        touchPitch: true
      });

      map.on('load', () => {
        setMapLoaded(true);
        setMapError(null);
        setupGeoJsonSourcesAndLayers(map);
        const center = map.getCenter();
        updateScaleBar(map.getZoom(), center.lat);
      });

      map.on('error', (e) => {
        // Benign tile 404s/network retries should not block operational interface
        if (e.error?.message && !e.error.message.includes('404') && !e.error.message.includes('Tile')) {
          console.warn('[DRISHTI Satellite Cartography] Event notice:', e.error.message);
        }
      });

      map.on('mousemove', (e) => {
        setCoords(`${e.lngLat.lat.toFixed(4)}° N, ${e.lngLat.lng.toFixed(4)}° E`);
      });

      map.on('zoom', () => {
        const center = map.getCenter();
        updateScaleBar(map.getZoom(), center.lat);
      });

      map.on('move', () => {
        const center = map.getCenter();
        updateScaleBar(map.getZoom(), center.lat);
      });

      mapRef.current = map;

      // Handle sidebar / window resize cleanly
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
  }, [activeStyleId, updateScaleBar]);

  // 2. Setup Vector GeoJSON Sources & Layers
  const setupGeoJsonSourcesAndLayers = (map: maplibregl.Map) => {
    // A. BOP-17 Sector Line / Tactical Boundary
    if (!map.getSource('bop-boundary-source')) {
      map.addSource('bop-boundary-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [bopBoundaryToFeature()] }
      });
      map.addLayer({
        id: 'bop-boundary-glow-layer',
        type: 'line',
        source: 'bop-boundary-source',
        paint: {
          'line-color': '#f59e0b',
          'line-width': 4,
          'line-opacity': 0.35,
          'line-blur': 2
        }
      });
      map.addLayer({
        id: 'bop-boundary-line-layer',
        type: 'line',
        source: 'bop-boundary-source',
        paint: {
          'line-color': '#fbbf24',
          'line-width': 2,
          'line-dasharray': [4, 3]
        }
      });
    }

    // B. Restricted Buffer Zones
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
          'fill-opacity': 0.18
        }
      });
      map.addLayer({
        id: 'zones-outline-layer',
        type: 'line',
        source: 'zones-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 1.8,
          'line-dasharray': [3, 2]
        }
      });
    }

    // C. Virtual Fences
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
          'line-width': 3.5,
          'line-dasharray': [4, 2]
        }
      });
    }

    // D. Camera Coverage Cones (FOV)
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
          'fill-color': '#38bdf8',
          'fill-opacity': 0.15
        }
      });
      map.addLayer({
        id: 'coverage-line-layer',
        type: 'line',
        source: 'coverage-source',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 1.2,
          'line-opacity': 0.5
        }
      });
    }

    // E. Blind Zones (SHIELD Failures)
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
          'fill-color': '#ef4444',
          'fill-opacity': 0.28
        }
      });
      map.addLayer({
        id: 'blind-zones-line-layer',
        type: 'line',
        source: 'blind-zones-source',
        paint: {
          'line-color': '#ef4444',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });
    }

    // F. SWAN Camera Handoff Links
    if (!map.getSource('swan-links-source')) {
      map.addSource('swan-links-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'swan-links-glow-layer',
        type: 'line',
        source: 'swan-links-source',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 5,
          'line-opacity': 0.25,
          'line-blur': 3
        }
      });
      map.addLayer({
        id: 'swan-links-line-layer',
        type: 'line',
        source: 'swan-links-source',
        paint: {
          'line-color': '#0ea5e9',
          'line-width': 2.5,
          'line-dasharray': [3, 2]
        }
      });
    }

    // G. Active Tracks (Confirmed Trajectory)
    if (!map.getSource('tracks-source')) {
      map.addSource('tracks-source', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      });
      map.addLayer({
        id: 'tracks-glow-layer',
        type: 'line',
        source: 'tracks-source',
        paint: {
          'line-color': '#ef4444',
          'line-width': 6,
          'line-opacity': 0.35,
          'line-blur': 2
        }
      });
      map.addLayer({
        id: 'tracks-line-layer',
        type: 'line',
        source: 'tracks-source',
        paint: {
          'line-color': '#ef4444',
          'line-width': 3.5
        }
      });
    }

    // H. SWAN Predicted Paths
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
          'line-color': '#38bdf8',
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

    // BOP Boundary
    const bopSource = map.getSource('bop-boundary-source') as GeoJSONSource;
    if (bopSource && layers.bopBoundaries) {
      bopSource.setData({ type: 'FeatureCollection', features: [bopBoundaryToFeature()] });
    } else if (bopSource) {
      bopSource.setData({ type: 'FeatureCollection', features: [] });
    }

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

    // Blind Zones (SHIELD Faults)
    const blindSource = map.getSource('blind-zones-source') as GeoJSONSource;
    if (blindSource && layers.blindZones) {
      const activeFaults = shieldFaults.filter(f => f.coverageLostPercent > 0);
      const features = activeFaults
        .map(f => blindZoneToFeature(f, cameras.find(c => c.id === f.cameraId || (f.cameraId === 'CAM-03' && c.id === 'CAM-FENCE-03'))))
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
            cameras.find(c => c.id === r.fromCamera || (r.fromCamera === 'CAM-03' && c.id === 'CAM-FENCE-03')),
            cameras.find(c => c.id === r.toCamera || (r.toCamera === 'CAM-04' && c.id === 'CAM-04'))
          )
        )
        .filter(Boolean) as GeoJSON.Feature<GeoJSON.LineString>[];
      swanSource.setData({ type: 'FeatureCollection', features });
    } else if (swanSource) {
      swanSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // Active Tracks (Confirmed Path)
    const tracksSource = map.getSource('tracks-source') as GeoJSONSource;
    if (tracksSource && layers.tracks) {
      tracksSource.setData({
        type: 'FeatureCollection',
        features: activeTracks.map(trackToFeature)
      });
    } else if (tracksSource) {
      tracksSource.setData({ type: 'FeatureCollection', features: [] });
    }

    // SWAN Predicted Paths
    const predictedSource = map.getSource('predicted-paths-source') as GeoJSONSource;
    if (predictedSource && layers.predictedPaths) {
      const features = activeTracks
        .map(t => {
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

  // Sync data on changes
  useEffect(() => {
    syncGeoJsonData();
  }, [syncGeoJsonData]);

  // 4. Tactical Camera & Incident DOM Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Distinct Priority Cameras for Tactical Representation
    // e.g. CAM-FENCE-03, CAM-ROAD-05, CAM-04, CAM-06, CAM-07, CAM-TOWER-01, CAM-11, CAM-GATE-02, CAM-PERIMETER-08, CAM-VALLEY-09, CAM-BARRIER-10
    if (layers.cameras) {
      const renderedCameraIds = new Set<string>();

      // Filter cameras to priority sector nodes + first 15 to avoid clutter
      const prioritizedCams = cameras.filter(c => {
        if (renderedCameraIds.has(c.id)) return false;
        renderedCameraIds.add(c.id);
        return true;
      }).slice(0, 16);

      prioritizedCams.forEach(cam => {
        const isSel = selectedCameraId === cam.id || (selectedCameraId === 'CAM-03' && cam.id === 'CAM-FENCE-03');
        const hasFault = shieldFaults.some(f => (f.cameraId === cam.id || (f.cameraId === 'CAM-03' && cam.id === 'CAM-FENCE-03')) && f.coverageLostPercent > 0);
        const isTracking = cam.detectedObjects && cam.detectedObjects.some(d => d.trackId === 'T-104');
        const isBackupActive = cam.isPtzBackup && (cam.id === 'CAM-06' || cam.id === 'CAM-TOWER-01' || cam.id === 'CAM-ROAD-05') && hasFault;

        // Determine discrete state label and styling
        let stateLabel = 'LIVE';
        let stateColor = '#22c55e'; // emerald
        let stateBg = '#064e3b';

        if (hasFault) {
          stateLabel = 'FAULT DETECTED';
          stateColor = '#ef4444'; // crimson
          stateBg = '#7f1d1d';
        } else if (isBackupActive) {
          stateLabel = 'BACKUP ACTIVE';
          stateColor = '#38bdf8'; // cyan
          stateBg = '#0c4a6e';
        } else if (isTracking) {
          stateLabel = 'TRACKING';
          stateColor = '#f59e0b'; // amber
          stateBg = '#78350f';
        } else if (cam.health === 'OFFLINE') {
          stateLabel = 'OFFLINE';
          stateColor = '#991b1b';
          stateBg = '#450a0a';
        } else if (cam.health === 'WARNING') {
          stateLabel = 'WARNING';
          stateColor = '#f59e0b';
          stateBg = '#78350f';
        } else if (cam.isPtzBackup) {
          stateLabel = 'STANDBY PTZ';
          stateColor = '#94a3b8';
          stateBg = '#1e293b';
        }

        const el = document.createElement('div');
        el.className = 'cursor-pointer select-none transition-transform hover:scale-105';
        el.style.zIndex = isSel ? '45' : '25';
        el.innerHTML = `
          <div style="
            background: #111419;
            border: 1.5px solid ${isSel ? '#ffffff' : stateColor};
            border-radius: 4px;
            padding: 3px 6px;
            font-family: 'IBM Plex Mono', monospace;
            font-size: 10px;
            font-weight: 600;
            color: #f3f4f6;
            display: flex;
            align-items: center;
            gap: 5px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.9);
            white-space: nowrap;
          ">
            <span style="
              display: inline-block;
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background: ${stateColor};
              box-shadow: 0 0 6px ${stateColor};
            "></span>
            <span style="font-weight: 700; letter-spacing: 0.5px;">${cam.id}</span>
            <span style="
              font-size: 8px;
              padding: 1px 4px;
              border-radius: 2px;
              background: ${stateBg};
              color: ${stateColor};
              font-weight: 700;
              letter-spacing: 0.3px;
            ">${stateLabel}</span>
          </div>
        `;

        el.onclick = (e) => {
          e.stopPropagation();
          setSelectedCameraId(cam.id);
          if (onSelectCamera) onSelectCamera(cam);
          map.flyTo({
            center: [cam.coordinates[1], cam.coordinates[0]],
            zoom: Math.max(map.getZoom(), 15.5),
            essential: true
          });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([cam.coordinates[1], cam.coordinates[0]])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // Incidents Overlay
    if (layers.incidents) {
      incidents
        .filter(inc => inc.status !== 'DISMISSED' && inc.status !== 'RESOLVED')
        .forEach(inc => {
          const primCam = cameras.find(c => c.id === inc.primaryCamera || (inc.primaryCamera === 'CAM-03' && c.id === 'CAM-FENCE-03'));
          if (!primCam) return;

          const isSel = selectedIncidentId === inc.id;
          const isCrit = inc.severity === 'CRITICAL';
          const color = isCrit ? '#ef4444' : inc.severity === 'HIGH' ? '#f59e0b' : '#38bdf8';
          const bg = isCrit ? '#7f1d1d' : '#78350f';

          const el = document.createElement('div');
          el.className = 'cursor-pointer select-none transition-transform hover:scale-110';
          el.style.zIndex = isSel ? '55' : '40';
          el.innerHTML = `
            <div style="
              background: #111419;
              border: 2px solid ${isSel ? '#ffffff' : color};
              border-radius: 4px;
              padding: 3px 7px;
              font-family: 'IBM Plex Mono', monospace;
              font-size: 10px;
              font-weight: 700;
              color: ${color};
              box-shadow: 0 4px 16px rgba(0,0,0,0.95);
              display: flex;
              align-items: center;
              gap: 5px;
            ">
              <span style="font-size: 11px;">▲</span>
              <span>${inc.id.replace('INC-2026-', 'INC-')}</span>
              <span style="font-size: 8px; padding: 1px 4px; background: ${bg}; color: #ffffff; border-radius: 2px;">
                ${inc.severity} [${inc.riskScore}]
              </span>
            </div>
          `;

          el.onclick = (e) => {
            e.stopPropagation();
            setSelectedIncidentId(inc.id);
            if (onSelectIncident) onSelectIncident(inc);
            map.flyTo({
              center: [primCam.coordinates[1] + 0.0006, primCam.coordinates[0] + 0.0006],
              zoom: Math.max(map.getZoom(), 16),
              essential: true
            });
          };

          const marker = new maplibregl.Marker({ element: el })
            .setLngLat([primCam.coordinates[1] + 0.0007, primCam.coordinates[0] + 0.0007])
            .addTo(map);

          markersRef.current.push(marker);
        });
    }

    // Real-time Target T-104 Pulse Marker
    if (layers.tracks && activeTracks.length > 0) {
      const activeTrack = activeTracks.find(t => t.id === 'T-104') || activeTracks[0];
      const lastWaypoint = activeTrack.waypoints[activeTrack.waypoints.length - 1];

      if (lastWaypoint) {
        const el = document.createElement('div');
        el.className = 'select-none pointer-events-none';
        el.innerHTML = `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #ef4444;
              opacity: 0.35;
              animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
            <div style="
              width: 13px;
              height: 13px;
              border-radius: 50%;
              background: #ef4444;
              border: 2.5px solid #ffffff;
              box-shadow: 0 0 10px #ef4444;
              z-index: 10;
            "></div>
            <div style="
              position: absolute;
              bottom: 18px;
              background: #111419;
              border: 1px solid #ef4444;
              border-radius: 2px;
              padding: 1px 4px;
              font-family: 'IBM Plex Mono', monospace;
              font-size: 8px;
              font-weight: 700;
              color: #fca5a5;
              white-space: nowrap;
              box-shadow: 0 2px 6px rgba(0,0,0,0.8);
            ">
              TARGET T-104 (INTRUSION)
            </div>
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
    shieldFaults,
    layers.cameras,
    layers.incidents,
    layers.tracks,
    selectedCameraId,
    selectedIncidentId,
    onSelectCamera,
    onSelectIncident
  ]);

  // 5. Intelligent "Fit Operational Area" Auto-Fit Action
  const handleFitOperationalArea = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const bounds = new maplibregl.LngLatBounds();
    let count = 0;

    // Add relevant cameras
    cameras.slice(0, 15).forEach(c => {
      bounds.extend([c.coordinates[1], c.coordinates[0]]);
      count++;
    });

    // Add active track points
    activeTracks.forEach(t => {
      t.waypoints.forEach(w => {
        bounds.extend([w.lng, w.lat]);
        count++;
      });
    });

    // Add virtual fences
    virtualFences.forEach(f => {
      f.coordinates.forEach(c => {
        bounds.extend([c[1], c[0]]);
        count++;
      });
    });

    if (count > 0 && !bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: { top: 70, bottom: 70, left: 70, right: 70 },
        maxZoom: 16,
        duration: 1200,
        essential: true
      });
      setSearchMessage('Operational Area Fitted');
      setTimeout(() => setSearchMessage(null), 2500);
    }
  }, [cameras, activeTracks, virtualFences]);

  // Zoom controls
  const handleZoomIn = () => {
    mapRef.current?.zoomIn({ duration: 300 });
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut({ duration: 300 });
  };

  const handleResetCompass = () => {
    mapRef.current?.resetNorthPitch({ duration: 600 });
  };

  const handleRecenterSector = () => {
    mapRef.current?.flyTo({
      center: MAP_CONFIG.defaultCenter,
      zoom: MAP_CONFIG.defaultZoom,
      pitch: 15,
      essential: true
    });
    setSearchMessage('Centered on Sector BOP-17');
    setTimeout(() => setSearchMessage(null), 2500);
  };

  // Recenter to Operator Geolocation (Separated from operational data)
  const handleRecenterGeolocation = () => {
    if (!navigator.geolocation) {
      setGeoNotice('Geolocation is not supported by your browser');
      setTimeout(() => setGeoNotice(null), 3000);
      return;
    }

    setIsGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocating(false);
        const { latitude, longitude } = position.coords;
        mapRef.current?.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true
        });
        setGeoNotice('Operator Location Acquired (Reference Only)');
        setTimeout(() => setGeoNotice(null), 4000);
      },
      (error) => {
        setIsGeolocating(false);
        setGeoNotice('Geolocation denied/unavailable. Remaining centered on sector.');
        setTimeout(() => setGeoNotice(null), 3500);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Fullscreen Handler (Prop fallback to Native DOM)
  const handleToggleFullscreenInternal = () => {
    if (onToggleFullscreen) {
      onToggleFullscreen();
      return;
    }
    if (!document.fullscreenElement) {
      mapContainerRef.current?.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Asset Search Form Handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toUpperCase();
    if (!q || !mapRef.current) return;

    // 1. Camera Search
    const cam = cameras.find(c =>
      c.id.toUpperCase() === q ||
      c.name.toUpperCase().includes(q) ||
      (q === 'CAM-03' && c.id === 'CAM-FENCE-03') ||
      (q === 'CAM-FENCE-03' && c.id === 'CAM-03')
    );
    if (cam) {
      mapRef.current.flyTo({
        center: [cam.coordinates[1], cam.coordinates[0]],
        zoom: 16.5,
        essential: true
      });
      setSelectedCameraId(cam.id);
      if (onSelectCamera) onSelectCamera(cam);
      setSearchMessage(`Located node ${cam.id}`);
      setTimeout(() => setSearchMessage(null), 3000);
      return;
    }

    // 2. Incident Search
    const inc = incidents.find(i => i.id.toUpperCase().includes(q));
    if (inc) {
      const camRef = cameras.find(c => c.id === inc.primaryCamera || (inc.primaryCamera === 'CAM-03' && c.id === 'CAM-FENCE-03'));
      if (camRef) {
        mapRef.current.flyTo({
          center: [camRef.coordinates[1], camRef.coordinates[0]],
          zoom: 16.5,
          essential: true
        });
        setSelectedIncidentId(inc.id);
        if (onSelectIncident) onSelectIncident(inc);
        setSearchMessage(`Located incident ${inc.id}`);
        setTimeout(() => setSearchMessage(null), 3000);
        return;
      }
    }

    // 3. Target Search (T-104)
    if (q.includes('T-104') || q.includes('104')) {
      const activeTrack = activeTracks.find(t => t.id === 'T-104') || activeTracks[0];
      if (activeTrack && activeTrack.waypoints.length > 0) {
        const wp = activeTrack.waypoints[activeTrack.waypoints.length - 1];
        mapRef.current.flyTo({
          center: [wp.lng, wp.lat],
          zoom: 16.5,
          essential: true
        });
        setSearchMessage('Located Target T-104');
        setTimeout(() => setSearchMessage(null), 3000);
        return;
      }
    }

    // 4. Default Sector Search
    if (q.includes('BOP') || q.includes('SECTOR') || q.includes('SECTOR-17')) {
      mapRef.current.flyTo({
        center: MAP_CONFIG.defaultCenter,
        zoom: MAP_CONFIG.defaultZoom,
        essential: true
      });
      setSearchMessage('Centered on BOP-17 Sector');
      setTimeout(() => setSearchMessage(null), 3000);
      return;
    }

    setSearchMessage(`No asset found for "${searchQuery}"`);
    setTimeout(() => setSearchMessage(null), 3000);
  };

  return (
    <div
      className="relative w-full h-full min-w-0 min-h-0 overflow-hidden select-none bg-[#0b0d10] font-mono"
      style={{ zIndex: Z_INDEX.MAP_CANVAS }}
    >
      {/* 1. Underlying MapLibre GL Interactive Canvas (Pan, Zoom, Tilt, Rotate) */}
      <div
        ref={mapContainerRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: Z_INDEX.MAP_CANVAS }}
      />

      {/* 2. Loading State Indicator */}
      {!mapLoaded && !mapError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#0b0d10]/85 text-text backdrop-blur-sm"
          style={{ zIndex: Z_INDEX.MAP_STATUS }}
        >
          <div className="flex flex-col items-center gap-2.5 p-4 bg-surface-2/95 border border-border rounded shadow-2xl">
            <RefreshCw className="w-5 h-5 text-info animate-spin" />
            <div className="text-xs font-bold tracking-wider text-white">LOADING SATELLITE CARTOGRAPHY</div>
            <div className="text-2xs text-text-dim">Streaming high-resolution basemap & tactical telemetry...</div>
          </div>
        </div>
      )}

      {/* 3. Map Error Notification */}
      {mapError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#0b0d10]/90 text-text p-4"
          style={{ zIndex: Z_INDEX.MAP_STATUS }}
        >
          <div className="max-w-md w-full bg-surface-2 border border-critical p-4 rounded shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-critical text-xs font-bold uppercase">
              <AlertTriangle className="w-4 h-4" />
              <span>Map Service Warning</span>
            </div>
            <p className="text-2xs text-text-muted">{mapError}</p>
            <div className="pt-1 flex justify-end gap-2">
              <button
                onClick={() => {
                  setMapError(null);
                  setActiveStyleId('satellite-hybrid');
                }}
                className="px-3 py-1 bg-surface-3 border border-border hover:bg-surface rounded text-xs text-text font-bold"
              >
                Reload Live Satellite Tiles
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tactical GIS Overlay Layer (Zero event blocking on canvas) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: Z_INDEX.MAP_OVERLAY_LAYER }}
      >
        {/* TOP LEFT: Operational Telemetry, Sector Title & Asset Search */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 max-w-sm pointer-events-auto">
          {/* Real Satellite vs Simulated Operational Data Banner */}
          <div className="bg-[#111419]/95 border border-[#30353b] px-2.5 py-1 rounded shadow-lg flex items-center gap-2 text-[10px] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="font-bold text-emerald-400 uppercase tracking-wider">LIVE SATELLITE BASEMAP</span>
            <span className="text-[#64748b]">|</span>
            <span className="text-text-dim uppercase tracking-wider">SIMULATED DRISHTI C4I LAYER</span>
          </div>

          {/* Sector Coordinates & Zoom readout */}
          <div className="bg-[#111419]/95 border border-[#30353b] px-2.5 py-1.5 rounded shadow-lg flex items-center gap-2 text-xs backdrop-blur-md">
            <Crosshair className="w-3.5 h-3.5 text-info shrink-0" />
            <span className="font-bold text-white tracking-wide whitespace-nowrap">
              BOP-17 / NORTH SECTOR
            </span>
            <span className="text-2xs text-text-dim border-l border-[#30353b] pl-2 whitespace-nowrap">
              {coords}
            </span>
          </div>

          {/* Asset Search Input */}
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search camera (CAM-FENCE-03) or target (T-104)..."
              className="w-48 sm:w-64 md:w-72 bg-[#111419]/95 border border-[#30353b] rounded px-2.5 py-1 text-2xs sm:text-xs text-white placeholder-text-dim focus:outline-none focus:border-info shadow-lg backdrop-blur-md"
            />
            <button
              type="submit"
              className="absolute right-1 text-text-dim hover:text-white p-1 transition-colors"
              title="Locate Operational Asset"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Feedback & Geolocation Messages */}
          {searchMessage && (
            <div className="bg-[#16202c]/95 border border-info px-2.5 py-1 rounded text-2xs text-info font-semibold shadow-lg backdrop-blur-md animate-fade-in">
              {searchMessage}
            </div>
          )}
          {geoNotice && (
            <div className="bg-[#1c1917]/95 border border-amber-500/80 px-2.5 py-1 rounded text-2xs text-amber-300 font-semibold shadow-lg backdrop-blur-md animate-fade-in">
              {geoNotice}
            </div>
          )}
        </div>

        {/* TOP RIGHT: Basemap Indicator, Layer Popover & Fullscreen */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5 pointer-events-auto">
          {/* Active Basemap Badge */}
          <button
            onClick={() => setShowLayerMenu(prev => !prev)}
            className="px-2.5 py-1 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] rounded text-2xs sm:text-xs font-semibold text-white shadow-lg transition-colors backdrop-blur-md flex items-center gap-1.5"
            title="Toggle Basemap and Tactical Layers"
          >
            <Globe className="w-3.5 h-3.5 text-info" />
            <span className="text-text-dim hidden sm:inline">BASEMAP:</span>
            <span className="text-info font-bold">{MAP_STYLES[activeStyleId]?.name || 'SATELLITE'}</span>
          </button>

          {/* Layers Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] rounded text-xs text-white shadow-lg transition-colors backdrop-blur-md"
              title="GIS Layer Control"
            >
              <Layers className="w-3.5 h-3.5 text-info" />
              <span>Layers</span>
            </button>

            {showLayerMenu && (
              <div
                className="absolute right-0 mt-1 w-64 bg-[#111419]/98 border border-[#30353b] rounded shadow-2xl p-3 space-y-3 text-xs backdrop-blur-lg"
                style={{ zIndex: Z_INDEX.MAP_CONTROLS }}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-[#30353b]">
                  <span className="text-2xs text-text-dim uppercase tracking-wider font-bold">
                    Cartography & Layers
                  </span>
                  <button
                    onClick={() => setShowLayerMenu(false)}
                    className="text-text-dim hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Basemap Selection */}
                <div className="space-y-1.5 pb-2.5 border-b border-[#30353b]">
                  <span className="text-[10px] text-text-dim uppercase tracking-wider font-bold block">
                    Basemap Provider
                  </span>
                  <div className="grid grid-cols-2 gap-1">
                    {['satellite-hybrid', 'satellite-pure', 'topo', 'dataviz-dark'].map((key) => {
                      const style = MAP_STYLES[key];
                      if (!style) return null;
                      return (
                        <button
                          key={key}
                          onClick={() => setActiveStyleId(key)}
                          className={`px-2 py-1 rounded text-2xs text-left transition-colors truncate ${
                            activeStyleId === key
                              ? 'bg-info text-white font-bold'
                              : 'bg-[#181d24] hover:bg-[#202732] text-text-muted hover:text-white border border-[#2b313a]'
                          }`}
                        >
                          {style.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operational Overlays Toggles */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-text-dim uppercase tracking-wider font-bold block">
                    Operational Overlays
                  </span>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.cameras}
                      onChange={e => setLayers(l => ({ ...l, cameras: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>Cameras (11 Key Nodes)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.incidents}
                      onChange={e => setLayers(l => ({ ...l, incidents: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>Active Incidents (INC-0142)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.tracks}
                      onChange={e => setLayers(l => ({ ...l, tracks: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>Active Tracks (Target T-104)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.predictedPaths}
                      onChange={e => setLayers(l => ({ ...l, predictedPaths: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>SWAN Predicted Paths</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.swanLinks}
                      onChange={e => setLayers(l => ({ ...l, swanLinks: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>SWAN Camera Handoff Links</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.fences}
                      onChange={e => setLayers(l => ({ ...l, fences: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>Virtual Fences (Alpha / Bravo)</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.zones}
                      onChange={e => setLayers(l => ({ ...l, zones: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>Restricted Buffer Zones</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.blindZones}
                      onChange={e => setLayers(l => ({ ...l, blindZones: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>SHIELD Blind Zones</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.coverage}
                      onChange={e => setLayers(l => ({ ...l, coverage: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>Camera FOV Coverage Cones</span>
                  </label>

                  <label className="flex items-center gap-2 text-text cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={layers.bopBoundaries}
                      onChange={e => setLayers(l => ({ ...l, bopBoundaries: e.target.checked }))}
                      className="rounded bg-[#181d24] border-[#30353b] text-info focus:ring-0"
                    />
                    <span>BOP Sector Boundary Line</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Map Toggle */}
          <button
            onClick={handleToggleFullscreenInternal}
            className="p-1.5 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] rounded text-white shadow-lg transition-colors backdrop-blur-md"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Tactical Map'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* BOTTOM LEFT: Dynamic Metric Scale & Symbology Legend Toggle */}
        <div className="absolute bottom-2 left-2 flex flex-col gap-1.5 pointer-events-auto">
          {showLegend && (
            <div
              className="bg-[#111419]/98 border border-[#30353b] p-2.5 rounded shadow-2xl text-2xs space-y-2 backdrop-blur-lg max-w-xs"
              style={{ zIndex: Z_INDEX.MAP_LEGEND }}
            >
              <div className="flex items-center justify-between pb-1 border-b border-[#30353b] font-bold text-white">
                <span>TACTICAL SYMBOLOGY</span>
                <button onClick={() => setShowLegend(false)} className="text-text-dim hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="text-text-muted">Live Camera</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span className="text-text-muted">Target Tracking</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span className="text-text-muted">PTZ Backup Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  <span className="text-text-muted">Fault / Offline</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-red-500 font-bold">▲</span>
                  <span className="text-text-muted">Incident Marker</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-0.5 bg-red-500"></span>
                  <span className="text-text-muted">Track Trajectory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-0.5 border-b border-dashed border-sky-400"></span>
                  <span className="text-text-muted">SWAN Prediction</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-0.5 border-b border-dashed border-amber-400"></span>
                  <span className="text-text-muted">BOP Zero Line</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLegend(!showLegend)}
              className="px-2 py-0.5 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] rounded text-2xs text-white shadow backdrop-blur-md"
            >
              {showLegend ? 'Hide Symbology' : 'Symbology'}
            </button>

            {/* Dynamic Real-world Scale Bar */}
            <div className="flex items-center gap-1.5 bg-[#111419]/90 px-2 py-0.5 rounded border border-[#30353b] text-2xs text-text-dim">
              <div
                className="h-1 bg-white border-x border-white"
                style={{ width: `${scaleWidthPx}px` }}
              />
              <span className="font-bold text-white">{scaleDistance}</span>
              <span className="text-[9px] text-[#64748b]">| Z{currentZoom.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: Professional GIS Controls (Zoom +, Zoom -, Fit All, Recenter, Geolocation, Compass) */}
        <div className="absolute bottom-2 right-2 flex flex-col gap-1 pointer-events-auto">
          {/* Zoom In */}
          <button
            onClick={handleZoomIn}
            className="p-2 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] text-white rounded shadow-lg backdrop-blur-md transition-colors"
            title="Zoom In (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Zoom Out */}
          <button
            onClick={handleZoomOut}
            className="p-2 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] text-white rounded shadow-lg backdrop-blur-md transition-colors"
            title="Zoom Out (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Fit Operational Area */}
          <button
            onClick={handleFitOperationalArea}
            className="p-2 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] text-sky-400 rounded shadow-lg backdrop-blur-md transition-colors"
            title="Fit All Operational Assets into View"
          >
            <Focus className="w-4 h-4" />
          </button>

          {/* Reset Orientation / Compass */}
          <button
            onClick={handleResetCompass}
            className="p-2 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] text-white rounded shadow-lg backdrop-blur-md transition-colors"
            title="Reset North Orientation & Pitch"
          >
            <Compass className="w-4 h-4" />
          </button>

          {/* Recenter Sector */}
          <button
            onClick={handleRecenterSector}
            className="p-2 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] text-amber-400 rounded shadow-lg backdrop-blur-md transition-colors"
            title="Recenter on Sector BOP-17"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Operator Geolocation (Separated from operational dataset) */}
          <button
            onClick={handleRecenterGeolocation}
            disabled={isGeolocating}
            className={`p-2 bg-[#111419]/95 border border-[#30353b] hover:bg-[#1a202c] rounded shadow-lg backdrop-blur-md transition-colors ${
              isGeolocating ? 'text-amber-400 animate-spin' : 'text-emerald-400'
            }`}
            title="Recenter to Operator Location (Reference Only)"
          >
            <Navigation className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrishtiMaplibre;
