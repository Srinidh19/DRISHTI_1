import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { EvidenceItem } from '../types';
import { CameraFeed } from '../components/video/CameraFeed';
import {
  FileCheck2,
  Search,
  Filter,
  Download,
  Shield,
  Clock,
  User,
  CheckCircle,
  FileText,
  Lock,
  ExternalLink
} from 'lucide-react';

export const EvidenceScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { evidence, cameras, setSelectedIncidentId } = useRealtime();

  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string>(
    evidence[0]?.id || 'EVD-0142-A'
  );
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'REVIEW' | 'ARCHIVED'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  let currentSubTab: 'all' | 'events' | 'clips' | 'audit' = 'all';
  if (location.pathname.endsWith('/events')) currentSubTab = 'events';
  else if (location.pathname.endsWith('/clips')) currentSubTab = 'clips';
  else if (location.pathname.endsWith('/audit')) currentSubTab = 'audit';

  const filteredEvidence = evidence.filter(item => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
    if (currentSubTab === 'clips' && !item.hasVideoClip) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.id.toLowerCase().includes(q) ||
        item.incidentId.toLowerCase().includes(q) ||
        item.cameraId.toLowerCase().includes(q) ||
        item.classification.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const selectedItem =
    evidence.find(e => e.id === selectedEvidenceId) || evidence[0];

  const cam =
    selectedItem && cameras.find(c => c.id === selectedItem.cameraId)
      ? cameras.find(c => c.id === selectedItem.cameraId)!
      : cameras[2];

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-hidden select-none">
      {/* Top Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-4 h-4 text-text-muted" />
          <h1 className="text-sm font-bold text-text uppercase tracking-wider">
            Forensic Evidence & Chain-of-Custody Repository
          </h1>
          <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs text-text-muted">
            {filteredEvidence.length} Preserved Items
          </span>
        </div>

        {/* Subroutes Switcher */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded border border-border text-2xs">
          <Link
            to="/app/evidence"
            className={`px-3 py-1 rounded transition-colors ${
              currentSubTab === 'all'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            ALL EVIDENCE
          </Link>
          <Link
            to="/app/evidence/events"
            className={`px-3 py-1 rounded transition-colors ${
              currentSubTab === 'events'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            KEY EVENTS
          </Link>
          <Link
            to="/app/evidence/clips"
            className={`px-3 py-1 rounded transition-colors ${
              currentSubTab === 'clips'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            VIDEO CLIPS
          </Link>
          <Link
            to="/app/evidence/audit"
            className={`px-3 py-1 rounded transition-colors ${
              currentSubTab === 'audit'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            AUDIT TRAIL
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-2.5 bg-surface-2 border-b border-border flex flex-wrap items-center justify-between gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Evidence ID, Incident ID, Camera..."
            className="w-full bg-surface border border-border rounded pl-8 pr-3 py-1.5 text-xs text-text placeholder-text-dim focus:outline-none focus:border-info"
          />
        </div>

        <div className="flex items-center gap-2 text-2xs">
          <div className="flex items-center gap-1">
            <span className="text-text-dim">STATUS:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-surface border border-border rounded px-2 py-1 text-text focus:outline-none focus:border-info"
            >
              <option value="ALL">ALL STATUSES</option>
              <option value="VERIFIED">VERIFIED</option>
              <option value="REVIEW">REVIEW</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-text-dim">TYPE:</span>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-surface border border-border rounded px-2 py-1 text-text focus:outline-none focus:border-info"
            >
              <option value="ALL">ALL TYPES</option>
              <option value="FENCE_CROSSING">FENCE CROSSING</option>
              <option value="PERSON">PERSON</option>
              <option value="VEHICLE">VEHICLE</option>
              <option value="FAULT">FAULT</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Split: Table & Evidence Viewer */}
      <div className="flex-1 flex min-h-0">
        {/* Left Column: Evidence List Table */}
        <div className="flex-1 overflow-y-auto border-r border-border">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-surface sticky top-0 border-b border-border text-2xs text-text-dim uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Evidence ID</th>
                <th className="py-2.5 px-3">Incident</th>
                <th className="py-2.5 px-3">Camera Node</th>
                <th className="py-2.5 px-3">Classification</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredEvidence.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedEvidenceId(item.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-surface-3 font-semibold' : 'hover:bg-surface-2'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-text-dim whitespace-nowrap">{item.time}</td>
                    <td className="py-2.5 px-3 font-bold text-text">{item.id}</td>
                    <td className="py-2.5 px-3 text-info">{item.incidentId}</td>
                    <td className="py-2.5 px-3 text-text font-medium">{item.cameraId}</td>
                    <td className="py-2.5 px-3 text-text-muted">{item.classification}</td>
                    <td className="py-2.5 px-3 text-2xs text-text-dim uppercase">{item.type}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-2xs font-semibold ${
                          item.status === 'VERIFIED'
                            ? 'bg-success-bg text-success-text border border-success-border'
                            : 'bg-warning-bg text-warning-text border border-warning-border'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right Column: Evidence Inspector Panel */}
        {selectedItem && (
          <div className="w-96 bg-surface flex flex-col overflow-y-auto shrink-0">
            <div className="p-3 bg-surface-2 border-b border-border flex items-center justify-between">
              <span className="font-bold text-text uppercase tracking-wider">
                Evidence Inspector
              </span>
              <span className="text-2xs text-success flex items-center gap-1 font-semibold">
                <Lock className="w-3 h-3" />
                <span>SHA-256 LOCKED</span>
              </span>
            </div>

            {/* Video / Snapshot Surface */}
            <div className="p-3 border-b border-border space-y-2">
              <div className="text-2xs text-text-dim uppercase font-semibold flex justify-between">
                <span>{selectedItem.hasVideoClip ? 'SYNCHRONIZED VIDEO CLIP' : 'STILL FRAME SNAPSHOT'}</span>
                <span>{selectedItem.clipDurationSeconds ? `${selectedItem.clipDurationSeconds}s` : 'PNG'}</span>
              </div>
              <div className="h-44">
                <CameraFeed camera={cam} showControls={true} />
              </div>
            </div>

            {/* Metadata Table */}
            <div className="p-3 border-b border-border space-y-2 text-2xs">
              <div className="text-text-dim uppercase font-semibold">Forensic Metadata</div>
              <div className="space-y-1.5 text-text-muted">
                <div className="flex justify-between">
                  <span className="text-text-dim">Evidence Record:</span>
                  <span className="font-bold text-text">{selectedItem.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Related Incident:</span>
                  <button
                    onClick={() => {
                      setSelectedIncidentId(selectedItem.incidentId);
                      navigate(`/app/incidents/${selectedItem.incidentId}`);
                    }}
                    className="text-info font-bold flex items-center gap-1 hover:underline"
                  >
                    <span>{selectedItem.incidentId}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">Capture Node:</span>
                  <span className="text-text">{selectedItem.cameraName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-dim">File Size:</span>
                  <span className="text-text">
                    {(selectedItem.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
                <div className="pt-1 border-t border-border">
                  <div className="text-text-dim mb-0.5">SHA-256 Digest:</div>
                  <div className="p-1.5 bg-surface-2 rounded border border-border font-mono text-[10px] break-all text-text">
                    {selectedItem.hashDigest}
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="p-3 space-y-2 flex-1">
              <div className="text-2xs text-text-dim uppercase font-semibold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Chain of Custody Audit Trail</span>
              </div>

              <div className="space-y-2 pl-2 border-l border-border text-2xs">
                {selectedItem.auditTrail.map((log, i) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[13px] top-1 w-2 h-2 rounded-full bg-surface border border-info" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-text uppercase">[{log.action}]</span>
                      <span className="text-text-dim text-[10px]">{log.timestamp}</span>
                    </div>
                    <div className="text-text-muted text-[11px]">Actor: {log.operatorId}</div>
                    <div className="text-text-dim text-[10px]">{log.notes}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export & Actions Bar */}
            <div className="p-3 bg-surface-2 border-t border-border flex items-center gap-2">
              <button
                onClick={() => alert(`Exporting encrypted evidence package: ${selectedItem.id}.ibvap`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-surface hover:bg-surface-3 border border-border text-text rounded text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Package</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
