import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { Incident, IncidentSeverity } from '../../types';
import { SeverityBadge } from '../status/SeverityBadge';
import { AlertTriangle, Clock, ArrowRight, Shield, Filter } from 'lucide-react';

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

  const sortedIncidents = [...incidents]
    .filter(inc => inc.status !== 'DISMISSED' && inc.status !== 'RESOLVED')
    .filter(inc => (severityFilter === 'ALL' ? true : inc.severity === severityFilter))
    .sort((a, b) => {
      const diff = severityWeight(b.severity) - severityWeight(a.severity);
      if (diff !== 0) return diff;
      return b.riskScore - a.riskScore;
    });

  return (
    <div className="flex flex-col h-full bg-surface border-l border-border select-none font-mono text-xs">
      {/* Header with Title and Severity Counter */}
      <div className="p-2.5 border-b border-border flex items-center justify-between bg-surface-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-critical" />
          <span className="font-bold text-text uppercase tracking-wider">Active Incident Queue</span>
        </div>
        <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-2xs text-text-muted">
          {sortedIncidents.length} active
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1.5 border-b border-border bg-surface text-2xs">
        <button
          onClick={() => setSeverityFilter('ALL')}
          className={`px-2 py-1 rounded transition-colors ${
            severityFilter === 'ALL'
              ? 'bg-surface-3 text-white font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setSeverityFilter('CRITICAL')}
          className={`px-2 py-1 rounded transition-colors ${
            severityFilter === 'CRITICAL'
              ? 'bg-critical-bg text-critical-text border border-critical-border font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          CRITICAL
        </button>
        <button
          onClick={() => setSeverityFilter('HIGH')}
          className={`px-2 py-1 rounded transition-colors ${
            severityFilter === 'HIGH'
              ? 'bg-warning-bg text-warning-text border border-warning-border font-semibold'
              : 'text-text-muted hover:text-text'
          }`}
        >
          HIGH
        </button>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {sortedIncidents.length === 0 ? (
          <div className="p-4 text-center text-text-muted text-xs space-y-1">
            <div>NO ACTIVE INCIDENTS</div>
            <div className="text-2xs text-text-dim">
              All monitored zones currently show no unresolved high-priority events.
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
                className={`p-2.5 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-surface-3 border-l-4 border-critical'
                    : 'hover:bg-surface-2 border-l-4 border-transparent'
                }`}
              >
                {/* Severity & Incident Code */}
                <div className="flex items-center justify-between mb-1">
                  <SeverityBadge severity={inc.severity} size="sm" />
                  <span className="font-bold text-text-muted text-2xs">{inc.id}</span>
                </div>

                {/* Title */}
                <div className="font-semibold text-text text-sm mb-1 leading-snug line-clamp-1">
                  {inc.title}
                </div>

                {/* Intrusion details */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-2xs text-text-muted mb-2">
                  <div>
                    <span className="text-text-dim">TARGET: </span>
                    <span className="text-text font-medium">
                      {inc.objectCount} {inc.objectType.toLowerCase()}(s)
                    </span>
                  </div>
                  <div>
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
                  <div className="col-span-2 flex items-center gap-1 text-text-muted">
                    <span className="text-text-dim">CAM: </span>
                    <span className="text-text">{inc.cameras.join(' → ')}</span>
                  </div>
                  {inc.direction && (
                    <div className="col-span-2 flex items-center gap-1 text-text-muted">
                      <span className="text-text-dim">HEADING: </span>
                      <span className="text-text">{inc.direction}</span>
                    </div>
                  )}
                </div>

                {/* Time & Status bar */}
                <div className="flex items-center justify-between text-2xs text-text-dim pt-1 border-t border-border/40">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {inc.timestamp}
                  </span>
                  <span className="uppercase tracking-wider font-semibold text-text-muted">
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
