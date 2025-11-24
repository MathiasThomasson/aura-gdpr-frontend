import React from 'react';
import HealthStatus from '@/components/HealthStatus';

const DashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of the application health and quick insights.</p>
        </div>
        <HealthStatus />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card p-4 rounded shadow">Placeholder card 1</div>
        <div className="bg-card p-4 rounded shadow">Placeholder card 2</div>
      </div>
    </div>
  );
};

export default DashboardPage;
