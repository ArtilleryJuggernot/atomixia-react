import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAX_PIXEL_RATIO = 1.5;

export default function SystemField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 800px)').matches;
    const attributes = { alpha: true, antialias: true, powerPreference: 'high-performance' as const };
    const gl = canvas.getContext('webgl2', attributes) || canvas.getContext('webgl', attributes);
    if (!gl) {
      canvas.hidden = true;
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    } catch {
      canvas.hidden = true;
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 20);
    camera.position.set(0, 0, 4.2);

    const count = mobile ? 42 : 96;
    const positions = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (Math.random() - 0.5) * 6.2;
      positions[index * 3 + 1] = (Math.random() - 0.5) * 4.4;
      positions[index * 3 + 2] = (Math.random() - 0.5) * 2.2;
    }
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x00e5ff,
      size: mobile ? 0.03 : 0.028,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(points);

    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff }),
    );
    scene.add(core);

    let frame = 0;
    let running = !reduce;
    const clock = new THREE.Clock();

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function draw() {
      const elapsed = clock.getElapsedTime();
      if (!reduce) {
        points.rotation.y = elapsed * 0.05;
        core.position.x = Math.cos(elapsed * 0.7) * 1.15;
        core.position.y = Math.sin(elapsed * 0.7) * 0.42;
      }
      renderer.render(scene, camera);
    }

    resize();
    draw();

    const onResize = () => {
      resize();
      if (!running) draw();
    };
    window.addEventListener('resize', onResize);

    const observer = new IntersectionObserver(([entry]) => {
      running = Boolean(entry?.isIntersecting) && !reduce;
    });
    observer.observe(canvas);

    function loop() {
      frame = window.requestAnimationFrame(loop);
      if (!running) return;
      draw();
    }
    if (!reduce) loop();

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      core.geometry.dispose();
      (core.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="system-field" aria-hidden="true" />;
}
