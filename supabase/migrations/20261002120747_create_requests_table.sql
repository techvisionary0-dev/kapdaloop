/*
# Create requests table for KapdaLoop

## Purpose
Stores textile recovery requests submitted by households. Each row represents
one pickup request with material/condition info, location, routing destination,
status, and optional cluster assignment.

## New table: requests
- id (uuid, PK, auto-generated)
- code (text, unique) — human-readable tracking code, e.g. KL-4821
- name (text) — submitter's name
- phone (text) — submitter's phone number
- material (text) — Cotton / Denim / Polyester / Wool / Mixed / NotSure
- condition (text) — Wearable / Repairable / Damaged
- weight_kg (numeric) — weight in kilograms
- locality (text) — Hyderabad area name
- lat (numeric) — latitude
- lng (numeric) — longitude
- destination (text) — Reuse / RepairUpcycle / Recycle
- status (text, default 'Pending') — Pending / PickupScheduled / Collected / Sorted / SentToPartner / Recovered
- cluster_id (text, nullable) — shared cluster grouping for nearby pickups
- created_at (timestamptz, default now())

## Security
- RLS enabled (single-tenant, no auth — all data is intentionally public/shared)
- anon + authenticated can SELECT, INSERT, UPDATE, DELETE
*/

CREATE TABLE IF NOT EXISTS requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  material text NOT NULL,
  condition text NOT NULL,
  weight_kg numeric NOT NULL,
  locality text NOT NULL,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  destination text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  cluster_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_requests" ON requests;
CREATE POLICY "anon_select_requests" ON requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_requests" ON requests;
CREATE POLICY "anon_insert_requests" ON requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_requests" ON requests;
CREATE POLICY "anon_update_requests" ON requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_requests" ON requests;
CREATE POLICY "anon_delete_requests" ON requests FOR DELETE
  TO anon, authenticated USING (true);

-- Seed 6 sample Hyderabad rows so the map is not empty
INSERT INTO requests (code, name, phone, material, condition, weight_kg, locality, lat, lng, destination, status, created_at) VALUES
  ('KL-9001', 'Ananya Reddy', '9876543210', 'Cotton', 'Wearable', 2.5, 'Gachibowli', 17.4401, 78.3489, 'Reuse', 'Pending', now() - interval '1 day'),
  ('KL-9002', 'Ravi Kumar', '9876501234', 'Denim', 'Repairable', 1.8, 'Gachibowli', 17.4410, 78.3495, 'RepairUpcycle', 'Pending', now() - interval '1 day'),
  ('KL-9003', 'Prakash Rao', '9876523456', 'Cotton', 'Damaged', 4.0, 'Madhapur', 17.4483, 78.3915, 'Recycle', 'Pending', now() - interval '2 days'),
  ('KL-9004', 'Deepa Sharma', '9876556789', 'Wool', 'Wearable', 2.0, 'Kondapur', 17.4909, 78.3846, 'Reuse', 'Collected', now() - interval '3 days'),
  ('KL-9005', 'Murali K', '9876524567', 'Cotton', 'Wearable', 5.0, 'Uppal', 17.3986, 78.5595, 'Reuse', 'Recovered', now() - interval '7 days'),
  ('KL-9006', 'Krishna M', '9876546789', 'Denim', 'Damaged', 2.5, 'LB Nagar', 17.3478, 78.5524, 'Recycle', 'Recovered', now() - interval '10 days')
ON CONFLICT (code) DO NOTHING;
