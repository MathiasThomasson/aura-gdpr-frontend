import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUserProgress, UserProgressState } from '@/contexts/UserProgressContext';
import { useSystemStatus } from '@/contexts/SystemContext';

type ChecklistItem = {
  key: keyof UserProgressState;
  label: string;
  description: string;
  path: string;
};

const checklist: ChecklistItem[] = [
  {
    key: 'organizationDetails',
    label: 'Add your organization details',
    description: 'Company name, contact email, and tenant basics.',
    path: '/app/settings',
  },
  {
    key: 'firstDsr',
    label: 'Create your first data subject request',
    description: 'Open your first request and track SLA deadlines.',
    path: '/app/dsr',
  },
  {
    key: 'policyGenerated',
    label: 'Generate your first policy with AI',
    description: 'Draft a baseline security or privacy policy.',
    path: '/app/policies',
  },
  {
    key: 'dpiaCreated',
    label: 'Create a DPIA',
    description: 'Assess high-risk processing activities.',
    path: '/app/dpia',
  },
  {
    key: 'ropaAdded',
    label: 'Add a record of processing (ROPA)',
    description: 'Document processing activities, systems, and purposes.',
    path: '/app/ropa',
  },
  {
    key: 'tomConfigured',
    label: 'Configure at least one TOM',
    description: 'Capture technical and organizational measures.',
    path: '/app/toms',
  },
  {
    key: 'aiAuditRun',
    label: 'Run an AI audit',
    description: 'Generate findings and recommendations automatically.',
    path: '/app/ai-audit',
  },
];

const GettingStartedChecklist: React.FC = () => {
  const { progress, markComplete, loading } = useUserProgress();
  const { demoMode } = useSystemStatus();
  const { toast } = useToast();
  const navigate = useNavigate();
  const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Please try again.');

  const handleMarkDone = async (key: keyof UserProgressState) => {
    try {
      await markComplete(key);
      toast({
        title: 'Marked as done',
        description: 'Progress updated.',
      });
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Unable to update progress',
        description: errorMessage(err),
      });
    }
  };

  return (
    <Card className="border-sky-100 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base text-slate-800">Getting started with AURA-GDPR</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {checklist.map((item) => {
          const done = progress[item.key];
          return (
            <div
              key={item.key}
              className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white/80 p-3 shadow-sm"
            >
              <div className="flex items-start gap-3">
                {done ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" aria-label="Completed" />
                ) : (
                  <Circle className="mt-0.5 h-5 w-5 text-slate-400" aria-label="Incomplete" />
                )}
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pl-8">
                <Button
                  variant={done ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  disabled={demoMode}
                >
                  Go to module
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
                {!done && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleMarkDone(item.key)}
                    disabled={loading || demoMode}
                  >
                    Mark done
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default GettingStartedChecklist;
