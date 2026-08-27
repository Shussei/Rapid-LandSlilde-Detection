import React from 'react';
import { ArrowDown, ChevronRight, Play } from 'lucide-react';
import { HeroTerrainCanvas } from '../components/terrain/HeroTerrainCanvas';
import { useSimulation } from '../context/SimulationContext';

export const HeroSection: React.FC = () => {
  const { triggerSimulation } = useSimulation();

  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col justify-between pt-24 pb-12 overflow-hidden bg-[#05080e]">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <HeroTerrainCanvas />
      </div>

      {/* Hero Text & Controls Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          {/* Top Tech Badge */}
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>DISASTER MANAGEMENT DEEP-TECH PLATFORM</span>
          </div>

          {/* Main Title */}
          <div className="space-y-1">
            <span className="block text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 font-mono">
              RAPID
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-mono leading-none">
              REAL-TIME LANDSLIDE <br />
              <span className="text-slate-300 font-extrabold">DETECTION SYSTEM</span>
            </h1>
          </div>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
            Detect ground movement. Correlate signals. Warn before disaster. Low-cost wireless telemetry engineered for landslide-prone terrain like Wayanad, Kerala.
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#monitor"
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>View Live Monitor</span>
              <ChevronRight className="w-4 h-4" />
            </a>

            <a
              href="#architecture"
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-white font-semibold text-sm tracking-wide border border-slate-700 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <span>Explore the System</span>
            </a>

            <button
              onClick={triggerSimulation}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-rose-600/90 to-amber-600/90 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-sm tracking-wide border border-rose-400/40 shadow-lg shadow-rose-950/40 hover:shadow-rose-500/30 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Simulate Landslide Event</span>
            </button>
          </div>

          {/* Compact System Metrics Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl font-mono">
            <div className="p-3 rounded-xl glass-panel border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">TELEMETRY</span>
              <span className="text-xs font-bold text-cyan-300">REAL-TIME MONITORING</span>
            </div>
            <div className="p-3 rounded-xl glass-panel border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ALERTS</span>
              <span className="text-xs font-bold text-emerald-300">WIRELESS ALERTING</span>
            </div>
            <div className="p-3 rounded-xl glass-panel border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">ANALYSIS</span>
              <span className="text-xs font-bold text-amber-300">MULTI-SENSOR CORRELATION</span>
            </div>
            <div className="p-3 rounded-xl glass-panel border border-cyan-500/20">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest block">COST</span>
              <span className="text-xs font-bold text-teal-300">LOW-COST DEPLOYMENT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="relative z-10 flex flex-col items-center justify-center pt-8">
        <a
          href="#problem"
          className="flex flex-col items-center space-y-2 text-slate-400 hover:text-cyan-400 transition-colors group"
        >
          <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-cyan-400">
            SCROLL TO EXPLORE
          </span>
          <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
        </a>
      </div>
    </section>
  );
};
