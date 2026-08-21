'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EdgeBundleCore } from './EdgeBundleCore';

export function EdgeBundleCanvas() {
  return (
    <div className="relative w-full h-full min-h-[600px] overflow-hidden bg-black">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.03),transparent_70%)]" />

      <Canvas
        camera={{ position: [0, 0, 32], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, -10, -10]} intensity={0.2} />

        <Suspense fallback={null}>
          {/* Central spiral edge bundle */}
          <EdgeBundleCore />
        </Suspense>

        {/* Orbit controls for CUSTOM exploration */}
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={10}
          maxDistance={50}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
