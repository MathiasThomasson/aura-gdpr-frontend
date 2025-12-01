import { useCallback } from 'react';
import api from '@/lib/apiClient';

const useAnalyticsEvent = () => {
  return useCallback((eventName: string) => {
    api
      .post('/api/analytics/event', { event_name: eventName })
      .catch(() => {
        // Ignore analytics errors
      });
  }, []);
};

export default useAnalyticsEvent;
