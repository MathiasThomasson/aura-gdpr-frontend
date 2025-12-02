import React from 'react';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import usePublicDsrLink from '@/hooks/dsr/usePublicDsrLink';

const buildPublicLink = (publicKey: string | null) => {
  if (!publicKey) return '';
  const origin = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : '';
  return origin ? `${origin}/public/dsr/${publicKey}` : `/public/dsr/${publicKey}`;
};

const PublicDsrSettings: React.FC = () => {
  const { toast } = useToast();
  const { link, loading, saving, error, enable, disable } = usePublicDsrLink();
  const [actionError, setActionError] = React.useState<string | null>(null);

  const linkUrl = React.useMemo(() => buildPublicLink(link.publicKey), [link.publicKey]);

  const handleToggle = async (checked: boolean) => {
    setActionError(null);
    try {
      if (checked) {
        await enable();
        toast({
          title: 'Public DSR form enabled',
          description: 'Share the link below with data subjects to collect requests.',
        });
      } else {
        await disable();
        toast({ title: 'Public DSR form disabled' });
      }
    } catch (err: any) {
      const message = err?.message ?? 'Unable to update public DSR settings.';
      setActionError(message);
    }
  };

  const handleCopy = async () => {
    if (!linkUrl) return;
    try {
      await navigator.clipboard.writeText(linkUrl);
      toast({ title: 'Public DSR link copied' });
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Unable to copy link',
        description: 'Please copy the URL manually.',
      });
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Public DSR Form</p>
          <h3 className="text-lg font-semibold text-slate-900">Share a secure request form</h3>
          <p className="text-sm text-slate-600">
            Allow individuals to submit GDPR data subject requests without logging in. Use the toggle to generate or
            disable your public form link.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {saving && <Loader2 className="h-4 w-4 animate-spin text-sky-600" aria-hidden />}
          <Switch
            checked={link.enabled}
            onCheckedChange={handleToggle}
            disabled={loading || saving}
            aria-label="Enable public DSR form"
          />
        </div>
      </div>

      {(error || actionError) && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {actionError || error}
        </div>
      )}

      {loading && !link.enabled ? (
        <p className="mt-3 text-sm text-slate-600">Loading public link status...</p>
      ) : null}

      {link.enabled && (
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <ExternalLink className="h-4 w-4" />
            <span>Public link</span>
          </div>
          <div className="flex flex-col gap-2 md:flex-row">
            <Input readOnly value={linkUrl} className="flex-1 bg-slate-50" />
            <Button type="button" variant="outline" onClick={handleCopy} disabled={!linkUrl || saving}>
              <Copy className="mr-2 h-4 w-4" />
              Copy link
            </Button>
          </div>
          <p className="text-xs text-slate-600">
            Share this link externally so individuals can submit GDPR requests directly into AURA-GDPR.
          </p>
        </div>
      )}
    </div>
  );
};

export default PublicDsrSettings;
