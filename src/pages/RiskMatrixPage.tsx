import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import RiskHeatmap from '@/components/riskMatrix/RiskHeatmap';
import RiskListDrawer from '@/components/riskMatrix/RiskListDrawer';
import useRiskMatrix, { RiskItem } from '@/hooks/useRiskMatrix';
import { RefreshCcw } from 'lucide-react';

const RiskMatrixPage: React.FC = () => {
  const { data, grouped, loading, error, reload } = useRiskMatrix();
  const [activeRisk, setActiveRisk] = useState<'low' | 'medium' | 'high' | null>(null);

  const handleSelect = (risk: 'low' | 'medium' | 'high') => {
    setActiveRisk(risk);
  };

  const listForActive: RiskItem[] = activeRisk ? grouped[activeRisk] : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Risk Matrix"
        description="Aggregate risks across DPIAs, Incidents, and Projects."
        actions={
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        }
      />

      {error && (
        <Card>
          <CardContent className="p-4 text-sm text-destructive flex items-center justify-between">
            <span>Failed to load risks: {error}</span>
            <Button size="sm" variant="outline" onClick={reload}>Retry</Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <Card>
          <CardContent className="p-4">
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : data.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground text-center">
            No risks found yet.
          </CardContent>
        </Card>
      ) : (
        <RiskHeatmap grouped={grouped} onSelect={handleSelect} />
      )}

      <RiskListDrawer
        open={!!activeRisk}
        riskLevel={activeRisk}
        items={listForActive}
        onClose={() => setActiveRisk(null)}
      />
    </div>
  );
};

export default RiskMatrixPage;
