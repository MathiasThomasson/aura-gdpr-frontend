
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { CheckCircle, AlertTriangle, XCircle, FilePlus, BarChart3, ListChecks } from 'lucide-react';
    import { useAuth } from '@/contexts/AuthContext';
    import { motion } from 'framer-motion';

    const StatCard = ({ title, value, icon, color, description }) => (
      <motion.div
        whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
        className="flex-1 min-w-[280px]"
      >
        <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            {React.cloneElement(icon, { className: `h-5 w-5 ${color}` })}
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${color}`}>{value}</div>
            <p className="text-xs text-muted-foreground pt-1">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    );

    const DashboardPage = () => {
      const { user } = useAuth();

      const complianceData = [
        { title: 'Compliant Documents', value: '12', icon: <CheckCircle />, color: 'text-green-500', description: '+2 from last week' },
        { title: 'Needs Attention', value: '3', icon: <AlertTriangle />, color: 'text-yellow-500', description: 'Review required' },
        { title: 'High Risk', value: '1', icon: <XCircle />, color: 'text-red-500', description: 'Urgent action needed' },
      ];
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      };

      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      return (
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-lg text-muted-foreground">Here's your AURA GDPR compliance overview.</p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {complianceData.map((item, index) => (
              <motion.div key={index} variants={itemVariants} className="flex-grow">
                 <StatCard {...item} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><ListChecks className="mr-2 h-6 w-6 text-sky-500"/>GDPR Checklist</CardTitle>
                  <CardDescription>Track your progress on key GDPR requirements.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Data Processing Agreement', 'Privacy Policy Review', 'Consent Management', 'Data Breach Protocol'].map(item => (
                    <div key={item} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <span className="text-sm font-medium">{item}</span>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  ))}
                  <Button className="w-full mt-2 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white">View Full Checklist</Button>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl"><BarChart3 className="mr-2 h-6 w-6 text-purple-500"/>Recent Activity</CardTitle>
                  <CardDescription>Overview of recent document uploads and analyses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Privacy Policy uploaded', 'Terms of Service analyzed', 'DPA template reviewed'].map(item => (
                     <div key={item} className="flex items-center justify-between p-3 bg-slate-100 dark:bg-slate-800 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                      <span className="text-sm">{item}</span>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2 border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white">
                    <FilePlus className="mr-2 h-4 w-4" /> Upload New Document
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      );
    };

    export default DashboardPage;
  