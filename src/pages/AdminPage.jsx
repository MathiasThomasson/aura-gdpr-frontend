
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Users, ShieldAlert, FileText, Filter, Search } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/contexts/AuthContext';
    import { Navigate } from 'react-router-dom';

    const mockUsers = [
      { id: 'u1', name: 'Alice Wonderland', email: 'alice@example.com', plan: 'Pro', status: 'Active', docCount: 15, joinDate: '2025-01-15' },
      { id: 'u2', name: 'Bob The Builder', email: 'bob@example.com', plan: 'Free', status: 'Active', docCount: 3, joinDate: '2025-03-22' },
      { id: 'u3', name: 'Charlie Brown', email: 'charlie@example.com', plan: 'Pro', status: 'Inactive', docCount: 8, joinDate: '2024-11-05' },
      { id: 'u4', name: 'Diana Prince', email: 'diana@example.com', plan: 'Free', status: 'Active', docCount: 1, joinDate: '2025-05-10' },
    ];

    const AdminPage = () => {
      const { user } = useAuth();
      const [searchTerm, setSearchTerm] = React.useState('');
      const [users, setUsers] = React.useState(mockUsers);

      if (user?.role !== 'Admin') {
        return <Navigate to="/dashboard" replace />;
      }
      
      const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
      };
    
      const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
      };

      return (
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center">
              <ShieldAlert className="mr-3 h-8 w-8 text-purple-500" /> Admin Panel
            </h1>
            <p className="text-md text-muted-foreground">Manage users and system settings.</p>
          </motion.div>

          <motion.div 
            variants={itemVariants} initial="hidden" animate="visible"
            className="grid md:grid-cols-3 gap-6"
          >
            <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-5 w-5 text-sky-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-sky-500">{users.length}</div>
              </CardContent>
            </Card>
            <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pro Users</CardTitle>
                <Users className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">{users.filter(u => u.plan === 'Pro').length}</div>
              </CardContent>
            </Card>
             <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
                <FileText className="h-5 w-5 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{users.reduce((sum, u) => sum + u.docCount, 0)}</div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">User Management</CardTitle>
                <CardDescription>View, filter, and manage user accounts.</CardDescription>
                <div className="pt-4 flex gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                      type="search" 
                      placeholder="Search users by name or email..." 
                      className="pl-10 w-full bg-input"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white">
                    <Filter className="mr-2 h-4 w-4" /> Filter Users
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-muted-foreground">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Plan</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Docs</th>
                        <th className="p-2">Joined</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                      {filteredUsers.map(u => (
                        <motion.tr key={u.id} variants={itemVariants} className="border-b border-border/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                          <td className="p-2 font-medium">{u.name}</td>
                          <td className="p-2 text-muted-foreground">{u.email}</td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.plan === 'Pro' ? 'bg-purple-200 text-purple-700 dark:bg-purple-700 dark:text-purple-200' : 'bg-sky-200 text-sky-700 dark:bg-sky-700 dark:text-sky-200'}`}>
                              {u.plan}
                            </span>
                          </td>
                          <td className="p-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === 'Active' ? 'bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200' : 'bg-red-200 text-red-700 dark:bg-red-700 dark:text-red-200'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-2 text-muted-foreground">{u.docCount}</td>
                          <td className="p-2 text-muted-foreground">{u.joinDate}</td>
                          <td className="p-2">
                            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-100 dark:hover:bg-red-700/50">Deactivate</Button>
                          </td>
                        </motion.tr>
                      ))}
                    </motion.tbody>
                  </table>
                </div>
                {filteredUsers.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No users match your search criteria.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AdminPage;
  