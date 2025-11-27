import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onRegenerate: () => void;
  onExport: () => void;
  loading: boolean;
  error: string | null;
};

const PolicyPreview: React.FC<Props> = ({ value, onChange, onRegenerate, onExport, loading, error }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Policy preview</CardTitle>
          <CardDescription>Review and edit the generated policy.</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
            Regenerate
          </Button>
          <Button size="sm" onClick={onExport} disabled={!value}>
            Export PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && <div className="text-sm text-destructive">Error: {error}</div>}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[320px]"
          placeholder={loading ? 'Generating policy…' : 'Generated policy will appear here.'}
        />
      </CardContent>
    </Card>
  );
};

export default PolicyPreview;
