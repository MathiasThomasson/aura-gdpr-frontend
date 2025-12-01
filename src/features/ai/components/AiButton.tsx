import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type AiButtonProps = {
  label: string;
  onClick: () => void | Promise<void>;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
};

const variantMap: Record<NonNullable<AiButtonProps['variant']>, 'default' | 'secondary' | 'ghost'> = {
  primary: 'default',
  secondary: 'secondary',
  ghost: 'ghost',
};

export const AiButton: React.FC<AiButtonProps> = ({ label, onClick, loading, disabled, variant = 'primary' }) => {
  return (
    <Button
      type="button"
      variant={variantMap[variant]}
      disabled={disabled || loading}
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-lg border border-sky-100 bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm transition hover:from-sky-500 hover:to-indigo-500 disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Thinking...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
};

export default AiButton;
