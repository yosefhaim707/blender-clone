import React from "react";

export default function Geometry({ type }: { type: string }) {
  switch (type) {
    case "cube": return <boxGeometry args={[1,1,1]} />;
    case "sphere": return <sphereGeometry args={[0.75, 32, 16]} />;
    case "cone": return <coneGeometry args={[0.7, 1, 32]} />;
    case "torus": return <torusGeometry args={[0.6, 0.2, 12, 64]} />;
    case "plane": return <planeGeometry args={[2,2]} />;
    default: return null;
  }
}


