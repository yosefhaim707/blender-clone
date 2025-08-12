import React, { useEffect } from "react";
import * as THREE from "three";
import Geometry from "./Geometry";
import { useStore } from "../store";
import { ensureMap, pruneMeshRefMap, degToRadTriplet } from "../utils";

export default function SceneObjects({ groupRef, meshRefs }: { groupRef: React.MutableRefObject<any>, meshRefs: React.MutableRefObject<Map<string, any>> }) {
  const objects = useStore(s => s.objects);
  const setSelected = useStore(s => s.setSelected);

  useEffect(() => {
    const map = ensureMap(meshRefs);
    pruneMeshRefMap(map, objects.map(o => o.id));
  }, [objects, meshRefs]);

  return (
    <group ref={groupRef}>
      {objects.map(obj => (
        <mesh
          key={obj.id}
          ref={ref => {
            const map = ensureMap(meshRefs);
            if (ref) map.set(obj.id, ref); else map.delete(obj.id);
          }}
          position={obj.position as unknown as [number, number, number]}
          rotation={degToRadTriplet(obj.rotation) as any}
          scale={obj.scale as unknown as [number, number, number]}
          onPointerDown={(e) => { e.stopPropagation(); setSelected(obj.id); }}
          castShadow
          receiveShadow
        >
          <Geometry type={obj.type} />
          <meshStandardMaterial color={obj.color} side={obj.type === 'plane' ? THREE.DoubleSide : THREE.FrontSide} />
        </mesh>
      ))}
    </group>
  );
}


