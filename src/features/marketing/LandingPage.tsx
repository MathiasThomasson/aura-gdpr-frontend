import React from 'react';
import {
  Check,
  ClipboardList,
  CloudCog,
  FileText,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Video,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const container = 'mx-auto w-full max-w-6xl px-4 sm:px-6';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white py-16 sm:py-24">
      <div className={container + ' grid gap-12 lg:grid-cols-2 lg:items-center'}>
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
            <Sparkles className="h-4 w-4" />
            AI-driven GDPR platform
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">AI-driven GDPR platform</h1>
            <p className="text-lg text-slate-600">
              AURA-GDPR centralizes DSRs, ROPA, DPIA, incidents, and policies with AI assistance so you can stay compliant
              without slowing down.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/register">
              <Button size="lg" className="px-6">
                Start free trial
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="px-6">
                Book a demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-500">No credit card required. SOC2-ready infrastructure.</p>
          <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 sm:max-w-lg sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-white p-3">
              <p className="font-semibold text-slate-900">AI audit-ready</p>
              <p className="text-slate-500">Recommendations and evidence.</p>
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
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900">AI audit overview</p>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Live</span>
              </div>
              <p className="text-sm text-slate-600">
                AURA scans DPIAs, ROPA, incidents, and policies to surface gaps before auditors and regulators do.
              </p>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>DPIA coverage</span>
                  <span className="font-semibold text-slate-900">92%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200">
                  <div className="h-2 w-[92%] rounded-full bg-sky-500" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Open tasks</span>
                  <span className="font-semibold text-slate-900">14</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>DSR SLA at risk</span>
                  <span className="font-semibold text-amber-600">2</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-700">
                  <span>Incidents under investigation</span>
                  <span className="font-semibold text-rose-600">3</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <Video className="h-5 w-5 text-sky-600" />
            <span>Demo video placeholder — coming soon.</span>
          </div>
        </div>
      </div>
    </section>
  );
};

