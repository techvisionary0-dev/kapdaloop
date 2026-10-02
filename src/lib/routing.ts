import type {
  Material,
  Condition,
  DestinationType,
  Partner,
  RecyclingRequest,
} from './types';
import { haversineKm } from './geo';

export interface RoutingResult {
  destinationType: DestinationType;
  reason: string;
  partner: Partner | null;
}

export function classifyDestination(
  material: Material,
  condition: Condition
): { type: DestinationType; reason: string } {
  // Wearable (any material) -> Reuse
  if (condition === 'Wearable') {
    return {
      type: 'Reuse',
      reason:
        'These clothes are wearable, so they will go to a reuse partner who can distribute them directly to people in need.',
    };
  }

  // Repairable + Cotton/Denim/Mixed -> Repair & Upcycle
  if (condition === 'Repairable' && (material === 'Cotton' || material === 'Denim' || material === 'Mixed')) {
    return {
      type: 'RepairUpcycle',
      reason:
        'These clothes are repairable and made of a workable fabric, so a tailor collective will repair or upcycle them into new products.',
    };
  }

  // Damaged routing by material
  if (condition === 'Damaged') {
    if (material === 'Cotton') {
      return {
        type: 'Recycle',
        reason:
          'Damaged cotton is best handled by a cotton recycler who shreds and reprocesses the fibre.',
      };
    }
    if (material === 'Denim') {
      return {
        type: 'Recycle',
        reason:
          'Damaged denim goes to a specialised denim recycler that reclaims the sturdy cotton twill fibre.',
      };
    }
    if (material === 'Wool') {
      return {
        type: 'Recycle',
        reason:
          'Damaged wool is sent to a wool recycler that can re-spin the fibre into new yarn.',
      };
    }
    // Polyester / Mixed / NotSure + Damaged -> mixed-fibre recycler
    return {
      type: 'Recycle',
      reason:
        'Damaged mixed or synthetic fabric goes to a mixed-fibre recycler. It will be sorted by the partner to determine the best recycling route.',
    };
  }

  // Repairable + Polyester/Wool/NotSure -> also repair, but let partner sort
  if (condition === 'Repairable') {
    return {
      type: 'RepairUpcycle',
      reason:
        'These clothes are repairable. A tailor collective will assess whether they can be repaired or should be recycled.',
    };
  }

  return {
    type: 'Recycle',
    reason:
      'Damaged items go to a recycler. The partner will sort and determine the best route.',
  };
}

export function matchPartner(
  material: Material,
  destinationType: DestinationType,
  partners: Partner[],
  requestLat: number,
  requestLng: number
): Partner | null {
  const eligible = partners.filter(
    (p) =>
      p.type === destinationType &&
      p.acceptedMaterials.includes(material)
  );

  if (eligible.length === 0) {
    // Fallback: any partner with matching destination type
    const fallback = partners.filter((p) => p.type === destinationType);
    if (fallback.length === 0) return null;
    return nearestPartner(fallback, requestLat, requestLng);
  }

  return nearestPartner(eligible, requestLat, requestLng);
}

function nearestPartner(
  partners: Partner[],
  lat: number,
  lng: number
): Partner {
  let best = partners[0];
  let bestDist = Infinity;
  for (const p of partners) {
    const d = haversineKm(lat, lng, p.lat, p.lng);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

export function routeRequest(
  material: Material,
  condition: Condition,
  partners: Partner[],
  lat: number,
  lng: number
): RoutingResult {
  const { type, reason } = classifyDestination(material, condition);
  const partner = matchPartner(material, type, partners, lat, lng);
  return { destinationType: type, reason, partner };
}
