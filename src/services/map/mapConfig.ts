// DRISHTI — Map Provider Configuration Layer
// Secure environment configuration for MapLibre GL JS & Tile Providers

export type MapProviderType = 'maptiler' | 'carto' | 'openfreemap' | 'demo';

export interface MapConfig {
  provider: MapProviderType;
  apiKey: string;
  defaultStyle: string;
  defaultCenter: [number, number]; // [lng, lat]
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
}

const env = (import.meta as any).env || {};

export const MAP_CONFIG: MapConfig = {
  provider: (env.VITE_MAP_PROVIDER as MapProviderType) || 'maptiler',
  apiKey: env.VITE_MAPTILER_API_KEY || '',
  defaultStyle: env.VITE_MAP_STYLE || 'dataviz-dark',
  defaultCenter: [
    parseFloat(env.VITE_MAP_DEFAULT_LNG || '74.8645'), // BOP-17 Sector Lng
    parseFloat(env.VITE_MAP_DEFAULT_LAT || '32.7325')  // BOP-17 Sector Lat
  ],
  defaultZoom: parseFloat(env.VITE_MAP_DEFAULT_ZOOM || '14.5'),
  minZoom: 10,
  maxZoom: 20
};

export const isMapTilerConfigured = (): boolean => {
  return Boolean(MAP_CONFIG.apiKey && MAP_CONFIG.apiKey.trim().length > 5);
};