const SocialProof: React.FC = () => {
  const logos = ['Acme Health', 'Nimbus Cloud', 'Northwind', 'Atlas Bank', 'Evergreen', 'Orbit Retail'];
  return (
    <section className="bg-white py-10">
      <div className={container + ' space-y-6'}>
        <p className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500">Trusted by modern teams</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
      title: 'Data Subject Requests',
      icon: ClipboardList,
      description: 'Standardized workflows with SLA tracking and auditable responses.',
    },
    {
      title: 'ROPA & DPIA',
      icon: FileText,
      description: 'Templates, ownership, and risk scoring for complete accountability.',
    },
    {
      title: 'AI Policy Generator',
      icon: Sparkles,
      description: 'Draft and update policies automatically with AI assistance.',
    },
    {
      title: 'Incident Management',
      icon: Lock,
      description: 'Log, investigate, and communicate breaches with clear timelines.',
    },
    {
      title: 'Audit Engine',
      icon: ShieldCheck,
      description: 'Continuous checks with evidence to keep auditors satisfied.',
    },
    {
      title: 'Multi-tenant & MSP-ready',
      icon: CloudCog,
      description: 'Isolated tenants with centralized control for managed service providers.',
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20" id="features">
      <div className={container}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Platform</p>
            <h2 className="text-3xl font-bold text-slate-900">Everything you need for GDPR</h2>
            <p className="mt-2 max-w-2xl text-slate-600">
              AURA-GDPR centralizes evidence, workflows, and AI so you can move faster than auditors.
            </p>
          </div>
          <Link to="/contact">
            <Button variant="outline" size="sm">
              Talk to our team
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-sky-700">
                <Check className="h-4 w-4" />
                <span>AI-assisted</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      title: 'Connect your organization',
      description: 'Invite your team, set up workspaces, and import existing records or evidence.',
    },
    {
      title: 'Import or generate documentation',
      description: 'Generate DPIAs, ROPA, policies, and incident timelines with AI templates.',
    },
    {
      title: 'Monitor and fix risks with AI',
      description: 'Continuous checks with alerts for deadlines, gaps, and incidents.',
    },
  ];
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <div className={container + ' space-y-10'}>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">How it works</p>
          <h2 className="text-3xl font-bold text-slate-900">Stand up a GDPR program in days, not months</h2>
          <p className="mt-2 max-w-2xl text-slate-600">
            Configure once, collaborate with your teams, and keep everything in sync across auditors and regulators.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-600 text-sm font-semibold text-white">
                {index + 1}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{step.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PricingPreview: React.FC = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      description: 'Start with the basics and grow at your pace.',
      features: ['1 workspace', 'DSR inbox', 'Basic templates'],
      cta: 'Get started',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$59',
      description: 'For privacy teams that need automation and AI.',
      features: ['Unlimited workspaces', 'AI policy drafts', 'Incident workflow', 'ROPA & DPIA builder'],
      cta: 'Start free trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Talk to us',
      description: 'For multi-tenant deployments and enterprise support.',
      features: ['MSP-ready', 'Dedicated CSM', 'Custom AI models', 'Private cloud'],
      cta: 'Contact sales',
      popular: false,
    },
  ];

  return (
    <section className="bg-white py-16 sm:py-20" id="pricing">
      <div className={container + ' space-y-10'}>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Pricing</p>
            <h2 className="text-3xl font-bold text-slate-900">Pick a plan that matches your GDPR maturity</h2>
            <p className="mt-2 text-slate-600">Transparent pricing for teams of all sizes.</p>
          </div>
          <Link to="/contact">
            <Button size="sm" variant="outline">
              Contact sales
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${
                plan.popular ? 'ring-2 ring-sky-500 ring-offset-2' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                {plan.popular && (
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Popular</span>
                )}
              </div>
              <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
              <p className="mt-4 text-3xl font-bold text-slate-900">{plan.price}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-sky-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.name === 'Enterprise' ? '/contact' : '/register'} className="mt-auto">
                <Button className="mt-4 w-full" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FaqSection: React.FC = () => {
  const faqs = [
    { question: 'How long does it take to get started?', answer: 'Most teams launch within one week using our templates.' },
    { question: 'Do you offer multi-tenant deployments?', answer: 'Yes, AURA-GDPR is MSP-ready with tenant isolation.' },
    { question: 'Is there an API?', answer: 'Yes, the platform exposes APIs for incidents, tasks, and evidence ingestion.' },
    { question: 'Can I import existing records?', answer: 'Yes, import CSV, JSON, or connect via API.' },
    { question: 'Do you support SOC2 or ISO27001?', answer: 'Yes, we provide evidence mapping and audit support.' },
    { question: 'Where is data hosted?', answer: 'Deploy in EU regions or your own cloud with private tenancy.' },
    { question: 'Can I try before buying?', answer: 'Yes, start a free trial with AI features enabled.' },
    { question: 'Do you help with DPIAs?', answer: 'Yes, we provide templates and AI drafting to speed up DPIAs.' },
  ];

  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  return (
    <section className="bg-slate-50 py-16 sm:py-20" id="faq">
      <div className={container + ' space-y-8'}>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">FAQ</p>
          <h2 className="text-3xl font-bold text-slate-900">Common questions</h2>
          <p className="max-w-2xl text-slate-600">
            Everything you need to know about AURA-GDPR pricing, deployment, and features.
          </p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
              >
                <button
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                >
                  <span className="text-base font-semibold text-slate-900">{faq.question}</span>
                  <span className="text-slate-500">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && <p className="mt-3 text-sm text-slate-600">{faq.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const ContactCta: React.FC = () => {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className={container}>
        <div className="flex flex-col items-start gap-6 rounded-2xl border border-slate-200 bg-gradient-to-r from-sky-50 to-indigo-50 p-8 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-sky-700">Get started</p>
            <h3 className="text-2xl font-bold text-slate-900">Ready to get compliant?</h3>
            <p className="mt-2 max-w-xl text-slate-600">
              Talk with our team to see how AURA-GDPR fits your compliance program and AI roadmap.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/contact">
              <Button size="lg" className="px-6">
                Contact us
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="px-6">
                Start free trial
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white py-12">
      <div className={container + ' space-y-6'}>
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-600 text-lg font-bold text-white">
              AG
            </div>
            <span className="text-xl font-semibold text-slate-900">AURA-GDPR</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <Link to="/blog" className="hover:text-slate-900">
              Blog
            </Link>
            <Link to="/contact" className="hover:text-slate-900">
              Contact
            </Link>
            <Link to="/login" className="hover:text-slate-900">
              Sign in
            </Link>
          </div>
        </div>
        <div className="grid gap-4 text-sm text-slate-600 sm:grid-cols-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-sky-600" />
            <span>hello@aura-gdpr.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-sky-600" />
            <span>+1 (555) 123-4567</span>
          </div>
          <div className="text-slate-500 sm:text-right">© {currentYear} AURA-GDPR. All rights reserved.</div>
        </div>
      </div>
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
            <Link to="/login" className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm">Start free trial</Button>
            </Link>
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
        <ContactCta />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
