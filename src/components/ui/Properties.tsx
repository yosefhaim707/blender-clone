import React from "react";
import { useStore } from "../../store";
import Panel from "./Panel";

export default function Properties({ embedded = false }: { embedded?: boolean }) {
  const selectedId = useStore(s => s.selectedId);
  const obj = useStore(s => s.objects.find(o => o.id === s.selectedId));
  const updateObject = useStore(s => s.updateObject);
  if (!selectedId || !obj) return null;

  const updateVec3 = (field: "position"|"rotation"|"scale", idx: number, val: number) => {
    const next = [...(obj as any)[field]]; next[idx] = val; updateObject(obj.id, { [field]: next } as any);
  };

  const content = (
    <Panel title={`Properties – ${obj.name}`}>
        <div className="text-[13px] flex flex-col gap-2.5">
          <label className="flex items-center justify-between gap-2 font-medium">Color <input className="h-5 w-9 rounded-md border border-[#e7e3ff] bg-white" type="color" value={obj.color} onChange={e => updateObject(obj.id, { color: (e.target as HTMLInputElement).value })} /></label>
          {["position","rotation","scale"].map((k) => (
            <div key={k}>
              <div className="font-semibold capitalize mb-1 bg-gradient-to-r from-[#7b61ff] to-[#4de0ff] bg-clip-text text-transparent">{k}</div>
              <div className="grid grid-cols-3 gap-1.5">
                {[0,1,2].map(i => (
                  <input key={i} type="number" step={k==="rotation"?1:0.1} value={(obj as any)[k][i]} onChange={e => updateVec3(k as any, i, Number((e.target as HTMLInputElement).value))} className="px-2 py-1 rounded-md border border-[#e7e3ff] bg-white text-[#1a1030] focus:outline-none focus:ring-2 focus:ring-[#7b61ff] font-medium text-[13px]" />
                ))}
              </div>
            </div>
          ))}
        </div>
    </Panel>
  );

  if (embedded) return content;
  return <div className="fixed right-4 bottom-4 z-50 w-80 max-w-[92vw] sm:w-80">{content}</div>;
}


