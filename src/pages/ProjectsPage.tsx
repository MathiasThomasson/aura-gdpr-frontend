import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const ProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <PageHeader
          title="Projects"
          description="Manage GDPR projects and processing initiatives."
          actions={
            <Button size="sm" className="bg-gradient-to-r from-sky-500 to-purple-600 text-white">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          }
        />
        <p className="mt-2 text-sm text-slate-600">
          Use this page to track processing activities, owners, milestones, and risks associated with each GDPR project.
        </p>
      </div>

      <Card className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <CardHeader className="px-0 pt-0">
          <CardTitle>Projects</CardTitle>
          <CardDescription>Project list and wizard will be added next.</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <EmptyState
            title="No projects yet"
            description="Start by creating your first GDPR project to track processing workstreams."
            actionLabel="New Project"
            onAction={() => {}}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectsPage;
