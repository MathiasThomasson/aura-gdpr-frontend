import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  icon?: React.ReactNode;
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction, className, icon }) => {
  return (
    <Card className={cn('border border-dashed border-slate-200 bg-slate-50', className)}>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
          {icon ?? <span className="text-lg">◎</span>}
        </div>
        <div>
          <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
          <CardDescription className="text-slate-600">{description}</CardDescription>
        </div>
      </CardHeader>
      {actionLabel ? (
        <CardContent>
          <Button size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </CardContent>
      ) : null}
    </Card>
  );
};

export default EmptyState;
