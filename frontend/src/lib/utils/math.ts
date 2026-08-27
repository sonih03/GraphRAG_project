import * as THREE from 'three';

/**
 * 3D Geometric & Harmonic Wave Math Utilities
 * Compact, cohesive, zero-occlusion layout for 15-minute lecture presentation.
 */

// Low-frequency gentle micro-wave displacement that keeps the spherical silhouette stable
export function getOrganicDisplacement(x: number, y: number, z: number, time: number): number {
  const wave1 = Math.sin(x * 1.6 + time * 0.5) * Math.cos(y * 1.6 + time * 0.4) * Math.sin(z * 1.6 + time * 0.35);
  const gentleTwitch = Math.pow(Math.sin(time * 0.6), 6) * 0.035;
  const wave2 = Math.sin(x * 3.2 - time * 0.8) * Math.cos(z * 3.2 + time * 0.7) * (0.02 + gentleTwitch);
  const wave3 = Math.sin((x * 4.5 + y * 4.5 + z * 4.5) + time * 1.0) * 0.015;
  return wave1 * 0.035 + wave2 + wave3;
}

/**
 * Pure Mathematical Centroid Core Regular Tetrahedron Generator
 * 
 * 1. Center Core (Origin [0, 0, 0]): 제3편 채권 (Central Law Hub connected to all other parts)
 * 2. Regular Tetrahedron 4 Vertices: 제1편 총칙, 제2편 물권, 제4편 친족, 제5편 상속
 *    - All 4 outer vertices satisfy: ||P_k - Origin|| = R (Exact identical sphere radius R)
 *    - All 4 outer vertices satisfy: ||P_i - P_j|| = sqrt(8/3) * R (Exact identical pairwise distance)
 */
export function generateTetrahedronClusters(radius: number = 4.2): THREE.Vector3[] {
  // Pure Regular Tetrahedron Vertices around Origin
  const v1 = new THREE.Vector3(0.00, radius, 0.00);                                                 // Vertex 1: Top (+Y)
  const v2 = new THREE.Vector3(radius * Math.sqrt(8) / 3, -radius / 3, 0.00);                         // Vertex 2: Right-Bottom
  const v3 = new THREE.Vector3(-radius * Math.sqrt(2) / 3, -radius / 3, radius * Math.sqrt(6) / 3);    // Vertex 3: Left-Bottom Front
  const v4 = new THREE.Vector3(-radius * Math.sqrt(2) / 3, -radius / 3, -radius * Math.sqrt(6) / 3);    // Vertex 4: Left-Bottom Back

  // Apply elegant tilt rotation for optimal 3D presentation viewing
  const tiltEuler = new THREE.Euler(0.25, 0.35, 0, 'XYZ');
  v1.applyEuler(tiltEuler);
  v2.applyEuler(tiltEuler);
  v3.applyEuler(tiltEuler);
  v4.applyEuler(tiltEuler);

  return [v1, v2, v3, v4];
}

// Deterministic Mathematical Regular Tetrahedron Vertices (Radius R=2.4 for full-screen DB mode fit)
const TETRA_RADIUS = 2.8;
const tetraVertices = generateTetrahedronClusters(TETRA_RADIUS);

// 5 Part Cluster Definitions in 3D Space (Central Hub + Regular Tetrahedron)
export const PART_CLUSTERS = [
  { id: 'part-1', name: '제1편 총칙', range: [1, 184], center: tetraVertices[0], color: '#38bdf8' },         // Tetrahedron Vertex #1 (Top)
  { id: 'part-2', name: '제2편 물권', range: [185, 372], center: tetraVertices[1], color: '#818cf8' },       // Tetrahedron Vertex #2 (Right-Bottom)
  { id: 'part-3', name: '제3편 채권', range: [373, 766], center: new THREE.Vector3(0, 0, 0), color: '#c084fc' }, // ★ CENTER CORE (Origin [0, 0, 0])
  { id: 'part-4', name: '제4편 친족', range: [767, 996], center: tetraVertices[2], color: '#34d399' },       // Tetrahedron Vertex #3 (Left-Bottom Front)
  { id: 'part-5', name: '제5편 상속', range: [997, 1118], center: tetraVertices[3], color: '#fbbf24' },       // Tetrahedron Vertex #4 (Left-Bottom Back)
];

