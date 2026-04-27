"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type GatekeeperBobbleheadProps = {
  activeName: string;
  isStamping: boolean;
};

type Bobble = {
  group: THREE.Group;
  figure: THREE.Object3D;
};

type SceneState = {
  dispose: () => void;
};

const ACCENT = 0xff6b00;
const COBALT = 0x1248ff;
const MODEL_URL = "/anna.glb";

export default function GatekeeperBobblehead({
  activeName,
  isStamping
}: GatekeeperBobbleheadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeNameRef = useRef(activeName);
  const isStampingRef = useRef(isStamping);
  const [hasScene, setHasScene] = useState(true);

  useEffect(() => {
    activeNameRef.current = activeName;
  }, [activeName]);

  useEffect(() => {
    isStampingRef.current = isStamping;
  }, [isStamping]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) {
      return;
    }

    let state: SceneState | null = null;

    try {
      state = createScene({
        canvas,
        parent,
        activeNameRef,
        isStampingRef
      });
      setHasScene(true);
    } catch (error) {
      console.error("Failed to start gatekeeper bobblehead scene:", error);
      setHasScene(false);
    }

    return () => {
      state?.dispose();
    };
  }, []);

  return (
    <div
      className={`bobble-stage${hasScene ? "" : " bobble-stage-fallback"}`}
      aria-label="Interactive couture gatekeeper bobblehead"
      role="img"
    >
      <canvas
        ref={canvasRef}
        className="bobble-canvas"
        data-bobble-canvas
        aria-hidden="true"
      />
      {!hasScene && (
        <div className="bobble-fallback" aria-hidden="true">
          <span>SUPERFINE</span>
        </div>
      )}
    </div>
  );
}

function createScene({
  canvas,
  parent,
  activeNameRef,
  isStampingRef
}: {
  canvas: HTMLCanvasElement;
  parent: HTMLElement;
  activeNameRef: MutableRefObject<string>;
  isStampingRef: MutableRefObject<boolean>;
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
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 1.05, 8.2);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
  keyLight.position.set(-3.4, 4.8, 5.5);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(ACCENT, 1.2);
  rimLight.position.set(4.5, 2.7, 3.2);
  scene.add(rimLight);

  const blueKick = new THREE.DirectionalLight(COBALT, 0.6);
  blueKick.position.set(4, 1.2, -1.4);
  scene.add(blueKick);

  scene.add(new THREE.AmbientLight(0xffffff, 0.85));

  const root = new THREE.Group();
  root.position.set(1.05, -0.18, 0);
  scene.add(root);

  const bobbleGroup = new THREE.Group();
  root.add(bobbleGroup);

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
  let bobble: Bobble | null = null;
  let cancelled = false;

  const loader = new GLTFLoader();
  loader.load(
    MODEL_URL,
    (gltf) => {
      if (cancelled) {
        gltf.scene.traverse(disposeNode);
        return;
      }
      try {
        bobble = buildBobbleFromGLTF(gltf.scene);
        bobbleGroup.add(bobble.group);
      } catch (error) {
        console.error("Failed to prepare gatekeeper GLB:", error);
        gltf.scene.traverse(disposeNode);
      }
    },
    undefined,
    (error) => {
      // Surface to console so dev can see; non-fatal.
      console.error("Failed to load gatekeeper GLB:", error);
    }
  );

  function resize() {
    const width = Math.max(1, parent.clientWidth);
    const height = Math.max(1, parent.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 640 ? 11.5 : 11;
    root.scale.setScalar(width < 640 ? 0.84 : 1);
    root.position.x = width < 640 ? 0.1 : 0.4;
    root.position.y = width < 640 ? -0.3 : -0.2;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);
  resize();

  function animate() {
    const elapsed = (performance.now() - startTime) / 1000;
    const typed = activeNameRef.current.trim().length > 0;
    const stamping = isStampingRef.current;

    target.lerp(pointer, 0.06);

    if (bobble) {
      const figure = bobble.figure;
      const attention = typed ? 1 : 0;
      const stampPulse = stamping ? Math.sin(elapsed * 18) * 0.025 : 0;
      const idleNod = Math.sin(elapsed * 0.9) * 0.008;
      const idleTilt = Math.sin(elapsed * 0.6) * 0.006;

      figure.rotation.y = THREE.MathUtils.lerp(
        figure.rotation.y,
        target.x * 0.22 + attention * 0.05,
        0.05
      );
      figure.rotation.x = THREE.MathUtils.lerp(
        figure.rotation.x,
        -target.y * 0.09 + idleNod + stampPulse,
        0.05
      );
      figure.rotation.z = THREE.MathUtils.lerp(
        figure.rotation.z,
        target.x * -0.04 + idleTilt,
        0.05
      );
    }

    root.rotation.y = Math.sin(elapsed * 0.55) * 0.025;

    renderer.render(scene, camera);
    frame = window.requestAnimationFrame(animate);
  }

  let frame = window.requestAnimationFrame(animate);

  return {
    dispose() {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      scene.traverse(disposeNode);
      renderer.dispose();
    }
  };
}

function buildBobbleFromGLTF(gltfScene: THREE.Object3D): Bobble {
  const group = new THREE.Group();
  const figure = gltfScene.getObjectByName("Bobble");

  if (!figure) {
    throw new Error("anna.glb missing Bobble node");
  }

  group.add(figure);

  const FIT_SCALE = 3.1;
  group.scale.setScalar(FIT_SCALE);
  group.position.y = -0.85;

  group.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.isMesh && mesh.material) {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if ("envMapIntensity" in mat) {
        mat.envMapIntensity = 0.9;
      }
    }
  });

  return { group, figure };
}

function disposeNode(object: THREE.Object3D) {
  const m = object as THREE.Mesh;
  if (m.geometry) m.geometry.dispose();
  const material = m.material;
  if (Array.isArray(material)) {
    material.forEach((item) => item.dispose());
  } else if (material) {
    material.dispose();
  }
}
