export type IncidentSeverity = 'INFORMATIONAL' | 'LOW' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'NEW' | 'CONFIRMED' | 'ESCALATED' | 'ASSIGNED' | 'DISMISSED' | 'RESOLVED';

export type CameraType = 'Fixed' | 'PTZ' | 'IR' | 'Thermal';

export type CameraHealthStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export type UserRole = 'OPERATOR' | 'SUPERVISOR' | 'ADMIN';

export interface Camera {
  id: string;
  name: string;
  location: string;
  bop: string; // e.g. BOP-17, BOP-18, BOP-19
  zone: string;
  type: CameraType;
  resolution: string;
  fps: number;
  latencyMs: number;
  health: CameraHealthStatus;
  lastHeartbeat: string;
  analyticsActive: boolean;
  coordinates: [number, number]; // [lat, lng]
  fovHeading: number; // degrees 0-360
  fovAngle: number; // beam width in degrees
  rangeMeters: number;
  streamType: 'optical' | 'thermal' | 'ir';
  isPtzBackup?: boolean;
  backupTargetCamId?: string;
  detectedObjects?: DetectedObject[];
}

export interface DetectedObject {
  id: string;
  label: 'PERSON' | 'VEHICLE' | 'ANOMALY';
  confidence: number;
  bbox: [number, number, number, number]; // x%, y%, w%, h%
  trackId?: string;
  motionVector?: [number, number];
}

export interface IncidentTimelineEvent {
  time: string;
  title: string;
  description?: string;
  type?: 'DETECTION' | 'FENCE_CROSS' | 'SWAN_REQUEST' | 'SWAN_CONFIRM' | 'RISK_ESCALATION' | 'SHIELD_FAULT' | 'SHIELD_RECOVERY' | 'OPERATOR_ACTION';
}

export interface IncidentNote {
  id: string;
  author: string;
  timestamp: string;
  text: string;
}

export interface Incident {
  id: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  timestamp: string;
  location: string;
  bop: string;
  zone: string;
  primaryCamera: string;
  cameras: string[];
  objectType: 'PERSON' | 'VEHICLE' | 'ANOMALY' | 'CAMERA_FAULT';
  objectCount: number;
  trackId?: string;
  direction?: string;
  persistenceSeconds: number;
  confidence: number;
  riskScore: number;
  description: string;
  timeline: IncidentTimelineEvent[];
  notes: IncidentNote[];
  assignedTo?: string;
  evidenceIds: string[];
  unifiedFault?: boolean;
  isVirtualFenceCrossing?: boolean;
  risk_breakdown?: Record<string, number>;
}

export interface ObjectTrack {
  id: string; // e.g. T-104
  objectType: 'PERSON' | 'VEHICLE';
  originCamera: string;
  currentCamera: string;
  direction: string;
  predictedNextCamera: string;
  risk: 'LOW' | 'HIGH' | 'CRITICAL';
  activeDurationSeconds: number;
  relatedIncidentId: string;
  currentSpeedKmh: number;
  confidence: number;
  waypoints: {
    lat: number;
    lng: number;
    timestamp: string;
    camera: string;
  }[];
}

export interface SwanWatchRequest {
  id: string;
  fromCamera: string;
  toCamera: string;
  trackId: string;
  status: 'PENDING' | 'WATCHING' | 'CONFIRMED' | 'FAILED';
  timestamp: string;
  predictedTimeToEntrySeconds: number;
  confidenceScore: number;
}

export interface ShieldFault {
  id: string;
  cameraId: string;
  cameraName: string;
  condition:
    | 'Lens obstruction suspected'
    | 'Defocused'
    | 'Stream frozen'
    | 'Black frame'
    | 'Camera offline'
    | 'Network failure'
    | 'Suspected tamper';
  detectionConfidence: number;
  criticality: 'LOW' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
  coverageLostPercent: number;
  coverageRestoredPercent: number;
  residualBlindZonePercent: number;
  backupCameras: {
    cameraId: string;
    cameraName: string;
    status: 'ACTIVE' | 'STANDBY' | 'ACQUIRING';
    coverageContributionPercent: number;
  }[];
  maintenanceDispatched: boolean;
  maintenanceTicketId?: string;
}

export interface VirtualFence {
  id: string;
  name: string;
  sector: string;
  coordinates: [number, number][];
  status: 'INTACT' | 'BREACHED';
}

export interface RestrictedZone {
  id: string;
  name: string;
  type: 'BUFFER_ZONE' | 'CRITICAL_PERIMETER' | 'PATROL_TRACK';
  coordinates: [number, number][];
  fillColor: string;
}

export interface EvidenceItem {
  id: string;
  time: string;
  incidentId: string;
  cameraId: string;
  cameraName: string;
  type: 'PERSON' | 'VEHICLE' | 'FAULT' | 'FENCE_CROSSING';
  status: 'VERIFIED' | 'REVIEW' | 'ARCHIVED';
  confidence: number;
  classification: string;
  hasVideoClip: boolean;
  clipDurationSeconds?: number;
  fileSizeBytes: number;
  hashDigest: string; // SHA-256 evidence integrity
  snapshotUrl?: string;
  auditTrail: {
    id: string;
    timestamp: string;
    action: 'CREATED' | 'VERIFIED' | 'ESCALATED' | 'ASSIGNED' | 'EXPORTED' | 'ANNOTATED';
    operatorId: string;
    notes: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  status: 'ACTIVE' | 'OFFLINE';
  badgeNumber: string;
  station: string;
  lastLogin: string;
}

export interface SystemStatus {
  sector: string;
  bopCode: string;
  systemState: 'OPERATIONAL' | 'DEGRADED' | 'ALERT';
  totalCameras: number;
  onlineCameras: number;
  warningCameras: number;
  offlineCameras: number;
  edgeNodesTotal: number;
  edgeNodesOnline: number;
  swanActive: boolean;
  shieldActive: boolean;
  syncConnected: boolean;
  lastSyncTime: string;
}
