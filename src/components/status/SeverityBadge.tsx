import React from 'react';
import { IncidentSeverity, CameraHealthStatus } from '../../types';

export const SeverityBadge: React.FC<{ severity: IncidentSeverity; size?: 'sm' | 'md' }> = ({
  severity,
  size = 'md'
}) => {
  const isSm = size === 'sm';

  switch (severity) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider bg-critical-bg text-critical-text border border-critical-border rounded ${
            isSm ? 'text-2xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
          }`}
        >
          <span className="text-critical text-[10px]">●</span>
          <span>CRITICAL</span>
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider bg-warning-bg text-warning-text border border-warning-border rounded ${
            isSm ? 'text-2xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
          }`}
        >
          <span className="text-warning text-[10px]">▲</span>
          <span>HIGH</span>
        </span>
      );
    case 'LOW':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-semibold uppercase tracking-wider bg-info-bg text-info-text border border-info-border rounded ${
            isSm ? 'text-2xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
          }`}
        >
          <span className="text-info text-[10px]">■</span>
          <span>LOW</span>
        </span>
      );
    case 'INFORMATIONAL':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-mono font-medium uppercase tracking-wider bg-surface-2 text-text-muted border border-border rounded ${
            isSm ? 'text-2xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'
          }`}
        >
          <span className="text-text-muted text-[10px]">○</span>
          <span>INFO</span>
        </span>
      );
  }
};

export const CameraHealthBadge: React.FC<{ health: CameraHealthStatus }> = ({ health }) => {
  switch (health) {
    case 'ONLINE':
      return (
        <span className="inline-flex items-center gap-1 font-mono text-2xs px-1.5 py-0.5 rounded bg-success-bg text-success-text border border-success-border font-medium">
          <span>✓</span>
          <span>ONLINE</span>
        </span>
      );
    case 'WARNING':
      return (
        <span className="inline-flex items-center gap-1 font-mono text-2xs px-1.5 py-0.5 rounded bg-warning-bg text-warning-text border border-warning-border font-medium">
          <span>!</span>
          <span>WARNING</span>
        </span>
      );
    case 'OFFLINE':
      return (
        <span className="inline-flex items-center gap-1 font-mono text-2xs px-1.5 py-0.5 rounded bg-critical-bg text-critical-text border border-critical-border font-medium">
          <span>×</span>
          <span>OFFLINE</span>
        </span>
      );
  }
};
