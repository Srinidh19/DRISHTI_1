import { CctvCameraId } from '../components/video/SimulatedCctvViewer';

export type DemoVisibilityMode = 'DAY' | 'LOW_LIGHT' | 'NIGHT_IR' | 'FOG';

export type DemoStateId =
  | 'NORMAL_SURVEILLANCE'
  | 'PERSON_DETECTED'
  | 'FENCE_CROSSED'
  | 'SWAN_HANDOFF'
  | 'CROSS_CAMERA_CONFIRMED'
  | 'CAMERA_FAILURE'
  | 'SHIELD_RECOVERY'
  | 'RISK_FUSION'
  | 'INCIDENT_CREATED'
  | 'OPERATOR_REVIEW'
  | 'INCIDENT_CONFIRMED';

export interface DemoStepMetadata {
  id: DemoStateId;
  index: number; // 1 to 10
  title: string;
  shortLabel: string;
  activeCamera: CctvCameraId;
  isPersonPresent: boolean;
  isFenceCrossed: boolean;
  isSwanActive: boolean;
  isCameraFailed: boolean;
  isShieldRecovered: boolean;
  confidence: number;
  riskScore: number;
  incidentCreated: boolean;
  description: string;
  telemetry: string;
}

export const DEMO_SEQUENCE: DemoStepMetadata[] = [
  {
    id: 'NORMAL_SURVEILLANCE',
    index: 1,
    title: 'STATE 1 — NORMAL SURVEILLANCE',
    shortLabel: 'SURVEILLANCE',
    activeCamera: 'CAM-FENCE-03',
    isPersonPresent: false,
    isFenceCrossed: false,
    isSwanActive: false,
    isCameraFailed: false,
    isShieldRecovered: false,
    confidence: 0,
    riskScore: 12,
    incidentCreated: false,
    description: 'CAM-FENCE-03 perimeter optical and thermal streams online. AI analytics active. Zero intrusions detected.',
    telemetry: 'CAM-FENCE-03: LIVE // AI ANALYTICS ACTIVE'
  },
  {
    id: 'PERSON_DETECTED',
    index: 2,
    title: 'STATE 2 — PERSON DETECTED',
    shortLabel: 'PERSON DETECTED',
    activeCamera: 'CAM-FENCE-03',
    isPersonPresent: true,
    isFenceCrossed: false,
    isSwanActive: false,
    isCameraFailed: false,
    isShieldRecovered: false,
    confidence: 0.91,
    riskScore: 38,
    incidentCreated: false,
    description: 'Human signature enters outer boundary buffer. RT-DETR assigns persistent track ID T-104 with bounding box.',
    telemetry: 'TARGET ACQUIRED: T-104 [PERSON] // CONFIDENCE 91%'
  },
  {
    id: 'FENCE_CROSSED',
    index: 3,
    title: 'STATE 3 — VIRTUAL FENCE CROSSING',
    shortLabel: 'FENCE BREACH',
    activeCamera: 'CAM-FENCE-03',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: false,
    isCameraFailed: false,
    isShieldRecovered: false,
    confidence: 0.94,
    riskScore: 68,
    incidentCreated: false,
    description: 'Target T-104 intersects calibrated virtual fence tripwire Alpha. System logs perimeter breach event.',
    telemetry: '▲ VIRTUAL FENCE BREACH: SECTOR 03 ALPHA'
  },
  {
    id: 'SWAN_HANDOFF',
    index: 4,
    title: 'STATE 4 — SWAN HANDOFF',
    shortLabel: 'SWAN PREDICT',
    activeCamera: 'CAM-04',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: false,
    isShieldRecovered: false,
    confidence: 0.92,
    riskScore: 74,
    incidentCreated: false,
    description: 'SWAN predicts trajectory vector (1.8 m/s, bearing 042° NE). Pre-alerts neighbouring node CAM-04.',
    telemetry: 'SWAN REQUEST: PRE-POSITION CAM-04 (ARRIVAL IN 6.4S)'
  },
  {
    id: 'CROSS_CAMERA_CONFIRMED',
    index: 5,
    title: 'STATE 5 — CROSS-CAMERA CONFIRMATION',
    shortLabel: 'RE-ID LOCK',
    activeCamera: 'CAM-04',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: false,
    isShieldRecovered: false,
    confidence: 0.94,
    riskScore: 82,
    incidentCreated: false,
    description: 'CAM-04 confirms target T-104. Deep cosine feature embedding matches origin footprint at 94% similarity.',
    telemetry: 'CROSS-CAMERA CONFIRMATION: T-104 CAM-FENCE-03 → CAM-04'
  },
  {
    id: 'CAMERA_FAILURE',
    index: 6,
    title: 'STATE 6 — CAMERA FAILURE',
    shortLabel: 'CAM FAULT',
    activeCamera: 'CAM-FENCE-03',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: true,
    isShieldRecovered: false,
    confidence: 0,
    riskScore: 84,
    incidentCreated: false,
    description: 'CAM-FENCE-03 heartbeat lost (timeout > 3.0s). Signal static detected. SHIELD identifies 32% perimeter blind zone.',
    telemetry: 'CAM-FENCE-03: FAULT DETECTED // HEARTBEAT LOST'
  },
  {
    id: 'SHIELD_RECOVERY',
    index: 7,
    title: 'STATE 7 — SHIELD RECOVERY',
    shortLabel: 'SHIELD HEALED',
    activeCamera: 'CAM-06',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: true,
    isShieldRecovered: true,
    confidence: 0.91,
    riskScore: 86,
    incidentCreated: false,
    description: 'SHIELD autonomously slews secondary motorized PTZ CAM-06 by +32° azimuth. Restores 91% coverage and re-acquires T-104.',
    telemetry: 'SHIELD RECOVERY COMPLETE: PTZ CAM-06 SLEWED (+32°)'
  },
  {
    id: 'RISK_FUSION',
    index: 8,
    title: 'STATE 8 — RISK FUSION',
    shortLabel: 'RISK SYNTHESIS',
    activeCamera: 'CAM-06',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: false,
    isShieldRecovered: true,
    confidence: 0.91,
    riskScore: 86,
    incidentCreated: false,
    description: 'Multi-criteria fusion evaluates fence breach, inward velocity, night window, and multi-camera evidence. Risk: 86/100.',
    telemetry: 'FUSED THREAT MATRIX: 86/100 [HIGH PRIORITY]'
  },
  {
    id: 'INCIDENT_CREATED',
    index: 9,
    title: 'STATE 9 — INCIDENT CREATED',
    shortLabel: 'INC-2026-0142',
    activeCamera: 'CAM-06',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: false,
    isShieldRecovered: true,
    confidence: 0.91,
    riskScore: 86,
    incidentCreated: true,
    description: 'System automatically compiles unified incident dossier INC-2026-0142 and routes to the Command Centre active queue.',
    telemetry: 'INCIDENT DISPATCHED: INC-2026-0142 [ACTIVE QUEUE]'
  },
  {
    id: 'OPERATOR_REVIEW',
    index: 10,
    title: 'STATE 10 — OPERATOR REVIEW',
    shortLabel: 'AWAITING DECISION',
    activeCamera: 'CAM-06',
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: false,
    isShieldRecovered: true,
    confidence: 0.91,
    riskScore: 86,
    incidentCreated: true,
    description: 'Operator reviews forensic package in queue. Human authority ready to Confirm, Dismiss, Assign, Annotate, or Escalate.',
    telemetry: 'TACTICAL DECISION REQUIRED // OPERATOR AUTHORITY'
  }
];

