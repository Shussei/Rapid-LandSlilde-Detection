import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import type { SensorNodeData } from '../../types/sensor';

interface TerrainProps {
  sensors: SensorNodeData[];
  selectedSensorId: string | null;
  onSelectSensor: (id: string | null) => void;
  isSimulating?: boolean;
}

const NODE_CLEARANCE = 0.45;
const EVENT_CENTER = new THREE.Vector2(0.6, -0.4);

// Procedural height field with strong ridges, deep valley and a landslide spine
const getTerrainHeight = (x: number, z: number): number => {
  const rolling = Math.sin(x * 0.24 + 1.7) * Math.cos(z * 0.28) * 2.7;
  const secondary = Math.sin(x * 0.62 + z * 0.44) * 1.55;
  const detail = Math.cos(x * 1.18 - z * 0.66) * 0.5;
  const ridge = Math.exp(-Math.pow((x - 1.2) * 0.15, 2) - Math.pow((z - 0.2) * 0.15, 2)) * 3.6;
  const valley = -Math.exp(-Math.pow((z + 4.6) * 0.2, 2)) * 2.7;
  const spur = -Math.exp(-Math.pow((x + 5.1) * 0.22, 2) - Math.pow((z - 1.5) * 0.2, 2)) * 1.6;
  return rolling + secondary + detail + ridge + valley + spur;
};

// Live deformation offset: gentle idle breathing vs. violent landslide motion
const deform = (x: number, z: number, t: number, simulating: boolean): number => {
  if (!simulating) {
    return Math.sin(t * 0.9 + x * 0.28) * Math.cos(t * 0.65 + z * 0.22) * 0.075;
  }
  const surge = 0.5 + 0.5 * Math.sin(t * 2.7);
  const dx = x - EVENT_CENTER.x;
  const dz = z - EVENT_CENTER.y;
  const d2 = dx * dx + dz * dz;
  const slump = -1.05 * Math.exp(-d2 / 14.0) * surge; // failure-plane collapse
  const tremor = Math.sin(t * 8.5 + x * 1.25 + z * 0.9) * 0.11; // seismic micro-tremor
  const crack = Math.sin(t * 2.8 + x * 0.45) * Math.exp(-d2 / 34.0) * 0.22; // traveling fracture wave
  const pulse = Math.sin(t * 11.5) * 0.05; // uniform shock jitter
  return slump + tremor + crack + pulse;
};

