import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AiAssistantPanel from '@/features/ai-assistant/AiAssistantPanel';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="relative flex min-h-screen flex-1 flex-col">
        <Topbar onMenuClick={() => setIsSidebarOpen(true)} onAskAura={() => setIsAssistantOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
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
