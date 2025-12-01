import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import DashboardPage from '@/pages/dashboard/DashboardPage';

const progressMock = {
  organizationDetails: false,
  firstDsr: false,
  policyGenerated: false,
  dpiaCreated: false,
  ropaAdded: false,
  tomConfigured: false,
  aiAuditRun: false,
};

vi.mock('@/contexts/UserProgressContext', () => ({
  useUserProgress: () => ({
    progress: progressMock,
    loading: false,
    error: null,
    refresh: vi.fn(),
    markComplete: vi.fn(),
  }),
}));

vi.mock('@/contexts/SystemContext', () => ({
  useSystemStatus: () => ({
    demoMode: false,
    isOffline: false,
    versionInfo: null,
    isVersionLoading: false,
    refreshVersion: vi.fn(),
  }),
}));

describe('DashboardPage', () => {
  it('shows main dashboard sections', () => {
    render(<DashboardPage />);

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Key metrics/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deadlines and AI insights/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Activity and risk/i)).toBeInTheDocument();
  });
});
