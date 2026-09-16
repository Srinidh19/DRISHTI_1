import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { SeverityBadge } from '../components/status/SeverityBadge';
import { CameraFeed } from '../components/video/CameraFeed';
import { CommandMap } from '../components/map/CommandMap';
import { ExplainableRiskPanel } from '../components/incidents/ExplainableRiskPanel';
import {
  ArrowLeft,
  CheckCircle,
  AlertOctagon,
  XCircle,
  UserCheck,
  FileEdit,
  Clock,
  Shield,
  Layers,
  FileCheck,
  Download,
  Share2
} from 'lucide-react';

export const IncidentWorkspace: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const navigate = useNavigate();
  const {
    incidents,
    cameras,
    evidence,
    currentUser,
    confirmIncident,
    dismissIncident,
    escalateIncident,
    assignIncident,
    annotateIncident
  } = useRealtime();

  const [activeCamTab, setActiveCamTab] = useState<string>('');
  const [noteInput, setNoteInput] = useState<string>('');
  const [assigneeInput, setAssigneeInput] = useState<string>('OP-042');

  const incident = incidents.find(i => i.id === incidentId) || incidents[0];

  if (!incident) {
    return (
      <div className="p-6 font-mono text-center text-text-muted">
        <p>INCIDENT NOT FOUND</p>
        <button
          onClick={() => navigate('/app/incidents')}
          className="mt-3 px-3 py-1 bg-surface border border-border text-xs text-text rounded"
        >
          Return to Incident Queue
        </button>
      </div>
    );
  }

  const primaryCam = cameras.find(c => c.id === incident.primaryCamera) || cameras[2];
  const secondaryCams = cameras.filter(
    c => incident.cameras.includes(c.id) && c.id !== incident.primaryCamera
  );

  const currentDisplayCam =
    activeCamTab && cameras.find(c => c.id === activeCamTab)
      ? cameras.find(c => c.id === activeCamTab)!
      : primaryCam;

  const incidentEvidence = evidence.filter(
    e => e.incidentId === incident.id || incident.evidenceIds.includes(e.id)
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    annotateIncident(incident.id, noteInput);
    setNoteInput('');
  };

  const handleAssign = () => {
    assignIncident(incident.id, assigneeInput);
  };

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-y-auto">
      {/* Top Breadcrumb & Metadata Header */}
      <div className="bg-surface border-b border-border p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            to="/app/incidents"
            className="p-1.5 bg-surface-2 hover:bg-surface-3 border border-border rounded text-text-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-text">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs uppercase tracking-wider text-info font-bold">
                {incident.status}
              </span>
              {incident.unifiedFault && (
                <span className="px-2 py-0.5 rounded bg-warning-bg border border-warning-border text-warning-text text-2xs font-semibold">
                  SHIELD FAULT CORRELATED
                </span>
              )}
            </div>
            <h1 className="text-base font-bold text-text mt-0.5">{incident.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 text-2xs text-text-muted">
          <div>
            <span className="text-text-dim">LOCATION: </span>
            <span className="text-text font-semibold">{incident.location} ({incident.bop})</span>
          </div>
          <div>
            <span className="text-text-dim">CAMERAS: </span>
            <span className="text-text font-semibold">{incident.cameras.join(' → ')}</span>
          </div>
          <div>
            <span className="text-text-dim">TIME: </span>
            <span className="text-text font-semibold">{incident.timestamp}</span>
          </div>
        </div>
      </div>

      {/* 3-Card Core Layout: Video | Map | Risk Analysis */}
      <div className="p-3 grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Card 1: Incident Video & Multi-Camera Switcher */}
        <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
          <div className="p-2 bg-surface-2 border-b border-border flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
              <span>Incident Video Feeds</span>
            </span>
            <div className="flex items-center gap-1">
              {incident.cameras.map(camId => (
                <button
                  key={camId}
                  onClick={() => setActiveCamTab(camId)}
                  className={`px-2 py-0.5 rounded text-2xs font-mono transition-colors ${
                    currentDisplayCam.id === camId
                      ? 'bg-info text-white font-bold'
                      : 'bg-surface border border-border text-text-muted hover:text-text'
                  }`}
                >
                  {camId}
                </button>
              ))}
            </div>
          </div>
          <div className="p-2 flex-1 flex flex-col justify-center">
            <CameraFeed camera={currentDisplayCam} showControls={true} />
            <div className="mt-2 text-2xs text-text-dim flex items-center justify-between">
              <span>Viewing: {currentDisplayCam.id} ({currentDisplayCam.location})</span>
              <span>Type: {currentDisplayCam.type}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Incident Map with Sector Corridor */}
        <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
          <div className="p-2 bg-surface-2 border-b border-border flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-text">
              Incident Vector Map ({incident.cameras.join(' → ')})
            </span>
            <span className="text-2xs text-text-dim">Live Coordinates</span>
          </div>
          <div className="flex-1 min-h-[220px] relative">
            <CommandMap />
          </div>
        </div>

        {/* Card 3: Explainable Risk Analysis Matrix */}
        <div className="flex flex-col">
          <ExplainableRiskPanel incident={incident} />
        </div>
      </div>

      {/* Middle Grid: Event Timeline & Chain-of-Custody Evidence */}
      <div className="px-3 pb-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* EVENT TIMELINE */}
        <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
          <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-info" />
              <span>Event Timeline</span>
            </span>
            <span className="text-2xs text-text-dim">{incident.timeline.length} events logged</span>
          </div>
          <div className="p-3 space-y-3 max-h-64 overflow-y-auto pl-4">
            <div className="relative border-l-2 border-border pl-4 space-y-3">
              {incident.timeline.map((evt, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-surface border-2 border-info" />
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-text">{evt.title}</span>
                    <span className="text-2xs text-text-dim">{evt.time}</span>
                  </div>
                  {evt.description && (
                    <div className="text-2xs text-text-muted mt-0.5">{evt.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* EVIDENCE REPOSITORY */}
        <div className="bg-surface border border-border rounded flex flex-col overflow-hidden">
          <div className="p-2.5 bg-surface-2 border-b border-border flex items-center justify-between">
            <span className="font-bold uppercase tracking-wider text-text flex items-center gap-2">
              <FileCheck className="w-3.5 h-3.5 text-success" />
              <span>Preserved Evidence ({incidentEvidence.length})</span>
            </span>
            <button
              onClick={() => navigate('/app/evidence')}
              className="text-2xs text-info hover:text-white"
            >
              Browse Evidence Bank →
            </button>
          </div>
          <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
            {incidentEvidence.length === 0 ? (
              <div className="text-center text-text-dim p-4">No evidence recorded yet</div>
            ) : (
              incidentEvidence.map(ev => (
                <div
                  key={ev.id}
                  className="p-2 rounded bg-surface-2 border border-border flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-text">{ev.id}</span>
                      <span className="px-1 py-0.2 rounded bg-success-bg text-success-text text-2xs border border-success-border font-medium">
                        {ev.status}
                      </span>
                      <span className="text-text-dim text-2xs">{ev.time}</span>
                    </div>
                    <div className="text-2xs text-text-muted">
                      {ev.cameraName} • {ev.classification}
                    </div>
                    <div className="text-[10px] text-text-dim font-mono truncate max-w-xs">
                      SHA-256: {ev.hashDigest.slice(0, 24)}...
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate('/app/evidence')}
                      className="px-2 py-1 bg-surface hover:bg-surface-3 border border-border rounded text-2xs text-text"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Operator Adjudication Actions & Notes Bar */}
      <div className="mx-3 mb-3 p-3 bg-surface border border-border rounded space-y-3">
        <div className="flex items-center justify-between border-b border-border pb-2">
          <span className="font-bold uppercase tracking-wider text-text flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-info" />
            <span>Operator Adjudication & Triage Console</span>
          </span>
          <span className="text-2xs text-text-dim">Current Operator: {currentUser.id} ({currentUser.role})</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => confirmIncident(incident.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-success-bg hover:bg-success-border border border-success-border text-success-text rounded font-semibold text-xs transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>CONFIRM INTRUSION</span>
          </button>

          <button
            onClick={() => escalateIncident(incident.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-critical-bg hover:bg-critical-border border border-critical-border text-critical-text rounded font-semibold text-xs transition-colors"
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>ESCALATE TO QRT COMMAND</span>
          </button>

          <button
            onClick={() => dismissIncident(incident.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-surface hover:bg-surface-2 border border-border text-text-muted hover:text-text rounded text-xs transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>DISMISS FALSE POSITIVE</span>
          </button>

          <div className="flex items-center gap-1.5 ml-auto">
            <input
              type="text"
              value={assigneeInput}
              onChange={e => setAssigneeInput(e.target.value)}
              placeholder="Assignee badge"
              className="bg-surface-2 border border-border rounded px-2 py-1 text-xs w-28 text-text"
            />
            <button
              onClick={handleAssign}
              className="px-2.5 py-1 bg-surface-2 hover:bg-surface-3 border border-border text-text rounded text-xs"
            >
              Assign
            </button>
          </div>
        </div>

        {/* Notes & Annotations List */}
        <div className="pt-2 border-t border-border space-y-2">
          <div className="text-2xs font-semibold text-text-dim uppercase tracking-wider">
            Operational Annotations
          </div>
          {incident.notes.map(note => (
            <div key={note.id} className="p-2 rounded bg-surface-2 border border-border text-2xs space-y-0.5">
              <div className="flex items-center justify-between text-text-dim">
                <span className="font-semibold text-text">{note.author}</span>
                <span>{note.timestamp}</span>
              </div>
              <p className="text-text">{note.text}</p>
            </div>
          ))}

          <form onSubmit={handleAddNote} className="flex gap-2 mt-2">
            <input
              type="text"
              value={noteInput}
              onChange={e => setNoteInput(e.target.value)}
              placeholder="Type tactical SITREP annotation..."
              className="flex-1 bg-surface-2 border border-border rounded px-2.5 py-1.5 text-xs text-text placeholder-text-dim focus:outline-none focus:border-info"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-info hover:bg-info/80 text-white rounded text-xs font-semibold"
            >
              Add Note
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
