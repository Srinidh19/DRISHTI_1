import React, { useRef, useEffect, useState } from 'react';
import { ShieldAlert, AlertTriangle, Radio, Maximize2, Camera as CameraIcon, CheckCircle2 } from 'lucide-react';

export type CctvCameraId =
  | 'CAM-FENCE-03'
  | 'CAM-03'
  | 'CAM-ROAD-05'
  | 'CAM-04'
  | 'CAM-06'
  | 'CAM-07'
  | 'CAM-TOWER-01'
  | 'CAM-11'
  | 'CAM-GATE-02';

export interface CctvSimulationState {
  activeCameraId: CctvCameraId;
  stageId: number;
  stageSlug: string;
  timeSeconds: number; // 0 to 60+ seconds
  isVehiclePresent: boolean;
  isAnprActive: boolean;
  isPersonPresent: boolean;
  isFenceCrossed: boolean;
  isSwanActive: boolean;
  isCameraFailed: boolean;
  isShieldRecovered: boolean;
  progressPercent: number;
}

interface SimulatedCctvViewerProps {
  state: CctvSimulationState;
  onCameraSelect?: (camId: CctvCameraId) => void;
  className?: string;
  aspectRatio?: string;
}

const CAMERA_IMAGE_MAP: Record<CctvCameraId, string> = {
  'CAM-FENCE-03': '/media/cctv/cam-03.jpg',
  'CAM-03': '/media/cctv/cam-03.jpg',
  'CAM-ROAD-05': '/media/cctv/cam-road-05.jpg',
  'CAM-04': '/media/cctv/cam-04.jpg',
  'CAM-06': '/media/cctv/cam-06.jpg',
  'CAM-07': '/media/cctv/cam-07.jpg',
  'CAM-TOWER-01': '/media/cctv/cam-tower-01.jpg',
  'CAM-11': '/media/cctv/cam-11.jpg',
  'CAM-GATE-02': '/media/cctv/cam-gate-02.jpg'
};

const CAMERA_NAMES: Record<CctvCameraId, string> = {
  'CAM-FENCE-03': 'PRIMARY PERIMETER FENCE',
  'CAM-03': 'PRIMARY PERIMETER FENCE',
  'CAM-ROAD-05': 'ACCESS ROAD BARRIER & APPR',
  'CAM-04': 'SERVICE ROAD INTERSECTION',
  'CAM-06': 'SECONDARY RIDGE PTZ',
  'CAM-07': 'NORTH PERIMETER LINE',
  'CAM-TOWER-01': 'WATCHTOWER OVERWATCH',
  'CAM-11': 'INFRASTRUCTURE & UTILITY YARD',
  'CAM-GATE-02': 'ENTRY CHECKPOINT BARRIER'
};

