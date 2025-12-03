import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiAssistantPanel from '@/features/ai-assistant/AiAssistantPanel';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useSystemStatus } from '@/contexts/SystemContext';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);
  const { demoMode, isOffline, versionInfo, isTestTenant, tenantPlan } = useSystemStatus();

  const versionLabel =
    versionInfo?.version && versionInfo.version.length > 0
      ? `AURA-GDPR v${versionInfo.version}${versionInfo.build ? ` (build ${versionInfo.build})` : ''}`
      : 'AURA-GDPR';

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="relative flex min-h-screen flex-1 flex-col">
        <div className="sticky top-0 z-30">
          {demoMode && (
            <div className="flex items-center justify-center border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-800">
              Demo mode — all data is simulated and read-only.
            </div>
          )}
          {isOffline && (
            <div className="flex items-center justify-center border-b border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
              You are offline. Changes may not be saved until connectivity returns.
            </div>
          )}
          {isTestTenant && (
            <div className="flex items-center justify-center border-b border-indigo-200 bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700">
              Test mode: All AI features are enabled for this tenant.
            </div>
          )}
          <Topbar onMenuClick={() => setIsSidebarOpen(true)} onAskAura={() => setIsAssistantOpen(true)} />
        </div>
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white/80">
          <div className="mx-auto max-w-6xl px-6 py-3 text-sm text-slate-600">{versionLabel}</div>
        </footer>
        <Button
          className="fixed bottom-6 right-6 z-40 shadow-lg"
          size="lg"
          onClick={() => setIsAssistantOpen(true)}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Ask AURA
        </Button>
        <AiAssistantPanel isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
      </div>
    </div>
  );
};

export default AppLayout;
