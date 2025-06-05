
    import React from 'react';
    import { Outlet, useLocation } from 'react-router-dom';
    import Sidebar from '@/components/Sidebar';
    import Header from '@/components/Header';
    import { motion } from 'framer-motion';

    const MainLayout = () => {
      const location = useLocation();
      return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-950">
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-900 p-6">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Outlet />
              </motion.div>
            </main>
          </div>
        </div>
      );
    };

    export default MainLayout;
  