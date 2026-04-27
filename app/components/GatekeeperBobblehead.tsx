"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

type GatekeeperBobbleheadProps = {
  activeName: string;
  isStamping: boolean;
  seatMode: "self" | "gift";
};

type SceneState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  frame: number;
  resizeObserver: ResizeObserver;
  dispose: () => void;
};

const ACCENT = 0xff6b00;
const INK = 0x080808;
const COBALT = 0x1248ff;
const HEAD_REST_Y = 2.12;

export default function GatekeeperBobblehead({
  activeName,
  isStamping,
  seatMode
}: GatekeeperBobbleheadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeNameRef = useRef(activeName);
  const isStampingRef = useRef(isStamping);
  const seatModeRef = useRef(seatMode);

  useEffect(() => {
    activeNameRef.current = activeName;
  }, [activeName]);

  useEffect(() => {
    isStampingRef.current = isStamping;
  }, [isStamping]);

  useEffect(() => {
    seatModeRef.current = seatMode;
  }, [seatMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) {
      return;
    }

    const state = createScene({
      canvas,
      parent,
      activeNameRef,
      isStampingRef,
      seatModeRef
    });

    return () => {
      state.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="bobble-canvas"
      data-bobble-canvas
      aria-label="Interactive couture gatekeeper bobblehead"
      role="img"
    />
  );
}

function createScene({
  canvas,
  parent,
  activeNameRef,
  isStampingRef,
  seatModeRef
}: {
  canvas: HTMLCanvasElement;
  parent: HTMLElement;
  activeNameRef: MutableRefObject<string>;
  isStampingRef: MutableRefObject<boolean>;
  seatModeRef: MutableRefObject<"self" | "gift">;
}): SceneState {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    preserveDrawingBuffer: true
  });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
  camera.position.set(0, 1.15, 8.2);

  const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
  keyLight.position.set(-3.4, 4.8, 5.5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xff6b00, 2.2);
  rimLight.position.set(4.5, 2.7, 3.2);
  scene.add(rimLight);

  const blueKick = new THREE.DirectionalLight(COBALT, 1.3);
  blueKick.position.set(4, 1.2, -1.4);
  scene.add(blueKick);

  scene.add(new THREE.AmbientLight(0xffffff, 1.35));

  const root = new THREE.Group();
  root.position.set(1.25, -0.22, 0);
  scene.add(root);

  const background = buildGraphicBackdrop();
  root.add(background);

  const bobble = buildBobblehead();
  root.add(bobble.group);

  const ticket = buildTicketCard();
  root.add(ticket.group);

  const target = new THREE.Vector2(0.08, 0.02);
  const pointer = new THREE.Vector2(0.08, 0.02);

  function handlePointerMove(event: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    pointer.y = -(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  function handlePointerLeave() {
    pointer.set(0.08, 0.02);
  }

  canvas.addEventListener("pointermove", handlePointerMove, { passive: true });
  canvas.addEventListener("pointerleave", handlePointerLeave);

  const startTime = performance.now();

  function resize() {
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 640 ? 8.8 : 8.2;
    root.scale.setScalar(width < 640 ? 0.84 : 1);
    root.position.x = width < 640 ? 0.2 : 1.25;
    root.position.y = width < 640 ? -0.28 : -0.22;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);
  resize();

  function animate() {
    const elapsed = (performance.now() - startTime) / 1000;
    const typed = activeNameRef.current.trim().length > 0;
    const stamping = isStampingRef.current;
    const giftMode = seatModeRef.current === "gift";

    target.lerp(pointer, 0.09);

    const attention = typed ? 1 : 0;
    const stampPulse = stamping ? Math.sin(elapsed * 26) * 0.08 : 0;
    const bob = Math.sin(elapsed * 4.2) * (typed ? 0.085 : 0.045);

    bobble.head.rotation.y = THREE.MathUtils.lerp(
      bobble.head.rotation.y,
      target.x * 0.34 + attention * 0.18,
      0.08
    );
    bobble.head.rotation.x = THREE.MathUtils.lerp(
      bobble.head.rotation.x,
      -target.y * 0.18 + bob + stampPulse,
      0.08
    );
    bobble.head.rotation.z = THREE.MathUtils.lerp(
      bobble.head.rotation.z,
      target.x * -0.08 + Math.sin(elapsed * 3.4) * 0.025,
      0.08
    );
    bobble.head.position.y = HEAD_REST_Y + bob * 0.54 + stampPulse;

    bobble.spring.rotation.z = Math.sin(elapsed * 4.2) * 0.07;
    bobble.body.rotation.y = THREE.MathUtils.lerp(
      bobble.body.rotation.y,
      target.x * 0.05,
      0.06
    );
    bobble.base.rotation.y = elapsed * 0.03;

    ticket.group.rotation.y = THREE.MathUtils.lerp(
      ticket.group.rotation.y,
      typed ? -0.28 : -0.12,
      0.06
    );
    ticket.group.position.y = THREE.MathUtils.lerp(
      ticket.group.position.y,
      typed ? 0.84 + Math.sin(elapsed * 5) * 0.035 : 0.72,
      0.08
    );
    ticket.mark.visible = typed;
    ticket.ribbon.material.color.setHex(giftMode ? COBALT : ACCENT);

    background.rotation.z = Math.sin(elapsed * 0.7) * 0.012;
    root.rotation.y = Math.sin(elapsed * 0.55) * 0.035;

    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(animate);
  }

  let frame = window.requestAnimationFrame(animate);

  return {
    renderer,
    scene,
    camera,
    frame,
    resizeObserver,
    dispose() {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }
        const material = mesh.material;
        if (Array.isArray(material)) {
          material.forEach((item) => item.dispose());
        } else if (material) {
          material.dispose();
        }
      });
      renderer.dispose();
    }
  };
}

