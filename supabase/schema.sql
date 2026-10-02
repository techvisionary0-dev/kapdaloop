-- KapdaLoop Supabase schema
-- Run this in the Supabase SQL editor to enable cloud storage.

create extension if not exists "pgcrypto";

create table if not exists partners (
  id text primary key,
  name text not null,
  type text not null,
  accepted_materials text[] not null default '{}',
  lat double precision not null,
  lng double precision not null,
  locality text not null
);

create table if not exists requests (
  id uuid primary key default gen_random_uuid(),
  tracking_code text unique not null,
  material text not null,
  condition text not null,
  weight_kg double precision not null,
  note text,
  name text not null,
  phone text not null,
  locality text not null,
  lat double precision not null,
  lng double precision not null,
  status text not null default 'Pending',
  destination_type text not null,
  partner_id text references partners(id),
  cluster_id text,
  created_at timestamptz not null default now()
);

create table if not exists clusters (
  id text primary key,
  request_ids text[] not null default '{}',
  centroid_lat double precision not null,
  centroid_lng double precision not null,
  total_kg double precision not null,
  partner_id text references partners(id),
  scheduled boolean not null default false
);

alter table requests enable row level security;
alter table partners enable row level security;
alter table clusters enable row level security;

create policy "anon_read_requests" on requests for select to anon, authenticated using (true);
create policy "anon_insert_requests" on requests for insert to anon, authenticated with check (true);
create policy "anon_update_requests" on requests for update to anon, authenticated using (true) with check (true);

create policy "anon_read_partners" on partners for select to anon, authenticated using (true);
create policy "anon_read_clusters" on clusters for select to anon, authenticated using (true);
create policy "anon_write_clusters" on clusters for all to anon, authenticated using (true) with check (true);

-- Seed partners (run once)
insert into partners (id, name, type, accepted_materials, lat, lng, locality) values
  ('p1', 'Demo Reuse NGO', 'Reuse', '{Cotton,Denim,Polyester,Wool,Mixed,NotSure}', 17.4401, 78.3489, 'Gachibowli'),
  ('p2', 'Demo Tailor Collective', 'RepairUpcycle', '{Cotton,Denim,Mixed}', 17.4483, 78.3915, 'Madhapur'),
  ('p3', 'Demo Cotton Recycler', 'Recycle', '{Cotton}', 17.4815, 78.3737, 'Kukatpally'),
  ('p4', 'Demo Denim Partner', 'Recycle', '{Denim}', 17.4399, 78.4983, 'Secunderabad'),
  ('p5', 'Demo Wool Recycler', 'Recycle', '{Wool}', 17.3986, 78.5595, 'Uppal'),
  ('p6', 'Demo Mixed-Fibre Recycler', 'Recycle', '{Polyester,Mixed,NotSure}', 17.3478, 78.5524, 'LB Nagar')
on conflict (id) do nothing;
