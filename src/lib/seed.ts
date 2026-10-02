import type { RecyclingRequest, Partner } from './types';
import { classifyDestination } from './routing';

const partners: Partner[] = [
  {
    id: 'p1',
    name: 'Demo Reuse NGO',
    type: 'Reuse',
    acceptedMaterials: ['Cotton', 'Denim', 'Polyester', 'Wool', 'Mixed', 'NotSure'],
    lat: 17.4401,
    lng: 78.3489,
    locality: 'Gachibowli',
  },
  {
    id: 'p2',
    name: 'Demo Tailor Collective',
    type: 'RepairUpcycle',
    acceptedMaterials: ['Cotton', 'Denim', 'Mixed'],
    lat: 17.4483,
    lng: 78.3915,
    locality: 'Madhapur',
  },
  {
    id: 'p3',
    name: 'Demo Cotton Recycler',
    type: 'Recycle',
    acceptedMaterials: ['Cotton'],
    lat: 17.4815,
    lng: 78.3737,
    locality: 'Kukatpally',
  },
  {
    id: 'p4',
    name: 'Demo Denim Partner',
    type: 'Recycle',
    acceptedMaterials: ['Denim'],
    lat: 17.4399,
    lng: 78.4983,
    locality: 'Secunderabad',
  },
  {
    id: 'p5',
    name: 'Demo Wool Recycler',
    type: 'Recycle',
    acceptedMaterials: ['Wool'],
    lat: 17.3986,
    lng: 78.5595,
    locality: 'Uppal',
  },
  {
    id: 'p6',
    name: 'Demo Mixed-Fibre Recycler',
    type: 'Recycle',
    acceptedMaterials: ['Polyester', 'Mixed', 'NotSure'],
    lat: 17.3478,
    lng: 78.5524,
    locality: 'LB Nagar',
  },
];

// Helper to create request with auto destination
function req(
  trackingCode: string,
  material: RecyclingRequest['material'],
  condition: RecyclingRequest['condition'],
  weightKg: number,
  name: string,
  phone: string,
  locality: string,
  lat: number,
  lng: number,
  status: RecyclingRequest['status'],
  daysAgo: number,
  note?: string
): RecyclingRequest {
  const { type } = classifyDestination(material, condition);
  return {
    id: `r${trackingCode}`,
    trackingCode,
    material,
    condition,
    weightKg,
    name,
    phone,
    locality,
    lat,
    lng,
    status,
    destinationType: type,
    createdAt: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    note,
  };
}

