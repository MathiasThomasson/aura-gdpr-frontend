import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = {
  onRun: () => void;
  isRunning: boolean;
};

const RunAuditButton: React.FC<Props> = ({ onRun, isRunning }) => {
  return (
    <Button onClick={onRun} disabled={isRunning} className="inline-flex items-center gap-2">
      {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
      {isRunning ? 'Running audit…' : 'Run AI audit'}
    </Button>
  );
};

export default RunAuditButton;
