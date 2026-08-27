import React from 'react';
import { Mountain, AlertCircle, Radio, Clock } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  const cards = [
    {
      step: '01',
      title: 'GROUND MOVEMENT',
      icon: Mountain,
      accent: 'border-cyan-500/40 text-cyan-400',
      description:
        'Continuous sub-degree tilt and vibration monitoring via ADXL335 tri-axial accelerometers deployed directly on hillside soil and rock structures.',
      detail: 'Captures micro-displacement before catastrophic shear occurs.',
    },
    {
      step: '02',
      title: 'REMOTE TERRAIN',
      icon: Clock,
      accent: 'border-amber-500/40 text-amber-400',
      description:
        'Autonomous monitoring designed for rugged, inaccessible slopes where continuous human observation or heavy wired infrastructure is impractical.',
      detail: 'Operates continuously through monsoons & steep gradients.',
    },
    {
      step: '03',
      title: 'EARLY WARNING',
      icon: Radio,
      accent: 'border-rose-500/40 text-rose-400',
      description:
        'Instant wireless RF packet transmission from transmitter nodes to receiver stations, automatically actuating sirens and evacuation alerts.',
      detail: 'Provides crucial early response time to downstream villages.',
    },
  ];

  return (
    <section id="problem" className="relative py-24 bg-[#070a0f] border-t border-slate-800/80 overflow-hidden">
      {/* Background Animated Geological Contour Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-cyber-grid" />
      <div className="absolute -top-32 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>THE LANDSLIDE CHALLENGE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Minutes can change everything.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            In fragile geological zones like Wayanad, torrential monsoon rainfall rapidly destabilizes steep soil strata. Traditional satellite radar or manual surveys often lack real-time granularity. Low-cost, distributed sensors bridge this critical gap.
          </p>
        </div>

        {/* 3 Large Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.step}
                className="glass-panel-interactive p-8 rounded-2xl border flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Background watermarked step index */}
                <span className="absolute -top-4 -right-4 text-7xl font-black text-slate-800/40 font-mono pointer-events-none select-none group-hover:text-slate-700/40 transition-colors">
                  {card.step}
                </span>

                <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 tracking-widest font-bold">
                      STAGE {card.step}
                    </span>
                    <div className={`p-3 rounded-xl bg-slate-900/80 border ${card.accent}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white tracking-wide font-mono uppercase">
                      {card.title}
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  <span>{card.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
