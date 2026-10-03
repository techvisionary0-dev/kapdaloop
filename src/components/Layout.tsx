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
      <footer className="bg-forest text-cream mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <RecycleLoopIcon className="w-7 h-7 text-sage" />
                <span className="font-display text-xl text-cream">KapdaLoop</span>
              </div>
              <p className="text-sm text-cream/70 leading-relaxed max-w-xs">
                Give every garment a next life.
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-display text-sm text-cream mb-4 uppercase tracking-wider">Explore</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link
                    to="/give"
                    className="text-sage hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-forest rounded"
                  >
                    Give Clothes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/track"
                    className="text-sage hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-forest rounded"
                  >
                    Track
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin"
                    className="text-sage hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-forest rounded"
                  >
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-display text-sm text-cream mb-4 uppercase tracking-wider">Contact</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="mailto:kapdaloop123@gmail.com"
                    className="text-sage hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-forest rounded"
                  >
                    kapdaloop123@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:partners@kapdaloop.com"
                    className="text-sage hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-forest rounded"
                  >
                    partners@kapdaloop.com
                  </a>
                </li>
                <li className="text-cream/70">Hyderabad, Telangana, India</li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-sage/30 mt-10 pt-6 text-center space-y-1">
            <p className="text-cream/60 text-xs">Prototype: partners and pickups are simulated.</p>
            <p className="text-cream/60 text-xs">Built for the Software Solutions for Environment Telangana Hackathon.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
