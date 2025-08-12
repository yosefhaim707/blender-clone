import React from "react";
import { useStore } from "../../store";
import { TYPES } from "../../types";
import Panel from "./Panel";
import Button from "./Button";

export default function Toolbar({ embedded = false }: { embedded?: boolean }) {
  const addObject = useStore(s => s.addObject);
  const mode = useStore(s => s.mode);
  const setMode = useStore(s => s.setMode);
  const snap = useStore(s => s.snap);
  const toggleSnap = useStore(s => s.toggleSnap);
  const removeSelected = useStore(s => s.removeSelected);
  const duplicateSelected = useStore(s => s.duplicateSelected);
  const saveScene = useStore(s => s.saveScene);
  const loadScene = useStore(s => s.loadScene);
  const preferGlb = useStore(s => s.preferGlb);
  const setPreferGlb = useStore(s => s.setPreferGlb);

  const content = (
    <Panel>
        <div className="space-y-2.5">
          <div>
            <div className="text-[13px] font-semibold tracking-wide bg-gradient-to-r from-[#7b61ff] to-[#4de0ff] bg-clip-text text-transparent">Add</div>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TYPES.map(t => (
                <Button key={t} fullWidth onClick={() => addObject(t)}>{t}</Button>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <div className="text-[13px] font-semibold tracking-wide bg-gradient-to-r from-[#7b61ff] to-[#4de0ff] bg-clip-text text-transparent">Transform</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {["translate","rotate","scale"].map(m => (
                <Button key={m} variant="toggle" active={mode===m} onClick={() => setMode(m as any)}>{m[0].toUpperCase()+m.slice(1)}</Button>
              ))}
            </div>
            <label className="mt-1.5 flex items-center gap-2 text-[13px] font-medium text-gray-900"><input type="checkbox" checked={snap} onChange={toggleSnap}/> Snap</label>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              <Button onClick={duplicateSelected}>Duplicate (Ctrl+D)</Button>
              <Button variant="danger" onClick={removeSelected}>Delete (Del)</Button>
              <Button onClick={saveScene}>Save (Ctrl+S)</Button>
              <Button onClick={loadScene}>Load (Ctrl+L)</Button>
            </div>
          </div>

          <div className="h-px bg-gray-200" />

          <div>
            <div className="text-[13px] font-semibold tracking-wide bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Export</div>
            <label className="mt-1.5 flex items-center gap-2 text-[13px] font-medium text-gray-800"><input type="checkbox" checked={preferGlb} onChange={e => setPreferGlb(e.target.checked)} /> Try GLB (disabled here)</label>
            <div className="text-[12px] text-gray-600 font-medium">Ctrl+E saves JSON to avoid crashes.</div>
          </div>
        </div>
    </Panel>
  );

  if (embedded) return content;
  return <div className="fixed left-4 top-4 z-50 w-72 max-w-[92vw] sm:w-72">{content}</div>;
}


