'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SlideData {
  index: number;
  isDemo: boolean;
}

const SLIDES: SlideData[] = [
  { index: 1, isDemo: false },
  { index: 2, isDemo: true },
  { index: 3, isDemo: false },
  { index: 4, isDemo: false },
  { index: 5, isDemo: false },
  { index: 6, isDemo: false },
  { index: 7, isDemo: false },
  { index: 8, isDemo: true },
  { index: 9, isDemo: false },
  { index: 10, isDemo: false },
  { index: 11, isDemo: true },
  { index: 12, isDemo: false },
  { index: 13, isDemo: false }
];

export type SlideVisualType = 'text' | 'regex' | 'ontology' | 'architecture' | 'comparison' | 'summary';

interface CylindricalSlideDeckProps {
  currentSlideIndex: number;
  isIntro: boolean;
}

export function CylindricalSlideDeck({ currentSlideIndex, isIntro }: CylindricalSlideDeckProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Virtual Cylinder parameters wrapping around the central DB graph edges
  const radius = 4.2;
  const slideCount = SLIDES.length;
  const angleStep = (2 * Math.PI) / 7.5; // ~48 degrees per slide
  const heightStep = 0.65;               // Helical drop per slide

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const activeIdx = Math.max(0, currentSlideIndex - 1);
    const activeAngle = activeIdx * angleStep;
    const activeY = 2.4 - activeIdx * heightStep;

    // Rotate and translate the deck group so active card faces camera at [0, 0, radius]
    const targetRotY = isIntro ? 0 : -activeAngle;
    const targetPosY = isIntro ? 0 : -activeY;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, delta * 4.0);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetPosY, delta * 4.0);

    // Smoothly update transparency of cards
    groupRef.current.children.forEach((child, idx) => {
      const mesh = child as THREE.Mesh;
      if (!mesh || !mesh.material) return;

      const slide = SLIDES[idx];
      const isActive = idx === activeIdx && !isIntro && !slide.isDemo;
      const mat = mesh.material as THREE.MeshPhysicalMaterial;

      let targetOpacity = 0.0;
      if (!isIntro && !slide.isDemo) {
        // High opacity for target card, subtle translucent ghost for neighboring cards on cylinder
        targetOpacity = isActive ? 0.94 : 0.18;
      }

      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, delta * 4.0);
      mesh.visible = mat.opacity > 0.01;
    });
  });

  return (
    <group ref={groupRef}>
      {SLIDES.map((slide, idx) => {
        // Compute static coordinates on the virtual cylinder surface
        const angle = idx * angleStep;
        const y = 2.4 - idx * heightStep;
        const x = radius * Math.sin(angle);
        const z = radius * Math.cos(angle);
        const rotY = angle + Math.PI; // Face outward from central spine

        return (
          <mesh
            key={slide.index}
            position={[x, y, z]}
            rotation={[0, rotY, 0]}
          >
            {/* Volumetric refractive curved glass geometry acting as a 3D physical lens */}
            <boxGeometry args={[7.2, 4.3, 0.12]} />
            <meshPhysicalMaterial
              color="#070911"
              transmission={0.88}
              roughness={0.16}
              thickness={1.3}
              ior={1.46}
              iridescence={0.85}
              iridescenceIOR={1.3}
              clearcoat={1.0}
              clearcoatRoughness={0.04}
              transparent={true}
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
