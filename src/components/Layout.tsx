import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RecycleLoopIcon } from './illustrations';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isPartner = location.pathname.startsWith('/partner');

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/give', label: 'Give Clothes' },
    { to: '/track', label: 'Track' },
    { to: '/admin', label: 'Admin' },
    { to: '/partner', label: 'Partner' },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-sm border-b border-sage/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <RecycleLoopIcon className="w-8 h-8 text-forest transition-transform group-hover:rotate-12" />
            <span className="font-display text-xl text-forest">KapdaLoop</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.to ||
                (link.to !== '/' && location.pathname.startsWith(link.to));
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest ${
                    active
                      ? 'bg-forest text-cream'
                      : 'text-charcoal hover:bg-sage/20'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className={`flex-1 ${isAdmin || isPartner ? 'bg-cream' : ''}`}>{children}</main>
      <footer className="bg-forest text-cream/80 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          <p className="mb-2">
            <span className="font-display text-base text-cream">KapdaLoop</span> — Give every garment a next life
          </p>
          <p className="text-cream/60 text-xs">Prototype: partners and pickups are simulated.</p>
        </div>
      </footer>
    </div>
  );
}
