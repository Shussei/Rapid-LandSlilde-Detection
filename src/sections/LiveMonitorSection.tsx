import React from 'react';
import { Activity, Radio, BarChart2, Layers } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { HeroTerrainCanvas } from '../components/terrain/HeroTerrainCanvas';
import { VibrationChart } from '../components/charts/VibrationChart';
import { AccelerationChart } from '../components/charts/AccelerationChart';
import { CorrelationChart } from '../components/charts/CorrelationChart';

export const LiveMonitorSection: React.FC = () => {
  const {
    status,
    sensors,
    selectedSensorId,
    selectSensor,
    activeFilter,
    setFilter,
    telemetryHistory,
    overallRiskScore,
    groundStabilityPercent,
    lastEventSummary,
  } = useSimulation();

  const filteredSensors = sensors.filter((s) => {
    if (activeFilter === 'ALL') return true;
    return s.status === activeFilter;
  });

  const selectedSensor = sensors.find((s) => s.id === selectedSensorId) || sensors[0];

  return (
    <section id="monitor" className="py-20 bg-[#05080e] border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>COMMAND CENTER DASHBOARD</span>
              </div>
              {/* Simulation Data Explicit Tag */}
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold uppercase tracking-wider">
                SIMULATION DATA
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-mono tracking-tight">
              LIVE TERRAIN MONITOR
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
              <span
                className={`w-3 h-3 rounded-full ${
                  status === 'STABLE'
                    ? 'bg-emerald-400 pulse-green'
                    : status === 'WARNING'
                    ? 'bg-amber-400 pulse-amber'
                    : 'bg-rose-500 pulse-red'
                }`}
              />
              <span className="text-white font-bold tracking-wider">
                {status === 'STABLE' && 'SYSTEM OPERATIONAL'}
                {status === 'WARNING' && 'ELEVATED RISK DETECTED'}
                {status === 'CRITICAL' && 'CRITICAL ALARM ACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT 3D TERRAIN MONITOR MAP */}
          <div className="lg:col-span-8 glass-panel p-4 rounded-3xl border border-slate-800 flex flex-col h-[520px] relative overflow-hidden">
            {/* Filter Toolbar */}
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/80 z-10 px-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>INTERACTIVE 3D TERRAIN MAP</span>
              </div>

              {/* Sensor Filter Pills */}
              <div className="flex items-center space-x-1 font-mono text-[10px]">
                {(['ALL', 'STABLE', 'WARNING', 'CRITICAL'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilter(filter)}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      activeFilter === filter
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D Map Container */}
            <div className="flex-1 rounded-2xl overflow-hidden relative">
              <HeroTerrainCanvas />
            </div>

            {/* Selected Sensor Quick HUD Bar */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs font-mono px-2 text-slate-300">
              <div className="flex items-center space-x-3">
                <span className="text-slate-500">SELECTED NODE:</span>
                <span className="font-bold text-cyan-300">{selectedSensor.name}</span>
                <span className="text-[10px] text-slate-400">({selectedSensor.slopeZone})</span>
              </div>

              <div className="flex items-center space-x-4 text-[11px]">
                <span>X: <strong className="text-cyan-300">{selectedSensor.accelX}g</strong></span>
                <span>Y: <strong className="text-cyan-300">{selectedSensor.accelY}g</strong></span>
                <span>Z: <strong className="text-cyan-300">{selectedSensor.accelZ}g</strong></span>
                <span>RMS: <strong className="text-amber-300">{selectedSensor.vibration}g</strong></span>
              </div>
            </div>
          </div>

          {/* RIGHT SYSTEM STATUS PANEL */}
          <div className="lg:col-span-4 space-y-6">
            {/* Risk Gauge Card */}
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono text-slate-400 tracking-wider uppercase font-bold">
                  OVERALL RISK SCORE
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    overallRiskScore < 30
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : overallRiskScore < 70
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {overallRiskScore < 30 ? 'LOW' : overallRiskScore < 70 ? 'MODERATE' : 'CRITICAL'}
                </span>
              </div>

              {/* Numerical Risk Progress Bar */}
              <div className="space-y-2 font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-white">{overallRiskScore}%</span>
                  <span className="text-xs text-slate-400">SLOPE INSTABILITY INDEX</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      overallRiskScore < 30
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : overallRiskScore < 70
                        ? 'bg-gradient-to-r from-amber-500 to-orange-400'
                        : 'bg-gradient-to-r from-orange-500 to-rose-600'
                    }`}
                    style={{ width: `${overallRiskScore}%` }}
                  />
                </div>
              </div>

              {/* Status Metrics List */}
              <div className="space-y-3 pt-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">GROUND STABILITY</span>
                  <span className="font-bold text-emerald-400">{groundStabilityPercent}%</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">ACTIVE SENSORS</span>
                  <span className="font-bold text-cyan-300">{filteredSensors.length} / {sensors.length}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">WIRELESS LINK</span>
                  <span className="font-bold text-emerald-400 flex items-center space-x-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>CONNECTED</span>
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400">LAST EVENT LOG</span>
                  <span className="font-bold text-slate-300 text-[11px] truncate max-w-[130px]">
                    {lastEventSummary ? `ALARM @ ${lastEventSummary.timestamp}` : 'NO ANOMALIES'}
                  </span>
                </div>
              </div>
            </div>

            {/* Sensor Selection Quick List */}
            <div className="glass-panel p-4 rounded-3xl border border-slate-800 space-y-3">
              <span className="text-xs font-mono text-slate-400 tracking-wider uppercase font-bold block px-1">
                SENSOR MESH NODES
              </span>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                {sensors.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => selectSensor(s.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      selectedSensorId === s.id
                        ? 'bg-cyan-950/60 border-cyan-400 text-white'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          s.status === 'STABLE' ? 'bg-emerald-400' : s.status === 'WARNING' ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                      />
                      <span className="font-bold">{s.id}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold">{s.vibration}g RMS</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM REAL-TIME GRAPHS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                GROUND VIBRATION (RMS g)
              </span>
              <BarChart2 className="w-4 h-4 text-cyan-400" />
            </div>
            <VibrationChart data={telemetryHistory} />
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                X / Y / Z ACCELERATION (g)
              </span>
              <Activity className="w-4 h-4 text-amber-400" />
            </div>
            <AccelerationChart data={telemetryHistory} />
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                SIGNAL CORRELATION SCORE
              </span>
              <Radio className="w-4 h-4 text-rose-400" />
            </div>
            <CorrelationChart data={telemetryHistory} />
          </div>
        </div>
      </div>
    </section>
  );
};
