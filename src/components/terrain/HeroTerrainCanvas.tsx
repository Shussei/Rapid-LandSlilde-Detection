import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { ProceduralTerrain } from './ProceduralTerrain';
import { useSimulation } from '../../context/SimulationContext';

// Floating dust particle effect
const DustParticles: React.FC = () => {
  const points = React.useMemo(() => {
    const p = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = Math.random() * 8 + 1;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[points, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#00f2fe"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
};

export const HeroTerrainCanvas: React.FC = () => {
  const { sensors, selectedSensorId, selectSensor, isSimulating } = useSimulation();

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#05080e]">
      <Canvas shadows gl={{ antialias: true, alpha: true }}>
        <PerspectiveCamera makeDefault position={[0, 11, 19]} fov={48} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.6}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />

        {/* Atmospheric Fog */}
        <fog attach="fog" args={['#05080e', 12, 38]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[12, 18, 10]}
          intensity={1.5}
          color="#00f2fe"
          castShadow
        />
        <directionalLight
          position={[-12, 10, -10]}
          intensity={0.8}
          color="#ffb703"
        />

        {/* Ambient Particles */}
        <DustParticles />

        {/* 3D Terrain */}
        <Suspense fallback={null}>
          <ProceduralTerrain
            sensors={sensors}
            selectedSensorId={selectedSensorId || 'SN-01'}
            onSelectSensor={selectSensor}
            isSimulating={isSimulating}
          />
        </Suspense>
      </Canvas>

      {/* Subtle overlay gradient vignette */}
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05080e] via-[#05080e]/60 to-transparent pointer-events-none" />
    </div>
  );
};
