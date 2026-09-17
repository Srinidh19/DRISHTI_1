import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  RotateCcw,
  Camera,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Compass,
  Layers,
  Video,
  Radio,
  ExternalLink,
  Cpu,
  User,
  Truck,
  FileText,
  Clock,
  Terminal,
  Server,
  Network,
  Eye,
  CheckSquare,
  AlertOctagon,
  BookOpen,
  X,
  HelpCircle,
  Sparkles,
  Share2,
  Key,
  ShieldCheck,
  Zap,
  Maximize2
} from 'lucide-react';
import {
  SimulatedCctvViewer,
  CctvCameraId,
  CctvSimulationState
} from '../components/video/SimulatedCctvViewer';

interface CameraMeta {
  id: CctvCameraId;
  name: string;
  sector: string;
  type: string;
  image: string;
  status: 'LIVE' | 'TRACKING' | 'STANDBY' | 'BACKUP' | 'OFFLINE';
  role: string;
}

const CAMERAS: CameraMeta[] = [
  {
    id: 'CAM-FENCE-03',
    name: 'Primary Perimeter Fence',
    sector: 'Sector 03 Alpha',
    type: 'Thermal + Optical',
    image: '/media/cctv/cam-03.jpg',
    status: 'TRACKING',
    role: 'Perimeter Breach Tripwire'
  },
  {
    id: 'CAM-ROAD-05',
    name: 'Access Road Barrier',
    sector: 'Sector 05 West',
    type: 'Optical 1080p',
    image: '/media/cctv/cam-road-05.jpg',
    status: 'LIVE',
    role: 'Vehicle ANPR Checkpoint'
  },
  {
    id: 'CAM-GATE-02',
    name: 'Entry Checkpoint Gate',
    sector: 'Sector 02 Gate',
    type: 'Optical 1080p',
    image: '/media/cctv/cam-gate-02.jpg',
    status: 'LIVE',
    role: 'Barrier Arm & Spike Control'
  },
  {
    id: 'CAM-04',
    name: 'Service Road Junction',
    sector: 'Sector 04 Central',
    type: 'Optical 1080p',
    image: '/media/cctv/cam-04.jpg',
    status: 'LIVE',
    role: 'SWAN Cross-Camera Re-ID'
  },
  {
    id: 'CAM-06',
    name: 'Secondary Ridge PTZ',
    sector: 'Sector 06 Ridge',
    type: 'Motorized PTZ',
    image: '/media/cctv/cam-06.jpg',
    status: 'BACKUP',
    role: 'SHIELD Autonomous Slew'
  },
  {
    id: 'CAM-07',
    name: 'North Perimeter Line',
    sector: 'Sector 07 North',
    type: 'Optical + Thermal',
    image: '/media/cctv/cam-07.jpg',
    status: 'LIVE',
    role: 'Linear Boundary Patrol'
  },
  {
    id: 'CAM-TOWER-01',
    name: 'Watchtower Overwatch',
    sector: 'Tower 01 South',
    type: 'Long-Range Thermal',
    image: '/media/cctv/cam-tower-01.jpg',
    status: 'LIVE',
    role: 'Multi-Sector Wide Angle'
  },
  {
    id: 'CAM-11',
    name: 'Utility & Power Yard',
    sector: 'Sector 11 East',
    type: 'Optical 1080p',
    image: '/media/cctv/cam-11.jpg',
    status: 'STANDBY',
    role: 'Critical Genset & RF Mast'
  }
];

const SECTIONS = [
  { id: 'hero', number: '01', title: 'HERO', label: 'Overview' },
  { id: 'surveillance', number: '02', title: 'SURVEILLANCE', label: 'Surveillance Wall' },
  { id: 'edge-ai', number: '03', title: 'EDGE AI', label: 'Edge AI Detection' },
  { id: 'swan', number: '04', title: 'SWAN', label: 'Cross-Camera Continuity' },
  { id: 'shield', number: '05', title: 'SHIELD', label: 'Autonomous Self-Healing' },
  { id: 'risk', number: '06', title: 'RISK FUSION', label: 'Multi-Factor Threat Matrix' },
  { id: 'incident', number: '07', title: 'INCIDENT', label: 'Incident Record' },
  { id: 'evidence', number: '08', title: 'EVIDENCE', label: 'Forensic Package' },
  { id: 'command', number: '09', title: 'COMMAND CENTRE', label: 'Command Centre & Authority' },
  { id: 'architecture', number: '10', title: 'ARCHITECTURE', label: 'System Architecture' }
];

