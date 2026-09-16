import {
  Camera,
  Incident,
  ObjectTrack,
  SwanWatchRequest,
  ShieldFault,
  VirtualFence,
  RestrictedZone,
  EvidenceItem,
  User,
  SystemStatus
} from '../types';

// Center coordinates for BOP-17 Sector (Tactical cartography around 32.7320° N, 74.8640° E)
export const SECTOR_CENTER: [number, number] = [32.7325, 74.8645];

export const INITIAL_SYSTEM_STATUS: SystemStatus = {
  sector: 'NORTH SECTOR',
  bopCode: 'BOP-17',
  systemState: 'OPERATIONAL',
  totalCameras: 50,
  onlineCameras: 47,
  warningCameras: 2,
  offlineCameras: 1,
  edgeNodesTotal: 12,
  edgeNodesOnline: 12,
  swanActive: true,
  shieldActive: true,
  syncConnected: true,
  lastSyncTime: '14:32:08 IST'
};

export const INITIAL_USERS: User[] = [
  {
    id: 'OP-042',
    name: 'SI R. Sharma',
    role: 'OPERATOR',
    status: 'ACTIVE',
    badgeNumber: 'BSF-OP-9482',
    station: 'BOP-17 Master Console',
    lastLogin: 'Today, 06:00 IST'
  },
  {
    id: 'SUP-011',
    name: 'AC V. Singh',
    role: 'SUPERVISOR',
    status: 'ACTIVE',
    badgeNumber: 'BSF-SUP-2018',
    station: 'Sector HQ Ops Room',
    lastLogin: 'Today, 08:30 IST'
  },
  {
    id: 'ADM-001',
    name: 'Tech Offr A. Kumar',
    role: 'ADMIN',
    status: 'ACTIVE',
    badgeNumber: 'TECH-SYS-0012',
    station: 'C4I Tech Center',
    lastLogin: 'Yesterday, 18:45 IST'
  }
];

export const INITIAL_VIRTUAL_FENCES: VirtualFence[] = [
  {
    id: 'VF-ALPHA-01',
    name: 'Perimeter Virtual Fence Alpha (Zero Line)',
    sector: 'NORTH SECTOR / BOP-17',
    status: 'BREACHED',
    coordinates: [
      [32.7380, 74.8560],
      [32.7365, 74.8600],
      [32.7350, 74.8640],
      [32.7335, 74.8680],
      [32.7315, 74.8720],
      [32.7295, 74.8760]
    ]
  },
  {
    id: 'VF-BRAVO-02',
    name: 'Secondary Tactical Obstacle Fence',
    sector: 'NORTH SECTOR / BOP-17',
    status: 'INTACT',
    coordinates: [
      [32.7360, 74.8550],
      [32.7345, 74.8590],
      [32.7330, 74.8630],
      [32.7315, 74.8670],
      [32.7295, 74.8710]
    ]
  }
];

export const INITIAL_RESTRICTED_ZONES: RestrictedZone[] = [
  {
    id: 'ZONE-RESTRICTED-A',
    name: 'Zero Line Restricted Strip (150m)',
    type: 'CRITICAL_PERIMETER',
    fillColor: '#c93c3c',
    coordinates: [
      [32.7390, 74.8550],
      [32.7375, 74.8610],
      [32.7355, 74.8660],
      [32.7335, 74.8710],
      [32.7310, 74.8760],
      [32.7290, 74.8740],
      [32.7315, 74.8690],
      [32.7335, 74.8640],
      [32.7355, 74.8580],
      [32.7370, 74.8530]
    ]
  },
  {
    id: 'ZONE-BUFFER-B',
    name: 'BOP-17 Patrol Corridor & Approach',
    type: 'PATROL_TRACK',
    fillColor: '#477da8',
    coordinates: [
      [32.7350, 74.8580],
      [32.7335, 74.8640],
      [32.7315, 74.8690],
      [32.7290, 74.8740],
      [32.7265, 74.8700],
      [32.7285, 74.8650],
      [32.7310, 74.8600],
      [32.7330, 74.8550]
    ]
  }
];

