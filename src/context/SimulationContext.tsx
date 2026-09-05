import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { SensorNodeData, SensorStatus, TelemetryPoint } from '../types/sensor';
import type { SimulationContextType, WayanadLayers, LandslideEventSummary } from '../types/simulation';
import { INITIAL_SENSORS } from '../data/mockData';

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// ---------- Small numeric & time helpers ----------
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const num = (v: number, dp = 3) => Number(v.toFixed(dp));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const formatTime = (now = Date.now()) =>
  new Date(now).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

const formatPacketTime = (now = Date.now()) =>
  new Date(now).toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }) + '.' + Math.floor(Math.random() * 10);

// Baseline initial telemetry history (~28 s of micro-vibration history)
const generateInitialTelemetry = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 27; i >= 0; i--) {
    const s = (28 - i) / 28;
    points.push({
      time: formatTime(now - i * 1000),
      vibration: num(0.07 + Math.sin(s * Math.PI * 2.2) * 0.03 + Math.random() * 0.03),
      accelX: num(0.12 + Math.sin(s * 3.1) * 0.007 + (Math.random() - 0.5) * 0.008),
      accelY: num(0.18 + Math.cos(s * 2.7) * 0.007 + (Math.random() - 0.5) * 0.008),
      accelZ: num(0.968 + Math.cos(s * 2.2) * 0.005 + (Math.random() - 0.5) * 0.006),
      correlation: num(0.2 + Math.sin(s * 1.7) * 0.04 + Math.random() * 0.03, 2),
    });
  }
  return points;
};

// Initial low-correlation baseline
const INITIAL_CORRELATION_MATRIX = [
  [1.00, 0.21, 0.18, 0.25],
  [0.21, 1.00, 0.19, 0.22],
  [0.18, 0.19, 1.00, 0.15],
  [0.25, 0.22, 0.15, 1.00],
];