export const DrishtiPublicLanding: React.FC = () => {
  // Navigation & Active Section Tracking
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [currentTime, setCurrentTime] = useState<string>('');

  // Interactive Demonstration State
  const [activeCamera, setActiveCamera] = useState<CctvCameraId>('CAM-FENCE-03');
  const [shieldSabotageActive, setShieldSabotageActive] = useState<boolean>(false);
  const [shieldRecovered, setShieldRecovered] = useState<boolean>(false);
  const [selectedIncidentAction, setSelectedIncidentAction] = useState<string | null>(null);

  // Live IST Clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s} IST`);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // IntersectionObserver to highlight active section in rail
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of SECTIONS) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler helper
  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Base Simulation States for CCTV Viewers
  const heroSimulationState: CctvSimulationState = useMemo(() => ({
    activeCameraId: 'CAM-FENCE-03',
    stageId: 5,
    stageSlug: 'PERSON_TRACKING',
    timeSeconds: 24,
    isVehiclePresent: false,
    isAnprActive: false,
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: false,
    isShieldRecovered: false,
    progressPercent: 45
  }), []);

  const surveillanceSimState: CctvSimulationState = useMemo(() => ({
    activeCameraId: activeCamera,
    stageId: activeCamera === 'CAM-04' ? 8 : activeCamera === 'CAM-06' ? 10 : 4,
    stageSlug: 'ACTIVE_SECTOR_SURVEILLANCE',
    timeSeconds: 32,
    isVehiclePresent: activeCamera === 'CAM-04' || activeCamera === 'CAM-ROAD-05' || activeCamera === 'CAM-GATE-02',
    isAnprActive: activeCamera === 'CAM-ROAD-05' || activeCamera === 'CAM-GATE-02',
    isPersonPresent:
      activeCamera === 'CAM-FENCE-03' ||
      activeCamAlias(activeCamera) ||
      activeCamera === 'CAM-04' ||
      activeCamera === 'CAM-06' ||
      activeCamera === 'CAM-TOWER-01',
    isFenceCrossed: activeCamera === 'CAM-FENCE-03' || activeCamera === 'CAM-03',
    isSwanActive: activeCamera === 'CAM-FENCE-03' || activeCamera === 'CAM-04',
    isCameraFailed: false,
    isShieldRecovered: false,
    progressPercent: 55
  }), [activeCamera]);

  function activeCamAlias(cam: CctvCameraId): boolean {
    return cam === 'CAM-03';
  }

  const edgeAiSimState: CctvSimulationState = useMemo(() => ({
    activeCameraId: 'CAM-FENCE-03',
    stageId: 4,
    stageSlug: 'EDGE_AI_INFERENCE',
    timeSeconds: 18,
    isVehiclePresent: false,
    isAnprActive: false,
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: false,
    isCameraFailed: false,
    isShieldRecovered: false,
    progressPercent: 30
  }), []);

  const shieldSimState: CctvSimulationState = useMemo(() => ({
    activeCameraId: shieldRecovered ? 'CAM-06' : 'CAM-FENCE-03',
    stageId: shieldRecovered ? 10 : shieldSabotageActive ? 9 : 1,
    stageSlug: shieldRecovered ? 'SHIELD_RECOVERED' : shieldSabotageActive ? 'CAMERA_FAULT' : 'STANDBY',
    timeSeconds: 45,
    isVehiclePresent: false,
    isAnprActive: false,
    isPersonPresent: true,
    isFenceCrossed: true,
    isSwanActive: true,
    isCameraFailed: shieldSabotageActive && !shieldRecovered,
    isShieldRecovered: shieldRecovered,
    progressPercent: shieldRecovered ? 85 : shieldSabotageActive ? 65 : 10
  }), [shieldSabotageActive, shieldRecovered]);

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#e5e7eb] font-sans antialiased selection:bg-[#477da8]/30 selection:text-white overflow-x-hidden w-full">
      {/* ================================================================= */}
      {/* TOP NAVIGATION BAR (Fixed, Compact, Non-Obstructive ~52px)       */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0d1015]/95 backdrop-blur-md border-b border-[#30353b] px-4 md:px-8 min-h-[52px] h-[52px] flex items-center justify-between shadow-lg">
        {/* Brand & Sector Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-7 h-7 rounded bg-[#161c24] border border-[#477da8] flex items-center justify-center shadow-inner group-hover:border-white transition-colors">
              <Shield className="w-4 h-4 text-[#477da8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wider text-white font-mono">DRISHTI</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#3f8f68]/20 text-[#3f8f68] font-bold border border-[#3f8f68]/40 font-mono">
                  BOP-17
                </span>
              </div>
              <span className="hidden sm:block text-[9px] text-[#8d949d] font-mono tracking-tight">
                Intelligent Border Surveillance & Response
              </span>
            </div>
          </button>
        </div>

        {/* Center: Anchor Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-mono">
          <button
            onClick={() => scrollToSection('surveillance')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'surveillance' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            Surveillance
          </button>
          <button
            onClick={() => scrollToSection('edge-ai')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'edge-ai' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            Edge AI
          </button>
          <button
            onClick={() => scrollToSection('swan')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'swan' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            SWAN
          </button>
          <button
            onClick={() => scrollToSection('shield')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'shield' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            SHIELD
          </button>
          <button
            onClick={() => scrollToSection('risk')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'risk' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            Risk Fusion
          </button>
          <button
            onClick={() => scrollToSection('incident')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'incident' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            Incident
          </button>
          <button
            onClick={() => scrollToSection('evidence')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'evidence' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            Evidence
          </button>
          <button
            onClick={() => scrollToSection('architecture')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeSection === 'architecture' ? 'bg-[#202732] text-white font-semibold' : 'text-[#8d949d] hover:text-[#e5e7eb]'
            }`}
          >
            Architecture
          </button>
        </nav>

        {/* Right: Station Telemetry & Live CTA */}
        <div className="flex items-center gap-3 font-mono">
          <div className="hidden xl:flex items-center gap-2 text-[10px] text-[#8d949d] px-2.5 py-1 rounded bg-[#13161c] border border-[#30353b]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3f8f68] animate-pulse" />
            <span>{currentTime || '02:14:06 IST'}</span>
          </div>

          <Link
            to="/app/command"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#477da8] hover:bg-[#477da8]/90 text-white text-xs font-bold font-mono rounded shadow transition-all hover:shadow-[#477da8]/20"
          >
            <span>COMMAND CENTRE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* ================================================================= */}
      {/* FLOATING VERTICAL SECTION INDICATOR RAIL (Desktop Right Side)    */}
      {/* ================================================================= */}
      <aside
        aria-label="Section Navigation Rail"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 p-1.5 rounded-full bg-[#111419]/80 backdrop-blur-md border border-[#30353b] shadow-2xl"
      >
        {SECTIONS.map((sec, idx) => {
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className="group relative flex items-center justify-center p-1.5"
              title={`${sec.number}. ${sec.label}`}
            >
              <div
                className={`transition-all rounded-full ${
                  isActive
                    ? 'w-3 h-3 bg-[#477da8] ring-2 ring-[#477da8]/40 ring-offset-1 ring-offset-[#111419]'
                    : 'w-2 h-2 bg-[#48505a] hover:bg-[#8d949d]'
                }`}
              />
              {/* Tooltip on hover */}
              <div className="absolute right-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#141820] text-white text-[11px] font-mono font-medium px-2 py-1 rounded border border-[#30353b] shadow whitespace-nowrap">
                <span className="text-[#477da8] font-bold mr-1">{sec.number}</span>
                {sec.title}
              </div>
            </button>
          );
        })}
      </aside>

      {/* ================================================================= */}
      {/* MAIN CONTENT AREA: NORMAL DOCUMENT FLOW, 10 DISCRETE SECTIONS     */}
      {/* ================================================================= */}
      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:pr-14">
        {/* =============================================================== */}
        {/* SECTION 01 — HERO                                               */}
        {/* =============================================================== */}
        <section
          id="hero"
          className="min-h-[calc(100svh-52px)] md:min-h-[calc(100dvh-52px)] py-3 sm:py-4 md:py-5 flex flex-col justify-between"
        >
          {/* Top Operational Eyebrow */}
          <div className="flex items-center justify-between border-b border-[#30353b]/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8d949d]">
              <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-pulse" />
              <span className="text-white font-bold tracking-wider uppercase">DRISHTI OPERATIONAL PLATFORM</span>
              <span className="text-[#30353b]">|</span>
              <span>BOP-17 PERIMETER DEFENSE FABRIC</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span>AIR-GAPPED EDGE NODE</span>
              <span className="px-1.5 py-0.5 rounded bg-[#477da8]/15 text-[#477da8] text-[10px] font-bold border border-[#477da8]/30">
                14MS INFERENCE
              </span>
            </div>
          </div>

          {/* Hero Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 my-auto items-center py-2 sm:py-3">
            {/* Left: Headline & Core Narrative (7 Cols) */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-3.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:py-1 rounded bg-[#171b22] border border-[#30353b] text-xs font-mono text-[#8d949d]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3f8f68]" />
                <span>OPERATIONAL FIELD DEPLOYMENT: BOP-17</span>
              </div>

              <div className="space-y-1 sm:space-y-1.5">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono">
                  DRISHTI
                </h1>
                <p className="text-base sm:text-lg font-medium text-[#477da8] font-mono">
                  Intelligent Border Surveillance & Response Platform
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#8d949d] leading-relaxed max-w-2xl">
                DRISHTI transforms standard border CCTV cameras into an autonomous, collaborative
                surveillance network. Running hardened AI inference at 14ms edge latency, DRISHTI
                predicts cross-camera intrusion paths via <strong className="text-white font-medium">SWAN</strong> and
                autonomously heals sensor blind zones via <strong className="text-white font-medium">SHIELD</strong>.
                Human authority governs all tactical decisions.
              </p>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 sm:pt-1.5">
                <div className="p-2 rounded bg-[#13161c] border border-[#30353b]">
                  <div className="text-[10px] font-mono text-[#8d949d]">DETECTION</div>
                  <div className="text-xs font-bold font-mono text-white">14ms Edge AI</div>
                </div>
                <div className="p-2 rounded bg-[#13161c] border border-[#30353b]">
                  <div className="text-[10px] font-mono text-[#8d949d]">TRACKING</div>
                  <div className="text-xs font-bold font-mono text-[#477da8]">SWAN Handoff</div>
                </div>
                <div className="p-2 rounded bg-[#13161c] border border-[#30353b]">
                  <div className="text-[10px] font-mono text-[#8d949d]">RESILIENCE</div>
                  <div className="text-xs font-bold font-mono text-[#3f8f68]">SHIELD Recovery</div>
                </div>
                <div className="p-2 rounded bg-[#13161c] border border-[#30353b]">
                  <div className="text-[10px] font-mono text-[#8d949d]">AUTHORITY</div>
                  <div className="text-xs font-bold font-mono text-white">Human-In-Loop</div>
                </div>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:pt-2">
                <button
                  onClick={() => scrollToSection('surveillance')}
                  className="flex items-center gap-2 px-3.5 py-2 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold font-mono text-xs shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>START DEMONSTRATION</span>
                </button>

                <Link
                  to="/app/command"
                  className="flex items-center gap-2 px-3.5 py-2 rounded bg-[#1c2229] hover:bg-[#252b34] border border-[#30353b] text-white font-mono text-xs font-semibold transition-colors"
                >
                  <span>ENTER COMMAND CENTRE</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8d949d]" />
                </Link>
              </div>
            </div>

            {/* Right: High-Quality Primary CCTV Visual (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-lg overflow-hidden border border-[#30353b] bg-[#111419] shadow-2xl">
                <div className="px-3 py-1.5 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-[#477da8]" />
                    <span className="font-bold text-white text-[11px] sm:text-xs">LIVE BOP-17 DEMONSTRATION</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-[#3f8f68]/20 text-[#3f8f68] text-[9px] font-bold border border-[#3f8f68]/40">
                    ONLINE
                  </span>
                </div>
                <div className="w-full">
                  <SimulatedCctvViewer state={heroSimulationState} className="w-full" />
                </div>
                <div className="px-3 py-1.5 bg-[#111419] text-[10px] sm:text-[11px] font-mono text-[#8d949d] flex items-center justify-between border-t border-[#30353b]">
                  <span>PRIMARY SENSOR: CAM-FENCE-03</span>
                  <span className="text-[#3f8f68]">VIRTUAL FENCE ACTIVE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Footer: Scroll Indicator & Next Control */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-2 sm:pt-2.5">
            <button
              onClick={() => scrollToSection('surveillance')}
              className="flex items-center gap-1.5 text-xs font-mono text-[#8d949d] hover:text-white transition-colors group"
            >
              <span>SCROLL TO EXPLORE</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('surveillance')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all hover:border-[#477da8]"
            >
              <span>NEXT — SURVEILLANCE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 02 — SURVEILLANCE WALL                                  */}
        {/* =============================================================== */}
        <section
          id="surveillance"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Section Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 02 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">PERIMETER SURVEILLANCE WALL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              THE SURVEILLANCE ENVIRONMENT
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Fictional BOP-17 North Sector perimeter fence. 2.8 km linear boundary monitored by an
              integrated multi-camera fabric. Click any camera in the matrix below to route its primary RTSP
              stream and computer vision telemetry to the main wall monitor.
            </p>
          </div>

          {/* Desktop Surveillance Wall Grid (60% Primary Feed / 40% Matrix) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 my-auto py-3 items-start">
            {/* Left: Primary Active Surveillance Monitor (~60% / 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-2 rounded-lg border border-[#30353b] bg-[#111419] p-3 shadow-2xl">
              {/* Monitor OSD Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#30353b] text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3f8f68] animate-pulse" />
                  <span className="font-bold text-white uppercase tracking-wide">
                    {activeCamera}: {CAMERAS.find(c => c.id === activeCamera)?.name}
                  </span>
                  <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-[#181b20] border border-[#30353b] text-[#8d949d] text-[10px]">
                    {CAMERAS.find(c => c.id === activeCamera)?.sector}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#477da8]">
                  <span className="hidden md:inline">1080P/30FPS RTSP</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#477da8]/15 border border-[#477da8]/30 font-bold">
                    14MS LATENCY
                  </span>
                </div>
              </div>

              {/* Main CCTV Stream Container (Strict uncropped 16:9) */}
              <div className="w-full rounded overflow-hidden bg-black border border-[#262b33]">
                <SimulatedCctvViewer
                  state={surveillanceSimState}
                  onCameraSelect={camId => setActiveCamera(camId)}
                  className="w-full"
                />
              </div>

              {/* Active Stream Metadata Footer */}
              <div className="p-2 bg-[#14181f] rounded border border-[#30353b] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-[11px] text-[#8d949d]">
                  <span className="text-white font-semibold">SENSOR TYPE:</span>
                  <span>{CAMERAS.find(c => c.id === activeCamera)?.type}</span>
                  <span className="text-[#30353b]">|</span>
                  <span className="text-white font-semibold">ROLE:</span>
                  <span className="text-[#477da8]">{CAMERAS.find(c => c.id === activeCamera)?.role}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3f8f68]" />
                  <span className="text-[10px] text-[#3f8f68] font-bold">EDGE PIPELINE SYNCED</span>
                </div>
              </div>
            </div>

            {/* Right: 8-Camera Selector Matrix & Telemetry (~40% / 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {/* Matrix Card */}
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-2.5 font-mono shadow-xl">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#30353b]">
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-[#477da8]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">CAMERA MATRIX (8 FEEDS)</span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-[#3f8f68]/20 text-[#3f8f68] text-[10px] font-bold border border-[#3f8f68]/40">
                    8 / 8 ACTIVE
                  </span>
                </div>

                {/* 8-Camera Visual Grid (2 Columns) */}
                <div className="grid grid-cols-2 gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {CAMERAS.map(cam => {
                    const isSelected = activeCamera === cam.id;
                    return (
                      <button
                        key={cam.id}
                        onClick={() => setActiveCamera(cam.id)}
                        className={`group relative rounded border p-1.5 text-left transition-all font-mono flex flex-col gap-1 ${
                          isSelected
                            ? 'border-[#477da8] bg-[#1c2430] ring-1 ring-[#477da8] shadow-md'
                            : 'border-[#30353b] bg-[#13161c] hover:border-[#477da8]/60 hover:bg-[#181d24]'
                        }`}
                      >
                        {/* Camera Thumbnail Frame (Strict 16:9 Uncropped) */}
                        <div className="w-full aspect-video rounded overflow-hidden relative bg-black border border-[#22272f]">
                          <img
                            src={cam.image}
                            alt={cam.name}
                            className={`w-full h-full object-cover transition-opacity ${
                              isSelected ? 'opacity-95' : 'opacity-70 group-hover:opacity-90'
                            }`}
                          />
                          {/* Live Overlay Badge */}
                          <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-black/80 text-[8px] font-bold text-white border border-white/20">
                            {cam.id}
                          </div>
                          <div className="absolute bottom-1 right-1">
                            <span
                              className={`px-1 py-0.2 rounded text-[7px] font-bold uppercase border ${
                                cam.status === 'TRACKING'
                                  ? 'bg-[#c28a28]/90 text-white border-[#c28a28]'
                                  : cam.status === 'LIVE'
                                  ? 'bg-[#3f8f68]/90 text-white border-[#3f8f68]'
                                  : cam.status === 'BACKUP'
                                  ? 'bg-[#477da8]/90 text-white border-[#477da8]'
                                  : 'bg-[#8d949d]/90 text-white border-[#8d949d]'
                              }`}
                            >
                              {cam.status}
                            </span>
                          </div>
                        </div>

                        {/* Camera Meta Label */}
                        <div className="w-full min-w-0">
                          <div className={`text-[10px] font-bold truncate ${isSelected ? 'text-white' : 'text-[#e5e7eb]'}`}>
                            {cam.name}
                          </div>
                          <div className="text-[8px] text-[#8d949d] truncate">
                            {cam.sector} &bull; {cam.role}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BOP-17 Telemetry Card */}
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#30353b] pb-1">
                  <span className="font-bold text-white text-[11px]">BOP-17 PERIMETER TELEMETRY</span>
                  <span className="text-[#3f8f68] text-[10px]">ALL ARRAYS SYNCHRONIZED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-1.5 rounded bg-[#171b22] border border-[#30353b]">
                    <div className="text-[9px] text-[#8d949d]">LINEAR BOUNDARY</div>
                    <div className="font-bold text-white">2.8 km North Sector</div>
                  </div>
                  <div className="p-1.5 rounded bg-[#171b22] border border-[#30353b]">
                    <div className="text-[9px] text-[#8d949d]">EDGE MESH SYNC</div>
                    <div className="font-bold text-[#477da8]">8ms Gossip Protocol</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section Footer: Next Control */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              02 / 10 · SURVEILLANCE WALL
            </span>
            <button
              onClick={() => scrollToSection('edge-ai')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all hover:border-[#477da8]"
            >
              <span>NEXT — EDGE AI DETECTION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 03 — EDGE AI                                            */}
        {/* =============================================================== */}
        <section
          id="edge-ai"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 03 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">SUB-15MS LOCAL INFERENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              EDGE AI DETECTION
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Local computer vision at 14ms latency. Real-time neural inference directly on
              ruggedized edge hardware at BOP-17.
            </p>
          </div>

          {/* Visual Display & Classification Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-3 items-center">
            {/* Left: Large High-Fidelity CCTV Feed (7 Cols) */}
            <div className="lg:col-span-7 rounded-lg overflow-hidden border border-[#30353b] bg-[#111419] shadow-2xl">
              <div className="p-2.5 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c28a28] animate-pulse" />
                  <span className="font-bold text-white">TARGET ACQUIRED // CAM-FENCE-03</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#c28a28]/20 text-[#c28a28] text-[10px] font-bold border border-[#c28a28]/40">
                  PERSON · T-104 · 91%
                </span>
              </div>
              <div className="w-full">
                <SimulatedCctvViewer state={edgeAiSimState} className="w-full" />
              </div>
              <div className="p-2.5 bg-[#111419] text-[11px] font-mono text-[#8d949d] flex items-center justify-between border-t border-[#30353b]">
                <span>BOUNDING BOX: [x: 412, y: 180, w: 78, h: 164]</span>
                <span className="text-[#477da8]">VELOCITY: 1.8 M/S</span>
              </div>
            </div>

            {/* Right: 3 Core Vision Pillars (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 font-mono">
              {/* Detection Card */}
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#477da8]/20 text-[#477da8] text-2xs flex items-center justify-center font-bold">1</span>
                    DETECTION
                  </span>
                  <span className="text-2xs text-[#477da8]">RT-DETR / YOLOv8</span>
                </div>
                <p className="text-xs text-[#8d949d] leading-relaxed">
                  Extracts optical and thermal silhouettes at 30 FPS. Evaluates spatial coordinates
                  against calibrated virtual fence tripwires in under 14ms.
                </p>
              </div>

              {/* Tracking Card */}
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#477da8]/20 text-[#477da8] text-2xs flex items-center justify-center font-bold">2</span>
                    TRACKING
                  </span>
                  <span className="text-2xs text-[#3f8f68]">ByteTrack / BoT-SORT</span>
                </div>
                <p className="text-xs text-[#8d949d] leading-relaxed">
                  Maintains target ID <strong className="text-white">T-104</strong> across momentary occlusion,
                  terrain dips, and sensor handovers without track fragmentation.
                </p>
              </div>

              {/* Classification Card */}
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#477da8]/20 text-[#477da8] text-2xs flex items-center justify-center font-bold">3</span>
                    CLASSIFICATION
                  </span>
                  <span className="text-2xs text-[#c28a28]">Multi-Class Neural</span>
                </div>
                <p className="text-xs text-[#8d949d] leading-relaxed">
                  Segregates human intruders from routine patrol utility vehicles (V-203) and boundary
                  wildlife, dropping nuisance false alarms by 94%.
                </p>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              03 / 10 · EDGE AI
            </span>
            <button
              onClick={() => scrollToSection('swan')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — SWAN</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 04 — SWAN                                               */}
        {/* =============================================================== */}
        <section
          id="swan"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 04 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">CROSS-CAMERA TARGET CONTINUITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              SWAN — SMART WATCH AND ALERT NETWORK
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              SWAN coordinates neighboring cameras, predicts the target's next coverage area, and
              maintains cross-camera track continuity across the border sector.
            </p>
          </div>

          {/* Visual Step-by-Step Flow Cards */}
          <div className="my-auto py-4 space-y-4">
            {/* Flow Sequence Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Step 1: CAM-FENCE-03 */}
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] relative space-y-2.5 font-mono shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#c93c3c]/20 text-[#c93c3c] font-bold border border-[#c93c3c]/30">
                    1. ORIGIN BREACH
                  </span>
                  <span className="text-[#8d949d] font-bold">CAM-FENCE-03</span>
                </div>
                <div className="w-full aspect-video rounded overflow-hidden relative border border-[#30353b] bg-black">
                  <img
                    src="/media/cctv/cam-03.jpg"
                    alt="CAM-FENCE-03 Perimeter Breach"
                    className="w-full h-full object-cover opacity-85"
                  />
                  {/* Tactical Tripwire Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-[#c93c3c]/60 text-[#c93c3c] text-[9px] font-bold rounded">
                    TRIPWIRE BREACH: [x:312, y:284]
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#c93c3c]/90 text-white text-[10px] font-bold rounded shadow">
                    T-104 CONFIRMED INTRUSION
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#e5e7eb] bg-black/75 px-1 rounded">
                    1.8 M/S &bull; 042° NE
                  </div>
                </div>
                <p className="text-[11px] text-[#8d949d] leading-relaxed">
                  Target <strong className="text-white">T-104</strong> cuts through perimeter chainlink wire.
                  SWAN immediately calculates trajectory vector (1.8 m/s, bearing 042° NE) toward the central service road.
                </p>
              </div>

              {/* Step 2: Handoff Vector CAM-04 */}
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#477da8]/60 relative space-y-2.5 font-mono shadow-xl ring-1 ring-[#477da8]/30">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#3f8f68]/20 text-[#3f8f68] font-bold border border-[#3f8f68]/30">
                    2. PREDICTED INTERSECTION
                  </span>
                  <span className="text-white font-bold">CAM-04</span>
                </div>
                <div className="w-full aspect-video rounded overflow-hidden relative border border-[#30353b] bg-black">
                  <img
                    src="/media/cctv/cam-04.jpg"
                    alt="CAM-04 Predicted Handoff"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-[#477da8]/60 text-[#477da8] text-[9px] font-bold rounded">
                    SWAN PRE-ALERT: ARRIVAL IN 8.2S
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#477da8]/90 text-white text-[10px] font-bold rounded shadow">
                    RE-ID LOCK: 94% COSINE
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#3f8f68] bg-black/75 px-1 rounded">
                    SECTOR 04 CENTRAL
                  </div>
                </div>
                <p className="text-[11px] text-[#8d949d] leading-relaxed">
                  SWAN pre-alerts <strong className="text-white">CAM-04</strong> road intersection 8 seconds ahead of target arrival.
                  Pre-positions edge inference buffers and locks appearance embeddings.
                </p>
              </div>

              {/* Step 3: Secondary Corroboration CAM-06 */}
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] relative space-y-2.5 font-mono shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#477da8]/20 text-[#477da8] font-bold border border-[#477da8]/30">
                    3. RIDGE PTZ LOCK
                  </span>
                  <span className="text-[#8d949d] font-bold">CAM-06 PTZ</span>
                </div>
                <div className="w-full aspect-video rounded overflow-hidden relative border border-[#30353b] bg-black">
                  <img
                    src="/media/cctv/cam-06.jpg"
                    alt="CAM-06 Ridge View Corroboration"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/80 border border-[#3f8f68]/60 text-[#3f8f68] text-[9px] font-bold rounded">
                    DUAL BEARING OVERWATCH
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-[#3f8f68]/90 text-white text-[10px] font-bold rounded shadow">
                    CONTINUITY CONFIRMED
                  </div>
                  <div className="absolute bottom-2 right-2 text-[9px] text-[#8d949d] bg-black/75 px-1 rounded">
                    PTZ: 142.4° / -18.2°
                  </div>
                </div>
                <p className="text-[11px] text-[#8d949d] leading-relaxed">
                  Elevated PTZ <strong className="text-white">CAM-06</strong> cross-validates track coordinates across sector elevation contours,
                  maintaining an unbroken chain of custody with zero cloud round-trips.
                </p>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="p-3.5 rounded-lg bg-[#14181f] border border-[#30353b] grid grid-cols-1 sm:grid-cols-3 gap-3 text-center font-mono">
              <div>
                <div className="text-xs text-[#8d949d]">SWAN HANDOFF CONFIDENCE</div>
                <div className="text-lg font-bold text-[#3f8f68]">94% Cosine Match</div>
              </div>
              <div>
                <div className="text-xs text-[#8d949d]">EDGE GOSSIP SYNC</div>
                <div className="text-lg font-bold text-[#477da8]">8ms Protocol Latency</div>
              </div>
              <div>
                <div className="text-xs text-[#8d949d]">TRACK CONTINUITY</div>
                <div className="text-lg font-bold text-white">100% Unbroken</div>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              04 / 10 · SWAN
            </span>
            <button
              onClick={() => scrollToSection('shield')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — SHIELD</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 05 — SHIELD                                             */}
        {/* =============================================================== */}
        <section
          id="shield"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c93c3c]">
              <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 font-bold">SECTION 05 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">AUTONOMOUS SELF-HEALING RECOVERY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              SHIELD — SELF-HEALING PERIMETER
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Eliminates single points of failure. When a camera loses heartbeat due to tampering or
              malfunction, SHIELD slews neighboring PTZs to eliminate blind zones.
            </p>
          </div>

          {/* Interactive Stepped Recovery Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto py-2 items-start">
            {/* Left: Interactive Monitor with Sabotage / Recovery State (7 Cols) */}
            <div className="lg:col-span-7 rounded-lg overflow-hidden border border-[#30353b] bg-[#111419] shadow-2xl">
              <div className="p-2 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      shieldRecovered ? 'bg-[#3f8f68]' : shieldSabotageActive ? 'bg-[#c93c3c]' : 'bg-[#3f8f68]'
                    }`}
                  />
                  <span className="font-bold text-white">
                    {shieldRecovered
                      ? 'BACKUP ACTIVE // PTZ CAM-06 SLEWED (+32°)'
                      : shieldSabotageActive
                      ? 'CAM-FENCE-03 OFFLINE // SIGNAL LOST'
                      : 'STANDBY SURVEILLANCE // CAM-FENCE-03'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    shieldRecovered
                      ? 'bg-[#3f8f68]/20 text-[#3f8f68] border-[#3f8f68]/40'
                      : shieldSabotageActive
                      ? 'bg-[#c93c3c]/20 text-[#c93c3c] border-[#c93c3c]/40'
                      : 'bg-[#477da8]/20 text-[#477da8] border-[#477da8]/40'
                  }`}
                >
                  {shieldRecovered ? 'COVERAGE 91% RESTORED' : shieldSabotageActive ? 'BLIND ZONE 32%' : 'NOMINAL'}
                </span>
              </div>

              <div className="w-full">
                <SimulatedCctvViewer state={shieldSimState} className="w-full" />
              </div>

              <div className="p-2.5 bg-[#111419] flex items-center justify-between border-t border-[#30353b]">
                <div className="text-2xs font-mono text-[#8d949d]">
                  INTERACTIVE SIMULATION TRIGGER:
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <button
                    onClick={() => {
                      setShieldSabotageActive(true);
                      setShieldRecovered(false);
                    }}
                    className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${
                      shieldSabotageActive && !shieldRecovered
                        ? 'bg-[#c93c3c] text-white border-[#c93c3c]'
                        : 'bg-[#1a1e26] text-[#c93c3c] border-[#c93c3c]/40 hover:bg-[#c93c3c]/10'
                    }`}
                  >
                    Tamper CAM-FENCE-03
                  </button>
                  <button
                    onClick={() => {
                      setShieldSabotageActive(true);
                      setShieldRecovered(true);
                    }}
                    className={`px-2 py-1 rounded text-xs font-bold border transition-colors ${
                      shieldRecovered
                        ? 'bg-[#3f8f68] text-white border-[#3f8f68]'
                        : 'bg-[#1a1e26] text-[#3f8f68] border-[#3f8f68]/40 hover:bg-[#3f8f68]/10'
                    }`}
                  >
                    Slew Backup PTZ (CAM-06)
                  </button>
                  <button
                    onClick={() => {
                      setShieldSabotageActive(false);
                      setShieldRecovered(false);
                    }}
                    className="p-1 rounded bg-[#1a1e26] text-[#8d949d] hover:text-white border border-[#30353b]"
                    title="Reset to Normal"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Sequence Steps (5 Cols) */}
            <div className="lg:col-span-5 space-y-2.5 font-mono">
              {/* Step 1 */}
              <div className={`p-3 rounded-lg border transition-all ${
                shieldSabotageActive ? 'bg-[#1c1417] border-[#c93c3c]/50' : 'bg-[#111419] border-[#30353b]'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#c93c3c]">1. HEARTBEAT LOSS DETECTED</span>
                  <span className="text-[10px] text-[#8d949d]">TIMEOUT &gt; 3.0S</span>
                </div>
                <p className="text-[11px] text-[#8d949d] mt-1">
                  CAM-03 feed suffers intentional obstruction or physical line tampering.
                </p>
              </div>

              {/* Step 2 */}
              <div className={`p-3 rounded-lg border transition-all ${
                shieldSabotageActive && !shieldRecovered ? 'bg-[#211a14] border-[#c28a28]/50' : 'bg-[#111419] border-[#30353b]'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#c28a28]">2. BLIND ZONE MAPPED</span>
                  <span className="text-[10px] text-[#8d949d]">GAP: 32% LINEAR</span>
                </div>
                <p className="text-[11px] text-[#8d949d] mt-1">
                  SHIELD calculates vulnerable sector gap against BOP terrain elevation map.
                </p>
              </div>

              {/* Step 3 */}
              <div className={`p-3 rounded-lg border transition-all ${
                shieldRecovered ? 'bg-[#131d17] border-[#3f8f68]/50' : 'bg-[#111419] border-[#30353b]'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#3f8f68]">3. CAM-06 PTZ SLEWED</span>
                  <span className="text-[10px] text-[#8d949d]">AZIMUTH: +32° IN 1.4S</span>
                </div>
                <p className="text-[11px] text-[#8d949d] mt-1">
                  Backup motorized PTZ rotates to overlap the blind sector.
                </p>
              </div>

              {/* Step 4 */}
              <div className={`p-3 rounded-lg border transition-all ${
                shieldRecovered ? 'bg-[#131d17] border-[#3f8f68]/50' : 'bg-[#111419] border-[#30353b]'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#3f8f68]">4. CONTINUITY RESTORED</span>
                  <span className="text-[10px] text-[#3f8f68]">91% RECOVERED</span>
                </div>
                <p className="text-[11px] text-[#8d949d] mt-1">
                  Target T-104 re-acquired. Continuity preserved without human intervention.
                </p>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              05 / 10 · SHIELD
            </span>
            <button
              onClick={() => scrollToSection('risk')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — RISK FUSION</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 06 — RISK FUSION                                        */}
        {/* =============================================================== */}
        <section
          id="risk"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c93c3c]">
              <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 font-bold">SECTION 06 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">MULTI-CRITERIA THREAT SYNTHESIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              MULTI-FACTOR RISK FUSION
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              DRISHTI fuses 6 contextual operational vectors to calculate precise threat severity,
              avoiding single-sensor false alarm fatigue.
            </p>
          </div>

          {/* 6 Signals Grid + Fused Score */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-3 items-center">
            {/* Left: 6 Input Signals (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">1. ZONE CRITICALITY</span>
                  <span className="text-[#c93c3c] font-bold">ALPHA BUFFER</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.25 | Breach in 100m restricted border zone</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">2. DIRECTION VECTOR</span>
                  <span className="text-[#c93c3c] font-bold">INWARD BEARING</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.20 | Heading toward critical fence corridor</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">3. TEMPORAL CONTEXT</span>
                  <span className="text-[#c28a28] font-bold">NIGHT WINDOW</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.15 | 02:14 IST off-hours stealth approach</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">4. CROSS-CAMERA CONFIRM</span>
                  <span className="text-[#3f8f68] font-bold">DUAL SENSOR</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.15 | CAM-03 and CAM-04 corroborate target</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">5. ACTIVITY ANOMALY</span>
                  <span className="text-[#c93c3c] font-bold">FENCE SCALING</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.15 | Physical boundary wire contact detected</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">6. EVIDENCE QUALITY</span>
                  <span className="text-[#477da8] font-bold">HIGH SNR</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.10 | Sharp optical and thermal silhouette match</div>
              </div>
            </div>

            {/* Right: Fused Threat Classification Card (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-lg bg-[#111419] border border-[#c93c3c]/50 space-y-4 font-mono shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#30353b] pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#c93c3c]" />
                  <span className="font-bold text-white text-xs">FUSED RISK SYNTHESIS</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#c93c3c]/20 text-[#c93c3c] text-xs font-bold border border-[#c93c3c]/40">
                  HIGH PRIORITY
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div>
                  <div className="text-3xl font-extrabold text-[#c93c3c]">86 <span className="text-sm font-normal text-[#8d949d]">/ 100</span></div>
                  <div className="text-[10px] text-[#8d949d]">WEIGHTED RISK SCORE</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-[#3f8f68]">91%</div>
                  <div className="text-[10px] text-[#8d949d]">CONFIDENCE RATING</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#1e232b] h-2 rounded-full overflow-hidden">
                <div className="bg-[#c93c3c] h-full w-[86%]" />
              </div>

              <p className="text-xs text-[#8d949d] leading-relaxed">
                Risk Engine elevates target T-104 directly to <strong className="text-white">High Priority Incident</strong>.
                Dispatches immediate incident alert to the Sector Command Centre workstation.
              </p>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              06 / 10 · RISK FUSION
            </span>
            <button
              onClick={() => scrollToSection('incident')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — INCIDENT RECORD</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 07 — INCIDENT                                           */}
        {/* =============================================================== */}
        <section
          id="incident"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c93c3c]">
              <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 font-bold">SECTION 07 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">UNIFIED TACTICAL DOSSIER</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              OPERATIONAL INCIDENT RECORD
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Rather than generating disjointed alarms per camera, DRISHTI aggregates all
              sensor observations into a singular continuous incident record.
            </p>
          </div>

          {/* Incident Dossier Card */}
          <div className="my-auto py-3 font-mono">
            <div className="rounded-lg border border-[#30353b] bg-[#111419] p-5 shadow-2xl space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#30353b] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#c93c3c]/20 border border-[#c93c3c]/50 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4 text-[#c93c3c]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white tracking-wider">
                      INC-2026-0142
                    </div>
                    <div className="text-[10px] text-[#8d949d]">
                      CLASSIFICATION: RESTRICTED-ZONE INTRUSION
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#c93c3c]/20 text-[#c93c3c] font-bold text-xs border border-[#c93c3c]/40">
                    HIGH PRIORITY
                  </span>
                  <span className="px-2.5 py-1 rounded bg-[#1f2530] text-[#8d949d] text-xs border border-[#30353b]">
                    AWAITING OPERATOR DECISION
                  </span>
                </div>
              </div>

              {/* Dossier Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">TARGET ENTITY</div>
                  <div className="font-bold text-white mt-0.5">T-104 (Unauthorized)</div>
                </div>
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">LOCATION SECTOR</div>
                  <div className="font-bold text-white mt-0.5">BOP-17 North (2.4 km)</div>
                </div>
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">SENSOR SEQUENCE</div>
                  <div className="font-bold text-[#477da8] mt-0.5">CAM-03 → 04 → 06</div>
                </div>
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">RISK / CONFIDENCE</div>
                  <div className="font-bold text-[#c93c3c] mt-0.5">86/100 · 91% Conf</div>
                </div>
              </div>

              {/* Narrative Summary */}
              <div className="p-3 rounded bg-[#14181f] border border-[#30353b] text-xs text-[#8d949d] leading-relaxed">
                Unauthorized individual breached Alpha perimeter wire at 02:14:06 IST. Target tracked
                continuously across 3 sensors over 18.4 seconds. Camera failure of CAM-03 autonomously
                recovered by backup PTZ CAM-06 slewed +32°. Cryptographic evidence package assembled.
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link
                  to="/app/incidents/INC-2026-0142"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1c2229] hover:bg-[#252b34] border border-[#30353b] text-xs text-white transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#477da8]" />
                  <span>OPEN INCIDENT WORKSPACE</span>
                </Link>

                <Link
                  to="/app/command"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold text-xs shadow transition-colors"
                >
                  <span>AUTHORIZE RESPONSE IN COMMAND CENTRE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              07 / 10 · INCIDENT
            </span>
            <button
              onClick={() => scrollToSection('evidence')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — FORENSIC EVIDENCE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 08 — EVIDENCE                                           */}
        {/* =============================================================== */}
        <section
          id="evidence"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 08 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">TAMPER-EVIDENT FORENSIC BUNDLE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              FORENSIC EVIDENCE PACKAGE
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Cryptographically attested chain of custody. Every critical detection is locked with
              SHA-256 digests on edge storage to guarantee evidentiary admissibility.
            </p>
          </div>

          {/* 8 Structured Forensic Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-auto py-3 font-mono">
            {/* 1 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">01. EVENT SNAPSHOT</div>
              <div className="text-xs font-bold text-white">Calibrated Keyframes</div>
              <p className="text-[11px] text-[#8d949d]">
                Optical & thermal synchronized keyframes captured at tripwire breach timestamp.
              </p>
            </div>

            {/* 2 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">02. EVENT CLIP</div>
              <div className="text-xs font-bold text-white">10s Pre/Post Video</div>
              <p className="text-[11px] text-[#8d949d]">
                Continuous buffered MP4 video package preserving 10s pre-breach approach context.
              </p>
            </div>

            {/* 3 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">03. TRACK TRAJECTORY</div>
              <div className="text-xs font-bold text-white">Geo-Vector Path</div>
              <p className="text-[11px] text-[#8d949d]">
                GPS-calibrated track coordinates, velocity telemetry, and bearing angle history.
              </p>
            </div>

            {/* 4 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">04. DETECTION METADATA</div>
              <div className="text-xs font-bold text-white">Bounding Boxes & Class</div>
              <p className="text-[11px] text-[#8d949d]">
                Per-frame coordinates, class confidence scores, and neural feature embeddings.
              </p>
            </div>

            {/* 5 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">05. CAMERA METADATA</div>
              <div className="text-xs font-bold text-white">Sensor Hardware Telemetry</div>
              <p className="text-[11px] text-[#8d949d]">
                Sensor ID, optical zoom focal length, PTZ azimuth/tilt angles, firmware hash.
              </p>
            </div>

            {/* 6 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">06. SWAN EVENTS</div>
              <div className="text-xs font-bold text-white">Cross-Camera Handoff</div>
              <p className="text-[11px] text-[#8d949d]">
                Distributed gossip events recording multi-sensor tracking and Re-ID similarity.
              </p>
            </div>

            {/* 7 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">07. RISK CALCULATION</div>
              <div className="text-xs font-bold text-white">6-Signal Threat Matrix</div>
              <p className="text-[11px] text-[#8d949d]">
                Mathematical weights and scoring factor breakdown justifying High Priority rank.
              </p>
            </div>

            {/* 8 */}
            <div className="p-3 rounded-lg bg-[#111419] border border-[#3f8f68]/40 space-y-1">
              <div className="text-[10px] text-[#3f8f68] font-bold">08. AUDIT TRAIL</div>
              <div className="text-xs font-bold text-white">SHA-256 Digest</div>
              <p className="text-[10px] text-[#8d949d] break-all font-mono">
                8f4b7a9201cde91f63a2b4...3e1a Immutable hash locked at edge.
              </p>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              08 / 10 · EVIDENCE
            </span>
            <button
              onClick={() => scrollToSection('command')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — COMMAND CENTRE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 09 — COMMAND CENTRE                                     */}
        {/* =============================================================== */}
        <section
          id="command"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#3f8f68]">
              <span className="px-1.5 py-0.2 rounded bg-[#3f8f68]/20 font-bold">SECTION 09 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">TACTICAL DECISION AUTHORITY</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              COMMAND CENTRE & HUMAN AUTHORITY
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              AI detects. SWAN follows. SHIELD recovers. <strong className="text-white">Operator decides.</strong> The
              human commander retains complete authority over all tactical responses.
            </p>
          </div>

          {/* Pipeline & Decision Actions */}
          <div className="my-auto py-3 space-y-5 font-mono">
            {/* Transmission Pipeline */}
            <div className="p-3.5 rounded-lg bg-[#14181f] border border-[#30353b] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#477da8]" />
                <span className="font-bold text-white">BOP-17 EDGE NODE</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#477da8] hidden sm:block" />
              <div className="flex items-center gap-2 text-[#8d949d]">
                <Lock className="w-3.5 h-3.5 text-[#3f8f68]" />
                <span>SECURE EVENT TRANSMISSION (TLS / MQTT)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#477da8] hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3f8f68]" />
                <span className="font-bold text-white">SECTOR COMMAND CENTRE</span>
              </div>
            </div>

            {/* 5 Human Decision Buttons */}
            <div className="space-y-2">
              <div className="text-xs text-[#8d949d] uppercase">
                5 AUTHORIZED OPERATOR ACTIONS (CLICK TO SIMULATE):
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  onClick={() => setSelectedIncidentAction('CONFIRM')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedIncidentAction === 'CONFIRM'
                      ? 'bg-[#18231c] border-[#3f8f68] text-white shadow-lg'
                      : 'bg-[#111419] border-[#30353b] text-[#8d949d] hover:border-[#8d949d] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-[#3f8f68]">CONFIRM</div>
                  <div className="text-[10px] mt-1 text-[#8d949d]">Dispatch border patrol QRT unit</div>
                </button>

                <button
                  onClick={() => setSelectedIncidentAction('DISMISS')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedIncidentAction === 'DISMISS'
                      ? 'bg-[#1a1e26] border-[#8d949d] text-white shadow-lg'
                      : 'bg-[#111419] border-[#30353b] text-[#8d949d] hover:border-[#8d949d] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white">DISMISS</div>
                  <div className="text-[10px] mt-1 text-[#8d949d]">Authorized patrol or false trigger</div>
                </button>

                <button
                  onClick={() => setSelectedIncidentAction('ASSIGN')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedIncidentAction === 'ASSIGN'
                      ? 'bg-[#151c24] border-[#477da8] text-white shadow-lg'
                      : 'bg-[#111419] border-[#30353b] text-[#8d949d] hover:border-[#8d949d] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-[#477da8]">ASSIGN</div>
                  <div className="text-[10px] mt-1 text-[#8d949d]">Allocate drone or secondary unit</div>
                </button>

                <button
                  onClick={() => setSelectedIncidentAction('ANNOTATE')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedIncidentAction === 'ANNOTATE'
                      ? 'bg-[#201d15] border-[#c28a28] text-white shadow-lg'
                      : 'bg-[#111419] border-[#30353b] text-[#8d949d] hover:border-[#8d949d] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-[#c28a28]">ANNOTATE</div>
                  <div className="text-[10px] mt-1 text-[#8d949d]">Add tactical intelligence notes</div>
                </button>

                <button
                  onClick={() => setSelectedIncidentAction('ESCALATE')}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedIncidentAction === 'ESCALATE'
                      ? 'bg-[#241517] border-[#c93c3c] text-white shadow-lg'
                      : 'bg-[#111419] border-[#30353b] text-[#8d949d] hover:border-[#8d949d] hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-[#c93c3c]">ESCALATE</div>
                  <div className="text-[10px] mt-1 text-[#8d949d]">Elevate to Sector & Brigade HQ</div>
                </button>
              </div>

              {selectedIncidentAction && (
                <div className="p-3 rounded bg-[#171b22] border border-[#477da8]/40 text-xs text-white flex items-center justify-between">
                  <span>Simulated Operator Choice: <strong>{selectedIncidentAction}</strong> executed for INC-2026-0142.</span>
                  <Link to="/app/command" className="text-[#477da8] hover:underline flex items-center gap-1 font-bold">
                    Open Live Workstation <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              09 / 10 · COMMAND CENTRE
            </span>
            <button
              onClick={() => scrollToSection('architecture')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — SYSTEM ARCHITECTURE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 10 — ARCHITECTURE & TECH STACK                          */}
        {/* =============================================================== */}
        <section
          id="architecture"
          className="min-h-[calc(100svh-52px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 10 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">HARDWARE & SOFTWARE BLUEPRINT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              SYSTEM ARCHITECTURE & TECH STACK
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Ruggedized edge architecture designed for mission-critical reliability in air-gapped,
              harsh border environments.
            </p>
          </div>

          {/* Architecture Pipeline & Tech Badges */}
          <div className="my-auto py-3 space-y-4 font-mono">
            {/* Pipeline Diagram Strip */}
            <div className="p-4 rounded-lg bg-[#111419] border border-[#30353b] space-y-2">
              <div className="text-xs text-[#8d949d] uppercase">END-TO-END DATAFLOW:</div>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-white">EXISTING CCTV</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-white">BOP EDGE NODE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">AI DETECTION</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">TRACKING</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#3f8f68]">SWAN</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#3f8f68]">SHIELD</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#c28a28]">RISK ENGINE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">EVIDENCE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#3f8f68] text-white font-bold">COMMAND CENTRE</span>
              </div>
            </div>

            {/* Tech Stack Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <div className="p-3 rounded bg-[#13161c] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">PROTOCOLS</div>
                <div className="text-xs font-bold text-white mt-0.5">RTSP / ONVIF</div>
                <div className="text-[10px] text-[#8d949d] mt-1">MQTT / WebSockets</div>
              </div>

              <div className="p-3 rounded bg-[#13161c] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">VISION / AI</div>
                <div className="text-xs font-bold text-[#477da8] mt-0.5">RT-DETR / YOLO</div>
                <div className="text-[10px] text-[#8d949d] mt-1">ByteTrack / BoT-SORT</div>
              </div>

              <div className="p-3 rounded bg-[#13161c] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">RE-ID EMBEDDING</div>
                <div className="text-xs font-bold text-[#3f8f68] mt-0.5">Deep Cosine Re-ID</div>
                <div className="text-[10px] text-[#8d949d] mt-1">ONNX Runtime 14ms</div>
              </div>

              <div className="p-3 rounded bg-[#13161c] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">BACKEND & API</div>
                <div className="text-xs font-bold text-white mt-0.5">FastAPI / Python 3.12</div>
                <div className="text-[10px] text-[#8d949d] mt-1">AsyncIO / Uvicorn</div>
              </div>

              <div className="p-3 rounded bg-[#13161c] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">PERSISTENCE</div>
                <div className="text-xs font-bold text-[#c28a28] mt-0.5">PostgreSQL / PostGIS</div>
                <div className="text-[10px] text-[#8d949d] mt-1">Redis Pub/Sub Cache</div>
              </div>

              <div className="p-3 rounded bg-[#13161c] border border-[#30353b]">
                <div className="text-[10px] text-[#8d949d]">EVIDENCE STORE</div>
                <div className="text-xs font-bold text-[#3f8f68] mt-0.5">MinIO S3 Edge</div>
                <div className="text-[10px] text-[#8d949d] mt-1">SHA-256 Crypto Hash</div>
              </div>
            </div>

            {/* Launch & Operator Terminal CTA */}
            <div className="p-4 rounded-lg bg-[#14181f] border border-[#477da8]/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">READY FOR OPERATIONAL DEPLOYMENT</div>
                <div className="text-xs text-[#8d949d]">
                  BOP-17 Command Station is fully initialized. Launch the operator workstation.
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollToSection('hero')}
                  className="flex items-center gap-1.5 px-3 py-2 rounded bg-[#1c2229] hover:bg-[#252b34] border border-[#30353b] text-xs font-bold text-white transition-colors"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>BACK TO TOP</span>
                </button>

                <Link
                  to="/app/command"
                  className="flex items-center gap-2 px-4 py-2 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold text-xs shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <span>LAUNCH C4I COMMAND CENTRE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">
              10 / 10 · SYSTEM ARCHITECTURE
            </span>
            <div className="flex items-center gap-4 text-xs font-mono text-[#8d949d]">
              <Link to="/login" className="hover:text-white transition-colors">
                OPERATOR LOGIN
              </Link>
              <span>•</span>
              <button
                onClick={() => scrollToSection('hero')}
                className="hover:text-white transition-colors flex items-center gap-1"
              >
                <span>TOP</span>
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default DrishtiPublicLanding;
