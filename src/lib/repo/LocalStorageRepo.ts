import type { Repository, RecyclingRequest, Partner, Cluster } from '../types';
import { SEED_REQUESTS, SEED_PARTNERS } from '../seed';

const REQUESTS_KEY = 'kapdaloop_requests';
const PARTNERS_KEY = 'kapdaloop_partners';
const CLUSTERS_KEY = 'kapdaloop_clusters';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeeded(): void {
  if (!localStorage.getItem(REQUESTS_KEY)) {
    write(REQUESTS_KEY, SEED_REQUESTS);
  }
  if (!localStorage.getItem(PARTNERS_KEY)) {
    write(PARTNERS_KEY, SEED_PARTNERS);
  }
}

export const LocalStorageRepo: Repository = {
  async listRequests(): Promise<RecyclingRequest[]> {
    ensureSeeded();
    return read<RecyclingRequest[]>(REQUESTS_KEY, []);
  },

  async getRequest(code: string): Promise<RecyclingRequest | null> {
    ensureSeeded();
    const all = read<RecyclingRequest[]>(REQUESTS_KEY, []);
    return all.find((r) => r.trackingCode === code) ?? null;
  },

  async createRequest(
    data: Omit<RecyclingRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<RecyclingRequest> {
    ensureSeeded();
    const all = read<RecyclingRequest[]>(REQUESTS_KEY, []);
    const id = `r${Date.now()}`;
    const trackingCode = data.trackingCode || `KL-${Math.floor(1000 + Math.random() * 9000)}`;
    const req: RecyclingRequest = {
      ...data,
      id,
      trackingCode,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    all.unshift(req);
    write(REQUESTS_KEY, all);
    return req;
  },

  async updateRequest(
    id: string,
    patch: Partial<RecyclingRequest>
  ): Promise<RecyclingRequest> {
    ensureSeeded();
    const all = read<RecyclingRequest[]>(REQUESTS_KEY, []);
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) throw new Error('Request not found');
    all[idx] = { ...all[idx], ...patch };
    write(REQUESTS_KEY, all);
    return all[idx];
  },

  async listPartners(): Promise<Partner[]> {
    ensureSeeded();
    return read<Partner[]>(PARTNERS_KEY, SEED_PARTNERS);
  },

  async listClusters(): Promise<Cluster[]> {
    ensureSeeded();
    return read<Cluster[]>(CLUSTERS_KEY, []);
  },

  async saveClusters(clusters: Cluster[]): Promise<void> {
    write(CLUSTERS_KEY, clusters);
  },

  async reset(): Promise<void> {
    write(REQUESTS_KEY, SEED_REQUESTS);
    write(PARTNERS_KEY, SEED_PARTNERS);
    write(CLUSTERS_KEY, []);
  },
};