export const INITIAL_CAMERAS: Camera[] = [
  {
    id: 'CAM-01',
    name: 'CAM-01',
    location: 'North Fence',
    bop: 'BOP-17',
    zone: 'Zone North-A',
    type: 'Fixed',
    resolution: '1080p',
    fps: 24,
    latencyMs: 38,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7372, 74.8580],
    fovHeading: 135,
    fovAngle: 65,
    rangeMeters: 280,
    streamType: 'optical',
    detectedObjects: []
  },
  {
    id: 'CAM-02',
    name: 'CAM-02',
    location: 'Road Entry',
    bop: 'BOP-17',
    zone: 'Zone Alpha Entry',
    type: 'PTZ',
    resolution: '1080p',
    fps: 25,
    latencyMs: 42,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7340, 74.8590],
    fovHeading: 45,
    fovAngle: 75,
    rangeMeters: 350,
    streamType: 'optical',
    detectedObjects: [
      {
        id: 'det-02-1',
        label: 'VEHICLE',
        confidence: 0.88,
        bbox: [35, 45, 28, 22],
        trackId: 'T-203',
        motionVector: [1, 0.2]
      }
    ]
  },
  {
    id: 'CAM-03',
    name: 'CAM-03',
    location: 'Fence B',
    bop: 'BOP-17',
    zone: 'Zone Fence-B',
    type: 'IR',
    resolution: '720p',
    fps: 24,
    latencyMs: 44,
    health: 'WARNING',
    lastHeartbeat: '2s ago',
    analyticsActive: true,
    coordinates: [32.7350, 74.8635],
    fovHeading: 160,
    fovAngle: 70,
    rangeMeters: 320,
    streamType: 'thermal',
    detectedObjects: [
      {
        id: 'det-03-1',
        label: 'PERSON',
        confidence: 0.94,
        bbox: [48, 52, 14, 26],
        trackId: 'T-104',
        motionVector: [0.8, 1.2]
      },
      {
        id: 'det-03-2',
        label: 'PERSON',
        confidence: 0.91,
        bbox: [62, 55, 12, 24],
        trackId: 'T-104B',
        motionVector: [0.7, 1.1]
      }
    ]
  },
  {
    id: 'CAM-04',
    name: 'CAM-04',
    location: 'East Tower',
    bop: 'BOP-17',
    zone: 'Zone Tower-East',
    type: 'Fixed',
    resolution: '1080p',
    fps: 25,
    latencyMs: 35,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7330, 74.8670],
    fovHeading: 220,
    fovAngle: 80,
    rangeMeters: 400,
    streamType: 'optical',
    detectedObjects: [
      {
        id: 'det-04-1',
        label: 'PERSON',
        confidence: 0.92,
        bbox: [22, 60, 16, 28],
        trackId: 'T-104',
        motionVector: [0.9, 1.3]
      }
    ]
  },
  {
    id: 'CAM-05',
    name: 'CAM-05',
    location: 'Patrol Road',
    bop: 'BOP-17',
    zone: 'Zone Patrol-South',
    type: 'Fixed',
    resolution: '1080p',
    fps: 24,
    latencyMs: 52,
    health: 'OFFLINE',
    lastHeartbeat: '14m ago',
    analyticsActive: false,
    coordinates: [32.7290, 74.8660],
    fovHeading: 0,
    fovAngle: 60,
    rangeMeters: 250,
    streamType: 'optical',
    detectedObjects: []
  },
  {
    id: 'CAM-06',
    name: 'CAM-06',
    location: 'Ridge Watch',
    bop: 'BOP-17',
    zone: 'Zone Ridge-6',
    type: 'Fixed',
    resolution: '1080p',
    fps: 25,
    latencyMs: 41,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7310, 74.8710],
    fovHeading: 250,
    fovAngle: 75,
    rangeMeters: 380,
    streamType: 'optical',
    detectedObjects: []
  },
  {
    id: 'CAM-07',
    name: 'CAM-07',
    location: 'Gate Alpha',
    bop: 'BOP-17',
    zone: 'Zone Gate-Alpha',
    type: 'PTZ',
    resolution: '1080p',
    fps: 25,
    latencyMs: 39,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7360, 74.8610],
    fovHeading: 180,
    fovAngle: 70,
    rangeMeters: 300,
    streamType: 'optical',
    detectedObjects: []
  },
  {
    id: 'CAM-11',
    name: 'CAM-11',
    location: 'South Sector Line',
    bop: 'BOP-17',
    zone: 'Zone South-11',
    type: 'IR',
    resolution: '1080p',
    fps: 24,
    latencyMs: 48,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7280, 74.8720],
    fovHeading: 310,
    fovAngle: 75,
    rangeMeters: 350,
    streamType: 'thermal',
    detectedObjects: []
  },
  {
    id: 'CAM-TOWER-01',
    name: 'CAM-TOWER-01',
    location: 'Perimeter Tower 1',
    bop: 'BOP-17',
    zone: 'Zone High-Overwatch',
    type: 'PTZ',
    resolution: '1080p',
    fps: 30,
    latencyMs: 32,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7365, 74.8655],
    fovHeading: 195,
    fovAngle: 90,
    rangeMeters: 550,
    streamType: 'optical',
    isPtzBackup: true,
    backupTargetCamId: 'CAM-03',
    detectedObjects: []
  },
  {
    id: 'CAM-ROAD-05',
    name: 'CAM-ROAD-05',
    location: 'High Mast Road 5',
    bop: 'BOP-17',
    zone: 'Zone Mast-Road',
    type: 'PTZ',
    resolution: '1080p',
    fps: 30,
    latencyMs: 35,
    health: 'ONLINE',
    lastHeartbeat: '1s ago',
    analyticsActive: true,
    coordinates: [32.7320, 74.8615],
    fovHeading: 35,
    fovAngle: 85,
    rangeMeters: 450,
    streamType: 'optical',
    isPtzBackup: true,
    backupTargetCamId: 'CAM-03',
    detectedObjects: []
  },
  // Auxiliary cameras to fill out the 50 total cameras
  ...Array.from({ length: 40 }).map((_, idx) => {
    const camNum = idx + 12;
    const bopName = camNum < 26 ? 'BOP-17' : camNum < 38 ? 'BOP-18' : 'BOP-19';
    const angle = (idx * 37) % 360;
    const latOffset = ((idx % 7) - 3) * 0.003;
    const lngOffset = (((idx * 3) % 9) - 4) * 0.003;
    const isWarn = camNum === 19;
    return {
      id: `CAM-${camNum.toString().padStart(2, '0')}`,
      name: `CAM-${camNum.toString().padStart(2, '0')}`,
      location: `${bopName} Sector Link ${camNum}`,
      bop: bopName,
      zone: `Zone Aux-${camNum}`,
      type: (camNum % 3 === 0 ? 'PTZ' : camNum % 5 === 0 ? 'IR' : 'Fixed') as Camera['type'],
      resolution: '1080p',
      fps: 24 + (camNum % 2),
      latencyMs: 35 + (camNum % 25),
      health: (isWarn ? 'WARNING' : 'ONLINE') as Camera['health'],
      lastHeartbeat: `${(idx % 4) + 1}s ago`,
      analyticsActive: true,
      coordinates: [32.7325 + latOffset, 74.8645 + lngOffset] as [number, number],
      fovHeading: angle,
      fovAngle: 65,
      rangeMeters: 260 + (camNum * 3),
      streamType: (camNum % 5 === 0 ? 'thermal' : 'optical') as 'thermal' | 'optical',
      detectedObjects: []
    };
  })
];

