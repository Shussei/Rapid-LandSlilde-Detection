import React from 'react';
import { Play, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { HeroTerrainCanvas } from '../components/terrain/HeroTerrainCanvas';

export const EventSimulationSection: React.FC = () => {
  const {
    status,
    isSimulating,
    simulationProgress,
    triggerSimulation,
    resetSimulation,
    lastEventSummary,
    overallRiskScore,
  } = useSimulation();

  return (
    <section id="simulation" className="py-24 bg-[#070a0f] border-t border-slate-800/80 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>INTERACTIVE EXPERIMENTAL DEMONSTRATION</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight font-mono">
            See the system detect an event.
          </h2>

          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            Trigger a simulated slope instability event. Observe multi-node signal correlation, ESP32 packet transmission, risk score escalation, and automatic alarm actuation in real time.
          </p>
        </div>

        {/* Simulation Canvas Container */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 space-y-6 relative shadow-2xl">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono font-bold text-slate-300 uppercase">EVENT STAGE:</span>
              <span
                className={`text-xs px-3 py-1 rounded-lg font-mono font-bold uppercase ${
                  status === 'STABLE'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : status === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 pulse-red'
                }`}
              >
                {status === 'STABLE' && 'STAGE 0: STABLE SLOPE'}
                {status === 'WARNING' && 'STAGE 1: MICRO-VIBRATION DETECTED'}
                {status === 'CRITICAL' && 'STAGE 2: COHERENT SHEAR / ALARM ACTIVE'}
              </span>
            </div>

            {/* Main Simulation Action Buttons */}
            <div className="flex items-center space-x-3">
              {!isSimulating ? (
                <button
                  onClick={triggerSimulation}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-rose-950/60 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>SIMULATE LANDSLIDE</span>
                </button>
              ) : (
                <button
                  onClick={resetSimulation}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span>RESET SIMULATION</span>
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar when running */}
          {isSimulating && (
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span>SIMULATION PROGRESS ({simulationProgress}%)</span>
                <span className="text-cyan-400">{status}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-rose-500 transition-all duration-300"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* 3D Scene View */}
          <div className="w-full h-[400px] rounded-2xl overflow-hidden relative border border-slate-800">
            <HeroTerrainCanvas />

            {/* Floating Live Telemetry Badge over scene */}
            <div className="absolute top-4 left-4 p-3 rounded-xl glass-panel border border-cyan-500/30 text-xs font-mono space-y-1 backdrop-blur-md">
              <div className="text-[10px] text-slate-400 font-bold uppercase">LIVE SIMULATION HUD</div>
              <div className="flex items-center space-x-3 text-white">
                <span>RISK SCORE: <strong className="text-rose-400">{overallRiskScore}%</strong></span>
                <span>STATUS: <strong className="text-amber-400">{status}</strong></span>
              </div>
            </div>
          </div>

          {/* Post Event Summary Callout */}
          {lastEventSummary && (
            <div className="p-6 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-4 animate-fadeIn font-mono">
              <div className="flex items-center justify-between border-b border-rose-500/30 pb-3">
                <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>EVENT DETECTION COMPLETED</span>
                </div>
                <span className="text-xs text-slate-400">{lastEventSummary.timestamp}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px]">DETECTION CONFIDENCE</span>
                  <span className="text-lg font-bold text-emerald-400">{lastEventSummary.confidence}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SIGNAL CORRELATION</span>
                  <span className="text-lg font-bold text-amber-400">{lastEventSummary.correlation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PEAK VIBRATION</span>
                  <span className="text-lg font-bold text-cyan-300">{lastEventSummary.peakVibration}g</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">AFFECTED SENSORS</span>
                  <span className="text-lg font-bold text-rose-400">{lastEventSummary.affectedNodes.length} Nodes</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
