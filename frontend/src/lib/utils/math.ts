/**
 * 3D Geometric & Harmonic Wave Math Utilities
 * High performance mathematical helpers for 5,000-particle morphing canvas.
 */

// Low-frequency gentle micro-wave displacement that keeps the spherical silhouette stable
export function getOrganicDisplacement(x: number, y: number, z: number, time: number): number {
  const wave1 = Math.sin(x * 1.6 + time * 0.5) * Math.cos(y * 1.6 + time * 0.4) * Math.sin(z * 1.6 + time * 0.35);
  const gentleTwitch = Math.pow(Math.sin(time * 0.6), 6) * 0.035;
  const wave2 = Math.sin(x * 3.2 - time * 0.8) * Math.cos(z * 3.2 + time * 0.7) * (0.02 + gentleTwitch);
  const wave3 = Math.sin((x * 4.5 + y * 4.5 + z * 4.5) + time * 1.0) * 0.015;
  return wave1 * 0.035 + wave2 + wave3;
}

// Generate Fibonacci Sphere Layout with natural scattering
export function generateSpherePositions(pointCount: number, sphereRadius: number = 2.1) {
  const sPos = new Float32Array(pointCount * 3);
  const jitters = new Float32Array(pointCount);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < pointCount; i++) {
    const y = 1 - (i / (pointCount - 1)) * 2;
    const theta = (2 * Math.PI * i) / goldenRatio;
    const jAngle = Math.sin(i * 13.37) * 0.045 + Math.cos(i * 7.77) * 0.035;
    const jY = Math.sin(i * 23.45) * 0.025;

    const finalY = Math.max(-0.99, Math.min(0.99, y + jY));
    const finalRadiusAtY = Math.sqrt(Math.max(0, 1 - finalY * finalY));
    const finalTheta = theta + jAngle;

    sPos[i * 3] = Math.cos(finalTheta) * finalRadiusAtY * sphereRadius;
    sPos[i * 3 + 1] = finalY * sphereRadius;
    sPos[i * 3 + 2] = Math.sin(finalTheta) * finalRadiusAtY * sphereRadius;

    jitters[i] = (i * 0.17) % (Math.PI * 2);
  }

  return { spherePositions: sPos, pointJitters: jitters };
}

// Generate 5-Part Knowledge Graph Network Clusters for Civil Act
export function generateOverviewPositions(pointCount: number) {
  const oPos = new Float32Array(pointCount * 3);

  // 5 Part Cluster Centers
  const clusterCenters = [
    { x: -4.5, y: 2.8, z: 1.0 },   // 제1편 총칙
    { x: 4.5, y: 3.2, z: -1.5 },   // 제2편 물권
    { x: 0.0, y: -4.0, z: 3.0 },   // 제3편 채권
    { x: -4.5, y: -3.0, z: -3.0 }, // 제4편 친족
    { x: 5.0, y: -2.5, z: 2.5 },   // 제5편 상속
  ];

  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < pointCount; i++) {
    const clusterIdx = i % 5;
    const center = clusterCenters[clusterIdx];

    // Local sphere distribution within each part cluster
    const localIndex = Math.floor(i / 5);
    const localCount = Math.floor(pointCount / 5);
    const y = 1 - (localIndex / Math.max(1, localCount - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y)) * (1.2 + (i % 7) * 0.12);
    const theta = (2 * Math.PI * localIndex) / goldenRatio;

    const spreadX = Math.sin(i * 11.23) * 0.35;
    const spreadY = Math.cos(i * 17.89) * 0.35;
    const spreadZ = Math.sin(i * 23.45) * 0.35;

    oPos[i * 3] = center.x + Math.cos(theta) * r + spreadX;
    oPos[i * 3 + 1] = center.y + y * 1.6 + spreadY;
    oPos[i * 3 + 2] = center.z + Math.sin(theta) * r + spreadZ;
  }

  return oPos;
}