export const INITIAL_TRACKS: ObjectTrack[] = [
  {
    id: 'T-104',
    objectType: 'PERSON',
    originCamera: 'CAM-03',
    currentCamera: 'CAM-04',
    direction: 'North → South',
    predictedNextCamera: 'CAM-06',
    risk: 'CRITICAL',
    activeDurationSeconds: 43,
    relatedIncidentId: 'INC-2026-0142',
    currentSpeedKmh: 4.8,
    confidence: 0.94,
    waypoints: [
      { lat: 32.7360, lng: 74.8625, timestamp: '02:14:02 IST', camera: 'CAM-03' },
      { lat: 32.7352, lng: 74.8638, timestamp: '02:14:06 IST', camera: 'CAM-03' },
      { lat: 32.7344, lng: 74.8652, timestamp: '02:14:14 IST', camera: 'CAM-03 / SWAN' },
      { lat: 32.7336, lng: 74.8665, timestamp: '02:14:22 IST', camera: 'CAM-04' },
      { lat: 32.7328, lng: 74.8678, timestamp: '02:14:35 IST', camera: 'CAM-04' }
    ]
  },
  {
    id: 'T-118',
    objectType: 'PERSON',
    originCamera: 'CAM-07',
    currentCamera: 'CAM-07',
    direction: 'West → East',
    predictedNextCamera: 'CAM-03',
    risk: 'HIGH',
    activeDurationSeconds: 28,
    relatedIncidentId: 'INC-2026-0143',
    currentSpeedKmh: 3.2,
    confidence: 0.86,
    waypoints: [
      { lat: 32.7362, lng: 74.8605, timestamp: '02:08:15 IST', camera: 'CAM-07' },
      { lat: 32.7359, lng: 74.8612, timestamp: '02:08:32 IST', camera: 'CAM-07' }
    ]
  },
  {
    id: 'T-203',
    objectType: 'VEHICLE',
    originCamera: 'CAM-02',
    currentCamera: 'CAM-02',
    direction: 'Approach → Checkpoint Alpha',
    predictedNextCamera: 'CAM-01',
    risk: 'LOW',
    activeDurationSeconds: 95,
    relatedIncidentId: 'INC-2026-0135',
    currentSpeedKmh: 18.5,
    confidence: 0.91,
    waypoints: [
      { lat: 32.7335, lng: 74.8575, timestamp: '01:52:10 IST', camera: 'CAM-02' },
      { lat: 32.7340, lng: 74.8585, timestamp: '01:53:20 IST', camera: 'CAM-02' }
    ]
  }
];

