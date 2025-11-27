import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PolicyFormInput, PolicyType } from '@/hooks/usePolicyGenerator';

type Props = {
  onGenerate: (input: PolicyFormInput) => void;
  loading: boolean;
};

const policyOptions: { value: PolicyType; label: string }[] = [
  { value: 'privacy_policy', label: 'Privacy Policy' },
  { value: 'cookie_policy', label: 'Cookie Policy' },
  { value: 'incident_policy', label: 'Incident Policy' },
  { value: 'dsr_procedure', label: 'DSR Procedure' },
  { value: 'data_protection_policy', label: 'Data Protection Policy' },
];

const PolicyGeneratorForm: React.FC<Props> = ({ onGenerate, loading }) => {
  const [form, setForm] = useState<PolicyFormInput>({
    policy_type: 'privacy_policy',
    organization_name: '',
    audience: 'public',
    tone: 'formal',
    data_categories: [],
    notes: '',
  });
  const [dataCategoriesInput, setDataCategoriesInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(form);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate a policy</CardTitle>
        <CardDescription>Provide a few details to generate a GDPR-ready policy.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Policy type</Label>
            <select
              value={form.policy_type}
              onChange={(e) => setForm((p) => ({ ...p, policy_type: e.target.value as PolicyType }))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              {policyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Organization name</Label>
            <Input
              value={form.organization_name}
              onChange={(e) => setForm((p) => ({ ...p, organization_name: e.target.value }))}
              required
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Audience</Label>
              <select
                value={form.audience}
                onChange={(e) => setForm((p) => ({ ...p, audience: e.target.value as 'public' | 'internal' }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="public">Public</option>
                <option value="internal">Internal</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <select
                value={form.tone}
                onChange={(e) => setForm((p) => ({ ...p, tone: e.target.value as 'formal' | 'simple' }))}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="formal">Formal</option>
                <option value="simple">Simple</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data categories (comma separated)</Label>
            <Input
              value={dataCategoriesInput}
              onChange={(e) => {
                const value = e.target.value;
                setDataCategoriesInput(value);
                setForm((p) => ({
                  ...p,
                  data_categories: value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                }));
              }}
              placeholder="e.g. contact info, HR data, payment data"
            />
          </div>
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[100px]"
              placeholder="Add any special clauses, exclusions, or processing details."
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Generating…' : 'Generate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PolicyGeneratorForm;
