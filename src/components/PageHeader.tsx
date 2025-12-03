import React from 'react';

type Props = {
  title: string;
  subtitle?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
};

const PageHeader: React.FC<Props> = ({ title, subtitle, description, actions, className }) => {
  const resolvedSubtitle = subtitle ?? description;

  return (
    <div className={`mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between ${className ?? ''}`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">AURA-GDPR</p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        {resolvedSubtitle ? <p className="text-sm text-slate-600">{resolvedSubtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
