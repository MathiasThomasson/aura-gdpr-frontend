import React from 'react';
import { BookOpen } from 'lucide-react';
import type { AiSource } from '../types';

type Props = {
  sources: AiSource[];
};

const AiSourcesList: React.FC<Props> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;
  return (
    <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
        <BookOpen className="h-4 w-4 text-sky-600" />
        Sources
      </div>
      <div className="space-y-3">
        {sources.map((source) => (
          <div key={source.id} className="rounded-md border border-slate-100 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">{source.title}</p>
            {source.snippet && <p className="text-sm text-slate-600">{source.snippet}</p>}
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-sky-700 underline"
              >
                View source
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiSourcesList;
