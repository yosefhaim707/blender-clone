import * as THREE from "three";

export function exportJSON(node: THREE.Object3D) {
  const json = node.toJSON();
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'scene.json'; a.click();
  URL.revokeObjectURL(url);
}

export async function exportScene(node: THREE.Object3D | null | undefined) {
  if (!node) return;
  try {
    exportJSON(node);
  } catch (err) {
    console.error('[Export] JSON export failed:', err);
  }
}


