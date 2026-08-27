export type SensorStatus = 'STABLE' | 'WARNING' | 'CRITICAL';

export interface SensorNodeData {
  id: string;
  name: string;
  position: [number, number, number]; // 3D coordinates on terrain [x, y, z]
  accelX: number; // in g
  accelY: number; // in g
  accelZ: number; // in g
  vibration: number; // RMS vibration magnitude (g)
  status: SensorStatus;
  battery: number; // %
  lastPacketTime: string; // e.g. "16:14:02.84"
  slopeZone: string; // e.g. "Chooralmala North Slope"
}

export interface TelemetryPoint {
  time: string;
  vibration: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  correlation: number;
}

export interface HardwareComponentInfo {
  id: string;
  title: string;
  code: string;
  subtitle: string;
  role: string;
  actionWord: 'SENSE' | 'AMPLIFY' | 'PROCESS' | 'TRANSMIT' | 'ALERT';
  specs: string[];
  description: string;
  iconName: string;
}
