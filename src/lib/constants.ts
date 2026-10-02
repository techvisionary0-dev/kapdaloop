import type { Material, Condition, RequestStatus, DestinationType } from './types';

// ── Theme tokens ──
export const COLORS = {
  forest: '#2F5D3A',
  sage: '#A9BFA0',
  cream: '#F6F1E7',
  terracotta: '#C8643C',
  denim: '#3E5C76',
  charcoal: '#2B2B2B',
  white: '#FFFFFF',
} as const;

// ── Demo PIN ──
export const DEMO_PIN = '1234';

// ── Hyderabad localities with approximate coordinates ──
export interface Locality {
  name: string;
  lat: number;
  lng: number;
}

export const LOCALITIES: Locality[] = [
  { name: 'Gachibowli', lat: 17.4401, lng: 78.3489 },
  { name: 'Madhapur', lat: 17.4483, lng: 78.3915 },
  { name: 'Kukatpally', lat: 17.4815, lng: 78.7137 },
  { name: 'Secunderabad', lat: 17.4399, lng: 78.4983 },
  { name: 'Uppal', lat: 17.3986, lng: 78.5595 },
  { name: 'LB Nagar', lat: 17.3478, lng: 78.5524 },
  { name: 'Tarnaka / Osmania University', lat: 17.3995, lng: 78.5359 },
  { name: 'Banjara Hills', lat: 17.4156, lng: 78.4347 },
  { name: 'Jubilee Hills', lat: 17.4239, lng: 78.4083 },
  { name: 'Begumpet', lat: 17.4434, lng: 78.4614 },
  { name: 'Kondapur', lat: 17.4909, lng: 78.3846 },
  { name: 'Miyapur', lat: 17.4964, lng: 78.3710 },
  { name: 'Ameerpet', lat: 17.4374, lng: 78.4487 },
  { name: 'Dilsukhnagar', lat: 17.3689, lng: 78.5242 },
  { name: 'Hitech City', lat: 17.4435, lng: 78.3772 },
];

// ── Materials metadata ──
export interface MaterialMeta {
  value: Material;
  label: string;
  color: string;
  description: string;
}

export const MATERIALS: MaterialMeta[] = [
  { value: 'Cotton', label: 'Cotton', color: '#E8DCC4', description: 'Soft breathable fabric' },
  { value: 'Denim', label: 'Denim', color: '#5B7A99', description: 'Sturdy cotton twill' },
  { value: 'Polyester', label: 'Polyester', color: '#B8C5D6', description: 'Synthetic fibre' },
  { value: 'Wool', label: 'Wool', color: '#C4A882', description: 'Warm animal fibre' },
  { value: 'Mixed', label: 'Mixed', color: '#A9BFA0', description: 'Blend of materials' },
  { value: 'NotSure', label: 'Not sure', color: '#D4D4D4', description: 'We will sort it' },
];

// ── Conditions ──
export const CONDITIONS: { value: Condition; label: string; description: string }[] = [
  { value: 'Wearable', label: 'Wearable', description: 'Can be worn as-is' },
  { value: 'Repairable', label: 'Repairable', description: 'Minor fixes needed' },
  { value: 'Damaged', label: 'Damaged', description: 'Torn or worn out' },
];

// ── Impact constants (EDITABLE, placeholder values) ──
// TODO: replace with cited sources before the pitch
export const IMPACT = {
  // estimated kg CO2e avoided per kg of clothing, by destination
  co2ePerKgByDestination: {
    Reuse: 3.0, // ~3 kg CO2e avoided per kg reused
    RepairUpcycle: 2.5,
    Recycle: 1.5,
  } as Record<DestinationType, number>,
  // estimated litres of water saved per kg reused
  litresWaterPerKgReused: 2700,
  // label for UI
  estimateLabel: 'estimates, editable',
} as const;

// ── Status colors for map markers ──
export const CONDITION_COLORS: Record<Condition, string> = {
  Wearable: '#2F5D3A',
  Repairable: '#3E5C76',
  Damaged: '#C8643C',
};

// ── Material labels for display ──
export const MATERIAL_LABELS: Record<Material, string> = {
  Cotton: 'Cotton',
  Denim: 'Denim',
  Polyester: 'Polyester',
  Wool: 'Wool',
  Mixed: 'Mixed',
  NotSure: 'Not sure',
};

export const DESTINATION_LABELS: Record<DestinationType, string> = {
  Reuse: 'Reuse',
  RepairUpcycle: 'Repair & Upcycle',
  Recycle: 'Recycle',
};

// ── Cluster limits ──
export const CLUSTER = {
  maxRadiusKm: 1.5,
  maxRequests: 12,
  maxWeightKg: 40,
};

// ── Pexels imagery ──
export const HERO_IMAGE =
  'https://images.pexels.com/photos/11733651/pexels-photo-11733651.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const REUSE_IMAGE =
  'https://images.pexels.com/photos/6068952/pexels-photo-6068952.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const REPAIR_IMAGE =
  'https://images.pexels.com/photos/35166547/pexels-photo-35166547.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const RECYCLE_IMAGE =
  'https://images.pexels.com/photos/5504775/pexels-photo-5504775.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
export const FABRIC_IMAGE =
  'https://images.pexels.com/photos/276267/pexels-photo-276267.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
