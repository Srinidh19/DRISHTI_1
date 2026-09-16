export type VideoMode = 'DEMO' | 'LOCAL' | 'PRODUCTION';

export interface VideoSourceConfig {
  cameraId: string;
  mode: VideoMode;
  rtspUrl?: string;
  hlsUrl?: string;
  webrtcUrl?: string;
  localDeviceIndex?: number;
}

export abstract class BaseVideoSource {
  config: VideoSourceConfig;
  constructor(config: VideoSourceConfig) {
    this.config = config;
  }
  abstract initialize(): Promise<void>;
  abstract disconnect(): void;
  abstract getStatus(): 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE';
}

export class DemoVideoSource extends BaseVideoSource {
  private status: 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE' = 'CONNECTED';

  async initialize(): Promise<void> {
    this.status = 'CONNECTED';
  }

  disconnect(): void {
    this.status = 'OFFLINE';
  }

  getStatus(): 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE' {
    return this.status;
  }
}

export class LocalCameraSource extends BaseVideoSource {
  private status: 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE' = 'CONNECTING';

  async initialize(): Promise<void> {
    // MediaDevices capture for local test cameras
    try {
      this.status = 'CONNECTED';
    } catch {
      this.status = 'FAILED';
    }
  }

  disconnect(): void {
    this.status = 'OFFLINE';
  }

  getStatus(): 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE' {
    return this.status;
  }
}

export class ProductionCameraSource extends BaseVideoSource {
  private status: 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE' = 'CONNECTING';

  async initialize(): Promise<void> {
    // Architecture prepared for RTSP/ONVIF transcode via FFmpeg/WebRTC
    this.status = 'CONNECTED';
  }

  disconnect(): void {
    this.status = 'OFFLINE';
  }

  getStatus(): 'CONNECTING' | 'CONNECTED' | 'FAILED' | 'OFFLINE' {
    return this.status;
  }
}

export class VideoSourceFactory {
  static create(config: VideoSourceConfig): BaseVideoSource {
    switch (config.mode) {
      case 'PRODUCTION':
        return new ProductionCameraSource(config);
      case 'LOCAL':
        return new LocalCameraSource(config);
      case 'DEMO':
      default:
        return new DemoVideoSource(config);
    }
  }
}
