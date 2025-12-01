import React from 'react';
import { ChevronDown, FilePlus2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { policyTypeLabels, PolicyType } from '../types';
import type { GeneratePolicyInput } from '../api';

type Props = {
  onNewBlank: () => void;
  onGenerateWithAi: (input: GeneratePolicyInput) => void;
  aiGenerating?: boolean;
  aiError?: string | null;
};

const templateTypes: PolicyType[] = [
  'privacy_policy',
  'cookie_policy',
  'data_processing_agreement',
  'data_retention_policy',
  'information_security_policy',
  'internal_guideline',
];

const NewPolicyMenu: React.FC<Props> = ({ onNewBlank, onGenerateWithAi, aiGenerating, aiError }) => {
  const [open, setOpen] = React.useState(false);
  const [aiForm, setAiForm] = React.useState<GeneratePolicyInput>({
    policyType: 'privacy_policy',
    contextDescription: '',
  });

  const handleGenerate = () => {
    onGenerateWithAi(aiForm);
    setOpen(false);
  };

  return (
    <div className="relative">
      <Button className="inline-flex items-center gap-2" onClick={() => setOpen((o) => !o)}>
        <FilePlus2 className="h-4 w-4" />
        New policy
        <ChevronDown className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-lg border border-slate-200 bg-white shadow-lg">
          <button
            type="button"
            className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50"
            onClick={() => {
              onNewBlank();
              setOpen(false);
            }}
          >
            <span className="font-semibold">Blank policy</span>
            <span className="text-xs text-slate-500">Start from scratch.</span>
          </button>
          <div className="border-t border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Generate with AI
            </div>
            <p className="mt-1 text-xs text-slate-500">Provide context to draft a policy.</p>
            <div className="mt-3 space-y-2">
              <select
                value={aiForm.policyType}
                onChange={(e) => setAiForm((prev) => ({ ...prev, policyType: e.target.value as PolicyType }))}
                disabled={aiGenerating}
                className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
              >
                {templateTypes.map((t) => (
                  <option key={t} value={t}>
                    {policyTypeLabels[t]}
                  </option>
                ))}
              </select>
              <textarea
                value={aiForm.contextDescription}
                onChange={(e) => setAiForm((prev) => ({ ...prev, contextDescription: e.target.value }))}
                placeholder="Short context (e.g. SaaS company serving EU customers)"
                disabled={aiGenerating}
                className="w-full rounded-md border border-slate-200 px-2 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 disabled:opacity-70"
                rows={3}
              />
              <Button
                className="w-full"
                onClick={handleGenerate}
                disabled={aiGenerating}
              >
                {aiGenerating ? 'Generating with AI…' : 'Generate policy draft'}
              </Button>
              {aiError && <p className="text-xs text-rose-600">{aiError}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewPolicyMenu;
