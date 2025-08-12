export const TYPES = ["cube", "sphere", "cone", "torus", "plane"] as const;
export type ObjType = typeof TYPES[number];

export type Vec3 = [number, number, number];

export interface Obj {
  id: string;
  name: string;
  type: ObjType;
  position: Vec3;
  rotation: Vec3; // degrees
  scale: Vec3;
  color: string;
}


