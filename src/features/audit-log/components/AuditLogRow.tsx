import React from 'react';
import { AuditLogItem } from '../types';
import AuditSeverityBadge from './AuditSeverityBadge';

type Props = {
  item: AuditLogItem;
  onClick: () => void;
};

const formatRelative = (value: string) => {
  const date = new Date(value);
  const now = Date.now();
  const diff = Math.max(0, now - date.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const AuditLogRow: React.FC<Props> = ({ item, onClick }) => {
  const resourceLabel = item.resourceName ? `${item.resourceType}: ${item.resourceName}` : item.resourceType;
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
      <td className="py-3 pr-4 text-foreground">{formatRelative(item.timestamp)}</td>
      <td className="py-3 pr-4 text-foreground">{item.actor}</td>
      <td className="py-3 pr-4 text-foreground">{item.action}</td>
      <td className="py-3 pr-4 text-foreground">{resourceLabel}</td>
      <td className="py-3 pr-4">
        <AuditSeverityBadge severity={item.severity} />
      </td>
    </tr>
  );
};

export default AuditLogRow;
