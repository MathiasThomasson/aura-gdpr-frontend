import React from 'react';
import { Activity, AlertTriangle, FileText, Inbox, ShieldCheck, ShieldHalf, ShieldPlus } from 'lucide-react';
import KpiCard from './KpiCard';
import { DashboardSummary } from '../types';

type KpiGridProps = {
  summary: DashboardSummary;
};

const riskLabel: Record<DashboardSummary['overallRiskLevel'], string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const KpiGrid: React.FC<KpiGridProps> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <KpiCard
        label="Compliance Score"
        value={`${summary.complianceScore}%`}
        icon={<ShieldCheck className="h-5 w-5" />}
        accent="blue"
        progress={summary.complianceScore}
      />
      <KpiCard
        label="Open Data Subject Requests"
        value={summary.openDsrs}
        icon={<Inbox className="h-5 w-5" />}
        hint="Within SLA"
        accent="emerald"
      />
      <KpiCard
        label="Policies Expiring Soon"
        value={summary.policiesExpiringSoon}
        icon={<FileText className="h-5 w-5" />}
        hint="Next 30 days"
        accent="amber"
      />
      <KpiCard
        label="Ongoing DPIAs"
        value={summary.ongoingDpiaCount}
        icon={<ShieldPlus className="h-5 w-5" />}
        hint="Includes AI projects"
        accent="slate"
      />
      <KpiCard
        label="Active Incidents"
        value={summary.activeIncidents}
        icon={<AlertTriangle className="h-5 w-5" />}
        hint="Across all systems"
        accent="red"
      />
      <KpiCard
        label="Overall Risk Level"
        value={riskLabel[summary.overallRiskLevel]}
        icon={<ShieldHalf className="h-5 w-5" />}
        hint="Last updated 24h"
        accent="blue"
      />
    </div>
  );
};

export default KpiGrid;
