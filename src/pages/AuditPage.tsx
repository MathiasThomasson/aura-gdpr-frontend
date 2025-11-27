import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';

const AuditPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Track system and user actions across the tenant." />
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>Audit table and detail drawer will be added here.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This placeholder preserves routing while we build the audit module.
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditPage;
