import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Shield,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  Lock,
  Compass,
  AlertTriangle,
  EyeOff,
  Video,
  ExternalLink,
  Layers,
  Server,
  Activity,
  Truck,
  User,
  Send,
  Bell,
  ScanLine
} from 'lucide-react';
import { CameraFeed } from '../components/video/CameraFeed';
import { useRealtime } from '../context/RealtimeContext';

interface SceneMeta {
  id: number;
  slug: string;
  title: string;
  tag: string;
  badgeColor: string;
  description: string;
  operationalDetail: string;
}

const SCENES: SceneMeta[] = [
  {
    id: 1,
    slug: 'BOP',
    title: 'Arrival at BOP-17 Outpost',
    tag: 'SECTOR RECONNAISSANCE',
    badgeColor: '#477da8',
    description: 'North Sector Frontier. 2.8 km linear perimeter fence, fortified watchtowers, sentry checkpoints, and service roadway.',
    operationalDetail: 'ELEV: 412M | WIND: 12 KT WNW | VIS: 10 KM | SENSORS: 7 NODES'
  },
  {
    id: 2,
    slug: 'CAMERAS',
    title: 'Perimeter Sensor Network Online',
    tag: 'SENSORS ACTIVE',
    badgeColor: '#3f8f68',
    description: 'Multi-spectral sensor nodes calibrate. Fixed optical CCTV, high-tilt PTZ domes, and long-range thermal barriers activate.',
    operationalDetail: 'RTSP STREAMING: 1080P/4K | ONVIF PROFILE S/G | HEARTBEAT: 100MS'
  },
  {
    id: 3,
    slug: 'EDGE',
    title: 'Ruggedized Edge AI Appliance',
    tag: 'LOCAL INFERENCE',
    badgeColor: '#3f8f68',
    description: 'Inference gateway at BOP HQ executes real-time YOLOv8 detection and ByteTrack tracking locally with zero cloud reliance.',
    operationalDetail: 'LATENCY: 14MS TENSORRT | DUAL GPU | AIR-GAPPED HARDENED BUS'
  },
  {
    id: 4,
    slug: 'MONITOR',
    title: 'Routine Perimeter Surveillance',
    tag: 'NOMINAL MONITORING',
    badgeColor: '#3f8f68',
    description: 'Continuous 360° perimeter sweeps. All cameras healthy, patrol routes active, zero border violations.',
    operationalDetail: 'ALL NODES GREEN | IR ILLUMINATION: 100% | STATUS: NOMINAL'
  },
  {
    id: 5,
    slug: 'VEHICLE',
    title: 'Patrol Vehicle Acquisition (V-021)',
    tag: 'VEHICLE DETECTED',
    badgeColor: '#477da8',
    description: 'Patrol truck V-021 detected along service access road. CAM-07 establishes vehicle bounding box and velocity tracking.',
    operationalDetail: 'CLASS: VEHICLE (TRUCK) | SPEED: 38 KM/H | SENSOR: CAM-07'
  },
  {
    id: 6,
    slug: 'ANPR',
    title: 'Number Plate OCR Verification',
    tag: 'ANPR ENGINE',
    badgeColor: '#477da8',
    description: 'Optical zoom crops vehicle registration plate. Edge OCR resolves license string and matches white-list security database.',
    operationalDetail: 'PLATE: JK14B 7283 | CONFIDENCE: 94.8% | STATUS: AUTHORIZED PATROL'
  },
  {
    id: 7,
    slug: 'HUMAN',
    title: 'Infiltrator Detected (T-104)',
    tag: 'INTRUSION DETECTED',
    badgeColor: '#c28a28',
    description: 'Thermal camera CAM-03 acquires unauthorized person emerging from Gully Alpha scrub terrain at 1.8 m/s.',
    operationalDetail: 'CLASS: PERSON | HEADING: 042° | CONFIDENCE: 91% | TRACK: T-104'
  },
  {
    id: 8,
    slug: 'FENCE',
    title: 'Virtual Fence Tripwire Breach',
    tag: 'BUFFER VIOLATION',
    badgeColor: '#c93c3c',
    description: 'Target T-104 crosses the virtual fence tripwire into restricted buffer zone. Threat state elevated across outpost.',
    operationalDetail: 'ZONE: RESTRICTED BUFFER ALPHA | EVENT: PERIMETER TRIPWIRE CROSSING'
  },
  {
    id: 9,
    slug: 'FAILURE',
    title: 'CAM-03 Sensor Sabotage',
    tag: 'HEARTBEAT DROPOUT',
    badgeColor: '#c93c3c',
    description: 'Physical lens tamper / obstruction detected. CAM-03 stream drops, creating a critical 32% perimeter blind zone.',
    operationalDetail: 'TIMEOUT: > 3.0S | FAULT: TAMPER/BLOCK | RESIDUAL BLIND GAP: 32%'
  },
  {
    id: 10,
    slug: 'SHIELD',
    title: 'SHIELD Self-Healing Activation',
    tag: 'AUTONOMOUS RECOVERY',
    badgeColor: '#3f8f68',
    description: 'SHIELD diagnoses heartbeat failure, estimates geometric perimeter blind zone, and evaluates neighbor camera overlap.',
    operationalDetail: 'DIAGNOSTIC TIME: 180MS | CANDIDATE NODES: CAM-04, CAM-TOWER-01'
  },
  {
    id: 11,
    slug: 'COVERAGE',
    title: 'Autonomous Backup PTZ Slew',
    tag: 'COVERAGE RESTORED',
    badgeColor: '#3f8f68',
    description: 'CAM-TOWER-01 actuates +32° azimuth in 1.4s, projecting its field of view over the blind zone and restoring 88% coverage.',
    operationalDetail: 'ACTUATION: 1.4S | MOTOR: ONVIF PTZ | RESIDUAL GAP REDUCED TO 11.6%'
  },
  {
    id: 12,
    slug: 'SWAN',
    title: 'SWAN Distributed Coordination',
    tag: 'DISTRIBUTED INTELLIGENCE',
    badgeColor: '#477da8',
    description: 'Core doctrine: "One camera is never the end of a track." SWAN initiates peer-to-peer distributed tracking consensus.',
    operationalDetail: 'TOPOLOGY: SENSOR-WIDE MESH | CLUSTER NODES: 7 | ZERO CLOUD'
  },
  {
    id: 13,
    slug: 'PRIORITY',
    title: 'Predictive Corridor Tasking',
    tag: 'CORRIDOR ELEVATION',
    badgeColor: '#477da8',
    description: 'SWAN projects movement vector. Downstream cameras CAM-04 and CAM-06 switch to High Priority while off-axis nodes remain normal.',
    operationalDetail: 'PREDICTED VECTOR: 042° | TASKED: CAM-04 (ACTIVE), CAM-06 (STANDBY)'
  },
  {
    id: 14,
    slug: 'HANDOFF',
    title: 'Seamless Multi-Camera Handoff',
    tag: 'TRACK CONTINUITY',
    badgeColor: '#477da8',
    description: 'Target T-104 re-acquired by optical dome CAM-04 with 94.2% cosine feature vector similarity. Same persistent ID maintained.',
    operationalDetail: 'TRACK PERSISTENCE: T-104 | COSINE MATCH: 94.2% | HANDOFF LATENCY: 38MS'
  },
  {
    id: 15,
    slug: 'VERIFY',
    title: 'Multi-Sensor Confirmation',
    tag: 'DUAL CONFIRMATION',
    badgeColor: '#3f8f68',
    description: 'Dual-sensor corroboration confirms legitimate human intruder rather than animal or false trip. Confidence escalates 71% → 92%.',
    operationalDetail: 'MULTI-SIGNAL CORROBORATION | DEMO CONFIDENCE: 92% | FALSE ALARM: ZERO'
  },
  {
    id: 16,
    slug: 'RISK',
    title: 'Multi-Signal Risk Fusion',
    tag: 'OBJECTIVE RISK SCORE',
    badgeColor: '#c93c3c',
    description: 'Velocity (1.8 m/s) + buffer zone penetration + multi-sensor verification formulated into unified threat score: 92/100 (CRITICAL).',
    operationalDetail: 'RISK: 92 / 100 (CRITICAL) | THREAT LEVEL: HIGH-CONFIDENCE INTRUSION'
  },
  {
    id: 17,
    slug: 'INCIDENT',
    title: 'Unified Incident Dossier Created',
    tag: 'INCIDENT PACKET',
    badgeColor: '#c93c3c',
    description: 'Scattered camera observations collapse into one consolidated actionable operational record: INC-2026-0142.',
    operationalDetail: 'DOSSIER: INC-2026-0142 | CAM CHAIN: CAM-03 → CAM-04 → CAM-06'
  },
  {
    id: 18,
    slug: 'DISPATCH',
    title: 'Alert Transmission to Command Centre',
    tag: 'HIGH-ASSURANCE RELAY',
    badgeColor: '#477da8',
    description: 'Incident packet and SHA-256 evidence stream across encrypted fiber mesh from BOP-17 edge to Sector Command HQ console.',
    operationalDetail: 'ENCRYPTED TLS 1.3 MESH | PACKET: INC-2026-0142 | TARGET: SECTOR HQ'
  },
  {
    id: 19,
    slug: 'OPERATOR',
    title: 'Human Operator Decision Terminal',
    tag: 'HUMAN DECISION',
    badgeColor: '#3f8f68',
    description: 'Detection is automated. Decision remains human. Command operator verifies multi-camera evidence and authorizes tactical response.',
    operationalDetail: 'DOCTRINE: OPERATOR DECIDES | ACTIONS: CONFIRM / ESCALATE / INTERCEPT'
  }
];

