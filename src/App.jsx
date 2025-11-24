
    import React from 'react';
    import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
    import { Toaster } from '@/components/ui/toaster';
    import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
    import { AuthProvider, useAuth } from '@/contexts/AuthContext';
    import AppRoutes from '@/routes';

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
          <AppRoutes />
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
  