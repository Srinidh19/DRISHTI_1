import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useRealtime } from '../context/RealtimeContext';
import { SeverityBadge } from '../components/status/SeverityBadge';
import { AlertTriangle, Filter, Search, ArrowRight, CheckCircle, Shield } from 'lucide-react';
import { IncidentSeverity } from '../types';

export const IncidentsList: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { incidents, setSelectedIncidentId } = useRealtime();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | IncidentSeverity>('ALL');

  // Determine active tab based on subroute
  let activeTab: 'all' | 'active' | 'assigned' | 'resolved' = 'active';
  if (location.pathname.endsWith('/active')) activeTab = 'active';
  else if (location.pathname.endsWith('/assigned')) activeTab = 'assigned';
  else if (location.pathname.endsWith('/resolved')) activeTab = 'resolved';

  const filteredIncidents = incidents.filter(inc => {
    // Tab filter
    if (activeTab === 'active' && (inc.status === 'RESOLVED' || inc.status === 'DISMISSED')) {
      return false;
    }
    if (activeTab === 'assigned' && inc.status !== 'ASSIGNED') {
      return false;
    }
    if (activeTab === 'resolved' && inc.status !== 'RESOLVED' && inc.status !== 'DISMISSED') {
      return false;
    }

    // Severity filter
    if (severityFilter !== 'ALL' && inc.severity !== severityFilter) {
      return false;
    }

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        inc.id.toLowerCase().includes(q) ||
        inc.title.toLowerCase().includes(q) ||
        inc.location.toLowerCase().includes(q) ||
        inc.cameras.some(c => c.toLowerCase().includes(q))
      );
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-bg font-mono text-xs overflow-hidden">
      {/* Header */}
      <div className="p-3 bg-surface border-b border-border flex flex-wrap items-center justify-between gap-3 select-none">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-critical" />
          <h1 className="text-sm font-bold text-text uppercase tracking-wider">
            Incident Command Registry
          </h1>
          <span className="px-2 py-0.5 rounded bg-surface-2 border border-border text-2xs text-text-muted">
            {filteredIncidents.length} Records
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded border border-border text-2xs">
          <Link
            to="/app/incidents/active"
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'active'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            ACTIVE ({incidents.filter(i => i.status !== 'RESOLVED' && i.status !== 'DISMISSED').length})
          </Link>
          <Link
            to="/app/incidents/assigned"
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'assigned'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            ASSIGNED ({incidents.filter(i => i.status === 'ASSIGNED').length})
          </Link>
          <Link
            to="/app/incidents/resolved"
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === 'resolved'
                ? 'bg-surface-3 text-white font-semibold'
                : 'text-text-muted hover:text-text'
            }`}
          >
            RESOLVED ({incidents.filter(i => i.status === 'RESOLVED' || i.status === 'DISMISSED').length})
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-2.5 bg-surface-2 border-b border-border flex flex-wrap items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-text-muted" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by ID, camera, location, zone..."
              className="w-full bg-surface border border-border rounded pl-8 pr-3 py-1.5 text-xs text-text placeholder-text-dim focus:outline-none focus:border-info"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-2xs">
          <span className="text-text-dim uppercase">Severity:</span>
          {(['ALL', 'CRITICAL', 'HIGH', 'LOW', 'INFORMATIONAL'] as const).map(sev => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2 py-1 rounded border transition-colors ${
                severityFilter === sev
                  ? 'bg-surface-3 border-info text-white font-bold'
                  : 'bg-surface border-border text-text-muted hover:text-text'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Dense Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left font-mono">
          <thead className="bg-surface sticky top-0 border-b border-border text-2xs text-text-dim uppercase tracking-wider select-none">
            <tr>
              <th className="py-2.5 px-3">Severity</th>
              <th className="py-2.5 px-3">Incident ID</th>
              <th className="py-2.5 px-3">Title / Classification</th>
              <th className="py-2.5 px-3">Target & Vector</th>
              <th className="py-2.5 px-3">Sector / Location</th>
              <th className="py-2.5 px-3">Camera Node(s)</th>
              <th className="py-2.5 px-3">Risk</th>
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredIncidents.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-6 text-center text-text-muted">
                  NO INCIDENTS MATCHING FILTER CRITERIA
                </td>
              </tr>
            ) : (
              filteredIncidents.map(inc => (
                <tr
                  key={inc.id}
                  onClick={() => {
                    setSelectedIncidentId(inc.id);
                    navigate(`/app/incidents/${inc.id}`);
                  }}
                  className="hover:bg-surface-2/60 cursor-pointer transition-colors"
                >
                  <td className="py-2.5 px-3">
                    <SeverityBadge severity={inc.severity} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 font-bold text-text">{inc.id}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-semibold text-text">{inc.title}</div>
                    {inc.unifiedFault && (
                      <span className="text-[10px] text-warning font-semibold">
                        • Correlated Camera Tamper Fault
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-text-muted">
                    <span>
                      {inc.objectCount} {inc.objectType}
                    </span>
                    {inc.direction && (
                      <div className="text-[10px] text-text-dim">{inc.direction}</div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-text-muted">
                    <div>{inc.location}</div>
                    <div className="text-[10px] text-text-dim">{inc.bop}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-text font-medium">{inc.cameras.join(' → ')}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`font-bold ${
                        inc.riskScore >= 80
                          ? 'text-critical'
                          : inc.riskScore >= 50
                          ? 'text-warning'
                          : 'text-info'
                      }`}
                    >
                      {inc.riskScore}
                    </span>
                    <span className="text-text-dim text-[10px]">/100</span>
                  </td>
                  <td className="py-2.5 px-3 text-text-dim whitespace-nowrap">{inc.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-surface border border-border text-2xs uppercase font-semibold text-text-muted">
                      {inc.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedIncidentId(inc.id);
                        navigate(`/app/incidents/${inc.id}`);
                      }}
                      className="px-2 py-1 bg-surface hover:bg-surface-3 border border-border rounded text-2xs text-info hover:text-white inline-flex items-center gap-1"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
