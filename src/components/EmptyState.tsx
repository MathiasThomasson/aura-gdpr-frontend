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
};

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction, className }) => {
  return (
    <Card className={cn('border-dashed border-slate-200 bg-slate-50', className)}>
      <CardHeader>
        <CardTitle className="text-lg text-slate-900">{title}</CardTitle>
        <CardDescription className="text-slate-600">{description}</CardDescription>
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
