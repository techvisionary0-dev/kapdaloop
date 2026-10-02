import type { RecyclingRequest, DestinationType } from './types';
import { IMPACT } from './constants';

export function co2eAvoidedKg(req: RecyclingRequest): number {
  const factor = IMPACT.co2ePerKgByDestination[req.destinationType] ?? 2.0;
  return req.weightKg * factor;
}

export function waterSavedLitres(req: RecyclingRequest): number {
  if (req.destinationType === 'Reuse') return req.weightKg * IMPACT.litresWaterPerKgReused;
  if (req.destinationType === 'RepairUpcycle') return req.weightKg * IMPACT.litresWaterPerKgReused * 0.8;
  return req.weightKg * IMPACT.litresWaterPerKgReused * 0.4;
}

export function totalImpact(requests: RecyclingRequest[]) {
  let co2e = 0;
  let water = 0;
  let kgCollected = 0;
  let recovered = 0;
  const households = new Set<string>();

  for (const r of requests) {
    households.add(r.name + r.phone);
    if (r.status === 'Recovered' || r.status === 'SentToPartner' || r.status === 'Collected' || r.status === 'Sorted') {
      kgCollected += r.weightKg;
    }
    if (r.status === 'Recovered') {
      co2e += co2eAvoidedKg(r);
      water += waterSavedLitres(r);
      recovered += 1;
    }
  }

  return {
    co2e: Math.round(co2e),
    water: Math.round(water),
    kgCollected: Math.round(kgCollected * 10) / 10,
    recovered,
    households: households.size,
  };
}

export function formatKg(kg: number): string {
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(1)} kg`;
}

export function formatCo2e(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t CO₂e`;
  return `${Math.round(kg)} kg CO₂e`;
}

export function formatWater(litres: number): string {
  if (litres >= 1000) return `${(litres / 1000).toFixed(1)}k L water`;
  return `${Math.round(litres)} L water`;
}
