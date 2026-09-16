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
  const styleId = selectedStyleId || MAP_CONFIG.defaultStyle || 'dataviz-dark';
  const styleDef = MAP_STYLES[styleId] || MAP_STYLES['dataviz-dark'];
  const hasKey = isMapTilerConfigured();

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

  // 3. MapTiler with API key configured
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

  // 4. MapTiler requested but key is missing -> fallback to Carto without watermark
  return {
    provider: 'MapTiler',
    status: 'KEY_MISSING',
    style: CARTO_DARK_FALLBACK_STYLE,
    activeStyleId: 'fallback-dark',
    isKeyRequired: true,
    isKeyPresent: false,
    message: 'Configuration required. Running tactical fallback.'
  };
}
