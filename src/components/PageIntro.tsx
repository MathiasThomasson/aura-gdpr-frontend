import React from 'react';
import { cn } from '@/lib/utils';

type PageIntroProps = {
  title: string;
  subtitle?: string;
  bullets?: string[];
  className?: string;
};

const PageIntro: React.FC<PageIntroProps> = ({ title, subtitle, bullets = [], className }) => {
  return (
    <div className={cn('mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4', className)}>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-700">{subtitle}</p> : null}
      {bullets.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default PageIntro;