export const ProceduralTerrain: React.FC<TerrainProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  isSimulating,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);

  // Generate base terrain, wireframe and static color/height buffers
  const { geometry, wireframeGeometry, baseHeights, wireBase, baseColors } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(30, 30, 74, 74);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const heights = new Float32Array(pos.count);
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      pos.setY(i, y);
      heights[i] = y;

      // Elevation-based coloration (deep monsoon valley -> high cyan ridge)
      const n = Math.min(1, Math.max(0, (y + 4.5) / 12));
      if (n > 0.55) {
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.45 + n * 0.4;
        colors[i * 3 + 2] = 0.55 + n * 0.45;
      } else {
        colors[i * 3] = 0.015;
        colors[i * 3 + 1] = 0.05 + n * 0.14;
        colors[i * 3 + 2] = 0.1 + n * 0.2;
      }
    }

    (pos as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const wireGeo = new THREE.WireframeGeometry(geo);
    const wireArr = wireGeo.attributes.position.array as Float32Array;
    const wireBaseArr = new Float32Array(wireGeo.attributes.position.count);
    for (let i = 0; i < wireGeo.attributes.position.count; i++) {
      wireBaseArr[i] = wireArr[i * 3 + 1];
    }

    return {
      geometry: geo,
      wireframeGeometry: wireGeo,
      baseHeights: heights,
      wireBase: wireBaseArr,
      baseColors: colors,
    };
  }, []);

  // Ground-anchored sensor placements (nodes ride the hill surface)
  const nodePositions = useMemo(() => {
    const map = new Map<string, [number, number, number]>();
    for (const s of sensors) {
      const [x, , z] = s.position;
      map.set(s.id, [x, getTerrainHeight(x, z) + NODE_CLEARANCE, z]);
    }
    return map;
  }, [sensors]);

  // Inter-node telemetry link vectors
  const linePoints = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < sensors.length - 1; i++) {
      const a = nodePositions.get(sensors[i].id);
      const b = nodePositions.get(sensors[i + 1].id);
      if (a && b) {
        pts.push(new THREE.Vector3(a[0], a[1] + 0.15, a[2]));
        pts.push(new THREE.Vector3(b[0], b[1] + 0.15, b[2]));
      }
    }
    return pts;
  }, [sensors, nodePositions]);

  const linesGeometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(linePoints), [linePoints]);

  // Live terrain animation (idle breathing / landslide motion) + heat coloring
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current || !wireRef.current) return;

    const meshGeo = meshRef.current.geometry;
    const posAttr = meshGeo.attributes.position;
    const posArr = posAttr.array as Float32Array;

    const wireGeo = wireRef.current.geometry;
    const wireAttr = wireGeo.attributes.position as THREE.BufferAttribute;
    const wireArr = wireAttr.array as Float32Array;

    for (let i = 0, n = baseHeights.length; i < n; i++) {
      const x = posArr[i * 3];
      const z = posArr[i * 3 + 2];
      posArr[i * 3 + 1] = baseHeights[i] + deform(x, z, t, !!isSimulating);
    }
    for (let i = 0, m = wireBase.length; i < m; i++) {
      const x = wireArr[i * 3];
      const z = wireArr[i * 3 + 2];
      wireArr[i * 3 + 1] = wireBase[i] + deform(x, z, t, !!isSimulating);
    }

    posAttr.needsUpdate = true;
    wireAttr.needsUpdate = true;
    meshGeo.computeVertexNormals();

    if (isSimulating) {
      const colAttr = meshGeo.attributes.color as THREE.BufferAttribute;
      const colArr = colAttr.array as Float32Array;
      const surge = 0.5 + 0.5 * Math.sin(t * 2.7);
      for (let i = 0, n = baseHeights.length; i < n; i++) {
        const x = posArr[i * 3];
        const z = posArr[i * 3 + 2];
        const dx = x - EVENT_CENTER.x;
        const dz = z - EVENT_CENTER.y;
        const heat = Math.exp(-(dx * dx + dz * dz) / 12.0) * surge;
        colArr[i * 3] = baseColors[i * 3] + (0.92 - baseColors[i * 3]) * heat * 0.8;
        colArr[i * 3 + 1] = baseColors[i * 3 + 1] + (0.14 - baseColors[i * 3 + 1]) * heat * 0.8;
        colArr[i * 3 + 2] = baseColors[i * 3 + 2] + (0.22 - baseColors[i * 3 + 2]) * heat * 0.8;
      }
      colAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Main solid terrain surface */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.7}
          metalness={0.25}
          wireframe={false}
          flatShading
        />
      </mesh>

      {/* Animated contour wireframe overlay */}
      <lineSegments ref={wireRef} geometry={wireframeGeometry}>
        <lineBasicMaterial color="#00f2fe" opacity={0.1} transparent />
      </lineSegments>

      {/* Animated sensor telemetry links */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          color={isSimulating ? '#ff2a5f' : '#00f2fe'}
          opacity={0.35}
          transparent
        />
      </lineSegments>

      {/* Sensor node objects */}
      {sensors.map((sensor) => {
        const pos = nodePositions.get(sensor.id);
        if (!pos) return null;

        const isSelected = sensor.id === selectedSensorId;
        const isCritical = sensor.status === 'CRITICAL';
        const isWarning = sensor.status === 'WARNING';

        const nodeColor = isCritical ? '#ff2a5f' : isWarning ? '#ffb703' : '#00f2fe';

        return (
          <group key={sensor.id} position={pos}>
            {/* Outer pulsing ring */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.45, 32]} />
              <meshBasicMaterial color={nodeColor} opacity={isSelected ? 0.8 : 0.4} transparent />
            </mesh>

            {/* Glowing sensor sphere core */}
            <mesh
              position={[0, 0.25, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectSensor(sensor.id);
              }}
              onPointerOver={() => (document.body.style.cursor = 'pointer')}
              onPointerOut={() => (document.body.style.cursor = 'auto')}
            >
              <sphereGeometry args={[0.22, 16, 16]} />
              <meshStandardMaterial
                color={nodeColor}
                emissive={nodeColor}
                emissiveIntensity={isSelected ? 2.5 : 1.2}
                roughness={0.1}
              />
            </mesh>

            {/* Vertical beacon ray */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
              <meshBasicMaterial color={nodeColor} opacity={0.3} transparent />
            </mesh>

            {/* Floating data tag for selected sensor */}
            {isSelected && (
              <Html position={[0, 1.6, 0]} center distanceFactor={14}>
                <div className="glass-panel p-3 rounded-xl border border-cyan-400/40 shadow-2xl min-w-[190px] backdrop-blur-xl pointer-events-none font-mono">
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-2">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wide">{sensor.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isCritical
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50'
                          : isWarning
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50'
                          : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300 mb-1.5">
                    <div>
                      <span className="text-slate-400 block text-[8px]">X ACCEL</span>
                      <span className="font-semibold text-cyan-300">{sensor.accelX}g</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px]">Y ACCEL</span>
                      <span className="font-semibold text-cyan-300">{sensor.accelY}g</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[8px]">Z ACCEL</span>
                      <span className="font-semibold text-cyan-300">{sensor.accelZ}g</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] pt-1 border-t border-slate-800 text-slate-400">
                    <span>VIB RMS: <strong className="text-white">{sensor.vibration}g</strong></span>
                    <span>BAT: <strong className="text-emerald-400">{sensor.battery}%</strong></span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
};