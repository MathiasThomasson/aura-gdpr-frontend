import React from 'react';
import { ChevronDown, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Template = { name: string; type: string; description?: string };

type Props = {
  onNewBlank: () => void;
  onTemplateSelect: (template: Template) => void;
};

const templates: Template[] = [
  { name: 'Privacy Policy', type: 'privacy_policy', description: 'Standard privacy policy template.' },
  { name: 'Cookie Policy', type: 'cookie_policy', description: 'Covers cookie usage and consent.' },
  { name: 'Data Processing Agreement', type: 'data_processing_agreement', description: 'DPA for processors.' },
  { name: 'Information Security Policy', type: 'security_policy', description: 'Outlines security controls.' },
];

const NewDocumentMenu: React.FC<Props> = ({ onNewBlank, onTemplateSelect }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button className="inline-flex items-center gap-2" onClick={() => setOpen((o) => !o)}>
        <FilePlus2 className="h-4 w-4" />
        New document
        <ChevronDown className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-slate-200 bg-white shadow-lg">
          <button
            type="button"
            className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50"
            onClick={() => {
              onNewBlank();
              setOpen(false);
            }}
          >
            <span className="font-semibold">Blank document</span>
            <span className="text-xs text-slate-500">Start from scratch</span>
          </button>
          <div className="border-t border-slate-200">
            <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">From template</p>
            {templates.map((tpl) => (
              <button
                key={tpl.name}
                type="button"
                className="flex w-full flex-col items-start px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50"
                onClick={() => {
                  onTemplateSelect(tpl);
                  setOpen(false);
                }}
              >
                <span className="font-semibold">{tpl.name}</span>
                <span className="text-xs text-slate-500">{tpl.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDocumentMenu;