export const INITIAL_SWAN_REQUESTS: SwanWatchRequest[] = [
  {
    id: 'SWAN-REQ-0042',
    fromCamera: 'CAM-03',
    toCamera: 'CAM-04',
    trackId: 'T-104',
    status: 'CONFIRMED',
    timestamp: '02:14:15 IST',
    predictedTimeToEntrySeconds: 5,
    confidenceScore: 0.94
  },
  {
    id: 'SWAN-REQ-0043',
    fromCamera: 'CAM-04',
    toCamera: 'CAM-06',
    trackId: 'T-104',
    status: 'WATCHING',
    timestamp: '02:14:30 IST',
    predictedTimeToEntrySeconds: 14,
    confidenceScore: 0.89
  }
];

export const INITIAL_SHIELD_FAULTS: ShieldFault[] = [
  {
    id: 'SHIELD-0081',
    cameraId: 'CAM-03',
    cameraName: 'CAM-03 (Fence B IR)',
    condition: 'Lens obstruction suspected',
    detectionConfidence: 0.94,
    criticality: 'HIGH',
    detectedAt: '02:18:42 IST',
    coverageLostPercent: 12,
    coverageRestoredPercent: 88,
    residualBlindZonePercent: 12,
    backupCameras: [
      {
        cameraId: 'CAM-TOWER-01',
        cameraName: 'CAM-TOWER-01 (PTZ)',
        status: 'ACTIVE',
        coverageContributionPercent: 58
      },
      {
        cameraId: 'CAM-ROAD-05',
        cameraName: 'CAM-ROAD-05 (PTZ)',
        status: 'ACTIVE',
        coverageContributionPercent: 30
      }
    ],
    maintenanceDispatched: true,
    maintenanceTicketId: 'WO-BOP17-2026-089'
  }
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-0142',
    title: 'Restricted-zone intrusion',
    severity: 'CRITICAL',
    status: 'CONFIRMED',
    timestamp: '02:14:06 IST',
    location: 'Sector North / Fence B',
    bop: 'BOP-17',
    zone: 'Zone Fence-B',
    primaryCamera: 'CAM-03',
    cameras: ['CAM-03', 'CAM-04', 'CAM-06'],
    objectType: 'PERSON',
    objectCount: 2,
    trackId: 'T-104',
    direction: 'North → South',
    persistenceSeconds: 43,
    confidence: 0.94,
    riskScore: 92,
    description: 'Two individuals detected breaching Perimeter Virtual Fence Alpha heading south into tactical sector. SWAN confirmed target handoff from CAM-03 to CAM-04. Predicted next camera node: CAM-06.',
    timeline: [
      { time: '02:14:02 IST', title: 'Target Acquisition', description: 'YOLO Edge detected 2 person signatures at outer perimeter (CAM-03)', type: 'DETECTION' },
      { time: '02:14:06 IST', title: 'Fence Crossing', description: 'Virtual Fence Alpha breached (32.7350N, 74.8640E)', type: 'FENCE_CROSS' },
      { time: '02:14:12 IST', title: 'SWAN Watch Request', description: 'SWAN calculated trajectory vector heading 168°; triggered CAM-04 priority watch', type: 'SWAN_REQUEST' },
      { time: '02:14:18 IST', title: 'CAM-04 Multi-Camera Confirmation', description: 'CAM-04 confirmed persistent Track T-104 with 0.92 confidence', type: 'SWAN_CONFIRM' },
      { time: '02:14:28 IST', title: 'Risk Escalation', description: 'Risk score fused to 92/100 (Multi-camera confirmed intrusion)', type: 'RISK_ESCALATION' }
    ],
    notes: [
      {
        id: 'n-1',
        author: 'OP-042 (SI R. Sharma)',
        timestamp: '02:15:10 IST',
        text: 'Visual confirmation on CAM-03 thermal and CAM-04 optical. Movement is deliberate, tactical cadence. Alerted QRT Post Alpha.'
      }
    ],
    assignedTo: 'OP-042',
    evidenceIds: ['EVD-0142-A', 'EVD-0142-B'],
    isVirtualFenceCrossing: true
  },
  {
    id: 'INC-2026-0143',
    title: 'Virtual-fence crossing attempt',
    severity: 'HIGH',
    status: 'NEW',
    timestamp: '02:08:15 IST',
    location: 'Gate Alpha Approach',
    bop: 'BOP-17',
    zone: 'Zone Gate-Alpha',
    primaryCamera: 'CAM-07',
    cameras: ['CAM-07', 'CAM-03'],
    objectType: 'PERSON',
    objectCount: 1,
    trackId: 'T-118',
    direction: 'West → East',
    persistenceSeconds: 28,
    confidence: 0.86,
    riskScore: 78,
    description: 'Single individual loitering within 20m of perimeter gate. Trajectory indicates approach towards Virtual Fence Alpha.',
    timeline: [
      { time: '02:08:15 IST', title: 'Detection', description: 'CAM-07 detected single person approaching perimeter zone', type: 'DETECTION' },
      { time: '02:08:30 IST', title: 'Proximity Warning', description: 'Distance to Virtual Fence < 25m. SWAN monitoring initiated', type: 'SWAN_REQUEST' }
    ],
    notes: [],
    assignedTo: undefined,
    evidenceIds: ['EVD-0143-A'],
    isVirtualFenceCrossing: false
  },
  {
    id: 'INC-2026-0135',
    title: 'Vehicle anomaly',
    severity: 'LOW',
    status: 'ASSIGNED',
    timestamp: '01:52:10 IST',
    location: 'Road Entry Alpha',
    bop: 'BOP-17',
    zone: 'Zone Alpha Entry',
    primaryCamera: 'CAM-02',
    cameras: ['CAM-02'],
    objectType: 'VEHICLE',
    objectCount: 1,
    trackId: 'T-203',
    direction: 'Approach → Checkpoint Alpha',
    persistenceSeconds: 95,
    confidence: 0.91,
    riskScore: 34,
    description: 'Unscheduled transport vehicle slowed near checkpoint barrier. ANPR read candidate plate JK-02-AB-9104.',
    timeline: [
      { time: '01:52:10 IST', title: 'Vehicle Detected', description: 'Approach speed 18 km/h', type: 'DETECTION' },
      { time: '01:53:00 IST', title: 'Checkpoint Stop', description: 'Vehicle stopped at outer boom barrier for ID inspection', type: 'OPERATOR_ACTION' }
    ],
    notes: [],
    assignedTo: 'OP-042',
    evidenceIds: ['EVD-0135-A'],
    isVirtualFenceCrossing: false
  },
  {
    id: 'INC-2026-0139',
    title: 'Wildlife / stray cattle perimeter proximity',
    severity: 'INFORMATIONAL',
    status: 'DISMISSED',
    timestamp: '01:24:40 IST',
    location: 'South Sector Line',
    bop: 'BOP-17',
    zone: 'Zone South-11',
    primaryCamera: 'CAM-11',
    cameras: ['CAM-11'],
    objectType: 'ANOMALY',
    objectCount: 3,
    direction: 'South → West',
    persistenceSeconds: 120,
    confidence: 0.95,
    riskScore: 18,
    description: 'Thermal IR signature classified as bovine/wildlife herd moving along dry stream bed outside perimeter.',
    timeline: [
      { time: '01:24:40 IST', title: 'Detection', description: 'Thermal signature identified with 0.95 confidence as quadruped', type: 'DETECTION' },
      { time: '01:26:00 IST', title: 'Dismissed', description: 'Operator OP-042 verified false perimeter breach', type: 'OPERATOR_ACTION' }
    ],
    notes: [],
    assignedTo: 'OP-042',
    evidenceIds: [],
    isVirtualFenceCrossing: false
  }
];

