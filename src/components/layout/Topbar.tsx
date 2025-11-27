import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const getInitials = (name?: string) => {
  if (!name) return 'AU';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0].toUpperCase()}${parts[parts.length - 1][0].toUpperCase()}`;
};

const Topbar: React.FC = () => {
  const { user } = useAuth() as { user?: { name?: string; avatarUrl?: string; role?: string } };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-background/80 dark:bg-slate-800/80 border-b border-border">
      <div>
        <p className="text-xs text-muted-foreground">Current tenant</p>
        <div className="text-lg font-semibold text-foreground">AURA-GDPR</div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-sm font-medium text-foreground">{user?.name ?? 'User'}</div>
          <div className="text-xs text-muted-foreground">{user?.role ?? 'Member'}</div>
        </div>
        <Avatar className="w-9 h-9 border-2 border-primary/30">
          <AvatarImage src={user?.avatarUrl} alt={user?.name} />
          <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
        </Avatar>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

export default Topbar;
