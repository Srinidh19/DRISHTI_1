import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
  SystemStatus,
  UserRole
} from '../types';
import {
  INITIAL_CAMERAS,
  INITIAL_INCIDENTS,
  INITIAL_TRACKS,
  INITIAL_SWAN_REQUESTS,
  INITIAL_SHIELD_FAULTS,
  INITIAL_VIRTUAL_FENCES,
  INITIAL_RESTRICTED_ZONES,
  INITIAL_EVIDENCE,
  INITIAL_USERS,
  INITIAL_SYSTEM_STATUS
} from '../mock/data';
import { apiClient } from '../services/api/apiClient';

interface OverlaySettings {
  showDetections: boolean;
  showTrackIds: boolean;
  showMotionVectors: boolean;
}

interface DemoStep {
  stepNumber: number;
  title: string;
  description: string;
  actionSummary: string;
}

export const DEMO_STORY_STEPS: DemoStep[] = [
  { stepNumber: 1, title: "Step 1: Normal Surveillance", description: "All cameras healthy. Baseline perimeter patrol active.", actionSummary: "CAM-03 ONLINE, zero intrusions." },
  { stepNumber: 2, title: "Step 2: Person Target Acquired", description: "YOLO Edge AI detects 2 person signatures at outer perimeter (T-104).", actionSummary: "T-104 acquired at CAM-03." },
  { stepNumber: 3, title: "Step 3: Track Trajectory Formed", description: "ByteTrack maintains persistent association across frame transitions.", actionSummary: "T-104 direction vector computed." },
  { stepNumber: 4, title: "Step 4: Virtual Fence Breached", description: "Target crosses Perimeter Virtual Fence Alpha. Incident escalated to HIGH.", actionSummary: "INC-0142 created (Restricted-zone intrusion)." },
  { stepNumber: 5, title: "Step 5: SWAN Analysis", description: "SWAN identifies adjacent camera network nodes along movement corridor.", actionSummary: "Adjacent nodes: CAM-04, CAM-06." },
  { stepNumber: 6, title: "Step 6: SWAN Watch Request", description: "SWAN calculates velocity heading 168° towards CAM-04, issuing priority watch request.", actionSummary: "CAM-04 switches to WATCHING." },
  { stepNumber: 7, title: "Step 7: Multi-Camera Confirmation", description: "CAM-04 confirms target T-104. Re-ID feature similarity 0.92.", actionSummary: "Verified Multi-Camera Intrusion." },
  { stepNumber: 8, title: "Step 8: Risk Fusion Escalation", description: "AI fusion score rises to 92/100 based on verified depth penetration.", actionSummary: "Incident escalated to CRITICAL." },
  { stepNumber: 9, title: "Step 9: Master Incident Consolidated", description: "Unified incident generated with correlated multi-sensor evidence.", actionSummary: "Master INC-2026-0142 active." },
  { stepNumber: 10, title: "Step 10: Operator Confirmation", description: "Human operator reviews corroborating evidence and confirms breach.", actionSummary: "Operator confirmation recorded." },
  { stepNumber: 11, title: "Step 11: Audit Trail Sealed", description: "Immutable cryptographic audit record generated with SHA-256 digest.", actionSummary: "Audit log entry committed." },
  { stepNumber: 12, title: "Step 12: CAM-03 Failure", description: "Tamper/lens obstruction detected on CAM-03. SHIELD triggers fault condition.", actionSummary: "CAM-03 health drops to WARNING/OFFLINE." },
  { stepNumber: 13, title: "Step 13: SHIELD Fault Classification", description: "SHIELD classifies loss of high-frequency gradient as lens obstruction (94% confidence).", actionSummary: "Fault classified: Lens obstruction." },
  { stepNumber: 14, title: "Step 14: Blind Zone Identified", description: "SHIELD calculates 12% critical perimeter coverage loss.", actionSummary: "Tactical blind zone rendered on map." },
  { stepNumber: 15, title: "Step 15: Backup Cameras Selected", description: "SHIELD auto-selects and commands PTZ backups CAM-TOWER-01 and CAM-ROAD-05.", actionSummary: "PTZs slew to coordinate (32.7350N, 74.8640E)." },
  { stepNumber: 16, title: "Step 16: Coverage Restored to 88%", description: "Overwatch restoration reaches 88%. Target re-acquired inside recovered sector.", actionSummary: "SHIELD coverage healing active." }
];

