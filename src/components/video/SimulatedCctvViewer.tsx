import React, { useRef, useEffect, useState } from 'react';
import { DemoVisibilityMode } from '../../services/demoStateMachine';

export type CctvCameraId =
  | 'CAM-FENCE-03'
  | 'CAM-03'
  | 'CAM-ROAD-05'
  | 'CAM-04'
  | 'CAM-06'
  | 'CAM-07'
  | 'CAM-TOWER-01'
  | 'CAM-11'
  | 'CAM-GATE-02'
  | 'CAM-PERIMETER-08'
  | 'CAM-VALLEY-09'
  | 'CAM-BARRIER-10';

export interface CctvSimulationState {
  activeCameraId: CctvCameraId;
  stageId?: number;
  stageSlug?: string;
  timeSeconds?: number;
  isVehiclePresent?: boolean;
  isAnprActive?: boolean;
  isPersonPresent: boolean;
  isFenceCrossed: boolean;
  isSwanActive: boolean;
  isCameraFailed: boolean;
  isShieldRecovered: boolean;
  progressPercent?: number;
  visibilityMode?: DemoVisibilityMode;
  customConfidence?: number;
  statusText?: string;
}

interface SimulatedCctvViewerProps {
  state: CctvSimulationState;
  onCameraSelect?: (camId: CctvCameraId) => void;
  className?: string;
  aspectRatio?: string;
}

export const CAMERA_IMAGE_MAP: Record<CctvCameraId, string> = {
  'CAM-FENCE-03': '/media/cctv/cam-03.jpg',
  'CAM-03': '/media/cctv/cam-03.jpg',
  'CAM-ROAD-05': '/media/cctv/cam-road-05.jpg',
  'CAM-04': '/media/cctv/cam-04.jpg',
  'CAM-06': '/media/cctv/cam-06.jpg',
  'CAM-07': '/media/cctv/cam-07.jpg',
  'CAM-TOWER-01': '/media/cctv/cam-tower-01.jpg',
  'CAM-11': '/media/cctv/cam-11.jpg',
  'CAM-GATE-02': '/media/cctv/cam-gate-02.jpg',
  'CAM-PERIMETER-08': '/media/cctv/cam-07.jpg',
  'CAM-VALLEY-09': '/media/cctv/cam-06.jpg',
  'CAM-BARRIER-10': '/media/cctv/cam-road-05.jpg'
};

export const CAMERA_NAMES: Record<CctvCameraId, string> = {
  'CAM-FENCE-03': 'CLOSE FENCE CORRIDOR',
  'CAM-03': 'PRIMARY PERIMETER FENCE',
  'CAM-ROAD-05': 'VEHICLE ROAD / CHECKPOINT',
  'CAM-04': 'NEIGHBOURING PERIMETER CORRIDOR',
  'CAM-06': 'WIDE BACKUP VIEW / PTZ RIDGE',
  'CAM-07': 'SECONDARY PERIMETER LINE',
  'CAM-TOWER-01': 'ELEVATED WATCHTOWER PERSPECTIVE',
  'CAM-11': 'BOP INFRASTRUCTURE / ACCESS PATH',
  'CAM-GATE-02': 'GATE / BARRIER APPROACH',
  'CAM-PERIMETER-08': 'LONG PERIMETER VIEW',
  'CAM-VALLEY-09': 'WIDER TERRAIN / VALLEY VIEW',
  'CAM-BARRIER-10': 'BARRIER / SERVICE-ROAD JUNCTION'
};

