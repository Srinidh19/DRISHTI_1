// DRISHTI — Map Provider Service
import { MAP_CONFIG, isMapTilerConfigured } from './mapConfig';
import { MAP_STYLES, CARTO_DARK_FALLBACK_STYLE, OPENFREEMAP_DARK_URL } from './mapStyles';
import { StyleSpecification } from 'maplibre-gl';

export type ProviderStatus = 'CONFIGURED' | 'KEY_MISSING' | 'FALLBACK_ACTIVE' | 'ERROR';

export interface ProviderResolution {
  provider: string;
  status: ProviderStatus;
  style: string | StyleSpecification;
  activeStyleId: string;
  isKeyRequired: boolean;
  isKeyPresent: boolean;
  message?: string;
}

export function resolveMapProvider(selectedStyleId?: string): ProviderResolution {
  const styleId = selectedStyleId || MAP_CONFIG.defaultStyle || 'satellite-hybrid';
  const styleDef = MAP_STYLES[styleId] || MAP_STYLES['satellite-hybrid'];
  const hasKey = isMapTilerConfigured();

  // 0. Custom Tile/Style URL if provided via environment
  if (MAP_CONFIG.customStyleUrl && MAP_CONFIG.customStyleUrl.trim().length > 0) {
    return {
      provider: 'Custom Provider',
      status: 'CONFIGURED',
      style: MAP_CONFIG.customStyleUrl,
      activeStyleId: 'custom',
      isKeyRequired: false,
      isKeyPresent: false,
      message: 'Custom cartographic style loaded.'
    };
  }

  // 1. Explicit OpenFreeMap Keyless Vector
  if (MAP_CONFIG.provider === 'openfreemap') {
    return {
      provider: 'OpenFreeMap',
      status: 'CONFIGURED',
      style: OPENFREEMAP_DARK_URL,
      activeStyleId: 'openfreemap',
      isKeyRequired: false,
      isKeyPresent: false,
      message: 'Keyless OpenFreeMap dark vector tiles.'
    };
  }

  // 2. Explicit Carto Public Fallback
  if (MAP_CONFIG.provider === 'carto') {
    return {
      provider: 'Carto Dark Matter',
      status: 'CONFIGURED',
      style: CARTO_DARK_FALLBACK_STYLE,
      activeStyleId: 'fallback-dark',
      isKeyRequired: false,
      isKeyPresent: false,
      message: 'Public dark matter tactical tiles.'
    };
  }

  // 3. Satellite Styles (Satellite Hybrid / Satellite Pure)
  if (styleId === 'satellite-hybrid' || styleId === 'satellite-pure' || styleId === 'satellite') {
    if (hasKey) {
      return {
        provider: 'MapTiler Satellite',
        status: 'CONFIGURED',
        style: styleDef.getUrl(MAP_CONFIG.apiKey),
        activeStyleId: styleId,
        isKeyRequired: true,
        isKeyPresent: true,
        message: 'Live MapTiler satellite imagery active.'
      };
    }
    return {
      provider: 'Live Satellite (Esri/Maxar)',
      status: 'CONFIGURED',
      style: styleDef.getUrl(''),
      activeStyleId: styleId,
      isKeyRequired: false,
      isKeyPresent: false,
      message: 'High-resolution live satellite imagery active.'
    };
  }

  // 4. Terrain / Topographic Style
  if (styleId === 'topo') {
    if (hasKey) {
      return {
        provider: 'MapTiler Topo',
        status: 'CONFIGURED',
        style: styleDef.getUrl(MAP_CONFIG.apiKey),
        activeStyleId: 'topo',
        isKeyRequired: true,
        isKeyPresent: true,
        message: 'MapTiler topographic elevation contours active.'
      };
    }
    return {
      provider: 'OpenTopoMap',
      status: 'CONFIGURED',
      style: styleDef.getUrl(''),
      activeStyleId: 'topo',
      isKeyRequired: false,
      isKeyPresent: false,
      message: 'Topographic terrain & elevation active.'
    };
  }

  // 5. MapTiler Vector with API key configured
  if (hasKey) {
    return {
      provider: 'MapTiler',
      status: 'CONFIGURED',
      style: styleDef.getUrl(MAP_CONFIG.apiKey),
      activeStyleId: styleId,
      isKeyRequired: true,
      isKeyPresent: true,
      message: 'MapTiler vector tiles connected.'
    };
  }

  // 6. Vector style requested but key is missing -> fallback to Carto tactical
  return {
    provider: 'Tactical Fallback',
    status: 'FALLBACK_ACTIVE',
    style: CARTO_DARK_FALLBACK_STYLE,
    activeStyleId: 'fallback-dark',
    isKeyRequired: false,
    isKeyPresent: false,
    message: 'Public tactical cartography active.'
  };
}