export const SimulatedCctvViewer: React.FC<SimulatedCctvViewerProps> = ({
  state,
  onCameraSelect,
  className = '',
  aspectRatio = 'aspect-video'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [timestamp, setTimestamp] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Cached photographic images
  const imageCacheRef = useRef<Record<string, HTMLImageElement>>({});

  // Preload background images
  useEffect(() => {
    Object.entries(CAMERA_IMAGE_MAP).forEach(([camId, src]) => {
      if (!imageCacheRef.current[camId]) {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          imageCacheRef.current[camId] = img;
        };
      }
    });
  }, []);

  // Synchronized CCTV OSD Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const yr = now.getFullYear();
      const mo = String(now.getMonth() + 1).padStart(2, '0');
      const da = String(now.getDate()).padStart(2, '0');
      const ho = String(now.getHours()).padStart(2, '0');
      const mi = String(now.getMinutes()).padStart(2, '0');
      const se = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTimestamp(`${yr}-${mo}-${da} ${ho}:${mi}:${se}.${ms} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 50);
    return () => clearInterval(interval);
  }, []);

  // Main 60fps Canvas Render Loop with Dynamic Moving Subjects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let localFrame = 0;

    const render = () => {
      localFrame++;
      const width = canvas.width;
      const height = canvas.height;
      const activeCam = state.activeCameraId;
      const isFailed = state.isCameraFailed && (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03');

      ctx.clearRect(0, 0, width, height);

      // =========================================================
      // 1. CAMERA FAILURE (SHIELD EVENT): INTENTIONAL STATIC NOISE
      // =========================================================
      if (isFailed) {
        ctx.fillStyle = '#0a0c0e';
        ctx.fillRect(0, 0, width, height);

        // High-frequency video static noise
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const n = (Math.random() * 45) | 0;
          data[i] = n;
          data[i + 1] = n;
          data[i + 2] = n;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        // Diagnostic failure card
        ctx.fillStyle = 'rgba(16, 19, 23, 0.92)';
        ctx.fillRect(width * 0.12, height * 0.32, width * 0.76, height * 0.36);
        ctx.strokeStyle = '#c93c3c';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(width * 0.12, height * 0.32, width * 0.76, height * 0.36);

        ctx.fillStyle = '#c93c3c';
        ctx.font = 'bold 15px "IBM Plex Mono", monospace';
        ctx.fillText('CAM-FENCE-03: CAMERA OFFLINE // HEARTBEAT SIGNAL LOST', width * 0.15, height * 0.42);

        ctx.fillStyle = '#e5e7eb';
        ctx.font = '12px "IBM Plex Mono", monospace';
        ctx.fillText('SHIELD: INFRASTRUCTURE FAULT CLASSIFIED [LENS TAMPER / TIMEOUT > 3.0S]', width * 0.15, height * 0.50);

        ctx.fillStyle = '#8d949d';
        ctx.font = '11px "IBM Plex Mono", monospace';
        ctx.fillText('PERIMETER BLIND ZONE CREATED: 32% LINEAR SECTOR COVERAGE LOST', width * 0.15, height * 0.57);
        ctx.fillStyle = '#3f8f68';
        ctx.fillText('AUTONOMOUS COVERAGE RESTORATION: SLEWING MOTORIZED PTZ CAM-06 TO GAP...', width * 0.15, height * 0.63);
      } else {
        // =========================================================
        // 2. PHOTOREALISTIC CCTV FOOTAGE BASE
        // =========================================================
        const bgImg = imageCacheRef.current[activeCam];
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, width, height);
        } else {
          // Fallback dark tactical gradient while image loads
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, '#15191f');
          grad.addColorStop(0.5, '#1e242c');
          grad.addColorStop(1, '#111417');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        // =========================================================
        // 3. CAMERA-SPECIFIC SPECIALIZED OVERLAYS
        // =========================================================

        // --- A. VIRTUAL FENCE TRIPWIRE (CAM-FENCE-03, CAM-03, CAM-07) ---
        const isFenceCam = activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03' || activeCam === 'CAM-07';
        if (isFenceCam) {
          const vfCrossed = state.isFenceCrossed && (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03');
          ctx.save();
          ctx.setLineDash([9, 6]);
          ctx.strokeStyle = vfCrossed ? '#c93c3c' : 'rgba(71, 125, 168, 0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03') {
            ctx.moveTo(width * 0.06, height * 0.84);
            ctx.lineTo(width * 0.90, height * 0.70);
          } else {
            ctx.moveTo(width * 0.05, height * 0.80);
            ctx.lineTo(width * 0.95, height * 0.76);
          }
          ctx.stroke();
          ctx.restore();

          // Virtual fence boundary label
          ctx.fillStyle = vfCrossed ? '#c93c3c' : '#477da8';
          ctx.font = '10px "IBM Plex Mono", monospace';
          ctx.fillText(
            vfCrossed
              ? '▲ VIRTUAL FENCE [BREACH DETECTED: ANALYZING INTRUSION...]'
              : `■ VIRTUAL FENCE TRIPWIRE [ARMED: ${activeCam === 'CAM-07' ? 'SECTOR 07 NORTH' : 'SECTOR 03 ALPHA'}]`,
            width * 0.08,
            height * 0.74
          );
        }

        // --- B. WATCHTOWER OVERWATCH SECTOR DEMARCATION (CAM-TOWER-01) ---
        if (activeCam === 'CAM-TOWER-01') {
          ctx.save();
          ctx.strokeStyle = 'rgba(71, 125, 168, 0.4)';
          ctx.lineWidth = 1;

          // Sector grid lines radiating from base
          ctx.beginPath();
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.1, height * 0.2);
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.5, height * 0.15);
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.9, height * 0.2);
          ctx.stroke();

          // Concentric range rings
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.arc(width * 0.5, height, height * 0.4, Math.PI, 2 * Math.PI);
          ctx.arc(width * 0.5, height, height * 0.75, Math.PI, 2 * Math.PI);
          ctx.stroke();
          ctx.restore();

          // Sector Demarcation Labels
          ctx.fillStyle = '#477da8';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('SECTOR 01 [ALPHA] - 400M', width * 0.12, height * 0.32);
          ctx.fillText('SECTOR 02 [BETA] - 800M', width * 0.44, height * 0.24);
          ctx.fillText('SECTOR 03 [GAMMA] - 1200M', width * 0.72, height * 0.32);

          // Tower Compass Reticle
          ctx.fillStyle = 'rgba(16, 20, 25, 0.85)';
          ctx.fillRect(16, 42, 170, 48);
          ctx.strokeStyle = '#30353b';
          ctx.strokeRect(16, 42, 170, 48);
          ctx.fillStyle = '#3f8f68';
          ctx.font = 'bold 10px "IBM Plex Mono", monospace';
          ctx.fillText('TOWER-01 OVERWATCH RADAR', 24, 58);
          ctx.fillStyle = '#8d949d';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('AZ: 042° NNE | EL: -24°', 24, 72);
          ctx.fillText('RADIAL COVERAGE: 360° NOMINAL', 24, 84);
        }

        // --- C. UTILITY YARD ASSET BOUNDING BOXES (CAM-11) ---
        if (activeCam === 'CAM-11') {
          // Generator asset box
          ctx.strokeStyle = '#477da8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(width * 0.18, height * 0.45, width * 0.26, height * 0.34);
          ctx.fillStyle = 'rgba(16, 20, 25, 0.85)';
          ctx.fillRect(width * 0.18, height * 0.45 - 18, 165, 18);
          ctx.fillStyle = '#477da8';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText('ASSET-01: DIESEL GENSET [OK]', width * 0.19, height * 0.45 - 6);

          // RF Antenna Mast asset box
          ctx.strokeRect(width * 0.62, height * 0.22, width * 0.22, height * 0.58);
          ctx.fillStyle = 'rgba(16, 20, 25, 0.85)';
          ctx.fillRect(width * 0.62, height * 0.22 - 18, 180, 18);
          ctx.fillStyle = '#477da8';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText('ASSET-02: RF MAST TOWER [OK]', width * 0.63, height * 0.22 - 6);

          // Facility status badge
          ctx.fillStyle = 'rgba(16, 20, 25, 0.85)';
          ctx.fillRect(16, 42, 185, 34);
          ctx.strokeStyle = '#30353b';
          ctx.strokeRect(16, 42, 185, 34);
          ctx.fillStyle = '#3f8f68';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText('RESTRICTED UTILITY YARD', 24, 56);
          ctx.fillStyle = '#8d949d';
          ctx.font = '8px "IBM Plex Mono", monospace';
          ctx.fillText('BUFFER STATUS: NO BREACH (SECURE)', 24, 68);
        }

        // --- D. CHECKPOINT GATE BARRIER (CAM-GATE-02) ---
        if (activeCam === 'CAM-GATE-02') {
          // Barrier arm representation
          ctx.save();
          ctx.strokeStyle = '#c93c3c';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(width * 0.25, height * 0.68);
          ctx.lineTo(width * 0.68, height * 0.68);
          ctx.stroke();
          ctx.restore();

          // Checkpoint Barrier Status Inset
          ctx.fillStyle = 'rgba(16, 20, 25, 0.88)';
          ctx.fillRect(16, 42, 200, 48);
          ctx.strokeStyle = '#30353b';
          ctx.strokeRect(16, 42, 200, 48);
          ctx.fillStyle = '#c93c3c';
          ctx.font = 'bold 10px "IBM Plex Mono", monospace';
          ctx.fillText('GATE ARM: LOWERED [BARRIER ARMED]', 24, 58);
          ctx.fillStyle = '#8d949d';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('SPIKE STRIP: DEPLOYED (INTERLOCKED)', 24, 72);
          ctx.fillStyle = '#3f8f68';
          ctx.fillText('ANPR OPTICAL READER: STANDBY', 24, 84);
        }

        // --- E. PTZ TELEMETRY (CAM-06) ---
        if (activeCam === 'CAM-06') {
          ctx.fillStyle = 'rgba(16, 20, 25, 0.88)';
          ctx.fillRect(16, 42, 220, 52);
          ctx.strokeStyle = '#30353b';
          ctx.strokeRect(16, 42, 220, 52);

          const isShieldSlewed = state.isShieldRecovered;
          ctx.fillStyle = isShieldSlewed ? '#3f8f68' : '#477da8';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText(
            isShieldSlewed ? 'MOTORIZED PTZ: SLEWED TO GAP 03' : 'MOTORIZED PTZ: RIDGE OVERWATCH',
            24,
            58
          );

          ctx.fillStyle = '#e5e7eb';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText(
            isShieldSlewed ? 'PAN: 174.4° (+32.0°) | TILT: -21.0°' : 'PAN: 142.4° | TILT: -18.2°',
            24,
            72
          );

          ctx.fillStyle = '#8d949d';
          ctx.fillText(
            isShieldSlewed ? 'ZOOM: 4.2X OPTICAL | FPS: 30' : 'ZOOM: 2.8X OPTICAL | FPS: 30',
            24,
            85
          );
        }

        // =========================================================
        // 4. VISIBLY MOVING VEHICLE (V-203)
        // =========================================================
        // Visible on CAM-ROAD-05, CAM-GATE-02, and CAM-04
        const hasVehicle =
          activeCam === 'CAM-ROAD-05' ||
          activeCam === 'CAM-GATE-02' ||
          (state.isVehiclePresent && activeCam === 'CAM-04');

        if (hasVehicle) {
          // Dynamic movement calculation
          let vehX = width * 0.22;
          let vehY = height * 0.60;
          let vehW = 118;
          let vehH = 58;

          if (activeCam === 'CAM-ROAD-05') {
            const tCycle = (localFrame * 0.8) % (width * 0.85);
            vehX = width * 0.12 + tCycle;
            vehY = height * 0.58;
          } else if (activeCam === 'CAM-GATE-02') {
            // Vehicle holding stationary at checkpoint barrier
            vehX = width * 0.38;
            vehY = height * 0.62;
            vehW = 110;
            vehH = 54;
          } else if (activeCam === 'CAM-04') {
            const tCycle = (localFrame * 0.65) % (width * 0.8);
            vehX = width * 0.10 + tCycle;
            vehY = height * 0.56;
          }

          // Dynamic Vehicle Ground Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(vehX + vehW * 0.5, vehY + vehH + 3, vehW * 0.52, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Vehicle Chassis / Body (Tactical pickup truck silhouette)
          ctx.fillStyle = '#1c2228';
          ctx.fillRect(vehX + 4, vehY + 16, vehW - 8, vehH - 24); // Main bed & cab base
          ctx.fillStyle = '#14181c';
          ctx.fillRect(vehX + 22, vehY + 2, vehW * 0.44, 18); // Cabin roof
          // Windows
          ctx.fillStyle = '#2b333d';
          ctx.fillRect(vehX + 26, vehY + 5, vehW * 0.20, 12);
          ctx.fillRect(vehX + 28 + vehW * 0.20, vehY + 5, vehW * 0.16, 12);
          // Wheels (spinning effect)
          ctx.fillStyle = '#0b0d0f';
          const wheelR = 9;
          ctx.beginPath();
          ctx.arc(vehX + 24, vehY + vehH - 8, wheelR, 0, Math.PI * 2);
          ctx.arc(vehX + vehW - 24, vehY + vehH - 8, wheelR, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#3a424e';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Dynamic Headlights Beam (translucent illumination cone on gravel)
          ctx.fillStyle = 'rgba(240, 245, 255, 0.08)';
          ctx.beginPath();
          ctx.moveTo(vehX + vehW - 4, vehY + 28);
          ctx.lineTo(vehX + vehW + 140, vehY + 15);
          ctx.lineTo(vehX + vehW + 160, vehY + 45);
          ctx.lineTo(vehX + vehW - 4, vehY + 36);
          ctx.closePath();
          ctx.fill();

          // Computer Vision Bounding Box
          ctx.strokeStyle = '#477da8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(vehX, vehY, vehW, vehH);

          // Detection Header
          ctx.fillStyle = 'rgba(16, 20, 25, 0.9)';
          ctx.fillRect(vehX, vehY - 18, 175, 17);
          ctx.fillStyle = '#477da8';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText(
            activeCam === 'CAM-GATE-02' ? 'VEHICLE: PATROL [HOLD] V-203' : 'VEHICLE: UTILITY [0.94] V-203',
            vehX + 4,
            vehY - 6
          );

          // Direction & Velocity Vector
          if (activeCam !== 'CAM-GATE-02') {
            ctx.strokeStyle = '#477da8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(vehX + vehW, vehY + vehH / 2);
            ctx.lineTo(vehX + vehW + 28, vehY + vehH / 2);
            ctx.stroke();
          }

          // Simulated ANPR License Plate Reading Crop Inset
          if (state.isAnprActive || activeCam === 'CAM-ROAD-05' || activeCam === 'CAM-GATE-02') {
            const insetX = width - 185;
            const insetY = 42;
            const insetW = 175;
            const insetH = 82;

            ctx.fillStyle = 'rgba(12, 15, 19, 0.94)';
            ctx.fillRect(insetX, insetY, insetW, insetH);
            ctx.strokeStyle = '#30353b';
            ctx.lineWidth = 1;
            ctx.strokeRect(insetX, insetY, insetW, insetH);

            ctx.fillStyle = '#8d949d';
            ctx.font = '9px "IBM Plex Mono", monospace';
            ctx.fillText('ANPR OPTICAL CROP (SIMULATED)', insetX + 8, insetY + 14);

            // High-contrast license plate rectangle
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(insetX + 12, insetY + 22, 150, 28);
            ctx.strokeStyle = '#111';
            ctx.strokeRect(insetX + 12, insetY + 22, 150, 28);

            ctx.fillStyle = '#111827';
            ctx.font = 'bold 14px "IBM Plex Mono", monospace';
            ctx.fillText('DEMO-4821', insetX + 32, insetY + 41);

            ctx.fillStyle = '#3f8f68';
            ctx.font = 'bold 9px "IBM Plex Mono", monospace';
            ctx.fillText('PLATE CANDIDATE: DEMO-4821', insetX + 8, insetY + 65);
            ctx.fillStyle = '#8d949d';
            ctx.font = '8px "IBM Plex Mono", monospace';
            ctx.fillText('MATCH: BORDER LOGISTICS FLEET', insetX + 8, insetY + 76);
          }
        }

        // =========================================================
        // 5. VISIBLY MOVING PERSON (TARGET T-104)
        // =========================================================
        // Visible on CAM-FENCE-03, CAM-03, CAM-04, and CAM-06
        const hasPerson =
          state.isPersonPresent ||
          activeCam === 'CAM-FENCE-03' ||
          activeCam === 'CAM-03' ||
          activeCam === 'CAM-04' ||
          activeCam === 'CAM-06';

        if (hasPerson) {
          let px = width * 0.32;
          let py = height * 0.65;
          let targetH = 54;
          let targetW = 20;

          // Natural walking gait cycle (multi-joint limb movement)
          const walkPhase = localFrame * 0.12;
          const leftLegAngle = Math.sin(walkPhase) * 0.55;
          const rightLegAngle = -leftLegAngle;
          const leftArmAngle = -leftLegAngle * 0.6;
          const rightArmAngle = -rightLegAngle * 0.6;
          const bodyBob = Math.abs(Math.sin(walkPhase * 2)) * 2.5;

          if (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03') {
            const march = ((localFrame * 0.6) % (width * 0.45));
            px = width * 0.22 + march;
            py = height * 0.70 - (march / (width * 0.45)) * (height * 0.08) - bodyBob;
          } else if (activeCam === 'CAM-04') {
            const march = ((localFrame * 0.55) % (width * 0.40));
            px = width * 0.42 + march;
            py = height * 0.44 - bodyBob;
            targetH = 46;
            targetW = 18;
          } else if (activeCam === 'CAM-06') {
            const march = ((localFrame * 0.5) % (width * 0.38));
            px = width * 0.38 + march;
            py = height * 0.62 - bodyBob;
            targetH = 48;
            targetW = 18;
          }

          // Dynamic Ground Contact Shadow on gravel
          ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
          ctx.beginPath();
          ctx.ellipse(px + targetW / 2, py + targetH + 2, targetW * 0.6, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Person Silhouette with Realistic Walking Articulation
          ctx.save();
          ctx.fillStyle = '#14181d'; // Dark night silhouette matching IR camera exposure

          // Head & Neck
          ctx.beginPath();
          ctx.arc(px + targetW / 2, py + 8, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Torso
          ctx.fillRect(px + 4, py + 13, targetW - 8, targetH * 0.42);

          // Left Arm
          ctx.save();
          ctx.translate(px + 4, py + 15);
          ctx.rotate(leftArmAngle);
          ctx.fillRect(-1.5, 0, 3, targetH * 0.28);
          ctx.restore();

          // Right Arm
          ctx.save();
          ctx.translate(px + targetW - 4, py + 15);
          ctx.rotate(rightArmAngle);
          ctx.fillRect(-1.5, 0, 3, targetH * 0.28);
          ctx.restore();

          // Left Leg
          ctx.save();
          ctx.translate(px + 6, py + 13 + targetH * 0.42);
          ctx.rotate(leftLegAngle);
          ctx.fillRect(-2, 0, 4, targetH * 0.44);
          ctx.restore();

          // Right Leg
          ctx.save();
          ctx.translate(px + targetW - 6, py + 13 + targetH * 0.42);
          ctx.rotate(rightLegAngle);
          ctx.fillRect(-2, 0, 4, targetH * 0.44);
          ctx.restore();

          ctx.restore();

          // =========================================================
          // Tactical Detection Bounding Box & Trajectory Line
          // =========================================================
          const isBreach = state.isFenceCrossed && (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03');
          const boxColor = isBreach ? '#c93c3c' : activeCam === 'CAM-04' ? '#477da8' : '#c28a28';
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(px - 3, py - 3, targetW + 6, targetH + 6);

          // Tactical corner brackets
          const bLen = 6;
          ctx.beginPath();
          ctx.moveTo(px - 3, py - 3 + bLen);
          ctx.lineTo(px - 3, py - 3);
          ctx.lineTo(px - 3 + bLen, py - 3);
          ctx.moveTo(px + targetW + 3 - bLen, py - 3);
          ctx.lineTo(px + targetW + 3, py - 3);
          ctx.lineTo(px + targetW + 3, py - 3 + bLen);
          ctx.moveTo(px - 3, py + targetH + 3 - bLen);
          ctx.lineTo(px - 3, py + targetH + 3);
          ctx.lineTo(px - 3 + bLen, py + targetH + 3);
          ctx.moveTo(px + targetW + 3 - bLen, py + targetH + 3);
          ctx.lineTo(px + targetW + 3, py + targetH + 3);
          ctx.lineTo(px + targetW + 3, py + targetH + 3 - bLen);
          ctx.stroke();

          // Detection Header Banner
          ctx.fillStyle = 'rgba(16, 20, 25, 0.92)';
          ctx.fillRect(px - 3, py - 20, 155, 18);
          ctx.fillStyle = boxColor;
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          const headerText = isBreach
            ? 'PERSON [0.91] T-104 [BREACH]'
            : activeCam === 'CAM-04'
            ? 'PERSON [0.94] T-104 [RE-ID]'
            : 'PERSON [0.91] T-104';
          ctx.fillText(headerText, px, py - 7);

          // Direction Trajectory Vector (N -> SE)
          ctx.strokeStyle = 'rgba(194, 138, 40, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px + targetW / 2, py + targetH / 2);
          ctx.lineTo(px + targetW / 2 + 24, py + targetH / 2 - 10);
          ctx.stroke();

          // Trajectory breadcrumbs
          for (let d = 1; d <= 5; d++) {
            ctx.fillStyle = 'rgba(194, 138, 40, 0.4)';
            ctx.beginPath();
            ctx.arc(px + targetW / 2 - d * 8, py + targetH / 2 + d * 4, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }

          // Direction Label
          ctx.fillStyle = 'rgba(16, 20, 25, 0.85)';
          ctx.fillRect(px + targetW + 8, py + 2, 125, 16);
          ctx.fillStyle = '#e5e7eb';
          ctx.font = '8px "IBM Plex Mono", monospace';
          ctx.fillText('DIR: NORTH → SOUTH-EAST', px + targetW + 11, py + 13);
        }

        // =========================================================
        // 6. SWAN & SHIELD OVERLAYS
        // =========================================================
        if (state.isSwanActive && !isFailed) {
          ctx.fillStyle = 'rgba(14, 18, 24, 0.92)';
          ctx.fillRect(width - 245, height - 66, 235, 54);
          ctx.strokeStyle = '#477da8';
          ctx.lineWidth = 1;
          ctx.strokeRect(width - 245, height - 66, 235, 54);

          ctx.fillStyle = '#477da8';
          ctx.font = 'bold 10px "IBM Plex Mono", monospace';
          ctx.fillText('SWAN: CROSS-CAMERA HANDOFF ACTIVE', width - 236, height - 48);

          ctx.fillStyle = '#8d949d';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('PREDICTED NEXT: CAM-04 (SECTOR BETA)', width - 236, height - 34);
          ctx.fillText('TARGET CONTINUITY: 94% RE-ID MATCH', width - 236, height - 20);
        }

        if (state.isShieldRecovered && activeCam === 'CAM-06') {
          ctx.fillStyle = 'rgba(14, 18, 24, 0.92)';
          ctx.fillRect(width - 245, height - 66, 235, 54);
          ctx.strokeStyle = '#3f8f68';
          ctx.lineWidth = 1;
          ctx.strokeRect(width - 245, height - 66, 235, 54);

          ctx.fillStyle = '#3f8f68';
          ctx.font = 'bold 10px "IBM Plex Mono", monospace';
          ctx.fillText('SHIELD: AUTONOMOUS COVERAGE RESTORED', width - 236, height - 48);

          ctx.fillStyle = '#8d949d';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('PTZ CAM-06 SLEWED +32° AZIMUTH', width - 236, height - 34);
          ctx.fillText('COVERAGE RESTORED: 91% [BLIND GAP CLOSED]', width - 236, height - 20);
        }
      }

      // =========================================================
      // 7. REALISTIC CCTV SCANLINES & SENSOR GRAIN
      // =========================================================
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

      // Rolling electronic noise band
      const rollY = (localFrame * 1.6) % height;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.fillRect(0, rollY, width, 8);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [state]);

  return (
    <div
      ref={containerRef}
      className={`relative bg-[#090b0e] border border-[#30353b] rounded overflow-hidden select-none font-mono flex flex-col justify-between ${className}`}
    >
      {/* CCTV Top OSD Header */}
      <div className="absolute top-0 inset-x-0 z-20 px-3 py-1.5 bg-gradient-to-b from-black/95 via-black/50 to-transparent flex items-center justify-between text-2xs text-[#e5e7eb] font-mono pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#3f8f68] animate-pulse" />
          <span className="font-bold tracking-wider">{state.activeCameraId}</span>
          <span className="text-[#8d949d]">|</span>
          <span className="text-[#8d949d] hidden sm:inline">{CAMERA_NAMES[state.activeCameraId]}</span>
          <span className="px-1.5 py-0.2 rounded bg-[#181b20] border border-[#30353b] text-[#8d949d] text-[9px]">
            1080P 30FPS RTSP
          </span>
        </div>

        <div className="flex items-center gap-3 text-right">
          <span className="text-[#e5e7eb] tracking-wider">{timestamp}</span>
          <span className="px-1.5 py-0.5 rounded bg-[#c28a28]/20 border border-[#c28a28]/40 text-[#c28a28] text-[9px] font-bold">
            SIMULATED DEMONSTRATION FOOTAGE
          </span>
        </div>
      </div>

      {/* Main HTML5 Canvas Video Surface (960x540 16:9) */}
      <div className={`w-full ${aspectRatio} relative bg-[#090b0e]`}>
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain block"
        />
      </div>

      {/* CCTV Bottom Telemetry Status Bar */}
      <div className="px-2.5 py-1 bg-[#111419] border-t border-[#30353b] flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2.5 text-2xs text-[#8d949d]">
          <div className="flex items-center gap-1">
            <span className="text-[#8d949d]">AI INFERENCE:</span>
            <span className="text-[#3f8f68] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f8f68]" />
              ACTIVE (14ms)
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#8d949d]">TRACKS:</span>
            <span className="text-white font-bold">
              {state.isPersonPresent ? '01 (T-104)' : state.isVehiclePresent ? '01 (V-203)' : '00 NOMINAL'}
            </span>
          </div>
        </div>

        <div className="text-[9px] text-[#8d949d] uppercase">
          DEMO FEED &bull; NOT LIVE SURVEILLANCE
        </div>
      </div>
    </div>
  );
};
