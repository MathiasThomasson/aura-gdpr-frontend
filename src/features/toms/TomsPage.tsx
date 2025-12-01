import React from 'react';
import TomsFiltersBar from './components/TomsFiltersBar';
import TomsTable from './components/TomsTable';
import TomsDetailsDrawer from './components/TomsDetailsDrawer';
import NewTomButton from './components/NewTomButton';
import useTomsMockData from './hooks/useTomsMockData';
import { TomCategory, TomEffectiveness, TomItem } from './types';

type CategoryFilter = TomCategory | 'all';
type EffectivenessFilter = TomEffectiveness | 'all';

const TomsPage: React.FC = () => {
  const { toms, setToms, isLoading, isError } = useTomsMockData();
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
    setMode('view');
  };

  const handleSave = (tom: TomItem, saveMode: 'create' | 'edit') => {
    setToms((prev) => {
      if (saveMode === 'edit') {
        return prev.map((t) => (t.id === tom.id ? { ...tom, lastUpdated: new Date().toISOString() } : t));
      }
      return [
        {
          ...tom,
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        ...prev,
      ];
    });
    setSelected(null);
    setMode('view');
  };

  const handleNew = () => {
    const now = new Date().toISOString();
    setSelected({
      id: `tom-${Date.now()}`,
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

      <TomsTable toms={filtered} onSelect={handleSelect} isLoading={isLoading} isError={isError} />

      <TomsDetailsDrawer
        tom={selected}
        isOpen={Boolean(selected)}
        mode={mode}
        onClose={() => setSelected(null)}
        onSave={handleSave}
      />
    </div>
  );
};

export default TomsPage;
