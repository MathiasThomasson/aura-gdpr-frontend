import React from 'react';
import { AlertTriangle, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RiskOverview, RiskLevel } from '../types';
import { cn } from '@/lib/utils';

type RiskOverviewPanelProps = {
  risk: RiskOverview;
};

const levelStyles: Record<RiskLevel, { label: string; bg: string; icon: React.ReactNode }> = {
  low: { label: 'Low', bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <ShieldCheck className="h-4 w-4" /> },
  medium: { label: 'Medium', bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: <Shield className="h-4 w-4" /> },
  high: { label: 'High', bg: 'bg-rose-50 text-rose-700 border-rose-100', icon: <AlertTriangle className="h-4 w-4" /> },
};

const RiskOverviewPanel: React.FC<RiskOverviewPanelProps> = ({ risk }) => {
  const level = levelStyles[risk.overallRiskLevel];

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Risk & incidents</CardTitle>
          <p className="text-sm text-slate-500">High-level posture across systems.</p>
        </div>
        <ShieldAlert className="h-5 w-5 text-rose-500" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
          <span className={cn('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold', level.bg)}>
            {level.icon}
            {level.label} risk
          </span>
          <p className="text-sm text-slate-600">Overall assessment updated daily.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">High-risk systems</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{risk.highRiskSystems.length}</p>
            <p className="mt-1 text-sm text-slate-600">Key systems: {risk.highRiskSystems.join(', ')}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Open incidents</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{risk.openIncidents}</p>
            <p className="mt-1 text-sm text-slate-600">Tracked across vendors and assets.</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm sm:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Processing activities needing DPIA</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{risk.dpiaRequiredCount}</p>
            <p className="mt-1 text-sm text-slate-600">
              Prioritize assessments for AI-related automations and marketing data flows.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskOverviewPanel;
