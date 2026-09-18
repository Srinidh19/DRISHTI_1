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
  FileText,
  Clock,
  CheckSquare,
  AlertOctagon,
  Eye,
  Sun,
  Moon,
  CloudFog,
  Sparkles,
  History as HistoryIcon,
  ShieldCheck,
  Zap,
  Maximize2
} from 'lucide-react';
import {
  SimulatedCctvViewer,
  CctvCameraId,
  CctvSimulationState,
  CAMERA_NAMES
} from '../components/video/SimulatedCctvViewer';
import {
  DEMO_SEQUENCE,
  SHIELD_RECOVERY_PHASES,
  DemoVisibilityMode,
  DemoStepMetadata
} from '../services/demoStateMachine';

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
  },
  {
    id: 'CAM-PERIMETER-08',
    name: 'Perimeter Boundary East',
    sector: 'Sector 08 East',
    type: 'Thermal + Optical',
    image: '/media/cctv/cam-07.jpg',
    status: 'LIVE',
    role: 'Extended Buffer Zone'
  },
  {
    id: 'CAM-VALLEY-09',
    name: 'Depression & Valley Approach',
    sector: 'Sector 09 Valley',
    type: 'Low-Light Optical',
    image: '/media/cctv/cam-06.jpg',
    status: 'LIVE',
    role: 'Terrain Depression Overwatch'
  },
  {
    id: 'CAM-BARRIER-10',
    name: 'Service Road Barrier Junction',
    sector: 'Sector 10 Junction',
    type: 'Optical 1080p',
    image: '/media/cctv/cam-road-05.jpg',
    status: 'STANDBY',
    role: 'Secondary Logistics Road'
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

  // -------------------------------------------------------------
  // CENTRAL DEMO STATE MACHINE
  // -------------------------------------------------------------
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0); // 0 to 9 in DEMO_SEQUENCE
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showSteps, setShowSteps] = useState<boolean>(true); // Only toggles explanatory UI, NOT simulation
  const [visibilityMode, setVisibilityMode] = useState<DemoVisibilityMode>('NIGHT_IR');
  const [activeCamera, setActiveCamera] = useState<CctvCameraId>('CAM-FENCE-03');

  // Interactive SHIELD Recovery Demonstration State
  const [shieldRecoveryPhase, setShieldRecoveryPhase] = useState<number>(0); // 0 = idle, 1..8
  const [isShieldRecovering, setIsShieldRecovering] = useState<boolean>(false);

  // Incident Lifecycle in Public Demo
  const [incidentConfirmed, setIncidentConfirmed] = useState<boolean>(false);
  const [incidentDismissed, setIncidentDismissed] = useState<boolean>(false);
  const [selectedIncidentAction, setSelectedIncidentAction] = useState<string | null>(null);
  const [incidentTab, setIncidentTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
  const [confirmationTime, setConfirmationTime] = useState<string>('02:16:34 IST');

  const currentStep: DemoStepMetadata = DEMO_SEQUENCE[currentStepIndex] || DEMO_SEQUENCE[0];

  // Synchronize active camera with state machine when step changes
  useEffect(() => {
    setActiveCamera(currentStep.activeCamera);
  }, [currentStepIndex, currentStep.activeCamera]);

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

  // Main Demo Auto-play Stepper
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev >= DEMO_SEQUENCE.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // SHIELD Interactive Recovery Stepper
  useEffect(() => {
    if (!isShieldRecovering) return;
    if (shieldRecoveryPhase >= 8) {
      setIsShieldRecovering(false);
      return;
    }
    const timer = setTimeout(() => {
      setShieldRecoveryPhase(prev => prev + 1);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isShieldRecovering, shieldRecoveryPhase]);

  // IntersectionObserver to highlight active section in rail
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220;
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

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // -------------------------------------------------------------
  // CONTROLLER ACTIONS (REAL VISIBLE STATE CHANGES)
  // -------------------------------------------------------------
  const handlePlayToggle = () => {
    if (!isPlaying && currentStepIndex >= DEMO_SEQUENCE.length - 1) {
      // If at end, restart from beginning
      setCurrentStepIndex(0);
      setIncidentConfirmed(false);
      setIncidentDismissed(false);
    }
    setIsPlaying(prev => !prev);
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setShieldRecoveryPhase(0);
    setIsShieldRecovering(false);
    setIncidentConfirmed(false);
    setIncidentDismissed(false);
    setSelectedIncidentAction(null);
    setIncidentTab('ACTIVE');
    setActiveCamera('CAM-FENCE-03');
  };

  const handleSimulateTrack = () => {
    setIsPlaying(false);
    // Jump directly to SWAN handoff sequence (State 4)
    setCurrentStepIndex(3);
    setActiveCamera('CAM-04');
    scrollToSection('swan');
  };

  const handleSimulateCameraFailure = () => {
    setIsPlaying(false);
    // Jump directly to Camera Failure (State 6)
    setCurrentStepIndex(5);
    setActiveCamera('CAM-FENCE-03');
    scrollToSection('shield');
  };

  const handleStartShieldRecovery = () => {
    setIsPlaying(false);
    setShieldRecoveryPhase(1);
    setIsShieldRecovering(true);
    scrollToSection('shield');
  };

  const handleConfirmIncident = () => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')} IST`;
    setConfirmationTime(timeStr);
    setIncidentConfirmed(true);
    setSelectedIncidentAction('CONFIRM');
    setIncidentTab('HISTORY');
  };

  const handleDismissIncident = () => {
    setIncidentDismissed(true);
    setSelectedIncidentAction('DISMISS');
    setIncidentTab('HISTORY');
  };

  // -------------------------------------------------------------
  // CCTV VIEWER SIMULATION STATES (INDEPENDENT OF SHOW STEPS)
  // -------------------------------------------------------------
  const mainSimulationState: CctvSimulationState = useMemo(() => {
    return {
      activeCameraId: activeCamera,
      stageId: currentStep.index,
      stageSlug: currentStep.id,
      isVehiclePresent: activeCamera === 'CAM-ROAD-05' || activeCamera === 'CAM-GATE-02' || activeCamera === 'CAM-BARRIER-10',
      isAnprActive: activeCamera === 'CAM-ROAD-05' || activeCamera === 'CAM-GATE-02',
      isPersonPresent: currentStep.isPersonPresent,
      isFenceCrossed: currentStep.isFenceCrossed,
      isSwanActive: currentStep.isSwanActive,
      isCameraFailed: currentStep.isCameraFailed && (activeCamera === 'CAM-FENCE-03' || activeCamera === 'CAM-03'),
      isShieldRecovered: currentStep.isShieldRecovered,
      visibilityMode: visibilityMode,
      customConfidence: currentStep.confidence,
      statusText: currentStep.telemetry
    };
  }, [activeCamera, currentStep, visibilityMode]);

  const shieldActiveState: CctvSimulationState = useMemo(() => {
    if (shieldRecoveryPhase > 0) {
      const activePhase = SHIELD_RECOVERY_PHASES[shieldRecoveryPhase - 1] || SHIELD_RECOVERY_PHASES[7];
      return {
        activeCameraId: activePhase.activeCamera,
        isPersonPresent: true,
        isFenceCrossed: true,
        isSwanActive: true,
        isCameraFailed: activePhase.isFailed,
        isShieldRecovered: activePhase.isRecovered,
        visibilityMode: visibilityMode,
        statusText: activePhase.title
      };
    }
    return {
      activeCameraId: currentStep.isShieldRecovered ? 'CAM-06' : 'CAM-FENCE-03',
      isPersonPresent: currentStep.isPersonPresent,
      isFenceCrossed: currentStep.isFenceCrossed,
      isSwanActive: true,
      isCameraFailed: currentStep.isCameraFailed,
      isShieldRecovered: currentStep.isShieldRecovered,
      visibilityMode: visibilityMode,
      statusText: currentStep.telemetry
    };
  }, [shieldRecoveryPhase, currentStep, visibilityMode]);

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#e5e7eb] font-sans antialiased selection:bg-[#477da8]/30 selection:text-white overflow-x-hidden w-full">
      {/* ================================================================= */}
      {/* TOP NAVIGATION BAR (Clean Branding: Removed BOP-17 from header)    */}
      {/* ================================================================= */}
      <header className="sticky top-0 z-50 bg-[#0d1015]/95 backdrop-blur-md border-b border-[#30353b] px-4 md:px-8 min-h-[52px] h-[52px] flex items-center justify-between shadow-lg">
        {/* Brand & Platform Identity */}
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
              </div>
              <span className="hidden sm:block text-[9px] text-[#8d949d] font-mono tracking-tight">
                Intelligent Border Surveillance & Response Platform
              </span>
            </div>
          </button>
        </div>

        {/* Center Navigation Links */}
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

        {/* Right Station Status & Direct CTA */}
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
      {/* CENTRAL DEMO CONTROLLER BAR (Sticky, Functional, Real Action)     */}
      {/* ================================================================= */}
      <div className="sticky top-[52px] z-40 bg-[#12151b]/95 backdrop-blur-md border-b border-[#30353b] px-3 sm:px-6 py-2 shadow-xl font-mono select-none">
        <div className="max-w-[1360px] mx-auto flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Main Controls (PLAY / PAUSE, RESTART, SIMULATE BUTTONS) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* PLAY / PAUSE */}
            <button
              onClick={handlePlayToggle}
              id="demo-btn-play"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold transition-all shadow ${
                isPlaying
                  ? 'bg-[#c93c3c] text-white hover:bg-[#c93c3c]/90'
                  : 'bg-[#3f8f68] text-white hover:bg-[#3f8f68]/90'
              }`}
              title={isPlaying ? 'Pause surveillance scenario' : 'Play autonomous 10-state pipeline'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'PAUSE STORY' : 'PLAY STORY'}</span>
            </button>

            {/* RESTART */}
            <button
              onClick={handleRestart}
              id="demo-btn-restart"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#1b2027] hover:bg-[#252b34] border border-[#30353b] text-[#8d949d] hover:text-white transition-colors"
              title="Reset surveillance simulation to baseline State 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESTART</span>
            </button>

            <div className="h-4 w-px bg-[#30353b] hidden sm:block" />

            {/* SIMULATE TRACK */}
            <button
              onClick={handleSimulateTrack}
              id="demo-btn-track"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#17202b] hover:bg-[#1f2b3b] border border-[#477da8]/60 text-[#477da8] hover:text-white font-semibold transition-all"
              title="Instantly demonstrate YOLO target tracking, trajectory line & SWAN CAM-04 handoff"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>SIMULATE TRACK</span>
            </button>

            {/* SIMULATE CAMERA FAILURE */}
            <button
              onClick={handleSimulateCameraFailure}
              id="demo-btn-failure"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#251717] hover:bg-[#331c1c] border border-[#c93c3c]/60 text-[#c93c3c] hover:text-white font-semibold transition-all"
              title="Simulate CAM-FENCE-03 heartbeat lost, video static & SHIELD autonomous PTZ recovery"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SIMULATE CAMERA FAILURE</span>
            </button>

            {/* TRIAGE & RECOVERY SEQUENCE */}
            <button
              onClick={handleStartShieldRecovery}
              id="demo-btn-recovery"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#201d14] hover:bg-[#2c2618] border border-[#c28a28]/60 text-[#c28a28] hover:text-white font-semibold transition-all"
              title="Execute full 8-phase SHIELD autonomous triage and PTZ slew sequence"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>TRIAGE & RECOVERY</span>
            </button>
          </div>

          {/* Visibility Switcher & SHOW STEPS Toggle */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* VISIBILITY SELECTOR (Restrained Status Indicator) */}
            <div className="flex items-center bg-[#161a22] border border-[#30353b] rounded p-0.5 text-[11px]">
              <span className="px-2 text-[#8d949d] font-bold text-[10px] hidden md:inline">VISIBILITY:</span>
              <button
                onClick={() => setVisibilityMode('DAY')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  visibilityMode === 'DAY' ? 'bg-[#477da8] text-white font-bold' : 'text-[#8d949d] hover:text-white'
                }`}
                title="Optical daylight mode (Confidence: 0.94)"
              >
                DAY
              </button>
              <button
                onClick={() => setVisibilityMode('LOW_LIGHT')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  visibilityMode === 'LOW_LIGHT' ? 'bg-[#477da8] text-white font-bold' : 'text-[#8d949d] hover:text-white'
                }`}
                title="Twilight dusk mode (Confidence: 0.87)"
              >
                LOW LIGHT
              </button>
              <button
                onClick={() => setVisibilityMode('NIGHT_IR')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  visibilityMode === 'NIGHT_IR' ? 'bg-[#3f8f68] text-white font-bold' : 'text-[#8d949d] hover:text-white'
                }`}
                title="Infrared Thermal Surveillance (Confidence: 0.91)"
              >
                NIGHT / IR
              </button>
              <button
                onClick={() => setVisibilityMode('FOG')}
                className={`px-2 py-0.5 rounded transition-colors ${
                  visibilityMode === 'FOG' ? 'bg-[#c28a28] text-black font-bold' : 'text-[#8d949d] hover:text-white'
                }`}
                title="Atmospheric Fog / Low Visibility (Confidence: 0.68 with SWAN Corroboration)"
              >
                FOG
              </button>
            </div>

            {/* SHOW STEPS TOGGLE (Only hides/shows explanatory layer) */}
            <button
              onClick={() => setShowSteps(prev => !prev)}
              id="demo-btn-show-steps"
              className={`px-2.5 py-1 rounded border text-xs font-semibold transition-colors ${
                showSteps
                  ? 'bg-[#1e2530] text-white border-[#477da8]/60'
                  : 'bg-[#15181f] text-[#8d949d] border-[#30353b]'
              }`}
              title="Toggles explanatory text panels without pausing the video simulation"
            >
              STEPS: {showSteps ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Live System State Progress Strip */}
        <div className="max-w-[1360px] mx-auto mt-2 pt-1.5 border-t border-[#30353b]/60 flex items-center justify-between text-[11px] text-[#8d949d]">
          <div className="flex items-center gap-2 truncate">
            <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 text-[#477da8] font-bold border border-[#477da8]/30">
              STEP {currentStep.index}/10
            </span>
            <span className="font-bold text-white truncate">{currentStep.title}</span>
            <span className="hidden md:inline text-[#8d949d]">&bull; {currentStep.telemetry}</span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] text-[#8d949d]">
              SENSOR: <strong className="text-white">{activeCamera}</strong>
            </span>
            <span className="text-[10px] text-[#8d949d]">
              RISK: <strong className={currentStep.riskScore > 75 ? 'text-[#c93c3c]' : 'text-[#3f8f68]'}>{currentStep.riskScore}/100</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* FLOATING VERTICAL SECTION INDICATOR RAIL (Desktop Right Side)    */}
      {/* ================================================================= */}
      <aside
        aria-label="Section Navigation Rail"
        className="fixed right-3 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-2 p-1.5 rounded-full bg-[#111419]/80 backdrop-blur-md border border-[#30353b] shadow-2xl"
      >
        {SECTIONS.map(sec => {
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
              <div className="absolute right-7 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-[#141820] text-white text-[11px] font-mono font-medium px-2 py-1 rounded border border-[#30353b] shadow whitespace-nowrap">
                <span className="text-[#477da8] font-bold mr-1">{sec.number}</span>
                {sec.title}
              </div>
            </button>
          );
        })}
      </aside>

      {/* ================================================================= */}
      {/* MAIN CONTENT AREA: 10 SECTIONS, NORMAL FLOW, 1366x768 OPTIMIZED   */}
      {/* ================================================================= */}
      <main className="w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 xl:pr-14">
        {/* =============================================================== */}
        {/* SECTION 01 — HERO                                               */}
        {/* =============================================================== */}
        <section
          id="hero"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-4 sm:py-6 flex flex-col justify-between"
        >
          {/* Top Operational Eyebrow */}
          <div className="flex items-center justify-between border-b border-[#30353b]/80 pb-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8d949d]">
              <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-pulse" />
              <span className="text-white font-bold tracking-wider uppercase">DRISHTI SURVEILLANCE FABRIC</span>
              <span className="text-[#30353b]">|</span>
              <span>AUTONOMOUS PERIMETER DEFENSE SYSTEM</span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span>AIR-GAPPED EDGE NODE</span>
              <span className="px-1.5 py-0.5 rounded bg-[#477da8]/15 text-[#477da8] text-[10px] font-bold border border-[#477da8]/30">
                14MS INFERENCE
              </span>
            </div>
          </div>

          {/* Hero Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto items-center py-3">
            {/* Left: Headline & Core Narrative (7 Cols) */}
            <div className="lg:col-span-7 space-y-3">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-mono">
                  DRISHTI
                </h1>
                <p className="text-base sm:text-lg font-medium text-[#477da8] font-mono">
                  Intelligent Border Surveillance & Response Platform
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#8d949d] leading-relaxed max-w-2xl">
                DRISHTI connects standard fixed and PTZ border surveillance cameras into an autonomous,
                collaborative edge mesh. It computes real-time intruder tracks via <strong className="text-white">SWAN</strong> cross-camera
                handoffs, autonomously heals sensor blind zones via <strong className="text-white">SHIELD</strong> motorized PTZ slew, and preserves
                an immutable cryptographic audit trail while keeping human commanders in complete operational authority.
              </p>

              {/* 4 Core Pillars */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
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
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <button
                  onClick={() => {
                    handlePlayToggle();
                    scrollToSection('surveillance');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold font-mono text-xs shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>START SURVEILLANCE DEMO</span>
                </button>

                <Link
                  to="/app/command"
                  className="flex items-center gap-2 px-3.5 py-2 rounded bg-[#1c2229] hover:bg-[#252b34] border border-[#30353b] text-white font-mono text-xs font-semibold transition-colors"
                >
                  <span>ENTER COMMAND WORKSTATION</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#8d949d]" />
                </Link>
              </div>

              {/* Explanatory Step Panel (Conditionally rendered when showSteps is ON) */}
              {showSteps && (
                <div className="p-3 rounded bg-[#14181f] border border-[#477da8]/40 text-xs font-mono space-y-1">
                  <div className="text-[#477da8] font-bold flex items-center justify-between">
                    <span>STEP {currentStep.index} / 10 &bull; {currentStep.shortLabel}</span>
                    <span className="text-[10px] text-[#8d949d]">{currentStep.telemetry}</span>
                  </div>
                  <p className="text-[#8d949d] leading-normal">{currentStep.description}</p>
                </div>
              )}
            </div>

            {/* Right: Primary High-Fidelity CCTV Video Feed (5 Cols) */}
            <div className="lg:col-span-5">
              <div className="rounded-lg overflow-hidden border border-[#30353b] bg-[#111419] shadow-2xl">
                <div className="px-3 py-1.5 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <Camera className="w-3.5 h-3.5 text-[#477da8]" />
                    <span className="font-bold text-white text-[11px] sm:text-xs">
                      {mainSimulationState.activeCameraId} MONITOR
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-[#3f8f68]/20 text-[#3f8f68] text-[9px] font-bold border border-[#3f8f68]/40">
                    {mainSimulationState.isCameraFailed ? 'OFFLINE' : 'ONLINE'}
                  </span>
                </div>

                <div className="w-full aspect-video">
                  <SimulatedCctvViewer state={mainSimulationState} className="w-full h-full" />
                </div>

                <div className="px-3 py-1.5 bg-[#111419] text-[10px] sm:text-[11px] font-mono text-[#8d949d] flex items-center justify-between border-t border-[#30353b]">
                  <span>PRIMARY SENSOR: {mainSimulationState.activeCameraId}</span>
                  <span className="text-[#3f8f68]">
                    {mainSimulationState.isFenceCrossed ? 'BREACH ANALYZED' : 'VIRTUAL FENCE ARMED'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-2">
            <button
              onClick={() => scrollToSection('surveillance')}
              className="flex items-center gap-1.5 text-xs font-mono text-[#8d949d] hover:text-white transition-colors group"
            >
              <span>SCROLL TO SURVEILLANCE</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            </button>

            <button
              onClick={() => scrollToSection('surveillance')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all hover:border-[#477da8]"
            >
              <span>NEXT — SURVEILLANCE WALL</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 02 — SURVEILLANCE WALL (11 DISTINCT CAMERAS MATRIX)      */}
        {/* =============================================================== */}
        <section
          id="surveillance"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 02 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">PERIMETER SURVEILLANCE NETWORK (11 CAMERAS)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              THE SURVEILLANCE ENVIRONMENT
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Monitored border perimeter fabric comprising 11 distinct sensors across fencing, access roads,
              watchtower overwatch, and terrain depressions. Click any camera in the matrix to route its stream.
            </p>
          </div>

          {/* Desktop Surveillance Wall Grid (60% Primary Feed / 40% Matrix) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 my-auto py-3 items-start">
            {/* Left: Primary Active Surveillance Monitor (~60% / 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col gap-2 rounded-lg border border-[#30353b] bg-[#111419] p-3 shadow-2xl">
              {/* Monitor OSD Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#30353b] text-xs font-mono">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      mainSimulationState.isCameraFailed ? 'bg-[#c93c3c]' : 'bg-[#3f8f68] animate-pulse'
                    }`}
                  />
                  <span className="font-bold text-white uppercase tracking-wide truncate">
                    {activeCamera}: {CAMERAS.find(c => c.id === activeCamera)?.name}
                  </span>
                  <span className="hidden sm:inline px-1.5 py-0.2 rounded bg-[#181b20] border border-[#30353b] text-[#8d949d] text-[10px]">
                    {CAMERAS.find(c => c.id === activeCamera)?.sector}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#477da8] shrink-0">
                  <span className="hidden md:inline">1080P/30FPS RTSP</span>
                  <span className="px-1.5 py-0.5 rounded bg-[#477da8]/15 border border-[#477da8]/30 font-bold">
                    14MS LATENCY
                  </span>
                </div>
              </div>

              {/* Main CCTV Stream Container (Strict 16:9 uncropped, object-contain) */}
              <div className="w-full aspect-video rounded overflow-hidden bg-black border border-[#262b33]">
                <SimulatedCctvViewer state={mainSimulationState} className="w-full h-full" />
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
                  <span className="text-[10px] text-[#3f8f68] font-bold">EDGE MESH SYNCED</span>
                </div>
              </div>
            </div>

            {/* Right: 11-Camera Selector Matrix & Telemetry (~40% / 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-2.5 font-mono shadow-xl">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#30353b]">
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-[#477da8]" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      CAMERA MATRIX (11 FEEDS)
                    </span>
                  </div>
                  <span className="px-1.5 py-0.2 rounded bg-[#3f8f68]/20 text-[#3f8f68] text-[10px] font-bold border border-[#3f8f68]/40">
                    11 / 11 MONITORED
                  </span>
                </div>

                {/* 11-Camera Visual Grid (2 Columns, scrollable) */}
                <div className="grid grid-cols-2 gap-2 max-h-[390px] overflow-y-auto pr-1">
                  {CAMERAS.map(cam => {
                    const isSelected = activeCamera === cam.id;
                    const isFailed = mainSimulationState.isCameraFailed && (cam.id === 'CAM-FENCE-03' || cam.id === 'CAM-03');
                    return (
                      <button
                        key={cam.id}
                        onClick={() => setActiveCamera(cam.id)}
                        className={`group relative rounded border p-1.5 text-left transition-all font-mono flex flex-col gap-1 ${
                          isSelected
                            ? 'bg-[#1a2330] border-[#477da8] shadow-md ring-1 ring-[#477da8]/50'
                            : 'bg-[#14181f] border-[#30353b] hover:border-[#8d949d]/60 hover:bg-[#181d26]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-white">{cam.id}</span>
                          <span
                            className={`px-1 py-0.2 rounded text-[8px] font-bold border ${
                              isFailed
                                ? 'bg-[#c93c3c]/20 text-[#c93c3c] border-[#c93c3c]/40'
                                : cam.status === 'TRACKING'
                                ? 'bg-[#c28a28]/20 text-[#c28a28] border-[#c28a28]/40'
                                : cam.status === 'BACKUP'
                                ? 'bg-[#3f8f68]/20 text-[#3f8f68] border-[#3f8f68]/40'
                                : 'bg-[#1c222b] text-[#8d949d] border-[#30353b]'
                            }`}
                          >
                            {isFailed ? 'OFFLINE' : cam.status}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#8d949d] truncate">{cam.name}</div>
                        <div className="text-[9px] text-[#477da8] truncate">{cam.sector}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Explanations (Independent of simulation state) */}
              {showSteps && (
                <div className="p-3 rounded-lg bg-[#14181f] border border-[#30353b] text-xs font-mono space-y-1">
                  <div className="text-[#3f8f68] font-bold text-xs uppercase flex items-center justify-between">
                    <span>LIVE PIPELINE EXPLANATION</span>
                    <span className="text-[10px] text-[#8d949d]">SHOW STEPS ACTIVE</span>
                  </div>
                  <p className="text-[#8d949d] leading-normal">{currentStep.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">02 / 10 &bull; SURVEILLANCE</span>
            <button
              onClick={() => scrollToSection('edge-ai')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#171b22] hover:bg-[#202732] border border-[#30353b] text-xs font-mono text-white font-bold transition-all"
            >
              <span>NEXT — EDGE AI</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#477da8]" />
            </button>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 03 — EDGE AI DETECTION                                  */}
        {/* =============================================================== */}
        <section
          id="edge-ai"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#477da8]">
              <span className="px-1.5 py-0.2 rounded bg-[#477da8]/20 font-bold">SECTION 03 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">14MS EDGE NEURAL INFERENCE</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              EDGE AI DETECTION & CLASSIFICATION
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Local computer vision at 14ms edge latency. Neural silhouette extraction segregates human intruders
              from routine patrol vehicles and boundary wildlife directly on ruggedized hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-3 items-center">
            {/* Left: Edge AI CCTV Stream (7 Cols) */}
            <div className="lg:col-span-7 rounded-lg overflow-hidden border border-[#30353b] bg-[#111419] shadow-2xl">
              <div className="p-2.5 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#c28a28] animate-pulse" />
                  <span className="font-bold text-white">TARGET ACQUIRED // CAM-FENCE-03</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#c28a28]/20 text-[#c28a28] text-[10px] font-bold border border-[#c28a28]/40">
                  PERSON &bull; T-104 &bull; {(mainSimulationState.customConfidence || 0.91 * 100).toFixed(0)}%
                </span>
              </div>
              <div className="w-full aspect-video">
                <SimulatedCctvViewer
                  state={{
                    ...mainSimulationState,
                    activeCameraId: 'CAM-FENCE-03',
                    isPersonPresent: true,
                    isCameraFailed: false
                  }}
                  className="w-full h-full"
                />
              </div>
              <div className="p-2.5 bg-[#111419] text-[11px] font-mono text-[#8d949d] flex items-center justify-between border-t border-[#30353b]">
                <span>BOUNDING BOX: [x: 412, y: 180, w: 78, h: 164]</span>
                <span className="text-[#477da8]">VELOCITY: 1.8 M/S &bull; BEARING: 042° NE</span>
              </div>
            </div>

            {/* Right: 3 Core Vision Pillars (5 Cols) */}
            <div className="lg:col-span-5 space-y-3 font-mono">
              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#477da8]/20 text-[#477da8] text-2xs flex items-center justify-center font-bold">1</span>
                    DETECTION
                  </span>
                  <span className="text-2xs text-[#477da8]">RT-DETR / YOLOv8</span>
                </div>
                <p className="text-xs text-[#8d949d] leading-relaxed">
                  Evaluates optical and thermal silhouettes at 30 FPS against calibrated virtual fence
                  boundaries in under 14ms with zero cloud dependencies.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#477da8]/20 text-[#477da8] text-2xs flex items-center justify-center font-bold">2</span>
                    TRACKING
                  </span>
                  <span className="text-2xs text-[#3f8f68]">ByteTrack / BoT-SORT</span>
                </div>
                <p className="text-xs text-[#8d949d] leading-relaxed">
                  Maintains target ID <strong className="text-white">T-104</strong> across momentary occlusion, terrain dips,
                  and sensor handovers without track fragmentation.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-[#477da8]/20 text-[#477da8] text-2xs flex items-center justify-center font-bold">3</span>
                    CLASSIFICATION
                  </span>
                  <span className="text-2xs text-[#c28a28]">Multi-Class Neural</span>
                </div>
                <p className="text-xs text-[#8d949d] leading-relaxed">
                  Differentiates human trespassers from routine patrol utility trucks (V-203) and boundary
                  livestock, reducing nuisance false alarms by 94%.
                </p>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">03 / 10 &bull; EDGE AI</span>
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
        {/* SECTION 04 — SWAN (ACTION-FIRST: CAMERA HANDOFF HERO)            */}
        {/* =============================================================== */}
        <section
          id="swan"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
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
              SWAN coordinates neighboring cameras, predicts target arrival trajectories, and maintains continuous
              cross-sensor track identity across border sectors without human guidance.
            </p>
          </div>

          {/* SWAN HERO VISUAL: 3-STAGE HANDOFF FLOW */}
          <div className="my-auto py-3 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {/* Step 1: CAM-FENCE-03 Origin */}
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-2 font-mono shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#c93c3c]/20 text-[#c93c3c] font-bold border border-[#c93c3c]/30">
                    1. ORIGIN BREACH
                  </span>
                  <span className="text-white font-bold">CAM-FENCE-03</span>
                </div>
                <div className="w-full aspect-video rounded overflow-hidden relative border border-[#30353b] bg-black">
                  <SimulatedCctvViewer
                    state={{
                      activeCameraId: 'CAM-FENCE-03',
                      isPersonPresent: true,
                      isFenceCrossed: true,
                      isSwanActive: false,
                      isCameraFailed: false,
                      isShieldRecovered: false,
                      visibilityMode: visibilityMode
                    }}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[11px] text-[#8d949d] leading-normal">
                  Target <strong className="text-white">T-104</strong> cuts through perimeter wire. Trajectory vector: 1.8 m/s, bearing 042° NE.
                </p>
              </div>

              {/* Step 2: CAM-04 Predicted Intersection */}
              <div className="p-3 rounded-lg bg-[#111419] border border-[#477da8] space-y-2 font-mono shadow-xl ring-1 ring-[#477da8]/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#477da8]/20 text-[#477da8] font-bold border border-[#477da8]/40">
                    2. SWAN HANDOFF
                  </span>
                  <span className="text-white font-bold">CAM-04</span>
                </div>
                <div className="w-full aspect-video rounded overflow-hidden relative border border-[#30353b] bg-black">
                  <SimulatedCctvViewer
                    state={{
                      activeCameraId: 'CAM-04',
                      isPersonPresent: true,
                      isFenceCrossed: true,
                      isSwanActive: true,
                      isCameraFailed: false,
                      isShieldRecovered: false,
                      visibilityMode: visibilityMode
                    }}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[11px] text-[#8d949d] leading-normal">
                  SWAN pre-alerts <strong className="text-white">CAM-04</strong> road junction. Re-ID cosine similarity matches at 94%.
                </p>
              </div>

              {/* Step 3: CAM-06 Overwatch Lock */}
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-2 font-mono shadow-lg">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#3f8f68]/20 text-[#3f8f68] font-bold border border-[#3f8f68]/30">
                    3. CORROBORATION
                  </span>
                  <span className="text-white font-bold">CAM-06 PTZ</span>
                </div>
                <div className="w-full aspect-video rounded overflow-hidden relative border border-[#30353b] bg-black">
                  <SimulatedCctvViewer
                    state={{
                      activeCameraId: 'CAM-06',
                      isPersonPresent: true,
                      isFenceCrossed: true,
                      isSwanActive: true,
                      isCameraFailed: false,
                      isShieldRecovered: true,
                      visibilityMode: visibilityMode
                    }}
                    className="w-full h-full"
                  />
                </div>
                <p className="text-[11px] text-[#8d949d] leading-normal">
                  Elevated PTZ <strong className="text-white">CAM-06</strong> cross-validates track coordinates across ridge contours.
                </p>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="p-3 rounded-lg bg-[#14181f] border border-[#30353b] grid grid-cols-3 gap-2 text-center font-mono">
              <div>
                <div className="text-[10px] text-[#8d949d]">RE-ID CONFIDENCE</div>
                <div className="text-base font-bold text-[#3f8f68]">94% Cosine Lock</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8d949d]">PREDICTED BUFFER</div>
                <div className="text-base font-bold text-[#477da8]">8.2s Advance Lead</div>
              </div>
              <div>
                <div className="text-[10px] text-[#8d949d]">TRACK CONTINUITY</div>
                <div className="text-base font-bold text-white">100% Unfragmented</div>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">04 / 10 &bull; SWAN</span>
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
        {/* SECTION 05 — SHIELD (ACTION-FIRST: 8-PHASE RECOVERY)             */}
        {/* =============================================================== */}
        <section
          id="shield"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c93c3c]">
              <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 font-bold">SECTION 05 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">AUTONOMOUS FAULT TRIAGE & GAP RESTORATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              SHIELD — AUTONOMOUS RESILIENCE ENGINE
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Eliminates single points of failure. When a perimeter camera loses heartbeat or suffers physical
              tampering, SHIELD models the blind zone and slews adjacent PTZ cameras to heal coverage.
            </p>
          </div>

          {/* Interactive Stepped Recovery Visual (7 Cols Video / 5 Cols Sequence) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto py-2 items-start">
            {/* Left: Active Monitor (Strict uncropped 16:9) */}
            <div className="lg:col-span-7 rounded-lg overflow-hidden border border-[#30353b] bg-[#111419] shadow-2xl">
              <div className="p-2 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      shieldActiveState.isCameraFailed ? 'bg-[#c93c3c]' : 'bg-[#3f8f68]'
                    }`}
                  />
                  <span className="font-bold text-white">
                    {shieldActiveState.isShieldRecovered
                      ? 'BACKUP ACTIVE // PTZ CAM-06 SLEWED (+32°)'
                      : shieldActiveState.isCameraFailed
                      ? 'CAM-FENCE-03 OFFLINE // FAULT DETECTED'
                      : 'STANDBY SURVEILLANCE // CAM-FENCE-03'}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    shieldActiveState.isShieldRecovered
                      ? 'bg-[#3f8f68]/20 text-[#3f8f68] border-[#3f8f68]/40'
                      : shieldActiveState.isCameraFailed
                      ? 'bg-[#c93c3c]/20 text-[#c93c3c] border-[#c93c3c]/40'
                      : 'bg-[#477da8]/20 text-[#477da8] border-[#477da8]/40'
                  }`}
                >
                  {shieldActiveState.isShieldRecovered
                    ? 'COVERAGE 91% RESTORED'
                    : shieldActiveState.isCameraFailed
                    ? 'BLIND ZONE 32%'
                    : 'NOMINAL'}
                </span>
              </div>

              {/* Strict 16:9 Uncropped Container */}
              <div className="w-full aspect-video bg-black">
                <SimulatedCctvViewer state={shieldActiveState} className="w-full h-full" />
              </div>

              {/* Action Buttons Bar */}
              <div className="p-2.5 bg-[#111419] flex flex-wrap items-center justify-between gap-2 border-t border-[#30353b] font-mono">
                <div className="text-2xs text-[#8d949d]">
                  {isShieldRecovering ? (
                    <span className="text-[#3f8f68] font-bold">
                      RECOVERY RUNNING: PHASE {shieldRecoveryPhase} OF 8
                    </span>
                  ) : (
                    <span>SHIELD TRIAGE & RECOVERY SEQUENCE:</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleStartShieldRecovery}
                    disabled={isShieldRecovering}
                    className="px-3 py-1 rounded text-xs font-bold bg-[#3f8f68] hover:bg-[#3f8f68]/90 text-white transition-colors"
                  >
                    {isShieldRecovering ? 'RECOVERING...' : 'START RECOVERY SEQUENCE'}
                  </button>
                  <button
                    onClick={() => {
                      setShieldRecoveryPhase(0);
                      setIsShieldRecovering(false);
                    }}
                    className="p-1 rounded bg-[#1a1e26] text-[#8d949d] hover:text-white border border-[#30353b]"
                    title="Reset SHIELD"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: 8-Phase Sequence Progression (5 Cols) */}
            <div className="lg:col-span-5 space-y-1.5 font-mono max-h-[430px] overflow-y-auto pr-1">
              {SHIELD_RECOVERY_PHASES.map(ph => {
                const isCurrent = shieldRecoveryPhase === ph.phase;
                const isPassed = shieldRecoveryPhase > ph.phase;
                return (
                  <div
                    key={ph.phase}
                    onClick={() => {
                      setShieldRecoveryPhase(ph.phase);
                      setIsShieldRecovering(false);
                    }}
                    className={`p-2 rounded border text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-[#1a2330] border-[#3f8f68] ring-1 ring-[#3f8f68]/50 shadow-md'
                        : isPassed
                        ? 'bg-[#121814] border-[#3f8f68]/30 opacity-75'
                        : 'bg-[#111419] border-[#30353b] opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-bold ${isCurrent ? 'text-white' : 'text-[#8d949d]'}`}>
                        {ph.title}
                      </span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-bold border ${
                          ph.isFailed
                            ? 'bg-[#c93c3c]/20 text-[#c93c3c] border-[#c93c3c]/30'
                            : 'bg-[#3f8f68]/20 text-[#3f8f68] border-[#3f8f68]/30'
                        }`}
                      >
                        {ph.statusBadge}
                      </span>
                    </div>
                    <p className="text-[10px] text-[#8d949d] mt-0.5 leading-tight">{ph.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">05 / 10 &bull; SHIELD</span>
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
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c93c3c]">
              <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 font-bold">SECTION 06 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">MULTI-VECTOR THREAT SYNTHESIS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              MULTI-FACTOR RISK FUSION
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Fuses 6 contextual operational vectors to calculate threat severity, avoiding single-sensor false alarms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-3 items-center">
            {/* Left: 6 Input Signals (7 Cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">1. ZONE CRITICALITY</span>
                  <span className="text-[#c93c3c] font-bold">ALPHA BUFFER</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.25 | Breach inside restricted 100m zone</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">2. DIRECTION VECTOR</span>
                  <span className="text-[#c93c3c] font-bold">INWARD 042° NE</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.20 | Heading towards central service road</div>
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
                  <span className="text-[#c93c3c] font-bold">WIRE CONTACT</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.15 | Physical fence contact verified</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8d949d]">6. EVIDENCE QUALITY</span>
                  <span className="text-[#477da8] font-bold">HIGH SNR</span>
                </div>
                <div className="text-[11px] text-white">Weight: 0.10 | Sharp thermal and optical silhouette</div>
              </div>
            </div>

            {/* Right: Fused Score Card (5 Cols) */}
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
                  <div className="text-3xl font-extrabold text-[#c93c3c]">
                    86 <span className="text-sm font-normal text-[#8d949d]">/ 100</span>
                  </div>
                  <div className="text-[10px] text-[#8d949d]">WEIGHTED RISK SCORE</div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-extrabold text-[#3f8f68]">91%</div>
                  <div className="text-[10px] text-[#8d949d]">CONFIDENCE RATING</div>
                </div>
              </div>

              <div className="w-full bg-[#1e232b] h-2 rounded-full overflow-hidden">
                <div className="bg-[#c93c3c] h-full w-[86%]" />
              </div>

              <p className="text-xs text-[#8d949d] leading-relaxed">
                Risk Engine automatically compiles and elevates target T-104 to <strong className="text-white">Incident INC-2026-0142</strong>,
                dispatching the tactical dossier to the operator workstation.
              </p>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">06 / 10 &bull; RISK FUSION</span>
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
        {/* SECTION 07 — INCIDENT RECORD & OPERATOR QUEUE                    */}
        {/* =============================================================== */}
        <section
          id="incident"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
        >
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-[#c93c3c]">
              <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 font-bold">SECTION 07 / 10</span>
              <span className="text-[#8d949d]">|</span>
              <span className="text-[#8d949d]">TACTICAL INCIDENT MANAGEMENT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
              OPERATIONAL INCIDENT RECORD & QUEUE
            </h2>
            <p className="text-xs sm:text-sm text-[#8d949d] max-w-3xl">
              Unified operational incident record. Active incidents remain in the Active Queue awaiting review.
              When confirmed, the incident immediately transfers to Confirmed History with an immutable audit timestamp.
            </p>
          </div>

          {/* Incident Workspace Split: Queue Tab vs Dossier */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto py-3 font-mono">
            {/* Left: Queue Manager (5 Cols) */}
            <div className="lg:col-span-5 rounded-lg border border-[#30353b] bg-[#111419] overflow-hidden flex flex-col shadow-2xl">
              {/* Queue Header Tabs */}
              <div className="p-2 bg-[#14181f] border-b border-[#30353b] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 w-full">
                  <button
                    onClick={() => setIncidentTab('ACTIVE')}
                    className={`flex-1 py-1 px-2 rounded font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      incidentTab === 'ACTIVE'
                        ? 'bg-[#1e2530] text-white border border-[#477da8]/60 shadow-sm'
                        : 'text-[#8d949d] hover:text-white'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-[#c93c3c]" />
                    <span>ACTIVE QUEUE ({incidentConfirmed || incidentDismissed ? 0 : 1})</span>
                  </button>

                  <button
                    onClick={() => setIncidentTab('HISTORY')}
                    className={`flex-1 py-1 px-2 rounded font-semibold transition-colors flex items-center justify-center gap-1.5 ${
                      incidentTab === 'HISTORY'
                        ? 'bg-[#1e2530] text-white border border-[#477da8]/60 shadow-sm'
                        : 'text-[#8d949d] hover:text-white'
                    }`}
                  >
                    <HistoryIcon className="w-3.5 h-3.5 text-[#477da8]" />
                    <span>HISTORY ({incidentConfirmed || incidentDismissed ? 1 : 0})</span>
                  </button>
                </div>
              </div>

              {/* Queue List Content */}
              <div className="p-3 space-y-2 flex-1 min-h-[220px]">
                {incidentTab === 'ACTIVE' ? (
                  !incidentConfirmed && !incidentDismissed ? (
                    <div className="p-3 rounded bg-[#171b22] border border-[#c93c3c]/60 space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">INC-2026-0142</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#c93c3c]/20 text-[#c93c3c] text-[10px] font-bold border border-[#c93c3c]/40">
                          HIGH PRIORITY
                        </span>
                      </div>
                      <div className="text-xs text-white font-medium">Restricted-Zone Intrusion & Wire Breach</div>
                      <div className="flex items-center justify-between text-[10px] text-[#8d949d] pt-1 border-t border-[#30353b]">
                        <span>BOP-17 North &bull; CAM-03</span>
                        <span className="text-[#c28a28] font-bold">Awaiting Action</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-[#8d949d] text-xs space-y-1">
                      <CheckCircle2 className="w-8 h-8 text-[#3f8f68] mx-auto mb-2 opacity-80" />
                      <div className="font-bold text-white">ACTIVE QUEUE CLEAR</div>
                      <div className="text-[11px]">
                        INC-2026-0142 was actioned and moved to Confirmed History.
                      </div>
                    </div>
                  )
                ) : (
                  incidentConfirmed || incidentDismissed ? (
                    <div className="p-3 rounded bg-[#171b22] border border-[#3f8f68]/60 space-y-1.5 shadow-md">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">INC-2026-0142</span>
                        <span className="px-1.5 py-0.2 rounded bg-[#3f8f68]/20 text-[#3f8f68] text-[10px] font-bold border border-[#3f8f68]/40">
                          {incidentConfirmed ? 'CONFIRMED' : 'DISMISSED'}
                        </span>
                      </div>
                      <div className="text-xs text-white font-medium">Restricted-Zone Intrusion & Wire Breach</div>
                      <div className="flex items-center justify-between text-[10px] text-[#8d949d] pt-1 border-t border-[#30353b]">
                        <span>Operator action recorded</span>
                        <span className="text-[#3f8f68] font-bold">{confirmationTime}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center text-[#8d949d] text-xs space-y-1">
                      <div className="font-bold text-white">NO HISTORY ENTRIES</div>
                      <div className="text-[11px]">Confirm or dismiss active incidents to log them here.</div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right: Incident Dossier & Action Buttons (7 Cols) */}
            <div className="lg:col-span-7 rounded-lg border border-[#30353b] bg-[#111419] p-5 shadow-2xl space-y-4">
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
                      STATUS: {incidentConfirmed ? 'CONFIRMED (ARCHIVED IN HISTORY)' : incidentDismissed ? 'DISMISSED (ARCHIVED IN HISTORY)' : 'ACTIVE (AWAITING OPERATOR ADJUDICATION)'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded bg-[#c93c3c]/20 text-[#c93c3c] font-bold text-xs border border-[#c93c3c]/40">
                    HIGH PRIORITY
                  </span>
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">TARGET ENTITY</div>
                  <div className="font-bold text-white mt-0.5">T-104 (Unauthorized)</div>
                </div>
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">SECTOR LINE</div>
                  <div className="font-bold text-white mt-0.5">BOP-17 North (2.4 km)</div>
                </div>
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">SENSOR SEQUENCE</div>
                  <div className="font-bold text-[#477da8] mt-0.5">CAM-03 → 04 → 06</div>
                </div>
                <div className="p-2.5 rounded bg-[#171b22] border border-[#30353b]">
                  <div className="text-[10px] text-[#8d949d]">RISK / CONFIDENCE</div>
                  <div className="font-bold text-[#c93c3c] mt-0.5">86/100 &bull; 91% Conf</div>
                </div>
              </div>

              {/* Action Buttons for Operator */}
              <div className="pt-2 space-y-2">
                <div className="text-xs text-[#8d949d] uppercase font-bold">
                  OPERATOR ADJUDICATION CONSOLE:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <button
                    onClick={handleConfirmIncident}
                    id="btn-confirm-incident"
                    className="p-2.5 rounded bg-[#18231c] hover:bg-[#203126] border border-[#3f8f68] text-white font-bold transition-all shadow"
                  >
                    <div className="text-[#3f8f68] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CONFIRM</span>
                    </div>
                    <div className="text-[9px] text-[#8d949d] mt-1">Dispatch QRT</div>
                  </button>

                  <button
                    onClick={handleDismissIncident}
                    id="btn-dismiss-incident"
                    className="p-2.5 rounded bg-[#1a1e26] hover:bg-[#232934] border border-[#8d949d] text-white font-bold transition-all"
                  >
                    <div className="text-white">DISMISS</div>
                    <div className="text-[9px] text-[#8d949d] mt-1">False alarm</div>
                  </button>

                  <button
                    onClick={() => setSelectedIncidentAction('ASSIGN')}
                    className="p-2.5 rounded bg-[#151c24] hover:bg-[#1d2734] border border-[#477da8] text-white font-bold transition-all"
                  >
                    <div className="text-[#477da8]">ASSIGN</div>
                    <div className="text-[9px] text-[#8d949d] mt-1">Allocate drone</div>
                  </button>

                  <button
                    onClick={() => setSelectedIncidentAction('ANNOTATE')}
                    className="p-2.5 rounded bg-[#201d15] hover:bg-[#2c271c] border border-[#c28a28] text-white font-bold transition-all"
                  >
                    <div className="text-[#c28a28]">ANNOTATE</div>
                    <div className="text-[9px] text-[#8d949d] mt-1">Add Intel note</div>
                  </button>

                  <button
                    onClick={() => setSelectedIncidentAction('ESCALATE')}
                    className="p-2.5 rounded bg-[#241517] hover:bg-[#341d20] border border-[#c93c3c] text-white font-bold transition-all"
                  >
                    <div className="text-[#c93c3c]">ESCALATE</div>
                    <div className="text-[9px] text-[#8d949d] mt-1">Sector HQ</div>
                  </button>
                </div>

                {selectedIncidentAction && (
                  <div className="p-2.5 rounded bg-[#171b22] border border-[#477da8]/40 text-xs text-white flex items-center justify-between">
                    <span>
                      Operator action <strong>{selectedIncidentAction}</strong> executed for INC-2026-0142.
                      {selectedIncidentAction === 'CONFIRM' && ' Incident transferred to Confirmed History.'}
                    </span>
                    <span className="text-[10px] text-[#3f8f68] font-bold">{confirmationTime}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">07 / 10 &bull; INCIDENT</span>
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
        {/* SECTION 08 — FORENSIC EVIDENCE PACKAGE                          */}
        {/* =============================================================== */}
        <section
          id="evidence"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
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
              Cryptographically attested chain of custody. Every critical detection is locked with SHA-256
              digests on edge storage to guarantee evidentiary admissibility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-auto py-3 font-mono">
            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">01. EVENT KEYFRAMES</div>
              <div className="text-xs font-bold text-white">Synchronized Frames</div>
              <p className="text-[11px] text-[#8d949d]">
                Optical & thermal synchronized keyframes captured at tripwire breach timestamp.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">02. VIDEO BUFFER</div>
              <div className="text-xs font-bold text-white">10s Pre/Post MP4</div>
              <p className="text-[11px] text-[#8d949d]">
                Continuous buffered video package preserving 10s pre-breach approach context.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">03. TRACK GEO-VECTOR</div>
              <div className="text-xs font-bold text-white">Path Coordinates</div>
              <p className="text-[11px] text-[#8d949d]">
                GPS-calibrated track coordinates, velocity telemetry, and bearing angle history.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">04. DETECTION METADATA</div>
              <div className="text-xs font-bold text-white">Embeddings & Boxes</div>
              <p className="text-[11px] text-[#8d949d]">
                Per-frame coordinates, class confidence scores, and neural feature embeddings.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">05. SENSOR TELEMETRY</div>
              <div className="text-xs font-bold text-white">Hardware Audit</div>
              <p className="text-[11px] text-[#8d949d]">
                Sensor ID, optical focal length, PTZ azimuth/tilt angles, firmware hash.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">06. SWAN HANDOFF LOG</div>
              <div className="text-xs font-bold text-white">Gossip Sync Events</div>
              <p className="text-[11px] text-[#8d949d]">
                Distributed gossip events recording multi-sensor tracking and Re-ID similarity.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#30353b] space-y-1">
              <div className="text-[10px] text-[#477da8] font-bold">07. RISK WEIGHTS</div>
              <div className="text-xs font-bold text-white">6-Signal Breakdown</div>
              <p className="text-[11px] text-[#8d949d]">
                Mathematical weights and scoring factor breakdown justifying High Priority rank.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#111419] border border-[#3f8f68]/40 space-y-1">
              <div className="text-[10px] text-[#3f8f68] font-bold">08. CRYPTOGRAPHIC SEAL</div>
              <div className="text-xs font-bold text-white">SHA-256 Digest</div>
              <p className="text-[10px] text-[#8d949d] break-all font-mono">
                8f4b7a9201cde91f63a2b4...3e1a Immutable hash locked at edge storage.
              </p>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">08 / 10 &bull; EVIDENCE</span>
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
        {/* SECTION 09 — COMMAND CENTRE & HUMAN AUTHORITY                   */}
        {/* =============================================================== */}
        <section
          id="command"
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
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
              AI detects. SWAN follows. SHIELD recovers. <strong className="text-white">Operator decides.</strong> The human
              commander retains complete authority over all tactical responses.
            </p>
          </div>

          <div className="my-auto py-3 space-y-4 font-mono">
            {/* Transmission Pipeline */}
            <div className="p-3.5 rounded-lg bg-[#14181f] border border-[#30353b] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#477da8]" />
                <span className="font-bold text-white">BOP EDGE NODE</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#477da8] hidden sm:block" />
              <div className="flex items-center gap-2 text-[#8d949d]">
                <Lock className="w-3.5 h-3.5 text-[#3f8f68]" />
                <span>SECURE AIR-GAPPED EVENT BUS (TLS / MQTT)</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#477da8] hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3f8f68]" />
                <span className="font-bold text-white">SECTOR COMMAND CONSOLE</span>
              </div>
            </div>

            {/* Operator Actions Audit Review */}
            <div className="p-4 rounded-lg bg-[#111419] border border-[#30353b] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase">
                  OPERATIONAL COMMAND AUDIT TRAIL
                </span>
                <span className="text-2xs text-[#3f8f68]">SYSTEM ONLINE</span>
              </div>
              <p className="text-xs text-[#8d949d] leading-relaxed">
                Clicking CONFIRM immediately dispatches Quick Reaction Teams (QRT) to Sector 03 Alpha, updates
                the incident lifecycle from Active to Confirmed History, and seals the audit record with cryptographic proof.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <Link
                  to="/app/command"
                  className="px-4 py-2 rounded bg-[#477da8] hover:bg-[#477da8]/90 text-white font-bold text-xs shadow flex items-center gap-2"
                >
                  <span>LAUNCH FULL OPERATOR WORKSTATION</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Section Footer */}
          <div className="flex items-center justify-between border-t border-[#30353b]/80 pt-3">
            <span className="text-xs font-mono text-[#8d949d]">09 / 10 &bull; COMMAND CENTRE</span>
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
          className="min-h-[calc(100svh-108px)] md:min-h-0 py-6 md:py-8 flex flex-col justify-between border-t border-[#30353b]/60"
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
              Ruggedized edge architecture designed for mission-critical reliability in air-gapped, harsh border environments.
            </p>
          </div>

          <div className="my-auto py-3 space-y-4 font-mono">
            {/* Pipeline Dataflow */}
            <div className="p-4 rounded-lg bg-[#111419] border border-[#30353b] space-y-2">
              <div className="text-xs text-[#8d949d] uppercase">ESTABLISHED DRISHTI PIPELINE:</div>
              <div className="flex flex-wrap items-center gap-2 text-[11px]">
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-white">EXISTING CCTV</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-white">BOP EDGE NODE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">AI DETECTION</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">TRACKING</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">VIRTUAL FENCE / RULES</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#3f8f68]">SWAN</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#3f8f68]">SHIELD (RECOVERY)</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#c28a28]">RISK ENGINE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#30353b] text-[#477da8]">EVIDENCE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#3f8f68] text-white font-bold">COMMAND CENTRE</span>
                <span className="text-[#477da8]">→</span>
                <span className="px-2.5 py-1 rounded bg-[#181d24] border border-[#3f8f68] text-white font-bold">HUMAN OPERATOR</span>
              </div>
            </div>

            {/* Launch & Operator Terminal CTA */}
            <div className="p-4 rounded-lg bg-[#14181f] border border-[#477da8]/40 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-white">READY FOR OPERATIONAL DEPLOYMENT</div>
                <div className="text-xs text-[#8d949d]">
                  BOP Command Station is fully initialized. Launch the operator workstation.
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
            <span className="text-xs font-mono text-[#8d949d]">10 / 10 &bull; SYSTEM ARCHITECTURE</span>
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
