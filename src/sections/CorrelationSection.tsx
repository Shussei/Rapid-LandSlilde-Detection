import React, { useState } from 'react';
import { GitMerge } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

export const CorrelationSection: React.FC = () => {
  const { correlationMatrix } = useSimulation();
  const [activeTab, setActiveTab] = useState<'A' | 'B'>('B');

  return (
    <section id="correlation" className="py-24 bg-[#05080e] border-t border-slate-800/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider">
            <GitMerge className="w-3.5 h-3.5" />
            <span>CROSS-SENSOR SIGNAL CORRELATION ENGINE</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            Noise looks random. <br />
            <span className="text-cyan-400">Landslides leave patterns.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Local disturbances like animal footsteps or wind create random, uncorrelated spikes. Genuine slope failures produce coherent, highly synchronized multi-sensor displacement signals.
          </p>
        </div>

        {/* Scenario Toggle & Waveform Comparison */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
              WAVEFORM SYNCHRONIZATION SCENARIOS
            </span>

            <div className="flex items-center space-x-2 font-mono text-xs">
              <button
                onClick={() => setActiveTab('A')}
                className={`px-4 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'A'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                SCENARIO A: LOCAL DISTURBANCE
              </button>
              <button
                onClick={() => setActiveTab('B')}
                className={`px-4 py-2 rounded-xl transition-all font-bold ${
                  activeTab === 'B'
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                SCENARIO B: GROUND MOVEMENT
              </button>
            </div>
          </div>

          {/* Waveform Visualization Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SENSOR 01 TELEMETRY WAVEFORM</span>
                  <span className={activeTab === 'B' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>SN-01</span>
                </div>
                {/* SVG Simulated Waveform */}
                <svg className="w-full h-12 stroke-current overflow-visible" viewBox="0 0 300 40">
                  <path
                    d={
                      activeTab === 'A'
                        ? 'M 0 20 Q 25 5 50 35 T 100 15 T 150 28 T 200 8 T 250 32 T 300 20'
                        : 'M 0 20 Q 30 10 60 30 T 120 5 T 180 35 T 240 10 T 300 20'
                    }
                    fill="none"
                    stroke={activeTab === 'B' ? '#00f2fe' : '#fbbf24'}
                    strokeWidth="2.5"
                  />
                </svg>

                <div className="flex items-center justify-between pt-2 border-t border-slate-900">
                  <span className="text-slate-400">SENSOR 02 TELEMETRY WAVEFORM</span>
                  <span className={activeTab === 'B' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>SN-02</span>
                </div>
                <svg className="w-full h-12 stroke-current overflow-visible" viewBox="0 0 300 40">
                  <path
                    d={
                      activeTab === 'A'
                        ? 'M 0 20 Q 25 35 50 8 T 100 32 T 150 12 T 200 28 T 250 15 T 300 20'
                        : 'M 0 20 Q 30 10 60 30 T 120 5 T 180 35 T 240 10 T 300 20'
                    }
                    fill="none"
                    stroke={activeTab === 'B' ? '#00f2fe' : '#f43f5e'}
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
            </div>

            {/* Matrix & Correlation Metrics Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs text-slate-400">PEAK CORRELATION SCORE</span>
                  <span
                    className={`text-lg font-bold ${
                      activeTab === 'B' ? 'text-cyan-400' : 'text-amber-400'
                    }`}
                  >
                    {activeTab === 'B' ? '0.94 (HIGH)' : '0.21 (LOW)'}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeTab === 'B'
                    ? 'Synchronized phase alignment across multiple sensor nodes confirms localized macro-geological displacement.'
                    : 'Random phase offset and localized noise decay indicate localized superficial vibration (e.g., machinery or livestock).'}
                </p>
              </div>
            </div>
          </div>

          {/* 4x4 Correlation Matrix Grid */}
          <div className="pt-6 border-t border-slate-800 space-y-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">
              MULTI-SENSOR CORRELATION MATRIX
            </span>

            <div className="grid grid-cols-5 gap-2 max-w-xl mx-auto font-mono text-center text-xs">
              <div className="p-3 text-slate-500 font-bold">SN</div>
              <div className="p-3 text-cyan-400 font-bold">SN-01</div>
              <div className="p-3 text-cyan-400 font-bold">SN-02</div>
              <div className="p-3 text-cyan-400 font-bold">SN-03</div>
              <div className="p-3 text-cyan-400 font-bold">SN-04</div>

              {correlationMatrix.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  <div className="p-3 text-cyan-400 font-bold flex items-center justify-center">
                    SN-0{rIdx + 1}
                  </div>
                  {row.map((val, cIdx) => {
                    const isHigh = val > 0.8;
                    const isMid = val > 0.4 && val <= 0.8;
                    return (
                      <div
                        key={cIdx}
                        className={`p-3 rounded-xl border font-bold transition-all ${
                          isHigh
                            ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-md shadow-rose-950/30'
                            : isMid
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {val.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
