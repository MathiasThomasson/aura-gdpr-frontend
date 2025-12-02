import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { createDsr } from '@/features/dsr/api';
import {
  CreateDataSubjectRequestInput,
  DataSubjectRequest,
  DataSubjectRequestPriority,
  DataSubjectRequestType,
} from '@/features/dsr/types';

export type NewDsrRequestPayload = {
  request_type: DataSubjectRequestType;
  name: string;
  email: string;
  description: string;
  priority: DataSubjectRequestPriority;
  deadline: string;
};

type UseCreateDsrParams = {
  onSuccess?: (created: DataSubjectRequest) => Promise<void> | void;
};

const useCreateDSR = ({ onSuccess }: UseCreateDsrParams = {}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRequest = useCallback(
    async (payload: NewDsrRequestPayload) => {
      setLoading(true);
      setError(null);
      const body: CreateDataSubjectRequestInput = {
        type: payload.request_type,
        data_subject: payload.name.trim(),
        email: payload.email.trim(),
        description: payload.description.trim(),
        due_at: payload.deadline,
        priority: payload.priority,
      };

      try {
        const created = await createDsr(body);
        toast({ title: 'Request created successfully' });
        await onSuccess?.(created);
        return created;
      } catch (err: any) {
        const message = err?.message ?? 'Failed to create request.';
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [onSuccess, toast]
  );

  return {
    createRequest,
    loading,
    error,
  };
};

export default useCreateDSR;
