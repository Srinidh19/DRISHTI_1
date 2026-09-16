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
  Maximize2
} from 'lucide-react';
import { CameraFeed } from '../components/video/CameraFeed';
import { useRealtime } from '../context/RealtimeContext';

interface SceneMeta {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  tag: string;
  description: string;
}

const SCENES: SceneMeta[] = [
  { id: 1, slug: 'BOP', title: 'Arrival at BOP-17', subtitle: 'North Sector Frontier Outpost', tag: 'TERRAIN RECON', description: '2.8 km border sector. Undulating terrain, access roadway, watchtowers, and linear border fence.' },
  { id: 2, slug: 'CAMERAS', title: 'Perimeter Sensor Grid', subtitle: 'Sensors Come Online', tag: 'SENSOR GRID', description: '7 multi-spectral sensor nodes activate. Fixed CCTV, optical PTZ domes, and thermal barriers establish coverage.' },
  { id: 3, slug: 'EDGE', title: 'Ruggedized Edge Appliance', subtitle: 'BOP Inference Gateway', tag: 'LOCAL COMPUTE', description: 'Local GPU node runs YOLOv8, ByteTrack, SWAN consensus, and SHIELD health loops with zero cloud reliance.' },
  { id: 4, slug: 'MONITOR', title: 'Normal Surveillance State', subtitle: 'All Sectors Nominal', tag: 'SURVEILLANCE', description: 'Continuous optical/thermal scanning. Zero border boundary violations detected.' },
  { id: 5, slug: 'DETECT', title: 'Target Enters Monitored Zone', subtitle: 'CAM-03 Acquires T-104', tag: 'TARGET DETECTED', description: 'Single thermal signature detected approaching sector fence line at 1.8 m/s.' },
  { id: 6, slug: 'FENCE', title: 'Virtual Fence Violation', subtitle: 'Border Barrier Breach', tag: 'BOUNDARY EVENT', description: 'T-104 crosses the virtual fence tripwire into restricted buffer zone. Alert state elevated.' },
  { id: 7, slug: 'FAILURE', title: 'CAM-03 Sensor Sabotage', subtitle: 'Heartbeat Lost & Blind Zone', tag: 'SENSOR FAILURE', description: 'Physical spray/tamper disables CAM-03. A 32% perimeter blind zone appears while T-104 is moving.' },
  { id: 8, slug: 'SHIELD', title: 'SHIELD Health Diagnostics', subtitle: 'Autonomous Fault Classification', tag: 'SELF-HEALING', description: 'SHIELD detects 3.0s timeout, classifies physical tamper, and measures residual blind zone.' },
  { id: 9, slug: 'SEARCH', title: 'Evaluating Neighbor Nodes', subtitle: 'Calculating Overlap Geometry', tag: 'GEOMETRIC FUSION', description: 'SHIELD sweeps neighbor nodes (CAM-04, CAM-06, CAM-TOWER-01) to find optimal alternate line of sight.' },
  { id: 10, slug: 'COVERAGE', title: 'Autonomous PTZ Slew', subtitle: 'Perimeter Coverage Restored', tag: 'GAP HEALED', description: 'CAM-TOWER-01 actuates +32° azimuth in 1.4s, restoring 88% coverage across the compromised gully.' },
  { id: 11, slug: 'SWAN', title: 'SWAN Distributed Intelligence', subtitle: 'One Camera is Never the End of a Track', tag: 'DISTRIBUTED BUS', description: 'SWAN coordinates adjacent sensor nodes across the border line into a unified tracking fabric.' },
  { id: 12, slug: 'PRIORITY', title: 'Predictive Corridor Tasking', subtitle: 'Corridor Cameras Elevated', tag: 'TASKING', description: 'SWAN predicts trajectory vector. CAM-04 and CAM-06 elevated to High Priority while off-corridor cameras remain normal.' },
  { id: 13, slug: 'HANDOFF', title: 'Seamless Track Handoff', subtitle: 'Target Re-acquired by CAM-04', tag: 'CONTINUITY', description: 'Target T-104 re-acquired with 94.2% cosine feature similarity. Persistent track ID maintained.' },
  { id: 14, slug: 'VERIFY', title: 'Multi-Sensor Confirmation', subtitle: 'Confidence Escalation (71% → 92%)', tag: 'CONFIRMATION', description: 'Corroboration from dual sensors confirms legitimate human intruder rather than false alarm.' },
  { id: 15, slug: 'RISK', title: 'Multi-Signal Risk Fusion', subtitle: 'Objective Threat Formulation', tag: 'RISK ENGINE', description: 'Inward velocity + buffer zone + multi-cam confirmation triggers CRITICAL risk score (92/100).' },
  { id: 16, slug: 'INCIDENT', title: 'Unified Incident Creation', subtitle: 'Consolidated Actionable Dossier', tag: 'INCIDENT CREATED', description: 'Raw camera observations collapse into one actionable command dossier: INC-2026-0142.' },
  { id: 17, slug: 'EVIDENCE', title: 'Cryptographic Chain of Custody', subtitle: 'SHA-256 Tamper-Proof Bundle', tag: 'FORENSICS', description: 'Synchronized clip, GPS waypoints, detection boxes, and telemetry sealed with SHA-256 HMAC for legal admissibility.' },
  { id: 18, slug: 'COMMAND', title: 'Command Centre Ingestion', subtitle: 'Real-Time Operational Picture', tag: 'C4I CONSOLE', description: 'Data relays securely from BOP-17 edge to the Sector Command Centre GIS map and priority camera wall.' },
  { id: 19, slug: 'OPERATOR', title: 'Human Verification & Decision', subtitle: 'Detection Automated. Decision Human.', tag: 'OPERATOR DECISION', description: 'System provides verified intelligence. Human operator confirms threat and authorizes tactical field dispatch.' }
];

