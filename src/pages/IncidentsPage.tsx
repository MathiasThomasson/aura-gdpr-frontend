import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcw } from 'lucide-react';

const IncidentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Incidents"
        description="Track security incidents and breach reporting."
        actions={
          <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />
      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          Incident management is coming soon. This placeholder keeps navigation consistent for linked modules.
        </CardContent>
      </Card>
    </div>
  );
};

export default IncidentsPage;
