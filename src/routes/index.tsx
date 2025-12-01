import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AppLayout from '@/components/layout/AppLayout';
import DashboardPage from '@/pages/dashboard/DashboardPage';
import DocumentsPage from '@/pages/DocumentsPage';
import AIAssistantPage from '@/pages/AIAssistantPage';
import BillingPage from '@/pages/BillingPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import AdminPage from '@/pages/AdminPage';
import TasksPage from '@/pages/TasksPage';
import ProjectsPage from '@/pages/ProjectsPage';
import AuditPage from '@/pages/AuditPage';
import RiskMatrixPage from '@/pages/RiskMatrixPage';
import DpiaPage from '@/pages/DpiaPage';
import DataSubjectRequestsPage from '@/pages/DataSubjectRequestsPage';
import DsrPortalPage from '@/pages/DsrPortalPage';
import NotificationsPage from '@/features/notifications/NotificationsPage';
import AiAuditPage from '@/features/ai-audit/AiAuditPage';
import AdminDsrPortalSettingsPage from '@/pages/AdminDsrPortalSettingsPage';
import NotificationSettingsPage from '@/pages/NotificationSettingsPage';
import PoliciesPage from '@/pages/PoliciesPage';
import IncidentsPage from '@/pages/IncidentsPage';
import RopaPage from '@/pages/RopaPage';
import TomsPage from '@/pages/TomsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import { useAuth } from '@/contexts/AuthContext';
import PublicDataSubjectRequestPage from '@/features/public-dsr/PublicDataSubjectRequestPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
    <Route path="/dsr-portal" element={<DsrPortalPage />} />
    <Route path="/public/dsr/:tenantSlug" element={<PublicDataSubjectRequestPage />} />
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
      <Route path="ai-audit" element={<AiAuditPage />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="audit" element={<AuditPage />} />
      <Route path="risk-matrix" element={<RiskMatrixPage />} />
      <Route path="dsr" element={<DataSubjectRequestsPage />} />
      <Route path="dpia" element={<DpiaPage />} />
      <Route path="ropa" element={<RopaPage />} />
      <Route path="policies" element={<PoliciesPage />} />
      <Route path="incidents" element={<IncidentsPage />} />
      <Route path="toms" element={<TomsPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="billing" element={<BillingPage />} />
      <Route path="settings" element={<AccountSettingsPage />} />
      <Route path="settings/notifications" element={<NotificationSettingsPage />} />
      <Route path="admin" element={<AdminPage />} />
      <Route path="admin/dsr-portal" element={<AdminDsrPortalSettingsPage />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
