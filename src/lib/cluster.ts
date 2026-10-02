import type { RecyclingRequest, Cluster } from './types';
import { haversineKm, centroid } from './geo';
import { CLUSTER } from './constants';

export interface ClusterResult {
  clusters: Cluster[];
  singlePickups: RecyclingRequest[];
}

export function generateClusters(
  requests: RecyclingRequest[]
): ClusterResult {
  const pending = requests
    .filter((r) => r.status === 'Pending')
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const clustered = new Set<string>();
  const clusters: Cluster[] = [];

  for (const seed of pending) {
    if (clustered.has(seed.id)) continue;

    const members: RecyclingRequest[] = [seed];
    let totalKg = seed.weightKg;

    for (const candidate of pending) {
      if (clustered.has(candidate.id)) continue;
      if (candidate.id === seed.id) continue;
      if (members.length >= CLUSTER.maxRequests) break;
      if (totalKg + candidate.weightKg > CLUSTER.maxWeightKg) continue;

      const runningCentroid = centroid(
        members.map((m) => ({ lat: m.lat, lng: m.lng }))
      );
      const dist = haversineKm(
        runningCentroid.lat,
        runningCentroid.lng,
        candidate.lat,
        candidate.lng
      );

      if (dist <= CLUSTER.maxRadiusKm) {
        members.push(candidate);
        totalKg += candidate.weightKg;
      }
    }

    if (members.length >= 2) {
      const c = centroid(members.map((m) => ({ lat: m.lat, lng: m.lng })));
      clusters.push({
        id: `CL-${clusters.length + 1}`,
        requestIds: members.map((m) => m.id),
        centroidLat: c.lat,
        centroidLng: c.lng,
        totalKg: Math.round(totalKg * 10) / 10,
        partnerId: undefined,
        scheduled: false,
      });
      for (const m of members) clustered.add(m.id);
    }
  }

  const singlePickups = pending.filter((r) => !clustered.has(r.id));

  return { clusters, singlePickups };
}

export function tripsSaved(clusters: Cluster[]): number {
  return clusters.reduce(
    (sum, c) => sum + (c.requestIds.length - 1),
    0
  );
}

export function materialMix(
  requestIds: string[],
  requests: RecyclingRequest[]
): Record<string, number> {
  const mix: Record<string, number> = {};
  for (const id of requestIds) {
    const r = requests.find((req) => req.id === id);
    if (r) {
      mix[r.material] = (mix[r.material] ?? 0) + 1;
    }
  }
  return mix;
}
