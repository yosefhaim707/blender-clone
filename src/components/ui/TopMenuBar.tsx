import React, { Fragment } from "react";
import { useStore } from "../../store";
import { exportScene } from "../../exporters";
import { Menu, Transition } from "@headlessui/react";
import Logo from "./Logo";

export default function TopMenuBar({ groupRef }: { groupRef: React.MutableRefObject<any> }) {
  const addObject = useStore(s => s.addObject);
  const saveScene = useStore(s => s.saveScene);
  const loadScene = useStore(s => s.loadScene);
  const setMode = useStore(s => s.setMode);
  const toggleSnap = useStore(s => s.toggleSnap);

  function openShortcuts() {
    window.dispatchEvent(new CustomEvent("ui:openShortcuts"));
  }

  function frameSelected() {
    window.dispatchEvent(new CustomEvent("viewport:frameSelected"));
  }

  return (
    <div className="fixed top-0 inset-x-0 z-[100] h-11 px-2 sm:px-4 flex items-center gap-3 sm:gap-6 bg-white/90 backdrop-blur border-b border-[#e7e3ff] shadow-[0_4px_18px_rgba(123,97,255,0.08)] text-[#1a1030]">
      <div className="flex items-center gap-2 pr-2">
        <Logo size={18} className="shrink-0" />
        <div className="hidden sm:block text-sm font-semibold bg-gradient-to-r from-[#7b61ff] to-[#4de0ff] bg-clip-text text-transparent">707 3D</div>
      </div>
      <BarMenu label="File">
        <BarItem onClick={() => saveScene()}>Save</BarItem>
        <BarItem onClick={() => loadScene()}>Load</BarItem>
        <BarItem onClick={() => exportScene(groupRef.current)}>Export JSON</BarItem>
      </BarMenu>
      <BarMenu label="Edit">
        <BarItem onClick={() => setMode("translate")}>Translate</BarItem>
        <BarItem onClick={() => setMode("rotate")}>Rotate</BarItem>
        <BarItem onClick={() => setMode("scale")}>Scale</BarItem>
        <BarItem onClick={() => toggleSnap()}>Toggle Snap</BarItem>
      </BarMenu>
      <BarMenu label="Add">
        <BarItem onClick={() => addObject("cube")}>Cube</BarItem>
        <BarItem onClick={() => addObject("sphere")}>Sphere</BarItem>
        <BarItem onClick={() => addObject("cone")}>Cone</BarItem>
        <BarItem onClick={() => addObject("torus")}>Torus</BarItem>
        <BarItem onClick={() => addObject("plane")}>Plane</BarItem>
      </BarMenu>
      <BarMenu label="View">
        <BarItem onClick={frameSelected}>Frame Selected</BarItem>
      </BarMenu>
      <BarMenu label="Help">
        <BarItem onClick={openShortcuts}>Shortcuts</BarItem>
      </BarMenu>
    </div>
  );
}

function BarMenu({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Menu as="div" className="relative">
      <Menu.Button className="h-8 px-2 rounded-md text-sm text-[#1a1030] hover:bg-[#f3efff]">{label}</Menu.Button>
      <Transition as={Fragment}
        enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
        <Menu.Items className="absolute mt-1 min-w-[180px] rounded-md border border-[#e7e3ff] bg-white text-[#1a1030] shadow-xl focus:outline-none">
          <div className="py-1">
            {children}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function BarItem({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <Menu.Item>
      {({ active }) => (
        <button onClick={onClick} className={`w-full text-left px-3 py-1.5 text-sm ${active?"bg-[#f3efff]":""} text-[#1a1030]`}>
          {children}
        </button>
      )}
    </Menu.Item>
  );
}


