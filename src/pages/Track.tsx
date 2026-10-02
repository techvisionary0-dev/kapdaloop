import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, MapPin, Package, Truck, Factory, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '@/lib/context';
import { Button, Card, EmptyState } from '@/components/ui';
import { STATUS_ORDER, STATUS_LABELS } from '@/lib/types';
import type { RecyclingRequest, RequestStatus } from '@/lib/types';
import { MATERIAL_LABELS, DESTINATION_LABELS } from '@/lib/constants';
import { approxCoords } from '@/lib/geo';
import { formatKg, formatCo2e, co2eAvoidedKg, waterSavedLitres, formatWater } from '@/lib/impact';

export function Track() {
  const { code: paramCode } = useParams();
  const navigate = useNavigate();
  const { getRequest, loading } = useApp();
  const [input, setInput] = useState(paramCode ?? '');
  const [searched, setSearched] = useState<RecyclingRequest | null | undefined>(undefined);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (paramCode) {
      setInput(paramCode);
      setSearching(true);
      getRequest(paramCode)
        .then((req) => setSearched(req))
        .catch(() => setSearched(null))
        .finally(() => setSearching(false));
    } else {
      setSearched(undefined);
    }
  }, [paramCode, getRequest]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const code = input.trim().toUpperCase();
    navigate(`/track/${code}`);
  };

  if ((loading || searching) && searched === undefined) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-charcoal/60">Loading...</div>;
  }

  const req = searched;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="font-display text-3xl text-charcoal mb-6">Track Your Clothes</h1>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter tracking code (e.g. KL-4821)"
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/40 bg-cream focus:outline-none focus:ring-2 focus:ring-forest"
          />
        </div>
        <Button type="submit">Track</Button>
      </form>

      {paramCode && searched === null && !loading && !searching && (
        <Card className="p-6">
          <EmptyState
            icon={<Search className="w-8 h-8" />}
            title="Code not found"
            message={`No request found with code "${paramCode}". Check the code and try again.`}
          />
        </Card>
      )}

      {req && <Receipt req={req} />}
    </div>
  );
}

const STATUS_ICONS: Record<RequestStatus, React.FC<{ className?: string }>> = {
  Pending: Clock,
  PickupScheduled: Truck,
  Collected: Package,
  Sorted: Package,
  SentToPartner: Factory,
  Recovered: CheckCircle2,
};

function Receipt({ req }: { req: RecyclingRequest }) {
  const currentIdx = STATUS_ORDER.indexOf(req.status);
  const approx = approxCoords(req.lat, req.lng);
  const co2 = co2eAvoidedKg(req);
  const water = waterSavedLitres(req);

  return (
    <div className="space-y-6 fade-in-up">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-charcoal/50">Tracking Code</div>
            <div className="font-display text-2xl text-forest">{req.trackingCode}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-charcoal/50">Status</div>
            <div className="font-medium text-charcoal">{STATUS_LABELS[req.status]}</div>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-1 mt-6">
          {STATUS_ORDER.map((status, i) => {
            const Icon = STATUS_ICONS[status];
            const done = i <= currentIdx;
            const current = i === currentIdx;
            return (
              <div key={status} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      done ? 'bg-forest text-cream' : 'bg-sage/20 text-charcoal/30'
                    } ${current ? 'ring-4 ring-forest/20' : ''}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {i < STATUS_ORDER.length - 1 && (
                    <div className={`w-0.5 h-6 ${i < currentIdx ? 'bg-forest' : 'bg-sage/20'}`} />
                  )}
                </div>
                <div className={`pb-6 ${current ? 'font-medium text-forest' : done ? 'text-charcoal' : 'text-charcoal/40'}`}>
                  {STATUS_LABELS[status]}
                  {current && <span className="text-xs text-sage ml-2">— current step</span>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-display text-lg text-charcoal mb-4">Details</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-charcoal/60">Material</dt><dd className="font-medium">{MATERIAL_LABELS[req.material]}</dd></div>
          <div className="flex justify-between"><dt className="text-charcoal/60">Condition</dt><dd className="font-medium">{req.condition}</dd></div>
          <div className="flex justify-between"><dt className="text-charcoal/60">Weight</dt><dd className="font-medium">{formatKg(req.weightKg)}</dd></div>
          <div className="flex justify-between"><dt className="text-charcoal/60">Destination</dt><dd className="font-medium">{DESTINATION_LABELS[req.destinationType]}</dd></div>
          <div className="flex justify-between"><dt className="text-charcoal/60">Locality</dt><dd className="font-medium">{req.locality}</dd></div>
          <div className="flex justify-between"><dt className="text-charcoal/60 flex items-center gap-1"><MapPin className="w-3 h-3" /> Approx. location</dt><dd className="font-medium text-xs">{approx.lat.toFixed(2)}, {approx.lng.toFixed(2)} (~1 km area)</dd></div>
          {req.note && <div className="flex justify-between"><dt className="text-charcoal/60">Note</dt><dd className="font-medium text-right">{req.note}</dd></div>}
        </dl>
      </Card>

      <Card className="p-6 bg-sage/5">
        <h3 className="font-display text-lg text-charcoal mb-4">Estimated Impact</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="font-display text-2xl text-forest">{formatCo2e(co2)}</div>
            <div className="text-xs text-charcoal/60 mt-1">estimated CO₂e avoided</div>
          </div>
          <div className="text-center">
            <div className="font-display text-2xl text-denim">{formatWater(water)}</div>
            <div className="text-xs text-charcoal/60 mt-1">estimated water saved</div>
          </div>
        </div>
        <p className="text-xs text-charcoal/40 mt-4 text-center">
          Impact figures are estimates, editable. Actual results depend on processing.
        </p>
      </Card>
    </div>
  );
}