export const SimulatedCctvViewer: React.FC<SimulatedCctvViewerProps> = ({
  state,
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

  // Main 60fps Canvas Render Loop
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
      const visibility = state.visibilityMode || 'NIGHT_IR';

      ctx.clearRect(0, 0, width, height);

      // =========================================================
      // 1. CAMERA FAILURE (SHIELD EVENT): INTENTIONAL VIDEO STATIC
      // =========================================================
      if (isFailed) {
        ctx.fillStyle = '#080a0c';
        ctx.fillRect(0, 0, width, height);

        // High-frequency video static noise
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const n = (Math.random() * 55) | 0;
          data[i] = n;
          data[i + 1] = n;
          data[i + 2] = n;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        // Diagnostic failure card
        ctx.fillStyle = 'rgba(16, 19, 23, 0.94)';
        ctx.fillRect(width * 0.10, height * 0.28, width * 0.80, height * 0.44);
        ctx.strokeStyle = '#c93c3c';
        ctx.lineWidth = 2;
        ctx.strokeRect(width * 0.10, height * 0.28, width * 0.80, height * 0.44);

        ctx.fillStyle = '#c93c3c';
        ctx.font = 'bold 16px "IBM Plex Mono", monospace';
        ctx.fillText('CAM-FENCE-03: FAULT DETECTED // HEARTBEAT LOST', width * 0.14, height * 0.38);

        ctx.fillStyle = '#e5e7eb';
        ctx.font = '13px "IBM Plex Mono", monospace';
        ctx.fillText('SHIELD: CAMERA UNAVAILABLE / STREAM FAILURE [TIMEOUT > 3.0S]', width * 0.14, height * 0.46);

        ctx.fillStyle = '#8d949d';
        ctx.font = '12px "IBM Plex Mono", monospace';
        ctx.fillText('PERIMETER BLIND ZONE ESTIMATION: 32% LINEAR COVERAGE LOST', width * 0.14, height * 0.54);

        ctx.fillStyle = '#3f8f68';
        ctx.font = 'bold 12px "IBM Plex Mono", monospace';
        ctx.fillText('SHIELD RECOVERY: SLEWING BACKUP PTZ CAM-06 TO GAP (+32°)...', width * 0.14, height * 0.62);
      } else {
        // =========================================================
        // 2. PHOTOREALISTIC CCTV FOOTAGE BASE
        // =========================================================
        const bgImg = imageCacheRef.current[activeCam];
        if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
          ctx.drawImage(bgImg, 0, 0, width, height);
        } else {
          // Fallback dark gradient
          const grad = ctx.createLinearGradient(0, 0, 0, height);
          grad.addColorStop(0, '#15191f');
          grad.addColorStop(0.5, '#1e242c');
          grad.addColorStop(1, '#111417');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, width, height);
        }

        // Camera viewpoint perspective differentiation overlays
        if (activeCam === 'CAM-PERIMETER-08') {
          // Extra distant fence posts perspective
          ctx.save();
          ctx.strokeStyle = 'rgba(100, 115, 130, 0.4)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(width * 0.1, height * 0.9);
          ctx.lineTo(width * 0.95, height * 0.45);
          ctx.stroke();
          ctx.restore();
        } else if (activeCam === 'CAM-VALLEY-09') {
          // Distant valley terrain contour line
          ctx.save();
          ctx.strokeStyle = 'rgba(71, 125, 168, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, height * 0.52);
          ctx.bezierCurveTo(width * 0.3, height * 0.48, width * 0.6, height * 0.58, width, height * 0.50);
          ctx.stroke();
          ctx.restore();
        } else if (activeCam === 'CAM-BARRIER-10') {
          // Service road junction crossline
          ctx.save();
          ctx.strokeStyle = 'rgba(194, 138, 40, 0.4)';
          ctx.setLineDash([6, 6]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(width * 0.2, height * 0.7);
          ctx.lineTo(width * 0.8, height * 0.7);
          ctx.stroke();
          ctx.restore();
        }

        // =========================================================
        // 3. REALISTIC VISIBILITY SHADERS (DAY / LOW LIGHT / NIGHT IR / FOG)
        // =========================================================
        if (visibility === 'NIGHT_IR') {
          // Professional infrared low-light surveillance look
          // Cold greenish-cyan infrared tone with center gain & vignette
          ctx.save();
          ctx.fillStyle = 'rgba(8, 28, 22, 0.42)';
          ctx.fillRect(0, 0, width, height);

          // Vignette
          const radial = ctx.createRadialGradient(width * 0.5, height * 0.5, width * 0.2, width * 0.5, height * 0.5, width * 0.6);
          radial.addColorStop(0, 'rgba(0,0,0,0)');
          radial.addColorStop(1, 'rgba(0,0,0,0.65)');
          ctx.fillStyle = radial;
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        } else if (visibility === 'LOW_LIGHT') {
          // Twilight dusk: deep dark blue overlay with high noise gain
          ctx.save();
          ctx.fillStyle = 'rgba(10, 16, 28, 0.38)';
          ctx.fillRect(0, 0, width, height);
          ctx.restore();
        } else if (visibility === 'FOG') {
          // Atmospheric fog/reduced visibility scattering
          ctx.save();
          ctx.fillStyle = 'rgba(190, 205, 218, 0.46)';
          ctx.fillRect(0, 0, width, height);

          // Moving fog turbulence bands
          const fogShift = (localFrame * 0.4) % width;
          ctx.fillStyle = 'rgba(215, 228, 238, 0.18)';
          ctx.beginPath();
          ctx.ellipse((width * 0.3 + fogShift) % width, height * 0.6, width * 0.4, height * 0.22, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse((width * 0.7 - fogShift + width) % width, height * 0.45, width * 0.45, height * 0.25, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // =========================================================
        // 4. CAMERA OVERLAYS (VIRTUAL FENCE TRIPWIRE, OVERWATCH, ETC.)
        // =========================================================
        const isFenceCam =
          activeCam === 'CAM-FENCE-03' ||
          activeCam === 'CAM-03' ||
          activeCam === 'CAM-07' ||
          activeCam === 'CAM-PERIMETER-08';

        if (isFenceCam) {
          const vfCrossed = state.isFenceCrossed && (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03');
          ctx.save();
          ctx.setLineDash([9, 6]);
          ctx.strokeStyle = vfCrossed ? '#c93c3c' : 'rgba(71, 125, 168, 0.85)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          if (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03') {
            ctx.moveTo(width * 0.05, height * 0.84);
            ctx.lineTo(width * 0.92, height * 0.70);
          } else {
            ctx.moveTo(width * 0.05, height * 0.80);
            ctx.lineTo(width * 0.95, height * 0.76);
          }
          ctx.stroke();
          ctx.restore();

          // Virtual fence boundary label
          ctx.fillStyle = vfCrossed ? '#c93c3c' : '#477da8';
          ctx.font = 'bold 11px "IBM Plex Mono", monospace';
          ctx.fillText(
            vfCrossed
              ? '▲ VIRTUAL FENCE CROSSING [SECTOR 03 ALPHA: BREACH DETECTED]'
              : `■ VIRTUAL FENCE TRIPWIRE [ARMED: ${activeCam === 'CAM-07' ? 'SECTOR 07 NORTH' : 'SECTOR 03 ALPHA'}]`,
            width * 0.06,
            height * 0.76
          );
        }

        // Watchtower Overlays
        if (activeCam === 'CAM-TOWER-01') {
          ctx.save();
          ctx.strokeStyle = 'rgba(71, 125, 168, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.1, height * 0.2);
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.5, height * 0.15);
          ctx.moveTo(width * 0.5, height);
          ctx.lineTo(width * 0.9, height * 0.2);
          ctx.stroke();
          ctx.setLineDash([4, 6]);
          ctx.beginPath();
          ctx.arc(width * 0.5, height, height * 0.4, Math.PI, 2 * Math.PI);
          ctx.arc(width * 0.5, height, height * 0.75, Math.PI, 2 * Math.PI);
          ctx.stroke();
          ctx.restore();
        }

        // =========================================================
        // 5. VISIBLY MOVING VEHICLE (V-203) ON APPLICABLE FEEDS
        // =========================================================
        const hasVehicle =
          activeCam === 'CAM-ROAD-05' ||
          activeCam === 'CAM-GATE-02' ||
          activeCam === 'CAM-BARRIER-10' ||
          (state.isVehiclePresent && activeCam === 'CAM-04');

        if (hasVehicle) {
          let vehX = width * 0.22;
          let vehY = height * 0.60;
          const vehW = 120;
          const vehH = 58;

          if (activeCam === 'CAM-ROAD-05' || activeCam === 'CAM-BARRIER-10') {
            const tCycle = (localFrame * 0.8) % (width * 0.85);
            vehX = width * 0.08 + tCycle;
            vehY = height * 0.58;
          } else if (activeCam === 'CAM-GATE-02') {
            vehX = width * 0.38;
            vehY = height * 0.62;
          } else if (activeCam === 'CAM-04') {
            const tCycle = (localFrame * 0.65) % (width * 0.8);
            vehX = width * 0.10 + tCycle;
            vehY = height * 0.56;
          }

          // Ground Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.ellipse(vehX + vehW * 0.5, vehY + vehH + 3, vehW * 0.52, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          // Vehicle Chassis
          ctx.fillStyle = '#1c2228';
          ctx.fillRect(vehX + 4, vehY + 16, vehW - 8, vehH - 24);
          ctx.fillStyle = '#14181c';
          ctx.fillRect(vehX + 22, vehY + 2, vehW * 0.44, 18);
          ctx.fillStyle = '#2b333d';
          ctx.fillRect(vehX + 26, vehY + 5, vehW * 0.20, 12);
          ctx.fillRect(vehX + 28 + vehW * 0.20, vehY + 5, vehW * 0.16, 12);

          // Wheels
          ctx.fillStyle = '#0b0d0f';
          const wheelR = 9;
          ctx.beginPath();
          ctx.arc(vehX + 24, vehY + vehH - 8, wheelR, 0, Math.PI * 2);
          ctx.arc(vehX + vehW - 24, vehY + vehH - 8, wheelR, 0, Math.PI * 2);
          ctx.fill();

          // Vehicle Bounding Box
          ctx.strokeStyle = '#477da8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(vehX, vehY, vehW, vehH);

          ctx.fillStyle = 'rgba(16, 20, 25, 0.9)';
          ctx.fillRect(vehX, vehY - 18, 175, 17);
          ctx.fillStyle = '#477da8';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText('VEHICLE: UTILITY [0.94] V-203', vehX + 4, vehY - 6);
        }

        // =========================================================
        // 6. VISIBLY MOVING PERSON (TARGET T-104)
        // =========================================================
        const hasPerson =
          state.isPersonPresent &&
          (activeCam === 'CAM-FENCE-03' ||
            activeCam === 'CAM-03' ||
            activeCam === 'CAM-04' ||
            activeCam === 'CAM-06' ||
            activeCam === 'CAM-VALLEY-09' ||
            activeCam === 'CAM-TOWER-01');

        if (hasPerson) {
          let px = width * 0.32;
          let py = height * 0.65;
          let targetH = 56;
          let targetW = 22;

          const walkPhase = localFrame * 0.12;
          const leftLegAngle = Math.sin(walkPhase) * 0.55;
          const rightLegAngle = -leftLegAngle;
          const leftArmAngle = -leftLegAngle * 0.6;
          const rightArmAngle = -rightLegAngle * 0.6;
          const bodyBob = Math.abs(Math.sin(walkPhase * 2)) * 2.5;

          if (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03') {
            // Target crosses fence line progressively
            const march = (localFrame * 0.7) % (width * 0.50);
            px = width * 0.20 + march;
            py = height * 0.72 - (march / (width * 0.50)) * (height * 0.10) - bodyBob;
          } else if (activeCam === 'CAM-04') {
            const march = (localFrame * 0.6) % (width * 0.44);
            px = width * 0.38 + march;
            py = height * 0.48 - bodyBob;
            targetH = 48;
            targetW = 20;
          } else if (activeCam === 'CAM-06') {
            const march = (localFrame * 0.55) % (width * 0.40);
            px = width * 0.35 + march;
            py = height * 0.62 - bodyBob;
            targetH = 50;
            targetW = 20;
          } else if (activeCam === 'CAM-VALLEY-09') {
            const march = (localFrame * 0.5) % (width * 0.36);
            px = width * 0.44 + march;
            py = height * 0.54 - bodyBob;
            targetH = 42;
            targetW = 18;
          } else if (activeCam === 'CAM-TOWER-01') {
            const march = (localFrame * 0.45) % (width * 0.30);
            px = width * 0.48 + march;
            py = height * 0.40 - bodyBob;
            targetH = 34;
            targetW = 14;
          }

          // Ground shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.48)';
          ctx.beginPath();
          ctx.ellipse(px + targetW / 2, py + targetH + 2, targetW * 0.6, 4, 0, 0, Math.PI * 2);
          ctx.fill();

          // Person Silhouette (IR hot white/amber in NIGHT_IR mode, dark tactical in day/twilight)
          ctx.save();
          if (visibility === 'NIGHT_IR') {
            ctx.fillStyle = '#f8fafc'; // High thermal radiance
            ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
            ctx.shadowBlur = 6;
          } else {
            ctx.fillStyle = '#14181d';
          }

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
          // Dynamic Tactical Detection Bounding Box & Trajectory
          // =========================================================
          const isBreach = state.isFenceCrossed && (activeCam === 'CAM-FENCE-03' || activeCam === 'CAM-03');
          const isReIdLock = activeCam === 'CAM-04' && state.isSwanActive;
          const boxColor = isBreach ? '#c93c3c' : isReIdLock ? '#477da8' : '#c28a28';

          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 1.8;
          ctx.strokeRect(px - 3, py - 3, targetW + 6, targetH + 6);

          // Corner brackets
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

          // Confidence computation based on visibility mode
          let displayConfidence = state.customConfidence || 0.91;
          if (visibility === 'DAY') displayConfidence = 0.94;
          else if (visibility === 'LOW_LIGHT') displayConfidence = 0.87;
          else if (visibility === 'FOG') displayConfidence = 0.68;
          else if (visibility === 'NIGHT_IR') displayConfidence = 0.91;

          // Header Banner
          ctx.fillStyle = 'rgba(16, 20, 25, 0.92)';
          ctx.fillRect(px - 3, py - 20, 185, 18);
          ctx.fillStyle = boxColor;
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          const headerText = isBreach
            ? `PERSON [${displayConfidence.toFixed(2)}] T-104 [BREACH]`
            : isReIdLock
            ? `PERSON [${displayConfidence.toFixed(2)}] T-104 [SWAN CONFIRMED]`
            : `PERSON [${displayConfidence.toFixed(2)}] T-104`;
          ctx.fillText(headerText, px, py - 7);

          // Motion Trajectory Line
          ctx.strokeStyle = 'rgba(194, 138, 40, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(px + targetW / 2, py + targetH / 2);
          ctx.lineTo(px + targetW / 2 + 28, py + targetH / 2 - 12);
          ctx.stroke();

          // Trajectory breadcrumbs
          for (let d = 1; d <= 6; d++) {
            ctx.fillStyle = 'rgba(194, 138, 40, 0.45)';
            ctx.beginPath();
            ctx.arc(px + targetW / 2 - d * 9, py + targetH / 2 + d * 4.5, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          // Direction Arrow
          ctx.fillStyle = 'rgba(16, 20, 25, 0.88)';
          ctx.fillRect(px + targetW + 8, py + 2, 140, 16);
          ctx.fillStyle = '#e5e7eb';
          ctx.font = '8px "IBM Plex Mono", monospace';
          ctx.fillText('VECTOR: 1.8 M/S → 042° NE', px + targetW + 11, py + 13);
        }

        // =========================================================
        // 7. SWAN / SHIELD OVERLAYS & CORROBORATION BANNERS
        // =========================================================
        if (state.isSwanActive && !isFailed) {
          ctx.fillStyle = 'rgba(14, 18, 24, 0.94)';
          ctx.fillRect(width - 275, height - 76, 265, 64);
          ctx.strokeStyle = '#477da8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(width - 275, height - 76, 265, 64);

          ctx.fillStyle = '#477da8';
          ctx.font = 'bold 10px "IBM Plex Mono", monospace';
          ctx.fillText('SWAN: CROSS-CAMERA HANDOFF ACTIVE', width - 265, height - 56);

          ctx.fillStyle = '#e5e7eb';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('TRACK CONTINUITY: T-104 CAM-FENCE-03 → CAM-04', width - 265, height - 40);

          ctx.fillStyle = '#3f8f68';
          ctx.fillText('RE-ID LOCK: 94% COSINE MATCH [CONFIRMED]', width - 265, height - 24);
        }

        if (state.isShieldRecovered && activeCam === 'CAM-06') {
          ctx.fillStyle = 'rgba(14, 18, 24, 0.94)';
          ctx.fillRect(width - 275, height - 76, 265, 64);
          ctx.strokeStyle = '#3f8f68';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(width - 275, height - 76, 265, 64);

          ctx.fillStyle = '#3f8f68';
          ctx.font = 'bold 10px "IBM Plex Mono", monospace';
          ctx.fillText('SHIELD: AUTONOMOUS COVERAGE RESTORED', width - 265, height - 56);

          ctx.fillStyle = '#e5e7eb';
          ctx.font = '9px "IBM Plex Mono", monospace';
          ctx.fillText('MOTORIZED PTZ CAM-06 SLEWED +32° AZIMUTH', width - 265, height - 40);

          ctx.fillStyle = '#3f8f68';
          ctx.fillText('BACKUP COVERAGE: 91% [BLIND GAP CLOSED]', width - 265, height - 24);
        }

        // Fog Corroboration Notice
        if (visibility === 'FOG' && state.isPersonPresent) {
          ctx.fillStyle = 'rgba(28, 22, 12, 0.92)';
          ctx.fillRect(16, height - 56, 320, 44);
          ctx.strokeStyle = '#c28a28';
          ctx.lineWidth = 1;
          ctx.strokeRect(16, height - 56, 320, 44);

          ctx.fillStyle = '#c28a28';
          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillText('FOG / LOW VISIBILITY [OPTICAL CONFIDENCE: 0.68]', 24, height - 40);
          ctx.fillStyle = '#e5e7eb';
          ctx.font = '8px "IBM Plex Mono", monospace';
          ctx.fillText('SWAN MULTI-CAMERA CORROBORATION WITH IR REQUESTED', 24, height - 24);
        }
      }

      // Scanlines & sensor grain
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

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
      <div className="absolute top-0 inset-x-0 z-20 px-3 py-1.5 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between text-2xs text-[#e5e7eb] font-mono pointer-events-none">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              state.isCameraFailed && (state.activeCameraId === 'CAM-FENCE-03' || state.activeCameraId === 'CAM-03')
                ? 'bg-[#c93c3c]'
                : 'bg-[#3f8f68] animate-pulse'
            }`}
          />
          <span className="font-bold tracking-wider">{state.activeCameraId}</span>
          <span className="text-[#8d949d]">|</span>
          <span className="text-[#8d949d] hidden sm:inline">{CAMERA_NAMES[state.activeCameraId]}</span>
          <span className="px-1.5 py-0.2 rounded bg-[#181b20] border border-[#30353b] text-[#8d949d] text-[9px]">
            {state.visibilityMode === 'NIGHT_IR'
              ? 'THERMAL + IR 1080P'
              : state.visibilityMode === 'FOG'
              ? 'LOW VISIBILITY OPTICAL'
              : 'OPTICAL 1080P'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-right">
          <span className="text-[#e5e7eb] tracking-wider">{timestamp}</span>
          <span className="px-1.5 py-0.5 rounded bg-[#c28a28]/20 border border-[#c28a28]/40 text-[#c28a28] text-[9px] font-bold">
            SIMULATED DEMONSTRATION FOOTAGE
          </span>
        </div>
      </div>

      {/* Main HTML5 Canvas Video Surface (Strict 16:9 uncropped, object-contain) */}
      <div className={`w-full ${aspectRatio} relative bg-[#090b0e] overflow-hidden flex items-center justify-center`}>
        <canvas
          ref={canvasRef}
          width={960}
          height={540}
          className="w-full h-full object-contain block max-h-full"
        />
      </div>

      {/* CCTV Bottom Telemetry Status Bar */}
      <div className="px-2.5 py-1 bg-[#111419] border-t border-[#30353b] flex flex-wrap items-center justify-between gap-1.5 text-xs font-mono shrink-0">
        <div className="flex items-center gap-2.5 text-2xs text-[#8d949d]">
          <div className="flex items-center gap-1">
            <span className="text-[#8d949d]">MODE:</span>
            <span className="text-white font-bold">{state.visibilityMode || 'NIGHT_IR'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[#8d949d]">AI STATUS:</span>
            <span className="text-[#3f8f68] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3f8f68]" />
              {state.visibilityMode === 'FOG' ? 'LOW VISIBILITY (14ms)' : 'ACTIVE (14ms)'}
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
          {state.statusText || 'DEMO FEED • BOP PERIMETER FABRIC'}
        </div>
      </div>
    </div>
  );
};
