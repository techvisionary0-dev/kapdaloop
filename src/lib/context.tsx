import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { RecyclingRequest, Partner, Cluster } from './types';
import { repository } from './repo';

interface AppData {
  requests: RecyclingRequest[];
  partners: Partner[];
  clusters: Cluster[];
  loading: boolean;
  reload: () => Promise<void>;
  getRequest: (code: string) => Promise<RecyclingRequest | null>;
  createRequest: (data: Omit<RecyclingRequest, 'id' | 'createdAt' | 'status'>) => Promise<RecyclingRequest>;
  updateRequest: (id: string, patch: Partial<RecyclingRequest>) => Promise<void>;
  saveClusters: (clusters: Cluster[]) => Promise<void>;
  reset: () => Promise<void>;
}

const AppContext = createContext<AppData | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [requests, setRequests] = useState<RecyclingRequest[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [reqs, parts, clusts] = await Promise.all([
      repository.listRequests(),
      repository.listPartners(),
      repository.listClusters(),
    ]);
    setRequests(reqs);
    setPartners(parts);
    setClusters(clusts);
    setLoading(false);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const getRequest = useCallback(async (code: string): Promise<RecyclingRequest | null> => {
    return repository.getRequest(code);
  }, []);

  const createRequest = useCallback(async (data: Omit<RecyclingRequest, 'id' | 'createdAt' | 'status'>) => {
    const trackingCode = data.trackingCode || `KL-${Math.floor(1000 + Math.random() * 9000)}`;
    const req = await repository.createRequest({ ...data, trackingCode });
    setRequests((prev) => [req, ...prev]);
    return req;
  }, []);

  const updateRequest = useCallback(async (id: string, patch: Partial<RecyclingRequest>) => {
    const updated = await repository.updateRequest(id, patch);
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    // Also update clusters if status changed
    if (patch.status) {
      setClusters((prev) =>
        prev
          .map((c) => ({
            ...c,
            requestIds: c.requestIds.filter((rid) => rid !== id),
          }))
          .filter((c) => c.requestIds.length > 0)
      );
    }
  }, []);

  const saveClusters = useCallback(async (newClusters: Cluster[]) => {
    await repository.saveClusters(newClusters);
    setClusters(newClusters);
  }, []);

  const reset = useCallback(async () => {
    await repository.reset();
    await reload();
  }, [reload]);

  return (
    <AppContext.Provider
      value={{
        requests,
        partners,
        clusters,
        loading,
        reload,
        getRequest,
        createRequest,
        updateRequest,
        saveClusters,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppData {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