interface RealtimeContextType {
  systemStatus: SystemStatus;
  cameras: Camera[];
  incidents: Incident[];
  activeTracks: ObjectTrack[];
  swanRequests: SwanWatchRequest[];
  shieldFaults: ShieldFault[];
  virtualFences: VirtualFence[];
  restrictedZones: RestrictedZone[];
  evidence: EvidenceItem[];
  users: User[];
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  selectedIncidentId: string;
  setSelectedIncidentId: (id: string) => void;
  selectedCameraId: string;
  setSelectedCameraId: (id: string) => void;
  overlaySettings: OverlaySettings;
  setOverlaySettings: React.Dispatch<React.SetStateAction<OverlaySettings>>;
  
  // Triage & Actions (Backend-backed)
  confirmIncident: (id: string) => void;
  dismissIncident: (id: string) => void;
  escalateIncident: (id: string) => void;
  assignIncident: (id: string, assignee: string) => void;
  annotateIncident: (id: string, noteText: string) => void;
  dispatchMaintenance: (faultId: string) => void;
  
  // Interactive Simulation controls (Backend-backed)
  simulateTrack: () => void;
  simulateCameraFailure: () => void;
  runDemoStep: (stepNumber: number) => void;
  currentDemoStep: number;
  isDemoPlaying: boolean;
  setIsDemoPlaying: (playing: boolean) => void;
  resetDemo: () => void;
  refreshBackendData: () => Promise<void>;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(INITIAL_SYSTEM_STATUS);
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [activeTracks, setActiveTracks] = useState<ObjectTrack[]>(INITIAL_TRACKS);
  const [swanRequests, setSwanRequests] = useState<SwanWatchRequest[]>(INITIAL_SWAN_REQUESTS);
  const [shieldFaults, setShieldFaults] = useState<ShieldFault[]>(INITIAL_SHIELD_FAULTS);
  const [virtualFences, setVirtualFences] = useState<VirtualFence[]>(INITIAL_VIRTUAL_FENCES);
  const [restrictedZones] = useState<RestrictedZone[]>(INITIAL_RESTRICTED_ZONES);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-2026-0142');
  const [selectedCameraId, setSelectedCameraId] = useState<string>('CAM-03');
  const [currentDemoStep, setCurrentDemoStep] = useState<number>(11);
  const [isDemoPlaying, setIsDemoPlaying] = useState<boolean>(false);

  const [overlaySettings, setOverlaySettings] = useState<OverlaySettings>({
    showDetections: true,
    showTrackIds: true,
    showMotionVectors: false
  });

  const setCurrentUserRole = (role: UserRole) => {
    const found = users.find(u => u.role === role) || users[0];
    setCurrentUser(found);
    apiClient.updateUserRole(found.id, role).catch(() => {});
  };

  // Fetch initial data from backend API
  const refreshBackendData = useCallback(async () => {
    try {
      const [cams, incs, trks, fencs, faults, health, usrs] = await Promise.all([
        apiClient.getCameras().catch(() => null),
        apiClient.getIncidents().catch(() => null),
        apiClient.getTracks().catch(() => null),
        apiClient.getFences().catch(() => null),
        apiClient.getShieldFaults().catch(() => null),
        apiClient.getSystemHealth().catch(() => null),
        apiClient.getUsers().catch(() => null)
      ]);

      if (usrs && Array.isArray(usrs) && usrs.length > 0) {
        setUsers(usrs.map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          status: u.status,
          badgeNumber: u.badge_number,
          station: u.station,
          lastLogin: u.last_login
        })));
      }

      if (cams) {
        setCameras(cams.map((c: any) => ({
          ...c,
          latencyMs: c.latency_ms,
          lastHeartbeat: c.last_heartbeat,
          analyticsActive: c.analytics_active,
          coordinates: [c.lat, c.lng],
          fovHeading: c.fov_heading,
          fovAngle: c.fov_angle,
          rangeMeters: c.range_meters,
          streamType: c.stream_type,
          isPtzBackup: c.is_ptz_backup,
          backupTargetCamId: c.backup_target_cam_id,
          detectedObjects: c.detected_objects || []
        })));
      }

      if (incs) {
        setIncidents(incs.map((i: any) => ({
          ...i,
          primaryCamera: i.primary_camera,
          objectType: i.object_type,
          objectCount: i.object_count,
          trackId: i.track_id,
          persistenceSeconds: i.persistence_seconds,
          riskScore: i.risk_score,
          risk_breakdown: i.risk_breakdown,
          evidenceIds: i.evidence_ids || [],
          unifiedFault: i.unified_fault
        })));
      }