export const DrishtiPublicLanding: React.FC = () => {
  const { cameras } = useRealtime();
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [manualScroll, setManualScroll] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const cam4 = cameras.find(c => c.id === 'CAM-04') || cameras[3];
  const cam6 = cameras.find(c => c.id === 'CAM-06') || cameras[5];
  const camTower = cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[8];

  // Auto-play timer (advances scene every 5.5s unless paused)
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentScene(prev => (prev >= 19 ? 1 : prev + 1));
    }, 5500);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Sync scroll position when currentScene changes
  useEffect(() => {
    if (!scrollContainerRef.current || manualScroll) return;
    const targetScroll = ((currentScene - 1) / 18) * (scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight);
    scrollContainerRef.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
  }, [currentScene, manualScroll]);

  // Handle manual scroll to calculate interpolated scene
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
    setTimeout(() => setManualScroll(false), 300);
  };

  const scene = SCENES[currentScene - 1];

  // Dynamic simulation environment positions based on scene
  const targetX = useMemo(() => {
    if (currentScene < 5) return -50;
    if (currentScene === 5) return 180; // CAM-03 area
    if (currentScene === 6) return 260; // Crossing virtual fence
    if (currentScene >= 7 && currentScene <= 10) return 330; // In gully blind zone
    if (currentScene >= 11 && currentScene <= 14) return 460; // Re-acquired by CAM-04
    if (currentScene >= 15) return 600; // Entering CAM-06 sector
    return 180;
  }, [currentScene]);

  const targetY = useMemo(() => {
    if (currentScene < 5) return 220;
    if (currentScene === 5) return 200;
    if (currentScene === 6) return 180;
    if (currentScene >= 7 && currentScene <= 10) return 195;
    if (currentScene >= 11 && currentScene <= 14) return 230;
    if (currentScene >= 15) return 270;
    return 200;
  }, [currentScene]);

  return (
    <div className="h-screen w-screen bg-[#0b0d0f] text-[#e5e7eb] font-mono select-none flex flex-col overflow-hidden antialiased">
      {/* 1. TOP MINIMAL NAVIGATION BAR */}
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
            <span>ENTER COMMAND CENTRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* 2. MAIN SIMULATION & SCROLL STAGE */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Invisible Scroll Track (Drives scroll events seamlessly) */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto opacity-0 z-30 pointer-events-auto"
        >
          {/* 19 height blocks to map scroll seamlessly across 0-100% */}
          <div className="h-[1200vh] w-full" />
        </div>

        {/* Cinematic Simulation Viewport (Primary Visual Focus) */}
        <div className="flex-1 flex flex-col bg-[#0b0d0f] relative overflow-hidden pointer-events-none">
          {/* Tactical HUD Header */}
          <div className="absolute top-4 left-4 z-20 space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-[#14171a]/90 border border-[#30353b] text-xs backdrop-blur">
              <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-pulse" />
              <span className="text-[#8d949d]">SECTOR 17 OPERATIONAL THEATRE</span>
              <span className="text-[#30353b]">|</span>
              <span className="text-[#477da8] font-bold">{scene.tag}</span>
            </div>
            <div className="text-xl md:text-2xl font-extrabold text-[#e5e7eb] tracking-tight">
              {scene.title}
            </div>
            <div className="text-xs text-[#8d949d] max-w-md">
              {scene.description}
            </div>
          </div>

          {/* Real-Time Telemetry Watermark Top Right */}
          <div className="absolute top-4 right-4 z-20 text-right space-y-1 font-mono text-[11px] text-[#8d949d] hidden sm:block">
            <div className="px-2.5 py-1 rounded bg-[#14171a]/90 border border-[#30353b] backdrop-blur inline-block">
              <div>GEO: <span className="text-[#e5e7eb]">32.7325° N, 74.8645° E</span></div>
              <div>TIME: <span className="text-[#e5e7eb]">16:48:{(12 + currentScene).toString().padStart(2, '0')} IST</span></div>
              <div>SCENE: <span className="text-[#3f8f68] font-bold">{currentScene.toString().padStart(2, '0')} / 19</span></div>
            </div>
          </div>

          {/* CENTRAL 2.5D ILLUSTRATED BOP SURVEILLANCE STAGE */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            {/* Ambient Terrain Grid Canvas */}
            <div className="absolute inset-0 bg-[radial-gradient(#20242a_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

            {/* SVG Operational Theatre Map Layer */}
            <svg
              viewBox="0 0 1000 560"
              className="w-full h-full max-h-[72vh] object-contain transition-transform duration-700 ease-out"
            >
              <defs>
                {/* Sector linear gradient */}
                <linearGradient id="terrainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#111417" />
                  <stop offset="100%" stopColor="#0b0d0f" />
                </linearGradient>

                {/* Blind zone hatch pattern */}
                <pattern id="blindZoneHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#c93c3c" strokeWidth="2" opacity="0.6" />
                </pattern>

                {/* Camera coverage cone gradients */}
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

              {/* 1. Terrain & Elevation Topography */}
              <rect x="20" y="20" width="960" height="520" rx="8" fill="url(#terrainGrad)" stroke="#20242a" strokeWidth="1.5" />

              {/* Contour Elevation Curves */}
              <path d="M 60 140 Q 280 180 500 130 T 940 160" fill="none" stroke="#1c2026" strokeWidth="1.5" />
              <path d="M 60 260 Q 320 220 540 280 T 940 240" fill="none" stroke="#1c2026" strokeWidth="1.5" />
              <path d="M 60 380 Q 260 420 580 360 T 940 400" fill="none" stroke="#1c2026" strokeWidth="1.5" />

              {/* 2. Perimeter Service Road */}
              <path d="M 40 460 L 960 460" stroke="#252a32" strokeWidth="18" strokeLinecap="round" />
              <path d="M 40 460 L 960 460" stroke="#353b45" strokeWidth="1.5" strokeDasharray="8 8" />

              {/* 3. Physical Linear Border Fence Alpha */}
              <path d="M 80 170 L 920 170" stroke="#30353b" strokeWidth="4" />
              {/* Barbed wire posts */}
              {Array.from({ length: 22 }).map((_, i) => (
                <line key={i} x1={90 + i * 38} y1="162" x2={90 + i * 38} y2="178" stroke="#4a525d" strokeWidth="1.5" />
              ))}

              {/* 4. Virtual Fence Sensor Tripwire */}
              <path
                d="M 80 140 L 920 140"
                stroke={currentScene >= 6 ? '#c93c3c' : '#477da8'}
                strokeWidth={currentScene >= 6 ? '2.5' : '1.5'}
                strokeDasharray="6 4"
                className={currentScene >= 6 ? 'animate-pulse' : ''}
              />
              <text x="90" y="132" fill={currentScene >= 6 ? '#c93c3c' : '#477da8'} fontSize="9" fontWeight="bold">
                VIRTUAL FENCE LINE ALPHA &bull; BUFFER TRIPWIRE (2.8 KM)
              </text>

              {/* 5. BOP-17 Headquarters Outpost Complex */}
              <rect x="740" y="340" width="160" height="90" rx="4" fill="#181b1f" stroke="#30353b" strokeWidth="1.5" />
              <text x="755" y="365" fill="#e5e7eb" fontSize="12" fontWeight="bold">BOP-17 COMMAND</text>
              <text x="755" y="385" fill="#8d949d" fontSize="9">SECTOR 17 EDGE CLUSTER</text>
              <circle cx="875" cy="365" r="4" fill="#3f8f68" className="animate-ping" />

              {/* Watch Tower Structure */}
              <rect x="420" y="320" width="40" height="40" fill="#1e2228" stroke="#30353b" strokeWidth="1.5" />
              <text x="410" y="375" fill="#8d949d" fontSize="9">WATCH TOWER 01</text>

              {/* 6. Active Camera Field-of-View (FOV) Cones */}
              {/* CAM-03 Coverage Cone */}
              {currentScene >= 2 && currentScene < 7 && (
                <path d="M 180 280 L 100 120 L 260 120 Z" fill="url(#coverageNominal)" stroke="#3f8f68" strokeWidth="1" opacity="0.8" />
              )}

              {/* CAM-03 BLIND ZONE (appears when CAM-03 fails) */}
              {currentScene >= 7 && (
                <path d="M 180 280 L 100 120 L 260 120 Z" fill="url(#blindZoneHatch)" stroke="#c93c3c" strokeWidth="1.5" />
              )}

              {/* CAM-04 Coverage Cone (expands / activates on handoff) */}
              {currentScene >= 2 && (
                <path
                  d="M 440 280 L 320 120 L 560 120 Z"
                  fill={currentScene >= 10 ? 'url(#coverageElevated)' : 'url(#coverageNominal)'}
                  stroke={currentScene >= 10 ? '#477da8' : '#3f8f68'}
                  strokeWidth={currentScene >= 10 ? '2' : '1'}
                  opacity={currentScene >= 10 ? 0.9 : 0.6}
                />
              )}

              {/* CAM-TOWER-01 Backup PTZ Slewed Cone (SHIELD restoration) */}
              {currentScene >= 8 && (
                <path d="M 440 320 L 160 150 L 320 150 Z" fill="url(#coverageElevated)" stroke="#477da8" strokeWidth="1.5" strokeDasharray="4 2" />
              )}

              {/* CAM-06 Downstream Predicted Coverage Cone */}
              {currentScene >= 2 && (
                <path
                  d="M 700 280 L 560 130 L 840 130 Z"
                  fill={currentScene >= 12 ? 'url(#coverageWarning)' : 'url(#coverageNominal)'}
                  stroke={currentScene >= 12 ? '#c28a28' : '#3f8f68'}
                  strokeWidth="1"
                  opacity={currentScene >= 12 ? 0.8 : 0.4}
                />
              )}

              {/* 7. Camera Node Markers */}
              {/* CAM-03 */}
              <g transform="translate(180, 280)">
                <circle r="8" fill={currentScene >= 7 ? '#c93c3c' : '#181b1f'} stroke={currentScene >= 7 ? '#ffffff' : '#3f8f68'} strokeWidth="2" />
                <text x="12" y="4" fill={currentScene >= 7 ? '#c93c3c' : '#e5e7eb'} fontSize="10" fontWeight="bold">
                  CAM-03 {currentScene >= 7 ? '(OFFLINE)' : ''}
                </text>
              </g>

              {/* CAM-04 */}
              <g transform="translate(440, 280)">
                <circle r="8" fill="#181b1f" stroke={currentScene >= 10 ? '#477da8' : '#3f8f68'} strokeWidth={currentScene >= 10 ? '3' : '2'} />
                <text x="12" y="4" fill="#e5e7eb" fontSize="10" fontWeight="bold">
                  CAM-04 {currentScene >= 10 ? '(HIGH PRIORITY)' : ''}
                </text>
              </g>

              {/* CAM-06 */}
              <g transform="translate(700, 280)">
                <circle r="8" fill="#181b1f" stroke={currentScene >= 12 ? '#c28a28' : '#3f8f68'} strokeWidth={currentScene >= 12 ? '2.5' : '1.5'} />
                <text x="12" y="4" fill="#e5e7eb" fontSize="10" fontWeight="bold">
                  CAM-06 {currentScene >= 12 ? '(PREDICTED INTERCEPT)' : ''}
                </text>
              </g>

              {/* 8. Moving Target T-104 & Trajectory Vector */}
              {currentScene >= 5 && (
                <>
                  {/* Trajectory line from origin */}
                  <path
                    d={`M 140 210 Q 220 190 ${targetX} ${targetY}`}
                    fill="none"
                    stroke="#c93c3c"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Predicted forward intercept path */}
                  {currentScene >= 12 && (
                    <path
                      d={`M ${targetX} ${targetY} Q 540 260 680 270`}
                      fill="none"
                      stroke="#477da8"
                      strokeWidth="2"
                      strokeDasharray="6 3"
                    />
                  )}

                  {/* Target Crosshair Marker */}
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

              {/* 9. Dynamic System Callout Badges */}
              {/* Blind Zone Alert */}
              {currentScene >= 7 && currentScene < 10 && (
                <g transform="translate(140, 90)">
                  <rect width="180" height="34" rx="4" fill="#14171a" stroke="#c93c3c" strokeWidth="1.5" />
                  <text x="12" y="16" fill="#c93c3c" fontSize="10" fontWeight="bold">PERIMETER BLIND ZONE</text>
                  <text x="12" y="28" fill="#8d949d" fontSize="9">32% Coverage Lost on CAM-03</text>
                </g>
              )}

              {/* SHIELD Restoration Banner */}
              {currentScene >= 10 && currentScene < 12 && (
                <g transform="translate(360, 90)">
                  <rect width="210" height="34" rx="4" fill="#14171a" stroke="#3f8f68" strokeWidth="1.5" />
                  <text x="12" y="16" fill="#3f8f68" fontSize="10" fontWeight="bold">SHIELD: COVERAGE RESTORED</text>
                  <text x="12" y="28" fill="#8d949d" fontSize="9">CAM-TOWER-01 Slewed +32°</text>
                </g>
              )}

              {/* SWAN Handoff Banner */}
              {currentScene >= 13 && currentScene < 16 && (
                <g transform="translate(480, 90)">
                  <rect width="220" height="34" rx="4" fill="#14171a" stroke="#477da8" strokeWidth="1.5" />
                  <text x="12" y="16" fill="#477da8" fontSize="10" fontWeight="bold">SWAN: CORRIDOR HANDOFF</text>
                  <text x="12" y="28" fill="#8d949d" fontSize="9">CAM-04 Confirms &bull; CAM-06 Next</text>
                </g>
              )}
            </svg>
          </div>

          {/* Picture-in-Picture Tactical Feed Overlay */}
          <div className="absolute bottom-16 right-4 z-20 w-64 md:w-72 bg-[#14171a]/95 border border-[#30353b] rounded overflow-hidden shadow-2xl backdrop-blur hidden sm:block">
            <div className="p-1.5 bg-[#181b1f] border-b border-[#30353b] flex items-center justify-between text-[10px]">
              <span className="font-bold text-[#e5e7eb] flex items-center gap-1">
                <Video className="w-3 h-3 text-[#477da8]" />
                <span>
                  {currentScene <= 6 ? 'LIVE: CAM-03 (THERMAL)' : currentScene <= 10 ? 'FAULT: CAM-03' : 'HANDOFF: CAM-04 (OPTICAL)'}
                </span>
              </span>
              <span className={`px-1 rounded text-[9px] font-bold ${
                currentScene >= 7 && currentScene <= 9 ? 'bg-[#c93c3c] text-white' : 'bg-[#3f8f68]/20 text-[#3f8f68]'
              }`}>
                {currentScene >= 7 && currentScene <= 9 ? 'OFFLINE' : 'LIVE'}
              </span>
            </div>
            <div className="h-36 relative">
              {currentScene >= 7 && currentScene <= 9 ? (
                <div className="h-full w-full bg-[#181b1f] flex flex-col items-center justify-center space-y-1 text-center p-3">
                  <EyeOff className="w-6 h-6 text-[#c93c3c] animate-pulse" />
                  <span className="text-[10px] font-bold text-[#c93c3c]">HEARTBEAT TIMEOUT &gt; 3.0s</span>
                  <span className="text-[9px] text-[#8d949d]">SHIELD Slew in progress...</span>
                </div>
              ) : currentScene >= 10 ? (
                <CameraFeed camera={cam4} showControls={false} />
              ) : (
                <CameraFeed camera={cam3} showControls={false} />
              )}
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
