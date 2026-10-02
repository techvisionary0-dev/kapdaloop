# KapdaLoop

**Give every garment a next life.**

A digital coordination system for textile recovery in Telangana, India. Households submit unwanted clothes, the app classifies them by material and condition, recommends the right next step (reuse / repair-upcycle / recycle), matches to a suitable partner, groups nearby pickups into clusters, and tracks what happened to the clothes.

> Prototype: partners and pickups are simulated.

---

## Run locally

```bash
npm install
npm run dev
```

Open the printed URL in your browser.

### Run tests

```bash
npx vitest run
```

### Build for production

```bash
npm run build
```

Output is in `dist/`. Preview the build locally with `npm run preview`.

---

## Tech stack

- React + Vite + TypeScript + Tailwind CSS
- React Router (HashRouter — works on any static host)
- Leaflet + react-leaflet with OpenStreetMap tiles (CircleMarker, no icon assets needed)
- Recharts for charts, lucide-react for icons
- LocalStorage data layer by default (no backend needed), optional Supabase adapter

---

## How to enable Supabase (optional)

The app runs fully offline with zero env vars using LocalStorage. To use Supabase instead:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the Supabase SQL editor
3. Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. Restart the dev server. The app will automatically switch to the Supabase adapter.

---

## Deploy (free)

### Vercel

```bash
npm i -g vercel
vercel
```

Or connect the GitHub repo at [vercel.com](https://vercel.com). No config needed — Vite is auto-detected.

### Netlify

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

Or drag the `dist/` folder into the Netlify dashboard. Set build command to `npm run build` and publish directory to `dist`.

### Cloudflare Pages

1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Connect your repo
3. Build command: `npm run build`
4. Output directory: `dist`

HashRouter is used so no SPA redirect rules are needed on any platform.

---

## Project structure

```
src/
  lib/
    types.ts          # Shared TypeScript types
    constants.ts      # Theme, materials, conditions, impact config, imagery
    impact.ts         # Impact calculations (CO2e, water)
    geo.ts            # Haversine distance, centroid, coordinate rounding
    routing.ts        # Routing rules (material + condition -> destination + partner)
    cluster.ts        # Clustering algorithm (greedy, haversine-based)
    seed.ts           # 30 seed requests + 6 demo partners
    context.tsx       # React context wrapping the repository
    repo/
      index.ts        # Auto-selects LocalStorage or Supabase
      LocalStorageRepo.ts
      SupabaseRepo.ts
    routing.test.ts   # Unit tests for routing rules
    cluster.test.ts   # Unit tests for clustering algorithm
  components/
    Layout.tsx        # Header, nav, footer
    ui.tsx            # Button, Card, Badge, Spinner, EmptyState, SmartImage
    Counter.tsx       # Animated counter (respects reduced-motion)
    illustrations.tsx # Inline SVG illustrations for material cards
    PinGate.tsx       # Demo PIN gate for Admin/Partner
    RequestMap.tsx    # Leaflet map with CircleMarker
  pages/
    Landing.tsx       # Hero, counters, how-it-works, destinations, CTA
    GiveClothes.tsx   # 3-step wizard: material -> contact -> result
    Track.tsx         # Code entry + impact receipt with timeline
    Admin.tsx         # KPIs, map, filters, clusters, charts, reset, export
    Partner.tsx       # Partner selection, assignments, status updates
supabase/
  schema.sql          # Tables, RLS policies, seed partners
```

---

## Demo PIN

Admin and Partner pages are protected by a demo PIN: **1234**. This is stored in code, not a real auth system. A "Demo access only" note is shown on the gate.

---

## Routing rules

These are implemented as a pure function in `src/lib/routing.ts` and unit-tested:

| Condition | Material | Destination |
|-----------|----------|-------------|
| Wearable | Any | Reuse → NGO |
| Repairable | Cotton / Denim / Mixed | Repair & Upcycle |
| Repairable | Polyester / Wool / Not sure | Repair & Upcycle (partner sorts) |
| Damaged | Cotton | Recycle → Cotton recycler |
| Damaged | Denim | Recycle → Denim partner |
| Damaged | Wool | Recycle → Wool recycler |
| Damaged | Polyester / Mixed / Not sure | Recycle → Mixed-fibre recycler |

Partner matching: filter by destination type + accepted materials, then pick nearest by haversine distance.

---

## Clustering algorithm

Implemented in `src/lib/cluster.ts`, unit-tested:

1. Take Pending requests, sorted by date (oldest first)
2. Pick an unclustered request as seed
3. Add other unclustered requests within 1.5 km of the running centroid
4. Stop at max 12 requests or 40 kg per cluster
5. Drop clusters of 1 (keep as single pickups)
6. Report: households, total kg, centroid, trips saved

This is a greedy heuristic, not optimal routing.

---

## Impact math

All constants are in `src/lib/constants.ts` under `IMPACT`. They are placeholder values labeled "estimates, editable" with a TODO to replace with cited sources. Every impact number in the UI is prefixed with "estimated".

---

## Demo script (3 minutes)

1. **Submit clothes**: Go to "Give Clothes" → select Cotton, Wearable, 3 kg → enter name, phone, select "Gachibowli" → see recommendation (Reuse → Demo Reuse NGO) → Submit → note tracking code (e.g. KL-4821)

2. **Admin sees marker**: Go to "Admin" → enter PIN 1234 → see the new request on the live map (green dot for Wearable) → find it in the requests table

3. **Generate cluster**: Click "Generate clusters" → see cluster cards grouping nearby pending pickups → assign a partner → click "Mark scheduled"

4. **Assign partner**: In the requests table, change the new request's status to "Collected" → then "Sent to Partner"

5. **Partner view**: Go to "Partner" → enter PIN → select "Demo Reuse NGO" → see the assignment → mark "Received" → mark "Recovered"

6. **User receipt**: Go to "Track" → enter the tracking code → see the timeline with "Recovered" highlighted → see estimated CO2e and water saved

---

## Notes

- The app uses HashRouter so it works on any static host without redirect config
- All map markers use CircleMarker (no icon asset loading issues)
- Images from Pexels have a green-gradient fallback via onError
- Refreshing the page keeps data (LocalStorage)
- "Reset demo data" in Admin restores the original seed data
