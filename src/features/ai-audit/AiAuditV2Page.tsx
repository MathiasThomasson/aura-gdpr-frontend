import React from 'react';
import AiAuditV2Panel from '@/features/ai/components/AiAuditV2Panel';

const AiAuditV2Page: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">AI Audit Engine v2</h1>
        <p className="text-sm text-slate-600">
          Run the next-generation AI audit with contextual recommendations and source links.
        </p>
      </div>
      <AiAuditV2Panel />
    </div>
  );
};

export default AiAuditV2Page;
