import React from 'react';
import { CookieItem } from '../types';
import CookieCategoryBadge from './CookieCategoryBadge';

type Props = {
  cookie: CookieItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const CookieRow: React.FC<Props> = ({ cookie, onClick }) => {
  return (
    <tr
      className="cursor-pointer border-b last:border-0 hover:bg-slate-50 focus-within:bg-slate-50"
      tabIndex={0}
      role="button"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <td className="py-3 pr-4 font-semibold text-foreground">{cookie.name}</td>
      <td className="py-3 pr-4 text-foreground">{cookie.domain}</td>
      <td className="py-3 pr-4">
        <CookieCategoryBadge category={cookie.category} />
      </td>
      <td className="py-3 pr-4 text-foreground">{cookie.duration}</td>
      <td className="py-3 pr-4 text-foreground capitalize">{cookie.type.replace('_', '-')}</td>
      <td className="py-3 pr-4 text-foreground">{cookie.provider}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(cookie.lastUpdated)}</td>
    </tr>
  );
};

export default CookieRow;
