import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Processing activities and GDPR projects."
        actions={
          <Button size="sm" className="bg-gradient-to-r from-sky-500 to-purple-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming soon</CardTitle>
          <CardDescription>Project list and wizard will be added next.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          This placeholder keeps routing intact while we build the projects module.
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage;
