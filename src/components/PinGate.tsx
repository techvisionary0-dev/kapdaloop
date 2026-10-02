import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { DEMO_PIN } from '@/lib/constants';
import { Button } from './ui';

export function PinGate({ title, children }: { title: string; children: React.ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === DEMO_PIN) {
      setEntered(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (entered) return <>{children}</>;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-soft border border-sage/20 p-8 max-w-sm w-full">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sage/20 flex items-center justify-center mb-3">
            <Lock className="w-7 h-7 text-forest" />
          </div>
          <h2 className="font-display text-xl text-charcoal">{title}</h2>
          <p className="text-sm text-charcoal/60 mt-1">Demo access only</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="Enter demo PIN"
            maxLength={4}
            className="w-full px-4 py-3 rounded-xl border border-sage/40 bg-cream text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-forest"
            aria-label="Demo PIN"
            autoFocus
          />
          {error && <p className="text-sm text-terracotta text-center">Incorrect PIN. Try 1234.</p>}
          <Button type="submit" className="w-full">Enter</Button>
        </form>
        <p className="text-xs text-charcoal/40 text-center mt-4">
          Demo PIN: <span className="font-mono">{DEMO_PIN}</span> — for prototype access only
        </p>
      </div>
    </div>
  );
}
