import React from 'react';
import { BellRing, RefreshCw, X, Radio } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const AlertModal: React.FC = () => {
  const { status, lastEventSummary, resetSimulation } = useSimulation();

  if (status !== 'CRITICAL' && !lastEventSummary) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel p-6 sm:p-8 rounded-2xl border-2 border-rose-500/80 shadow-[0_0_50px_rgba(255,42,95,0.4)] overflow-hidden">
        {/* Animated background glow pulse */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-rose-600/30 blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-amber-500/20 blur-3xl animate-pulse" />

        {/* Top Header Badge */}
        <div className="flex items-center justify-between border-b border-rose-500/30 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/60 flex items-center justify-center text-rose-400 animate-bounce">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-widest text-rose-400 font-mono">EARLY WARNING ALERT</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 font-mono uppercase font-bold animate-pulse">
                  CRITICAL EVENT
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase font-mono mt-0.5">
                LANDSLIDE ACTIVITY DETECTED
              </h2>
            </div>
          </div>
          <button
            onClick={resetSimulation}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Event Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CONFIDENCE</span>
            <span className="text-xl font-bold text-rose-400">
              {lastEventSummary?.confidence || 98.6}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">CORRELATION</span>
            <span className="text-xl font-bold text-amber-400">
              {lastEventSummary?.correlation || 0.94}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">PEAK VIB (RMS)</span>
            <span className="text-xl font-bold text-cyan-400">
              {lastEventSummary?.peakVibration || 1.84}g
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">TIMESTAMP</span>
            <span className="text-xs font-bold text-slate-200 truncate block mt-1">
              {lastEventSummary?.timestamp || new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Receiver Warning & Hardware Actuator Status */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-6 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-rose-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>WIRELESS TRANSMISSION ACTUATED (ESP32 RF TELEMETRY)</span>
          </div>
          <p className="text-xs text-slate-300">
            ESP32 Receiver node has received verified telemetry packet. Remote alarm mechanism (Buzzer & Strobe LED) activated for slope evacuation.
          </p>
          <div className="pt-2 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono text-slate-400">AFFECTED NODES:</span>
            {(lastEventSummary?.affectedNodes || ['SN-02', 'SN-03', 'SN-04', 'SN-08']).map((nodeId) => (
              <span
                key={nodeId}
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold"
              >
                {nodeId}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={resetSimulation}
            className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/50 cursor-pointer transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset System Simulation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
