import React from 'react';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import AiLoader from './AiLoader';
import AiError from './AiError';
import AiSourcesList from './AiSourcesList';
import { useAiExplain } from '../hooks/useAiExplain';

type Props = {
  open: boolean;
  text: string;
  context?: string;
  onClose: () => void;
};

const AiExplainModal: React.FC<Props> = ({ open, text, context, onClose }) => {
  const { result, loading, error, explain } = useAiExplain();
  const [input, setInput] = React.useState(text);
  const hasRun = React.useRef(false);

  React.useEffect(() => {
    if (open) {
      setInput(text);
      hasRun.current = false;
    }
  }, [open, text]);

  React.useEffect(() => {
    if (open && !hasRun.current && text.trim()) {
      hasRun.current = true;
      void explain({ text, context });
    }
  }, [open, text, context, explain]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await explain({ text: input, context });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white shadow-2xl">
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
            <h3 className="text-lg font-semibold text-slate-900">Explain with AI</h3>
            <p className="text-sm text-slate-600">Get a plain-English explanation for this content.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Content</span>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="min-h-[120px]"
              />
            </label>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading || !input.trim()}>
                {loading ? 'Thinking...' : 'Explain'}
              </Button>
            </div>
          </form>

          {loading && <AiLoader label="Explaining with AURA AI..." />}
          {error && <AiError message={error} />}
          {result?.explanation && (
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">Explanation</p>
              <p className="whitespace-pre-wrap text-sm text-slate-700">{result.explanation}</p>
            </div>
          )}
          {result && <AiSourcesList sources={result.sources} />}
        </div>
      </div>
    </div>
  );
};

export default AiExplainModal;
