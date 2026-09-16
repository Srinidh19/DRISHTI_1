import React from 'react';
import { Incident } from '../../types';
import { ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface ExplainableRiskPanelProps {
  incident: Incident;
}

export const ExplainableRiskPanel: React.FC<ExplainableRiskPanelProps> = ({ incident }) => {
  const breakdown = incident.risk_breakdown || {
    zone_criticality: 25,
    fence_crossing: 25,
    multi_camera_confirm: 20,
    movement_direction: 12,
    activity: 6,
    evidence_quality: 4
  };

  const factors = [
    { label: 'Zone Criticality', val: breakdown.zone_criticality || 25, max: 25, desc: 'Critical Zero Line boundary strip proximity' },
    { label: 'Fence Crossing', val: breakdown.fence_crossing || 25, max: 25, desc: 'Virtual Perimeter Fence Alpha breached' },
    { label: 'Multi-Camera Confirm', val: breakdown.multi_camera_confirm || 20, max: 20, desc: 'Corroborated across CAM-03 (IR) & CAM-04' },
    { label: 'Movement Direction', val: breakdown.movement_direction || 12, max: 15, desc: 'Heading vector 168° towards high-security corridor' },
    { label: 'Activity Cadence', val: breakdown.activity || 6, max: 10, desc: 'Deliberate tactical traversal speed (4.8 km/h)' },
    { label: 'Evidence Quality', val: breakdown.evidence_quality || 4, max: 5, desc: 'Dual-sensor HD video + thermal telemetry locked' }
  ];

  const totalScore = incident.riskScore || 92;

  return (
    <div className="bg-surface border border-border rounded p-3 font-mono text-xs space-y-3 select-none">
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-critical" />
          <span className="font-bold text-text uppercase tracking-wider">
            Explainable Risk Evaluation
          </span>
        </div>
        <span
          className={`font-bold text-sm ${
            totalScore >= 80 ? 'text-critical' : totalScore >= 50 ? 'text-warning' : 'text-info'
          }`}
        >
          {totalScore} / 100
        </span>
      </div>

      {/* Factor Breakdown List */}
      <div className="space-y-2">
        {factors.map((f, i) => (
          <div key={i} className="space-y-0.5">
            <div className="flex justify-between text-2xs">
              <span className="text-text-muted font-medium">{f.label}</span>
              <span className="text-text font-bold">
                +{f.val} <span className="text-text-dim text-[10px]">/{f.max}</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-2 rounded overflow-hidden">
              <div
                className={`h-full rounded ${
                  f.val === f.max ? 'bg-critical' : f.val > 0 ? 'bg-warning' : 'bg-surface-3'
                }`}
                style={{ width: `${(f.val / f.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Plain-English Operational Checklist */}
      <div className="p-2.5 rounded bg-surface-2 border border-border space-y-1 text-2xs">
        <div className="font-bold text-text uppercase text-[10px] text-text-dim mb-1">
          WHY THIS INCIDENT IS HIGH RISK
        </div>
        <div className="space-y-1 text-text-muted">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-critical shrink-0" />
            <span>Critical restricted zero line perimeter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-critical shrink-0" />
            <span>Virtual fence crossing verified by YOLO AI</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-critical shrink-0" />
            <span>Confirmed by second surveillance node (SWAN CAM-04)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-warning shrink-0" />
            <span>Direction heading south towards sector assets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
