// DRISHTI — Map Styles & Provider Layer Specifications
import { StyleSpecification } from 'maplibre-gl';

export interface TacticalMapStyle {
  id: string;
  name: string;
  type: 'vector' | 'raster';
  requiresKey: boolean;
  getUrl: (apiKey?: string) => string | StyleSpecification;
}

// Fallback Dark Matter Raster style compatible with MapLibre GL JS without any API key
export const CARTO_DARK_FALLBACK_STYLE: StyleSpecification = {
  version: 8,
  name: 'Carto Dark Matter (Tactical Fallback)',
  sources: {
    'carto-dark': {
      type: 'raster',
      tiles: [
        'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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
  'satellite': {
    id: 'satellite',
    name: 'SATELLITE',
    type: 'raster',
    requiresKey: true,
    getUrl: (key) =>
      key
        ? `https://api.maptiler.com/maps/hybrid/style.json?key=${key}`
        : {
            version: 8,
            sources: {
              'esri-sat': {
                type: 'raster',
                tiles: [
                  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                ],
                tileSize: 256,
                attribution: '&copy; Esri &copy; Maxar'
              }
            },
            layers: [
              {
                id: 'esri-sat-layer',
                type: 'raster',
                source: 'esri-sat',
                minzoom: 0,
                maxzoom: 20
              }
            ]
          }
  },
  'topo': {
    id: 'topo',
    name: 'TERRAIN / TOPO',
    type: 'vector',
    requiresKey: true,
    getUrl: (key) =>
      key ? `https://api.maptiler.com/maps/topo-v2/style.json?key=${key}` : CARTO_DARK_FALLBACK_STYLE
  },
  'fallback-dark': {
    id: 'fallback-dark',
    name: 'PUBLIC TACTICAL',
    type: 'raster',
    requiresKey: false,
    getUrl: () => CARTO_DARK_FALLBACK_STYLE
  }
};
