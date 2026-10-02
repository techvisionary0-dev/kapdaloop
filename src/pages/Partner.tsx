import React, { useState, useMemo } from 'react';
import { Check, X, Package, Factory } from 'lucide-react';
import { useApp } from '@/lib/context';
import { PinGate } from '@/components/PinGate';
import { Button, Card, Badge, EmptyState, Spinner } from '@/components/ui';
import { MATERIAL_LABELS, DESTINATION_LABELS } from '@/lib/constants';
import { formatKg } from '@/lib/impact';
import type { Partner, RequestStatus } from '@/lib/types';

export function Partner() {
  return (
    <PinGate title="Partner Portal">
      <PartnerContent />
    </PinGate>
  );
}

function PartnerContent() {
  const { requests, partners, clusters, updateRequest, loading } = useApp();
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId) ?? null;

  const partnerRequests = useMemo(() => {
    if (!selectedPartner) return [];
    // Requests assigned to this partner either directly or via cluster
    return requests.filter((r) => {
      if (r.partnerId === selectedPartner.id) return true;
      const cluster = clusters.find((c) => c.id === r.clusterId);
      return cluster?.partnerId === selectedPartner.id;
    });
  }, [requests, clusters, selectedPartner]);

  // Available material totals from pending requests that match partner's accepted materials
  const availableMaterials = useMemo(() => {
    if (!selectedPartner) return [];
    const totals: Record<string, number> = {};
    requests
      .filter((r) => r.status === 'Pending' && selectedPartner.acceptedMaterials.includes(r.material))
      .forEach((r) => {
        totals[r.material] = (totals[r.material] ?? 0) + r.weightKg;
      });
    return Object.entries(totals).map(([mat, kg]) => ({ material: mat as keyof typeof MATERIAL_LABELS, kg }));
  }, [requests, selectedPartner]);

  const handleAccept = async (reqId: string) => {
    await updateRequest(reqId, { status: 'SentToPartner' });
  };

  const handleDecline = async (reqId: string) => {
    await updateRequest(reqId, { partnerId: undefined, status: 'Pending' });
  };

  const handleStatusUpdate = async (reqId: string, status: RequestStatus) => {
    await updateRequest(reqId, { status });
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner className="text-3xl text-forest" /></div>;
  }

  if (!selectedPartnerId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl text-charcoal mb-2">Partner Portal</h1>
        <p className="text-sm text-charcoal/60 mb-8">Demo access only · Choose your partner profile to continue</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {partners.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPartnerId(p.id)}
              className="text-left p-6 rounded-2xl border-2 border-sage/20 bg-white hover:border-forest transition-all shadow-soft"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-display text-lg text-charcoal">{p.name}</div>
                  <div className="text-xs text-charcoal/60 mt-1">{DESTINATION_LABELS[p.type]} · {p.locality}</div>
                </div>
                <Badge color={p.type === 'Reuse' ? '#2F5D3A' : p.type === 'RepairUpcycle' ? '#3E5C76' : '#C8643C'}>
                  {DESTINATION_LABELS[p.type]}
                </Badge>
              </div>
              <div className="text-xs text-charcoal/50">
                Accepts: {p.acceptedMaterials.map((m) => MATERIAL_LABELS[m]).join(', ')}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl text-charcoal">{selectedPartner?.name}</h1>
          <p className="text-sm text-charcoal/60">{DESTINATION_LABELS[selectedPartner!.type]} · {selectedPartner!.locality}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setSelectedPartnerId('')}>Switch partner</Button>
      </div>

      {/* Available materials */}
      <Card className="p-4 mb-6">
        <h2 className="font-display text-base text-charcoal mb-3">Available Material (Pending)</h2>
        {availableMaterials.length === 0 ? (
          <p className="text-sm text-charcoal/50">No pending requests matching your accepted materials right now.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {availableMaterials.map(({ material, kg }) => (
              <div key={material} className="bg-cream/50 rounded-xl p-3 text-center">
                <div className="font-display text-lg text-forest">{formatKg(kg)}</div>
                <div className="text-xs text-charcoal/60">{MATERIAL_LABELS[material]}</div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Assigned requests */}
      <Card className="p-4">
        <h2 className="font-display text-base text-charcoal mb-4">Your Assignments</h2>
        {partnerRequests.length === 0 ? (
          <EmptyState
            icon={<Package className="w-8 h-8" />}
            title="No assignments yet"
            message="When the admin assigns clusters or individual pickups to you, they will appear here."
          />
        ) : (
          <div className="space-y-3">
            {partnerRequests.map((req) => (
              <div key={req.id} className="border border-sage/20 rounded-xl p-4">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs text-charcoal/50">{req.trackingCode}</span>
                    <div className="font-medium text-charcoal text-sm mt-1">
                      {MATERIAL_LABELS[req.material]} · {req.condition} · {formatKg(req.weightKg)}
                    </div>
                    <div className="text-xs text-charcoal/50 mt-1">{req.locality} · {req.name}</div>
                  </div>
                  <Badge color={CONDITION_COLOR[req.condition]}>{req.status}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {req.status === 'SentToPartner' && (
                    <>
                      <Button size="sm" onClick={() => handleStatusUpdate(req.id, 'Sorted')}>
                        <Check className="w-3 h-3" /> Mark sorted
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => handleStatusUpdate(req.id, 'Recovered')}>
                        <Factory className="w-3 h-3" /> Mark recovered
                      </Button>
                    </>
                  )}
                  {req.status === 'Sorted' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(req.id, 'Recovered')}>
                      <Check className="w-3 h-3" /> Mark recovered
                    </Button>
                  )}
                  {req.status === 'PickupScheduled' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(req.id, 'Collected')}>
                      <Package className="w-3 h-3" /> Mark collected
                    </Button>
                  )}
                  {req.status === 'Collected' && (
                    <Button size="sm" onClick={() => handleStatusUpdate(req.id, 'SentToPartner')}>
                      <Factory className="w-3 h-3" /> Received at facility
                    </Button>
                  )}
                  {req.status !== 'Recovered' && req.status !== 'Sorted' && (
                    <Button size="sm" variant="ghost" onClick={() => handleDecline(req.id)}>
                      <X className="w-3 h-3" /> Decline
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

const CONDITION_COLOR: Record<string, string> = {
  Wearable: '#2F5D3A',
  Repairable: '#3E5C76',
  Damaged: '#C8643C',
};
