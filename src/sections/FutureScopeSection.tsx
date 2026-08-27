import React from 'react';
import { Rocket, Cpu, Sun, Brain, CheckCircle2, ArrowRight } from 'lucide-react';

export const FutureScopeSection: React.FC = () => {
  const phases = [
    {
      phase: '01',
      tag: 'CURRENT SYSTEM',
      title: 'BENCHMARK PROTOTYPE',
      icon: Cpu,
      accent: 'border-cyan-500/40 text-cyan-400',
      points: [
        'ADXL335 tri-axial motion sensing',
        'LM358 active analog amplification',
        'Dual ESP32 transmitter & receiver hub',
        'Localized wireless sirens & web telemetry',
      ],
    },
    {
      phase: '02',
      tag: 'NEXT PHASE',
      title: 'FIELD HARDENING & SOLAR MESH',
      icon: Sun,
      accent: 'border-amber-500/40 text-amber-400',
      points: [
        'Solar panel & LiFePO4 battery management',
        'LoRaWAN sub-GHz long-range mesh nodes',
        'IP67 weatherproof ruggedized enclosures',
        'Advanced FFT digital signal noise filtering',
      ],
    },
    {
      phase: '03',
      tag: 'FUTURE VISION',
      title: 'EDGE ML & PREDICTIVE ANALYTICS',
      icon: Brain,
      accent: 'border-rose-500/40 text-rose-400',
      points: [
        'TinyML edge neural network classification',
        'Soil moisture & pore pressure sensor fusion',
        'Cloud telemetry sync & emergency SMS gateway',
        'Large-scale regional disaster command integration',
      ],
    },
  ];

  return (
    <section className="py-24 bg-[#05080e] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Rocket className="w-3.5 h-3.5" />
            <span>DEVELOPMENT ROADMAP</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Future Scope & Evolution
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Path forward from low-cost baseline prototype to intelligent, multi-sensor disaster prediction network.
          </p>
        </div>

        {/* Animated Connected Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {phases.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="glass-panel p-8 rounded-3xl border flex flex-col justify-between relative group space-y-6"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-widest uppercase">
                      {item.tag}
                    </span>
                    <div className={`p-3 rounded-xl bg-slate-900/90 border ${item.accent}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div>
                    <span className="text-3xl font-black text-slate-700 font-mono block">
                      PHASE {item.phase}
                    </span>
                    <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide mt-1">
                      {item.title}
                    </h3>
                  </div>

                  <ul className="space-y-2.5 pt-2">
                    {item.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start space-x-2.5 text-xs font-mono text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                  <span>EVOLUTION LEVEL {i + 1}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
