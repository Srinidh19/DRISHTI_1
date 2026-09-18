// DRISHTI — Map Styles & Provider Layer Specifications
import { StyleSpecification } from 'maplibre-gl';

export interface TacticalMapStyle {
  id: string;
  name: string;
  type: 'vector' | 'raster';
  requiresKey: boolean;
  getUrl: (apiKey?: string) => string | StyleSpecification;
}

// 1. High-Resolution Live Satellite Hybrid (Imagery + Boundaries & Place Labels)
export const ESRI_SATELLITE_HYBRID_STYLE: StyleSpecification = {
  version: 8,
  name: 'Satellite Hybrid (High-Resolution)',
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    },
    'esri-labels': {
      type: 'raster',
      tiles: [
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '&copy; Esri &copy; OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20
    },
    {
      id: 'esri-labels-layer',
      type: 'raster',
      source: 'esri-labels',
      minzoom: 0,
      maxzoom: 20,
      paint: {
        'raster-opacity': 0.85
      }
    }
  ]
};

// 2. High-Resolution Live Pure Satellite Imagery (No labels for pure landscape)
export const ESRI_SATELLITE_PURE_STYLE: StyleSpecification = {
  version: 8,
  name: 'Satellite Pure (High-Resolution)',
  sources: {
    'esri-satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      ],
      tileSize: 256,
      attribution: '&copy; Esri, Maxar, Earthstar Geographics'
    }
  },
  layers: [
    {
      id: 'esri-satellite-layer',
      type: 'raster',
      source: 'esri-satellite',
      minzoom: 0,
      maxzoom: 20
    }
  ]
};

// 3. Terrain / Topographic Map Style (Contours, elevation, ridges)
export const OPEN_TOPO_STYLE: StyleSpecification = {
  version: 8,
  name: 'Terrain / Topo (Topographic)',
  sources: {
    'opentopo': {
      type: 'raster',
      tiles: [
        'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
        'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
        'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; OpenTopoMap &copy; OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'opentopo-layer',
      type: 'raster',
      source: 'opentopo',
      minzoom: 0,
      maxzoom: 17
    }
  ]
};

// 4. Tactical Dark Raster style compatible with MapLibre GL JS without any API key
export const CARTO_DARK_FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  name: 'Carto Dark Matter (Tactical Dark)',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; CARTO &copy; OpenStreetMap'
    }
  },
  layers: [
    {
      id: 'carto-dark-base',
      type: 'raster',
      source: 'carto-dark',
      minzoom: 0,
      maxzoom: 22
    }
  ]
};

// OpenFreeMap vector style (Keyless, dark vector)
export const OPENFREEMAP_DARK_URL = 'https://tiles.openfreemap.org/styles/dark';

export const MAP_STYLES: Record<string, TacticalMapStyle> = {
  'satellite-hybrid': {
    id: 'satellite-hybrid',
    name: 'SATELLITE + LABELS',
    type: 'raster',
    requiresKey: false,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/hybrid/style.json?key=${key}` : ESRI_SATELLITE_HYBRID_STYLE
  },
  'satellite-pure': {
    id: 'satellite-pure',
    name: 'SATELLITE ONLY',
    type: 'raster',
    requiresKey: false,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/satellite/style.json?key=${key}` : ESRI_SATELLITE_PURE_STYLE
  },
  'satellite': {
    id: 'satellite',
    name: 'SATELLITE + LABELS',
    type: 'raster',
    requiresKey: false,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/hybrid/style.json?key=${key}` : ESRI_SATELLITE_HYBRID_STYLE
  },
  'topo': {
    id: 'topo',
    name: 'TERRAIN / TOPO',
    type: 'raster',
    requiresKey: false,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/topo-v2/style.json?key=${key}` : OPEN_TOPO_STYLE
  },
  'dataviz-dark': {
    id: 'dataviz-dark',
    name: 'TACTICAL DARK',
    type: 'vector',
    requiresKey: true,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${key}` : CARTO_DARK_FALLBACK_STYLE
  },
  'basic-dark': {
    id: 'basic-dark',
    name: 'DARK VECTOR',
    type: 'vector',
    requiresKey: true,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/basic-v2-dark/style.json?key=${key}` : CARTO_DARK_FALLBACK_STYLE
  },
  'fallback-dark': {
    id: 'fallback-dark',
    name: 'PUBLIC TACTICAL',
    type: 'raster',
    requiresKey: false,
    getUrl: () => CARTO_DARK_FALLBACK_STYLE
  }
};