// High correlation during a coherent landslide event
const LANDSLIDE_CORRELATION_MATRIX = [
  [1.00, 0.94, 0.91, 0.88],
  [0.94, 1.00, 0.96, 0.92],
  [0.91, 0.96, 1.00, 0.95],
  [0.88, 0.92, 0.95, 1.00],
];

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sensors, setSensors] = useState<SensorNodeData[]>(INITIAL_SENSORS);
  const [status, setStatus] = useState<SensorStatus>('STABLE');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationProgress, setSimulationProgress] = useState<number>(0);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'STABLE' | 'WARNING' | 'CRITICAL'>('ALL');
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPoint[]>(generateInitialTelemetry);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>(INITIAL_CORRELATION_MATRIX);
  const [overallRiskScore, setOverallRiskScore] = useState<number>(12);
  const [groundStabilityPercent, setGroundStabilityPercent] = useState<number>(96);
  const [lastEventSummary, setLastEventSummary] = useState<LandslideEventSummary | null>(null);
  const [wayanadLayers, setWayanadLayers] = useState<WayanadLayers>({
    sensorNetwork: true,
    terrain: true,
    riskZones: true,
    commLinks: true,
  });

  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<number>(0);

  // Live telemetry pulse tick (realistic idle micro-variations when not simulating)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSimulating) return; // managed by the simulation timeline when active

      const n = tickRef.current++;

      setSensors((prevSensors) =>
        prevSensors.map((s) => ({
          ...s,
          vibration: num(clamp(s.vibration + rand(-0.012, 0.012), 0.02, 0.16)),
          accelX: num(clamp(s.accelX + rand(-0.006, 0.006), -0.05, 0.35)),
          accelY: num(clamp(s.accelY + rand(-0.006, 0.006), -0.05, 0.4)),
          lastPacketTime: formatPacketTime(),
        }))
      );

      const wave = Math.sin(n * 0.6) * 0.02;
      setTelemetryHistory((prev) => [
        ...prev.slice(1),
        {
          time: formatTime(),
          vibration: num(0.075 + wave + Math.random() * 0.03),
          accelX: num(0.12 + Math.sin(n * 0.5) * 0.008 + (Math.random() - 0.5) * 0.01),
          accelY: num(0.18 + Math.cos(n * 0.44) * 0.008 + (Math.random() - 0.5) * 0.01),
          accelZ: num(0.968 + Math.cos(n * 0.38) * 0.005 + (Math.random() - 0.5) * 0.007),
          correlation: num(0.2 + Math.sin(n * 0.36) * 0.03 + Math.random() * 0.03, 2),
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Landslide event simulation state machine (progressively ramping)
  const triggerSimulation = useCallback(() => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimulationProgress(0);
    setStatus('WARNING');
    setOverallRiskScore(46);
    setGroundStabilityPercent(74);

    let progress = 0;

    if (simTimerRef.current) clearInterval(simTimerRef.current);

    simTimerRef.current = setInterval(() => {
      progress += 5;
      setSimulationProgress(progress);

      const timeStr = formatTime();

      if (progress <= 30) {
        // Phase 1: micro-vibration onset on proximal nodes (eased ramp)
        const t = easeOutCubic(progress / 30);
        const affected = [1, 2, 3, 7]; // SN-02, SN-03, SN-04, SN-08

        setSensors((prev) =>
          prev.map((s, idx) => {
            const af = affected.includes(idx);
            return {
              ...s,
              vibration: af ? num(0.12 + t * 0.85 + Math.random() * 0.05) : num(clamp(s.vibration, 0.02, 0.16)),
              accelX: af ? num(0.14 + t * 0.3 + Math.random() * 0.02) : num(s.accelX),
              accelY: af ? num(0.2 + t * 0.42 + Math.random() * 0.02) : num(s.accelY),
              accelZ: af ? num(clamp(0.97 - t * 0.2, 0.55, 0.99)) : num(s.accelZ),
              status: af ? 'WARNING' : 'STABLE',
            };
          })
        );

        setCorrelationMatrix([
          [1.0, 0.5, 0.45, 0.3],
          [0.5, 1.0, 0.62, 0.42],
          [0.45, 0.62, 1.0, 0.5],
          [0.3, 0.42, 0.5, 1.0],
        ]);

        setTelemetryHistory((prev) => [
          ...prev.slice(1),
          {
            time: timeStr,
            vibration: num(0.15 + t * 0.8 + Math.random() * 0.06),
            accelX: num(0.2 + t * 0.3),
            accelY: num(0.28 + t * 0.42),
            accelZ: num(clamp(0.92 - t * 0.15, 0.65, 0.95)),
            correlation: num(0.45 + t * 0.25, 2),
          },
        ]);

        setOverallRiskScore(Math.round(46 + 22 * t));
        setGroundStabilityPercent(Math.round(74 - 15 * t));
      } else if (progress <= 70) {
        // Phase 2: coherent multi-sensor shear (critical landslide event)
        const t = easeOutCubic((progress - 30) / 40);
        setStatus('CRITICAL');
        const criticalZone = [1, 2, 3, 4, 7, 11]; // SN-02..05, SN-08, SN-12

        setSensors((prev) =>
          prev.map((s, idx) => {
            const critical = criticalZone.includes(idx);
            return {
              ...s,
              vibration: critical
                ? num(1.1 + t * 0.55 + Math.random() * 0.3)
                : num(Math.max(s.vibration, 0.45) + Math.random() * 0.15),
              accelX: critical ? num(0.6 + t * 0.42 + Math.random() * 0.05) : num(s.accelX),
              accelY: critical ? num(0.72 + t * 0.5 + Math.random() * 0.05) : num(s.accelY),
              accelZ: critical ? num(clamp(0.62 - t * 0.3, 0.32, 0.68)) : num(s.accelZ),
              status: critical ? 'CRITICAL' : 'WARNING',
            };
          })
        );

        setCorrelationMatrix(LANDSLIDE_CORRELATION_MATRIX);

        setTelemetryHistory((prev) => [
          ...prev.slice(1),
          {
            time: timeStr,
            vibration: num(1.2 + t * 0.6 + Math.random() * 0.15),
            accelX: num(0.62 + t * 0.32),
            accelY: num(0.78 + t * 0.4),
            accelZ: num(clamp(0.55 - t * 0.18, 0.35, 0.6)),
            correlation: num(0.62 + t * 0.33, 2),
          },
        ]);

        setOverallRiskScore(Math.round(70 + 26 * t));
        setGroundStabilityPercent(Math.round(56 - 34 * t));
      } else if (progress < 100) {
        // Sustain peak conditions with high-amplitude jitter
        setTelemetryHistory((prev) => [
          ...prev.slice(1),
          {
            time: timeStr,
            vibration: num(1.62 + Math.random() * 0.28),
            accelX: num(0.86 + Math.random() * 0.06),
            accelY: num(1.08 + Math.random() * 0.08),
            accelZ: num(0.38 + Math.random() * 0.06),
            correlation: num(0.93 + Math.random() * 0.03, 2),
          },
        ]);
        setOverallRiskScore(96 + Math.round(Math.random() * 3));
        setGroundStabilityPercent(17 + Math.round(Math.random() * 2));
      } else {
        // Simulation peak reached — finalize event summary
        if (simTimerRef.current) clearInterval(simTimerRef.current);

        setLastEventSummary({
          timestamp: timeStr,
          confidence: 98.6,
          correlation: 0.94,
          peakVibration: 1.84,
          affectedNodes: ['SN-02', 'SN-03', 'SN-04', 'SN-05', 'SN-08', 'SN-12'],
        });
      }
    }, 380);
  }, [isSimulating]);

  const resetSimulation = useCallback(() => {
    if (simTimerRef.current) clearInterval(simTimerRef.current);
    setIsSimulating(false);
    setSimulationProgress(0);
    setStatus('STABLE');
    setSensors(INITIAL_SENSORS);
    setCorrelationMatrix(INITIAL_CORRELATION_MATRIX);
    setOverallRiskScore(12);
    setGroundStabilityPercent(96);
    setLastEventSummary(null);
    setTelemetryHistory(generateInitialTelemetry());
  }, []);

  const selectSensor = useCallback((id: string | null) => {
    setSelectedSensorId(id);
  }, []);

  const setFilter = useCallback((filter: 'ALL' | 'STABLE' | 'WARNING' | 'CRITICAL') => {
    setActiveFilter(filter);
  }, []);

  const toggleWayanadLayer = useCallback((layerKey: keyof WayanadLayers) => {
    setWayanadLayers((prev) => ({
      ...prev,
      [layerKey]: !prev[layerKey],
    }));
  }, []);

  return (
    <SimulationContext.Provider
      value={{
        status,
        isSimulating,
        simulationProgress,
        sensors,
        selectedSensorId,
        activeFilter,
        telemetryHistory,
        correlationMatrix,
        overallRiskScore,
        groundStabilityPercent,
        wayanadLayers,
        lastEventSummary,
        triggerSimulation,
        resetSimulation,
        selectSensor,
        setFilter,
        toggleWayanadLayer,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = (): SimulationContextType => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};