function buildBobblehead() {
  const group = new THREE.Group();
  const base = new THREE.Group();
  const body = new THREE.Group();
  const head = new THREE.Group();
  const spring = new THREE.Group();

  const black = new THREE.MeshStandardMaterial({
    color: INK,
    roughness: 0.55,
    metalness: 0.12
  });
  const orange = new THREE.MeshStandardMaterial({
    color: ACCENT,
    roughness: 0.48,
    metalness: 0.18
  });
  const skin = new THREE.MeshStandardMaterial({
    color: 0xe7c4ad,
    roughness: 0.62,
    metalness: 0.02
  });
  const hair = new THREE.MeshStandardMaterial({
    color: 0x9f7651,
    roughness: 0.7,
    metalness: 0.04
  });
  const lens = new THREE.MeshStandardMaterial({
    color: 0x030303,
    roughness: 0.25,
    metalness: 0.52
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.16,
    metalness: 0.86
  });

  base.position.y = -1.45;
  base.add(mesh(new THREE.CylinderGeometry(1.55, 1.72, 0.34, 64), black));
  const baseRing = mesh(new THREE.CylinderGeometry(1.72, 1.84, 0.08, 64), orange);
  baseRing.position.y = 0.19;
  base.add(baseRing);
  const plaque = mesh(new THREE.BoxGeometry(1.12, 0.34, 0.05), chrome);
  plaque.position.set(0, 0.28, 1.51);
  plaque.rotation.x = -0.18;
  base.add(plaque);
  group.add(base);

  const coat = mesh(new THREE.ConeGeometry(1.04, 1.74, 4, 1), black);
  coat.position.y = -0.42;
  coat.rotation.y = Math.PI / 4;
  coat.scale.x = 0.92;
  body.add(coat);

  const collarLeft = mesh(new THREE.BoxGeometry(0.18, 0.92, 0.04), orange);
  collarLeft.position.set(-0.24, 0.16, 0.56);
  collarLeft.rotation.z = -0.34;
  body.add(collarLeft);
  const collarRight = collarLeft.clone();
  collarRight.position.x = 0.24;
  collarRight.rotation.z = 0.34;
  body.add(collarRight);

  const shoulders = mesh(new THREE.CapsuleGeometry(0.22, 1.45, 5, 16), black);
  shoulders.position.y = 0.32;
  shoulders.rotation.z = Math.PI / 2;
  shoulders.scale.set(1.25, 1, 0.82);
  body.add(shoulders);
  group.add(body);

  spring.position.y = 0.82;
  spring.add(buildSpringMesh());
  group.add(spring);

  head.position.y = HEAD_REST_Y;
  const face = mesh(new THREE.SphereGeometry(0.72, 48, 32), skin);
  face.scale.set(0.88, 1.1, 0.78);
  head.add(face);

  const hairCap = mesh(new THREE.SphereGeometry(0.78, 48, 32), hair);
  hairCap.position.set(0, 0.15, -0.06);
  hairCap.scale.set(1.06, 1.02, 0.86);
  head.add(hairCap);

  const faceMask = mesh(new THREE.SphereGeometry(0.68, 48, 32), skin);
  faceMask.position.set(0, -0.06, 0.26);
  faceMask.scale.set(0.82, 0.86, 0.3);
  head.add(faceMask);

  const bang = mesh(new THREE.BoxGeometry(1.15, 0.22, 0.1), hair);
  bang.position.set(0, 0.58, 0.52);
  bang.rotation.x = -0.14;
  head.add(bang);

  const bobLeft = mesh(new THREE.BoxGeometry(0.22, 0.98, 0.24), hair);
  bobLeft.position.set(-0.68, 0.02, 0.14);
  bobLeft.rotation.z = -0.07;
  head.add(bobLeft);
  const bobRight = bobLeft.clone();
  bobRight.position.x = 0.68;
  bobRight.rotation.z = 0.07;
  head.add(bobRight);

  const leftLens = mesh(new THREE.SphereGeometry(0.22, 32, 16), lens);
  leftLens.position.set(-0.24, 0.12, 0.6);
  leftLens.scale.set(1.28, 0.72, 0.12);
  head.add(leftLens);
  const rightLens = leftLens.clone();
  rightLens.position.x = 0.24;
  head.add(rightLens);

  const bridge = mesh(new THREE.BoxGeometry(0.18, 0.045, 0.035), lens);
  bridge.position.set(0, 0.12, 0.66);
  head.add(bridge);

  const mouth = mesh(new THREE.BoxGeometry(0.26, 0.025, 0.025), orange);
  mouth.position.set(0, -0.34, 0.62);
  mouth.rotation.z = -0.04;
  head.add(mouth);

  const pearl = mesh(new THREE.TorusGeometry(0.42, 0.035, 8, 32), chrome);
  pearl.position.set(0, -0.78, 0.14);
  pearl.rotation.x = Math.PI / 2;
  head.add(pearl);

  group.add(head);

  return { group, base, body, head, spring };
}

