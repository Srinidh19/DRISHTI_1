import React from 'react';
import { DrishtiMaplibre } from './DrishtiMaplibre';
import { Incident, Camera } from '../../types';

interface CommandMapProps {
  onSelectIncident?: (incident: Incident) => void;
  onSelectCamera?: (camera: Camera) => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

/**
 * CommandMap Unified Adapter
 * Bridges existing usages across Command, IncidentWorkspace, TracksScreen, and Shield
 * into the centralized DrishtiMaplibre GL engine with zero Leaflet/MapTiler API key discrepancies.
 */
export const CommandMap: React.FC<CommandMapProps> = ({
  onSelectIncident,
  onSelectCamera,
  isFullscreen,
  onToggleFullscreen
}) => {
  return (
    <DrishtiMaplibre
      onSelectIncident={onSelectIncident}
      onSelectCamera={onSelectCamera}
      isFullscreen={isFullscreen}
      onToggleFullscreen={onToggleFullscreen}
    />
  );
};

export default CommandMap;
