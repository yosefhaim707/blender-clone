import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { TransformControls } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "../store";
import { radToDegTriplet, safeGetMesh } from "../utils";

export default function EditorControls({ groupRef, meshRefs }: { groupRef: React.MutableRefObject<any>, meshRefs: React.MutableRefObject<Map<string, any>> }) {
  const { camera, gl } = useThree();
  const selectedId = useStore(s => s.selectedId);
  const mode = useStore(s => s.mode);
  const snap = useStore(s => s.snap);
  const updateObject = useStore(s => s.updateObject);
  const setSelected = useStore(s => s.setSelected);
  const preferGlb = useStore(s => s.preferGlb);

  const tcRef = useRef<any>();

  useEffect(() => {
    const tc = tcRef.current;
    if (!tc) return;
    const mesh = safeGetMesh(meshRefs as any, selectedId);
    if (mesh) tc.attach(mesh); else tc.detach();
  }, [selectedId, meshRefs]);

  useEffect(() => {
    const tc = tcRef.current;
    if (!tc) return;
    tc.setTranslationSnap(snap ? 0.5 : null);
    tc.setRotationSnap(snap ? THREE.MathUtils.degToRad(15) : null);
    tc.setScaleSnap(snap ? 0.1 : null);
  }, [snap]);

  useEffect(() => {
    const tc = tcRef.current;
    if (!tc) return;
    function onChange() {
      const id = useStore.getState().selectedId;
      const mesh = safeGetMesh(meshRefs as any, id);
      if (!mesh) return;
      const p = mesh.position, r = mesh.rotation, s = mesh.scale;
      updateObject(id!, {
        position: [p.x, p.y, p.z] as any,
        rotation: radToDegTriplet([r.x, r.y, r.z] as any) as any,
        scale: [s.x, s.y, s.z] as any,
      });
    }
    tc.addEventListener("objectChange", onChange);
    return () => tc.removeEventListener("objectChange", onChange);
  }, [meshRefs, updateObject]);

  // External 'frame selected' command from top menu
  useEffect(() => {
    function onFrame() {
      const id = useStore.getState().selectedId;
      const mesh = safeGetMesh(meshRefs as any, id);
      if (mesh) {
        const box = new THREE.Box3().setFromObject(mesh);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size); box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const dist = maxDim * 2 + 2;
        camera.position.set(center.x + dist, center.y + dist, center.z + dist);
        camera.lookAt(center);
      }
    }
    window.addEventListener("viewport:frameSelected" as any, onFrame as any);
    return () => window.removeEventListener("viewport:frameSelected" as any, onFrame as any);
  }, [camera, meshRefs]);

  useEffect(() => {
    function onPointerDown(e: any) {
      if (e.target === gl.domElement) {
        setSelected(null);
      }
    }
    gl.domElement?.addEventListener("pointerdown", onPointerDown);
    return () => gl.domElement?.removeEventListener("pointerdown", onPointerDown);
  }, [gl, setSelected]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.ctrlKey || e.metaKey;
      if (!mod && (e.key === 'g' || e.key === 'G')) useStore.getState().setMode("translate");
      if (!mod && (e.key === 'r' || e.key === 'R')) useStore.getState().setMode("rotate");
      if (!mod && (e.key === 's' || e.key === 'S')) useStore.getState().setMode("scale");
      if (!mod && (e.key === 'f' || e.key === 'F')) {
        const id = useStore.getState().selectedId;
        const mesh = safeGetMesh(meshRefs as any, id);
        if (mesh) {
          const box = new THREE.Box3().setFromObject(mesh);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size); box.getCenter(center);
          const maxDim = Math.max(size.x, size.y, size.z);
          const dist = maxDim * 2 + 2;
          camera.position.set(center.x + dist, center.y + dist, center.z + dist);
          camera.lookAt(center);
        }
      }
      const removeSelected = useStore.getState().removeSelected;
      const duplicateSelected = useStore.getState().duplicateSelected;
      const saveScene = useStore.getState().saveScene;
      const loadScene = useStore.getState().loadScene;
      if (e.key === 'Delete') removeSelected();
      if (mod && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); duplicateSelected(); }
      if (mod && (e.key === 's' || e.key === 'S')) { e.preventDefault(); saveScene(); }
      if (mod && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); loadScene(); }
      if (mod && (e.key === 'e' || e.key === 'E')) { e.preventDefault(); /* export handled in canvas via groupRef */ }
      if (!mod && e.shiftKey && (e.key === 'S' || e.key === 's')) { e.preventDefault(); useStore.getState().toggleSnap(); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [camera, meshRefs]);

  return (
    <TransformControls ref={tcRef as any} mode={mode as any} object={null as any} />
  );
}


