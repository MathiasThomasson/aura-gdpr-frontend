import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import DataSubjectRequestsPage from '@/pages/DataSubjectRequestsPage';

const progressMock = {
  organizationDetails: false,
  firstDsr: false,
  policyGenerated: false,
  dpiaCreated: false,
  ropaAdded: false,
  tomConfigured: false,
  aiAuditRun: false,
};

vi.mock('@/contexts/SystemContext', () => ({
  useSystemStatus: () => ({
    demoMode: false,
    isOffline: false,
    versionInfo: null,
    isVersionLoading: false,
    refreshVersion: vi.fn(),
  }),
}));

vi.mock('@/contexts/UserProgressContext', () => ({
  useUserProgress: () => ({
    progress: progressMock,
    loading: false,
    error: null,
    refresh: vi.fn(),
    markComplete: vi.fn(),
  }),
}));

const mockHookResponse = {
  data: [
    {
      id: 'dsr-1',
      type: 'access',
      data_subject: 'Jane Doe',
      email: 'jane@example.com',
      status: 'received',
      received_at: '2025-01-01T00:00:00Z',
      due_at: '2025-01-10T00:00:00Z',
      identifier: 'DSR-1',
    },
  ],
  loading: false,
  detailLoading: false,
  error: null,
  reload: vi.fn(),
  create: vi.fn(),
  updateStatus: vi.fn(),
  fetchDetail: vi.fn(),
};

vi.mock('@/features/dsr/hooks/useDataSubjectRequests', () => ({
  __esModule: true,
  default: () => mockHookResponse,
}));

describe('DataSubjectRequestsPage', () => {
  it('renders table headings and action button', () => {
    render(
      <MemoryRouter>
        <DataSubjectRequestsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /New request/i })).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Data subject/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByText(/Received/i)).toBeInTheDocument();
    expect(screen.getByText(/Due date/i)).toBeInTheDocument();
    expect(screen.getByText(/Identifier/i)).toBeInTheDocument();
  });
});
