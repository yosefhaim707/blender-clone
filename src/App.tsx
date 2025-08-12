import React, { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import TopMenuBar from "./components/ui/TopMenuBar";
import Toolbar from "./components/ui/Toolbar";
import Outliner from "./components/ui/Outliner";
import Properties from "./components/ui/Properties";
import HelpOverlay from "./components/ui/HelpOverlay";
import SceneDecor from "./components/SceneDecor";
import SceneObjects from "./components/SceneObjects";
import EditorControls from "./components/EditorControls";
import Sidebar from "./components/ui/Sidebar";
import { ensureMap } from "./utils";
import { useStore } from "./store";

export default function App() {
  const groupRef = useRef<any>();
  const meshRefs = useRef<Map<string, any>>(new Map());

  useEffect(() => { ensureMap(meshRefs as any); return () => { (meshRefs.current as any)?.clear?.(); }; }, []);

  const objects = useStore(s => s.objects);
  const addObject = useStore(s => s.addObject);
  useEffect(() => { if (objects.length === 0) addObject("cube"); }, [objects.length, addObject]);

  const [leftOpen, setLeftOpen] = React.useState(true);
  const [rightOpen, setRightOpen] = React.useState(true);

  return (
    <div className="w-full h-screen relative pt-10 text-[13px] bg-[radial-gradient(120%_140%_at_50%_-10%,#f2f0ff,transparent_55%)] from-[#f2f0ff]">
      <TopMenuBar groupRef={groupRef as any} />
      {/* Soft color rails */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#dcd6ff] via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#ccf6ff] via-transparent to-transparent" />
      <Sidebar side="left" open={leftOpen} onToggle={() => setLeftOpen(o => !o)}>
        <Toolbar embedded />
        <div className="h-3" />
        <HelpOverlay embedded />
      </Sidebar>
      <Sidebar side="right" open={rightOpen} onToggle={() => setRightOpen(o => !o)}>
        <Outliner embedded />
        <div className="h-3" />
        <Properties embedded />
      </Sidebar>
      <Canvas shadows camera={{ position: [5,5,5], fov: 50 }}>
        <color attach="background" args={["#f7f8fb"]} />
        <SceneDecor />
        <SceneObjects groupRef={groupRef as any} meshRefs={meshRefs as any} />
        <EditorControls groupRef={groupRef as any} meshRefs={meshRefs as any} />
        <OrbitControls makeDefault enableDamping />
      </Canvas>
      {/* shortcuts shown embedded in left sidebar */}
    </div>
  );
}