const requests: RecyclingRequest[] = [
  // Gachibowli cluster (3 nearby pending)
  req('KL-1001', 'Cotton', 'Wearable', 2.5, 'Ananya Reddy', '9876543210', 'Gachibowli', 17.4401, 78.3489, 'Pending', 1, 'Summer clothes, kids size'),
  req('KL-1002', 'Denim', 'Repairable', 1.8, 'Ravi Kumar', '9876501234', 'Gachibowli', 17.4410, 78.3495, 'Pending', 1),
  req('KL-1003', 'Mixed', 'Wearable', 3.2, 'Sunita Devi', '9876512345', 'Gachibowli', 17.4395, 78.3480, 'Pending', 2),

  // Madhapur cluster (3 nearby pending)
  req('KL-1004', 'Cotton', 'Damaged', 4.0, 'Prakash Rao', '9876523456', 'Madhapur', 17.4483, 78.3915, 'Pending', 1, 'Old bedsheets'),
  req('KL-1005', 'Polyester', 'Damaged', 2.2, 'Lakshmi N', '9876534567', 'Madhapur', 17.4490, 78.3920, 'Pending', 2),
  req('KL-1006', 'Cotton', 'Wearable', 1.5, 'Karthik V', '9876545678', 'Madhapur', 17.4475, 78.3910, 'Pending', 0),

  // Kondapur cluster (3 nearby pending)
  req('KL-1007', 'Wool', 'Wearable', 2.0, 'Deepa Sharma', '9876556789', 'Kondapur', 17.4909, 78.3846, 'Pending', 1, 'Winter sweaters'),
  req('KL-1008', 'Mixed', 'Repairable', 3.5, 'Srinivas G', '9876567890', 'Kondapur', 17.4915, 78.3850, 'Pending', 2),
  req('KL-1009', 'Cotton', 'Damaged', 2.8, 'Padma R', '9876578901', 'Kondapur', 17.4900, 78.3840, 'Pending', 0),

  // Spread across other localities with various statuses
  req('KL-1010', 'Denim', 'Wearable', 1.2, 'Arjun P', '9876589012', 'Kukatpally', 17.4815, 78.3737, 'PickupScheduled', 3),
  req('KL-1011', 'Cotton', 'Repairable', 2.0, 'Vani K', '9876590123', 'Kukatpally', 17.4820, 78.3740, 'Collected', 4),
  req('KL-1012', 'Polyester', 'Damaged', 1.5, 'Nagesh W', '9876502345', 'Secunderabad', 17.4399, 78.4983, 'Sorted', 5),
  req('KL-1013', 'Wool', 'Damaged', 0.8, 'Shobha R', '9876513456', 'Secunderabad', 17.4405, 78.4990, 'SentToPartner', 6),
  req('KL-1014', 'Cotton', 'Wearable', 5.0, 'Murali K', '9876524567', 'Uppal', 17.3986, 78.5595, 'Recovered', 7, 'Big clearout'),
  req('KL-1015', 'Mixed', 'Damaged', 3.0, 'Jyothsna V', '9876535678', 'Uppal', 17.3990, 78.5600, 'Recovered', 8),
  req('KL-1016', 'Denim', 'Damaged', 2.5, 'Krishna M', '9876546789', 'LB Nagar', 17.3478, 78.5524, 'Recovered', 10),
  req('KL-1017', 'Cotton', 'Wearable', 1.8, 'Swathi N', '9876557890', 'LB Nagar', 17.3482, 78.5528, 'Recovered', 9),
  req('KL-1018', 'Wool', 'Repairable', 1.2, 'Ramesh G', '9876568901', 'Tarnaka / Osmania University', 17.3995, 78.5359, 'PickupScheduled', 2),
  req('KL-1019', 'NotSure', 'Wearable', 2.3, 'Anitha S', '9876579012', 'Tarnaka / Osmania University', 17.4000, 78.5365, 'Collected', 3),
  req('KL-1020', 'Cotton', 'Wearable', 4.5, 'Venkat R', '9876580123', 'Banjara Hills', 17.4156, 78.4347, 'Sorted', 4),
  req('KL-1021', 'Denim', 'Repairable', 1.7, 'Meena K', '9876591234', 'Banjara Hills', 17.4160, 78.4350, 'Pending', 0),
  req('KL-1022', 'Mixed', 'Wearable', 3.8, 'Suresh B', '9876503456', 'Jubilee Hills', 17.4239, 78.4083, 'Pending', 1),
  req('KL-1023', 'Polyester', 'Wearable', 1.0, 'Ramya D', '9876514567', 'Jubilee Hills', 17.4245, 78.4090, 'Pending', 2),
  req('KL-1024', 'Cotton', 'Damaged', 6.0, 'Gopal N', '9876525678', 'Begumpet', 17.4434, 78.4614, 'Recovered', 12, 'Large household cleanout'),
  req('KL-1025', 'Wool', 'Wearable', 1.5, 'Divya T', '9876536789', 'Begumpet', 17.4440, 78.4620, 'Recovered', 11),
  req('KL-1026', 'Denim', 'Damaged', 2.0, 'Naresh K', '9876547890', 'Miyapur', 17.4964, 78.3710, 'Pending', 0),
  req('KL-1027', 'Cotton', 'Repairable', 1.3, 'Sirisha V', '9876558901', 'Miyapur', 17.4970, 78.3715, 'Pending', 1),
  req('KL-1028', 'Mixed', 'Damaged', 2.7, 'Aditya R', '9876569012', 'Ameerpet', 17.4374, 78.4487, 'Collected', 3),
  req('KL-1029', 'Polyester', 'Repairable', 1.4, 'Geetha M', '9876570123', 'Ameerpet', 17.4380, 78.4493, 'Sorted', 4),
  req('KL-1030', 'Cotton', 'Wearable', 3.6, 'Harika S', '9876581234', 'Dilsukhnagar', 17.3689, 78.5242, 'Recovered', 8, 'Family clothes donation'),
];

export const SEED_PARTNERS: Partner[] = partners;
export const SEED_REQUESTS: RecyclingRequest[] = requests;
