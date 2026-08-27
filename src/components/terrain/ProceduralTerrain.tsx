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

// Procedural noise formula for landslide terrain elevation
const getTerrainHeight = (x: number, z: number): number => {
  const noise1 = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 1.8;
  const noise2 = Math.sin(x * 0.7 + z * 0.5) * 0.9;
  const noise3 = Math.cos(x * 1.2 - z * 0.8) * 0.4;
  const ridge = Math.exp(-Math.pow(x * 0.2, 2)) * 1.5;
  return noise1 + noise2 + noise3 + ridge;
};

export const ProceduralTerrain: React.FC<TerrainProps> = ({
  sensors,
  selectedSensorId,
  onSelectSensor,
  isSimulating,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Generate terrain geometry and height map
  const { geometry, wireframeGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(28, 28, 70, 70);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      pos.setY(i, y);

      // Color gradient based on elevation
      const normY = (y + 2) / 5;
      if (normY > 0.6) {
        // High ridge - amber/cyan highlight
        colors[i * 3] = 0.0;
        colors[i * 3 + 1] = 0.8 * normY;
        colors[i * 3 + 2] = 0.9;
      } else {
        // Deep valley - deep forest navy
        colors[i * 3] = 0.03;
        colors[i * 3 + 1] = 0.12 * normY;
        colors[i * 3 + 2] = 0.22;
      }
    }

    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const wireframeGeo = new THREE.WireframeGeometry(geo);

    return { geometry: geo, wireframeGeometry: wireframeGeo };
  }, []);

  // Animate subtle ground pulse when landslide simulation is active
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (meshRef.current) {
      if (isSimulating) {
        meshRef.current.position.y = Math.sin(time * 8) * 0.08;
      } else {
        meshRef.current.position.y = 0;
      }
    }
  });

  // Communication mesh line vectors between sensors
  const linePoints = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < sensors.length - 1; i++) {
      const s1 = sensors[i].position;
      const s2 = sensors[i + 1].position;
      points.push(new THREE.Vector3(s1[0], s1[1] + 0.15, s1[2]));
      points.push(new THREE.Vector3(s2[0], s2[1] + 0.15, s2[2]));
    }
    return points;
  }, [sensors]);

  const linesGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(linePoints);
    return geo;
  }, [linePoints]);

  return (
    <group>
      {/* Main Solid Shaded Terrain */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.65}
          metalness={0.3}
          wireframe={false}
          flatShading
        />
      </mesh>

      {/* Terrain Contour Wireframe Overlay */}
      <lineSegments geometry={wireframeGeometry}>
        <lineBasicMaterial color="#00f2fe" opacity={0.12} transparent />
      </lineSegments>

      {/* Animated Sensor Telemetry Lines */}
      <lineSegments geometry={linesGeometry}>
        <lineBasicMaterial
          color={isSimulating ? '#ff2a5f' : '#00f2fe'}
          opacity={0.35}
          transparent
          linewidth={1.5}
        />
      </lineSegments>

      {/* Sensor Node Objects */}
      {sensors.map((sensor) => {
        const isSelected = sensor.id === selectedSensorId;
        const isCritical = sensor.status === 'CRITICAL';
        const isWarning = sensor.status === 'WARNING';

        const nodeColor = isCritical ? '#ff2a5f' : isWarning ? '#ffb703' : '#00f2fe';

        return (
          <group key={sensor.id} position={sensor.position}>
            {/* Outer pulsing ring */}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.45, 32]} />
              <meshBasicMaterial color={nodeColor} opacity={isSelected ? 0.8 : 0.4} transparent />
            </mesh>

            {/* Glowing Sensor Sphere Core */}
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

            {/* Vertical Beacon Ray */}
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
              <meshBasicMaterial color={nodeColor} opacity={0.3} transparent />
            </mesh>

            {/* Floating Data Tag for selected sensor */}
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
