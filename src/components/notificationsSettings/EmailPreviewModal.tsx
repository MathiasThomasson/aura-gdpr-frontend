import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

const EmailPreviewModal: React.FC<Props> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-background rounded-lg shadow-2xl border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Preview</p>
              <h3 className="text-lg font-semibold">Email preview</h3>
            </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close preview">
            <X className="h-5 w-5" />
          </Button>
        </div>
          <div className="p-4 space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Your DPIA was approved</CardTitle>
                <CardDescription>Example notification email</CardDescription>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>Hello,</p>
                <p>Your recent DPIA has been reviewed and approved by the DPO.</p>
                <p>You can view the details in your AURA-GDPR dashboard.</p>
                <p className="text-muted-foreground text-xs">This is a preview. Actual email content may vary.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailPreviewModal;
