import React, { useState, useEffect } from 'react';
import { HARDWARE_PIPELINE } from '../data/mockData';
import type { HardwareComponentInfo } from '../types/sensor';
import { Activity, Zap, Cpu, Radio, BellRing, CheckCircle2 } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeComponent, setActiveComponent] = useState<HardwareComponentInfo>(HARDWARE_PIPELINE[0]);

  // Automated packet traversal animation
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStepIndex((prev) => {
        const next = (prev + 1) % HARDWARE_PIPELINE.length;
        setActiveComponent(HARDWARE_PIPELINE[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const getIcon = (actionWord: string) => {
    switch (actionWord) {
      case 'SENSE':
        return <Activity className="w-5 h-5 text-cyan-400" />;
      case 'AMPLIFY':
        return <Zap className="w-5 h-5 text-amber-400" />;
      case 'PROCESS':
        return <Cpu className="w-5 h-5 text-teal-400" />;
      case 'TRANSMIT':
        return <Radio className="w-5 h-5 text-sky-400" />;
      case 'ALERT':
        return <BellRing className="w-5 h-5 text-rose-400" />;
      default:
        return <Activity className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <section id="architecture" className="py-24 bg-[#05080e] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>SYSTEM HARDWARE PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            How The System Works
          </h2>

          <p className="text-slate-300 font-light text-base sm:text-lg">
            From physical slope micro-vibration to remote warning actuation. Explore the end-to-end hardware architecture.
          </p>
        </div>

        {/* Pipeline Stepper Nodes */}
        <div className="mb-12 overflow-x-auto pb-4">
          <div className="flex items-center justify-between min-w-[760px] relative px-4">
            {/* Connecting progress line */}
            <div className="absolute top-1/2 left-12 right-12 h-1 bg-slate-800 -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-12 h-1 bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 -translate-y-1/2 z-0 transition-all duration-700"
              style={{
                width: `${(activeStepIndex / (HARDWARE_PIPELINE.length - 1)) * 88}%`,
              }}
            />

            {HARDWARE_PIPELINE.map((item, idx) => {
              const isActive = idx === activeStepIndex;
              const isPast = idx < activeStepIndex;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveStepIndex(idx);
                    setActiveComponent(item);
                  }}
                  className="relative z-10 flex flex-col items-center cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 border ${
                      isActive
                        ? 'bg-slate-900 border-cyan-400 shadow-[0_0_25px_rgba(0,242,254,0.5)] scale-110'
                        : isPast
                        ? 'bg-cyan-950/80 border-cyan-500/50'
                        : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {getIcon(item.actionWord)}
                  </div>

                  <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 mt-2 uppercase">
                    {item.actionWord}
                  </span>
                  <span className="text-xs font-semibold text-slate-300 font-mono mt-0.5 max-w-[100px] text-center truncate">
                    {item.title.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Component View Panel */}
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center space-x-3">
              <span className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
                {activeComponent.code}
              </span>
              <span className="text-xs font-mono tracking-widest uppercase text-amber-400 font-bold">
                {activeComponent.actionWord} STAGE
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-4xl font-black text-white font-mono uppercase tracking-wide">
                {activeComponent.title}
              </h3>
              <p className="text-sm font-mono text-cyan-400">
                {activeComponent.subtitle}
              </p>
            </div>

            <p className="text-slate-300 leading-relaxed text-base font-light">
              {activeComponent.description}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <span className="text-slate-500 uppercase block text-[10px]">OPERATIONAL ROLE:</span>
              <p className="text-slate-200">{activeComponent.role}</p>
            </div>
          </div>

          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-2">
              TECHNICAL SPECIFICATIONS
            </h4>

            <ul className="space-y-3">
              {activeComponent.specs.map((spec, i) => (
                <li key={i} className="flex items-start space-x-3 text-xs font-mono text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>HARDWARE ARCHITECTURE</span>
              <span className="text-emerald-400 font-bold">LOW COST / SCALABLE</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
