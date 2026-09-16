import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Radio,
  Eye,
  Activity,
  Layers,
  ArrowRight,
  Zap,
  Lock,
  Compass,
  CheckCircle2,
  Server,
  Cpu,
  Database,
  Crosshair,
  ChevronDown,
  Terminal,
  ExternalLink
} from 'lucide-react';

export const DrishtiPublicLanding: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle SWAN correlation demo step
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 6);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const swanSteps = [
    { step: '01', source: 'CAM-03', title: 'Target Detection', desc: 'Thermal sensor detects target T-104 breaching North Fence Alpha at 1.8 m/s' },
    { step: '02', source: 'SWAN Engine', title: 'Adjacency Analysis', desc: 'Evaluates neighboring nodes CAM-04 (48m), CAM-06 (140m), CAM-07 (280m)' },
    { step: '03', source: 'CAM-04', title: 'Watch Request Dispatched', desc: 'Autonomous edge message commands CAM-04 PTZ slew to +28° azimuth' },
    { step: '04', source: 'CAM-04', title: 'Multi-Sensor Confirmation', desc: 'Target re-acquired with 94.2% cosine feature vector similarity' },
    { step: '05', source: 'Risk Fusion', title: 'Unified Threat Scoring', desc: 'Trajectory matched against Restricted Zone Bravo. Risk elevated to CRITICAL (92/100)' },
    { step: '06', source: 'CAM-06', title: 'Vector Prediction', desc: 'Downstream intercept predicted at Gully Bravo junction under CAM-06 coverage' }
  ];

  return (
    <div className="min-h-screen w-full bg-[#111315] text-[#e5e7eb] font-sans antialiased selection:bg-[#477da8]/30 selection:text-white flex flex-col">
      {/* Tactical Top Navigation Bar */}
      <header className="sticky top-0 z-50 h-14 bg-[#14171a]/95 backdrop-blur border-b border-[#30353b] px-6 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#181b1f] border border-[#30353b] flex items-center justify-center">
            <Radio className="w-4 h-4 text-[#477da8]" />
          </div>
          <div>
            <span className="font-bold tracking-wider text-sm text-[#e5e7eb]">DRISHTI</span>
            <span className="text-[10px] text-[#8d949d] ml-2 hidden sm:inline">BORDER C4I DEFENSE PLATFORM</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-[#8d949d]">
          <a href="#platform" className="hover:text-[#e5e7eb] transition-colors">PLATFORM</a>
          <a href="#bop-architecture" className="hover:text-[#e5e7eb] transition-colors">BOP SYSTEM</a>
          <a href="#swan" className="hover:text-[#e5e7eb] transition-colors">SWAN NETWORK</a>
          <a href="#shield" className="hover:text-[#e5e7eb] transition-colors">SHIELD HEALING</a>
          <a href="#evidence" className="hover:text-[#e5e7eb] transition-colors">FORENSICS</a>
          <a href="#deployment" className="hover:text-[#e5e7eb] transition-colors">DEPLOYMENT</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-3.5 py-1.5 rounded bg-[#20242a] hover:bg-[#30353b] border border-[#30353b] text-[#e5e7eb] font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>CONSOLE LOGIN</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
          </Link>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-[88vh] flex flex-col justify-center px-6 md:px-16 border-b border-[#30353b] bg-radial-gradient overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#30353b15_1px,transparent_1px),linear-gradient(to_bottom,#30353b15_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

        <div className="relative max-w-4xl z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-xs font-mono text-[#8d949d]">
            <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-pulse" />
            <span>OPERATIONAL SECTOR: BOP-17 NORTH PERIMETER</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#e5e7eb] leading-[1.1]">
            INTELLIGENT BORDER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e5e7eb] via-[#8d949d] to-[#477da8]">
              SURVEILLANCE & RESPONSE
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#8d949d] font-sans max-w-2xl leading-relaxed">
            From distributed edge sensors to verified incidents. DRISHTI fuses edge optical and thermal feeds, autonomous multi-camera handoffs, and self-healing perimeter coverage into an operator-first command center.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 font-mono text-xs">
            <Link
              to="/app/command"
              className="px-5 py-3 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold tracking-wider transition-colors flex items-center gap-2"
            >
              <span>ENTER COMMAND CENTRE</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#bop-architecture"
              className="px-5 py-3 rounded bg-[#181b1f] hover:bg-[#20242a] border border-[#30353b] text-[#e5e7eb] font-semibold transition-colors"
            >
              EXPLORE THE SYSTEM
            </a>
          </div>

          {/* Restrained Telemetry Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl font-mono text-xs">
            <div className="p-3 rounded bg-[#181b1f]/90 border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">DETECTION PIPELINE</div>
              <div className="text-lg font-bold text-[#e5e7eb] mt-0.5">YOLO + ByteTrack</div>
              <div className="text-[10px] text-[#3f8f68]">24 FPS Real-Time</div>
            </div>
            <div className="p-3 rounded bg-[#181b1f]/90 border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">SWAN CORRELATION</div>
              <div className="text-lg font-bold text-[#e5e7eb] mt-0.5">38 ms Latency</div>
              <div className="text-[10px] text-[#3f8f68]">Zero Cloud Reliance</div>
            </div>
            <div className="p-3 rounded bg-[#181b1f]/90 border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">SHIELD RESTORATION</div>
              <div className="text-lg font-bold text-[#e5e7eb] mt-0.5">&lt; 1.5s Slew</div>
              <div className="text-[10px] text-[#477da8]">PTZ Gap Healing</div>
            </div>
            <div className="p-3 rounded bg-[#181b1f]/90 border border-[#30353b]">
              <div className="text-[10px] text-[#8d949d]">EVIDENCE REPOSITORY</div>
              <div className="text-lg font-bold text-[#e5e7eb] mt-0.5">SHA-256 Chain</div>
              <div className="text-[10px] text-[#8d949d]">Court Admissible</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: BOP STORY & DISTRIBUTED SYSTEM ARCHITECTURE */}
      <section id="bop-architecture" className="py-20 px-6 md:px-16 border-b border-[#30353b] bg-[#14171a]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#477da8] tracking-widest uppercase">Distributed Operational Reality</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e7eb]">
              A BORDER OUTPOST IS A DISTRIBUTED SYSTEM.
            </h2>
            <p className="text-sm sm:text-base text-[#8d949d] max-w-3xl leading-relaxed">
              Border security cannot depend on fragile high-bandwidth cloud uplinks. DRISHTI runs at the edge—processing raw sensor feeds locally, orchestrating distributed intelligence between nodes, and presenting verified situations to human operators.
            </p>
          </div>

          {/* 3-Tier Architecture Diagram */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
            {/* TIER 1: PERIMETER SENSORS */}
            <div className="p-5 rounded bg-[#181b1f] border border-[#30353b] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#477da8]">
                  <Eye className="w-4 h-4" />
                  <span className="font-bold tracking-wider uppercase">01 / SENSOR PERIMETER</span>
                </div>
                <h3 className="text-sm font-semibold text-[#e5e7eb]">IP Cameras & Thermal Nodes</h3>
                <p className="text-[#8d949d] font-sans text-xs leading-relaxed">
                  Fixed infrared barriers, PTZ domes, long-range thermal optics, and seismic tripwires distributed across 2.8 km linear border sectors.
                </p>
              </div>
              <div className="pt-3 border-t border-[#30353b] space-y-1 text-[11px] text-[#8d949d]">
                <div>&bull; Protocol: RTSP / ONVIF Profile S/G/T</div>
                <div>&bull; Spectrum: 8-14μm Thermal + 4K Optical</div>
                <div>&bull; Heartbeat: 100ms ICMP/RTSP Telemetry</div>
              </div>
            </div>

            {/* TIER 2: BOP EDGE CLUSTER */}
            <div className="p-5 rounded bg-[#181b1f] border border-[#477da8]/40 flex flex-col justify-between space-y-4 relative">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#3f8f68]">
                  <Server className="w-4 h-4" />
                  <span className="font-bold tracking-wider uppercase">02 / BOP EDGE NODE</span>
                </div>
                <h3 className="text-sm font-semibold text-[#e5e7eb]">Ruggedized Micro-Datacenter</h3>
                <p className="text-[#8d949d] font-sans text-xs leading-relaxed">
                  Local GPU worker executing real-time object detection, multi-target tracking, SWAN distributed consensus, and encrypted evidence caching.
                </p>
              </div>
              <div className="pt-3 border-t border-[#30353b] space-y-1 text-[11px] text-[#8d949d]">
                <div>&bull; Inference: YOLOv8 / RT-DETR TensorRT</div>
                <div>&bull; Tracker: ByteTrack + Re-ID Embedding</div>
                <div>&bull; Cache: Local SQLite / PostGIS Offline DB</div>
              </div>
            </div>

            {/* TIER 3: COMMAND CENTRE */}
            <div className="p-5 rounded bg-[#181b1f] border border-[#30353b] flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#c28a28]">
                  <Compass className="w-4 h-4" />
                  <span className="font-bold tracking-wider uppercase">03 / COMMAND CONSOLE</span>
                </div>
                <h3 className="text-sm font-semibold text-[#e5e7eb]">Operational Workstation</h3>
                <p className="text-[#8d949d] font-sans text-xs leading-relaxed">
                  Low-latency MapLibre GIS tactical map, prioritized live surveillance video wall, unified incident queue, and rapid triage controls.
                </p>
              </div>
              <div className="pt-3 border-t border-[#30353b] space-y-1 text-[11px] text-[#8d949d]">
                <div>&bull; Triage: CONFIRM / DISMISS / ESCALATE</div>
                <div>&bull; Audit: Cryptographic HMAC Signature</div>
                <div>&bull; UX: Zero Neon, Pure Tactical Dark</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SWAN DISTRIBUTED INTELLIGENCE & HANDOFF */}
      <section id="swan" className="py-20 px-6 md:px-16 border-b border-[#30353b] bg-[#111315]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#477da8] tracking-widest uppercase">SWAN Engine</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e7eb]">
              AUTONOMOUS CAMERA-TO-CAMERA COORDINATION.
            </h2>
            <p className="text-sm sm:text-base text-[#8d949d] max-w-3xl leading-relaxed">
              When an intruder breaches a perimeter fence, a single static camera quickly loses visual contact. SWAN (Sensor-Wide Autonomous Network) uses distributed vector prediction to proactively task neighboring cameras before the target disappears.
            </p>
          </div>

          {/* Interactive Step-by-step Story */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-mono text-xs">
            {/* Steps Navigation */}
            <div className="lg:col-span-5 space-y-2">
              {swanSteps.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3.5 rounded border cursor-pointer transition-colors ${
                    activeStep === idx
                      ? 'bg-[#20242a] border-[#477da8]'
                      : 'bg-[#181b1f] border-[#30353b] hover:bg-[#181b1f]/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#e5e7eb]">{s.step} &bull; {s.title}</span>
                    <span className="text-[10px] text-[#477da8]">{s.source}</span>
                  </div>
                  <div className="text-[11px] text-[#8d949d] font-sans line-clamp-2">
                    {s.desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Active Step Graphic Detail */}
            <div className="lg:col-span-7 p-6 rounded bg-[#181b1f] border border-[#30353b] flex flex-col justify-between min-h-[360px]">
              <div>
                <div className="flex items-center justify-between border-b border-[#30353b] pb-3 mb-4">
                  <span className="text-xs text-[#8d949d]">SWAN EXECUTION PIPELINE</span>
                  <span className="text-xs text-[#3f8f68] font-bold">STATE: ACTIVE HANDOFF</span>
                </div>
                <div className="text-lg font-bold text-[#e5e7eb] mb-2">
                  {swanSteps[activeStep].title}
                </div>
                <p className="text-sm text-[#8d949d] font-sans leading-relaxed mb-6">
                  {swanSteps[activeStep].desc}
                </p>

                <div className="p-4 rounded bg-[#20242a] border border-[#30353b] space-y-2">
                  <div className="text-[10px] text-[#8d949d] uppercase font-semibold">Sensor Relationship Vector</div>
                  <div className="flex items-center gap-2 text-sm text-[#e5e7eb]">
                    <span className="px-2 py-1 bg-[#181b1f] border border-[#30353b] rounded">CAM-03</span>
                    <ArrowRight className="w-4 h-4 text-[#477da8]" />
                    <span className="px-2 py-1 bg-[#477da8]/20 border border-[#477da8]/40 rounded font-bold text-[#477da8]">CAM-04 (SELECTED)</span>
                    <ArrowRight className="w-4 h-4 text-[#8d949d]" />
                    <span className="px-2 py-1 bg-[#181b1f] border border-[#30353b] rounded text-[#8d949d]">CAM-06 (PREDICTED)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#30353b] flex items-center justify-between text-[11px] text-[#8d949d]">
                <span>Correlated Incident: <strong className="text-[#c93c3c]">INC-2026-0142</strong></span>
                <Link to="/app/swan/overview" className="text-[#477da8] hover:underline flex items-center gap-1">
                  <span>Open SWAN Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SHIELD SELF-HEALING PERIMETER */}
      <section id="shield" className="py-20 px-6 md:px-16 border-b border-[#30353b] bg-[#14171a]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#3f8f68] tracking-widest uppercase">SHIELD Engine</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e7eb]">
              AUTOMATIC PERIMETER RECOVERY & BLIND-ZONE HEALING.
            </h2>
            <p className="text-sm sm:text-base text-[#8d949d] max-w-3xl leading-relaxed">
              Adversaries sabotage cameras, cut cables, or spray lenses before an infiltration. SHIELD detects heartbeat dropouts in under 3 seconds, classifies the fault, calculates the residual blind zone, and slews neighboring PTZ cameras to heal the coverage gap.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-4 rounded bg-[#181b1f] border border-[#30353b] space-y-2">
              <div className="text-[#c93c3c] font-bold">01 / DETECTION</div>
              <div className="text-sm font-semibold text-[#e5e7eb]">Heartbeat Timeout</div>
              <p className="text-[#8d949d] font-sans text-xs">
                RTSP stream degradation and ICMP drop logged at CAM-03. Fault classified as physical tamper.
              </p>
            </div>
            <div className="p-4 rounded bg-[#181b1f] border border-[#30353b] space-y-2">
              <div className="text-[#c28a28] font-bold">02 / ESTIMATION</div>
              <div className="text-sm font-semibold text-[#e5e7eb]">Blind Zone Mapping</div>
              <p className="text-[#8d949d] font-sans text-xs">
                Calculates geometric field-of-view loss. 32% perimeter gap identified along Ridge Alpha.
              </p>
            </div>
            <div className="p-4 rounded bg-[#181b1f] border border-[#477da8] space-y-2">
              <div className="text-[#477da8] font-bold">03 / SLEW DISPATCH</div>
              <div className="text-sm font-semibold text-[#e5e7eb]">PTZ Repositioning</div>
              <p className="text-[#8d949d] font-sans text-xs">
                CAM-TOWER-01 commanded to +32° azimuth to overlap blind zone, restoring 88% perimeter coverage.
              </p>
            </div>
            <div className="p-4 rounded bg-[#181b1f] border border-[#3f8f68] space-y-2">
              <div className="text-[#3f8f68] font-bold">04 / DISPATCH</div>
              <div className="text-sm font-semibold text-[#e5e7eb]">Field Maintenance</div>
              <p className="text-[#8d949d] font-sans text-xs">
                Automated maintenance ticket FLT-2026-081 queued for tactical field patrol inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: HUMAN DOCTRINE */}
      <section className="py-16 px-6 md:px-16 border-b border-[#30353b] bg-[#111315]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#181b1f] border border-[#30353b] text-xs font-mono text-[#8d949d]">
            <Lock className="w-3.5 h-3.5 text-[#3f8f68]" />
            <span>OPERATIONAL ETHICS & DOCTRINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#e5e7eb]">
            DETECTION IS AUTOMATED. DECISION REMAINS HUMAN.
          </h2>
          <p className="text-sm sm:text-base text-[#8d949d] font-sans max-w-2xl mx-auto leading-relaxed">
            DRISHTI detects. SWAN correlates across sensors. SHIELD preserves perimeter coverage. But only the human operator verifies the evidence, escalates the alert, and authorizes tactical response.
          </p>
        </div>
      </section>

      {/* SECTION 6: DEPLOYMENT ARCHITECTURE */}
      <section id="deployment" className="py-20 px-6 md:px-16 border-b border-[#30353b] bg-[#14171a]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#8d949d] tracking-widest uppercase">INFRASTRUCTURE TIERS</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#e5e7eb]">
              DEPLOYED FROM PROTOTYPE TO FRONTIER OUTPOST.
            </h2>
            <p className="text-sm sm:text-base text-[#8d949d] max-w-3xl leading-relaxed">
              Engineered to operate seamlessly across edge hardware tiers with zero external Internet dependencies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div className="p-5 rounded bg-[#181b1f] border border-[#30353b] space-y-3">
              <div className="text-[#8d949d] font-bold uppercase">TIER 1 / PROTOTYPE</div>
              <h3 className="text-sm font-semibold text-[#e5e7eb]">Local Simulation</h3>
              <p className="text-[#8d949d] font-sans text-xs">
                Runs on a standalone workstation or GPU laptop using simulated multi-stream video pipelines and internal WebSocket bus.
              </p>
              <div className="pt-2 text-[10px] text-[#3f8f68]">&bull; Ready immediately via npm run dev</div>
            </div>

            <div className="p-5 rounded bg-[#181b1f] border border-[#477da8]/50 space-y-3">
              <div className="text-[#477da8] font-bold uppercase">TIER 2 / BOP OUTPOST</div>
              <h3 className="text-sm font-semibold text-[#e5e7eb]">BOP Edge Appliance</h3>
              <p className="text-[#8d949d] font-sans text-xs">
                Ruggedized industrial edge server connecting directly to local ONVIF/RTSP cameras and physical PTZ telemetry controllers.
              </p>
              <div className="pt-2 text-[10px] text-[#477da8]">&bull; Zero Internet required / Air-gapped</div>
            </div>

            <div className="p-5 rounded bg-[#181b1f] border border-[#30353b] space-y-3">
              <div className="text-[#8d949d] font-bold uppercase">TIER 3 / SECTOR HQ</div>
              <h3 className="text-sm font-semibold text-[#e5e7eb]">Central Command Cluster</h3>
              <p className="text-[#8d949d] font-sans text-xs">
                Multi-BOP federation server aggregating verified incident alerts, sector analytics, and cross-outpost intelligence.
              </p>
              <div className="pt-2 text-[10px] text-[#8d949d]">&bull; High-Availability Kubernetes / PostgreSQL</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: FINAL CALL TO ACTION */}
      <section className="py-20 px-6 md:px-16 bg-[#111315] text-center space-y-6">
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#e5e7eb]">
          THE BORDER NEVER STOPS. <br />
          NEITHER SHOULD VISIBILITY.
        </h2>
        <p className="text-sm sm:text-base text-[#8d949d] font-sans max-w-xl mx-auto">
          Access the authenticated tactical operations workstation to monitor live sector feeds, manage coordinated tracks, and triage active perimeter alerts.
        </p>
        <div className="pt-2 flex justify-center gap-4 font-mono text-xs">
          <Link
            to="/login"
            className="px-6 py-3.5 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold tracking-wider transition-colors flex items-center gap-2"
          >
            <span>ENTER COMMAND CENTRE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#30353b] bg-[#14171a] px-6 py-6 font-mono text-xs text-[#8d949d] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          DRISHTI &bull; Intelligent Border Video Analytics Platform &copy; 2026. Official BSF / Ministry of Home Affairs Protocol.
        </div>
        <div className="flex items-center gap-6">
          <Link to="/app/command" className="hover:text-[#e5e7eb] transition-colors">Command Map</Link>
          <Link to="/app/swan/overview" className="hover:text-[#e5e7eb] transition-colors">SWAN Network</Link>
          <Link to="/app/shield/overview" className="hover:text-[#e5e7eb] transition-colors">SHIELD Healing</Link>
          <Link to="/login" className="hover:text-[#e5e7eb] transition-colors">Terminal Login</Link>
        </div>
      </footer>
    </div>
  );
};
export default DrishtiPublicLanding;