function buildSpringMesh() {
  const points: THREE.Vector3[] = [];
  const turns = 5.4;
  const height = 0.78;
  const radius = 0.18;
  const steps = 132;
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps;
    const angle = t * Math.PI * 2 * turns;
    points.push(
      new THREE.Vector3(Math.cos(angle) * radius, t * height - height / 2, Math.sin(angle) * radius)
    );
  }

  const curve = new THREE.CatmullRomCurve3(points);
  const geometry = new THREE.TubeGeometry(curve, 132, 0.026, 8, false);
  return mesh(
    geometry,
    new THREE.MeshStandardMaterial({
      color: 0xf2f2f2,
      roughness: 0.2,
      metalness: 0.8
    })
  );
}

function buildGraphicBackdrop() {
  const group = new THREE.Group();
  group.position.set(-0.12, 0.16, -1.38);

  const orange = new THREE.MeshBasicMaterial({
    color: ACCENT,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide
  });
  const blue = new THREE.MeshBasicMaterial({
    color: COBALT,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });
  const paper = new THREE.MeshBasicMaterial({
    color: 0xf5f2ed,
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide
  });

  const slash = mesh(new THREE.PlaneGeometry(5.8, 0.72), orange);
  slash.position.set(0.25, 0.78, 0);
  slash.rotation.z = -0.28;
  group.add(slash);

  const blueSlash = mesh(new THREE.PlaneGeometry(3.4, 0.28), blue);
  blueSlash.position.set(-0.3, -0.12, 0.04);
  blueSlash.rotation.z = 0.22;
  group.add(blueSlash);

  for (let index = 0; index < 9; index += 1) {
    const strip = mesh(
      new THREE.PlaneGeometry(0.36 + (index % 3) * 0.18, 1.05 + (index % 4) * 0.22),
      paper
    );
    strip.position.set(-2.8 + index * 0.7, -0.18 + Math.sin(index) * 0.18, -0.02 - index * 0.004);
    strip.rotation.z = -0.45 + index * 0.12;
    group.add(strip);
  }

  return group;
}

function buildTicketCard() {
  const group = new THREE.Group();
  group.position.set(-1.75, 0.72, 0.62);
  group.rotation.y = -0.12;
  group.rotation.z = -0.08;

  const paper = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.58,
    metalness: 0.02
  });
  const orange = new THREE.MeshStandardMaterial({
    color: ACCENT,
    roughness: 0.45,
    metalness: 0.1
  });
  const black = new THREE.MeshStandardMaterial({
    color: INK,
    roughness: 0.5,
    metalness: 0.05
  });

  const card = mesh(new THREE.BoxGeometry(0.82, 1.12, 0.035), paper);
  group.add(card);

  const ribbon = mesh(new THREE.BoxGeometry(0.13, 1.12, 0.04), orange);
  ribbon.position.set(-0.345, 0, 0.026);
  group.add(ribbon);

  const lineTop = mesh(new THREE.BoxGeometry(0.48, 0.025, 0.04), black);
  lineTop.position.set(0.1, 0.25, 0.036);
  group.add(lineTop);

  const lineBottom = lineTop.clone();
  lineBottom.position.y = -0.1;
  group.add(lineBottom);

  const mark = mesh(new THREE.BoxGeometry(0.5, 0.08, 0.05), orange);
  mark.position.set(0.1, -0.34, 0.052);
  mark.rotation.z = -0.12;
  group.add(mark);

  return { group, ribbon, mark };
}

function mesh<T extends THREE.BufferGeometry, M extends THREE.Material>(
  geometry: T,
  material: M
) {
  const result = new THREE.Mesh<T, M>(geometry, material);
  result.castShadow = false;
  result.receiveShadow = false;
  return result;
}
