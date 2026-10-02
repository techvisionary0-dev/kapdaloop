export type Material =
  | 'Cotton'
  | 'Denim'
  | 'Polyester'
  | 'Wool'
  | 'Mixed'
  | 'NotSure';

export type Condition = 'Wearable' | 'Repairable' | 'Damaged';

export type DestinationType = 'Reuse' | 'RepairUpcycle' | 'Recycle';

export type RequestStatus =
  | 'Pending'
  | 'PickupScheduled'
  | 'Collected'
  | 'Sorted'
  | 'SentToPartner'
  | 'Recovered';

export const STATUS_ORDER: RequestStatus[] = [
  'Pending',
  'PickupScheduled',
  'Collected',
  'Sorted',
  'SentToPartner',
  'Recovered',
];

export const STATUS_LABELS: Record<RequestStatus, string> = {
  Pending: 'Pending',
  PickupScheduled: 'Pickup Scheduled',
  Collected: 'Collected',
  Sorted: 'Sorted',
  SentToPartner: 'Sent to Partner',
  Recovered: 'Recovered',
};

export interface RecyclingRequest {
  id: string;
  trackingCode: string;
  material: Material;
  condition: Condition;
  weightKg: number;
  note?: string;
  name: string;
  phone: string;
  locality: string;
  lat: number;
  lng: number;
  status: RequestStatus;
  destinationType: DestinationType;
  partnerId?: string;
  clusterId?: string;
  createdAt: string;
}

export interface Partner {
  id: string;
  name: string;
  type: DestinationType;
  acceptedMaterials: Material[];
  lat: number;
  lng: number;
  locality: string;
}

export interface Cluster {
  id: string;
  requestIds: string[];
  centroidLat: number;
  centroidLng: number;
  totalKg: number;
  partnerId?: string;
  scheduled: boolean;
}

export interface RepoSummary {
  totalRequests: number;
  kgCollected: number;
  pending: number;
  recovered: number;
  households: number;
  co2eAvoided: number;
}

export interface Repository {
  listRequests(): Promise<RecyclingRequest[]>;
  getRequest(code: string): Promise<RecyclingRequest | null>;
  createRequest(
    req: Omit<RecyclingRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<RecyclingRequest>;
  updateRequest(
    id: string,
    patch: Partial<RecyclingRequest>
  ): Promise<RecyclingRequest>;
  listPartners(): Promise<Partner[]>;
  listClusters(): Promise<Cluster[]>;
  saveClusters(clusters: Cluster[]): Promise<void>;
  reset(): Promise<void>;
}
