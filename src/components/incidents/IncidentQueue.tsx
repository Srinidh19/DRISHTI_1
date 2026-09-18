import React, { useState } from 'react';
import { useRealtime } from '../../context/RealtimeContext';
import { Incident, IncidentSeverity } from '../../types';
import { SeverityBadge } from '../status/SeverityBadge';
import { AlertTriangle, Clock, History, CheckCircle2, XCircle } from 'lucide-react';

interface IncidentQueueProps {
  onSelectIncident?: (incident: Incident) => void;
}

export const IncidentQueue: React.FC<IncidentQueueProps> = ({ onSelectIncident }) => {
  const { incidents, selectedIncidentId, setSelectedIncidentId } = useRealtime();
  const [queueTab, setQueueTab] = useState<'ACTIVE' | 'HISTORY'>('ACTIVE');
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

  // Active queue contains DETECTED, UNDER REVIEW, ASSIGNED; excludes CONFIRMED, DISMISSED, RESOLVED
  const activeIncidents = incidents.filter(
    inc => inc.status !== 'CONFIRMED' && inc.status !== 'DISMISSED' && inc.status !== 'RESOLVED'
  );

  // History contains CONFIRMED, DISMISSED, RESOLVED
  const historyIncidents = incidents.filter(
    inc => inc.status === 'CONFIRMED' || inc.status === 'DISMISSED' || inc.status === 'RESOLVED'
  );

  const displayList = queueTab === 'ACTIVE' ? activeIncidents : historyIncidents;

  const sortedIncidents = [...displayList]
    .filter(inc => (severityFilter === 'ALL' ? true : inc.severity === severityFilter))
    .sort((a, b) => {
      const diff = severityWeight(b.severity) - severityWeight(a.severity);
      if (diff !== 0) return diff;
      return b.riskScore - a.riskScore;
    });

  const criticalCount = displayList.filter(i => i.severity === 'CRITICAL').length;
  const highCount = displayList.filter(i => i.severity === 'HIGH').length;

  return (
    <div className="flex flex-col h-full min-h-0 w-full bg-surface select-none font-mono text-xs overflow-hidden">
      {/* QUEUE TAB SELECTOR (ACTIVE VS HISTORY) */}
      <div className="shrink-0 p-1.5 border-b border-border bg-surface-2 flex items-center justify-between gap-1 text-2xs">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setQueueTab('ACTIVE')}
            className={`flex-1 py-1 px-2 rounded font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              queueTab === 'ACTIVE'
                ? 'bg-surface text-white border border-border shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <AlertTriangle className="w-3 h-3 text-critical" />
            <span>ACTIVE QUEUE ({activeIncidents.length})</span>
          </button>

          <button
            onClick={() => setQueueTab('HISTORY')}
            className={`flex-1 py-1 px-2 rounded font-semibold transition-colors flex items-center justify-center gap-1.5 ${
              queueTab === 'HISTORY'
                ? 'bg-surface text-white border border-border shadow-sm'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <History className="w-3 h-3 text-info" />
            <span>HISTORY ({historyIncidents.length})</span>
          </button>
        </div>
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
          ALL ({displayList.length})
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
            <div className="font-semibold text-text">
              {queueTab === 'ACTIVE' ? 'NO ACTIVE INCIDENTS' : 'NO RESOLVED INCIDENTS'}
            </div>
            <div className="text-2xs text-text-dim">
              {queueTab === 'ACTIVE'
                ? 'All monitored zones currently clear. Confirmed incidents are logged in History.'
                : 'No historical or confirmed incidents recorded yet.'}
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
                className={`p-2.5 rounded border transition-all cursor-pointer font-mono ${
                  isSelected
                    ? 'bg-surface-3 border-info shadow-md ring-1 ring-info/50'
                    : 'bg-surface-2 border-border hover:border-border-bright hover:bg-surface-3/50'
                }`}
              >
                {/* Top row: ID, Severity, Status */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-bold text-text text-2xs truncate">{inc.id}</span>
                    <span className="text-text-dim text-[10px]">&bull;</span>
                    <span className="text-text-muted text-[10px] truncate">{inc.bop}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {inc.status === 'CONFIRMED' && (
                      <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-success-bg text-success-text text-[9px] font-bold border border-success-border">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        CONFIRMED
                      </span>
                    )}
                    {inc.status === 'DISMISSED' && (
                      <span className="flex items-center gap-0.5 px-1 py-0.2 rounded bg-surface text-text-dim text-[9px] font-bold border border-border">
                        <XCircle className="w-2.5 h-2.5" />
                        DISMISSED
                      </span>
                    )}
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </div>
                </div>

                {/* Title */}
                <div className="font-semibold text-text text-xs line-clamp-1 mb-1">
                  {inc.title}
                </div>

                {/* Metadata row */}
                <div className="flex items-center justify-between text-[10px] text-text-dim pt-1 border-t border-border/40">
                  <span className="truncate max-w-[130px]">{inc.primaryCamera}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="w-2.5 h-2.5 text-text-dim" />
                    <span>{inc.timestamp.split('T')[1]?.slice(0, 5) || '02:14'}</span>
                    <span>&bull;</span>
                    <span className="text-warning font-semibold">Risk {inc.riskScore}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
