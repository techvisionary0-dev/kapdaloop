import React, { useState, useMemo } from 'react';
import { RotateCcw, Printer, Layers, Filter, Package, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useApp } from '@/lib/context';
import { PinGate } from '@/components/PinGate';
import { Button, Card, Badge, EmptyState, Spinner } from '@/components/ui';
import { RequestMap } from '@/components/RequestMap';
import { generateClusters, tripsSaved, materialMix } from '@/lib/cluster';
import { totalImpact, formatKg } from '@/lib/impact';
import { CONDITION_COLORS, MATERIAL_LABELS, MATERIALS, DESTINATION_LABELS } from '@/lib/constants';
import { STATUS_ORDER, STATUS_LABELS } from '@/lib/types';
import type { RequestStatus, Material, Condition } from '@/lib/types';

export function Admin() {
  return (
    <PinGate title="Admin Dashboard">
      <AdminContent />
    </PinGate>
  );
}

function AdminContent() {
  const { requests, partners, clusters, saveClusters, updateRequest, reset, loading } = useApp();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMaterial, setFilterMaterial] = useState<string>('all');
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [generating, setGenerating] = useState(false);

  const impact = totalImpact(requests);
  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  const filtered = useMemo(() => {
    return requests.filter((r) =>
      (filterStatus === 'all' || r.status === filterStatus) &&
      (filterMaterial === 'all' || r.material === filterMaterial) &&
      (filterCondition === 'all' || r.condition === filterCondition)
    );
  }, [requests, filterStatus, filterMaterial, filterCondition]);

  const handleGenerateClusters = async () => {
    setGenerating(true);
    const result = generateClusters(requests);
    await saveClusters(result.clusters);
    setGenerating(false);
  };

  const handleAssignPartner = async (clusterId: string, partnerId: string) => {
    const updated = clusters.map((c) =>
      c.id === clusterId ? { ...c, partnerId } : c
    );
    await saveClusters(updated);
  };

  const handleScheduleCluster = async (clusterId: string) => {
    const updated = clusters.map((c) =>
      c.id === clusterId ? { ...c, scheduled: true } : c
    );
    await saveClusters(updated);
    // Update all requests in cluster to PickupScheduled
    const cluster = clusters.find((c) => c.id === clusterId);
    if (cluster) {
      for (const reqId of cluster.requestIds) {
        const req = requests.find((r) => r.id === reqId);
        if (req && req.status === 'Pending') {
          await updateRequest(reqId, { status: 'PickupScheduled', clusterId, partnerId: cluster.partnerId });
        }
      }
    }
  };

  const handleStatusChange = async (reqId: string, newStatus: RequestStatus) => {
    await updateRequest(reqId, { status: newStatus });
  };

  const handleReset = async () => {
    if (confirm('Reset all demo data? This will restore the original seed data.')) {
      await reset();
    }
  };

  // Chart data
  const kgByMaterial = MATERIALS.map((m) => ({
    name: m.label,
    kg: requests.filter((r) => r.material === m.value).reduce((s, r) => s + r.weightKg, 0),
    color: m.color,
  })).filter((d) => d.kg > 0);

  const destinationSplit = (['Reuse', 'RepairUpcycle', 'Recycle'] as const).map((d) => ({
    name: DESTINATION_LABELS[d],
    count: requests.filter((r) => r.destinationType === d).length,
    color: d === 'Reuse' ? '#2F5D3A' : d === 'RepairUpcycle' ? '#3E5C76' : '#C8643C',
  }));

  const requestsOverTime = useMemo(() => {
    const days: Record<string, number> = {};
    requests.forEach((r) => {
      const d = new Date(r.createdAt).toISOString().slice(0, 10);
      days[d] = (days[d] ?? 0) + 1;
    });
    return Object.entries(days)
      .sort()
      .slice(-14)
      .map(([date, count]) => ({ date: date.slice(5), count }));
  }, [requests]);

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner className="text-3xl text-forest" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Admin Dashboard</h1>
          <p className="text-sm text-charcoal/60 mt-1">Demo access only · Partners and pickups are simulated</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" /> Reset demo data
          </Button>
          <Button variant="secondary" size="sm" onClick={() => window.print()}>
            <Printer className="w-4 h-4" /> Export report
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={Package} label="Total Requests" value={requests.length.toString()} color="forest" />
        <KpiCard icon={TrendingUp} label="kg Collected" value={formatKg(impact.kgCollected)} color="denim" />
        <KpiCard icon={Clock} label="Pending" value={pendingCount.toString()} color="terracotta" />
        <KpiCard icon={CheckCircle2} label="Recovered" value={impact.recovered.toString()} color="forest" />
      </div>

      {/* Map */}
      <Card className="p-4 mb-8 print-hidden">
        <h2 className="font-display text-xl text-charcoal mb-3">Live Pickup Map</h2>
        <div className="flex flex-wrap gap-3 mb-3 text-xs">
          <Badge color={CONDITION_COLORS.Wearable}>Wearable</Badge>
          <Badge color={CONDITION_COLORS.Repairable}>Repairable</Badge>
          <Badge color={CONDITION_COLORS.Damaged}>Damaged</Badge>
        </div>
        <RequestMap requests={requests} partners={partners} showPartners height="450px" />
      </Card>

      {/* Clusters */}
      <Card className="p-4 mb-8 print-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl text-charcoal flex items-center gap-2">
            <Layers className="w-5 h-5 text-forest" /> Collection Clusters
          </h2>
          <Button size="sm" onClick={handleGenerateClusters} disabled={generating}>
            {generating ? <Spinner /> : <Layers className="w-4 h-4" />}
            Generate clusters
          </Button>
        </div>
        {clusters.length === 0 ? (
          <EmptyState
            icon={<Layers className="w-8 h-8" />}
            title="No clusters yet"
            message="Click 'Generate clusters' to group nearby pending pickups into efficient routes."
          />
        ) : (
          <div className="space-y-3">
            <div className="text-sm text-charcoal/60">
              {clusters.length} cluster{clusters.length !== 1 ? 's' : ''} · {tripsSaved(clusters)} separate trips saved → combined into fewer routes
            </div>
            {clusters.map((cluster) => {
              const mix = materialMix(cluster.requestIds, requests);
              const clusterReqs = requests.filter((r) => cluster.requestIds.includes(r.id));
              return (
                <div key={cluster.id} className="border border-sage/20 rounded-xl p-4 bg-cream/50">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="font-medium text-charcoal">{cluster.id}</div>
                      <div className="text-xs text-charcoal/60">
                        {cluster.requestIds.length} households · {formatKg(cluster.totalKg)} ·
                        {' '}{clusterReqs.length} separate trips → 1 route
                      </div>
                    </div>
                    {cluster.scheduled && <Badge color="#2F5D3A">Scheduled</Badge>}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {Object.entries(mix).map(([mat, count]) => (
                      <Badge key={mat} color={MATERIALS.find((m) => m.value === mat)?.color ?? '#ccc'}>
                        {MATERIAL_LABELS[mat as Material]} ×{count}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {!cluster.scheduled && (
                      <>
                        <select
                          value={cluster.partnerId ?? ''}
                          onChange={(e) => handleAssignPartner(cluster.id, e.target.value)}
                          className="text-sm px-3 py-1.5 rounded-lg border border-sage/40 bg-white"
                        >
                          <option value="">Assign partner...</option>
                          {partners.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={!cluster.partnerId}
                          onClick={() => handleScheduleCluster(cluster.id)}
                        >
                          Mark scheduled
                        </Button>
                      </>
                    )}
                    {cluster.partnerId && (
                      <span className="text-xs text-charcoal/60">
                        → {partners.find((p) => p.id === cluster.partnerId)?.name ?? 'Unassigned'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Requests table */}
      <Card className="p-4 mb-8 print-hidden">
        <h2 className="font-display text-xl text-charcoal mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-forest" /> Requests
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg border border-sage/40 bg-white">
            <option value="all">All statuses</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
          <select value={filterMaterial} onChange={(e) => setFilterMaterial(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg border border-sage/40 bg-white">
            <option value="all">All materials</option>
            {MATERIALS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} className="text-sm px-3 py-1.5 rounded-lg border border-sage/40 bg-white">
            <option value="all">All conditions</option>
            <option value="Wearable">Wearable</option>
            <option value="Repairable">Repairable</option>
            <option value="Damaged">Damaged</option>
          </select>
          <span className="text-sm text-charcoal/50 self-center">{filtered.length} results</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-sage/20 text-charcoal/60">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Material</th>
                <th className="py-2 pr-3">Condition</th>
                <th className="py-2 pr-3">Weight</th>
                <th className="py-2 pr-3">Locality</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map((req) => (
                <tr key={req.id} className="border-b border-sage/10 hover:bg-cream/50">
                  <td className="py-2 pr-3 font-mono text-xs">{req.trackingCode}</td>
                  <td className="py-2 pr-3">{MATERIAL_LABELS[req.material]}</td>
                  <td className="py-2 pr-3">
                    <Badge color={CONDITION_COLORS[req.condition as Condition]}>{req.condition}</Badge>
                  </td>
                  <td className="py-2 pr-3">{formatKg(req.weightKg)}</td>
                  <td className="py-2 pr-3 text-xs">{req.locality}</td>
                  <td className="py-2 pr-3">
                    <select
                      value={req.status}
                      onChange={(e) => handleStatusChange(req.id, e.target.value as RequestStatus)}
                      className="text-xs px-2 py-1 rounded-lg border border-sage/40 bg-white"
                    >
                      {STATUS_ORDER.map((s) => (
                        <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 print-hidden">
        <Card className="p-4">
          <h3 className="font-display text-base text-charcoal mb-4">kg by Material</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={kgByMaterial} dataKey="kg" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                {kgByMaterial.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {kgByMaterial.map((d) => (
              <span key={d.name} className="text-xs text-charcoal/60 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} /> {d.name}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-display text-base text-charcoal mb-4">Destination Split</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={destinationSplit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A9BFA0" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {destinationSplit.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="font-display text-base text-charcoal mb-4">Requests Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={requestsOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#A9BFA0" opacity={0.3} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2F5D3A" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Print-only report */}
      <div className="print-only">
        <h1 className="font-display text-2xl">KapdaLoop Impact Report</h1>
        <p className="text-sm">Generated: {new Date().toLocaleDateString()}</p>
        <div className="mt-4">
          <h2 className="font-display text-lg">Summary</h2>
          <p>Total requests: {requests.length}</p>
          <p>kg collected: {formatKg(impact.kgCollected)}</p>
          <p>Recovered: {impact.recovered}</p>
          <p>Households: {impact.households}</p>
          <p>Estimated CO₂e avoided: {impact.co2e} kg</p>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, color }: { icon: React.FC<{ className?: string; style?: React.CSSProperties }>; label: string; value: string; color: string }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-sm text-charcoal/60">{label}</span>
      </div>
      <div className="font-display text-2xl text-charcoal">{value}</div>
    </Card>
  );
}
