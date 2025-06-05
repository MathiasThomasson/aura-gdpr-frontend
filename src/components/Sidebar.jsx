
    import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { Home, FileText, Zap, CreditCard, Settings, ShieldCheck, LogOut, Sun, Moon } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { useTheme } from '@/contexts/ThemeContext';
    import { useAuth } from '@/contexts/AuthContext';
    import { motion } from 'framer-motion';

    const navItems = [
      { name: 'Dashboard', icon: Home, path: '/dashboard' },
      { name: 'Documents', icon: FileText, path: '/documents' },
      { name: 'AI Assistant', icon: Zap, path: '/ai-assistant', pro: true },
      { name: 'Billing', icon: CreditCard, path: '/billing' },
      { name: 'Settings', icon: Settings, path: '/settings' },
    ];

    const adminNavItems = [
       { name: 'Admin Panel', icon: ShieldCheck, path: '/admin' },
    ];

    const Sidebar = () => {
      const { theme, toggleTheme } = useTheme();
      const { logout, user } = useAuth();
      const userRole = user?.role;

      const getFilteredNavItems = () => {
        let items = navItems;
        if (userRole === 'Admin') {
          items = [...items, ...adminNavItems];
        }
        return items;
      }

      return (
        <motion.div 
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          className="w-64 bg-gradient-to-b from-primary to-sky-700 dark:from-slate-800 dark:to-slate-950 text-primary-foreground p-6 flex flex-col justify-between shadow-2xl"
        >
          <div>
            <div className="mb-10 text-center">
              <NavLink to="/dashboard">
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">AURA GDPR</h1>
              </NavLink>
            </div>
            <nav>
              <ul>
                {getFilteredNavItems().map((item, index) => (
                  <motion.li 
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="mb-3"
                  >
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `flex items-center p-3 rounded-lg transition-all duration-200 ease-in-out group hover:bg-sky-500 dark:hover:bg-slate-700 ${
                          isActive ? 'bg-sky-600 dark:bg-slate-700 shadow-md' : 'hover:translate-x-1'
                        }`
                      }
                    >
                      <item.icon className="w-5 h-5 mr-3 text-sky-200 dark:text-sky-300 group-hover:text-white" />
                      <span className="text-sm font-medium">{item.name}</span>
                      {item.pro && userRole !== 'Pro' && userRole !== 'Admin' && (
                        <span className="ml-auto text-xs bg-yellow-400 text-yellow-800 px-2 py-0.5 rounded-full">Pro</span>
                      )}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="mt-auto">
             <Button
              variant="ghost"
              size="lg"
              className="w-full justify-start text-primary-foreground hover:bg-sky-500 dark:hover:bg-slate-700 mb-3"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Moon className="w-5 h-5 mr-3" /> : <Sun className="w-5 h-5 mr-3" />}
              Toggle Theme
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="w-full justify-start text-red-300 hover:bg-red-500 hover:text-white dark:hover:bg-red-700"
              onClick={logout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </motion.div>
      );
    };

    export default Sidebar;
  