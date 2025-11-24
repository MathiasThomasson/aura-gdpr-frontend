import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import MainLayout from '@/layouts/MainLayout';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DocumentsPage from '@/pages/DocumentsPage';
import AIAssistantPage from '@/pages/AIAssistantPage';
import BillingPage from '@/pages/BillingPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import AdminPage from '@/pages/AdminPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { useAuth } from '@/contexts/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/app/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="documents" element={<DocumentsPage />} />
      <Route path="ai-assistant" element={<AIAssistantPage />} />
      <Route path="billing" element={<BillingPage />} />
      <Route path="settings" element={<AccountSettingsPage />} />
      <Route path="admin" element={<AdminPage />} />
    </Route>
    {/* keep old root-based paths too */}
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
      <Route path="admin" element={<AdminPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
