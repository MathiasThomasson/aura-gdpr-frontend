import React from 'react';
import { AlertTriangle } from 'lucide-react';

type Props = {
  message: string;
};

const AiError: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
      <AlertTriangle className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
};

export default AiError;
