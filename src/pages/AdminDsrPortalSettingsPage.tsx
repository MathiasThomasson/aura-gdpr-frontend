import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

const AdminDsrPortalSettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader title="DSR Portal Settings" description="Configure public DSR portal options (placeholder)." />
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Portal settings will be available here. Configure branding, allowed request types, and notification preferences.
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDsrPortalSettingsPage;
