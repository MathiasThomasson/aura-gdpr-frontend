import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, AlertOctagon, ShieldCheck, FileSearch } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

type User = { role?: string; name?: string; avatarUrl?: string };

const AIAssistantPage: React.FC = () => {
  const { user } = useAuth() as { user?: User };
  const isProUser = user?.role === 'Pro' || user?.role === 'Admin';

  if (!isProUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-full text-center p-8"
      >
        <Zap className="h-24 w-24 text-yellow-400 mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-3">Unlock AI Compliance Assistant</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Upgrade to Pro to access automated document analysis, risk flagging, and GDPR insights powered by our
          isolated AI.
        </p>
        <Button
          size="lg"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-lg px-8 py-3"
          asChild
        >
          <Link to="/app/billing">Upgrade to Pro</Link>
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          Your privacy is paramount. Our AI operates in an isolated environment.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Compliance Assistant</h1>
        <p className="text-md text-muted-foreground">Leverage AI to analyze documents and identify GDPR compliance gaps.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileSearch className="mr-2 h-6 w-6 text-sky-500" />
              Analyze Document
            </CardTitle>
            <CardDescription>Select a document to begin AI analysis. Ensure it&apos;s a PDF.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Select a document from your library:</p>
              <select className="w-full p-2 border rounded-md bg-input text-foreground border-border focus:ring-primary focus:border-primary">
                <option>Privacy Policy v2.1.pdf</option>
                <option>Data Processing Agreement - VendorX.pdf</option>
              </select>
            </div>
            <Button className="w-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white">
              <Zap className="mr-2 h-4 w-4" /> Analyze with AI
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              <ShieldCheck className="inline h-3 w-3 mr-1 text-green-500" />
              AI analysis is performed in an isolated environment. Your data remains secure.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }} className="mt-8">
        <h2 className="text-2xl font-semibold text-foreground mb-4">Analysis Results</h2>
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-40">
              <AlertOctagon className="h-12 w-12 mb-2" />
              <p>No analysis performed yet. Select a document and click &quot;Analyze with AI&quot;.</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AIAssistantPage;
