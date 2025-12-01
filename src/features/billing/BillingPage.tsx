import React from 'react';
import PageInfoBox from '@/components/PageInfoBox';
import CurrentPlanCard from './components/CurrentPlanCard';
import UsageSummary from './components/UsageSummary';
import BillingHistoryTable from './components/BillingHistoryTable';
import useBillingMockData from './hooks/useBillingMockData';

const BillingPage: React.FC = () => {
  const { currentPlan, usage, history, isLoading, isError } = useBillingMockData();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Billing & subscription</h1>
        <p className="text-sm text-slate-600">Manage your plan, usage, and invoices.</p>
      </div>

      <PageInfoBox
        title="Billing overview"
        description="Review your current plan, usage, and invoice history. PayPal/checkout integration will be added later."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <CurrentPlanCard plan={currentPlan} />
        <UsageSummary usage={usage} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Billing history</h2>
        <p className="text-sm text-slate-600">Invoices and payment status.</p>
        <div className="mt-3">
          {isLoading && <p className="text-sm text-muted-foreground">Loading billing history...</p>}
          {isError && <p className="text-sm text-red-600">Failed to load billing history.</p>}
          {!isLoading && !isError && <BillingHistoryTable history={history} />}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
