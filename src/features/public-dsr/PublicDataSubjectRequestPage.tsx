import React from 'react';
import { useParams } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import PublicDsrForm from './components/PublicDsrForm';

type RouteParams = {
  tenantSlug?: string;
};

const PublicDataSubjectRequestPage: React.FC = () => {
  const { tenantSlug } = useParams<RouteParams>();
  const [submitted, setSubmitted] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 px-4 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        <div className="flex items-center gap-3 text-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-white shadow-sm">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">AURA-GDPR</p>
            <h1 className="text-xl font-semibold text-slate-900">Submit a data subject request</h1>
          </div>
        </div>

        <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
          {!submitted ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-slate-900">Tell us about your request</h2>
                <p className="text-sm text-slate-600">
                  Use this form to submit a GDPR data subject request to the organization. Your request will be handled
                  by the data protection team.
                </p>
              </div>
              <PublicDsrForm tenantSlug={tenantSlug ?? ''} onSuccess={() => setSubmitted(true)} />
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Shield className="h-7 w-7" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Your request has been submitted</h2>
              <p className="text-sm text-slate-600">
                We have received your data subject request. You will be contacted via email as soon as your request has
                been processed.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Submit another request
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-slate-500">
          This form is provided by AURA-GDPR. Please avoid sharing sensitive information beyond what is necessary.
        </p>
      </div>
    </div>
  );
};

export default PublicDataSubjectRequestPage;
