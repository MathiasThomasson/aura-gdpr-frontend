import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageHeader from '@/components/PageHeader';
import api from '@/lib/apiClient';

const requestTypes = ['access', 'rectification', 'erasure', 'restriction', 'portability', 'objection'];

const DsrPortalPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [type, setType] = useState(requestTypes[0]);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/dsr', { email, type, description });
      const id = res.data?.id ?? 'N/A';
      setTicketId(id);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEmail('');
    setType(requestTypes[0]);
    setDescription('');
    setTicketId(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-4">
      <PageHeader
        title="Data Subject Request Portal"
        description="Submit a GDPR request (access, rectification, erasure, restriction, portability, objection)."
      />

      <Card>
        <CardContent className="p-6 space-y-4">
          {ticketId ? (
            <div className="space-y-3">
              <h2 className="text-xl font-semibold">Request submitted</h2>
              <p className="text-sm text-muted-foreground">Your ticket ID is <span className="font-semibold">{ticketId}</span>. We will respond within 30 days.</p>
              <Button onClick={reset}>Submit another request</Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && <div className="text-sm text-destructive">Error: {error}</div>}
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Request type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  {requestTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm min-h-[120px]"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Attachments</label>
                <input type="file" disabled className="text-sm text-muted-foreground" />
                <p className="text-xs text-muted-foreground">File uploads coming soon.</p>
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Submitting…' : 'Submit request'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DsrPortalPage;
