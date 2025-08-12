import React, { useState } from "react";
import { useStore } from "../../store";
import Panel from "./Panel";

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-gray-200 bg-white text-gray-800 text-[10px] leading-none shadow-sm">
      {children}
    </span>
  );
}

export default function HelpOverlay({ embedded = false }: { embedded?: boolean }) {
  const mode = useStore(s => s.mode);
  const snap = useStore(s => s.snap);
  const preferGlb = useStore(s => s.preferGlb);
  const [open, setOpen] = useState(true);

  // Open from menu command
  React.useEffect(() => {
    function onOpen() { setOpen(true); }
    window.addEventListener("ui:openShortcuts" as any, onOpen as any);
    return () => window.removeEventListener("ui:openShortcuts" as any, onOpen as any);
  }, []);

  if (embedded) {
    return (
      <Panel title="Shortcuts">
        <div className="text-[13px] leading-6">
          <ul className="space-y-1.5">
            <li><Kbd>G</Kbd> / <Kbd>R</Kbd> / <Kbd>S</Kbd> <span className="text-gray-600">— Move / Rotate / Scale</span> (<b>{mode}</b>)</li>
            <li><Kbd>Shift</Kbd> + <Kbd>S</Kbd> <span className="text-gray-600">— Toggle Snap</span> (<b>{snap?"on":"off"}</b>)</li>
            <li><Kbd>Del</Kbd> — Delete · <Kbd>Ctrl</Kbd> + <Kbd>D</Kbd> — Duplicate</li>
            <li><Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> — Save · <Kbd>Ctrl</Kbd> + <Kbd>L</Kbd> — Load · <Kbd>Ctrl</Kbd> + <Kbd>E</Kbd> — Export</li>
            <li><Kbd>F</Kbd> — Frame Selected · Click empty space — Deselect</li>
          </ul>
        </div>
      </Panel>
    );
  }

  return null;
}


