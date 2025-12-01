import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Mail, Rocket, Settings, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/apiClient';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useUserProgress } from '@/contexts/UserProgressContext';
import { useSystemStatus } from '@/contexts/SystemContext';
import useAnalyticsEvent from '@/hooks/useAnalyticsEvent';

type Invite = {
  email: string;
  role: string;
};

const stepTitle = (index: number, title: string) => `Step ${index + 1}: ${title}`;

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const analytics = useAnalyticsEvent();
  const { toast } = useToast();
  const { state, loading, completeOnboarding } = useOnboarding();
  const { progress, markComplete } = useUserProgress();
  const { demoMode } = useSystemStatus();
  const errorMessage = (err: unknown) => (err instanceof Error ? err.message : 'Please try again.');

  const [organizationName, setOrganizationName] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('');
  const [invite, setInvite] = React.useState<Invite>({ email: '', role: 'Admin' });
  const [dsrContact, setDsrContact] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [busyStep, setBusyStep] = React.useState<string | null>(null);
  const [policyStatus, setPolicyStatus] = React.useState<'idle' | 'loading' | 'done'>('idle');
  const [invitesSent, setInvitesSent] = React.useState(false);
  const [dsrContactSaved, setDsrContactSaved] = React.useState(false);

  React.useEffect(() => {
    const completionStatus = [
      progress.organizationDetails,
      invitesSent,
      dsrContactSaved,
      progress.policyGenerated,
      state.completed,
    ];
    const nextIndex = completionStatus.findIndex((step) => !step);
    setActiveStep(nextIndex === -1 ? completionStatus.length - 1 : nextIndex);
  }, [progress, invitesSent, dsrContactSaved, state.completed]);

  React.useEffect(() => {
    if (state.completed) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [navigate, state.completed]);

  const handleSaveOrganization = async () => {
    setBusyStep('organization');
    try {
      await api.post('/api/organization', { name: organizationName, contact_email: contactEmail });
      await markComplete('organizationDetails');
      toast({
        title: 'Organization saved',
        description: 'Organization details recorded for onboarding.',
      });
      setActiveStep(1);
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Unable to save organization',
        description: errorMessage(err),
      });
    } finally {
      setBusyStep(null);
    }
  };

  const handleInvite = async () => {
    setBusyStep('invite');
    try {
      await api.post('/api/iam/invite', invite);
      toast({
        title: 'Invite sent',
        description: `${invite.email} invited as ${invite.role}.`,
      });
      setInvite({ email: '', role: 'Admin' });
      setInvitesSent(true);
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Unable to send invite',
        description: errorMessage(err),
      });
    } finally {
      setBusyStep(null);
    }
  };

  const handleDsrContact = async () => {
    setBusyStep('dsr');
    try {
      await api.post('/api/dsr/contact', { email: dsrContact });
      toast({
        title: 'DSR contact saved',
        description: 'Primary DSR contact configured.',
      });
      setActiveStep(3);
      setDsrContactSaved(true);
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Unable to save DSR contact',
        description: errorMessage(err),
      });
    } finally {
      setBusyStep(null);
    }
  };

  const handleGeneratePolicies = async () => {
    setPolicyStatus('loading');
    try {
      await api.post('/api/policies/ai-generate', { quickstart: true });
      await markComplete('policyGenerated');
      analytics('policy_ai_generated');
      toast({
        title: 'AI policy draft ready',
        description: 'Your first set of policies has been generated.',
      });
      setPolicyStatus('done');
      setActiveStep(4);
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Policy generation failed',
        description: errorMessage(err),
      });
      setPolicyStatus('idle');
    }
  };

  const handleFinish = async () => {
    setBusyStep('finish');
    try {
      await completeOnboarding();
      analytics('onboarding_completed');
      toast({
        title: 'Onboarding completed',
        description: 'You are ready to use AURA-GDPR.',
      });
      navigate('/app/dashboard', { replace: true });
    } catch (err: unknown) {
      toast({
        variant: 'destructive',
        title: 'Unable to complete onboarding',
        description: errorMessage(err),
      });
    } finally {
      setBusyStep(null);
    }
  };

  const disabledMessage = demoMode ? 'Demo mode is read-only' : undefined;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-700">
        Loading onboarding...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <div className="mb-8">
          <Badge className="mb-3 bg-sky-100 text-sky-700">Onboarding</Badge>
          <h1 className="text-3xl font-bold text-slate-900">Set up your organization</h1>
          <p className="mt-2 text-slate-600">
            Complete the guided steps to start using AURA-GDPR. You can revisit and edit any step later.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[260px,1fr]">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="text-base text-slate-700">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['Organization details', 'Invite team', 'Configure DSR contact', 'AI policies', 'All set'].map(
                (label, index) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${
                      index === activeStep ? 'border-sky-300 bg-sky-50' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        index <= activeStep ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="text-sm font-semibold text-slate-800">{label}</div>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{stepTitle(0, 'Organization details')}</CardTitle>
                <p className="text-sm text-slate-600">
                  Tell us who you are so we can personalize your workspace.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization name</Label>
                  <Input
                    id="org-name"
                    placeholder="Acme Privacy Ltd."
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    disabled={demoMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Contact email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="privacy@acme.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    disabled={demoMode}
                  />
                </div>
                <Button
                  onClick={handleSaveOrganization}
                  disabled={demoMode || busyStep === 'organization' || loading}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Save details
                </Button>
                {disabledMessage && <p className="text-xs text-amber-600">{disabledMessage}</p>}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{stepTitle(1, 'Invite team')}</CardTitle>
                <p className="text-sm text-slate-600">
                  Invite teammates with the right roles so you can collaborate.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
                  <div className="space-y-2">
                    <Label htmlFor="invite-email">Email</Label>
                    <Input
                      id="invite-email"
                      type="email"
                      placeholder="teammate@company.com"
                      value={invite.email}
                      onChange={(e) => setInvite((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={demoMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-role">Role</Label>
                    <Input
                      id="invite-role"
                      placeholder="Admin"
                      value={invite.role}
                      onChange={(e) => setInvite((prev) => ({ ...prev, role: e.target.value }))}
                      disabled={demoMode}
                    />
                  </div>
                </div>
                <Button onClick={handleInvite} disabled={demoMode || busyStep === 'invite'}>
                  <Users className="mr-2 h-4 w-4" />
                  Send invite
                </Button>
                <p className="text-xs text-slate-500">You can add more teammates later in IAM settings.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{stepTitle(2, 'Configure DSR contact')}</CardTitle>
                <p className="text-sm text-slate-600">
                  Set the contact that will receive new DSR submissions.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dsr-contact">Primary DSR contact email</Label>
                  <Input
                    id="dsr-contact"
                    type="email"
                    placeholder="dsr@company.com"
                    value={dsrContact}
                    onChange={(e) => setDsrContact(e.target.value)}
                    disabled={demoMode}
                  />
                </div>
                <Button onClick={handleDsrContact} disabled={demoMode || busyStep === 'dsr'}>
                  <Mail className="mr-2 h-4 w-4" />
                  Save DSR contact
                </Button>
                <p className="text-xs text-slate-500">
                  We will route new requests to this inbox and notify your team.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{stepTitle(3, 'Generate your first policies with AI')}</CardTitle>
                <p className="text-sm text-slate-600">
                  Kickstart your workspace with AI-drafted policies you can refine.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  AI will draft a baseline set of security and privacy policies tailored to your industry.
                </div>
                <Button
                  onClick={handleGeneratePolicies}
                  disabled={demoMode || policyStatus === 'loading'}
                >
                  <Rocket className="mr-2 h-4 w-4" />
                  {policyStatus === 'done' ? 'Regenerate policies' : 'Generate with AI'}
                </Button>
                {policyStatus === 'done' && (
                  <div className="flex items-center gap-2 text-sm text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Policies generated
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-sky-200 bg-sky-50">
              <CardHeader className="space-y-1">
                <CardTitle className="text-lg">{stepTitle(4, 'All set')}</CardTitle>
                <p className="text-sm text-slate-600">
                  Wrap up onboarding and go to your dashboard.
                </p>
              </CardHeader>
              <CardContent className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3 text-slate-800">
                  <Settings className="h-5 w-5 text-sky-600" />
                  <span>Mark onboarding as complete</span>
                </div>
                <Button onClick={handleFinish} disabled={busyStep === 'finish'}>
                  Go to dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
