'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STRAND_COUNT = 240;
const PILLAR_HEIGHT = 24;

// Canvas's 3 edge colors
const colorBlue = new THREE.Color('#38bdf8');  // Sky Blue (References)
const colorGreen = new THREE.Color('#10b981'); // Emerald Green (Mutatis Mutandis)
const colorRed = new THREE.Color('#ef4444');   // Crimson Red (Exception To)

function getStrandColor(s: number): THREE.Color {
  const idx = s % 3;
  if (idx === 0) return colorBlue;
  if (idx === 1) return colorGreen;
  return colorRed;
}

export function EdgeBundleCore() {
  const pillarRef = useRef<THREE.Group>(null);

  // 1. Generate deterministic parameters for 240 strands to prevent SSR hydration mismatch
  const strandParams = useMemo(() => {
    const list = [];
    for (let s = 0; s < STRAND_COUNT; s++) {
      const radiusOffset = ((s * 17.31) % 1.2) - 0.6;
      const twistSpeed = (s % 3 === 0 ? 1 : 1.2) * (s % 7 === 0 ? -1 : 1);
      list.push({ radiusOffset, twistSpeed });
    }
    return list;
  }, []);

  // 2. Build geometry for static spiral strands
  const { linePositions, lineColors } = useMemo(() => {
    const SEGMENTS_PER_STRAND = 64;
    const posList: number[] = [];
    const colList: number[] = [];

    for (let s = 0; s < STRAND_COUNT; s++) {
      const strandAngleOffset = (s / STRAND_COUNT) * Math.PI * 2;
      const { radiusOffset, twistSpeed } = strandParams[s];
      const totalTurns = 1.8 * Math.PI * 2 * twistSpeed;

      let prevPoint = null;
      let prevColor = null;

      for (let i = 0; i <= SEGMENTS_PER_STRAND; i++) {
        const t = i / SEGMENTS_PER_STRAND;
        const y = (t - 0.5) * PILLAR_HEIGHT;

        // Uniform thickness: constant base radius of 2.2 instead of hyperboloid equation
        const radius = 2.2 + radiusOffset;

        const theta = strandAngleOffset + t * totalTurns + Math.sin(t * Math.PI * 3) * 0.2;

        const x = Math.cos(theta) * radius + Math.sin(y * 0.5 + s) * 0.15;
        const z = Math.sin(theta) * radius + Math.cos(y * 0.5 + s) * 0.15;

        const currentPoint = new THREE.Vector3(x, y, z);
        const currentColor = getStrandColor(s);

        if (prevPoint && prevColor) {
          posList.push(prevPoint.x, prevPoint.y, prevPoint.z);
          posList.push(currentPoint.x, currentPoint.y, currentPoint.z);

          colList.push(prevColor.r, prevColor.g, prevColor.b);
          colList.push(currentColor.r, currentColor.g, currentColor.b);
        }

        prevPoint = currentPoint;
        prevColor = currentColor;
      }
    }

    return {
      linePositions: new Float32BufferAttributeWrapper(posList),
      lineColors: new Float32BufferAttributeWrapper(colList),
    };
  }, [strandParams]);

  // 3. Shared Canvas Texture for soft glowing particles
  const particleTexture = useMemo(() => {
    if (typeof window === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 32, 32);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    // Slow rotation of entire core
    if (pillarRef.current) {
      pillarRef.current.rotation.y = state.clock.getElapsedTime() * 0.12;
    }
  });

  return (
    <group ref={pillarRef}>
      {/* 240 Twisted Spiral Strands */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true}
          transparent={true}
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Top Cluster Node (Blue theme) */}
      <ClusterNode
        posY={PILLAR_HEIGHT / 2}
        baseColor={colorBlue}
        texture={particleTexture}
      />

      {/* Bottom Cluster Node (Red theme) */}
      <ClusterNode
        posY={-PILLAR_HEIGHT / 2}
        baseColor={colorRed}
        texture={particleTexture}
      />
    </group>
  );
}

// Simple wrapper class to satisfy TypeScript for buffer attributes
class Float32BufferAttributeWrapper extends Float32Array {
  constructor(array: number[]) {
    super(array);
  }
}

interface ClusterNodeProps {
  posY: number;
  baseColor: THREE.Color;
  texture: THREE.CanvasTexture | null;
}

function ClusterNode({ posY, baseColor, texture }: ClusterNodeProps) {
  const clusterRef = useRef<THREE.Group>(null);
  const particleCount = 700;

  useFrame((state) => {
    if (clusterRef.current) {
      clusterRef.current.rotation.y = -state.clock.getElapsedTime() * 0.08;
    }
  });

  // Generate particle positions, colors, and internal connections
  const { pPositions, pColors, netPositions, netColors } = useMemo(() => {
    const pos: number[] = [];
    const col: number[] = [];
    const netPos: number[] = [];
    const netCol: number[] = [];

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 3.8;

      const px = r * Math.sin(phi) * Math.cos(theta);
      const py = (r * Math.sin(phi) * Math.sin(theta)) * 0.5; // Flattered sphere
      const pz = r * Math.cos(phi);

      pos.push(px, py, pz);

      const pColor = baseColor.clone();
      // Add slight HSL offsets for visual richness
      const tempHSL = { h: 0, s: 0, l: 0 };
      pColor.getHSL(tempHSL);
      pColor.setHSL(
        tempHSL.h + (Math.random() - 0.5) * 0.06,
        tempHSL.s,
        tempHSL.l + (Math.random() - 0.5) * 0.15
      );
      col.push(pColor.r, pColor.g, pColor.b);
    }

    // Micro Network Connections (90 lines)
    for (let i = 0; i < 90; i++) {
      const idx1 = Math.floor(Math.random() * particleCount) * 3;
      const idx2 = Math.floor(Math.random() * particleCount) * 3;

      netPos.push(pos[idx1], pos[idx1 + 1], pos[idx1 + 2]);
      netPos.push(pos[idx2], pos[idx2 + 1], pos[idx2 + 2]);

      netCol.push(col[idx1], col[idx1 + 1], col[idx1 + 2]);
      netCol.push(col[idx2], col[idx2 + 1], col[idx2 + 2]);
    }

    return {
      pPositions: new Float32Array(pos),
      pColors: new Float32Array(col),
      netPositions: new Float32Array(netPos),
      netColors: new Float32Array(netCol),
    };
  }, [baseColor]);

  return (
    <group ref={clusterRef} position={[0, posY, 0]}>
      {/* Glow Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[pColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.3}
          vertexColors={true}
          transparent={true}
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          map={texture || undefined}
          depthWrite={false}
        />
      </points>

      {/* Internal connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[netPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[netColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors={true}
          transparent={true}
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
