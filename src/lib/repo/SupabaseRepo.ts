import { createClient } from '@supabase/supabase-js';
import type { Repository, RecyclingRequest, Partner, Cluster } from '../types';
import { SEED_PARTNERS } from '../seed';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
const client = createClient(url, key);

interface RequestRow {
  id: string;
  code: string;
  name: string;
  phone: string;
  material: RecyclingRequest['material'];
  condition: RecyclingRequest['condition'];
  weight_kg: number;
  locality: string;
  lat: number;
  lng: number;
  destination: RecyclingRequest['destinationType'];
  status: RecyclingRequest['status'];
  cluster_id: string | null;
  note: string | null;
  created_at: string;
}

function mapRowToRequest(row: RequestRow): RecyclingRequest {
  return {
    id: String(row.id),
    trackingCode: String(row.code),
    name: String(row.name),
    phone: String(row.phone),
    material: row.material,
    condition: row.condition,
    weightKg: Number(row.weight_kg),
    locality: String(row.locality),
    lat: Number(row.lat),
    lng: Number(row.lng),
    destinationType: row.destination,
    status: row.status,
    clusterId: row.cluster_id ?? undefined,
    note: row.note ?? undefined,
    createdAt: String(row.created_at),
  };
}

function generateCode(): string {
  return `KL-${Math.floor(1000 + Math.random() * 9000)}`;
}

export const SupabaseRepo: Repository = {
  async listRequests(): Promise<RecyclingRequest[]> {
    const { data, error } = await client
      .from('requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data as RequestRow[]).map(mapRowToRequest);
  },

  async getRequest(code: string): Promise<RecyclingRequest | null> {
    const { data, error } = await client
      .from('requests')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return mapRowToRequest(data as RequestRow);
  },

  async createRequest(
    data: Omit<RecyclingRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<RecyclingRequest> {
    const code = data.trackingCode || generateCode();
    const payload = {
      code,
      name: data.name,
      phone: data.phone,
      material: data.material,
      condition: data.condition,
      weight_kg: data.weightKg,
      locality: data.locality,
      lat: data.lat,
      lng: data.lng,
      destination: data.destinationType,
      note: data.note ?? null,
    };
    const { data: row, error } = await client
      .from('requests')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return mapRowToRequest(row as RequestRow);
  },

  async updateRequest(
    id: string,
    patch: Partial<RecyclingRequest>
  ): Promise<RecyclingRequest> {
    const snakePatch: Record<string, unknown> = {};
    if (patch.status) snakePatch.status = patch.status;
    if (patch.clusterId !== undefined) snakePatch.cluster_id = patch.clusterId ?? null;
    if (patch.note !== undefined) snakePatch.note = patch.note ?? null;
    const { data, error } = await client
      .from('requests')
      .update(snakePatch)
      .eq('id', id)
      .select()
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error('Request not found');
    return mapRowToRequest(data as RequestRow);
  },

  async listPartners(): Promise<Partner[]> {
    return SEED_PARTNERS;
  },

  async listClusters(): Promise<Cluster[]> {
    // Derive clusters from requests that share a cluster_id
    const { data, error } = await client
      .from('requests')
      .select('id, cluster_id, weight_kg, lat, lng')
      .not('cluster_id', 'is', null);
    if (error) throw error;

    const groups = new Map<string, { ids: string[]; kg: number; lats: number[]; lngs: number[] }>();
    for (const row of data as { id: string; cluster_id: string; weight_kg: number; lat: number; lng: number }[]) {
      const existing = groups.get(row.cluster_id);
      if (existing) {
        existing.ids.push(row.id);
        existing.kg += Number(row.weight_kg);
        existing.lats.push(Number(row.lat));
        existing.lngs.push(Number(row.lng));
      } else {
        groups.set(row.cluster_id, { ids: [row.id], kg: Number(row.weight_kg), lats: [Number(row.lat)], lngs: [Number(row.lng)] });
      }
    }

    const clusters: Cluster[] = [];
    for (const [id, g] of groups) {
      clusters.push({
        id,
        requestIds: g.ids,
        centroidLat: g.lats.reduce((a: number, b: number) => a + b, 0) / g.lats.length,
        centroidLng: g.lngs.reduce((a: number, b: number) => a + b, 0) / g.lngs.length,
        totalKg: Math.round(g.kg * 10) / 10,
        scheduled: false,
      });
    }
    return clusters;
  },

  async saveClusters(clusters: Cluster[]): Promise<void> {
    // Clear existing cluster_ids, then set new ones
    await client.from('requests').update({ cluster_id: null }).not('cluster_id', 'is', null);

    for (const cluster of clusters) {
      for (const reqId of cluster.requestIds) {
        await client
          .from('requests')
          .update({ cluster_id: cluster.id })
          .eq('id', reqId);
      }
    }
  },

  async reset(): Promise<void> {
    await client.from('requests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    const seeds = [
      { code: 'KL-9001', name: 'Ananya Reddy', phone: '9876543210', material: 'Cotton', condition: 'Wearable', weight_kg: 2.5, locality: 'Gachibowli', lat: 17.4401, lng: 78.3489, destination: 'Reuse', status: 'Pending', created_at: new Date(Date.now() - 86400000).toISOString() },
      { code: 'KL-9002', name: 'Ravi Kumar', phone: '9876501234', material: 'Denim', condition: 'Repairable', weight_kg: 1.8, locality: 'Gachibowli', lat: 17.4410, lng: 78.3495, destination: 'RepairUpcycle', status: 'Pending', created_at: new Date(Date.now() - 86400000).toISOString() },
      { code: 'KL-9003', name: 'Prakash Rao', phone: '9876523456', material: 'Cotton', condition: 'Damaged', weight_kg: 4.0, locality: 'Madhapur', lat: 17.4483, lng: 78.3915, destination: 'Recycle', status: 'Pending', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
      { code: 'KL-9004', name: 'Deepa Sharma', phone: '9876556789', material: 'Wool', condition: 'Wearable', weight_kg: 2.0, locality: 'Kondapur', lat: 17.4909, lng: 78.3846, destination: 'Reuse', status: 'Collected', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
      { code: 'KL-9005', name: 'Murali K', phone: '9876524567', material: 'Cotton', condition: 'Wearable', weight_kg: 5.0, locality: 'Uppal', lat: 17.3986, lng: 78.5595, destination: 'Reuse', status: 'Recovered', created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
      { code: 'KL-9006', name: 'Krishna M', phone: '9876546789', material: 'Denim', condition: 'Damaged', weight_kg: 2.5, locality: 'LB Nagar', lat: 17.3478, lng: 78.5524, destination: 'Recycle', status: 'Recovered', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
    ];
    await client.from('requests').insert(seeds);
  },
};
