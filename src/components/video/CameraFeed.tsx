import React, { useRef, useEffect, useState } from 'react';
import { Camera } from '../../types';
import { useRealtime } from '../../context/RealtimeContext';
import { Maximize2, Camera as CameraIcon, ShieldAlert, AlertTriangle } from 'lucide-react';

interface CameraFeedProps {
  camera: Camera;
  isCompact?: boolean;
  aspectRatio?: string;
  showControls?: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  camera,
  isCompact = false,
  aspectRatio = 'aspect-video',
  showControls = true
}) => {
  const { overlaySettings, setSelectedCameraId, shieldFaults } = useRealtime();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshotFlash, setSnapshotFlash] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [timestampStr, setTimestampStr] = useState<string>('');

  const fault = shieldFaults.find(f => f.cameraId === camera.id);
  const isFailed = camera.health === 'OFFLINE' || (camera.id === 'CAM-03' && fault?.condition.includes('obstruction'));
  const isFault = camera.health === 'WARNING' || Boolean(fault);

  // Clock for OSD timestamp
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestampStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const bgImageRef = useRef<HTMLImageElement | null>(null);

  // Preload photographic CCTV background asset
  useEffect(() => {
    const bgSrc =
      camera.id === 'CAM-03'
        ? '/media/cctv/cam-03.jpg'
        : camera.id === 'CAM-04'
        ? '/media/cctv/cam-04.jpg'
        : camera.id === 'CAM-06'
        ? '/media/cctv/cam-06.jpg'
        : camera.id === 'CAM-07'
        ? '/media/cctv/cam-07.jpg'
        : camera.id === 'CAM-TOWER-01'
        ? '/media/cctv/cam-tower-01.jpg'
        : camera.id === 'CAM-ROAD-05'
        ? '/media/cctv/cam-road-05.jpg'
        : camera.id === 'CAM-01'
        ? '/media/cctv/cam-07.jpg'
        : '/media/cctv/cam-04.jpg';

    const img = new Image();
    img.src = bgSrc;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [camera.id]);

  // Draw procedural CCTV video frame simulation on HTML5 canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frameCount = 0;

    const render = () => {
      frameCount++;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      if (isFailed) {
        // CCTV static noise with clear operational fault messaging
        ctx.fillStyle = '#0a0c0e';
        ctx.fillRect(0, 0, width, height);

        // Heavy video static grain
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() * 45) | 0;
          data[i] = noise;
          data[i + 1] = noise;
          data[i + 2] = noise;
          data[i + 3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);

        // Center warning block
        ctx.fillStyle = 'rgba(18, 20, 24, 0.9)';
        ctx.fillRect(15, height / 2 - 28, width - 30, 56);
        ctx.strokeStyle = '#c93c3c';
        ctx.lineWidth = 1;
        ctx.strokeRect(15, height / 2 - 28, width - 30, 56);

        ctx.fillStyle = '#c93c3c';
        ctx.font = 'bold 12px "IBM Plex Mono", monospace';
        const headline = `${camera.id}: CAMERA OFFLINE`;
        ctx.fillText(headline, 25, height / 2 - 8);

        ctx.fillStyle = '#8d949d';
        ctx.font = '10px "IBM Plex Mono", monospace';
        const subMsg = fault ? `SHIELD FAULT: ${fault.condition}` : 'SHIELD FAULT: STREAM INTERRUPTION';
        ctx.fillText(subMsg, 25, height / 2 + 12);
        return;
      }

      // Draw real CCTV background asset if loaded, otherwise fallback gradient
      const bgImg = bgImageRef.current;
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, 0, 0, width, height);
      } else if (camera.streamType === 'thermal') {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#1a1e22');
        grad.addColorStop(0.5, '#20262c');
        grad.addColorStop(1, '#15181c');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      } else {
        const grad = ctx.createLinearGradient(0, 0, 0, height);
        grad.addColorStop(0, '#171c22');
        grad.addColorStop(0.6, '#1f2730');
        grad.addColorStop(1, '#13181e');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // Standby state overlay if camera is in standby
      if (camera.health === 'STANDBY' as any) {
        ctx.fillStyle = 'rgba(18, 20, 24, 0.75)';
        ctx.fillRect(10, 10, 180, 26);
        ctx.fillStyle = '#477da8';
        ctx.font = 'bold 10px "IBM Plex Mono", monospace';
        ctx.fillText('STANDBY OVERWATCH // SLEW READY', 16, 26);
      }

      // Interlaced scan lines
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      for (let y = 0; y < height; y += 3) {
        ctx.fillRect(0, y, width, 1);
      }

      // Subtle CCTV Grain
      if (frameCount % 2 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 35; i++) {
          const rx = Math.random() * width;
          const ry = Math.random() * height;
          ctx.fillRect(rx, ry, 2, 2);
        }
      }

      // Simulated detected moving targets
      if (camera.detectedObjects && camera.detectedObjects.length > 0) {
        camera.detectedObjects.forEach(obj => {
          const ox = (obj.bbox[0] * width) / 100;
          const oy = (obj.bbox[1] * height) / 100;
          const ow = (obj.bbox[2] * width) / 100;
          const oh = (obj.bbox[3] * height) / 100;

          // Target figure
          if (camera.streamType === 'thermal') {
            ctx.fillStyle = 'rgba(240, 248, 255, 0.9)';
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh * 0.25, ow * 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(ox + ow * 0.28, oy + oh * 0.35, ow * 0.44, oh * 0.55);
          } else {
            ctx.fillStyle = 'rgba(12, 16, 20, 0.95)';
            ctx.beginPath();
            ctx.arc(ox + ow / 2, oy + oh * 0.25, ow * 0.22, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillRect(ox + ow * 0.28, oy + oh * 0.35, ow * 0.44, oh * 0.55);
          }

          // Tactical Bounding Box
          if (overlaySettings.showDetections) {
            ctx.strokeStyle = '#c93c3c';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(ox, oy, ow, oh);

            // High-contrast box corners
            const cLen = 5;
            ctx.strokeStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(ox, oy + cLen);
            ctx.lineTo(ox, oy);
            ctx.lineTo(ox + cLen, oy);
            ctx.moveTo(ox + ow - cLen, oy);
            ctx.lineTo(ox + ow, oy);
            ctx.lineTo(ox + ow, oy + cLen);
            ctx.stroke();

            // Tactical Label Tag
            ctx.fillStyle = '#111315';
            ctx.fillRect(ox, oy - 15, Math.max(85, ow + 14), 15);
            ctx.strokeStyle = '#c93c3c';
            ctx.strokeRect(ox, oy - 15, Math.max(85, ow + 14), 15);

            ctx.fillStyle = '#e5e7eb';
            ctx.font = 'bold 9px "IBM Plex Mono", monospace';
            const labelStr = overlaySettings.showTrackIds && obj.trackId
              ? `${obj.label} [${obj.trackId}] ${(obj.confidence * 100).toFixed(0)}%`
              : `${obj.label} ${(obj.confidence * 100).toFixed(0)}%`;
            ctx.fillText(labelStr, ox + 3, oy - 4);
          }
        });
      }

      // Operational Crosshair Center
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 10, height / 2);
      ctx.lineTo(width / 2 + 10, height / 2);
      ctx.moveTo(width / 2, height / 2 - 10);
      ctx.lineTo(width / 2, height / 2 + 10);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [camera, isFailed, overlaySettings]);

  const handleSnapshot = () => {
    setSnapshotFlash(true);
    setTimeout(() => setSnapshotFlash(false), 200);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const primaryObj = camera.detectedObjects?.[0];

  return (
    <div
      ref={containerRef}
      onClick={() => setSelectedCameraId(camera.id)}
      className={`relative bg-[#0f1114] border border-border overflow-hidden rounded flex flex-col select-none cursor-pointer group hover:border-info/60 transition-colors ${aspectRatio}`}
    >
      {/* Flash effect on snapshot capture */}
      {snapshotFlash && <div className="absolute inset-0 bg-white/70 z-40 pointer-events-none" />}

      {/* TOP HEADER: Camera ID & Live/Fault State */}
      <div className="h-6 shrink-0 bg-surface/95 border-b border-border px-2 flex items-center justify-between text-2xs font-mono z-20">
        <div className="flex items-center gap-1.5 truncate">
          <span className="font-bold text-text tracking-wider">{camera.id}</span>
          {camera.isPtzBackup && (
            <span className="px-1 rounded bg-[#477da8]/20 text-[#477da8] text-[9px] font-bold border border-[#477da8]/40">
              PTZ BACKUP
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isFailed ? (
            <span className="flex items-center gap-1 text-critical font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-critical animate-pulse" />
              OFFLINE
            </span>
          ) : isFault ? (
            <span className="flex items-center gap-1 text-warning font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
              FAULT
            </span>
          ) : (
            <span className="flex items-center gap-1 text-success font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              LIVE
            </span>
          )}
        </div>
      </div>

      {/* VIDEO CANVAS SURFACE */}
      <div className="relative flex-1 min-h-0 w-full overflow-hidden bg-[#090b0d] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={380}
          height={214}
          className="w-full h-full object-contain block"
        />

        {/* Top-right subtle stream watermark */}
        <div className="absolute top-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[9px] text-text-dim font-mono pointer-events-none">
          SIMULATED STREAM
        </div>

        {/* Timestamp OSD */}
        <div className="absolute bottom-1 left-1 px-1 py-0.5 rounded bg-black/60 text-[9px] text-text-muted font-mono pointer-events-none">
          {timestampStr}
        </div>

        {/* Hover quick controls */}
        {showControls && (
          <div className="absolute top-1 left-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 p-0.5 rounded z-30">
            <button
              onClick={e => {
                e.stopPropagation();
                handleSnapshot();
              }}
              className="p-1 hover:bg-surface-2 text-text-muted hover:text-white rounded transition-colors"
              title="Capture snapshot to Evidence"
            >
              <CameraIcon className="w-3 h-3" />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                handleToggleFullscreen();
              }}
              className="p-1 hover:bg-surface-2 text-text-muted hover:text-white rounded transition-colors"
              title="Fullscreen feed"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Scanline texture */}
        <div className="absolute inset-0 cctv-scanlines opacity-30 pointer-events-none" />
      </div>

      {/* BOTTOM OPERATIONAL BAND (Prioritized per specification) */}
      <div className="h-10 shrink-0 bg-surface/95 border-t border-border px-2 py-1 flex flex-col justify-center text-[10px] font-mono leading-tight z-20">
        <div className="flex items-center justify-between text-text-muted">
          <span className="truncate max-w-[120px] text-text font-medium">{camera.location}</span>
          <div className="flex items-center gap-1.5 text-text-dim shrink-0">
            <span className="uppercase">{camera.streamType}</span>
            <span>•</span>
            <span>{camera.fps} FPS</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-0.5">
          <span className="text-text-dim">
            Objects: <strong className="text-text font-semibold">{camera.detectedObjects?.length || 0}</strong>
          </span>
          {primaryObj?.trackId ? (
            <span className="text-critical font-bold bg-critical/15 px-1 rounded border border-critical/30">
              Track: {primaryObj.trackId}
            </span>
          ) : (
            <span className="text-text-dim">No Intrusion</span>
          )}
        </div>
      </div>
    </div>
  );
};
