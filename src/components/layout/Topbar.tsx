import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Topbar: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background/80 dark:bg-slate-800/80 border-b border-border">
      <div className="text-lg font-semibold text-foreground">AURA-GDPR</div>
      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground">Demo User</div>
        <Avatar className="w-8 h-8 border-2 border-primary/20">
          <AvatarFallback>DU</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default Topbar;
