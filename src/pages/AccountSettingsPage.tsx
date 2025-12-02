import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { UserCircle, Lock, Edit3, Trash2, DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

type User = { name?: string; email?: string; avatarUrl?: string };

const AccountSettingsPage: React.FC = () => {
  const { user, logout } = useAuth() as { user?: User; logout: () => void };
  const { toast } = useToast();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleProfileUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({ title: 'Profile Updated', description: 'Your profile information has been saved.' });
  };

  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast({ variant: 'destructive', title: 'Error', description: 'New passwords do not match.' });
      return;
    }
    toast({ title: 'Password Changed', description: 'Your password has been updated successfully.' });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleExportData = () => {
    toast({ title: 'Data Export Requested', description: 'Your data export will be prepared and sent to your email.' });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast({
        variant: 'destructive',
        title: 'Account Deletion Initiated',
        description: 'Your account deletion process has started.',
      });
      logout();
    }
  };

  const getInitials = (nameStr?: string) => {
    if (!nameStr) return 'AU';
    const names = nameStr.split(' ');
    if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
    return `${names[0][0].toUpperCase()}${names[names.length - 1][0].toUpperCase()}`;
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Account Settings</h1>
        <p className="text-md text-muted-foreground">Manage your profile, password, and data preferences.</p>
      </motion.div>
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-900">Settings guidance</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
          <li>Tenant settings control workspace name, locale, and branding.</li>
          <li>User management adds or removes teammates and assigns roles.</li>
          <li>Subscription and billing (upcoming) will manage plan and invoices.</li>
          <li>API keys let you integrate AURA GDPR with other systems.</li>
        </ul>
      </div>
      <div className="flex items-center gap-2">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : 'text-muted-foreground'}`
          }
        >
          Profile
        </NavLink>
        <NavLink
          to="/app/settings/notifications"
          className={({ isActive }) =>
            `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-slate-200 dark:bg-slate-700 font-semibold' : 'text-muted-foreground'}`
          }
        >
          Notifications
        </NavLink>
      </div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <UserCircle className="mr-2 h-6 w-6 text-sky-500" />
              Profile Information
            </CardTitle>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20 border-4 border-primary/30">
                  <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-sky-400 to-purple-500 text-white font-semibold">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white">
                  <Edit3 className="mr-2 h-4 w-4" /> Change Avatar
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-input" />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white"
              >
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Lock className="mr-2 h-6 w-6 text-sky-500" />
              Change Password
            </CardTitle>
            <CardDescription>Update your account password for better security.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-input"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password">Confirm New Password</Label>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="bg-input"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white"
              >
                Change Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <DownloadCloud className="mr-2 h-6 w-6 text-sky-500" />
              Data Management
            </CardTitle>
            <CardDescription>Manage your personal data stored with AURA GDPR.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              You have the right to access and export your personal data. You can also request account deletion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleExportData}
                variant="outline"
                className="flex-1 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white"
              >
                <DownloadCloud className="mr-2 h-4 w-4" /> Export My Data
              </Button>
              <Button onClick={handleDeleteAccount} variant="destructive" className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" /> Delete My Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccountSettingsPage;
