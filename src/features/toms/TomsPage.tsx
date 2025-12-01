import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import TomsFiltersBar from './components/TomsFiltersBar';
import TomsTable from './components/TomsTable';
import TomsDetailsDrawer from './components/TomsDetailsDrawer';
import NewTomButton from './components/NewTomButton';
import useToms from './hooks/useToms';
import { TomCategory, TomEffectiveness, TomItem } from './types';

type CategoryFilter = TomCategory | 'all';
type EffectivenessFilter = TomEffectiveness | 'all';

const TomsPage: React.FC = () => {
  const { toms, loading, detailLoading, saving, error, refresh, fetchOne, create, update } = useToms();
  const [search, setSearch] = React.useState('');
  const [category, setCategory] = React.useState<CategoryFilter>('all');
  const [effectiveness, setEffectiveness] = React.useState<EffectivenessFilter>('all');
  const [selected, setSelected] = React.useState<TomItem | null>(null);
  const [mode, setMode] = React.useState<'view' | 'create' | 'edit'>('view');

  const filtered = React.useMemo(() => {
    return toms.filter((tom) => {
      const matchesSearch = tom.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' ? true : tom.category === category;
      const matchesEffectiveness = effectiveness === 'all' ? true : tom.effectiveness === effectiveness;
      return matchesSearch && matchesCategory && matchesEffectiveness;
    });
  }, [toms, search, category, effectiveness]);

  const handleSelect = (tom: TomItem) => {
    setSelected(tom);
    setMode('edit');
    if (tom.id) {
      fetchOne(tom.id)
        .then((detail) => setSelected(detail))
        .catch(() => {});
    }
  };

  const handleSave = async (tom: TomItem, saveMode: 'create' | 'edit') => {
    try {
      if (saveMode === 'create') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...payload } = tom;
        await create(payload);
      } else if (tom.id) {
        await update(tom.id, tom);
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
      category: 'other',
      description: '',
      implementation: '',
      effectiveness: 'medium',
      owner: 'You',
      createdAt: now,
      lastUpdated: now,
    });
    setMode('create');
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

    if (error) {
      return (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          <div className="flex items-center justify-between gap-3">
            <p>{error}</p>
            <button
              type="button"
              className="text-xs font-semibold text-rose-800 underline"
              onClick={() => refresh()}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (filtered.length === 0) {
      return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">No measures match the current filters.</p>
          <p className="text-slate-600">Try adjusting filters or create a new TOM.</p>
        </div>
      );
    }

    return <TomsTable toms={filtered} onSelect={handleSelect} />;
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Technical & Organisational Measures (TOMs)</h1>
          <p className="text-sm text-slate-600">Document the security measures used to protect personal data.</p>
        </div>
        <NewTomButton onNew={handleNew} />
      </div>

      <TomsFiltersBar
        search={search}
        category={category}
        effectiveness={effectiveness}
        onSearch={setSearch}
        onCategoryChange={setCategory}
        onEffectivenessChange={setEffectiveness}
      />

      {renderContent()}

      <TomsDetailsDrawer
        tom={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => {
          setSelected(null);
          setMode('view');
        }}
        onSave={handleSave}
        isLoading={detailLoading}
        isSaving={saving}
      />
    </div>
  );
};

export default TomsPage;
