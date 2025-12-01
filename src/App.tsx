import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { NotificationsProvider } from '@/features/notifications/hooks/useNotifications';
import AppRoutes from '@/routes';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <NotificationsProvider>
            <AppRoutes />
            <Toaster />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
