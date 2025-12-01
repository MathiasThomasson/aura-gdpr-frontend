import React from 'react';
import PageInfoBox from '@/components/PageInfoBox';
import PolicyFiltersBar from './components/PolicyFiltersBar';
import PolicyTable from './components/PolicyTable';
import PolicyDetailsDrawer from './components/PolicyDetailsDrawer';
import NewPolicyMenu from './components/NewPolicyMenu';
import { usePolicies } from './hooks/usePolicies';
import { PolicyItem, PolicyStatus, PolicyType } from './types';
import { generatePolicyWithAi, type GeneratePolicyInput } from './api';

type FilterStatus = PolicyStatus | 'all';
type FilterType = PolicyType | 'all';

const PoliciesPage: React.FC = () => {
  const { policies, loading, detailLoading, saving, error, refresh, create, update, fetchOne } = usePolicies();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<FilterStatus>('all');
  const [type, setType] = React.useState<FilterType>('all');
  const [selected, setSelected] = React.useState<PolicyItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [lastAiInput, setLastAiInput] = React.useState<GeneratePolicyInput | null>(null);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [showAiDraftNote, setShowAiDraftNote] = React.useState(false);

  const handleCloseDrawer = () => {
    setSelected(null);
    setMode('view');
    setAiError(null);
    setShowAiDraftNote(false);
  };

  const filtered = React.useMemo(() => {
    return policies.filter((policy) => {
      const matchesSearch =
        policy.name.toLowerCase().includes(search.toLowerCase()) ||
        (policy.tags || []).some((tag) => tag.toLowerCase().includes(search.toLowerCase())) ||
        (policy.summary || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === 'all' ? true : policy.status === status;
      const matchesType = type === 'all' ? true : policy.type === type;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [policies, search, status, type]);

  const handleSelect = (policy: PolicyItem) => {
    setSelected(policy);
    setMode('view');
    setShowAiDraftNote(false);
    setAiError(null);
    if (policy.id) {
      fetchOne(policy.id).then((detail) => setSelected(detail)).catch(() => {});
    }
  };

  const handleSave = async (policy: PolicyItem) => {
    if (mode === 'create') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = policy;
      await create(rest as Omit<PolicyItem, 'id'>);
    } else if (policy.id) {
      await update(policy.id, policy);
    }
    await refresh();
    handleCloseDrawer();
  };

  const handleCreateBlank = () => {
    const now = new Date().toISOString();
    setShowAiDraftNote(false);
    setAiError(null);
    setSelected({
      id: '',
      name: 'New policy',
      type: 'other',
      status: 'draft',
      owner: '',
      lastUpdated: now,
      createdAt: now,
      summary: '',
      content: '',
      tags: [],
    });
    setMode('create');
  };

  const handleGenerateWithAi = async (input: GeneratePolicyInput) => {
    setAiGenerating(true);
    setLastAiInput(input);
    setAiError(null);
    try {
      const result = await generatePolicyWithAi(input);
      const now = new Date().toISOString();
      setSelected({
        id: `policy-${Date.now()}`,
        name: result.title,
        type: input.policyType,
        status: 'draft',
        owner: 'You',
        lastUpdated: now,
        createdAt: now,
        summary: result.summary,
        content: result.content,
        tags: ['ai-draft'],
      });
      setMode('create');
      setShowAiDraftNote(true);
    } catch (err) {
      setAiError('Failed to generate policy with AI. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleRegenerateAi = async (input?: GeneratePolicyInput) => {
    const payload = input ?? lastAiInput;
    if (!payload) return;
    setLastAiInput(payload);
    setAiGenerating(true);
    setAiError(null);
    try {
      const result = await generatePolicyWithAi(payload);
      setSelected((prev) =>
        prev
          ? {
              ...prev,
              name: result.title,
              summary: result.summary,
              content: result.content,
              tags: Array.from(new Set([...(prev.tags || []), 'ai-draft'])),
            }
          : prev
      );
      setShowAiDraftNote(true);
    } catch (err) {
      setAiError('Failed to generate policy with AI. Please try again.');
    } finally {
      setAiGenerating(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Policies</h1>
          <p className="text-sm text-slate-600">Manage your GDPR-related policies and keep them up to date.</p>
        </div>
        <NewPolicyMenu
          onNewBlank={handleCreateBlank}
          onGenerateWithAi={handleGenerateWithAi}
          aiGenerating={aiGenerating}
          aiError={aiError}
        />
      </div>
      {aiError && (
        <p className="text-sm text-rose-600" role="alert">
          {aiError}
        </p>
      )}

      <PageInfoBox
        title="Policy center"
        description="Centralize policy creation, reviews, and publication. AI-assisted drafts will help you ship faster."
      />

      <PolicyFiltersBar
        search={search}
        status={status}
        type={type}
        onSearch={setSearch}
        onStatusChange={setStatus}
        onTypeChange={setType}
      />

      <PolicyTable policies={filtered} onSelect={handleSelect} isLoading={loading} isError={Boolean(error)} />
      {error && <p className="text-sm text-rose-600">{error}</p>}

      <PolicyDetailsDrawer
        policy={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={handleCloseDrawer}
        onSave={handleSave}
        isLoading={detailLoading}
        isSaving={saving}
        onRegenerateAi={mode === 'create' && lastAiInput ? handleRegenerateAi : undefined}
        aiGenerating={aiGenerating}
        aiError={aiError}
        showAiDraftNote={showAiDraftNote}
      />
    </div>
  );
};

export default PoliciesPage;
