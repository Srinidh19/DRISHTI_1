import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRealtime } from '../../context/RealtimeContext';
import { SeverityBadge } from '../status/SeverityBadge';
import {
  ExternalLink,
  CheckCircle,
  AlertOctagon,
  XCircle,
  UserPlus,
  FileText,
  Clock,
  Activity,
  Shield,
  Layers
} from 'lucide-react';

export const SelectedIncidentPanel: React.FC = () => {
  const navigate = useNavigate();
  const {
    incidents,
    selectedIncidentId,
    confirmIncident,
    dismissIncident,
    escalateIncident,
    currentUser,
    annotateIncident
  } = useRealtime();

  const [noteInput, setNoteInput] = useState('');
  const [showNoteBox, setShowNoteBox] = useState(false);

  const incident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];

  if (!incident) {
    return (
      <div className="p-4 text-center text-text-muted text-xs font-mono">
        NO INCIDENT SELECTED
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    annotateIncident(incident.id, noteInput);
    setNoteInput('');
    setShowNoteBox(false);
  };

  return (
    <div className="flex flex-col h-full bg-surface border-l border-border select-none font-mono text-xs overflow-y-auto">
      {/* Header */}
      <div className="p-2.5 border-b border-border bg-surface-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SeverityBadge severity={incident.severity} size="sm" />
          <span className="font-bold text-text">{incident.id}</span>
        </div>
        <button
          onClick={() => navigate(`/app/incidents/${incident.id}`)}
          className="flex items-center gap-1 text-2xs text-info hover:text-white px-1.5 py-0.5 rounded bg-surface border border-border transition-colors"
          title="Open complete incident workspace"
        >
          <span>Workspace</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Incident Title & Meta */}
      <div className="p-3 border-b border-border space-y-2">
        <div className="text-sm font-bold text-text leading-snug">
          {incident.title}
        </div>
        <div className="text-2xs text-text-muted flex flex-wrap gap-x-3 gap-y-1">
          <span>{incident.location}</span>
          <span>•</span>
          <span>{incident.bop}</span>
          <span>•</span>
          <span>{incident.timestamp}</span>
        </div>
      </div>

      {/* Risk & Telemetry Matrix */}
      <div className="p-3 border-b border-border grid grid-cols-3 gap-2 bg-surface-2/40">
        <div className="bg-surface p-2 rounded border border-border">
          <div className="text-2xs text-text-dim">RISK SCORE</div>
          <div className={`text-base font-bold ${incident.riskScore >= 80 ? 'text-critical' : 'text-warning'}`}>
            {incident.riskScore}/100
          </div>
        </div>
        <div className="bg-surface p-2 rounded border border-border">
          <div className="text-2xs text-text-dim">CONFIDENCE</div>
          <div className="text-base font-bold text-text">
            {(incident.confidence * 100).toFixed(0)}%
          </div>
        </div>
        <div className="bg-surface p-2 rounded border border-border">
          <div className="text-2xs text-text-dim">PERSISTENCE</div>
          <div className="text-base font-bold text-text">
            {incident.persistenceSeconds}s
          </div>
        </div>
      </div>

      {/* Correlation & Track Info */}
      <div className="p-3 border-b border-border space-y-2 text-2xs">
        <div className="text-2xs text-text-dim uppercase tracking-wider font-semibold">
          Sensor Correlation
        </div>
        <div className="space-y-1.5 text-text-muted">
          <div className="flex items-center justify-between">
            <span className="text-text-dim">Track ID:</span>
            <span className="text-critical font-bold">{incident.trackId || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-dim">Cameras:</span>
            <span className="text-text font-semibold">{incident.cameras.join(' → ')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-dim">Direction:</span>
            <span className="text-text">{incident.direction || 'Calculating'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-dim">Status:</span>
            <span className="text-info font-semibold uppercase">{incident.status}</span>
          </div>
        </div>
      </div>

      {/* Event Timeline snippet */}
      <div className="p-3 border-b border-border space-y-2 flex-1">
        <div className="text-2xs text-text-dim uppercase tracking-wider font-semibold flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-text-muted" />
          <span>Timeline</span>
        </div>
        <div className="space-y-2 pl-2 border-l border-border text-2xs">
          {incident.timeline.slice(-4).map((item, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[13px] top-1 w-2 h-2 rounded-full bg-surface border border-info" />
              <div className="font-semibold text-text">{item.title}</div>
              <div className="text-2xs text-text-dim">{item.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Operator Action Bar */}
      <div className="p-3 bg-surface-2 border-t border-border space-y-2">
        <div className="text-2xs text-text-dim uppercase tracking-wider font-semibold">
          Operator Triage
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => confirmIncident(incident.id)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-success-bg hover:bg-success-border border border-success-border text-success-text rounded font-semibold text-2xs transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>CONFIRM</span>
          </button>

          <button
            onClick={() => escalateIncident(incident.id)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-critical-bg hover:bg-critical-border border border-critical-border text-critical-text rounded font-semibold text-2xs transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>ESCALATE</span>
          </button>

          <button
            onClick={() => dismissIncident(incident.id)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-surface hover:bg-surface-3 border border-border text-text-muted hover:text-text rounded text-2xs transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>DISMISS</span>
          </button>

          <button
            onClick={() => setShowNoteBox(!showNoteBox)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-1.5 bg-surface hover:bg-surface-3 border border-border text-text-muted hover:text-text rounded text-2xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ANNOTATE</span>
          </button>
        </div>

        {/* Note input popover */}
        {showNoteBox && (
          <form onSubmit={handleAddNote} className="mt-2 space-y-1.5 pt-2 border-t border-border">
            <textarea
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="Enter operational log note..."
              className="w-full bg-surface border border-border rounded p-1.5 text-xs text-text placeholder-text-dim focus:outline-none focus:border-info resize-none h-14"
            />
            <div className="flex justify-end gap-1.5">
              <button
                type="button"
                onClick={() => setShowNoteBox(false)}
                className="px-2 py-0.5 text-2xs text-text-dim hover:text-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-2.5 py-0.5 bg-info hover:bg-info/80 text-white text-2xs rounded font-medium"
              >
                Save Note
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
