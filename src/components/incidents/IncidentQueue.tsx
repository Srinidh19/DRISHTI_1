import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { Incident, IncidentSeverity } from '../../types';
import { SeverityBadge } from '../status/SeverityBadge';
import { AlertTriangle, Clock } from 'lucide-react';

interface IncidentQueueProps {
  onSelectIncident?: (incident: Incident) => void;
}

export const IncidentQueue: React.FC<IncidentQueueProps> = ({ onSelectIncident }) => {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useRealtime();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | IncidentSeverity>('ALL');

  // Command screen priority sorting: CRITICAL > HIGH > LOW > INFORMATIONAL
  const severityWeight = (sev: IncidentSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return 4;
      case 'HIGH':
        return 3;
      case 'LOW':
        return 2;
      case 'INFORMATIONAL':
        return 1;
    }
  };

  const activeIncidents = incidents.filter(
    inc => inc.status !== 'DISMISSED' && inc.status !== 'RESOLVED'
  );

  const sortedIncidents = [...activeIncidents]
    .filter(inc => (severityFilter === 'ALL' ? true : inc.severity === severityFilter))
    .sort((a, b) => {
      const diff = severityWeight(b.severity) - severityWeight(a.severity);
      if (diff !== 0) return diff;
      return b.riskScore - a.riskScore;
    });

  const criticalCount = activeIncidents.filter(i => i.severity === 'CRITICAL').length;
  const highCount = activeIncidents.filter(i => i.severity === 'HIGH').length;

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-surface select-none font-mono text-xs overflow-hidden">
      {/* QUEUE HEADER (Fixed) */}
      <div className="shrink-0 p-2.5 border-b border-border flex items-center justify-between bg-surface-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-critical shrink-0" />
          <span className="font-bold text-text uppercase tracking-wider text-xs">
            Active Incident Queue
          </span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-2xs text-text-muted">
          {sortedIncidents.length} active
        </span>
      </div>

      {/* FILTER TABS (Fixed) */}
      <div className="shrink-0 flex items-center gap-1 p-1.5 border-b border-border bg-surface text-2xs">
        <button
          onClick={() => setSeverityFilter('ALL')}
          className={`px-2 py-1 rounded transition-colors ${
            severityFilter === 'ALL'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          ALL ({activeIncidents.length})
        </button>
        <button
          onClick={() => setSeverityFilter('CRITICAL')}
          className={`px-2 py-1 rounded transition-colors ${
            severityFilter === 'CRITICAL'
              ? 'bg-critical-bg text-critical-text border border-critical-border font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          CRITICAL ({criticalCount})
        </button>
        <button
          onClick={() => setSeverityFilter('HIGH')}
          className={`px-2 py-1 rounded transition-colors ${
            severityFilter === 'HIGH'
              ? 'bg-warning-bg text-warning-text border border-warning-border font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          HIGH ({highCount})
        </button>
      </div>

      {/* QUEUE LIST (Scrollable, perfectly contained) */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-2 space-y-2">
        {sortedIncidents.length === 0 ? (
          <div className="p-4 text-center text-text-muted text-xs space-y-1">
            <div className="font-semibold text-text">NO INCIDENTS MATCH FILTER</div>
            <div className="text-2xs text-text-dim">
              All monitored zones currently show no unresolved events in this tier.
            </div>
          </div>
        ) : (
          sortedIncidents.map(inc => {
            const isSelected = selectedIncidentId === inc.id;

            return (
              <div
                key={inc.id}
                onClick={() => {
                  setSelectedIncidentId(inc.id);
                  if (onSelectIncident) onSelectIncident(inc);
                }}
                className={`p-2.5 rounded border transition-colors cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface-3 border-critical shadow-sm'
                    : 'bg-surface-2/70 hover:bg-surface-2 border-border'
                }`}
              >
                {/* Header: [SEVERITY] and INCIDENT ID */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <SeverityBadge severity={inc.severity} size="sm" />
                  <span className="font-bold text-text-muted text-2xs tracking-wider">{inc.id}</span>
                </div>

                {/* Short Description / Title: limited to 2 lines with line-clamp-2 */}
                <div
                  className="font-semibold text-text text-xs mb-1.5 leading-snug line-clamp-2"
                  title={inc.title}
                >
                  {inc.title}
                </div>

                {/* Tactical Metadata Box: Camera, BOP, Target, Risk with consistent padding & line-height */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-2xs text-text-muted mb-2 bg-surface/60 p-2 rounded border border-border/50">
                  <div className="truncate">
                    <span className="text-text-dim">TARGET: </span>
                    <span className="text-text font-medium">
                      {inc.objectCount} {inc.objectType.toLowerCase()}(s)
                    </span>
                  </div>
                  <div className="text-right truncate">
                    <span className="text-text-dim">RISK: </span>
                    <span
                      className={`font-bold ${
                        inc.riskScore >= 80
                          ? 'text-critical'
                          : inc.riskScore >= 50
                          ? 'text-warning'
                          : 'text-info'
                      }`}
                    >
                      {inc.riskScore}/100
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center gap-1 text-text-muted truncate">
                    <span className="text-text-dim shrink-0">CAM: </span>
                    <span className="text-text truncate" title={inc.cameras.join(' → ')}>
                      {inc.cameras.join(' → ')}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-1 text-text-muted text-[10px]">
                    <span className="truncate">
                      <span className="text-text-dim">BOP: </span>
                      <span className="text-text">{inc.bop || 'BOP-17'}</span>
                    </span>
                    {inc.direction && (
                      <span className="truncate text-right">
                        <span className="text-text-dim">HDG: </span>
                        <span className="text-text">{inc.direction}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Timestamp & Status: consistent bottom alignment */}
                <div className="flex items-center justify-between text-2xs text-text-dim pt-1.5 border-t border-border/40 mt-auto">
                  <span className="flex items-center gap-1.5 text-text-muted">
                    <Clock className="w-3 h-3 text-text-dim shrink-0" />
                    <span>{inc.timestamp}</span>
                  </span>
                  <span className="uppercase tracking-wider font-semibold text-text-muted text-[10px]">
                    [{inc.status}]
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
