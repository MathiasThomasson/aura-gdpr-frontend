import React from 'react';
import EmptyState from '@/components/EmptyState';
import { DocumentItem } from '../types';
import DocumentRow from './DocumentRow';

type Props = {
  documents: DocumentItem[];
  onSelect: (doc: DocumentItem) => void;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  hasDocuments?: boolean;
  onCreate?: () => void;
};

const DocumentTable: React.FC<Props> = ({
  documents,
  onSelect,
  isLoading,
  isError,
  errorMessage,
  onRetry,
  hasDocuments,
  onCreate,
}) => {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading documents...</p>;
  }
  if (isError) {
    return (
      <EmptyState
        title="Unable to load documents"
        description={errorMessage || 'Something went wrong while loading data. Please try again.'}
        actionLabel={onRetry ? 'Retry' : undefined}
        onAction={onRetry}
        className="bg-rose-50 border-rose-200"
      />
    );
  }
  if (documents.length === 0) {
    if (hasDocuments) {
      return (
        <EmptyState
          title="No documents match these filters"
          description="Try adjusting filters or create a new document."
          actionLabel="New document"
          onAction={onCreate}
        />
      );
    }
    return (
      <EmptyState
        title="No documents yet"
        description="Start by creating your first GDPR document. Draft data processing agreements, privacy notices, and more."
        actionLabel="New document"
        onAction={onCreate}
      />
    );
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
