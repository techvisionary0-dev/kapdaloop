import { describe, it, expect } from 'vitest';
import { classifyDestination, matchPartner, routeRequest } from './routing';
import type { Partner, Material, Condition } from './types';

const partners: Partner[] = [
  { id: 'p1', name: 'Reuse NGO', type: 'Reuse', acceptedMaterials: ['Cotton', 'Denim', 'Wool', 'Polyester', 'Mixed', 'NotSure'], lat: 17.44, lng: 78.34, locality: 'Gachibowli' },
  { id: 'p2', name: 'Tailor Collective', type: 'RepairUpcycle', acceptedMaterials: ['Cotton', 'Denim', 'Mixed'], lat: 17.45, lng: 78.39, locality: 'Madhapur' },
  { id: 'p3', name: 'Cotton Recycler', type: 'Recycle', acceptedMaterials: ['Cotton'], lat: 17.48, lng: 78.37, locality: 'Kukatpally' },
  { id: 'p4', name: 'Denim Partner', type: 'Recycle', acceptedMaterials: ['Denim'], lat: 17.44, lng: 78.49, locality: 'Secunderabad' },
  { id: 'p5', name: 'Wool Recycler', type: 'Recycle', acceptedMaterials: ['Wool'], lat: 17.39, lng: 78.55, locality: 'Uppal' },
  { id: 'p6', name: 'Mixed Recycler', type: 'Recycle', acceptedMaterials: ['Polyester', 'Mixed', 'NotSure'], lat: 17.34, lng: 78.55, locality: 'LB Nagar' },
];

describe('classifyDestination', () => {
  it('routes Wearable (any material) to Reuse', () => {
    const materials: Material[] = ['Cotton', 'Denim', 'Polyester', 'Wool', 'Mixed', 'NotSure'];
    for (const m of materials) {
      const result = classifyDestination(m, 'Wearable');
      expect(result.type).toBe('Reuse');
      expect(result.reason).toContain('wearable');
    }
  });

  it('routes Repairable + Cotton/Denim/Mixed to RepairUpcycle', () => {
    expect(classifyDestination('Cotton', 'Repairable').type).toBe('RepairUpcycle');
    expect(classifyDestination('Denim', 'Repairable').type).toBe('RepairUpcycle');
    expect(classifyDestination('Mixed', 'Repairable').type).toBe('RepairUpcycle');
  });

  it('routes Damaged + Cotton to Recycle', () => {
    const result = classifyDestination('Cotton', 'Damaged');
    expect(result.type).toBe('Recycle');
    expect(result.reason).toContain('cotton recycler');
  });

  it('routes Damaged + Denim to Recycle', () => {
    expect(classifyDestination('Denim', 'Damaged').type).toBe('Recycle');
  });

  it('routes Damaged + Wool to Recycle', () => {
    expect(classifyDestination('Wool', 'Damaged').type).toBe('Recycle');
  });

  it('routes Damaged + Polyester/Mixed/NotSure to Recycle with sort note', () => {
    const result = classifyDestination('Polyester', 'Damaged');
    expect(result.type).toBe('Recycle');
    expect(result.reason).toContain('sorted by the partner');
  });
});

describe('matchPartner', () => {
  it('matches to nearest partner with right material and type', () => {
    // From Gachibowli area, nearest reuse partner should be p1
    const partner = matchPartner('Cotton', 'Reuse', partners, 17.44, 78.34);
    expect(partner).not.toBeNull();
    expect(partner!.id).toBe('p1');
  });

  it('matches damaged cotton to cotton recycler', () => {
    const partner = matchPartner('Cotton', 'Recycle', partners, 17.48, 78.37);
    expect(partner).not.toBeNull();
    expect(partner!.id).toBe('p3');
  });

  it('falls back to any partner with matching type if no material match', () => {
    // Wool is not accepted by p2 (RepairUpcycle), but fallback should find p2
    const partner = matchPartner('Wool', 'RepairUpcycle', partners, 17.45, 78.39);
    expect(partner).not.toBeNull();
    expect(partner!.id).toBe('p2');
  });
});

describe('routeRequest', () => {
  it('returns destination type, reason, and partner', () => {
    const result = routeRequest('Cotton', 'Wearable', partners, 17.44, 78.34);
    expect(result.destinationType).toBe('Reuse');
    expect(result.partner).not.toBeNull();
    expect(result.reason).toBeTruthy();
  });
});