export interface ShieldRecoveryPhase {
  phase: number;
  title: string;
  description: string;
  activeCamera: CctvCameraId;
  isFailed: boolean;
  isRecovered: boolean;
  statusBadge: string;
}

export const SHIELD_RECOVERY_PHASES: ShieldRecoveryPhase[] = [
  {
    phase: 1,
    title: 'PHASE 1: CAM-FENCE-03 HEARTBEAT LOST',
    description: 'Heartbeat signal lost on CAM-FENCE-03. Timeout exceeds 3.0 seconds.',
    activeCamera: 'CAM-FENCE-03',
    isFailed: true,
    isRecovered: false,
    statusBadge: 'HEARTBEAT LOST'
  },
  {
    phase: 2,
    title: 'PHASE 2: SHIELD FAULT TRIAGE',
    description: 'SHIELD edge classifier analyzes frame gradient: classified as CAMERA UNAVAILABLE / STREAM FAILURE.',
    activeCamera: 'CAM-FENCE-03',
    isFailed: true,
    isRecovered: false,
    statusBadge: 'STREAM FAILURE'
  },
  {
    phase: 3,
    title: 'PHASE 3: SHIELD BLIND-ZONE ESTIMATION',
    description: 'GIS terrain model computes affected coverage area: 32% linear perimeter blind sector created.',
    activeCamera: 'CAM-FENCE-03',
    isFailed: true,
    isRecovered: false,
    statusBadge: '32% BLIND ZONE'
  },
  {
    phase: 4,
    title: 'PHASE 4: ALTERNATE CAMERA SEARCH',
    description: 'SHIELD queries adjacent PTZ nodes: CAM-04 (busy), CAM-07 (out of line of sight), CAM-06 (available).',
    activeCamera: 'CAM-FENCE-03',
    isFailed: true,
    isRecovered: false,
    statusBadge: 'SEARCHING BACKUP'
  },
  {
    phase: 5,
    title: 'PHASE 5: CAM-06 BACKUP COVERAGE SELECTED',
    description: 'Motorized PTZ CAM-06 selected. Command issued: Slew azimuth +32°, tilt -21° in 1.4 seconds.',
    activeCamera: 'CAM-06',
    isFailed: false,
    isRecovered: true,
    statusBadge: 'PTZ SLEWING'
  },
  {
    phase: 6,
    title: 'PHASE 6: CAM-06 TRACKING CONTINUES',
    description: 'CAM-06 stream arrives. Target T-104 silhouette re-acquired inside the restored sector.',
    activeCamera: 'CAM-06',
    isFailed: false,
    isRecovered: true,
    statusBadge: 'TARGET RE-ACQUIRED'
  },
  {
    phase: 7,
    title: 'PHASE 7: COVERAGE RESTORED (91%)',
    description: 'Perimeter blind gap closed. Measured optical overlap reaches 91% of baseline coverage.',
    activeCamera: 'CAM-06',
    isFailed: false,
    isRecovered: true,
    statusBadge: 'COVERAGE: 91%'
  },
  {
    phase: 8,
    title: 'PHASE 8: SHIELD RECOVERY COMPLETE',
    description: 'Autonomous recovery cycle complete. Zero cloud round-trips required. Event logged with SHA-256 digest.',
    activeCamera: 'CAM-06',
    isFailed: false,
    isRecovered: true,
    statusBadge: 'RECOVERY COMPLETE'
  }
];
