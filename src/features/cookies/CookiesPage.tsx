import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import CookiesTable from './components/CookiesTable';
import CookieFiltersBar from './components/CookieFiltersBar';
import CookieDetailsDrawer from './components/CookieDetailsDrawer';
import NewCookieButton from './components/NewCookieButton';
import useCookies from './hooks/useCookies';
import { CookieCategory, CookieItem, CookieSource } from './types';
import { generateCookiePolicyAi } from './api';
import { Button } from '@/components/ui/button';

const CookiesPage: React.FC = () => {
  const { cookies, loading, detailLoading, saving, error, refresh, fetchOne, create, update, patch } = useCookies();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<CookieCategory | 'all'>('all');
  const [type, setType] = React.useState<'first_party' | 'third_party' | 'all'>('all');
  const [source, setSource] = React.useState<CookieSource | 'all'>('all');
  const [selected, setSelected] = React.useState<CookieItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');
  const [aiModalOpen, setAiModalOpen] = React.useState(false);
  const [aiDraft, setAiDraft] = React.useState<string>('');
  const [aiLoading, setAiLoading] = React.useState(false);

  const filtered = React.useMemo(() => {
    return cookies.filter((cookie) => {
      const matchesSearch =
        cookie.name.toLowerCase().includes(search.toLowerCase()) ||
        cookie.provider.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' ? true : cookie.category === category;
      const matchesType = type === 'all' ? true : cookie.type === type;
      const matchesSource = source === 'all' ? true : cookie.source === source;
      return matchesSearch && matchesCategory && matchesType && matchesSource;
    });
  }, [cookies, search, category, type, source]);

  const handleSelect = (cookie: CookieItem) => {
    setSelected(cookie);
    setMode('edit');
    if (cookie.id) {
      fetchOne(cookie.id)
        .then((detail) => setSelected(detail))
        .catch(() => {});
    }
  };

  const handleSave = async (cookie: CookieItem, saveMode: 'create' | 'edit') => {
    try {
      if (saveMode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...payload } = cookie;
        await create(payload);
      } else if (cookie.id) {
        await update(cookie.id, cookie);
      }
      await refresh();
      setSelected(null);
      setMode('view');
    } catch (err) {
      // errors are captured in hook state
    }
  };

  const handleNew = () => {
    const now = new Date().toISOString();
    setSelected({
      id: '',
      name: '',
      domain: '',
      duration: '',
      category: 'unclassified',
      purpose: '',
      provider: '',
      type: 'first_party',
      source: 'manual',
      createdAt: now,
      lastUpdated: now,
    });
    setMode('create');
  };

  const handleCategoryChange = async (cookieId: string, nextCategory: CookieCategory) => {
    try {
      await patch(cookieId, { category: nextCategory });
      await refresh();
    } catch (err) {
      // errors are captured in hook state
    }
  };

  const handleTypeChange = async (cookieId: string, nextType: CookieItem['type']) => {
    try {
      await patch(cookieId, { type: nextType });
      await refresh();
    } catch (err) {
      // errors are captured in hook state
    }
  };

  const handleGenerateAi = async () => {
    setAiLoading(true);
    const draft = await generateCookiePolicyAi();
    setAiDraft(draft.trim());
    setAiModalOpen(true);
    setAiLoading(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className="h-20 w-full rounded-lg bg-slate-100" />
          ))}
        </div>
      );
    }

    return (
      <CookiesTable
        cookies={filtered}
        onSelect={handleSelect}
        isLoading={loading}
        isError={Boolean(error)}
        errorMessage={error}
        onRetry={refresh}
      />
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Cookie compliance</h1>
          <p className="text-sm text-slate-600">Manage your cookie inventory and prepare your cookie policy.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleGenerateAi} disabled={aiLoading}>
            {aiLoading ? 'Generating...' : 'Generate cookie policy (AI)'}
          </Button>
          <NewCookieButton onNew={handleNew} />
        </div>
      </div>

      <CookieFiltersBar
        search={search}
        category={category}
        type={type}
        source={source}
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onTypeChange={setType}
        onSourceChange={setSource}
      />

      {renderContent()}

      <CookieDetailsDrawer
        cookie={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => {
          setSelected(null);
          setMode('view');
        }}
        onSave={handleSave}
        isLoading={detailLoading}
        isSaving={saving}
        onCategoryChange={handleCategoryChange}
        onTypeChange={handleTypeChange}
      />

      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI-generated cookie policy</h2>
                <p className="text-sm text-slate-600">This is a draft. Review before publishing.</p>
              </div>
              <button
                type="button"
                onClick={() => setAiModalOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                aria-label="Close"
              >
                X
              </button>
            </div>
            <pre className="mt-3 max-h-[400px] overflow-auto rounded-md bg-slate-50 p-3 text-sm text-slate-800 whitespace-pre-wrap">
              {aiDraft}
            </pre>
            <div className="mt-4 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(aiDraft);
                }}
              >
                Copy
              </Button>
              <Button onClick={() => setAiModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookiesPage;
