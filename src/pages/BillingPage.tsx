import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

type Plan = {
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
};

type User = { role?: string };

type PlanCardProps = Plan & {
  currentPlan: boolean;
  onChoosePlan: () => void;
};

const PlanCard: React.FC<PlanCardProps> = ({ name, price, features, popular, currentPlan, onChoosePlan }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: '0px 10px 20px rgba(0,0,0,0.1)' }}
    className={`relative border-2 rounded-xl p-6 shadow-lg transition-all duration-300 ${
      currentPlan ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/30' : 'border-border bg-card dark:bg-slate-800/70 hover:border-sky-400'
    }`}
  >
    {popular && !currentPlan && (
      <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-1 text-sm font-semibold rounded-full shadow-md">
          Popular
        </span>
      </div>
    )}
    <CardHeader className="p-0 mb-6 text-center">
      <CardTitle className="text-2xl font-bold text-foreground">{name}</CardTitle>
      <CardDescription className="text-4xl font-extrabold text-sky-500 my-3">
        {price}
        <span className="text-sm font-normal text-muted-foreground">/month</span>
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0 mb-6 space-y-3">
      {features.map((feature) => (
        <div key={feature} className="flex items-start">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
          <span className="text-sm text-muted-foreground">{feature}</span>
        </div>
      ))}
    </CardContent>
    <CardFooter className="p-0">
      <Button
        className={`w-full text-lg py-3 ${
          currentPlan ? 'bg-muted text-muted-foreground cursor-default' : 'bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white'
        }`}
        onClick={onChoosePlan}
        disabled={currentPlan}
      >
        {currentPlan ? 'Current Plan' : 'Choose Plan'}
      </Button>
    </CardFooter>
  </motion.div>
);

const BillingPage: React.FC = () => {
  const { user } = useAuth() as { user?: User };
  const currentUserPlan = user?.role === 'Pro' ? 'Pro' : 'Free';

  const plans: Plan[] = [
    {
      name: 'Free',
      price: '$0',
      features: ['Up to 5 document uploads', 'Basic compliance checklist', 'Manual status tracking', 'Community support'],
    },
    {
      name: 'Pro',
      price: '$29',
      features: [
        'Unlimited document uploads',
        'AI Compliance Assistant',
        'Automated risk flagging',
        'Downloadable PDF reports',
        'Priority email support',
        'Access to all future Pro features',
      ],
      popular: true,
    },
  ];

  const handleChoosePlan = (planName: string) => {
    // Placeholder for payment integration
    // eslint-disable-next-line no-alert
    alert(`You selected the ${planName} plan. Payment integration (e.g., Stripe) would be initiated here.`);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Billing & Plans</h1>
        <p className="text-md text-muted-foreground">Manage your subscription and explore AURA GDPR plans.</p>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, staggerChildren: 0.1 }}
      >
        {plans.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            currentPlan={currentUserPlan === plan.name}
            onChoosePlan={() => handleChoosePlan(plan.name)}
          />
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ShieldCheck className="mr-2 h-6 w-6 text-green-500" />
              Billing History & Security
            </CardTitle>
            <CardDescription>Your payment information is processed securely. View your past invoices here.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No billing history yet. Your invoices will appear here once you subscribe to a Pro plan.
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              We partner with Stripe for secure payment processing. Your financial data is never stored on our servers.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default BillingPage;
