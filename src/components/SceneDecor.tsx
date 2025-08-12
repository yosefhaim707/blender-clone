import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { GizmoHelper, GizmoViewport } from "@react-three/drei";

export default function SceneDecor() {
  const lightRef = useRef<any>();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (lightRef.current) lightRef.current.position.set(Math.sin(t) * 6, 6, Math.cos(t) * 6);
  });
  return (
    <>
      <hemisphereLight intensity={0.35} />
      <directionalLight ref={lightRef as any} intensity={1} castShadow position={[5,8,5]} shadow-mapSize={[1024,1024]} />
      <mesh rotation={[-Math.PI/2,0,0]} receiveShadow position={[0,0,0]}>
        <planeGeometry args={[200,200]} />
        <meshStandardMaterial color="#e9eaee" />
      </mesh>
      <gridHelper args={[100, 100]} position={[0,0.01,0]} />
      <axesHelper args={[2]} />
      <GizmoHelper alignment="bottom-right" margin={[80,80]}> <GizmoViewport /> </GizmoHelper>
    </>
  );
}


