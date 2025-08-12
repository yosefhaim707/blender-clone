import React from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import "./hero.css";
import Logo from "./components/ui/Logo";

export default function Hero() {
  const bgRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = bgRef.current;
    if (!container) return;

    // Defer init to next frame to ensure container has layout size
    let rafId: number | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let disposed = false;

    const init = () => {
      if (disposed) return;
      const scene = new THREE.Scene();
      scene.background = null; // transparent to let page gradient show through

      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      const camera = new THREE.PerspectiveCamera(
      60,
        width / height,
      1,
      1000
    );
    camera.position.set(0, 0, 16);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      container.appendChild(renderer.domElement);

    const gu = { time: { value: 0 } } as { time: { value: number } };

      const clock = new THREE.Clock();
      let points: THREE.Points | null = null;
      const WORLD_W = 29; // slightly smaller width
      const WORLD_H = 18; // slightly smaller height

      const sampleLogo = async () => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/logo-mono.svg";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Logo image load failed"));
        });

        const S = 480; // sampling canvas size for detail
        const canvas = document.createElement("canvas");
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, S, S);
        // Fit image into square with padding
        const pad = Math.floor(S * 0.08);
        ctx.drawImage(img, pad, pad, S - pad * 2, S - pad * 2);
        const { data } = ctx.getImageData(0, 0, S, S);
        const step = 3; // pixel step (3 => fewer points, better perf)
        const positions: number[] = [];
        const worldW = WORLD_W, worldH = WORLD_H;
        for (let y = 0; y < S; y += step) {
          for (let x = 0; x < S; x += step) {
            const idx = (y * S + x) * 4;
            const a = data[idx + 3];
            if (a > 25) {
              const nx = (x / (S - 1)) * 2 - 1;
              const ny = (y / (S - 1)) * 2 - 1;
              const wx = nx * (worldW / 2);
              const wy = -ny * (worldH / 2);
              const wz = (Math.random() - 0.5) * 0.4;
              positions.push(wx, wy, wz);
            }
          }
        }
        return positions;
      };

      const sampleText = (text: string) => {
        const S = 480;
        const canvas = document.createElement("canvas");
        canvas.width = S; canvas.height = S;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0,0,S,S);
        const pad = Math.floor(S * 0.08);
        ctx.fillStyle = "#fff";
        // scale font to fit
        let fontSize = S - pad * 2;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        while (fontSize > 10) {
          ctx.font = `900 ${fontSize}px 'Inter', 'Mona Sans', sans-serif`;
          const w = ctx.measureText(text).width;
          if (w <= S - pad * 2) break;
          fontSize -= 6;
        }
        ctx.font = `900 ${fontSize}px 'Inter', 'Mona Sans', sans-serif`;
        ctx.fillText(text, S/2, S/2);
        const { data } = ctx.getImageData(0,0,S,S);
        const positions: number[] = [];
        const worldW = WORLD_W, worldH = WORLD_H;
        const step = 3;
        for (let y=0;y<S;y+=step){
          for(let x=0;x<S;x+=step){
            const a = data[(y*S+x)*4+3];
            if(a>25){
              const nx = (x/(S-1))*2-1; const ny = (y/(S-1))*2-1;
              const wx = nx*(worldW/2); const wy = -ny*(worldH/2); const wz=(Math.random()-0.5)*0.4;
              positions.push(wx, wy, wz);
            }
          }
        }
        return positions;
      };

      const buildMorph = async () => {
        const [logoPos, n707Pos, d3Pos] = [await sampleLogo(), sampleText("707"), sampleText("3D")];
        const N = Math.max(logoPos.length/3, n707Pos.length/3, d3Pos.length/3) | 0;
        function expand(src: number[]): Float32Array {
          const out = new Float32Array(N*3);
          const count = src.length/3;
          for (let i=0;i<N;i++){
            const j = (i < count) ? i : Math.floor(Math.random()*count);
            out[i*3+0] = src[j*3+0] + (Math.random()-0.5)*0.02;
            out[i*3+1] = src[j*3+1] + (Math.random()-0.5)*0.02;
            out[i*3+2] = src[j*3+2] + (Math.random()-0.5)*0.02;
          }
          return out;
        }
        const tA = expand(logoPos);
        const tB = expand(n707Pos);
        const tC = expand(d3Pos);

        const sizesAttr: number[] = [];
        const shiftAttr: number[] = [];
        for (let i=0;i<N;i++){
          sizesAttr.push(0.9 + Math.random()*0.7);
          shiftAttr.push(
            Math.random()*Math.PI,
            Math.random()*Math.PI*2,
            (Math.random()*0.9+0.1)*Math.PI*0.08,
            Math.random()*0.5+0.3
          );
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(tA, 3));
        g.setAttribute("targetA", new THREE.Float32BufferAttribute(tA, 3));
        g.setAttribute("targetB", new THREE.Float32BufferAttribute(tB, 3));
        g.setAttribute("targetC", new THREE.Float32BufferAttribute(tC, 3));
        g.setAttribute("sizes", new THREE.Float32BufferAttribute(new Float32Array(sizesAttr), 1));
        g.setAttribute("shift", new THREE.Float32BufferAttribute(new Float32Array(shiftAttr), 4));

        const m = new THREE.ShaderMaterial({
          uniforms: { time: gu.time, uSize: { value: 1.5 } },
          vertexShader: `
            uniform float time; uniform float uSize; attribute float sizes; attribute vec4 shift; 
            attribute vec3 targetA; attribute vec3 targetB; attribute vec3 targetC; varying vec3 vColor;
            void main(){
              float phase = mod(time * 0.33, 3.0); // ~9s full cycle
              vec3 a; vec3 b; float t;
              if (phase < 1.0) { a = targetA; b = targetB; t = phase; }
              else if (phase < 2.0) { a = targetB; b = targetC; t = phase - 1.0; }
              else { a = targetC; b = targetA; t = phase - 2.0; }
              t = smoothstep(0.0, 1.0, t);
              vec3 transformed = mix(a, b, t);
              float moveT = mod(shift.x + shift.z * time, 6.28318530718);
              float moveS = mod(shift.y + shift.z * time, 6.28318530718);
              transformed += vec3(cos(moveS) * sin(moveT), cos(moveT), sin(moveS) * sin(moveT)) * shift.w * 0.12;
              float breathe = 1.0 + 0.04 * sin(time * 1.5);
              transformed.xy *= breathe;
              float acc = clamp((transformed.x + 12.0) / 24.0, 0.0, 1.0);
              vColor = mix(vec3(123.,97.,255.)/255., vec3(77.,241.,143.)/255., acc);
              vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
              float size = uSize * sizes; size *= (150.0 / -mvPosition.z);
              gl_PointSize = size; gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            precision mediump float; varying vec3 vColor; void main(){
              float d = length(gl_PointCoord.xy - 0.5);
              float alpha = 0.42 * smoothstep(0.5, 0.12, d);
              if(alpha <= 0.0) discard; gl_FragColor = vec4(vColor, alpha);
            }
          `,
          transparent: true, depthTest: false, blending: THREE.AdditiveBlending,
        });

        points = new THREE.Points(g, m);
        scene.add(points);
      };

      buildMorph().catch(() => {/* ignore */});

      const animate = () => {
        const t = clock.getElapsedTime() * 0.5;
        gu.time.value = t * Math.PI;
        if (points) points.rotation.y = 0.0;
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);

      const handleResize = () => {
        if (!container) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      };
      window.addEventListener("resize", handleResize);
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Cleanup
      return () => {
        disposed = true;
        renderer.setAnimationLoop(null);
        window.removeEventListener("resize", handleResize);
        resizeObserver?.disconnect();
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    rafId = requestAnimationFrame(() => init());
    return () => {
      disposed = true;
      if (rafId) cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden text-white bg-[radial-gradient(120%_140%_at_50%_-10%,#efe7ff,#5a33aa_60%,#2a0f4d_100%)]">
      <div ref={bgRef} className="absolute inset-0 z-0 pointer-events-none" aria-hidden />
      {/* global dim to improve readability */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-black/6" aria-hidden />

      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-4xl w-full">
          <div className="glow-card mx-auto rounded-2xl px-0 py-0">
            <div className="card-inner text-center">
              <div className="absolute top-3 left-3 opacity-90 drop-shadow-md">
                <Logo size={24} variant="mono" />
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 backdrop-blur border border-white/20 text-white/95">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="text-sm">In‑browser 3D editor</span>
              </div>

            <h1 className="mt-5 md:mt-6 text-5xl md:text-6xl font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              707 3D — Design in your browser
            </h1>
            <p className="mt-3 md:mt-4 text-lg md:text-xl text-white/95 drop-shadow-[0_1px_6px_rgba(0,0,0,0.6)]">
              707 3D is a minimal 3D editor powered by React Three Fiber and three.js. Create, transform,
              and export objects with an intuitive, lightweight interface.
            </p>

              <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/app"
                className="rounded-lg bg-white text-slate-900 font-semibold px-6 py-3 shadow-lg shadow-black/40 hover:shadow-xl hover:-translate-y-0.5 transition"
              >
                Get started
              </Link>
              <a
                href="https://github.com/pmndrs/react-three-fiber"
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-transparent text-white font-medium px-6 py-3 border border-white/50 hover:bg-white/10 transition"
              >
                Learn more
              </a>
            </div>
            </div>
            <div className="glow" />
          </div>
        </div>
      </div>
    </div>
  );
}