// Spatially distinct 3D article position with dense compact clustering
export function getArticlePosition(num: number): THREE.Vector3 {
  let cluster = PART_CLUSTERS[0];
  for (const c of PART_CLUSTERS) {
    if (num >= c.range[0] && num <= c.range[1]) {
      cluster = c;
      break;
    }
  }

  // Key demonstration articles - tight distinct offsets around dense cluster center
  if (num === 214) return new THREE.Vector3(cluster.center.x, cluster.center.y + 0.35, cluster.center.z);
  if (num === 213) return new THREE.Vector3(cluster.center.x - 0.45, cluster.center.y - 0.15, cluster.center.z + 0.15);
  if (num === 245) return new THREE.Vector3(cluster.center.x + 0.45, cluster.center.y - 0.15, cluster.center.z - 0.15);

  if (num === 750) return new THREE.Vector3(cluster.center.x - 0.45, cluster.center.y + 0.15, cluster.center.z + 0.15);
  if (num === 741) return new THREE.Vector3(cluster.center.x + 0.45, cluster.center.y - 0.15, cluster.center.z - 0.15);

  if (num === 13) return new THREE.Vector3(cluster.center.x, cluster.center.y + 0.35, cluster.center.z);
  if (num === 14) return new THREE.Vector3(cluster.center.x - 0.45, cluster.center.y - 0.2, cluster.center.z);
  if (num === 15) return new THREE.Vector3(cluster.center.x + 0.45, cluster.center.y - 0.2, cluster.center.z);
  if (num === 16) return new THREE.Vector3(cluster.center.x, cluster.center.y - 0.4, cluster.center.z);

  // Dense spherical dispersion around cluster center (clean ball shape)
  const offsetIndex = num - cluster.range[0];
  const totalInCluster = cluster.range[1] - cluster.range[0] + 1;
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (offsetIndex / Math.max(1, totalInCluster - 1)) * 2;
  const r = Math.sqrt(Math.max(0, 1 - y * y)) * 0.50;
  const theta = offsetIndex * goldenAngle;

  const px = cluster.center.x + Math.cos(theta) * r + Math.sin(num * 7.13) * 0.065;
  const py = cluster.center.y + y * 0.48 + Math.cos(num * 3.77) * 0.065;
  const pz = cluster.center.z + Math.sin(theta) * r + Math.sin(num * 5.41) * 0.065;

  return new THREE.Vector3(px, py, pz);
}

// Identify which Part cluster indices (0 to 4) are involved in a list of article numbers
export function getInvolvedClusterIndices(articleNumbers: number[]): number[] {
  const clusterSet = new Set<number>();
  for (const num of articleNumbers) {
    for (let i = 0; i < PART_CLUSTERS.length; i++) {
      if (num >= PART_CLUSTERS[i].range[0] && num <= PART_CLUSTERS[i].range[1]) {
        clusterSet.add(i);
        break;
      }
    }
  }
  return clusterSet.size > 0 ? Array.from(clusterSet) : [0];
}

// Calculate optimal camera position and lookAt targeting single or multiple active clusters
export function calculateClusterCameraFraming(clusterIndices: number[]) {
  if (clusterIndices.length === 1) {
    const cluster = PART_CLUSTERS[clusterIndices[0]];
    return {
      camPos: new THREE.Vector3(cluster.center.x - 0.6, cluster.center.y, cluster.center.z + 3.8),
      lookAt: new THREE.Vector3(cluster.center.x, cluster.center.y, cluster.center.z),
    };
  }

  // Multi-cluster: calculate centroid of active clusters
  const center = new THREE.Vector3(0, 0, 0);
  for (const idx of clusterIndices) {
    center.add(PART_CLUSTERS[idx].center);
  }
  center.divideScalar(clusterIndices.length);

  // Framing targeting multi-cluster centroid with side room for right AI panel
  return {
    camPos: new THREE.Vector3(center.x - 1.2, center.y + 0.3, center.z + 6.8),
    lookAt: new THREE.Vector3(center.x, center.y, center.z),
  };
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

// Generate 5-Part Knowledge Graph Network Clusters for Civil Act (Dense compact spherical satellite balls)
export function generateOverviewPositions(pointCount: number) {
  const oPos = new Float32Array(pointCount * 3);
  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  for (let i = 0; i < pointCount; i++) {
    const clusterIdx = i % 5;
    const center = PART_CLUSTERS[clusterIdx].center;

    // Dense compact spherical distribution within each part cluster (clear ball shapes)
    const localIndex = Math.floor(i / 5);
    const localCount = Math.floor(pointCount / 5);
    const y = 1 - (localIndex / Math.max(1, localCount - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y)) * (0.45 + (i % 5) * 0.025);
    const theta = (2 * Math.PI * localIndex) / goldenRatio;

    const spreadX = Math.sin(i * 11.23) * 0.10;
    const spreadY = Math.cos(i * 17.89) * 0.10;
    const spreadZ = Math.sin(i * 23.45) * 0.10;

    oPos[i * 3] = center.x + Math.cos(theta) * r + spreadX;
    oPos[i * 3 + 1] = center.y + y * 0.48 + spreadY;
    oPos[i * 3 + 2] = center.z + Math.sin(theta) * r + spreadZ;
  }

  return oPos;
}
