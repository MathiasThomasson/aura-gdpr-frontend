import React from 'react';
import { CalendarClock, FileText, ShieldCheck, Inbox } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeadlineItem } from '../types';
import { cn } from '@/lib/utils';

type DeadlinesPanelProps = {
  deadlines: DeadlineItem[];
};

const typeIconMap: Record<DeadlineItem['type'], React.ReactNode> = {
  DSR: <Inbox className="h-4 w-4" />,
  Policy: <FileText className="h-4 w-4" />,
  DPIA: <ShieldCheck className="h-4 w-4" />,
};

const statusStyles: Record<DeadlineItem['status'], string> = {
  open: 'bg-amber-50 text-amber-700 border-amber-100',
  in_progress: 'bg-sky-50 text-sky-700 border-sky-100',
  done: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const DeadlinesPanel: React.FC<DeadlinesPanelProps> = ({ deadlines }) => {
  const sorted = [...deadlines].sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Upcoming deadlines</CardTitle>
          <p className="text-sm text-slate-500">Stay ahead of DSR, DPIA, and policy commitments.</p>
        </div>
        <CalendarClock className="h-5 w-5 text-slate-400" />
      </CardHeader>
      <CardContent className="space-y-3">
        {sorted.length === 0 && (
          <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No upcoming deadlines. You are all caught up.
          </div>
        )}
        {sorted.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 text-slate-700">
                {typeIconMap[item.type]}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                    {item.type}
                  </span>
                  <span>{formatDate(item.dueDate)}</span>
                </div>
              </div>
            </div>
            <span
              className={cn(
                'rounded-full border px-3 py-1 text-xs font-semibold capitalize',
                statusStyles[item.status]
              )}
            >
              {item.status === 'in_progress' ? 'In progress' : item.status}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DeadlinesPanel;
