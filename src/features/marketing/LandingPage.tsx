import React from 'react';
import { Check, ClipboardList, CloudCog, FileText, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const container = 'mx-auto w-full max-w-6xl px-4 sm:px-6';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16 sm:py-24">
      <div className={container + ' grid gap-12 lg:grid-cols-2 lg:items-center'}>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <Sparkles className="h-4 w-4" />
            Purpose-built for privacy teams
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              AI-powered GDPR compliance for modern organizations
            </h1>
            <p className="text-lg text-slate-600">
              AURA-GDPR helps you manage data subject requests, DPIAs, ROPA, incidents and policies in one place – powered
              by AI.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" className="px-6">
              Start free trial
            </Button>
            <Button size="lg" variant="outline" className="px-6">
              Talk to sales
            </Button>
          </div>
          <p className="text-sm text-slate-500">No installation. No credit card required for trial.</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 sm:max-w-lg sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">AI audit-ready</p>
              <p className="text-slate-500">Recommendations and checks.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">Fast onboarding</p>
              <p className="text-slate-500">Invite your team in minutes.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">Secure by design</p>
              <p className="text-slate-500">SSO, audit logs, encryption.</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -left-6 -top-6 h-16 w-16 rounded-full bg-sky-100 blur-2xl" aria-hidden />
          <div className="absolute -right-10 bottom-10 h-24 w-24 rounded-full bg-indigo-100 blur-3xl" aria-hidden />
          <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <div className="mb-4 flex items-center justify-between">
              <div className="h-2 w-8 rounded-full bg-sky-500" />
              <div className="flex gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="h-2 w-2 rounded-full bg-slate-300" />
                <span className="h-2 w-2 rounded-full bg-slate-300" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">Tasks</p>
                  <p className="text-lg font-bold text-slate-900">32</p>
                  <p className="text-xs text-slate-500">In progress</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">Incidents</p>
                  <p className="text-lg font-bold text-slate-900">3</p>
                  <p className="text-xs text-slate-500">Investigating</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-500">DPIAs</p>
                  <p className="text-lg font-bold text-slate-900">12</p>
                  <p className="text-xs text-slate-500">Draft</p>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-200 bg-gradient-to-r from-slate-50 to-sky-50 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-5 w-5 text-sky-600" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">AI audit summary</p>
                    <p className="text-sm text-slate-600">
                      “Your ROPA and TOMs are complete. 2 DPIAs need review. One incident requires stakeholder update.”
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-500">Upcoming deadlines</p>
                  <p className="text-sm text-slate-900">DSR response in 36h</p>
                  <p className="text-xs text-amber-600">Priority</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-500">Risk alerts</p>
                  <p className="text-sm text-slate-900">Vendor DPIA renewal pending</p>
                  <p className="text-xs text-slate-500">Low</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialProof: React.FC = () => {
  const logos = ['NordicBank', 'DataCloud', 'HealthSync', 'TrustWare', 'ComplyCo'];
  return (
    <section className="bg-white py-12">
      <div className={container + ' space-y-6'}>
        <p className="text-center text-sm font-semibold uppercase tracking-wide text-slate-500">
          Trusted by privacy-first teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {logos.map((logo) => (
            <div
              key={logo}
              className="flex h-10 min-w-[120px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-500"
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturesSection: React.FC = () => {
  const features = [
    {
      title: 'Data subject requests',
      icon: ClipboardList,
      description: 'Standardized workflows, SLA tracking, and auditable responses for every DSR.',
    },
    {
      title: 'DPIA & risk assessments',
      icon: ShieldCheck,
      description: 'Collaborative assessments with templates, risk scoring, and mitigation tracking.',
    },
    {
      title: 'Records of processing (ROPA)',
      icon: FileText,
      description: 'Keep processing activities up to date with ownership, systems, and purposes.',
    },
    {
      title: 'Incident management',
      icon: Lock,
      description: 'Log, investigate, and communicate breaches with timelines and status updates.',
    },
    {
      title: 'Technical measures (TOMs)',
      icon: CloudCog,
      description: 'Document and monitor controls like encryption, access, and vendor security.',
    },
    {
      title: 'AI audit engine',
      icon: Sparkles,
      description: 'AI-powered findings, policy drafts, and reminders to keep you compliant.',
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className={container + ' space-y-6'}>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Everything you need for GDPR compliance</h2>
          <p className="text-slate-600">Purpose-built modules that stay in sync with your team and regulators.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/60"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Connect your organization',
      description: 'Create your tenant, invite teammates, and set roles for data owners and reviewers.',
    },
    {
      title: 'Document your GDPR landscape',
      description: 'Add ROPA, DPIAs, incidents, TOMs, cookies, and policies with guided templates.',
    },
    {
      title: 'Let AI support your compliance',
      description: 'Use AI to draft policies, highlight gaps, and surface recommendations automatically.',
    },
    {
      title: 'Stay on top of deadlines',
      description: 'Tasks, notifications, and reminders keep responses on track and audit-ready.',
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className={container + ' space-y-6'}>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">How AURA-GDPR works</h2>
          <p className="text-slate-600">A guided flow from onboarding to continuous compliance.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex h-full flex-col rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
            >
              <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

type PricingPlan = {
  name: string;
  price: string;
  description: string;
  bullets: string[];
  highlighted?: boolean;
};

const PricingPreview: React.FC = () => {
  const plans: PricingPlan[] = [
    {
      name: 'Free',
      price: 'From €0/month',
      description: 'For small teams who want to explore the platform.',
      bullets: ['1 tenant', 'Core modules with limits', 'Community support'],
    },
    {
      name: 'Pro',
      price: 'From €249/month',
      description: 'For organizations that want full automation.',
      bullets: ['Full access to modules', 'AI audit and drafting tools', 'Unlimited users & tasks'],
      highlighted: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom pricing',
      description: 'For large or regulated organizations.',
      bullets: ['SSO & SCIM', 'Dedicated support team', 'Custom hosting and controls'],
    },
  ];

  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className={container + ' space-y-6'}>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Simple pricing for serious compliance</h2>
          <p className="text-slate-600">Pick a plan that fits your maturity. Upgrade anytime.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                plan.highlighted ? 'border-sky-500 shadow-sky-100 ring-2 ring-sky-200' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                {plan.highlighted && (
                  <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">Popular</span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
              <p className="mt-4 text-2xl font-bold text-slate-900">{plan.price}</p>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                {plan.bullets.map((bullet) => (
                  <div key={bullet} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-sky-600" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button className="w-full" variant={plan.highlighted ? 'default' : 'outline'}>
                  {plan.name === 'Free' ? 'Get started' : 'Contact sales'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqSection: React.FC = () => {
  const faqs = [
    {
      question: 'Do I need a lawyer to use AURA-GDPR?',
      answer: 'AURA-GDPR guides you with templates and AI assistance. You can also collaborate with your legal team.',
    },
    {
      question: 'Where is my data stored?',
      answer: 'Data is hosted in the EU with encryption in transit and at rest. Enterprise hosting options are available.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes. You can export records, tasks, and reports at any time for audits or backups.',
    },
    {
      question: 'Is AURA-GDPR suitable for small companies?',
      answer:
        'Absolutely. Start with the Free plan, then scale to Pro or Enterprise as your compliance program grows.',
    },
    {
      question: 'Does AURA-GDPR support deadlines and reminders?',
      answer: 'Tasks, notifications, and timelines keep you on schedule for DSRs, DPIAs, and incident reports.',
    },
    {
      question: 'How does the AI audit engine work?',
      answer: 'It reviews your inputs, highlights gaps, drafts policies, and recommends actions based on best practices.',
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className={container + ' space-y-6'}>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Frequently asked questions</h2>
          <p className="text-slate-600">Answers to common questions about AURA-GDPR.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-base font-semibold text-slate-900">{faq.question}</p>
              <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <div className={container + ' grid gap-8 sm:grid-cols-2 lg:grid-cols-4'}>
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white">AG</div>
            <p className="text-lg font-semibold text-slate-900">AURA-GDPR</p>
          </div>
          <p className="mt-3 text-sm text-slate-600">
            GDPR compliance platform to keep your organization aligned, secure, and audit-ready.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Features</li>
            <li>Pricing</li>
            <li>Security</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li><a href="#" className="hover:text-slate-900">Privacy policy</a></li>
            <li><a href="#" className="hover:text-slate-900">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-slate-500">© {currentYear} AURA-GDPR. All rights reserved.</div>
    </footer>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className={container + ' flex items-center justify-between py-4'}>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-lg font-bold text-white">
              AG
            </div>
            <span className="text-xl font-semibold text-slate-900">AURA-GDPR</span>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <a href="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Log in
            </a>
            <Button size="sm">Start free trial</Button>
          </div>
        </div>
      </header>

      <main>
        <HeroSection />
        <SocialProof />
        <FeaturesSection />
        <HowItWorks />
        <PricingPreview />
        <FaqSection />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
