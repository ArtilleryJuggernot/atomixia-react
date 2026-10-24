import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { createPadlock } from './padlock';

export type PlanetId = 'automation' | 'software' | 'systems' | 'cyber';

export type Planet = {
  id: PlanetId;
  index: string;
  label: string;
  summary: string;
  href: string;
  tone: 'cyan' | 'gold' | 'silver' | 'amber';
};

type Props = {
  planets: Planet[];
  caption: string;
};

const MAX_PIXEL_RATIO = 1.5;

/* Positions in percentage of the stage, matched by the CSS of .planet-tag. */
const anchors: Record<PlanetId, { x: number; y: number }> = {
  automation: { x: 33, y: 34 },
  software: { x: 67, y: 32 },
  systems: { x: 32, y: 70 },
  cyber: { x: 68, y: 72 },
};

const GOLD = 0xd9c18a;
const GOLD_LIGHT = 0xf2d9a0;
const CYAN = 0x00ddf5;
const BLUE = 0x2583ff;
const SILVER = 0xd5dde6;
const AMBER = 0xe8b86d;

function starSprite() {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return null;
  const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255,255,255,1)');
  gradient.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  gradient.addColorStop(1, 'rgba(255,255,255,0)');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function circlePoints(radius: number, segments: number, squash = 1) {
  const positions = new Float32Array(segments * 3);
  for (let index = 0; index < segments; index += 1) {
    const angle = (index / segments) * Math.PI * 2;
    positions[index * 3] = Math.cos(angle) * radius;
    positions[index * 3 + 1] = Math.sin(angle) * radius * squash;
    positions[index * 3 + 2] = 0;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}

type PlanetRig = {
  id: PlanetId;
  group: THREE.Group;
  body: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  spinners: { object: THREE.Object3D; speed: number; axis: 'x' | 'y' | 'z' }[];
  link: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>;
  pulse?: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  focus: number;
  baseEmissive: number;
  delay: number;
};

export default function StellarScene({ planets, caption }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef<PlanetId | null>(null);
  const [active, setActive] = useState<PlanetId | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 899px)').matches;
    const attributes = { alpha: true, antialias: true, powerPreference: 'high-performance' as const };
    const gl = canvas.getContext('webgl2', attributes) || canvas.getContext('webgl', attributes);
    if (!gl) {
      stage.classList.add('no-gl', 'is-live');
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    } catch {
      stage.classList.add('no-gl', 'is-live');
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 60);
    camera.position.set(0, 0, 11);
    camera.lookAt(0, 0, 0);

    const world = new THREE.Group();
    scene.add(world);

    scene.add(new THREE.AmbientLight(0x2a3140, 1.6));
    const keyLight = new THREE.DirectionalLight(GOLD_LIGHT, 2.2);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(BLUE, 1.1);
    rimLight.position.set(-5, -3, 4);
    scene.add(rimLight);
    const coreLight = new THREE.PointLight(CYAN, 14, 9, 1.6);
    coreLight.position.set(0, 0, 1.2);
    scene.add(coreLight);

    const disposables: { dispose: () => void }[] = [];
    const track = <T extends { dispose: () => void }>(item: T) => {
      disposables.push(item);
      return item;
    };

    /* Stars */
    const starCount = mobile ? 420 : 1300;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const palette = [new THREE.Color(0xf4f5f8), new THREE.Color(GOLD_LIGHT), new THREE.Color(CYAN), new THREE.Color(0xa7b0bf)];
    for (let index = 0; index < starCount; index += 1) {
      starPositions[index * 3] = (Math.random() - 0.5) * 26;
      starPositions[index * 3 + 1] = (Math.random() - 0.5) * 18;
      starPositions[index * 3 + 2] = -2 - Math.random() * 9;
      const color = palette[Math.random() < 0.75 ? 0 : 1 + Math.floor(Math.random() * 3)];
      starColors[index * 3] = color.r;
      starColors[index * 3 + 1] = color.g;
      starColors[index * 3 + 2] = color.b;
    }
    const starGeometry = track(new THREE.BufferGeometry());
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const sprite = starSprite();
    if (sprite) track(sprite);
    const starMaterial = track(
      new THREE.PointsMaterial({
        size: mobile ? 0.09 : 0.075,
        map: sprite ?? undefined,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      }),
    );
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    /* Central corona: gold rings, tilted */
    const corona = new THREE.Group();
    world.add(corona);
    const coronaMaterial = track(new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
    const coronaMaterialSoft = track(new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
    const ring1 = new THREE.LineLoop(track(circlePoints(1.55, 160)), coronaMaterial);
    ring1.rotation.x = Math.PI / 2.4;
    const ring2 = new THREE.LineLoop(track(circlePoints(1.9, 160)), coronaMaterialSoft);
    ring2.rotation.x = Math.PI / 2.4;
    ring2.rotation.y = 0.5;
    corona.add(ring1, ring2);

    /* Great orbits that carry the planets */
    const orbitMaterial = track(new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }));
    const orbitA = new THREE.LineLoop(track(circlePoints(4.75, 240, 0.62)), orbitMaterial);
    orbitA.rotation.z = 0.78;
    const orbitB = new THREE.LineLoop(track(circlePoints(4.75, 240, 0.62)), orbitMaterial);
    orbitB.rotation.z = -0.78;
    world.add(orbitA, orbitB);

    /* Planet positions: percentage anchors -> world coordinates on the z = 0 plane */
    const worldAt = (x: number, y: number) => {
      const ndc = new THREE.Vector3((x / 50) - 1, 1 - (y / 50), 0.5).unproject(camera);
      const direction = ndc.sub(camera.position).normalize();
      const distance = -camera.position.z / direction.z;
      return camera.position.clone().add(direction.multiplyScalar(distance));
    };

    const rigs: PlanetRig[] = [];
    const linkMaterialFor = (color: number) =>
      track(new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 }));

    const buildPlanet = (id: PlanetId, delay: number) => {
      const group = new THREE.Group();
      const spinners: PlanetRig['spinners'] = [];
      let body: PlanetRig['body'];
      let baseEmissive = 0.3;
      let pulse: PlanetRig['pulse'];
      let linkColor = GOLD;

      if (id === 'automation') {
        linkColor = CYAN;
        baseEmissive = 0.4;
        body = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.58, 48, 48)),
          track(
            new THREE.MeshPhysicalMaterial({
              color: 0x08323c,
              emissive: CYAN,
              emissiveIntensity: 0.35,
              roughness: 0.18,
              metalness: 0.25,
              transparent: true,
              opacity: 0.78,
            }),
          ),
        );
        group.add(body);
        const core = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.26, 32, 32)),
          track(new THREE.MeshBasicMaterial({ color: 0xe7fbff })),
        );
        group.add(core);
        const halo = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.74, 32, 32)),
          track(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.08, side: THREE.BackSide })),
        );
        group.add(halo);
        const ringMaterial = track(new THREE.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: 0.55 }));
        [0.86, 1.02, 1.16].forEach((radius, index) => {
          const ring = new THREE.Mesh(track(new THREE.TorusGeometry(radius, 0.008, 8, 120)), ringMaterial);
          ring.rotation.x = Math.PI / 2 + 0.35 * (index - 1);
          ring.rotation.y = 0.4 * index;
          group.add(ring);
          spinners.push({ object: ring, speed: 0.25 + index * 0.08, axis: 'z' });
        });
        const satelliteMaterial = track(new THREE.MeshBasicMaterial({ color: 0xf4f5f8 }));
        for (let index = 0; index < 4; index += 1) {
          const pivot = new THREE.Group();
          pivot.rotation.x = Math.PI / 2 + 0.35 * ((index % 3) - 1);
          pivot.rotation.z = (index / 4) * Math.PI * 2;
          const satellite = new THREE.Mesh(track(new THREE.SphereGeometry(0.035, 10, 10)), satelliteMaterial);
          satellite.position.set(0.86 + 0.15 * (index % 3), 0, 0);
          pivot.add(satellite);
          group.add(pivot);
          spinners.push({ object: pivot, speed: 0.6 + index * 0.17, axis: 'z' });
        }
      } else if (id === 'software') {
        linkColor = GOLD;
        baseEmissive = 0.22;
        body = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.56, 48, 48)),
          track(new THREE.MeshStandardMaterial({ color: 0x8e7045, emissive: 0x3c2e20, emissiveIntensity: baseEmissive, roughness: 0.28, metalness: 0.95 })),
        );
        group.add(body);
        const edges = new THREE.LineSegments(
          track(new THREE.EdgesGeometry(track(new THREE.IcosahedronGeometry(0.82, 1)))),
          track(new THREE.LineBasicMaterial({ color: GOLD_LIGHT, transparent: true, opacity: 0.55 })),
        );
        group.add(edges);
        spinners.push({ object: edges, speed: 0.12, axis: 'y' });
        const moduleMaterial = track(new THREE.MeshStandardMaterial({ color: GOLD_LIGHT, metalness: 0.9, roughness: 0.3, emissive: 0x8e7045, emissiveIntensity: 0.4 }));
        const modules = new THREE.Group();
        for (let index = 0; index < 3; index += 1) {
          const module = new THREE.Mesh(track(new THREE.BoxGeometry(0.11, 0.11, 0.11)), moduleMaterial);
          const angle = (index / 3) * Math.PI * 2;
          module.position.set(Math.cos(angle) * 1.05, Math.sin(angle) * 0.32, Math.sin(angle) * 1.05);
          module.rotation.set(angle, angle * 0.6, 0);
          modules.add(module);
        }
        group.add(modules);
        spinners.push({ object: modules, speed: 0.3, axis: 'y' });
      } else if (id === 'systems') {
        linkColor = SILVER;
        baseEmissive = 0.18;
        body = new THREE.Mesh(
          track(new THREE.SphereGeometry(0.46, 48, 48)),
          track(new THREE.MeshStandardMaterial({ color: 0x3a4556, emissive: 0x101725, emissiveIntensity: baseEmissive, roughness: 0.45, metalness: 0.75 })),
        );
        group.add(body);
        const shell = new THREE.Group();
        const nodeMaterial = track(new THREE.MeshBasicMaterial({ color: CYAN }));
        const nodeGeometry = track(new THREE.SphereGeometry(0.04, 10, 10));
        const nodes: THREE.Vector3[] = [];
        for (let index = 0; index < 9; index += 1) {
          const phi = Math.acos(1 - (2 * (index + 0.5)) / 9);
          const theta = Math.PI * (1 + Math.sqrt(5)) * index;
          const position = new THREE.Vector3().setFromSphericalCoords(0.9, phi, theta);
          nodes.push(position);
          const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
          node.position.copy(position);
          shell.add(node);
        }
        const linkPositions: number[] = [];
        for (let index = 0; index < nodes.length; index += 1) {
          const next = nodes[(index + 1) % nodes.length];
          const across = nodes[(index + 4) % nodes.length];
          linkPositions.push(...nodes[index].toArray(), ...next.toArray());
          if (index % 2 === 0) linkPositions.push(...nodes[index].toArray(), ...across.toArray());
        }
        const linkGeometry = track(new THREE.BufferGeometry());
        linkGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linkPositions, 3));
        shell.add(new THREE.LineSegments(linkGeometry, track(new THREE.LineBasicMaterial({ color: SILVER, transparent: true, opacity: 0.45 }))));
        group.add(shell);
        spinners.push({ object: shell, speed: 0.16, axis: 'y' });
        spinners.push({ object: shell, speed: 0.05, axis: 'x' });
      } else {
        linkColor = AMBER;
        baseEmissive = 0.22;
        const lock = createPadlock(track);
        body = lock.body;
        pulse = lock.pulse;
        group.add(lock.group);
        spinners.push({ object: lock.group, speed: 0.1, axis: 'y' });
        spinners.push({ object: lock.ring, speed: 0.16, axis: 'z' });
      }

      if (id !== 'cyber') spinners.push({ object: body, speed: id === 'automation' ? 0.2 : 0.07, axis: 'y' });

      const anchor = anchors[id];
      const position = worldAt(anchor.x, anchor.y);
      group.position.copy(position);
      group.scale.setScalar(0.001);
      world.add(group);

      const linkGeometry = track(new THREE.BufferGeometry());
      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(position.x * 0.45, position.y * 0.75, 0.8),
        position.clone(),
      );
      linkGeometry.setFromPoints(curve.getPoints(60));
      const link = new THREE.Line(linkGeometry, linkMaterialFor(linkColor));
      world.add(link);

      rigs.push({ id, group, body, spinners, link, pulse, focus: 0, baseEmissive, delay });
    };

    planets.forEach((planet, index) => buildPlanet(planet.id, 1.0 + index * 0.18));

    /* State */
    const start = performance.now();
    let frame = 0;
    let running = !reduce;
    let visible = true;
    let live = false;
    const pointerTarget = new THREE.Vector2(0, 0);
    const pointer = new THREE.Vector2(0, 0);

    const ease = (value: number) => 1 - Math.pow(1 - Math.min(Math.max(value, 0), 1), 3);
    const back = (value: number) => {
      const clamped = Math.min(Math.max(value, 0), 1);
      const c1 = 1.4;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(clamped - 1, 3) + c1 * Math.pow(clamped - 1, 2);
    };

    function resize() {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rigs.forEach((rig) => {
        const anchor = anchors[rig.id];
        const position = worldAt(anchor.x, anchor.y);
        rig.group.position.copy(position);
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(position.x * 0.45, position.y * 0.75, 0.8),
          position.clone(),
        );
        rig.link.geometry.setFromPoints(curve.getPoints(60));
      });
    }

    function draw(now: number) {
      const t = reduce ? 10 : (now - start) / 1000;

      starMaterial.opacity = 0.9 * ease(t / 0.9);
      coronaMaterial.opacity = 0.85 * ease((t - 0.35) / 0.8);
      coronaMaterialSoft.opacity = 0.35 * ease((t - 0.5) / 0.8);
      orbitMaterial.opacity = 0.32 * ease((t - 0.7) / 1.1);

      if (!live && t > 0.55) {
        live = true;
        stage.classList.add('is-live');
      }

      if (!reduce) {
        stars.rotation.z = t * 0.004;
        corona.rotation.z = t * 0.08;
        ring2.rotation.z = -t * 0.05;
        pointer.lerp(pointerTarget, 0.05);
        world.rotation.x = pointer.y * 0.07;
        world.rotation.y = pointer.x * 0.1;
        world.position.y = Math.sin(t * 0.5) * 0.04;
      }

      const activeId = activeRef.current;
      rigs.forEach((rig) => {
        const appear = back((t - rig.delay) / 0.9);
        const target = activeId === rig.id ? 1 : 0;
        rig.focus += (target - rig.focus) * 0.08;
        const dim = activeId && activeId !== rig.id ? 0.88 : 1;
        rig.group.scale.setScalar(Math.max(appear, 0.001) * (1 + rig.focus * 0.14) * dim);
        rig.body.material.emissiveIntensity = rig.baseEmissive + rig.focus * 0.7;
        rig.link.material.opacity = (0.22 + rig.focus * 0.65) * ease((t - rig.delay + 0.3) / 0.8);
        if (!reduce) {
          rig.spinners.forEach((spinner) => {
            spinner.object.rotation[spinner.axis] += spinner.speed * 0.016;
          });
          rig.group.position.z = Math.sin(t * 0.6 + rig.delay * 4) * 0.08;
          if (rig.pulse) {
            rig.pulse.material.opacity = 0.45 + 0.55 * Math.abs(Math.sin(t * 2.2));
          }
        }
      });

      renderer.render(scene, camera);
    }

    resize();
    draw(performance.now());

    const onResize = () => {
      resize();
      if (!running) draw(performance.now());
    };
    window.addEventListener('resize', onResize);

    const onPointer = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      pointerTarget.set(((event.clientX - rect.left) / rect.width) * 2 - 1, -(((event.clientY - rect.top) / rect.height) * 2 - 1));
    };
    const onLeave = () => pointerTarget.set(0, 0);
    if (!reduce) {
      stage.addEventListener('pointermove', onPointer);
      stage.addEventListener('pointerleave', onLeave);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      running = visible && !reduce;
    });
    observer.observe(stage);

    function loop(now: number) {
      frame = window.requestAnimationFrame(loop);
      if (!running) return;
      draw(now);
    }
    if (!reduce) frame = window.requestAnimationFrame(loop);
    else stage.classList.add('is-live');

    return () => {
      running = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      stage.removeEventListener('pointermove', onPointer);
      stage.removeEventListener('pointerleave', onLeave);
      observer.disconnect();
      disposables.forEach((item) => item.dispose());
      renderer.dispose();
    };
  }, [planets]);

  const tag = (planet: Planet, key: string) => (
    <a
      key={key}
      className={`planet-tag${active === planet.id ? ' is-active' : ''}`}
      href={planet.href}
      data-planet={planet.id}
      data-tone={planet.tone}
      data-cursor="Explorer"
      onPointerEnter={() => setActive(planet.id)}
      onPointerLeave={() => setActive(null)}
      onFocus={() => setActive(planet.id)}
      onBlur={() => setActive(null)}
    >
      <span className="meta">{planet.index}</span>
      <strong>{planet.label}</strong>
      <span>{planet.summary}</span>
      <em>Explorer →</em>
    </a>
  );

  return (
    <div>
      <div className="stellar" ref={stageRef}>
        <canvas ref={canvasRef} className="stellar-canvas" aria-hidden="true" />
        <p className="stellar-sim meta">Scène interactive · aucune donnée réelle</p>
        <div className="stellar-core" aria-hidden="true">
          <span className="stellar-corona" />
          <img src="/brand/mark.webp" alt="" width="200" height="200" decoding="async" />
        </div>
        {planets.map((planet) => tag(planet, `stage-${planet.id}`))}
        <p className="stellar-caption meta">{caption}</p>
      </div>
      <div className="stellar-list">{planets.map((planet) => tag(planet, `list-${planet.id}`))}</div>
    </div>
  );
}
