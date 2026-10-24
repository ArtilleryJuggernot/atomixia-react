import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createPadlock } from './padlock';

const MAX_PIXEL_RATIO = 1.75;

export default function LockScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const attributes = { alpha: true, antialias: true, powerPreference: 'high-performance' as const };
    const gl = canvas.getContext('webgl2', attributes) || canvas.getContext('webgl', attributes);
    if (!gl) {
      wrap.classList.add('no-gl');
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    } catch {
      wrap.classList.add('no-gl');
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 20);
    camera.position.set(0.62, 0.18, 2.25);
    camera.lookAt(0, -0.02, 0);

    scene.add(new THREE.AmbientLight(0xb7c0ce, 0.85));
    const key = new THREE.DirectionalLight(0xf2d9a0, 2.8);
    key.position.set(2.4, 2.6, 3.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2583ff, 1.35);
    rim.position.set(-2.6, -1.1, 1.8);
    scene.add(rim);
    const glow = new THREE.PointLight(0xe8b86d, 6, 6, 2);
    glow.position.set(0, -0.1, 1.4);
    scene.add(glow);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    const lock = createPadlock(track);
    lock.group.rotation.y = 0.62;
    scene.add(lock.group);

    let frame = 0;
    let running = !reduce;
    const start = performance.now();

    function resize() {
      const width = wrap.clientWidth;
      const height = wrap.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function draw(now: number) {
      const t = reduce ? 0 : (now - start) / 1000;
      if (!reduce) {
        lock.group.rotation.y = 0.62 + t * 0.32;
        lock.ring.rotation.z = t * 0.18;
        lock.pulse.material.opacity = 0.45 + 0.55 * Math.abs(Math.sin(t * 2.1));
      }
      renderer.render(scene, camera);
    }

    resize();
    draw(performance.now());
    wrap.classList.add('is-live');

    const onResize = () => {
      resize();
      if (!running) draw(performance.now());
    };
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(([entry]) => {
      running = Boolean(entry?.isIntersecting) && !reduce;
    });
    observer.observe(wrap);

    function loop(now: number) {
      frame = window.requestAnimationFrame(loop);
      if (!running) return;
      draw(now);
    }
    if (!reduce) frame = window.requestAnimationFrame(loop);

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="lock-scene planet-badge" ref={wrapRef} aria-hidden="true">
      <svg className="lock-fallback" viewBox="0 0 200 200">
        <ellipse cx="100" cy="108" rx="78" ry="26" fill="none" stroke="#e8b86d" strokeOpacity="0.45" />
        <path d="M76 104V82a24 24 0 0 1 48 0v22" fill="none" stroke="#e8edf3" strokeWidth="8" strokeLinecap="round" />
        <rect x="64" y="98" width="72" height="56" rx="12" fill="#1b212b" stroke="#e8b86d" strokeWidth="1.6" />
        <circle cx="100" cy="120" r="7" fill="#e8b86d" />
        <path d="M100 127v14" stroke="#e8b86d" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <canvas ref={canvasRef} />
    </div>
  );
}
