import type { SensorNodeData, SensorStatus, TelemetryPoint } from './sensor';

export interface WayanadLayers {
  sensorNetwork: boolean;
  terrain: boolean;
  riskZones: boolean;
  commLinks: boolean;
}

export interface LandslideEventSummary {
  timestamp: string;
  confidence: number;
  correlation: number;
  peakVibration: number;
  affectedNodes: string[];
}

export interface SimulationContextType {
  status: SensorStatus;
  isSimulating: boolean;
  simulationProgress: number; // 0 to 100
  sensors: SensorNodeData[];
  selectedSensorId: string | null;
  activeFilter: 'ALL' | 'STABLE' | 'WARNING' | 'CRITICAL';
  telemetryHistory: TelemetryPoint[];
  correlationMatrix: number[][];
  overallRiskScore: number; // 0 to 100
  groundStabilityPercent: number; // 0 to 100
  wayanadLayers: WayanadLayers;
  lastEventSummary: LandslideEventSummary | null;
  
  // Actions
  triggerSimulation: () => void;
  resetSimulation: () => void;
  selectSensor: (id: string | null) => void;
  setFilter: (filter: 'ALL' | 'STABLE' | 'WARNING' | 'CRITICAL') => void;
  toggleWayanadLayer: (layerKey: keyof WayanadLayers) => void;
}
