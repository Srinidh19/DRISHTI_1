import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Radio,
  Eye,
  Shield,
  ShieldAlert,
  ArrowRight,
  Zap,
  CheckCircle2,
  Server,
  Lock,
  Compass,
  AlertTriangle,
  Play,
  RotateCcw,
  Activity,
  Layers,
  ChevronDown,
  ExternalLink,
  Video,
  EyeOff
} from 'lucide-react';
import { CameraFeed } from '../components/video/CameraFeed';
import { useRealtime } from '../context/RealtimeContext';

export const DrishtiPublicLanding: React.FC = () => {
  const { cameras } = useRealtime();
  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const cam3 = cameras.find(c => c.id === 'CAM-03') || cameras[2];
  const cam4 = cameras.find(c => c.id === 'CAM-04') || cameras[3];
  const cam6 = cameras.find(c => c.id === 'CAM-06') || cameras[5];
  const camTower = cameras.find(c => c.id === 'CAM-TOWER-01') || cameras[8];

  // Auto-progress simulation scenes every 5 seconds if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentScene(prev => (prev >= 19 ? 1 : prev + 1));
    }, 5500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const sceneTitles = [
    '01. Arrival at BOP-17',
    '02. Sensor Perimeter Online',
    '03. Ruggedized Edge Node',
    '04. Normal Surveillance Grid',
    '05. First Breach Detected (T-104)',
    '06. Sensor Sabotage (CAM-03 Loss)',
    '07. SHIELD Fault Classification',
    '08. Autonomous PTZ Healing',
    '09. SWAN Distributed Fusion',
    '10. Neighbor Camera Prioritization',
    '11. Seamless Vector Handoff',
    '12. Multi-Sensor Confirmation',
    '13. Multi-Signal Threat Fusion',
    '14. Consolidated Incident Created',
    '15. SHA-256 Chain of Custody',
    '16. Secure Sector Relay',
    '17. Human Operator Doctrine',
    '18. Multi-BOP Scalable Network',
    '19. Deployment Architecture'
  ];

  return (
    <div className="min-h-screen w-full bg-[#0d0f11] text-[#e5e7eb] font-mono select-none flex flex-col antialiased">
      {/* Tactical Top Bar */}
      <header className="sticky top-0 z-50 h-14 bg-[#14171a]/95 backdrop-blur border-b border-[#30353b] px-4 md:px-8 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#181b1f] border border-[#30353b] flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#477da8]" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm text-[#e5e7eb]">DRISHTI</span>
            <span className="text-[10px] text-[#8d949d] ml-2 hidden sm:inline">BORDER C4I OPERATIONAL SIMULATION</span>
          </div>
        </div>

        {/* Scene Quick Switcher */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-[#8d949d]">
          <span className="text-[#3f8f68] font-bold">SCENE {currentScene.toString().padStart(2, '0')}/19:</span>
          <span className="text-[#e5e7eb] font-semibold">{sceneTitles[currentScene - 1]}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] text-xs flex items-center gap-1.5 transition-colors"
          >
            {isPlaying ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-pulse" />
                <span>AUTO-PLAY ON</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#c28a28]" />
                <span>PAUSED</span>
              </>
            )}
          </button>

          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold transition-colors flex items-center gap-1.5 text-xs"
          >
            <span>ENTER COMMAND</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Interactive Simulation Canvas */}
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 md:p-6 gap-4">
        {/* Story Scrubber Bar */}
        <div className="bg-[#14171a] border border-[#30353b] rounded p-2.5 flex items-center justify-between overflow-x-auto gap-1 text-[10px]">
          {sceneTitles.map((title, idx) => {
            const stepNum = idx + 1;
            const isActive = currentScene === stepNum;
            return (
              <button
                key={idx}
                onClick={() => {
                  setCurrentScene(stepNum);
                  setIsPlaying(false);
                }}
                className={`px-2 py-1 rounded whitespace-nowrap transition-colors flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#477da8] text-white font-bold'
                    : 'text-[#8d949d] hover:bg-[#20242a] hover:text-[#e5e7eb]'
                }`}
              >
                <span>{stepNum.toString().padStart(2, '0')}</span>
              </button>
            );
          })}
        </div>

        {/* Cinematic Operational Theatre */}
        <div className="flex-1 bg-[#14171a] border border-[#30353b] rounded flex flex-col overflow-hidden min-h-[520px]">
          {/* Top Scene Sub-Header */}
          <div className="h-10 bg-[#181b1f] border-b border-[#30353b] px-4 flex items-center justify-between text-xs text-[#8d949d]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#477da8]" />
              <span className="font-bold text-[#e5e7eb]">SECTOR 17 SIMULATION STAGE:</span>
              <span className="text-[#477da8]">{sceneTitles[currentScene - 1]}</span>
            </div>
            <div className="text-[10px]">
              TACTICAL TIMECODE: <span className="text-[#e5e7eb]">16:48:{(12 + currentScene).toString().padStart(2, '0')} IST</span>
            </div>
          </div>

          {/* Dynamic Scene Body */}
          <div className="flex-1 p-6 flex flex-col justify-center items-center relative overflow-hidden">
            {/* Subtle Grid & Topographic Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#30353b15_1px,transparent_1px),linear-gradient(to_bottom,#30353b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />

            {/* SCENE 01: ARRIVAL AT BOP-17 */}
            {currentScene === 1 && (
              <div className="text-center space-y-6 max-w-2xl relative z-10 animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-xs text-[#8d949d]">
                  <Compass className="w-3.5 h-3.5 text-[#3f8f68]" />
                  <span>32.7325° N, 74.8645° E &bull; ELEVATION 412M</span>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-[#8d949d] tracking-widest uppercase">NORTH SECTOR FRONTIER</div>
                  <h1 className="text-3xl sm:text-5xl font-extrabold text-[#e5e7eb] tracking-tight">
                    BORDER OUTPOST 17
                  </h1>
                </div>
                <p className="text-sm text-[#8d949d] leading-relaxed">
                  One border outpost. Multiple sensors. 2.8 kilometers of undulating terrain, scrub gullies, and virtual fence lines. One unified edge intelligence layer.
                </p>
                <div className="pt-4 flex justify-center gap-3 text-xs">
                  <span className="px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-[#8d949d]">Linear Fence: 2,800m</span>
                  <span className="px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-[#8d949d]">Watch Towers: 2</span>
                  <span className="px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-[#8d949d]">CCTV Nodes: 7</span>
                </div>
              </div>
            )}

            {/* SCENE 02: CAMERA NETWORK COMES ONLINE */}
            {currentScene === 2 && (
              <div className="w-full max-w-4xl space-y-6 relative z-10 animate-fadeIn">
                <div className="text-center space-y-1">
                  <div className="text-xs text-[#477da8]">TOPOLOGICAL REGISTRY</div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">PERIMETER SENSOR NODES ONLINE</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {[
                    { id: 'CAM-03', type: 'FIXED IR / THERMAL', role: 'North Fence Alpha', status: 'ONLINE' },
                    { id: 'CAM-04', type: 'PTZ OPTICAL DOME', role: 'Ridge Junction', status: 'ONLINE' },
                    { id: 'CAM-06', type: 'FIXED CCTV', role: 'Gully Bravo Approach', status: 'ONLINE' },
                    { id: 'CAM-07', type: 'THERMAL BARRIER', role: 'Sector Boundary East', status: 'ONLINE' },
                    { id: 'CAM-11', type: 'OPTICAL PANORAMA', role: 'Buffer Zone West', status: 'ONLINE' },
                    { id: 'CAM-TOWER-01', type: 'HIGH-TILT PTZ', role: 'Elevated Mast 30m', status: 'ONLINE' },
                    { id: 'CAM-ROAD-05', type: 'ANPR / ROADWAY', role: 'Patrol Track Access', status: 'ONLINE' },
                    { id: 'EDGE-BOP-17', type: 'RUGGEDIZED NODE', role: 'Inference Gateway', status: 'PRIMARY' }
                  ].map((node, i) => (
                    <div key={i} className="p-3 rounded bg-[#181b1f] border border-[#30353b] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#e5e7eb]">{node.id}</span>
                        <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-ping" />
                      </div>
                      <div className="text-[10px] text-[#477da8]">{node.type}</div>
                      <div className="text-[10px] text-[#8d949d] truncate">{node.role}</div>
                    </div>
                  ))}
                </div>

                <div className="text-center text-xs text-[#8d949d]">
                  Communication: <strong className="text-[#e5e7eb]">RTSP &bull; ONVIF Profile S/G/T &bull; 100ms Edge Heartbeat</strong>
                </div>
              </div>
            )}

            {/* SCENE 03: RUGGEDIZED EDGE NODE */}
            {currentScene === 3 && (
              <div className="w-full max-w-3xl space-y-6 relative z-10 animate-fadeIn">
                <div className="text-center space-y-1">
                  <div className="text-xs text-[#3f8f68]">LOCAL EDGE COMPUTATION</div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">INSIDE THE BOP-17 EDGE APPLIANCE</h2>
                  <p className="text-xs text-[#8d949d]">Zero reliance on internet or central cloud connectivity.</p>
                </div>

                <div className="p-5 rounded bg-[#181b1f] border border-[#30353b] space-y-4">
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                      <div className="text-[10px] text-[#8d949d]">INPUT</div>
                      <div className="font-bold text-[#e5e7eb] mt-1">RTSP Video</div>
                      <div className="text-[10px] text-[#3f8f68]">24 FPS &times; 7</div>
                    </div>
                    <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                      <div className="text-[10px] text-[#8d949d]">INFERENCE</div>
                      <div className="font-bold text-[#e5e7eb] mt-1">YOLOv8 RT</div>
                      <div className="text-[10px] text-[#477da8]">14ms TensorRT</div>
                    </div>
                    <div className="p-2 rounded bg-[#20242a] border border-[#30353b]">
                      <div className="text-[10px] text-[#8d949d]">TRACKING</div>
                      <div className="font-bold text-[#e5e7eb] mt-1">ByteTrack</div>
                      <div className="text-[10px] text-[#8d949d]">Re-ID Embed</div>
                    </div>
                    <div className="p-2 rounded bg-[#20242a] border border-[#477da8]/40">
                      <div className="text-[10px] text-[#477da8]">SWAN</div>
                      <div className="font-bold text-[#e5e7eb] mt-1">Handoff Bus</div>
                      <div className="text-[10px] text-[#477da8]">Multi-Camera</div>
                    </div>
                    <div className="p-2 rounded bg-[#20242a] border border-[#3f8f68]/40">
                      <div className="text-[10px] text-[#3f8f68]">SHIELD</div>
                      <div className="font-bold text-[#e5e7eb] mt-1">Healing Loop</div>
                      <div className="text-[10px] text-[#3f8f68]">PTZ Recovery</div>
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#20242a] border border-[#30353b] text-xs text-[#8d949d] leading-relaxed">
                    The intelligence happens directly at the outpost. Raw video never leaves the border fence without verified operator escalation.
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 04: NORMAL SURVEILLANCE GRID */}
            {currentScene === 4 && (
              <div className="w-full max-w-4xl space-y-4 relative z-10 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8d949d]">NORMAL PERIMETER SURVEILLANCE</span>
                  <span className="text-[#3f8f68] font-bold">&bull; ALL SENSORS NOMINAL</span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="h-36"><CameraFeed camera={cam3} showControls={false} /></div>
                  <div className="h-36"><CameraFeed camera={cam4} showControls={false} /></div>
                  <div className="h-36"><CameraFeed camera={cam6} showControls={false} /></div>
                  <div className="h-36"><CameraFeed camera={camTower} showControls={false} /></div>
                </div>

                <div className="text-center text-xs text-[#8d949d]">
                  Optical and thermal cross-monitoring active. Zero perimeter boundary violations.
                </div>
              </div>
            )}

            {/* SCENE 05: FIRST THREAT DETECTION (T-104) */}
            {currentScene === 5 && (
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 animate-fadeIn">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#c93c3c]/20 border border-[#c93c3c]/40 text-[#c93c3c] text-xs font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>PERIMETER BREACH DETECTED</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">TARGET T-104 AT NORTH FENCE</h2>
                  <div className="space-y-2 text-xs text-[#8d949d]">
                    <div className="flex justify-between border-b border-[#30353b] pb-1">
                      <span>CLASSIFICATION:</span>
                      <strong className="text-[#e5e7eb]">Person (Infiltrator)</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#30353b] pb-1">
                      <span>CONFIDENCE:</span>
                      <strong className="text-[#3f8f68]">94.2%</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#30353b] pb-1">
                      <span>VELOCITY:</span>
                      <strong className="text-[#e5e7eb]">1.8 m/s (Heading 042°)</strong>
                    </div>
                    <div className="flex justify-between border-b border-[#30353b] pb-1">
                      <span>SENSOR ACQUISITION:</span>
                      <strong className="text-[#477da8]">CAM-03 (Thermal Band)</strong>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 h-64 border-2 border-[#c93c3c] rounded overflow-hidden">
                  <CameraFeed camera={cam3} showControls={false} />
                </div>
              </div>
            )}

            {/* SCENE 06: SENSOR SABOTAGE (CAM-03 LOSS) */}
            {currentScene === 6 && (
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 animate-fadeIn">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#c93c3c] text-white text-xs font-bold">
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>CRITICAL: HEARTBEAT TIMEOUT</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#c93c3c]">CAM-03 SIGNAL UNAVAILABLE</h2>
                  <p className="text-xs text-[#8d949d] leading-relaxed">
                    Physical tamper or spray detected on optical lens. The target was moving through Gully Bravo when the sensor dropped.
                  </p>
                  <div className="p-3 rounded bg-[#c93c3c]/10 border border-[#c93c3c]/30 text-xs text-[#c93c3c] font-bold">
                    THE SYSTEM RISKS LOSING VISUAL CONTACT WITH T-104.
                  </div>
                </div>

                <div className="md:col-span-6 h-64 border-2 border-[#c93c3c] rounded bg-[#181b1f] flex flex-col items-center justify-center space-y-2">
                  <EyeOff className="w-10 h-10 text-[#c93c3c] animate-pulse" />
                  <span className="text-xs font-bold text-[#c93c3c]">CAM-03 OFFLINE &bull; RESIDUAL BLIND ZONE 32%</span>
                </div>
              </div>
            )}

            {/* SCENE 07: SHIELD FAULT CLASSIFICATION */}
            {currentScene === 7 && (
              <div className="w-full max-w-3xl space-y-6 relative z-10 animate-fadeIn">
                <div className="text-center space-y-1">
                  <div className="text-xs text-[#3f8f68]">AUTONOMOUS FAULT ENGINE</div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">SHIELD IDENTIFIES & CLASSIFIES THE GAP</h2>
                </div>

                <div className="grid grid-cols-4 gap-3 text-center text-xs">
                  <div className="p-3 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="text-[10px] text-[#8d949d]">STEP 1</div>
                    <div className="font-bold text-[#e5e7eb] mt-1">HEARTBEAT LOST</div>
                    <div className="text-[10px] text-[#c93c3c] mt-1">&gt; 3.0s Timeout</div>
                  </div>
                  <div className="p-3 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="text-[10px] text-[#8d949d]">STEP 2</div>
                    <div className="font-bold text-[#e5e7eb] mt-1">FAULT CLASSIFIED</div>
                    <div className="text-[10px] text-[#c28a28] mt-1">Tamper / Block</div>
                  </div>
                  <div className="p-3 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="text-[10px] text-[#8d949d]">STEP 3</div>
                    <div className="font-bold text-[#e5e7eb] mt-1">BLIND ZONE EST.</div>
                    <div className="text-[10px] text-[#c93c3c] mt-1">-32% Gap</div>
                  </div>
                  <div className="p-3 rounded bg-[#181b1f] border border-[#477da8]">
                    <div className="text-[10px] text-[#477da8]">STEP 4</div>
                    <div className="font-bold text-[#477da8] mt-1">SEARCH BACKUP</div>
                    <div className="text-[10px] text-[#477da8] mt-1">Evaluating Nodes</div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#181b1f] border border-[#30353b] text-xs text-[#8d949d] text-center">
                  SHIELD does not freeze or report a passive error. It actively measures the geometric loss and calculates alternate camera overlap.
                </div>
              </div>
            )}

            {/* SCENE 08: AUTONOMOUS PTZ HEALING */}
            {currentScene === 8 && (
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 animate-fadeIn">
                <div className="md:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#3f8f68]/20 border border-[#3f8f68]/40 text-[#3f8f68] text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>COVERAGE RESTORED</span>
                  </div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">CAM-TOWER-01 SLEWED TO FENCE</h2>
                  <p className="text-xs text-[#8d949d] leading-relaxed">
                    Neighboring PTZ dome actuated +32° azimuth in 1.4 seconds. Residual blind zone reduced from 32% down to 11.6%.
                  </p>
                  <div className="p-3 rounded bg-[#3f8f68]/10 border border-[#3f8f68]/30 text-xs text-[#3f8f68]">
                    VISUAL CONTINUITY RESTORED ACROSS PERIMETER GAP.
                  </div>
                </div>

                <div className="md:col-span-6 h-64 border-2 border-[#3f8f68] rounded overflow-hidden">
                  <CameraFeed camera={camTower} showControls={false} />
                </div>
              </div>
            )}

            {/* SCENE 09: SWAN DISTRIBUTED FUSION */}
            {currentScene === 9 && (
              <div className="w-full max-w-3xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-xs text-[#477da8]">
                  <Zap className="w-3.5 h-3.5" />
                  <span>SWAN DISTRIBUTED CONSENSUS</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#e5e7eb]">
                  "ONE CAMERA SHOULD NEVER BE THE END OF A TRACK."
                </h2>
                <p className="text-sm text-[#8d949d] max-w-xl mx-auto leading-relaxed">
                  Traditional surveillance isolates feeds into silos. SWAN creates an edge-coordinated neural fabric across neighboring camera sensors.
                </p>
              </div>
            )}

            {/* SCENE 10: NEIGHBOR CAMERA PRIORITIZATION */}
            {currentScene === 10 && (
              <div className="w-full max-w-3xl space-y-6 relative z-10 animate-fadeIn">
                <div className="text-center space-y-1">
                  <div className="text-xs text-[#477da8]">INTELLIGENT FOCUS</div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">PREDICTIVE CORRIDOR TASKING</h2>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded bg-[#c93c3c]/10 border border-[#c93c3c]/40 text-center">
                    <div className="font-bold text-[#e5e7eb]">CAM-03</div>
                    <div className="text-[10px] text-[#c93c3c] mt-1">FAILED (LAST SEEN)</div>
                  </div>
                  <div className="p-3 rounded bg-[#3f8f68]/20 border-2 border-[#3f8f68] text-center">
                    <div className="font-bold text-[#3f8f68]">CAM-04</div>
                    <div className="text-[10px] text-[#3f8f68] mt-1">HIGH PRIORITY (SLEW)</div>
                  </div>
                  <div className="p-3 rounded bg-[#477da8]/20 border border-[#477da8]/50 text-center">
                    <div className="font-bold text-[#e5e7eb]">CAM-06</div>
                    <div className="text-[10px] text-[#477da8] mt-1">WATCH STANDBY</div>
                  </div>
                  <div className="p-3 rounded bg-[#20242a] border border-[#30353b] text-center opacity-60">
                    <div className="font-bold text-[#8d949d]">CAM-07</div>
                    <div className="text-[10px] text-[#8d949d] mt-1">NORMAL (OFF-CORRIDOR)</div>
                  </div>
                </div>

                <p className="text-xs text-[#8d949d] text-center leading-relaxed">
                  SWAN does not overwhelm operators by alerting on all 56 sector cameras. Only nodes intersecting the target's trajectory vector are elevated.
                </p>
              </div>
            )}

            {/* SCENE 11: SEAMLESS VECTOR HANDOFF */}
            {currentScene === 11 && (
              <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10 animate-fadeIn">
                <div className="md:col-span-6 space-y-4">
                  <div className="text-xs text-[#477da8] font-bold">CROSS-CAMERA CONTINUITY</div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">RE-ACQUIRED AS T-104</h2>
                  <p className="text-xs text-[#8d949d] leading-relaxed">
                    CAM-04 acquires the target within 1.2 seconds of watch request dispatch. Cosine feature embedding matches T-104 with 94.2% similarity.
                  </p>
                  <div className="p-3 rounded bg-[#20242a] border border-[#30353b] text-xs text-[#3f8f68]">
                    SAME PERSISTENT TRACK IDENTIFIER PRESERVED.
                  </div>
                </div>

                <div className="md:col-span-6 h-64 border-2 border-[#477da8] rounded overflow-hidden">
                  <CameraFeed camera={cam4} showControls={false} />
                </div>
              </div>
            )}

            {/* SCENE 12: MULTI-SENSOR CONFIRMATION */}
            {currentScene === 12 && (
              <div className="w-full max-w-3xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="text-xs text-[#3f8f68]">VERIFICATION MATRIX</div>
                <h2 className="text-2xl font-bold text-[#e5e7eb]">CONFIDENCE ELEVATES FROM 71% TO 92%</h2>

                <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="text-[10px] text-[#8d949d]">INITIAL DETECT (CAM-03)</div>
                    <div className="text-2xl font-bold text-[#c28a28] mt-1">71%</div>
                    <div className="text-[10px] text-[#8d949d] mt-1">Single Thermal Signal</div>
                  </div>
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="text-[10px] text-[#8d949d]">HANDOFF CONFIRM (CAM-04)</div>
                    <div className="text-2xl font-bold text-[#3f8f68] mt-1">92%</div>
                    <div className="text-[10px] text-[#3f8f68] mt-1">Dual Sensor Corroboration</div>
                  </div>
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="text-[10px] text-[#8d949d]">DOWNSTREAM INTERCEPT</div>
                    <div className="text-2xl font-bold text-[#477da8] mt-1">CAM-06</div>
                    <div className="text-[10px] text-[#8d949d] mt-1">Lead Time: 6.2s</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 13: MULTI-SIGNAL THREAT FUSION */}
            {currentScene === 13 && (
              <div className="w-full max-w-3xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="text-xs text-[#c93c3c]">OBJECTIVE RISK FORMULATION</div>
                <h2 className="text-2xl font-bold text-[#e5e7eb]">RISK FUSION ENGINE</h2>

                <div className="p-4 rounded bg-[#181b1f] border border-[#30353b] text-xs flex flex-wrap justify-center items-center gap-2">
                  <span className="px-2 py-1 bg-[#20242a] border border-[#30353b] rounded">PERSON CLASSIFICATION</span>
                  <span>+</span>
                  <span className="px-2 py-1 bg-[#20242a] border border-[#30353b] rounded">RESTRICTED BUFFER ZONE</span>
                  <span>+</span>
                  <span className="px-2 py-1 bg-[#20242a] border border-[#30353b] rounded">INWARD VELOCITY</span>
                  <span>+</span>
                  <span className="px-2 py-1 bg-[#20242a] border border-[#30353b] rounded">MULTI-CAM VERIFICATION</span>
                  <span>&rarr;</span>
                  <span className="px-3 py-1 bg-[#c93c3c]/20 border border-[#c93c3c] text-[#c93c3c] font-bold rounded">
                    SCORE: 92 / 100 (CRITICAL)
                  </span>
                </div>
              </div>
            )}

            {/* SCENE 14: CONSOLIDATED INCIDENT CREATED */}
            {currentScene === 14 && (
              <div className="w-full max-w-2xl p-6 rounded bg-[#181b1f] border border-[#c93c3c]/50 space-y-4 relative z-10 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-[#30353b] pb-3">
                  <div>
                    <span className="text-xs text-[#8d949d]">UNIFIED INCIDENT DOSSIER</span>
                    <h3 className="text-xl font-bold text-[#e5e7eb]">INC-2026-0142</h3>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#c93c3c] text-white text-xs font-bold">
                    CRITICAL BREACH
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] text-[#8d949d]">TARGET</div>
                    <div className="font-bold text-[#e5e7eb]">T-104</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8d949d]">SENSOR CHAIN</div>
                    <div className="font-bold text-[#477da8]">CAM-03 &rarr; CAM-04 &rarr; CAM-06</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#8d949d]">STATUS</div>
                    <div className="font-bold text-[#3f8f68]">CONFIRMED ESCALATION</div>
                  </div>
                </div>

                <div className="text-xs text-[#8d949d]">
                  Multiple camera observations collapse into ONE actionable mission incident. Zero alert fatigue.
                </div>
              </div>
            )}

            {/* SCENE 15: SHA-256 CHAIN OF CUSTODY */}
            {currentScene === 15 && (
              <div className="w-full max-w-2xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="text-xs text-[#477da8]">FORENSIC CRYPTOGRAPHY</div>
                <h2 className="text-2xl font-bold text-[#e5e7eb]">SHA-256 EVIDENCE REPOSITORY</h2>
                <div className="p-4 rounded bg-[#181b1f] border border-[#30353b] text-left text-xs space-y-2">
                  <div className="flex items-center justify-between text-[#3f8f68]">
                    <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5" /> CRYPTOGRAPHIC LOCK</span>
                    <span>VERIFIED</span>
                  </div>
                  <div className="text-[#8d949d] break-all font-mono text-[11px]">
                    SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                  </div>
                  <div className="text-[11px] text-[#8d949d] pt-2 border-t border-[#30353b]">
                    Contains: Still frame snapshot, H.264 12-second clip, GPS waypoints, telemetry logs, and operator timestamps. Court admissible.
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 16: SECURE SECTOR RELAY */}
            {currentScene === 16 && (
              <div className="w-full max-w-3xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="text-xs text-[#477da8]">HIGH-ASSURANCE RELAY</div>
                <h2 className="text-2xl font-bold text-[#e5e7eb]">FROM THE BORDER FENCE TO COMMAND</h2>

                <div className="flex items-center justify-center gap-4 text-xs">
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="font-bold text-[#e5e7eb]">BOP-17 EDGE</div>
                    <div className="text-[10px] text-[#3f8f68]">Processed Locally</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#477da8]" />
                  <div className="p-4 rounded bg-[#181b1f] border border-[#477da8]">
                    <div className="font-bold text-[#e5e7eb]">SECURE MESH / FIBER</div>
                    <div className="text-[10px] text-[#477da8]">TLS 1.3 Encrypted</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#477da8]" />
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="font-bold text-[#e5e7eb]">HQ COMMAND CONSOLE</div>
                    <div className="text-[10px] text-[#e5e7eb]">Real-Time GIS</div>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 17: HUMAN OPERATOR DOCTRINE */}
            {currentScene === 17 && (
              <div className="w-full max-w-2xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-xs text-[#3f8f68]">
                  <Lock className="w-3.5 h-3.5" />
                  <span>OPERATIONAL ETHICS & DOCTRINE</span>
                </div>
                <h2 className="text-3xl font-extrabold text-[#e5e7eb]">
                  DETECTION IS AUTOMATED.<br />DECISION REMAINS HUMAN.
                </h2>
                <p className="text-sm text-[#8d949d] leading-relaxed">
                  DRISHTI detects. SWAN correlates across sensors. SHIELD preserves perimeter coverage. But only the human operator verifies the evidence, escalates the alert, and authorizes tactical response.
                </p>
              </div>
            )}

            {/* SCENE 18: MULTI-BOP SCALABLE NETWORK */}
            {currentScene === 18 && (
              <div className="w-full max-w-3xl space-y-6 text-center relative z-10 animate-fadeIn">
                <div className="text-xs text-[#477da8]">SECTOR ARCHITECTURE</div>
                <h2 className="text-2xl font-bold text-[#e5e7eb]">MULTI-BOP FEDERATED SURVEILLANCE</h2>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="font-bold text-[#e5e7eb]">BOP-17 (ACTIVE)</div>
                    <div className="text-[10px] text-[#3f8f68]">7 Cameras &bull; Online</div>
                  </div>
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="font-bold text-[#e5e7eb]">BOP-18</div>
                    <div className="text-[10px] text-[#8d949d]">12 Cameras &bull; Standby</div>
                  </div>
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b]">
                    <div className="font-bold text-[#e5e7eb]">BOP-19</div>
                    <div className="text-[10px] text-[#8d949d]">9 Cameras &bull; Standby</div>
                  </div>
                </div>

                <p className="text-xs text-[#8d949d]">
                  Scales across thousands of kilometers of border outposts without architectural bottlenecks.
                </p>
              </div>
            )}

            {/* SCENE 19: DEPLOYMENT ARCHITECTURE */}
            {currentScene === 19 && (
              <div className="w-full max-w-4xl space-y-6 relative z-10 animate-fadeIn">
                <div className="text-center space-y-1">
                  <div className="text-xs text-[#3f8f68]">DEPLOYMENT MATRIX</div>
                  <h2 className="text-2xl font-bold text-[#e5e7eb]">READY FROM PROTOTYPE TO FRONTIER</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b] space-y-2">
                    <div className="text-[10px] text-[#8d949d]">TIER 1 / EVALUATION</div>
                    <div className="font-bold text-[#e5e7eb]">Local Simulation</div>
                    <p className="text-[11px] text-[#8d949d]">
                      Runs on a GPU workstation using internal simulated video buses.
                    </p>
                    <div className="text-[10px] text-[#3f8f68]">&bull; Ready immediately via npm run dev</div>
                  </div>
                  <div className="p-4 rounded bg-[#181b1f] border border-[#477da8] space-y-2">
                    <div className="text-[10px] text-[#477da8]">TIER 2 / FIELD PILOT</div>
                    <div className="font-bold text-[#e5e7eb]">Ruggedized BOP Edge</div>
                    <p className="text-[11px] text-[#8d949d]">
                      Air-gapped industrial server interfacing with physical ONVIF cameras and PTZ motors.
                    </p>
                    <div className="text-[10px] text-[#477da8]">&bull; Zero Internet required</div>
                  </div>
                  <div className="p-4 rounded bg-[#181b1f] border border-[#30353b] space-y-2">
                    <div className="text-[10px] text-[#8d949d]">TIER 3 / ENTERPRISE</div>
                    <div className="font-bold text-[#e5e7eb]">Sector Command Cluster</div>
                    <p className="text-[11px] text-[#8d949d]">
                      Federated high-availability Kubernetes cluster for multi-outpost surveillance operations.
                    </p>
                    <div className="text-[10px] text-[#8d949d]">&bull; PostGIS &bull; TimescaleDB &bull; Redis</div>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <Link
                    to="/login"
                    className="px-6 py-3 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold transition-colors flex items-center gap-2 text-xs"
                  >
                    <span>INITIALIZE DRISHTI CONSOLE SESSION</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Simulation Controller */}
          <div className="h-14 bg-[#181b1f] border-t border-[#30353b] px-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentScene(prev => (prev > 1 ? prev - 1 : 19));
                  setIsPlaying(false);
                }}
                className="px-3 py-1.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] transition-colors"
              >
                &larr; PREVIOUS
              </button>
              <button
                onClick={() => {
                  setCurrentScene(prev => (prev < 19 ? prev + 1 : 1));
                  setIsPlaying(false);
                }}
                className="px-3 py-1.5 rounded bg-[#20242a] border border-[#30353b] text-[#8d949d] hover:text-[#e5e7eb] transition-colors"
              >
                NEXT &rarr;
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-[#8d949d] text-[11px]">
              <span>ENTITY: <strong className="text-[#e5e7eb]">BOP-17 / T-104 / CAM-03</strong></span>
              <span>&bull;</span>
              <span>ENGINE: <strong className="text-[#3f8f68]">SWAN + SHIELD</strong></span>
            </div>

            <Link
              to="/app/command"
              className="px-4 py-1.5 rounded bg-[#20242a] hover:bg-[#30353b] border border-[#30353b] text-[#e5e7eb] font-semibold transition-colors flex items-center gap-1.5"
            >
              <span>LIVE DEMO</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#477da8]" />
            </Link>
          </div>
        </div>
      </main>

      {/* Tactical Footer */}
      <footer className="border-t border-[#30353b] bg-[#14171a] px-6 py-4 text-[11px] text-[#8d949d] flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          DRISHTI &bull; Intelligent Border Video Analytics Platform &copy; 2026. Official BSF / Ministry of Home Affairs Protocol.
        </div>
        <div className="flex items-center gap-4">
          <Link to="/app/command" className="hover:text-[#e5e7eb]">Command Map</Link>
          <Link to="/app/swan/overview" className="hover:text-[#e5e7eb]">SWAN Network</Link>
          <Link to="/app/shield/overview" className="hover:text-[#e5e7eb]">SHIELD Healing</Link>
          <Link to="/login" className="hover:text-[#e5e7eb]">Terminal Login</Link>
        </div>
      </footer>
    </div>
  );
};
export default DrishtiPublicLanding;
