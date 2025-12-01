import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-white px-4 text-center">
      <div className="max-w-md space-y-6 rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-600">
          <AlertOctagon className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1>
          <p className="text-sm text-slate-600">
            An error occurred while loading this page. Try refreshing, or contact support if the issue persists.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => window.location.reload()} className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh page
          </Button>
          <Button variant="outline" onClick={() => navigate('/app/dashboard')}>
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
