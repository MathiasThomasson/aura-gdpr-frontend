import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import AiLoader from './AiLoader';
import AiError from './AiError';
import AiSourcesList from './AiSourcesList';
import { useAiAutofill } from '../hooks/useAiAutofill';

type Props = {
  open: boolean;
  availableFields: string[];
  onClose: () => void;
  onApply: (values: Record<string, string>) => void;
  documentId?: string;
  context?: string;
  currentValues?: Record<string, string>;
};

const AiAutofillModal: React.FC<Props> = ({
  open,
  availableFields,
  onClose,
  onApply,
  documentId,
  context,
  currentValues,
}) => {
  const { result, loading, error, autofill } = useAiAutofill();
  const [selectedFields, setSelectedFields] = React.useState<string[]>(availableFields);
  const [userContext, setUserContext] = React.useState(context ?? '');

  React.useEffect(() => {
    if (open) {
      setSelectedFields(availableFields);
      setUserContext(context ?? '');
    }
  }, [open, availableFields, context]);

  if (!open) return null;

  const toggleField = (field: string) => {
    setSelectedFields((prev) => (prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFields.length === 0) return;
    const response = await autofill({
      fields: selectedFields,
      context: userContext,
      documentId,
      currentValues,
    });
    onApply(response.values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl rounded-xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="space-y-4 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">AI Autofill</h3>
            <p className="text-sm text-slate-600">Choose fields for AURA AI to generate or improve.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 rounded-lg border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-900">Fields</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
                {availableFields.map((field) => (
                  <label key={field} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedFields.includes(field)}
                      onChange={() => toggleField(field)}
                      disabled={loading}
                    />
                    {field}
                  </label>
                ))}
                {availableFields.length === 0 && <p className="text-sm text-slate-500">No fields available.</p>}
              </div>
            </div>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Context (optional)</span>
              <Textarea
                value={userContext}
                onChange={(e) => setUserContext(e.target.value)}
                disabled={loading}
                placeholder="Share organizational context, tone, or constraints."
                className="min-h-[100px]"
              />
            </label>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading || selectedFields.length === 0}>
                {loading ? 'Thinking...' : 'Generate fields'}
              </Button>
            </div>
          </form>

          {loading && <AiLoader label="Generating fields with AURA AI..." />}
          {error && <AiError message={error} />}
          {result && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Suggestions</p>
              <div className="space-y-2">
                {Object.entries(result.values).map(([key, value]) => (
                  <div key={key} className="rounded-md border border-slate-100 bg-white p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{key}</p>
                    <p className="text-sm text-slate-800">{value}</p>
                  </div>
                ))}
                {Object.keys(result.values).length === 0 && <p className="text-sm text-slate-500">No suggestions returned.</p>}
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => onApply(result.values)}
                  disabled={Object.keys(result.values).length === 0}
                >
                  Apply to form
                </Button>
              </div>
            </div>
          )}
          {result && <AiSourcesList sources={result.sources} />}
        </div>
      </div>
    </div>
  );
};

export default AiAutofillModal;
