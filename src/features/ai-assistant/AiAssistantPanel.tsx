import React from 'react';
import { Loader2, Sparkles, X, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAiAssistant } from './hooks/useAiAssistant';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const AiAssistantPanel: React.FC<Props> = ({ isOpen, onClose }) => {
  const { question, setQuestion, answer, sources, isLoading, error, submit } = useAiAssistant();
  const inputRef = React.useRef<HTMLTextAreaElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const timeout = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(timeout);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (event?: React.FormEvent) => {
    event?.preventDefault();
    await submit(question);
  };

  const renderAnswer = () => {
    if (isLoading) {
      return (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
          Generating answer with AURA…
        </div>
      );
    }
    if (answer) {
      return answer
        .split('\n')
        .filter((paragraph) => paragraph.trim().length > 0)
        .map((paragraph, index) => (
          <p key={index} className="text-sm text-slate-800">
            {paragraph.trim()}
          </p>
        ));
    }
    return <p className="text-sm text-slate-500">Ask a question about your GDPR data, policies, or activities.</p>;
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-slate-900">
              <Sparkles className="h-5 w-5 text-sky-600" />
              <h2 className="text-lg font-semibold">Ask AURA</h2>
            </div>
            <p className="text-sm text-slate-600">
              Ask a question about your GDPR data, policies or activities.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            aria-label="Close assistant"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
              ref={inputRef}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask a question (e.g., Do we have a retention policy for HR data?)"
              disabled={isLoading}
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-500">AURA uses your data to return grounded answers.</p>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />}
                {isLoading ? 'Thinking…' : 'Ask'}
              </Button>
            </div>
            {error && <p className="text-xs text-rose-600">{error}</p>}
          </form>

          <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <BookOpen className="h-4 w-4 text-sky-600" />
              Answer
            </div>
            <div className="space-y-2">{renderAnswer()}</div>
          </div>

          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">Sources</p>
            {sources.length === 0 && (
              <p className="text-sm text-slate-500">No specific sources were returned for this answer.</p>
            )}
            {sources.map((source) => (
              <div key={source.id} className="rounded-md border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-900">{source.title}</p>
                <p className="text-sm text-slate-600">{source.snippet}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistantPanel;
