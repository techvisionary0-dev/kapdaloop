import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Truck, Recycle, Search } from 'lucide-react';
import { useApp } from '@/lib/context';
import { AnimatedCounter } from '@/components/Counter';
import { SmartImage, Button } from '@/components/ui';
import { RecycleLoopIcon } from '@/components/illustrations';
import { totalImpact, formatKg } from '@/lib/impact';
import { HERO_IMAGE, REUSE_IMAGE, REPAIR_IMAGE, RECYCLE_IMAGE } from '@/lib/constants';

export function Landing() {
  const { requests, loading } = useApp();
  const impact = totalImpact(requests);

  const steps = [
    { icon: Search, title: 'Submit', desc: 'Tell us what clothes you have and their condition' },
    { icon: MapPin, title: 'We route it', desc: 'We match your clothes to the right local partner' },
    { icon: Truck, title: 'Pickup', desc: 'We cluster nearby pickups into one efficient route' },
    { icon: Recycle, title: 'Recover', desc: 'Your clothes get a next life — and you track it' },
  ];

  const destinations = [
    {
      title: 'Reuse',
      image: REUSE_IMAGE,
      alt: 'Clothing racks in a thrift shop',
      desc: 'Wearable clothes go to an NGO partner who distributes them directly to people who need them.',
      color: 'forest',
    },
    {
      title: 'Repair & Upcycle',
      image: REPAIR_IMAGE,
      alt: 'Sewing needle threading through denim fabric',
      desc: 'Repairable clothes are mended or transformed into new products by a tailor collective.',
      color: 'denim',
    },
    {
      title: 'Recycle',
      image: RECYCLE_IMAGE,
      alt: 'Colorful fabric rolls showing textile diversity',
      desc: 'Damaged clothes are sent to material-specific recyclers who reclaim the fibres.',
      color: 'terracotta',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest text-cream">
        <div className="absolute inset-0 opacity-20">
          <SmartImage
            src={HERO_IMAGE}
            alt="Neatly folded green linen clothes stacked"
            className="w-full h-full object-cover"
            fallbackClassName="w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-forest via-forest/80 to-forest/40" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl fade-in-up">
            <div className="flex items-center gap-2 mb-4 text-sage">
              <RecycleLoopIcon className="w-6 h-6" />
              <span className="text-sm font-medium tracking-wide">KapdaLoop · Telangana</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-tight mb-4">
              Don't throw it. Give it a next life.
            </h1>
            <p className="text-lg text-cream/80 mb-8 leading-relaxed">
              Every year, millions of garments end up in landfills across India. KapdaLoop connects your unwanted clothes to the right local partner — for reuse, repair, or recycling — and tracks what happens next.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/give">
                <Button size="lg" variant="secondary" className="group">
                  Give My Clothes
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="ghost" className="text-cream hover:bg-cream/10">
                  Track a Pickup
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Counters */}
      <section className="bg-forest-dark -mt-1 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-cream/60">Loading live data...</div>
          ) : (
            <>
              <AnimatedCounter value={impact.kgCollected} label="kg recovered (estimated)" suffix=" kg" />
              <AnimatedCounter value={impact.households} label="households participated" />
              <AnimatedCounter value={impact.co2e} label="kg CO₂e avoided (estimated)" />
            </>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-12">
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className="bg-white rounded-2xl p-6 shadow-soft border border-sage/20 text-center fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-forest" />
                </div>
                <div className="text-sm text-sage font-medium mb-1">Step {i + 1}</div>
                <h3 className="font-display text-lg text-charcoal mb-2">{step.title}</h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where your clothes go */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-4">
            Where your clothes go
          </h2>
          <p className="text-center text-charcoal/60 mb-12 max-w-2xl mx-auto">
            Every garment is routed to the destination that fits its material and condition — not a one-size-fits-all bin.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div key={dest.title} className="group rounded-2xl overflow-hidden shadow-soft border border-sage/20 bg-cream">
                <div className="h-48 overflow-hidden">
                  <SmartImage
                    src={dest.image}
                    alt={dest.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fallbackClassName="w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl text-charcoal mb-2">{dest.title}</h3>
                  <p className="text-sm text-charcoal/60 leading-relaxed">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <RecycleLoopIcon className="w-16 h-16 text-forest mx-auto mb-6" />
          <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
            Ready to give your clothes a next life?
          </h2>
          <p className="text-charcoal/60 mb-8">
            It takes less than two minutes. You'll get a tracking code to follow your clothes through every step.
          </p>
          <Link to="/give">
            <Button size="lg" className="group">
              Give My Clothes
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
