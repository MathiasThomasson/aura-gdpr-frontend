import React from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DsrPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Subject Requests"
        description="Manage GDPR Article 12–23 requests."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open('/dsr-portal', '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Create public DSR link
          </Button>
        }
      />

      <Card>
        <CardContent className="p-4 text-sm text-muted-foreground">
          DSR list and workflows are coming soon. Use the public portal link above to capture requests.
        </CardContent>
      </Card>
    </div>
  );
};

export default DsrPage;
