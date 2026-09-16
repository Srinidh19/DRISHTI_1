// DRISHTI — GeoJSON Feature Generation Utilities
// Transforms backend state models into MapLibre GL JS GeoJSON Sources
import { Camera, Incident, ObjectTrack, VirtualFence, RestrictedZone, ShieldFault, SwanWatchRequest } from '../../types';

// Helper to generate FOV cone polygon coordinates [lng, lat]
export function getCameraFovPolygon(
  lat: number,
  lng: number,
  headingDeg: number = 0,
  fovAngleDeg: number = 65,
  rangeMeters: number = 180
): [number, number][] {
  const points: [number, number][] = [[lng, lat]];
  const mPerDegLat = 111000;
  const mPerDegLng = 111000 * Math.cos((lat * Math.PI) / 180);

  const startAngle = headingDeg - fovAngleDeg / 2;
  const endAngle = headingDeg + fovAngleDeg / 2;
  const steps = 8;

  for (let i = 0; i <= steps; i++) {
    const angle = startAngle + ((endAngle - startAngle) * i) / steps;
    const rad = (angle * Math.PI) / 180;
    const dLat = (rangeMeters * Math.cos(rad)) / mPerDegLat;
    const dLng = (rangeMeters * Math.sin(rad)) / mPerDegLng;
    points.push([lng + dLng, lat + dLat]);
  }
  points.push([lng, lat]); // close polygon
  return points;
}

export function cameraToFeature(cam: Camera): GeoJSON.Feature<GeoJSON.Point> {
  return {
    type: 'Feature',
    id: cam.id,
    properties: {
      id: cam.id,
      name: cam.name,
      health: cam.health,
      streamType: cam.streamType,
      isPtzBackup: cam.isPtzBackup || false,
      hasDetections: (cam.detectedObjects && cam.detectedObjects.length > 0) || false,
      color:
        cam.health === 'OFFLINE'
          ? '#c93c3c'
          : cam.health === 'WARNING'
          ? '#c28a28'
          : cam.isPtzBackup
          ? '#477da8'
          : '#3f8f68'
    },
    geometry: {
      type: 'Point',
      coordinates: [cam.coordinates[1], cam.coordinates[0]] // [lng, lat]
    }
  };
}

export function incidentToFeature(inc: Incident, cam?: Camera): GeoJSON.Feature<GeoJSON.Point> {
  const coords: [number, number] = cam
    ? [cam.coordinates[1] + 0.0004, cam.coordinates[0] + 0.0004]
    : [74.8645, 32.7325];

  const color =
    inc.severity === 'CRITICAL'
      ? '#c93c3c'
      : inc.severity === 'HIGH'
      ? '#c28a28'
      : '#477da8';

  return {
    type: 'Feature',
    id: inc.id,
    properties: {
      id: inc.id,
      type: inc.objectType,
      severity: inc.severity,
      status: inc.status,
      riskScore: inc.riskScore,
      targetId: inc.trackId,
      primaryCamera: inc.primaryCamera,
      color
    },
    geometry: {
      type: 'Point',
      coordinates: coords
    }
  };
}

export function trackToFeature(track: ObjectTrack): GeoJSON.Feature<GeoJSON.LineString> {
  const coords: [number, number][] = track.waypoints.map(w => [w.lng, w.lat]);
  return {
    type: 'Feature',
    id: track.id,
    properties: {
      id: track.id,
      objectType: track.objectType,
      risk: track.risk,
      currentCamera: track.currentCamera,
      trajectoryType: 'confirmed'
    },
    geometry: {
      type: 'LineString',
      coordinates: coords
    }
  };
}

export function predictedPathToFeature(track: ObjectTrack, targetLngLat?: [number, number]): GeoJSON.Feature<GeoJSON.LineString> | null {
  if (!track.waypoints || track.waypoints.length === 0) return null;
  const last = track.waypoints[track.waypoints.length - 1];
  const dest = targetLngLat || [last.lng + 0.0045, last.lat - 0.0025];

  return {
    type: 'Feature',
    id: `${track.id}-predicted`,
    properties: {
      id: `${track.id}-predicted`,
      parentTrackId: track.id,
      trajectoryType: 'predicted'
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [last.lng, last.lat],
        dest
      ]
    }
  };
}

export function fenceToFeature(fence: VirtualFence): GeoJSON.Feature<GeoJSON.LineString> {
  return {
    type: 'Feature',
    id: fence.id,
    properties: {
      id: fence.id,
      name: fence.name,
      status: fence.status,
      color: fence.status === 'BREACHED' ? '#c93c3c' : '#3f8f68'
    },
    geometry: {
      type: 'LineString',
      coordinates: fence.coordinates.map(c => [c[1], c[0]]) // [lng, lat]
    }
  };
}

export function zoneToFeature(zone: RestrictedZone): GeoJSON.Feature<GeoJSON.Polygon> {
  return {
    type: 'Feature',
    id: zone.id,
    properties: {
      id: zone.id,
      name: zone.name,
      type: zone.type,
      color: zone.fillColor
    },
    geometry: {
      type: 'Polygon',
      coordinates: [zone.coordinates.map(c => [c[1], c[0]])]
    }
  };
}

export function coverageToFeature(cam: Camera): GeoJSON.Feature<GeoJSON.Polygon> {
  const fov = getCameraFovPolygon(
    cam.coordinates[0],
    cam.coordinates[1],
    cam.fovHeading || 0,
    cam.fovAngle || 65,
    cam.rangeMeters || 180
  );

  return {
    type: 'Feature',
    id: `${cam.id}-coverage`,
    properties: {
      cameraId: cam.id,
      health: cam.health
    },
    geometry: {
      type: 'Polygon',
      coordinates: [fov]
    }
  };
}

export function blindZoneToFeature(fault: ShieldFault, cam?: Camera): GeoJSON.Feature<GeoJSON.Polygon> | null {
  if (!cam) return null;
  // Blind zone polygon around the failed camera's unmonitored sector
  const blindFov = getCameraFovPolygon(
    cam.coordinates[0],
    cam.coordinates[1],
    cam.fovHeading || 0,
    80,
    220
  );

  return {
    type: 'Feature',
    id: `blind-${fault.id}`,
    properties: {
      faultId: fault.id,
      cameraId: fault.cameraId,
      condition: fault.condition
    },
    geometry: {
      type: 'Polygon',
      coordinates: [blindFov]
    }
  };
}

export function swanLinkToFeature(
  request: SwanWatchRequest,
  sourceCam?: Camera,
  targetCam?: Camera
): GeoJSON.Feature<GeoJSON.LineString> | null {
  if (!sourceCam || !targetCam) return null;

  return {
    type: 'Feature',
    id: `swan-${request.id}`,
    properties: {
      requestId: request.id,
      sourceCameraId: request.fromCamera,
      targetCameraId: request.toCamera,
      status: request.status,
      confidence: request.confidenceScore
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [sourceCam.coordinates[1], sourceCam.coordinates[0]],
        [targetCam.coordinates[1], targetCam.coordinates[0]]
      ]
    }
  };
}
