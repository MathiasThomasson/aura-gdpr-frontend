import { useCallback, useEffect, useState } from 'react';
import { disablePublicDsrLink, enablePublicDsrLink, getPublicDsrLink } from '@/features/dsr/api';
import { PublicDsrLink } from '@/features/dsr/types';

const defaultLink: PublicDsrLink = { enabled: false, publicKey: null };

const usePublicDsrLink = () => {
  const [link, setLink] = useState<PublicDsrLink>(defaultLink);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPublicDsrLink();
      setLink(res);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load public DSR link.');
      setLink(defaultLink);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const enable = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await enablePublicDsrLink();
      setLink(res);
      return res;
    } catch (err: any) {
      const message = err?.message ?? 'Failed to enable public DSR form.';
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, []);

  const disable = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await disablePublicDsrLink();
      setLink(res);
      return res;
    } catch (err: any) {
      const message = err?.message ?? 'Failed to disable public DSR form.';
      setError(message);
      throw new Error(message);
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    link,
    loading,
    saving,
    error,
    reload: load,
    enable,
    disable,
  };
};

export default usePublicDsrLink;
