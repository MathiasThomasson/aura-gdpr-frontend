import React from 'react';
import PageInfoBox from '@/components/PageInfoBox';
import PolicyFiltersBar from './components/PolicyFiltersBar';
import PolicyTable from './components/PolicyTable';
import PolicyDetailsDrawer from './components/PolicyDetailsDrawer';
import NewPolicyMenu from './components/NewPolicyMenu';
import usePoliciesMockData from './hooks/usePoliciesMockData';
import {
  PolicyItem,
  PolicyStatus,
  PolicyType,
  GeneratePolicyInput,
} from './types';
import { generatePolicyWithAi } from './api';

type FilterStatus = PolicyStatus | 'all';
type FilterType = PolicyType | 'all';

const PoliciesPage: React.FC = () => {
  const { policies, setPolicies, isLoading, isError } = usePoliciesMockData();
  const [search, setSearch] = React.useState('');
  const [status, setStatus] = React.useState<FilterStatus>('all');
  const [type, setType] = React.useState<FilterType>('all');
  const [selected, setSelected] = React.useState<PolicyItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');
  const [aiGenerating, setAiGenerating] = React.useState(false);
  const [lastAiInput, setLastAiInput] = React.useState<GeneratePolicyInput | null>(null);

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
  };

  const handleSave = (policy: PolicyItem) => {
    setPolicies((prev) => {
      const exists = prev.findIndex((p) => p.id === policy.id);
      if (exists >= 0) {
        const next = [...prev];
        next[exists] = policy;
        return next;
      }
      return [policy, ...prev];
    });
    setSelected(null);
    setMode('view');
  };

  const handleCreateBlank = () => {
    const now = new Date().toISOString();
    setSelected({
      id: `policy-${Date.now()}`,
      name: 'New policy',
      type: 'other',
      status: 'draft',
      owner: 'You',
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
    try {
      const result = await generatePolicyWithAi(input);
      const now = new Date().toISOString();
      setSelected({
        id: `policy-${Date.now()}`,
        name: result.title,
        type: input.type,
        status: 'draft',
        owner: 'You',
        lastUpdated: now,
        createdAt: now,
        summary: result.summary,
        content: result.content,
        tags: ['ai-draft'],
      });
      setMode('create');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleRegenerateAi = async (input?: GeneratePolicyInput) => {
    const payload = input ?? lastAiInput;
    if (!payload) return;
    setAiGenerating(true);
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
        <NewPolicyMenu onNewBlank={handleCreateBlank} onGenerateWithAi={handleGenerateWithAi} aiGenerating={aiGenerating} />
      </div>

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

      <PolicyTable policies={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <PolicyDetailsDrawer
        policy={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        onRegenerateAi={mode === 'create' ? handleRegenerateAi : undefined}
        aiGenerating={aiGenerating}
      />
    </div>
  );
};

export default PoliciesPage;
