import { useState } from 'react';
import { RopaItem } from '../types';

export function useRopaMockData() {
  const [records, setRecords] = useState<RopaItem[]>([
    {
      id: 'ropa_001',
      name: 'Customer CRM processing',
      systemName: 'Hubspot CRM',
      owner: 'Head of Sales',
      purpose: 'Manage customer relationships, sales pipeline and communication.',
      legalBasis: 'Contract and legitimate interest.',
      processingCategory: 'customer_data',
      dataSubjects: 'Existing and potential customers in the EU.',
      dataCategories: 'Contact details, communication history, contract information.',
      recipients: 'Sales team, customer support, finance department.',
      transfersOutsideEU: 'Data is stored in EU; support access from US-based employees is possible.',
      retentionPeriod: '3 years after last recorded interaction, unless legal obligations require longer.',
      securityMeasures: 'Role-based access, SSO, encryption in transit, regular access reviews.',
      createdAt: '2025-01-15T09:00:00Z',
      lastUpdated: '2025-03-01T09:30:00Z',
    },
    {
      id: 'ropa_002',
      name: 'Employee HR processing',
      systemName: 'HR System',
      owner: 'HR Manager',
      purpose: 'Manage employment, payroll and performance reviews.',
      legalBasis: 'Legal obligation and contract.',
      processingCategory: 'employee_data',
      dataSubjects: 'Employees and former employees.',
      dataCategories: 'Identification data, contact details, salary information, performance data.',
      recipients: 'HR, finance, management.',
      transfersOutsideEU: 'No regular transfers outside the EU.',
      retentionPeriod: '7 years after end of employment for payroll and legal records.',
      securityMeasures: 'Strict access control, audit logging, encryption at rest and in transit.',
      createdAt: '2025-02-01T10:00:00Z',
      lastUpdated: '2025-04-10T11:15:00Z',
    },
  ]);

  return {
    records,
    setRecords,
    isLoading: false,
    isError: false,
  };
}

export default useRopaMockData;
