import React from 'react';
import { cn } from '@/lib/utils';

type CardProps = {
  title?: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
};

/**
 * App-wide card with consistent padding, border, and shadow.
 * Use this instead of ad-hoc div wrappers to keep pages aligned.
 */
const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  actions,
  children,
  className,
  headerClassName,
  bodyClassName,
}) => {
  return (
    <div className={cn('rounded-xl border bg-white p-6 shadow-sm', className)}>
      {(title || subtitle || actions) && (
        <div className={cn('mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between', headerClassName)}>
          <div>
            {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
            {subtitle ? <p className="text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </div>
      )}
      <div className={cn('space-y-3', bodyClassName)}>{children}</div>
    </div>
  );
};

export default Card;
