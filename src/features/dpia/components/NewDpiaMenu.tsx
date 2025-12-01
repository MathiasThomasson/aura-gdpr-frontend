import React from 'react';
import { ChevronDown, FilePlus2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Template = { name: string; purpose: string; processingDescription: string };

type Props = {
  onNewBlank: () => void;
  onTemplateSelect: (template: Template) => void;
};

const templates: Template[] = [
  {
    name: 'Employee monitoring',
    purpose: 'Monitor workstation usage for security and productivity analysis.',
    processingDescription: 'Processing of log-in times, application usage and visited websites for employees.',
  },
  {
    name: 'Video surveillance',
    purpose: 'Monitor office premises for safety and asset protection.',
    processingDescription: 'Processing of video footage of employees and visitors in office premises.',
  },
  {
    name: 'New marketing tool',
    purpose: 'Assess processing for targeted marketing campaigns with a new tool.',
    processingDescription: 'Processing of contact details, engagement metrics and website behaviour for marketing.',
  },
];

const NewDpiaMenu: React.FC<Props> = ({ onNewBlank, onTemplateSelect }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button className="inline-flex items-center gap-2" onClick={() => setOpen((o) => !o)}>
        <FilePlus2 className="h-4 w-4" />
        New DPIA
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
            <span className="font-semibold">Blank DPIA</span>
            <span className="text-xs text-slate-500">Start from scratch.</span>
          </button>
          <div className="border-t border-slate-200 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">From template</p>
            <div className="mt-2 space-y-2">
              {templates.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  className="flex w-full flex-col items-start rounded-md px-2 py-2 text-left text-sm text-slate-800 hover:bg-slate-50"
                  onClick={() => {
                    onTemplateSelect(tpl);
                    setOpen(false);
                  }}
                >
                  <span className="font-semibold">{tpl.name}</span>
                  <span className="text-xs text-slate-500">{tpl.purpose}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewDpiaMenu;
