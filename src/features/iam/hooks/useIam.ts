import { useCallback, useEffect, useRef, useState } from 'react';
import { getUser, getUsers, inviteUser, patchUser, updateUser } from '../api';
import type { IamUser } from '../types';

export function useIam() {
  const [users, setUsers] = useState<IamUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const list = await getUsers();
      if (isMounted.current) setUsers(list);
    } catch (error) {
      if (isMounted.current) setIsError(true);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const fetchUser = useCallback(async (id: string) => {
    return getUser(id);
  }, []);

  const handleInvite = useCallback(async (payload: { name: string; email: string; role: IamUser['role'] }) => {
    setIsSaving(true);
    try {
      const invited = await inviteUser(payload);
      if (isMounted.current) setUsers((prev) => [invited, ...prev]);
      return invited;
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  }, []);

  const handleUpdate = useCallback(async (id: string, payload: Partial<IamUser>) => {
    setIsSaving(true);
    try {
      const updated = await updateUser(id, payload);
      if (isMounted.current) setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  }, []);

  const handlePatch = useCallback(async (id: string, payload: Partial<IamUser> & { action?: string }) => {
    setIsSaving(true);
    try {
      const updated = await patchUser(id, payload);
      if (isMounted.current) setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      return updated;
    } finally {
      if (isMounted.current) setIsSaving(false);
    }
  }, []);

  return {
    users,
    isLoading,
    isError,
    isSaving,
    refresh: load,
    invite: handleInvite,
    update: handleUpdate,
    patch: handlePatch,
    fetchUser,
  };
}

export default useIam;
