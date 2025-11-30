import React from 'react';
import { Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityItem } from '../types';
import { cn } from '@/lib/utils';

type RecentActivityPanelProps = {
  activities: ActivityItem[];
};

const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const RecentActivityPanel: React.FC<RecentActivityPanelProps> = ({ activities }) => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">Recent activity</CardTitle>
          <p className="text-sm text-slate-500">Latest actions across your workspace.</p>
        </div>
        <Clock className="h-5 w-5 text-slate-400" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className="absolute left-4 top-0 h-full w-px bg-slate-200" />
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-10">
                <div
                  className={cn(
                    'absolute left-2.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-sky-500 shadow-sm',
                    index === 0 && 'ring-2 ring-sky-200'
                  )}
                />
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{activity.action}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                        <Activity className="h-3 w-3" />
                        {activity.resourceType}
                      </span>
                      <span>{activity.resourceName}</span>
                      <span>&bull;</span>
                      <span>{activity.actor}</span>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{formatTime(activity.timestamp)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivityPanel;
