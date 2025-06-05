
    import React from 'react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { useAuth } from '@/contexts/AuthContext';
    import { Bell, Search } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { motion } from 'framer-motion';

    const Header = () => {
      const { user } = useAuth();

      const getInitials = (name) => {
        if (!name) return 'AU'; // Aura User
        const names = name.split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase();
      };
      
      return (
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="h-16 bg-background/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search documents..." className="pl-10 w-64 bg-slate-100 dark:bg-slate-700 border-transparent focus:border-primary" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 border-2 border-primary/50">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="bg-gradient-to-br from-sky-400 to-purple-500 text-white font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <p className="text-xs text-muted-foreground">{user?.role || 'Role'}</p>
              </div>
            </div>
          </div>
        </motion.header>
      );
    };

    export default Header;
  