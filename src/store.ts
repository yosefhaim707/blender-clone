import { create } from "zustand";
import type { Obj, ObjType } from "./types";

let _id = 1;
const newId = () => String(_id++);

type Mode = "translate" | "rotate" | "scale";

interface State {
  objects: Obj[];
  selectedId: string | null;
  mode: Mode;
  snap: boolean;
  preferGlb: boolean;
  setPreferGlb: (v: boolean) => void;
  addObject: (type: ObjType) => void;
  removeSelected: () => void;
  duplicateSelected: () => void;
  setSelected: (id: string | null) => void;
  setMode: (m: Mode) => void;
  toggleSnap: () => void;
  updateObject: (id: string, patch: Partial<Obj>) => void;
  renameObject: (id: string, name: string) => void;
  saveScene: () => void;
  loadScene: () => void;
}

export const useStore = create<State>((set, get) => ({
  objects: [],
  selectedId: null,
  mode: "translate",
  snap: false,
  preferGlb: false,
  setPreferGlb: (v) => set({ preferGlb: !!v }),
  addObject: (type) => set(() => {
    const id = newId();
    const name = `${type}-${id}`;
    const obj: Obj = {
      id, name, type,
      position: [0, 0.5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      color: "#8ab4f8",
    };
    return { objects: [...get().objects, obj], selectedId: id };
  }),
  removeSelected: () => set(() => {
    const { objects, selectedId } = get();
    return { objects: objects.filter(o => o.id !== selectedId), selectedId: null };
  }),
  duplicateSelected: () => set(() => {
    const { objects, selectedId } = get();
    const src = objects.find(o => o.id === selectedId);
    if (!src) return {} as Partial<State>;
    const id = newId();
    const copy: Obj = { ...src, id, name: `${src.name}-copy`, position: [src.position[0]+1, src.position[1], src.position[2]] };
    return { objects: [...objects, copy], selectedId: id };
  }),
  setSelected: (id) => set({ selectedId: id }),
  setMode: (m) => set({ mode: m }),
  toggleSnap: () => set(({ snap }) => ({ snap: !snap })),
  updateObject: (id, patch) => set(({ objects }) => ({
    objects: objects.map(o => o.id === id ? { ...o, ...patch } : o)
  })),
  renameObject: (id, name) => set(({ objects }) => ({
    objects: objects.map(o => o.id === id ? { ...o, name } : o)
  })),
  saveScene: () => {
    const data = JSON.stringify(get().objects);
    localStorage.setItem("blender-lite-scene", data);
  },
  loadScene: () => set(() => {
    const raw = localStorage.getItem("blender-lite-scene");
    if (!raw) return {} as Partial<State>;
    try {
      const arr = JSON.parse(raw);
      return { objects: Array.isArray(arr) ? arr : [], selectedId: null } as Partial<State>;
    } catch {
      return {} as Partial<State>;
    }
  }),
}));