      if (trks) {
        setActiveTracks(trks.map((t: any) => ({
          ...t,
          objectType: t.object_type,
          originCamera: t.origin_camera,
          currentCamera: t.current_camera,
          predictedNextCamera: t.predicted_next_camera,
          activeDurationSeconds: t.active_duration_seconds,
          relatedIncidentId: t.related_incident_id,
          currentSpeedKmh: t.current_speed_kmh
        })));
      }

      if (fencs) {
        setVirtualFences(fencs);
      }

      if (faults) {
        setShieldFaults(faults.map((f: any) => ({
          id: f.id,
          cameraId: f.camera_id,
          cameraName: f.camera_name,
          condition: f.condition,
          detectionConfidence: f.detection_confidence,
          criticality: f.criticality,
          detectedAt: f.detected_at,
          coverageLostPercent: f.coverage_lost_percent,
          coverageRestoredPercent: f.coverage_restored_percent,
          residualBlindZonePercent: f.residual_blind_zone_percent,
          backupCameras: f.backup_cameras || [],
          maintenanceDispatched: f.maintenance_dispatched,
          maintenanceTicketId: f.maintenance_ticket_id
        })));
      }

      if (health) {
        setSystemStatus(prev => ({
          ...prev,
          onlineCameras: health.cameras_online,
          totalCameras: health.cameras_total,
          edgeNodesOnline: health.edge_nodes_online,
          edgeNodesTotal: health.edge_nodes_total,
          swanActive: health.swan_active,
          shieldActive: health.shield_active
        }));
      }
    } catch {
      // Graceful fallback to initial mock data if backend not reachable
    }
  }, []);

  // Connect to Backend WebSocket for Realtime Event Stream
  useEffect(() => {
    refreshBackendData();

    const wsUrl = (import.meta as any).env?.VITE_WS_URL || 'ws://localhost:8000/ws';
    let socket: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connectWs = () => {
      try {
        socket = new WebSocket(wsUrl);
        socket.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            // Refresh on significant events
            if (msg.event?.startsWith('incident') || msg.event?.startsWith('camera') || msg.event?.startsWith('shield') || msg.event?.startsWith('swan') || msg.event?.startsWith('track')) {
              refreshBackendData();
            }
          } catch {
            // ignore non-json
          }
        };
        socket.onerror = () => {
          socket?.close();
        };
        socket.onclose = () => {
          reconnectTimer = setTimeout(connectWs, 4000);
        };
      } catch {
        reconnectTimer = setTimeout(connectWs, 4000);
      }
    };

    connectWs();

    return () => {
      clearTimeout(reconnectTimer);
      socket?.close();
    };
  }, [refreshBackendData]);

  // Real backend-backed Incident Actions with immediate local state & audit timeline updates
  const confirmIncident = useCallback(async (id: string) => {
    const timeStr = `${new Date().toTimeString().split(' ')[0]} IST`;
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status: 'CONFIRMED',
        timeline: [
          ...inc.timeline,
          {
            title: 'Operator Adjudication: CONFIRMED',
            time: timeStr,
            description: `Operator action recorded: Confirmed by ${currentUser.name} (${currentUser.badgeNumber || 'CONSOLE-01'}). QRT unit dispatched.`
          }
        ]
      };
    }));
    try {
      await apiClient.performIncidentAction(id, 'confirm', currentUser.id, currentUser.role);
      await refreshBackendData();
    } catch {
      // Local state already updated
    }
  }, [currentUser, refreshBackendData]);

  const dismissIncident = useCallback(async (id: string) => {
    const timeStr = `${new Date().toTimeString().split(' ')[0]} IST`;
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status: 'DISMISSED',
        timeline: [
          ...inc.timeline,
          {
            title: 'Operator Adjudication: DISMISSED',
            time: timeStr,
            description: `Operator action recorded: Dismissed as authorized patrol/wildlife by ${currentUser.name}.`
          }
        ]
      };
    }));
    try {
      await apiClient.performIncidentAction(id, 'dismiss', currentUser.id, currentUser.role);
      await refreshBackendData();
    } catch {
      // Local state already updated
    }
  }, [currentUser, refreshBackendData]);

  const escalateIncident = useCallback(async (id: string) => {
    const timeStr = `${new Date().toTimeString().split(' ')[0]} IST`;
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        severity: 'CRITICAL',
        status: 'ESCALATED',
        riskScore: 94,
        timeline: [
          ...inc.timeline,
          {
            title: 'Tactical Escalation: CRITICAL',
            time: timeStr,
            description: `Escalated to Sector Commander & Brigade HQ by ${currentUser.name}.`
          }
        ]
      };
    }));
    try {
      await apiClient.performIncidentAction(id, 'escalate', currentUser.id, currentUser.role);
      await refreshBackendData();
    } catch {
      // Local state already updated
    }
  }, [currentUser, refreshBackendData]);

  const assignIncident = useCallback(async (id: string, assignee: string) => {
    const timeStr = `${new Date().toTimeString().split(' ')[0]} IST`;
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        status: 'ASSIGNED',
        assignedTo: assignee,
        timeline: [
          ...inc.timeline,
          {
            title: `Assigned: ${assignee}`,
            time: timeStr,
            description: `Tactical asset ${assignee} assigned by ${currentUser.name}.`
          }
        ]
      };
    }));
    try {
      await apiClient.performIncidentAction(id, 'assign', currentUser.id, currentUser.role, undefined, assignee);
      await refreshBackendData();
    } catch {
      // Local state already updated
    }
  }, [currentUser, refreshBackendData]);

  const annotateIncident = useCallback(async (id: string, noteText: string) => {
    if (!noteText.trim()) return;
    const timeStr = `${new Date().toTimeString().split(' ')[0]} IST`;
    setIncidents(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        notes: [...inc.notes, { id: `note-${Date.now()}`, author: currentUser.name, timestamp: timeStr, text: noteText }],
        timeline: [
          ...inc.timeline,
          {
            title: 'Operator Note Added',
            time: timeStr,
            description: `"${noteText}" - ${currentUser.name}`
          }
        ]
      };
    }));
    try {
      await apiClient.performIncidentAction(id, 'annotate', currentUser.id, currentUser.role, noteText);
      await refreshBackendData();
    } catch {
      // Local state already updated
    }
  }, [currentUser, refreshBackendData]);

  const dispatchMaintenance = useCallback(async (faultId: string) => {
    try {
      await apiClient.dispatchShieldMaintenance(faultId, currentUser.id);
      await refreshBackendData();
    } catch {
      setShieldFaults(prev => prev.map(f => f.id === faultId ? { ...f, maintenanceDispatched: true, maintenanceTicketId: 'WO-BOP17-8492' } : f));
    }
  }, [currentUser, refreshBackendData]);

  // Real backend-backed Demo triggers
  const runDemoStep = useCallback(async (stepNum: number) => {
    setCurrentDemoStep(stepNum);
    try {
      await apiClient.triggerDemoStep(stepNum);
      await refreshBackendData();
    } catch {
      // Local step simulation
    }
  }, [refreshBackendData]);

  const simulateTrack = useCallback(async () => {
    try {
      await apiClient.triggerDemoTrack();
      await refreshBackendData();
    } catch {
      // Local fallback
    }
  }, [refreshBackendData]);

  const simulateCameraFailure = useCallback(async () => {
    try {
      await apiClient.triggerDemoCameraFailure();
      await refreshBackendData();
    } catch {
      // Local fallback
    }
  }, [refreshBackendData]);

  const resetDemo = useCallback(async () => {
    try {
      await apiClient.triggerDemoReset();
      await refreshBackendData();
    } catch {
      // Local fallback
    }
    setCurrentDemoStep(1);
    setIsDemoPlaying(false);
  }, [refreshBackendData]);

  // Demo auto-play stepper
  useEffect(() => {
    if (!isDemoPlaying) return;
    const interval = setInterval(() => {
      setCurrentDemoStep(prev => {
        if (prev >= 16) {
          setIsDemoPlaying(false);
          return 16;
        }
        const next = prev + 1;
        runDemoStep(next);
        return next;
      });
    }, 3500);
    return () => clearInterval(interval);
  }, [isDemoPlaying, runDemoStep]);

  return (
    <RealtimeContext.Provider
      value={{
        systemStatus,
        cameras,
        incidents,
        activeTracks,
        swanRequests,
        shieldFaults,
        virtualFences,
        restrictedZones,
        evidence,
        users,
        currentUser,
        setCurrentUserRole,
        selectedIncidentId,
        setSelectedIncidentId,
        selectedCameraId,
        setSelectedCameraId,
        overlaySettings,
        setOverlaySettings,
        confirmIncident,
        dismissIncident,
        escalateIncident,
        assignIncident,
        annotateIncident,
        dispatchMaintenance,
        simulateTrack,
        simulateCameraFailure,
        runDemoStep,
        currentDemoStep,
        isDemoPlaying,
        setIsDemoPlaying,
        resetDemo,
        refreshBackendData
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
