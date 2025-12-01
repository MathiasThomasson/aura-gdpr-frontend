import React from 'react';
import { BillingHistoryItem } from '../types';

type Props = {
  history: BillingHistoryItem[];
};

const statusStyles: Record<BillingHistoryItem['status'], string> = {
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  failed: 'bg-rose-50 text-rose-700 border-rose-200',
};

const formatDate = (value: string) => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(amount);

const BillingHistoryTable: React.FC<Props> = ({ history }) => {
  if (history.length === 0) {
    return <p className="text-sm text-muted-foreground">No invoices found yet.</p>;
  }

  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-slate-500">
            <th className="py-3 pr-4 font-semibold">Date</th>
            <th className="py-3 pr-4 font-semibold">Description</th>
            <th className="py-3 pr-4 font-semibold">Amount</th>
            <th className="py-3 pr-4 font-semibold">Status</th>
            <th className="py-3 pr-4 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr key={item.id} className="border-b last:border-0">
              <td className="py-3 pr-4 text-foreground">{formatDate(item.date)}</td>
              <td className="py-3 pr-4 text-foreground">{item.description}</td>
              <td className="py-3 pr-4 text-foreground">{formatAmount(item.amount, item.currency)}</td>
              <td className="py-3 pr-4">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                    statusStyles[item.status]
                  }`}
                >
                  {item.status}
                </span>
              </td>
              <td className="py-3 pr-4">
                {item.invoiceUrl ? (
                  <a
                    href={item.invoiceUrl}
                    className="text-sky-600 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download invoice
                  </a>
                ) : (
                  <span className="text-slate-400">Not available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillingHistoryTable;
