import React from 'react';
import { Loader2 } from 'lucide-react';

type Props = {
  label?: string;
};

const AiLoader: React.FC<Props> = ({ label = 'Thinking with AURA AI...' }) => {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
      <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
      {label}
    </div>
  );
};

export default AiLoader;
