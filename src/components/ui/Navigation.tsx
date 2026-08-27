import React, { useState, useEffect } from 'react';
import { ShieldAlert, Menu, X, Play, RefreshCw } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Navigation: React.FC = () => {
  const { status, isSimulating, triggerSimulation, resetSimulation } = useSimulation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Overview', href: '#hero' },
    { name: 'How It Works', href: '#architecture' },
    { name: 'Live Monitor', href: '#monitor' },
    { name: 'Simulation', href: '#simulation' },
    { name: 'Technology', href: '#technology' },
    { name: 'Wayanad', href: '#wayanad' },
    { name: 'Research', href: '#correlation' },
    { name: 'Team', href: '#team' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05080e]/85 backdrop-blur-md border-b border-cyan-500/15 py-3 shadow-2xl shadow-cyan-950/20'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#hero" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all">
              <ShieldAlert className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black tracking-wider text-white font-mono">RAPID</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">v1.0</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 tracking-widest uppercase block -mt-1">
                Landslide Intelligence
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-medium text-slate-300 hover:text-cyan-400 tracking-wide transition-colors hover:shadow-[0_2px_0_#00f2fe]"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Right Action / System Status */}
          <div className="hidden md:flex items-center space-x-4">
            {/* System Status Pill */}
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === 'STABLE'
                    ? 'bg-emerald-400 pulse-green'
                    : status === 'WARNING'
                    ? 'bg-amber-400 pulse-amber'
                    : 'bg-rose-500 pulse-red'
                }`}
              />
              <span className="text-slate-300 font-medium">
                {status === 'STABLE' && 'SYSTEM STABLE'}
                {status === 'WARNING' && 'SLOPE WARNING'}
                {status === 'CRITICAL' && 'ALARM ACTIVE'}
              </span>
            </div>

            {/* Simulation Trigger Button */}
            {!isSimulating ? (
              <button
                onClick={triggerSimulation}
                className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-rose-600/90 to-amber-600/90 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold tracking-wide border border-rose-400/40 shadow-lg shadow-rose-950/40 hover:shadow-rose-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Simulate Event</span>
              </button>
            ) : (
              <button
                onClick={resetSimulation}
                className="flex items-center space-x-2 px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold tracking-wide border border-slate-700 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                <span>Reset State</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-slate-800/80 bg-[#05080e]/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-cyan-500/20">
            <div className="flex flex-col space-y-3 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-300 hover:text-cyan-400 py-1 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex flex-col space-y-3">
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">System Status:</span>
                <span className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      status === 'STABLE' ? 'bg-emerald-400' : status === 'WARNING' ? 'bg-amber-400' : 'bg-rose-500'
                    }`}
                  />
                  <span className="text-white font-bold">{status}</span>
                </span>
              </div>

              {!isSimulating ? (
                <button
                  onClick={() => {
                    triggerSimulation();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-rose-600 text-white text-xs font-bold uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Simulate Landslide Event</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    resetSimulation();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-bold uppercase tracking-wider"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400" />
                  <span>Reset Simulation</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
