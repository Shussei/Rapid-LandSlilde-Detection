import React from 'react';
import { MapPin, ShieldAlert, CloudRain, Radio, Compass } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { HeroTerrainCanvas } from '../components/terrain/HeroTerrainCanvas';

export const WayanadSection: React.FC = () => {
  const { wayanadLayers, toggleWayanadLayer } = useSimulation();

  return (
    <section id="wayanad" className="py-24 bg-[#05080e] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>REGIONAL CASE STUDY & PROPOSED APPLICATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Designed for difficult terrain.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Tailored for high-risk Western Ghats slopes like Wayanad, Kerala—where steep gradients, intense monsoon precipitation, and remote communities demand localized, rapid warning systems.
          </p>

          <div className="inline-block px-4 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
            PROPOSED REAL-WORLD APPLICATION CONCEPT
          </div>
        </div>

        {/* Interactive Wayanad Map & Layer Controls */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-bold">WAYANAD TOPOGRAPHIC MONITORING MODEL (MEPPADI / CHOORALMALA ZONE)</span>
            </div>

            {/* Spatial Layer Toggles */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <button
                onClick={() => toggleWayanadLayer('sensorNetwork')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  wayanadLayers.sensorNetwork
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                Sensor Mesh
              </button>

              <button
                onClick={() => toggleWayanadLayer('terrain')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  wayanadLayers.terrain
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                Elevation Contours
              </button>

              <button
                onClick={() => toggleWayanadLayer('riskZones')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  wayanadLayers.riskZones
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                High Risk Zones
              </button>

              <button
                onClick={() => toggleWayanadLayer('commLinks')}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  wayanadLayers.commLinks
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                RF Signal Pathways
              </button>
            </div>
          </div>

          {/* Map Canvas Container */}
          <div className="w-full h-[450px] rounded-2xl overflow-hidden relative border border-slate-800">
            <HeroTerrainCanvas />
          </div>

          {/* Regional Highlights Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 font-mono text-xs pt-4">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">GEOLOGICAL RISK</span>
              <span className="font-bold text-rose-400 flex items-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>HIGH INSTABILITY</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">MONSOON IMPACT</span>
              <span className="font-bold text-cyan-300 flex items-center space-x-1">
                <CloudRain className="w-3.5 h-3.5" />
                <span>HEAVY RAINFALL</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">TERRAIN TYPE</span>
              <span className="font-bold text-amber-300">REMOTE VILLAGES</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[10px] block uppercase">WARNING RESPONSE</span>
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <Radio className="w-3.5 h-3.5" />
                <span>EARLY LOCAL ALERTS</span>
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2 md:col-span-1">
              <span className="text-slate-500 text-[10px] block uppercase">DEPLOYMENT COST</span>
              <span className="font-bold text-teal-300">SCALABLE MESH</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
