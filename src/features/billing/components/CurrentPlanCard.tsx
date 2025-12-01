import React from 'react';
import { TenantPlan } from '../types';
import { Button } from '@/components/ui/button';
import { openBillingPortal } from '../portal';

type Props = {
  plan: TenantPlan;
};

const formatPrice = (price: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(price);

const CurrentPlanCard: React.FC<Props> = ({ plan }) => {
  const handleUpgrade = () => {
    alert('Plan changes will be managed in a future update.');
  };

  const handleDowngrade = () => {
    alert('Plan changes will be managed in a future update.');
  };

  const handleManageBilling = () => {
    openBillingPortal();
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Current plan</p>
          <h2 className="text-xl font-semibold text-slate-900">{plan.name}</h2>
          <p className="text-sm text-slate-600">
            {plan.isTrial && plan.trialDaysLeft && plan.trialDaysLeft > 0
              ? `Free trial – ${plan.trialDaysLeft} days left`
              : `${formatPrice(plan.pricePerMonth, plan.currency)} / month`}
          </p>
        </div>
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">{plan.type}</span>
      </div>

      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={handleUpgrade}>Upgrade plan</Button>
        <Button variant="outline" onClick={handleDowngrade}>
          Downgrade or cancel
        </Button>
        <Button variant="ghost" onClick={handleManageBilling}>
          Manage billing
        </Button>
      </div>
    </div>
  );
};

export default CurrentPlanCard;
