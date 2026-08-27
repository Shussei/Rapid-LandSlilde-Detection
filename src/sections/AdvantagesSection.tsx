import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AdvantagesSection: React.FC = () => {
  const advantages = [
    { title: 'Real-Time Monitoring', desc: 'Continuous sub-second telemetry sampling of tri-axial acceleration and ground vibration.' },
    { title: 'Wireless Alerting', desc: 'RF telecommunication eliminates vulnerable, expensive long physical cables across rugged mountains.' },
    { title: 'Low-Cost Componentry', desc: 'Built using affordable ADXL335, LM358, and ESP32 hardware for scalable community protection.' },
    { title: 'Low-Power Architecture', desc: 'Efficient power draw enables battery and solar-buffered autonomous field deployment.' },
    { title: 'Scalable Sensor Mesh', desc: 'Multi-node network can be expanded across slope sectors without modifying central architecture.' },
    { title: 'Remote Hill Terrain Adaptability', desc: 'Compact nodes deployable on steep, inaccessible ridges and forest escarpments.' },
  ];

  const limitations = [
    { title: 'Battery & Power Dependency', desc: 'Requires reliable power management or solar harvesting for multi-month monsoon operation.' },
    { title: 'Environmental Noise Interference', desc: 'Local disturbances (heavy rain impact, wind, livestock) require robust correlation filtering.' },
    { title: 'Sensor Range Limitations', desc: 'ADXL335 ±3g range caps extreme high-energy rockfall dynamics without high-g shock sensors.' },
    { title: 'Threshold Calibration Constraints', desc: 'Static analog voltage thresholds must be fine-tuned per specific soil type and slope angle.' },
  ];

  return (
    <section className="py-24 bg-[#070a0f] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ENGINEERING EVALUATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Advantages & Limitations
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Transparent scientific evaluation of system capabilities and field constraints.
          </p>
        </div>

        {/* Split-Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ADVANTAGES COLUMN */}
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
                  SYSTEM ADVANTAGES
                </h3>
                <span className="text-xs font-mono text-emerald-400">KEY INNOVATIONS</span>
              </div>
            </div>

            <div className="space-y-4">
              {advantages.map((adv, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-emerald-300 font-mono flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{adv.title}</span>
                  </span>
                  <p className="text-xs text-slate-300 font-light leading-relaxed pl-3.5">
                    {adv.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* LIMITATIONS COLUMN */}
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-mono uppercase tracking-wide">
                  SYSTEM LIMITATIONS
                </h3>
                <span className="text-xs font-mono text-amber-400">TRANSPARENT BOUNDARIES</span>
              </div>
            </div>

            <div className="space-y-4">
              {limitations.map((lim, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-xs font-bold text-amber-300 font-mono flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{lim.title}</span>
                  </span>
                  <p className="text-xs text-slate-300 font-light leading-relaxed pl-3.5">
                    {lim.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
