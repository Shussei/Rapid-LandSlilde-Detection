import React from 'react';
import { ChevronUp, ShieldAlert, ArrowRight, Activity } from 'lucide-react';
import { HeroTerrainCanvas } from '../components/terrain/HeroTerrainCanvas';

export const FooterSection: React.FC = () => {
  return (
    <footer className="relative bg-[#05080e] border-t border-slate-800/80 overflow-hidden">
      {/* 3D Background Terrain view */}
      <div className="relative h-[420px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <HeroTerrainCanvas />
        </div>

        {/* Floating CTA Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Activity className="w-3.5 h-3.5" />
            <span>RAPID DISASTER INTELLIGENCE PLATFORM</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase font-mono tracking-tight leading-none">
            FROM GROUND MOVEMENT <br />
            <span className="text-cyan-400">TO EARLY WARNING.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light max-w-xl mx-auto">
            Engineering a faster, cost-effective response to landslide risk across vulnerable terrain.
          </p>

          <div className="flex items-center justify-center space-x-4">
            <a
              href="#monitor"
              className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>EXPLORE THE MONITOR</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Bottom Bar */}
      <div className="border-t border-slate-800/80 py-8 bg-[#030509]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400" />
            <div>
              <span className="font-bold text-white block">Rapid Landslide Detection & Early Warning System</span>
              <span className="text-[10px] text-slate-500">CSE / Engineering Micro-Controlled Embedded Systems (MCES PBL)</span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
              SIMULATION DEMO ENGINE
            </span>
            <a
              href="#hero"
              className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <span>TOP</span>
              <ChevronUp className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
