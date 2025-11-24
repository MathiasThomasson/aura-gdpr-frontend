import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 bg-card/80 dark:bg-slate-900/80 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4">Sign in to AURA-GDPR</h1>
        <form className="space-y-4">
          <div>
            <label className="text-sm">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="w-full mt-2">Sign in</Button>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Need an account? <Link to="/register" className="text-sky-500">Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
