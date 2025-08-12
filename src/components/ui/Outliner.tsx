import React, { useState } from "react";
import { useStore } from "../../store";
import Panel from "./Panel";

export default function Outliner({ embedded = false }: { embedded?: boolean }) {
  const objects = useStore(s => s.objects);
  const selectedId = useStore(s => s.selectedId);
  const setSelected = useStore(s => s.setSelected);
  const renameObject = useStore(s => s.renameObject);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const content = (
    <Panel title="Outliner">
        <div className="flex flex-col gap-1 max-h-[50vh] overflow-auto pr-0.5 text-[13px]">
          {objects.map(o => (
            <div key={o.id} className={`flex items-center justify-between gap-2 px-2 py-1 rounded-md border transition-colors ${selectedId===o.id?"bg-[#edeafe] text-[#1a1030] border-[#e7e3ff]":"bg-white border-[#e7e3ff] text-[#1a1030] hover:bg-[#f5f2ff]"}`}>
              <div className="flex-1">
                {editingId===o.id ? (
                  <input autoFocus className="w-full text-[13px] font-medium px-2 py-1 rounded-md text-[#1a1030] bg-white border border-[#e7e3ff] focus:outline-none focus:ring-2 focus:ring-[#7b61ff]" value={tempName} onChange={e => setTempName(e.target.value)} onBlur={() => { renameObject(o.id, tempName || o.name); setEditingId(null); }} onKeyDown={(e) => { if (e.key==='Enter') { renameObject(o.id, tempName || o.name); setEditingId(null);} }} />
                ) : (
                  <button className="text-left text-[13px] font-medium w-full" onClick={() => setSelected(o.id)}>{o.name}</button>
                )}
              </div>
              <button className={`text-[12px] ${selectedId===o.id?"text-[#3b2c7f]":"text-[#61549d] hover:text-[#3b2c7f]"}`} onClick={() => { setEditingId(o.id); setTempName(o.name); }}>rename</button>
            </div>
          ))}
        </div>
    </Panel>
  );

  if (embedded) return content;
  return <div className="fixed right-4 top-4 z-50 w-80 max-w-[92vw] sm:w-80">{content}</div>;
}


