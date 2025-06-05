
    import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { FileText, PlusCircle, Filter, Trash2, Edit3, Download } from 'lucide-react';
    import { motion } from 'framer-motion';

    const mockDocuments = [
      { id: '1', name: 'Privacy Policy v2.1.pdf', uploadDate: '2025-05-28', status: 'Compliant', type: 'Policy', tags: ['Internal', 'Legal'] },
      { id: '2', name: 'Data Processing Agreement - VendorX.pdf', uploadDate: '2025-05-25', status: 'Needs Review', type: 'Agreement', tags: ['Vendor', 'DPA'] },
      { id: '3', name: 'Employee Handbook Addendum.pdf', uploadDate: '2025-05-20', status: 'High Risk', type: 'Internal Guide', tags: ['HR', 'Employee Data'] },
      { id: '4', name: 'Marketing Consent Form_EU.pdf', uploadDate: '2025-05-15', status: 'Compliant', type: 'Form', tags: ['Marketing', 'Consent'] },
    ];

    const getStatusColor = (status) => {
      if (status === 'Compliant') return 'bg-green-500';
      if (status === 'Needs Review') return 'bg-yellow-500';
      if (status === 'High Risk') return 'bg-red-500';
      return 'bg-gray-500';
    };
    
    const DocumentsPage = () => {
      // Placeholder for state and functions
      const [documents, setDocuments] = React.useState(mockDocuments);

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
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Document Management</h1>
              <p className="text-md text-muted-foreground">Upload, manage, and analyze your GDPR-related documents.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
              <Button className="bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </div>
          </motion.div>

          <motion.div 
            className="grid gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {documents.map((doc) => (
              <motion.div key={doc.id} variants={itemVariants}>
                <Card className="bg-card/70 dark:bg-slate-800/70 backdrop-blur-sm border-border/50 shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-sky-500" />
                      <div>
                        <p className="font-semibold text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {doc.uploadDate} | Type: {doc.type}
                        </p>
                        <div className="mt-1 flex gap-1">
                          {doc.tags.map(tag => (
                            <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 text-xs font-semibold text-white rounded-full ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-sky-500"><Download className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-yellow-500"><Edit3 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {documents.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-10"
            >
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground">No Documents Yet</h3>
              <p className="text-muted-foreground">Upload your first document to get started.</p>
              <Button className="mt-4 bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </motion.div>
          )}
        </div>
      );
    };

    export default DocumentsPage;
  