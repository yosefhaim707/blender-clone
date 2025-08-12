import * as THREE from "three";

export function degToRadTriplet(r: [number, number, number]): [number, number, number] {
  return [THREE.MathUtils.degToRad(r[0]), THREE.MathUtils.degToRad(r[1]), THREE.MathUtils.degToRad(r[2])];
}

export function radToDegTriplet(r: [number, number, number]): [number, number, number] {
  return [THREE.MathUtils.radToDeg(r[0]), THREE.MathUtils.radToDeg(r[1]), THREE.MathUtils.radToDeg(r[2])];
}

export function ensureMap<T = any>(ref: React.MutableRefObject<any>): Map<string, T> {
  if (!ref.current || typeof ref.current.set !== 'function' || typeof ref.current.get !== 'function') {
    ref.current = new Map<string, T>();
  }
  return ref.current as Map<string, T>;
}

export function safeGetMesh(meshRefs: React.MutableRefObject<Map<string, any> | undefined>, id: string | null) {
  if (!id) return null;
  const map = meshRefs?.current as Map<string, any> | undefined;
  if (!map || typeof (map as any).get !== 'function') return null;
  const m = map.get(id);
  return (m && (m as any).isObject3D) ? m : null;
}

export function pruneMeshRefMap(map: Map<string, any>, validIds: string[]) {
  const valid = new Set(validIds);
  for (const key of map.keys()) {
    if (!valid.has(key)) map.delete(key);
  }
}


