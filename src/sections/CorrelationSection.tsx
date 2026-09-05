import React, { useState } from 'react';
import { GitMerge } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

// Distinct per-sensor waveforms: Scenario A = uncorrelated local disturbance,
// Scenario B = coherent ground movement (same event timing, different magnitude/phase).
const SCENARIO_A_SN_01 =
  'M0 30 C16 29, 30 25, 46 28 C54 16, 62 6, 76 12 C88 22, 94 16, 106 22 C118 6, 130 2, 144 12 C158 24, 174 22, 190 27 C216 29, 260 30, 300 31';
const SCENARIO_A_SN_02 =
  'M0 32 C36 31, 66 33, 100 30 C136 28, 170 33, 204 30 C238 28, 272 31, 300 32';
const SCENARIO_B_SN_01 =
  'M0 33 C22 31, 44 29, 60 16 C72 5, 90 7, 100 19 C112 31, 128 28, 140 13 C152 3, 168 6, 180 21 C192 33, 212 28, 226 14 C238 4, 262 9, 300 19';
const SCENARIO_B_SN_02 =
  'M0 34 C26 32, 50 28, 64 13 C80 2, 98 6, 108 18 C120 30, 134 26, 146 10 C158 0, 176 5, 188 20 C200 32, 220 27, 234 11 C248 1, 268 8, 300 20';

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
            <div className="lg:col-span-7 space-y-4 font-mono text-xs">
              {/* Sensor 01 Waveform */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SENSOR 01 TELEMETRY WAVEFORM</span>
                  <span className={activeTab === 'B' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>SN-01</span>
                </div>
                <svg className="w-full h-16 stroke-current overflow-visible" viewBox="0 0 300 40">
                  <defs>
                    <pattern id="waveGrid1" width="25" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 8" fill="none" stroke="#1e293b" strokeWidth="0.4" />
                    </pattern>
                  </defs>
                  <rect width="300" height="40" fill="url(#waveGrid1)" />
                  <line x1="0" y1="29" x2="300" y2="29" stroke="#334155" strokeWidth="0.6" strokeDasharray="3 3" />
                  <path
                    d={activeTab === 'A' ? SCENARIO_A_SN_01 : SCENARIO_B_SN_01}
                    fill="none"
                    stroke={activeTab === 'B' ? '#00f2fe' : '#fbbf24'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {activeTab === 'B' && (
                    <>
                      <circle cx="78" cy="4" r="2.5" fill="#00f2fe" stroke="#0d1522" strokeWidth="1" />
                      <circle cx="157" cy="3" r="2.5" fill="#00f2fe" stroke="#0d1522" strokeWidth="1" />
                      <circle cx="245" cy="4" r="2.5" fill="#00f2fe" stroke="#0d1522" strokeWidth="1" />
                    </>
                  )}
                </svg>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-900">
                  <span className="text-slate-500">
                    {activeTab === 'B' ? 'PEAK: 1.62g (UPPER-SLOPE INITIATION)' : 'PEAK: 1.20g (ISOLATED BURST)'}
                  </span>
                  <span className="text-cyan-400 font-bold">{activeTab === 'B' ? 'RMS 0.68g' : 'RMS 0.09g'}</span>
                </div>
              </div>

              {/* Sensor 02 Waveform */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SENSOR 02 TELEMETRY WAVEFORM</span>
                  <span className={activeTab === 'B' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>SN-02</span>
                </div>
                <svg className="w-full h-16 stroke-current overflow-visible" viewBox="0 0 300 40">
                  <defs>
                    <pattern id="waveGrid2" width="25" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 25 0 L 0 0 0 8" fill="none" stroke="#1e293b" strokeWidth="0.4" />
                    </pattern>
                  </defs>
                  <rect width="300" height="40" fill="url(#waveGrid2)" />
                  <line x1="0" y1="29" x2="300" y2="29" stroke="#334155" strokeWidth="0.6" strokeDasharray="3 3" />
                  <path
                    d={activeTab === 'A' ? SCENARIO_A_SN_02 : SCENARIO_B_SN_02}
                    fill="none"
                    stroke={activeTab === 'B' ? '#00f2fe' : '#f43f5e'}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  {activeTab === 'B' && (
                    <>
                      <circle cx="84" cy="2" r="2.5" fill="#00f2fe" stroke="#0d1522" strokeWidth="1" />
                      <circle cx="161" cy="1" r="2.5" fill="#00f2fe" stroke="#0d1522" strokeWidth="1" />
                      <circle cx="240" cy="2" r="2.5" fill="#00f2fe" stroke="#0d1522" strokeWidth="1" />
                    </>
                  )}
                </svg>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-900">
                  <span className="text-slate-500">
                    {activeTab === 'B' ? 'PEAK: 1.85g (DOWNSLOPE AMPLIFICATION)' : 'PEAK: 0.06g (AMBIENT NOISE)'}
                  </span>
                  <span className="text-cyan-400 font-bold">{activeTab === 'B' ? 'RMS 0.74g' : 'RMS 0.03g'}</span>
                </div>
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
                    ? 'Synchronized phase alignment across sensor nodes confirms macro-geological displacement. Each node records the same event onset with node-specific magnitude scaling (upper-slope initiation, downslope amplification).'
                    : 'Random phase offset and localized noise decay indicate superficial vibration near a single node. Neighboring sensors remain at ambient baseline — no coherent propagation signature.'}
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
