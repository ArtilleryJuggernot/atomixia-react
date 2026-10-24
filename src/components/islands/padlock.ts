import * as THREE from 'three';

export const LOCK_AMBER = 0xe8b86d;

type Disposable = { dispose: () => void };

export type Padlock = {
  group: THREE.Group;
  body: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  ring: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
  pulse: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;
};

/** Closed padlock, sized like the other stellar bodies. */
export function createPadlock(track: <T extends Disposable>(item: T) => T): Padlock {
  const group = new THREE.Group();

  const bodyMaterial = track(
    new THREE.MeshStandardMaterial({
      color: 0x1b212b,
      metalness: 0.9,
      roughness: 0.32,
      emissive: 0x5a4324,
      emissiveIntensity: 0.22,
    }),
  );
  const shackleMaterial = track(
    new THREE.MeshStandardMaterial({
      color: 0xe8edf3,
      metalness: 0.96,
      roughness: 0.16,
      emissive: 0xb08958,
      emissiveIntensity: 0.16,
    }),
  );
  const holeMaterial = track(new THREE.MeshBasicMaterial({ color: LOCK_AMBER, transparent: true, opacity: 0.95 }));

  const body = new THREE.Mesh(track(new THREE.BoxGeometry(0.58, 0.44, 0.26)), bodyMaterial);
  body.position.y = -0.1;
  group.add(body);

  const outline = new THREE.LineSegments(
    track(new THREE.EdgesGeometry(body.geometry)),
    track(new THREE.LineBasicMaterial({ color: LOCK_AMBER, transparent: true, opacity: 0.7 })),
  );
  outline.position.copy(body.position);
  group.add(outline);

  const shackle = new THREE.Mesh(track(new THREE.TorusGeometry(0.2, 0.046, 16, 48, Math.PI)), shackleMaterial);
  shackle.position.y = 0.12;
  group.add(shackle);

  const legGeometry = track(new THREE.CylinderGeometry(0.046, 0.046, 0.16, 14));
  const leftLeg = new THREE.Mesh(legGeometry, shackleMaterial);
  leftLeg.position.set(-0.2, 0.06, 0);
  const rightLeg = new THREE.Mesh(legGeometry, shackleMaterial);
  rightLeg.position.set(0.2, 0.06, 0);
  group.add(leftLeg, rightLeg);

  const pulse = new THREE.Mesh(track(new THREE.CircleGeometry(0.062, 24)), holeMaterial);
  pulse.position.set(0, -0.04, 0.132);
  const stem = new THREE.Mesh(track(new THREE.PlaneGeometry(0.034, 0.1)), holeMaterial);
  stem.position.set(0, -0.14, 0.132);
  group.add(pulse, stem);

  const ring = new THREE.Mesh(
    track(new THREE.TorusGeometry(0.74, 0.008, 8, 96)),
    track(new THREE.MeshBasicMaterial({ color: LOCK_AMBER, transparent: true, opacity: 0.5 })),
  );
  ring.rotation.x = Math.PI / 2.5;
  group.add(ring);

  return { group, body, ring, pulse };
}
