import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { SensorNodeData, SensorStatus, TelemetryPoint } from '../types/sensor';
import type { SimulationContextType, WayanadLayers, LandslideEventSummary } from '../types/simulation';
import { INITIAL_SENSORS } from '../data/mockData';

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

// Baseline initial telemetry points (20 seconds history)
const generateInitialTelemetry = (): TelemetryPoint[] => {
  const points: TelemetryPoint[] = [];
  const now = Date.now();
  for (let i = 19; i >= 0; i--) {
    const timeStr = new Date(now - i * 1000).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    points.push({
      time: timeStr,
      vibration: 0.02 + Math.random() * 0.02,
      accelX: 0.10 + (Math.random() - 0.5) * 0.02,
      accelY: 0.15 + (Math.random() - 0.5) * 0.02,
      accelZ: 0.97 + (Math.random() - 0.5) * 0.02,
      correlation: 0.18 + Math.random() * 0.08,
    });
  }
  return points;
};

// Initial 4x4 Correlation Matrix for STABLE baseline
const INITIAL_CORRELATION_MATRIX = [
  [1.00, 0.21, 0.18, 0.25],
  [0.21, 1.00, 0.19, 0.22],
  [0.18, 0.19, 1.00, 0.15],
  [0.25, 0.22, 0.15, 1.00],
];

// High correlation matrix during landslide event
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
  const [overallRiskScore, setOverallRiskScore] = useState<number>(12); // 12% baseline risk
  const [groundStabilityPercent, setGroundStabilityPercent] = useState<number>(96); // 96% baseline stability
  const [lastEventSummary, setLastEventSummary] = useState<LandslideEventSummary | null>(null);
  const [wayanadLayers, setWayanadLayers] = useState<WayanadLayers>({
    sensorNetwork: true,
    terrain: true,
    riskZones: true,
    commLinks: true,
  });

  const simTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Live telemetry pulse tick (adds realistic micro-variations when running)
  useEffect(() => {
    const interval = setInterval(() => {
      if (isSimulating) return; // Managed by simulation timeline when active

      setSensors((prevSensors) =>
        prevSensors.map((s) => {
          const deltaVib = (Math.random() - 0.5) * 0.008;
          const newVib = Math.max(0.01, Math.min(0.08, s.vibration + deltaVib));
          const timeNow = new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }) + '.' + Math.floor(Math.random() * 10);

          return {
            ...s,
            vibration: Number(newVib.toFixed(3)),
            lastPacketTime: timeNow,
          };
        })
      );

      // Append new telemetry point
      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setTelemetryHistory((prev) => [
        ...prev.slice(1),
        {
          time: timeStr,
          vibration: Number((0.02 + Math.random() * 0.03).toFixed(3)),
          accelX: Number((0.11 + (Math.random() - 0.5) * 0.03).toFixed(3)),
          accelY: Number((0.16 + (Math.random() - 0.5) * 0.03).toFixed(3)),
          accelZ: Number((0.97 + (Math.random() - 0.5) * 0.03).toFixed(3)),
          correlation: Number((0.18 + Math.random() * 0.08).toFixed(2)),
        },
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Landslide event simulation state machine
  const triggerSimulation = useCallback(() => {
    if (isSimulating) return;

    setIsSimulating(true);
    setSimulationProgress(0);
    setStatus('WARNING');
    setOverallRiskScore(48);
    setGroundStabilityPercent(72);

    let progress = 0;

    if (simTimerRef.current) clearInterval(simTimerRef.current);

    simTimerRef.current = setInterval(() => {
      progress += 5;
      setSimulationProgress(progress);

      const timeStr = new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (progress <= 30) {
        // Phase 1: Initial ground shudder / localized vibration
        setSensors((prev) =>
          prev.map((s, idx) => {
            const isAffected = [1, 2, 3, 7].includes(idx);
            return {
              ...s,
              vibration: isAffected ? 0.35 + Math.random() * 0.15 : s.vibration,
              accelX: isAffected ? 0.32 + Math.random() * 0.1 : s.accelX,
              accelY: isAffected ? 0.48 + Math.random() * 0.1 : s.accelY,
              status: isAffected ? 'WARNING' : 'STABLE',
            };
          })
        );

        setCorrelationMatrix([
          [1.00, 0.52, 0.48, 0.31],
          [0.52, 1.00, 0.64, 0.45],
          [0.48, 0.64, 1.00, 0.51],
          [0.31, 0.45, 0.51, 1.00],
        ]);

        setTelemetryHistory((prev) => [
          ...prev.slice(1),
          {
            time: timeStr,
            vibration: Number((0.38 + Math.random() * 0.1).toFixed(3)),
            accelX: 0.35,
            accelY: 0.52,
            accelZ: 0.82,
            correlation: 0.58,
          },
        ]);

        setOverallRiskScore(62);
        setGroundStabilityPercent(58);
      } else if (progress <= 70) {
        // Phase 2: Coherent multi-sensor ground shear (Critical Landslide Event)
        setStatus('CRITICAL');
        setSensors((prev) =>
          prev.map((s, idx) => {
            const isCriticalZone = [1, 2, 3, 4, 7, 8, 11].includes(idx);
            return {
              ...s,
              vibration: isCriticalZone ? Number((1.25 + Math.random() * 0.45).toFixed(3)) : Number((0.45 + Math.random() * 0.2).toFixed(3)),
              accelX: isCriticalZone ? Number((0.78 + Math.random() * 0.25).toFixed(3)) : s.accelX,
              accelY: isCriticalZone ? Number((0.92 + Math.random() * 0.3).toFixed(3)) : s.accelY,
              accelZ: isCriticalZone ? Number((0.55 - Math.random() * 0.2).toFixed(3)) : s.accelZ,
              status: isCriticalZone ? 'CRITICAL' : 'WARNING',
            };
          })
        );

        setCorrelationMatrix(LANDSLIDE_CORRELATION_MATRIX);

        setTelemetryHistory((prev) => [
          ...prev.slice(1),
          {
            time: timeStr,
            vibration: Number((1.65 + Math.random() * 0.2).toFixed(3)),
            accelX: 0.88,
            accelY: 1.12,
            accelZ: 0.42,
            correlation: 0.94,
          },
        ]);

        setOverallRiskScore(96);
        setGroundStabilityPercent(18);
      } else if (progress >= 100) {
        // Simulation peak completed
        if (simTimerRef.current) clearInterval(simTimerRef.current);
        
        setLastEventSummary({
          timestamp: new Date().toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          confidence: 98.6,
          correlation: 0.94,
          peakVibration: 1.84,
          affectedNodes: ['SN-02', 'SN-03', 'SN-04', 'SN-05', 'SN-08', 'SN-12'],
        });
      }
    }, 350);
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
