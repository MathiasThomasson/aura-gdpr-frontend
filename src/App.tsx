import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { SystemProvider } from '@/contexts/SystemContext';
import { OnboardingProvider } from '@/contexts/OnboardingContext';
import { UserProgressProvider } from '@/contexts/UserProgressContext';
import NotificationsProvider from '@/features/notifications/NotificationsProvider';
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <SystemProvider>
            <OnboardingProvider>
              <UserProgressProvider>
                <NotificationsProvider>
                  <ErrorBoundary>
                    <AppRoutes />
                  </ErrorBoundary>
                  <Toaster />
                </NotificationsProvider>
              </UserProgressProvider>
            </OnboardingProvider>
          </SystemProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
