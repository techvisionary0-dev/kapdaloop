import { describe, it, expect } from 'vitest';
import { generateClusters, tripsSaved } from './cluster';
import type { RecyclingRequest } from './types';
import { classifyDestination } from './routing';

function makeReq(
  id: string,
  lat: number,
  lng: number,
  weightKg: number = 2,
  daysAgo: number = 1
): RecyclingRequest {
  const { type } = classifyDestination('Cotton', 'Wearable');
  return {
    id,
    trackingCode: `KL-${id}`,
    material: 'Cotton',
    condition: 'Wearable',
    weightKg,
    name: `Person ${id}`,
    phone: '9999999999',
    locality: 'Test',
    lat,
    lng,
    status: 'Pending',
    destinationType: type,
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
  };
}

describe('generateClusters', () => {
  it('groups nearby requests into clusters', () => {
    const reqs = [
      makeReq('1', 17.4400, 78.3400),
      makeReq('2', 17.4405, 78.3405),
      makeReq('3', 17.4410, 78.3410),
      makeReq('4', 17.5000, 78.4000), // far away
    ];
    const result = generateClusters(reqs);
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].requestIds.length).toBe(3);
    expect(result.singlePickups.length).toBe(1);
    expect(result.singlePickups[0].id).toBe('4');
  });

  it('drops clusters of 1 into single pickups', () => {
    const reqs = [
      makeReq('1', 17.4400, 78.3400),
      makeReq('2', 17.5000, 78.4000),
    ];
    const result = generateClusters(reqs);
    expect(result.clusters.length).toBe(0);
    expect(result.singlePickups.length).toBe(2);
  });

  it('respects max 12 requests per cluster', () => {
    const reqs = Array.from({ length: 15 }, (_, i) =>
      makeReq(`${i}`, 17.4400 + i * 0.001, 78.3400)
    );
    const result = generateClusters(reqs);
    // First cluster should have max 12
    expect(result.clusters[0].requestIds.length).toBeLessThanOrEqual(12);
  });

  it('respects max 40 kg per cluster', () => {
    const reqs = Array.from({ length: 10 }, (_, i) =>
      makeReq(`${i}`, 17.4400 + i * 0.001, 78.3400, 5)
    );
    // 10 * 5 = 50 kg, should cap at 40 kg = 8 requests
    const result = generateClusters(reqs);
    expect(result.clusters[0].totalKg).toBeLessThanOrEqual(40);
  });

  it('only clusters pending requests', () => {
    const reqs = [
      makeReq('1', 17.4400, 78.3400),
      makeReq('2', 17.4405, 78.3405),
      { ...makeReq('3', 17.4410, 78.3410), status: 'Collected' as const },
    ];
    const result = generateClusters(reqs);
    // Only 2 pending close together
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].requestIds.length).toBe(2);
  });

  it('sorts by date (oldest first as seed)', () => {
    const reqs = [
      makeReq('new', 17.4400, 78.3400, 2, 0),
      makeReq('old', 17.4405, 78.3405, 2, 5),
    ];
    const result = generateClusters(reqs);
    // 'old' should be the seed (sorted by date asc)
    expect(result.clusters[0].requestIds[0]).toBe('old');
  });
});

describe('tripsSaved', () => {
  it('calculates total trips saved', () => {
    const clusters = [
      { id: 'C1', requestIds: ['1', '2', '3'], centroidLat: 0, centroidLng: 0, totalKg: 6, scheduled: false },
      { id: 'C2', requestIds: ['4', '5'], centroidLat: 0, centroidLng: 0, totalKg: 4, scheduled: false },
    ];
    expect(tripsSaved(clusters)).toBe(3); // (3-1) + (2-1) = 3
  });
});
