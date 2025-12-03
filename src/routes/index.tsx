import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import LogsPage from '@/pages/LogsPage';
import RiskMatrixPage from '@/pages/RiskMatrixPage';
import DpiaPage from '@/pages/DpiaPage';
import DSRPage from '@/pages/dsr/DSRPage';
import DsrPortalPage from '@/pages/DsrPortalPage';
import NotificationsPage from '@/features/notifications/NotificationsPage';
import AiAuditPage from '@/features/ai-audit/AiAuditPage';
import AiAuditV2Page from '@/features/ai-audit/AiAuditV2Page';
import AdminDsrPortalSettingsPage from '@/pages/AdminDsrPortalSettingsPage';
import NotificationSettingsPage from '@/pages/NotificationSettingsPage';
import PoliciesPage from '@/pages/PoliciesPage';
import IncidentsPage from '@/pages/IncidentsPage';
import TemplatesPage from '@/pages/TemplatesPage';
import RopaPage from '@/pages/RopaPage';
import TomsPage from '@/pages/TomsPage';
import CookiesPage from '@/pages/CookiesPage';
import IamPage from '@/pages/IamPage';
import WorkspaceUsersPage from '@/pages/admin/WorkspaceUsersPage';
import PlatformAdminPage from '@/pages/admin/PlatformAdminPage';
import NotFoundPage from '@/pages/NotFoundPage';
import ErrorPage from '@/pages/ErrorPage';
import SecurityHealthPage from '@/pages/SecurityHealthPage';
import { useAuth } from '@/contexts/AuthContext';
import LandingPage from '@/features/marketing/LandingPage';
import { useOnboarding } from '@/contexts/OnboardingContext';
import OnboardingPage from '@/features/onboarding/OnboardingPage';
import PublicDsrFormPage from '@/pages/public/PublicDsrFormPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const OnboardingGuard = ({ children }: { children: React.ReactNode }) => {
  const { state, loading } = useOnboarding();
  const location = useLocation();

  if (loading) {
    return <div className="p-6 text-sm text-slate-600">Loading workspace...</div>;
  }

  if (!state.completed && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (state.completed && location.pathname === '/onboarding') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/demo" element={<Navigate to="/app/dashboard?demo=1" replace />} />
    <Route path="/dsr-portal" element={<DsrPortalPage />} />
    <Route path="/public/dsr/:publicKey" element={<PublicDsrFormPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/onboarding"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <OnboardingPage />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    />
    <Route
      path="/app"
      element={
        <ProtectedRoute>
          <OnboardingGuard>
            <AppLayout />
          </OnboardingGuard>
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="/app/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="documents" element={<DocumentsPage />} />
      <Route path="ai-assistant" element={<AIAssistantPage />} />
      <Route path="ai-audit" element={<AiAuditPage />} />
      <Route path="ai/audit-v2" element={<AiAuditV2Page />} />
      <Route path="tasks" element={<TasksPage />} />
      <Route path="projects" element={<ProjectsPage />} />
      <Route path="audit" element={<AuditPage />} />
      <Route path="logs" element={<LogsPage />} />
      <Route path="risk-matrix" element={<RiskMatrixPage />} />
      <Route path="dsr" element={<DSRPage />} />
      <Route path="dpia" element={<DpiaPage />} />
      <Route path="ropa" element={<RopaPage />} />
      <Route path="templates" element={<TemplatesPage />} />
      <Route path="cookies" element={<CookiesPage />} />
      <Route path="policies" element={<PoliciesPage />} />
      <Route path="incidents" element={<IncidentsPage />} />
      <Route path="toms" element={<TomsPage />} />
      <Route path="security-health" element={<SecurityHealthPage />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="billing" element={<BillingPage />} />
      <Route path="iam" element={<IamPage />} />
      <Route path="settings" element={<AccountSettingsPage />} />
      <Route path="settings/notifications" element={<NotificationSettingsPage />} />
      <Route path="admin" element={<AdminPage />} />
      <Route path="admin/workspace/users" element={<WorkspaceUsersPage />} />
      <Route path="platform-admin" element={<PlatformAdminPage />} />
      <Route path="admin/dsr-portal" element={<AdminDsrPortalSettingsPage />} />
    </Route>
    <Route path="/error" element={<ErrorPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
