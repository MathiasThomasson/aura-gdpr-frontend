
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import MainLayout from '@/layouts/MainLayout';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import DashboardPage from '@/pages/DashboardPage';
    import DocumentsPage from '@/pages/DocumentsPage';
    import AIAssistantPage from '@/pages/AIAssistantPage';
    import BillingPage from '@/pages/BillingPage';
    import AccountSettingsPage from '@/pages/AccountSettingsPage';
    import AdminPage from '@/pages/AdminPage';
    import NotFoundPage from '@/pages/NotFoundPage';

    function ProtectedRoute({ children }) {
      const { isAuthenticated } = useAuth();
      if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
      }
      return children;
    }
    
    function AppContent() {
      const { theme } = useTheme();
      React.useEffect(() => {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(theme);
      }, [theme]);

      return (
        <>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="ai-assistant" element={<AIAssistantPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="settings" element={<AccountSettingsPage />} />
              <Route path="admin" element={<AdminPage />} /> {/* Basic Admin route */}
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
          <Toaster />
        </>
      );
    }

    function App() {
      return (
        <Router>
          <ThemeProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </ThemeProvider>
        </Router>
      );
    }

    export default App;
  