export const DrishtiPublicLanding: React.FC = () => {
  const { cameras } = useRealtime();
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [continuousTick, setContinuousTick] = useState<number>(0);
  const [manualScroll, setManualScroll] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const cam4 = cameras.find(c => c.id === 'CAM-04') || cameras[3];
  const cam6 = cameras.find(c => c.id === 'CAM-06') || cameras[5];
  const camTower = cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[8];

  // 60 FPS continuous animation loop for sweeps, patrols, and transmission pulses
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setContinuousTick(prev => (prev + 1) % 3600);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Auto-play advances scene every 5.5s unless user paused
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentScene(prev => (prev >= 19 ? 1 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync scroll height smoothly when currentScene changes
  useEffect(() => {
    if (!scrollContainerRef.current || manualScroll) return;
    const targetScroll = ((currentScene - 1) / 18) * (scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight);
    scrollContainerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [currentScene, manualScroll]);

  // Manual scroll listener interpolating scroll percentage into 1-19 scene index
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setManualScroll(true);
    const container = e.currentTarget;
    const maxScroll = container.scrollHeight - container.clientHeight;
    if (maxScroll <= 0) return;
    const scrollRatio = container.scrollTop / maxScroll;
    const calculatedScene = Math.min(19, Math.max(1, Math.round(scrollRatio * 18) + 1));
    if (calculatedScene !== currentScene) {
      setCurrentScene(calculatedScene);
      setIsPlaying(false);
    }
    setTimeout(() => setManualScroll(false), 250);
  };

  const scene = SCENES[currentScene - 1];

  // Continuous oscillation scan angles simulating realistic optical/PTZ sweeps
  const cam3ScanAngle = Math.sin(continuousTick * 0.03) * 16;
  const cam4ScanAngle = currentScene >= 11 ? 28 + Math.sin(continuousTick * 0.04) * 8 : Math.sin(continuousTick * 0.02) * 20;
  const cam6ScanAngle = Math.sin(continuousTick * 0.025) * 14;

  // Patrol truck position along perimeter access road (continuous loop)
  const truckX = (continuousTick * 0.8) % 860 + 80;

  // Target T-104 coordinates driven smoothly by scenario state
  const targetX = useMemo(() => {
    if (currentScene < 7) return -80; // Infiltrator not yet present before scene 7
    if (currentScene === 7) return 180; // Acquired by CAM-03 at fence
    if (currentScene === 8) return 250; // Virtual fence tripwire breach
    if (currentScene >= 9 && currentScene <= 11) return 330; // Traversing blind zone gully
    if (currentScene >= 12 && currentScene <= 15) return 460; // CAM-04 corridor handoff
    if (currentScene >= 16 && currentScene <= 17) return 620; // Entering CAM-06 sector
    if (currentScene >= 18) return 740; // Ingested to command centre
    return 180;
  }, [currentScene]);

  const targetY = useMemo(() => {
    if (currentScene < 7) return 220;
    if (currentScene === 7) return 200;
    if (currentScene === 8) return 180;
    if (currentScene >= 9 && currentScene <= 11) return 195;
    if (currentScene >= 12 && currentScene <= 15) return 230;
    if (currentScene >= 16 && currentScene <= 17) return 270;
    if (currentScene >= 18) return 360;
    return 200;
  }, [currentScene]);

  // Alert transmission animation progress between BOP edge and Command Centre
  const transmissionOffset = (continuousTick * 4) % 100;

  return (
    <div className="h-screen w-screen bg-[#0b0d0f] text-[#e5e7eb] font-mono select-none flex flex-col overflow-hidden antialiased">
      {/* 1. TOP MINIMAL NAVIGATION & PLAYBACK CONTROLLER */}
      <header className="h-12 bg-[#121417]/95 border-b border-[#282c33] px-4 md:px-6 flex items-center justify-between shrink-0 z-40 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-[#181b1f] border border-[#30353b] flex items-center justify-center">
            <Radio className="w-3.5 h-3.5 text-[#477da8]" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm text-[#e5e7eb]">DRISHTI</span>
            <span className="text-[10px] text-[#8d949d] ml-2 hidden sm:inline">BOP-17 CINEMATIC OPERATIONAL SIMULATION</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isPlaying
                ? 'bg-[#3f8f68]/20 text-[#3f8f68] border border-[#3f8f68]/50'
                : 'bg-[#20242a] text-[#e5e7eb] border border-[#30353b] hover:bg-[#30353b]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#3f8f68]" />
                <span>PLAY SCENARIO</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setCurrentScene(1);
              setIsPlaying(true);
            }}
            title="Restart Scenario"
            className="p-1 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="h-4 w-px bg-[#282c33] mx-1 hidden sm:block" />

          <Link
            to="/login"
            className="px-3.5 py-1 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold transition-colors flex items-center gap-1.5 text-xs shadow-sm"
          >
            <span>OPERATOR CONSOLE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. THREE-PANE TACTICAL STAGE (LEFT: STORY, CENTER: BOP SIMULATION, RIGHT: TELEMETRY) */}
      <div className="flex-1 grid grid-cols-12 min-h-0 relative overflow-hidden">
        {/* Invisible Scroll Track Driving Master Timeline */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto opacity-0 z-30 pointer-events-auto"
        >
          <div className="h-[1400vh] w-full" />
        </div>

        {/* LEFT COLUMN: SCENE STORY & MISSION BRIEFING (COL-SPAN-3) */}
        <div className="hidden md:flex col-span-3 bg-[#111316] border-r border-[#242830] p-4 flex-col justify-between z-20 pointer-events-none">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#181b1f] border border-[#30353b] text-xs">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: scene.badgeColor }} />
              <span className="text-[#8d949d]">{scene.tag}</span>
            </div>

            <div>
              <div className="text-[10px] text-[#8d949d] uppercase">SCENE {scene.id.toString().padStart(2, '0')} / 19</div>
              <h2 className="text-base sm:text-lg font-bold text-[#e5e7eb] tracking-tight leading-tight mt-0.5">
                {scene.title}
              </h2>
            </div>

            <p className="text-xs text-[#8d949d] leading-relaxed bg-[#181b1f] p-3 rounded border border-[#262a30]">
              {scene.description}
            </p>

            <div className="p-2.5 rounded bg-[#181b1f] border border-[#262a30] space-y-1 text-[10px]">
              <div className="text-[#8d949d] uppercase font-semibold">Operational Telemetry</div>
              <div className="text-[#3f8f68] font-bold">{scene.operationalDetail}</div>
            </div>
          </div>

          {/* Core System Legend */}
          <div className="p-3 rounded bg-[#181b1f] border border-[#262a30] space-y-1.5 text-[10px]">
            <div className="text-[#8d949d] uppercase font-semibold border-b border-[#262a30] pb-1">Platform Doctrine</div>
            <div className="flex items-center gap-1.5 text-[#3f8f68]">
              <CheckCircle2 className="w-3 h-3" />
              <span>SHIELD heals camera failures automatically.</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#477da8]">
              <Zap className="w-3 h-3" />
              <span>SWAN maintains multi-camera continuity.</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#e5e7eb]">
              <Lock className="w-3 h-3" />
              <span>Human operator authorizes all tactical action.</span>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: CINEMATIC 2.5D ILLUSTRATED BOP SURVEILLANCE STAGE (COL-SPAN-6 OR 9) */}
        <div className="col-span-12 md:col-span-6 lg:col-span-6 flex flex-col bg-[#0b0d0f] relative overflow-hidden items-center justify-center p-2 sm:p-4">
          {/* Mobile Scene Header overlay */}
          <div className="md:hidden absolute top-2 left-2 z-20 bg-[#14171a]/90 p-2 rounded border border-[#30353b] text-xs max-w-xs">
            <span className="text-[#477da8] font-bold block">SCENE {scene.id.toString().padStart(2, '0')}: {scene.title}</span>
            <span className="text-[10px] text-[#8d949d]">{scene.tag}</span>
          </div>

          {/* SVG Vector Operational Theatre */}
          <svg
            viewBox="0 0 1000 560"
            className="w-full h-full max-h-[72vh] object-contain transition-transform duration-700 ease-out pointer-events-none"
          >
            <defs>
              <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#111417" />
                <stop offset="100%" stopColor="#0b0d0f" />
              </linearGradient>

              <pattern id="blindZoneHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="10" stroke="#c93c3c" strokeWidth="2" opacity="0.6" />
              </pattern>

              <radialGradient id="coverageNominal" cx="0%" cy="50%" r="100%">
                <stop offset="0%" stopColor="#3f8f68" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#3f8f68" stopOpacity="0.02" />
              </radialGradient>
              <radialGradient id="coverageElevated" cx="0%" cy="50%" r="100%">
                <stop offset="0%" stopColor="#477da8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#477da8" stopOpacity="0.05" />
              </radialGradient>
              <radialGradient id="coverageWarning" cx="0%" cy="50%" r="100%">
                <stop offset="0%" stopColor="#c28a28" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#c28a28" stopOpacity="0.05" />
              </radialGradient>
            </defs>

            {/* 1. Terrain Base */}
            <rect x="20" y="20" width="960" height="520" rx="8" fill="url(#terrainGrad)" stroke="#20242a" strokeWidth="1.5" />

            {/* Contour Elevation Curves */}
            <path d="M 60 140 Q 280 180 500 130 T 940 160" fill="none" stroke="#1c2026" strokeWidth="1.5" />
            <path d="M 60 260 Q 320 220 540 280 T 940 240" fill="none" stroke="#1c2026" strokeWidth="1.5" />
            <path d="M 60 380 Q 260 420 580 360 T 940 400" fill="none" stroke="#1c2026" strokeWidth="1.5" />

            {/* 2. Perimeter Service Access Road */}
            <path d="M 40 460 L 960 460" stroke="#22272e" strokeWidth="18" strokeLinecap="round" />
            <path d="M 40 460 L 960 460" stroke="#353b45" strokeWidth="1.5" strokeDasharray="8 8" />

            {/* 3. Patrol Truck V-021 moving along roadway */}
            <g transform={`translate(${truckX}, 450)`}>
              <rect x="-16" y="-7" width="32" height="14" rx="2" fill="#1c2026" stroke="#477da8" strokeWidth="1.2" />
              <rect x="8" y="-5" width="6" height="10" rx="1" fill="#477da8" opacity="0.6" />
              <circle cx="-10" cy="8" r="2.5" fill="#0b0d0f" stroke="#477da8" />
              <circle cx="10" cy="8" r="2.5" fill="#0b0d0f" stroke="#477da8" />
              <text x="-24" y="-12" fill="#8d949d" fontSize="7" fontWeight="bold">TRUCK V-021 (PATROL)</text>
            </g>

            {/* 4. Physical Linear Border Fence Alpha */}
            <path d="M 80 170 L 920 170" stroke="#30353b" strokeWidth="4" />
            {Array.from({ length: 22 }).map((_, i) => (
              <line key={i} x1={90 + i * 38} y1="162" x2={90 + i * 38} y2="178" stroke="#4a525d" strokeWidth="1.5" />
            ))}

            {/* 5. Virtual Fence Sensor Tripwire */}
            <path
              d="M 80 140 L 920 140"
              stroke={currentScene >= 8 ? '#c93c3c' : '#477da8'}
              strokeWidth={currentScene >= 8 ? '2.5' : '1.5'}
              strokeDasharray="6 4"
              className={currentScene >= 8 ? 'animate-pulse' : ''}
            />
            <text x="90" y="132" fill={currentScene >= 8 ? '#c93c3c' : '#477da8'} fontSize="9" fontWeight="bold">
              VIRTUAL FENCE LINE ALPHA &bull; BUFFER TRIPWIRE (2.8 KM)
            </text>

            {/* 6. BOP-17 Command Outpost Complex */}
            <rect x="740" y="340" width="160" height="90" rx="4" fill="#181b1f" stroke="#30353b" strokeWidth="1.5" />
            <text x="755" y="365" fill="#e5e7eb" fontSize="12" fontWeight="bold">BOP-17 COMMAND</text>
            <text x="755" y="385" fill="#8d949d" fontSize="9">SECTOR 17 EDGE CLUSTER</text>
            <circle cx="875" cy="365" r="4" fill="#3f8f68" className="animate-ping" />

            {/* Watch Tower Structure */}
            <rect x="420" y="320" width="40" height="40" fill="#1e2228" stroke="#30353b" strokeWidth="1.5" />
            <text x="410" y="375" fill="#8d949d" fontSize="9">WATCH TOWER 01</text>

            {/* 7. Active Camera Field-of-View (FOV) Cones with Dynamic Continuous Sweeps */}
            {/* CAM-03 Coverage Cone */}
            {currentScene >= 2 && currentScene < 9 && (
              <g transform={`rotate(${cam3ScanAngle}, 180, 280)`}>
                <path d="M 180 280 L 90 120 L 270 120 Z" fill="url(#coverageNominal)" stroke="#3f8f68" strokeWidth="1" opacity="0.8" />
              </g>
            )}

            {/* CAM-03 Blind Zone (appears when CAM-03 fails) */}
            {currentScene >= 9 && (
              <path d="M 180 280 L 90 120 L 270 120 Z" fill="url(#blindZoneHatch)" stroke="#c93c3c" strokeWidth="1.5" />
            )}

            {/* CAM-04 Coverage Cone */}
            {currentScene >= 2 && (
              <g transform={`rotate(${cam4ScanAngle}, 440, 280)`}>
                <path
                  d="M 440 280 L 320 120 L 560 120 Z"
                  fill={currentScene >= 11 ? 'url(#coverageElevated)' : 'url(#coverageNominal)'}
                  stroke={currentScene >= 11 ? '#477da8' : '#3f8f68'}
                  strokeWidth={currentScene >= 11 ? '2' : '1'}
                  opacity={currentScene >= 11 ? 0.9 : 0.6}
                />
              </g>
            )}

            {/* CAM-TOWER-01 Backup PTZ Slewed Cone (SHIELD restoration) */}
            {currentScene >= 10 && (
              <path d="M 440 320 L 150 150 L 330 150 Z" fill="url(#coverageElevated)" stroke="#477da8" strokeWidth="1.5" strokeDasharray="4 2" />
            )}

            {/* CAM-06 Downstream Predicted Coverage Cone */}
            {currentScene >= 2 && (
              <g transform={`rotate(${cam6ScanAngle}, 700, 280)`}>
                <path
                  d="M 700 280 L 560 130 L 840 130 Z"
                  fill={currentScene >= 13 ? 'url(#coverageWarning)' : 'url(#coverageNominal)'}
                  stroke={currentScene >= 13 ? '#c28a28' : '#3f8f68'}
                  strokeWidth="1"
                  opacity={currentScene >= 13 ? 0.8 : 0.4}
                />
              </g>
            )}

            {/* 8. Camera Markers */}
            <g transform="translate(180, 280)">
              <circle r="8" fill={currentScene >= 9 ? '#c93c3c' : '#181b1f'} stroke={currentScene >= 9 ? '#ffffff' : '#3f8f68'} strokeWidth="2" />
              <text x="12" y="4" fill={currentScene >= 9 ? '#c93c3c' : '#e5e7eb'} fontSize="10" fontWeight="bold">
                CAM-03 {currentScene >= 9 ? '(OFFLINE)' : '(IR THERMAL)'}
              </text>
            </g>

            <g transform="translate(440, 280)">
              <circle r="8" fill="#181b1f" stroke={currentScene >= 11 ? '#477da8' : '#3f8f68'} strokeWidth={currentScene >= 11 ? '3' : '2'} />
              <text x="12" y="4" fill="#e5e7eb" fontSize="10" fontWeight="bold">
                CAM-04 {currentScene >= 11 ? '(HIGH PRIORITY)' : '(PTZ DOME)'}
              </text>
            </g>

            <g transform="translate(700, 280)">
              <circle r="8" fill="#181b1f" stroke={currentScene >= 13 ? '#c28a28' : '#3f8f68'} strokeWidth={currentScene >= 13 ? '2.5' : '1.5'} />
              <text x="12" y="4" fill="#e5e7eb" fontSize="10" fontWeight="bold">
                CAM-06 {currentScene >= 13 ? '(PREDICTED INTERCEPT)' : '(FIXED CCTV)'}
              </text>
            </g>

            {/* 9. Moving Target T-104 (Infiltrator) */}
            {currentScene >= 7 && (
              <>
                <path
                  d={`M 140 210 Q 220 190 ${targetX} ${targetY}`}
                  fill="none"
                  stroke="#c93c3c"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {currentScene >= 13 && (
                  <path
                    d={`M ${targetX} ${targetY} Q 540 260 680 270`}
                    fill="none"
                    stroke="#477da8"
                    strokeWidth="2"
                    strokeDasharray="6 3"
                  />
                )}

                <g transform={`translate(${targetX}, ${targetY})`} className="transition-all duration-700 ease-out">
                  <circle r="9" fill="none" stroke="#c93c3c" strokeWidth="2" />
                  <line x1="-12" y1="0" x2="12" y2="0" stroke="#c93c3c" strokeWidth="1.5" />
                  <line x1="0" y1="-12" x2="0" y2="12" stroke="#c93c3c" strokeWidth="1.5" />
                  <rect x="12" y="-18" width="92" height="28" rx="2" fill="#14171a" stroke="#c93c3c" strokeWidth="1" />
                  <text x="18" y="-4" fill="#e5e7eb" fontSize="9" fontWeight="bold">T-104 &bull; PERSON</text>
                  <text x="18" y="7" fill="#3f8f68" fontSize="8">VEL: 1.8 m/s</text>
                </g>
              </>
            )}

            {/* 10. SCENE 18 & 19: Alert Transmission Stream to Command Centre */}
            {currentScene >= 18 && (
              <>
                <path d="M 820 340 L 880 180" stroke="#477da8" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx={820 + (880 - 820) * (transmissionOffset / 100)} cy={340 + (180 - 340) * (transmissionOffset / 100)} r="4" fill="#477da8" className="animate-ping" />

                <g transform="translate(820, 80)">
                  <rect width="140" height="75" rx="4" fill="#14171a" stroke="#477da8" strokeWidth="1.5" />
                  <text x="10" y="20" fill="#477da8" fontSize="10" fontWeight="bold">COMMAND HQ</text>
                  <text x="10" y="34" fill="#c93c3c" fontSize="9" fontWeight="bold">INC-2026-0142</text>
                  <text x="10" y="48" fill="#3f8f68" fontSize="8">TARGET: T-104 CONFIRMED</text>
                  <text x="10" y="62" fill="#e5e7eb" fontSize="8">AWAITING OPERATOR</text>
                </g>
              </>
            )}
          </svg>
        </div>

        {/* RIGHT COLUMN: REAL-TIME OPERATIONAL TELEMETRY & INSET CCTV (COL-SPAN-3) */}
        <div className="hidden lg:flex col-span-3 bg-[#111316] border-l border-[#242830] p-4 flex-col justify-between z-20 pointer-events-none">
          {/* Live Synchronized Picture-in-Picture CCTV Feed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-[#262a30] pb-1.5">
              <span className="font-bold text-[#e5e7eb] flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-[#477da8]" />
                <span>CCTV INSET: {currentScene <= 8 ? 'CAM-03' : currentScene <= 11 ? 'CAM-03 FAULT' : 'CAM-04'}</span>
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                currentScene >= 9 && currentScene <= 11 ? 'bg-[#c93c3c] text-white' : 'bg-[#3f8f68]/20 text-[#3f8f68]'
              }`}>
                {currentScene >= 9 && currentScene <= 11 ? 'OFFLINE' : 'LIVE'}
              </span>
            </div>

            <div className="h-44 border border-[#282c33] rounded overflow-hidden relative bg-[#0b0d0f]">
              {currentScene >= 9 && currentScene <= 11 ? (
                <div className="h-full w-full flex flex-col items-center justify-center p-3 text-center space-y-1">
                  <EyeOff className="w-8 h-8 text-[#c93c3c] animate-pulse" />
                  <span className="text-xs font-bold text-[#c93c3c]">HEARTBEAT DROPOUT</span>
                  <span className="text-[10px] text-[#8d949d]">SHIELD Slew Executing...</span>
                </div>
              ) : currentScene >= 12 ? (
                <CameraFeed camera={cam4} showControls={false} />
              ) : (
                <CameraFeed camera={cam3} showControls={false} />
              )}
            </div>
          </div>

          {/* Scene 06 ANPR Plate Recognition Card */}
          {currentScene === 6 && (
            <div className="p-3 rounded bg-[#181b1f] border border-[#477da8]/60 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-[#477da8] font-bold">
                <span className="flex items-center gap-1"><ScanLine className="w-3 h-3" /> ANPR OCR CROP</span>
                <span className="text-[10px] text-[#3f8f68]">RESOLVED</span>
              </div>
              <div className="p-2 rounded bg-[#0b0d0f] border border-[#30353b] text-center font-bold text-sm tracking-widest text-[#e5e7eb]">
                JK14B 7283
              </div>
              <div className="flex justify-between text-[10px] text-[#8d949d]">
                <span>VEHICLE: PATROL TRUCK</span>
                <span className="text-[#3f8f68]">MATCH: 94.8%</span>
              </div>
            </div>
          )}

          {/* System Consensus & Telemetry Badges */}
          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded bg-[#181b1f] border border-[#262a30] flex items-center justify-between">
              <span className="text-[#8d949d]">ACTIVE TARGET:</span>
              <span className="font-bold text-[#e5e7eb]">{currentScene >= 7 ? 'T-104 (PERSON)' : 'NONE (NORMAL)'}</span>
            </div>
            <div className="p-2.5 rounded bg-[#181b1f] border border-[#262a30] flex items-center justify-between">
              <span className="text-[#8d949d]">VEHICLE PATROL:</span>
              <span className="font-bold text-[#477da8]">TRUCK V-021 (ACTIVE)</span>
            </div>
            <div className="p-2.5 rounded bg-[#181b1f] border border-[#262a30] flex items-center justify-between">
              <span className="text-[#8d949d]">THREAT SCORE:</span>
              <span className={`font-bold ${currentScene >= 16 ? 'text-[#c93c3c]' : 'text-[#3f8f68]'}`}>
                {currentScene >= 16 ? '92 / 100 (CRITICAL)' : 'LOW (12 / 100)'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM SCENE TIMELINE SCRUBBER (01-19) */}
      <footer className="h-16 bg-[#121417] border-t border-[#282c33] px-3 md:px-6 flex items-center justify-between shrink-0 z-40 text-xs">
        {/* Step Buttons (01 - 19) */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto py-1 mr-4">
          {SCENES.map((s) => {
            const isActive = currentScene === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentScene(s.id);
                  setIsPlaying(false);
                }}
                className={`px-2 py-1.5 rounded transition-all shrink-0 flex flex-col items-center ${
                  isActive
                    ? 'bg-[#477da8] text-white font-bold scale-105 shadow-sm'
                    : 'text-[#8d949d] hover:bg-[#181b1f] hover:text-[#e5e7eb]'
                }`}
              >
                <span className="text-[10px] leading-none">{s.id.toString().padStart(2, '0')}</span>
                <span className="text-[8px] opacity-75 mt-0.5 uppercase tracking-tighter">{s.slug}</span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              setCurrentScene(prev => (prev > 1 ? prev - 1 : 19));
              setIsPlaying(false);
            }}
            className="p-2 rounded bg-[#181b1f] border border-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setCurrentScene(prev => (prev < 19 ? prev + 1 : 1));
              setIsPlaying(false);
            }}
            className="p-2 rounded bg-[#181b1f] border border-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default DrishtiPublicLanding;
