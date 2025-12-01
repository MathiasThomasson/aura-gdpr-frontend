import React from 'react';
import { DocumentItem } from '../types';
import DocumentStatusBadge from './DocumentStatusBadge';

type Props = {
  document: DocumentItem;
  onClick: () => void;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const DocumentRow: React.FC<Props> = ({ document, onClick }) => {
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
      <td className="py-3 pr-4 font-semibold text-foreground">{document.name}</td>
      <td className="py-3 pr-4 text-foreground capitalize">{document.type.replaceAll('_', ' ')}</td>
      <td className="py-3 pr-4">
        <DocumentStatusBadge status={document.status} />
      </td>
      <td className="py-3 pr-4 text-foreground">{document.owner}</td>
      <td className="py-3 pr-4 text-foreground">{formatDate(document.lastUpdated)}</td>
    </tr>
  );
};

export default DocumentRow;
