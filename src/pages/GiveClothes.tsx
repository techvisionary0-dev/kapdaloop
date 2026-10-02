import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MapPin, Navigation, Phone } from 'lucide-react';
import { useApp } from '@/lib/context';
import { Button, Card, SmartImage } from '@/components/ui';
import { getMaterialIcon } from '@/components/illustrations';
import { MATERIALS, CONDITIONS, LOCALITIES, MATERIAL_LABELS, DESTINATION_LABELS } from '@/lib/constants';
import { routeRequest } from '@/lib/routing';
import { formatKg, formatCo2e, co2eAvoidedKg } from '@/lib/impact';
import type { Material, Condition } from '@/lib/types';
import { RequestMap } from '@/components/RequestMap';

export function GiveClothes() {
  const navigate = useNavigate();
  const { partners, createRequest } = useApp();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ code: string } | null>(null);

  // Step 1
  const [material, setMaterial] = useState<Material | null>(null);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [weight, setWeight] = useState(2);
  const [note, setNote] = useState('');

  // Step 2
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('');
  const [lat, setLat] = useState(17.4401);
  const [lng, setLng] = useState(78.3489);
  const [geoError, setGeoError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [usingGeo, setUsingGeo] = useState(false);

  const routing = useMemo(() => {
    if (!material || !condition) return null;
    return routeRequest(material, condition, partners, lat, lng);
  }, [material, condition, partners, lat, lng]);

  const phoneValid = /^\d{10}$/.test(phone.replace(/\s/g, ''));
  const step1Valid = material && condition;
  const step2Valid = name.trim() && phoneValid && locality;

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not available. Please select your locality from the dropdown.');
      return;
    }
    setGeoError('');
    setUsingGeo(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setUsingGeo(true);
      },
      () => {
        setGeoError('Could not access your location. Please select your locality from the dropdown.');
        setUsingGeo(false);
      },
      { timeout: 8000 }
    );
  };

  const handleLocalityChange = (name: string) => {
    setLocality(name);
    const loc = LOCALITIES.find((l) => l.name === name);
    if (loc) {
      setLat(loc.lat);
      setLng(loc.lng);
      setUsingGeo(false);
    }
  };

  const handleSubmit = async () => {
    if (!material || !condition || !routing) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const req = await createRequest({
        trackingCode: '',
        material,
        condition,
        weightKg: weight,
        note: note || undefined,
        name,
        phone,
        locality,
        lat,
        lng,
        destinationType: routing.destinationType,
        partnerId: routing.partner?.id,
      });
      setSubmitted({ code: req.trackingCode });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Failed to submit request:', err);
      setSubmitError(`Could not submit your request: ${message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-forest/10 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-forest" />
        </div>
        <h1 className="font-display text-3xl text-charcoal mb-3">Your pickup is registered!</h1>
        <p className="text-charcoal/60 mb-6">Save this tracking code to follow your clothes' journey:</p>
        <div className="bg-forest text-cream rounded-2xl py-6 px-8 inline-block mb-8">
          <div className="text-sm text-cream/70 mb-1">Tracking Code</div>
          <div className="font-display text-3xl tracking-wider">{submitted.code}</div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button onClick={() => navigate(`/track/${submitted.code}`)}>
            View Receipt
          </Button>
          <Button variant="secondary" onClick={() => navigate('/track')}>
            Track Another Code
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="font-display text-3xl text-charcoal mb-2">Give Your Clothes a Next Life</h1>
      <p className="text-charcoal/60 mb-8">Three quick steps — it takes less than two minutes.</p>

      {/* Progress bar */}
      <div className="flex items-center mb-8">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s <= step ? 'bg-forest text-cream' : 'bg-sage/20 text-charcoal/40'
              }`}
            >
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 rounded transition-colors ${s < step ? 'bg-forest' : 'bg-sage/20'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-6 fade-in-up">
          <div>
            <h2 className="font-display text-xl text-charcoal mb-3">What material?</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {MATERIALS.map((m) => {
                const Icon = getMaterialIcon(m.value);
                return (
                  <button
                    key={m.value}
                    onClick={() => setMaterial(m.value)}
                    className={`p-4 rounded-2xl border-2 transition-all text-left ${
                      material === m.value
                        ? 'border-forest bg-sage/10 shadow-soft'
                        : 'border-sage/20 bg-white hover:border-sage/40'
                    }`}
                  >
                    <Icon className="w-10 h-10 mb-2" style={{ color: COLORS_FOR[m.value] }} />
                    <div className="font-medium text-charcoal text-sm">{m.label}</div>
                    <div className="text-xs text-charcoal/50">{m.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-charcoal mb-3">What condition?</h2>
            <div className="grid grid-cols-3 gap-3">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setCondition(c.value)}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    condition === c.value
                      ? 'border-forest bg-sage/10 shadow-soft'
                      : 'border-sage/20 bg-white hover:border-sage/40'
                  }`}
                >
                  <div className="font-medium text-charcoal text-sm">{c.label}</div>
                  <div className="text-xs text-charcoal/50 mt-1">{c.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-xl text-charcoal mb-3">
              Approximate weight: <span className="text-forest">{formatKg(weight)}</span>
            </h2>
            <input
              type="range"
              min="0.5"
              max="20"
              step="0.5"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-forest"
              aria-label="Weight in kilograms"
            />
            <div className="flex items-center gap-2 mt-2">
              <input
                type="number"
                min="0.5"
                max="50"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value) || 0.5)}
                className="w-20 px-3 py-1.5 rounded-lg border border-sage/40 bg-cream text-sm"
                aria-label="Weight in kg"
              />
              <span className="text-sm text-charcoal/60">kg</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. kids summer clothes, winter clearout..."
              className="w-full px-4 py-3 rounded-xl border border-sage/40 bg-cream text-sm resize-none focus:outline-none focus:ring-2 focus:ring-forest"
              rows={2}
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={() => setStep(2)} disabled={!step1Valid}>
              Continue
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 fade-in-up">
          <div className="bg-sage/10 rounded-2xl p-4 text-sm text-charcoal/70">
            Keep clothes clean and dry; keep categories separate. This helps our partners process them faster.
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Your name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full px-4 py-3 rounded-xl border border-sage/40 bg-cream focus:outline-none focus:ring-2 focus:ring-forest"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Phone number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                inputMode="tel"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-sage/40 bg-cream focus:outline-none focus:ring-2 focus:ring-forest"
              />
            </div>
            {phone && !phoneValid && (
              <p className="text-xs text-terracotta mt-1">Please enter a valid 10-digit number</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Locality (Hyderabad areas)</label>
            <select
              value={locality}
              onChange={(e) => handleLocalityChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-sage/40 bg-cream focus:outline-none focus:ring-2 focus:ring-forest"
            >
              <option value="">Select your area...</option>
              {LOCALITIES.map((l) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
          </div>

          <div>
            <Button variant="secondary" size="sm" onClick={handleUseLocation} className="mb-3">
              <Navigation className="w-4 h-4" />
              Use my location
            </Button>
            {geoError && <p className="text-xs text-terracotta mb-2">{geoError}</p>}
            {usingGeo && locality && (
              <p className="text-xs text-forest mb-2">Using your device location. Pin shown on map below.</p>
            )}
            {locality && (
              <div className="text-xs text-charcoal/50 mb-2 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Approximate pin: {lat.toFixed(4)}, {lng.toFixed(4)}
              </div>
            )}
            {locality && (
              <div style={{ height: '200px' }}>
                <RequestMap
                  requests={[{ id: 'temp', trackingCode: 'PIN', material: material ?? 'Cotton', condition: condition ?? 'Wearable', weightKg: weight, name, phone, locality, lat, lng, status: 'Pending', destinationType: 'Reuse', createdAt: new Date().toISOString() }]}
                  height="200px"
                  center={[lat, lng]}
                  zoom={14}
                />
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!step2Valid}>
              See Recommendation
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && routing && (
        <div className="space-y-6 fade-in-up">
          <Card className="p-6">
            <div className="text-sm text-sage font-medium mb-2">Recommended destination</div>
            <h2 className="font-display text-2xl text-forest mb-3">
              {DESTINATION_LABELS[routing.destinationType]}
            </h2>
            <p className="text-charcoal/70 leading-relaxed mb-4">{routing.reason}</p>
            {routing.partner && (
              <div className="bg-sage/10 rounded-xl p-4">
                <div className="text-sm font-medium text-charcoal">{routing.partner.name}</div>
                <div className="text-xs text-charcoal/60 mt-1">
                  Located in {routing.partner.locality} · Accepts: {routing.partner.acceptedMaterials.map(m => MATERIAL_LABELS[m]).join(', ')}
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-charcoal/60">Estimated impact:</span>
              <span className="font-medium text-forest">{formatCo2e(co2eAvoidedKg({ ...({} as any), destinationType: routing.destinationType, weightKg: weight }))} CO₂e avoided</span>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-display text-lg text-charcoal mb-4">Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-charcoal/60">Material</dt><dd className="font-medium">{MATERIAL_LABELS[material!]}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/60">Condition</dt><dd className="font-medium">{condition}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/60">Weight</dt><dd className="font-medium">{formatKg(weight)}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/60">Name</dt><dd className="font-medium">{name}</dd></div>
              <div className="flex justify-between"><dt className="text-charcoal/60">Locality</dt><dd className="font-medium">{locality}</dd></div>
            </dl>
          </Card>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} size="lg">
              {submitting ? 'Submitting...' : 'Submit Request'}
              {!submitting && <Check className="w-4 h-4" />}
            </Button>
          </div>
          {submitError && (
            <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-4 text-sm text-terracotta">
              {submitError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const COLORS_FOR: Record<Material, string> = {
  Cotton: '#E8DCC4',
  Denim: '#5B7A99',
  Polyester: '#B8C5D6',
  Wool: '#C4A882',
  Mixed: '#A9BFA0',
  NotSure: '#D4D4D4',
};
