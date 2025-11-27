import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import PolicyGeneratorForm from '@/components/policies/PolicyGeneratorForm';
import PolicyPreview from '@/components/policies/PolicyPreview';
import usePolicyGenerator, { PolicyFormInput } from '@/hooks/usePolicyGenerator';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const PoliciesPage: React.FC = () => {
  const { result, loading, error, generatePolicy, regenerate, exportPdf, hasResult } = usePolicyGenerator();
  const [text, setText] = useState('');

  useEffect(() => {
    setText(result);
  }, [result]);

  const handleGenerate = (input: PolicyFormInput) => {
    generatePolicy(input);
  };

  const handleRegenerate = () => {
    regenerate();
  };

  const handleExport = () => {
    exportPdf();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Policy Generator"
        description="Generate GDPR policies using AI and export them as PDF."
      />

      <div className="grid lg:grid-cols-2 gap-4">
        <PolicyGeneratorForm onGenerate={handleGenerate} loading={loading} />

        {loading && !hasResult ? (
          <Card>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        ) : (
          <PolicyPreview
            value={text}
            onChange={setText}
            onRegenerate={handleRegenerate}
            onExport={handleExport}
            loading={loading}
            error={error}
          />
        )}
      </div>
    </div>
  );
};

export default PoliciesPage;
