
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const NotFoundPage = () => {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-sky-900 to-purple-900 text-center p-4">
          <motion.div
            initial={{ opacity: 0, y: -50, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 100, duration: 0.8 }}
          >
            <AlertTriangle className="h-32 w-32 text-yellow-400 mb-8 animate-pulse" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl font-extrabold text-slate-100 mb-4"
          >
            404
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl text-slate-300 mb-8"
          >
            Oops! Page Not Found.
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-slate-400 mb-10 max-w-md"
          >
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white font-semibold py-3 px-8 text-lg">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </motion.div>
        </div>
      );
    };

    export default NotFoundPage;
  