export const INITIAL_EVIDENCE: EvidenceItem[] = [
  {
    id: 'EVD-0142-A',
    time: '02:14:06 IST',
    incidentId: 'INC-2026-0142',
    cameraId: 'CAM-03',
    cameraName: 'CAM-03 (Fence B IR)',
    type: 'FENCE_CROSSING',
    status: 'VERIFIED',
    confidence: 0.94,
    classification: 'Virtual-Fence Breach (2 persons)',
    hasVideoClip: true,
    clipDurationSeconds: 18,
    fileSizeBytes: 14205800,
    hashDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    snapshotUrl: '',
    auditTrail: [
      { id: 'aud-1', timestamp: '02:14:06 IST', action: 'CREATED', operatorId: 'SYSTEM (YOLO-Edge)', notes: 'Automatic snapshot and clip lock triggered by fence breach' },
      { id: 'aud-2', timestamp: '02:15:10 IST', action: 'VERIFIED', operatorId: 'OP-042', notes: 'Verified target count and direction' }
    ]
  },
  {
    id: 'EVD-0142-B',
    time: '02:14:18 IST',
    incidentId: 'INC-2026-0142',
    cameraId: 'CAM-04',
    cameraName: 'CAM-04 (East Tower Optical)',
    type: 'PERSON',
    status: 'VERIFIED',
    confidence: 0.92,
    classification: 'Multi-Camera Handoff Confirmation (Track T-104)',
    hasVideoClip: true,
    clipDurationSeconds: 24,
    fileSizeBytes: 19842100,
    hashDigest: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    snapshotUrl: '',
    auditTrail: [
      { id: 'aud-3', timestamp: '02:14:18 IST', action: 'CREATED', operatorId: 'SYSTEM (SWAN)', notes: 'Target correlated and recorded from CAM-04' },
      { id: 'aud-4', timestamp: '02:15:20 IST', action: 'ESCALATED', operatorId: 'OP-042', notes: 'Escalated to High Command QRT dispatch' }
    ]
  },
  {
    id: 'EVD-0143-A',
    time: '02:08:15 IST',
    incidentId: 'INC-2026-0143',
    cameraId: 'CAM-07',
    cameraName: 'CAM-07 (Gate Alpha PTZ)',
    type: 'PERSON',
    status: 'REVIEW',
    confidence: 0.86,
    classification: 'Perimeter Proximity Loitering',
    hasVideoClip: true,
    clipDurationSeconds: 15,
    fileSizeBytes: 11200400,
    hashDigest: 'bc23f99e32e8f192b476e3d23194a20b221074e64f89d311894d7b736b4728b1',
    snapshotUrl: '',
    auditTrail: [
      { id: 'aud-5', timestamp: '02:08:15 IST', action: 'CREATED', operatorId: 'SYSTEM (YOLO-Edge)', notes: 'Loitering threshold exceeded 20s' }
    ]
  },
  {
    id: 'EVD-0135-A',
    time: '01:52:10 IST',
    incidentId: 'INC-2026-0135',
    cameraId: 'CAM-02',
    cameraName: 'CAM-02 (Road Entry PTZ)',
    type: 'VEHICLE',
    status: 'VERIFIED',
    confidence: 0.91,
    classification: 'Vehicle Approach Anomaly (Candidate ANPR)',
    hasVideoClip: false,
    fileSizeBytes: 2450000,
    hashDigest: '7d1a54127b222502f5b79b5fb0803061152a44f92b37e23c65dd0e336d10e808',
    snapshotUrl: '',
    auditTrail: [
      { id: 'aud-6', timestamp: '01:52:10 IST', action: 'CREATED', operatorId: 'SYSTEM (ANPR)', notes: 'Plate read candidate JK-02-AB-9104' }
    ]
  },
  {
    id: 'EVD-SHIELD-0081',
    time: '02:18:42 IST',
    incidentId: 'SHIELD-0081',
    cameraId: 'CAM-03',
    cameraName: 'CAM-03 (Fence B IR)',
    type: 'FAULT',
    status: 'REVIEW',
    confidence: 0.94,
    classification: 'Lens Obstruction Defocus / Suspected Tamper',
    hasVideoClip: true,
    clipDurationSeconds: 12,
    fileSizeBytes: 8940000,
    hashDigest: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    snapshotUrl: '',
    auditTrail: [
      { id: 'aud-7', timestamp: '02:18:42 IST', action: 'CREATED', operatorId: 'SYSTEM (SHIELD)', notes: 'Sharp gradient loss & high noise classified as lens obstruction' }
    ]
  }
];
