import React from 'react';
import { DocumentItem } from '../types';
import DocumentRow from './DocumentRow';
import DocumentStatusBadge from './DocumentStatusBadge';

type Props = {
  documents: DocumentItem[];
  onSelect: (doc: DocumentItem) => void;
  isLoading?: boolean;
  isError?: boolean;
};

const DocumentTable: React.FC<Props> = ({ documents, onSelect, isLoading, isError }) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading documents...</p>;
  }
  if (isError) {
    return <p className="text-sm text-red-600">Failed to load documents.</p>;
  }
  if (documents.length === 0) {
    return <p className="text-sm text-muted-foreground">No documents found for the selected filters.</p>;
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="py-3 pr-4 font-semibold">Type</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Owner</th>
            <th className="py-3 pr-4 font-semibold">Last updated</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <DocumentRow key={doc.id} document={doc} onClick={() => onSelect(doc)} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
