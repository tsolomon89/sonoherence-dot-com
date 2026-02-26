import { useEffect, useMemo, useRef } from 'react';
import { RoundedBox, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { DeviceTier } from '../../lib/device';
import * as THREE from 'three';
import {
  applyDefaultMaterialLook,
  applyPbrManifest,
  loadMaterialManifest,
} from './pbr-materials';

interface BedModelProps {
  scrollData: { current: { offset: number } };
  modelUrl: string;
  modelAvailable: boolean;
  tier: DeviceTier;
  reducedMotion: boolean;
}

const clamp01 = (value: number): number => Math.min(1, Math.max(0, value));

const segmentProgress = (value: number, start: number, end: number): number => {
  if (end <= start) {
    return 0;
  }

  return clamp01((value - start) / (end - start));
};

function ProceduralBed({
  scrollData,
  tier,
  reducedMotion,
}: Pick<BedModelProps, 'scrollData' | 'tier' | 'reducedMotion'>) {
  const groupRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Group>(null);
  const waterRef = useRef<THREE.Mesh>(null);
  const transducerRef = useRef<THREE.Group>(null);
  const engineRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!groupRef.current || !waterRef.current || !transducerRef.current || !engineRef.current) {
      return;
    }

    const elapsed = state.clock.getElapsedTime();
    const offset = scrollData.current.offset;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.PI * 0.15 + offset * Math.PI * 0.9,
      0.08,
    );
    groupRef.current.position.y = reducedMotion ? -0.6 : Math.sin(elapsed * 0.4) * 0.02 - 0.62;

    const revealProgress = segmentProgress(offset, 0.12, 0.32);
    const reassembleProgress = segmentProgress(offset, 0.86, 1);
    const activeLift = revealProgress * (1 - reassembleProgress);

    waterRef.current.position.y = THREE.MathUtils.lerp(
      waterRef.current.position.y,
      0.16 + activeLift * 1.1,
      0.09,
    );
    waterRef.current.scale.setScalar(1 + (reducedMotion ? 0 : Math.sin(elapsed * 0.7) * 0.006));

    transducerRef.current.rotation.y = reducedMotion ? 0 : elapsed * 0.15;
    transducerRef.current.scale.setScalar(
      1 +
        segmentProgress(offset, 0.34, 0.55) * 0.08 +
        segmentProgress(offset, 0.55, 0.75) * (reducedMotion ? 0.02 : Math.sin(elapsed * 3.8) * 0.05),
    );
    engineRef.current.scale.setScalar(
      1 +
        segmentProgress(offset, 0.55, 0.78) * (reducedMotion ? 0.02 : Math.sin(elapsed * 2.4) * 0.05),
    );
  });

  return (
    <group ref={groupRef}>
      <group ref={shellRef} position={[0, -0.08, 0]}>
        <RoundedBox args={[2.45, 0.22, 4.2]} radius={0.06}>
          <meshStandardMaterial color="#4d5a52" roughness={0.58} metalness={0.12} />
        </RoundedBox>
      </group>

      <mesh ref={waterRef} position={[0, 0.16, 0]}>
        <boxGeometry args={[2.2, 0.32, 3.9]} />
        <meshPhysicalMaterial
          color="#79b8b1"
          roughness={0.15}
          transmission={0.8}
          thickness={0.5}
          ior={1.28}
          transparent
          opacity={0.72}
        />
      </mesh>

      <group ref={transducerRef} position={[0, -0.02, 0]}>
        {new Array(10).fill(0).map((_, index) => {
          const row = Math.floor(index / 5);
          const column = index % 5;
          return (
            <mesh key={index} position={[-0.8 + column * 0.4, 0.08, -1 + row * 2]}>
              <cylinderGeometry args={[0.11, 0.11, 0.05, 24]} />
              <meshStandardMaterial
                color="#83d7c9"
                emissive="#2f8f84"
                emissiveIntensity={tier === 'low' ? 0.7 : 1}
                metalness={0.25}
                roughness={0.35}
              />
            </mesh>
          );
        })}
      </group>

      <mesh ref={engineRef} position={[0.9, 0.22, -1.45]}>
        <boxGeometry args={[0.34, 0.14, 0.58]} />
        <meshStandardMaterial color="#8ca093" emissive="#3f5d56" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function GlbBed({
  scrollData,
  modelUrl,
  tier,
  reducedMotion,
}: Pick<BedModelProps, 'scrollData' | 'modelUrl' | 'tier' | 'reducedMotion'>) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelUrl);
  const modelRoot = useMemo(() => scene.clone(true), [scene]);
  const partsRef = useRef<{
    shell: THREE.Object3D | null;
    water: THREE.Object3D | null;
    transducers: THREE.Object3D | null;
    engine: THREE.Object3D | null;
    chips: THREE.Object3D | null;
  }>({
    shell: null,
    water: null,
    transducers: null,
    engine: null,
    chips: null,
  });

  const lastTickRef = useRef(0);
  const materialCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const findPart = (pattern: RegExp): THREE.Object3D | null => {
      let match: THREE.Object3D | null = null;
      modelRoot.traverse((object) => {
        if (!match && pattern.test(object.name)) {
          match = object;
        }
      });
      return match;
    };

    partsRef.current = {
      shell: findPart(/shell|frame|housing/i),
      water: findPart(/water|chamber|bladder/i),
      transducers: findPart(/transducer|array|speaker|exciter/i),
      engine: findPart(/engine|control|pcb|board/i),
      chips: findPart(/chip|mode|ui|program/i),
    };

    applyDefaultMaterialLook(modelRoot);

    let cancelled = false;

    const applyManifestTextures = async () => {
      const manifest = await loadMaterialManifest();
      if (!manifest || cancelled) {
        return;
      }

      const cleanup = await applyPbrManifest(modelRoot, manifest);
      if (cancelled) {
        cleanup();
        return;
      }

      materialCleanupRef.current = cleanup;
    };

    void applyManifestTextures();

    modelRoot.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }

      const material = mesh.material;
      if (Array.isArray(material)) {
        material.forEach((m) => {
          m.needsUpdate = true;
        });
        return;
      }

      if (material) {
        material.needsUpdate = true;
      }
    });

    return () => {
      cancelled = true;
      materialCleanupRef.current?.();
      materialCleanupRef.current = null;
    };
  }, [modelRoot]);

  useEffect(() => {
    modelRoot.traverse((object) => {
      const mesh = object as THREE.Mesh;
      if (!mesh.isMesh) {
        return;
      }

      mesh.castShadow = tier !== 'low';
      mesh.receiveShadow = true;
    });
  }, [modelRoot, tier]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    if (tier === 'low') {
      lastTickRef.current += delta;
      if (lastTickRef.current < 1 / 30) {
        return;
      }
      lastTickRef.current = 0;
    }

    const elapsed = state.clock.getElapsedTime();
    const offset = scrollData.current.offset;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      Math.PI * 0.12 + offset * Math.PI * 0.85,
      0.07,
    );
    groupRef.current.position.y = reducedMotion ? -0.58 : Math.sin(elapsed * 0.38) * 0.025 - 0.6;

    const reveal = segmentProgress(offset, 0.12, 0.34);
    const reassemble = segmentProgress(offset, 0.86, 1);
    const active = reveal * (1 - reassemble);
    const parts = partsRef.current;

    if (parts.water) {
      parts.water.position.y = THREE.MathUtils.lerp(parts.water.position.y, active * 1.15, 0.09);
      parts.water.rotation.z = reducedMotion ? 0 : Math.sin(elapsed * 0.4) * 0.015;
    }

    if (parts.transducers) {
      parts.transducers.rotation.y = reducedMotion ? 0 : elapsed * 0.18;
      parts.transducers.scale.setScalar(
        1 +
          segmentProgress(offset, 0.34, 0.55) * 0.05 +
          segmentProgress(offset, 0.55, 0.76) * (reducedMotion ? 0.015 : Math.sin(elapsed * 4.2) * 0.03),
      );
    }

    if (parts.engine) {
      parts.engine.position.x = THREE.MathUtils.lerp(
        parts.engine.position.x,
        segmentProgress(offset, 0.55, 0.75) * 0.16,
        0.08,
      );
      parts.engine.position.y = THREE.MathUtils.lerp(
        parts.engine.position.y,
        segmentProgress(offset, 0.55, 0.75) * 0.08,
        0.08,
      );
    }

    if (parts.chips) {
      parts.chips.rotation.x = THREE.MathUtils.lerp(
        parts.chips.rotation.x,
        segmentProgress(offset, 0.72, 0.86) * 0.35,
        0.08,
      );
    }
  });

  return <primitive ref={groupRef} object={modelRoot} scale={1.12} position={[0, -0.48, 0]} />;
}

export function BedModel({ scrollData, modelUrl, modelAvailable, tier, reducedMotion }: BedModelProps) {
  if (!modelAvailable) {
    return <ProceduralBed scrollData={scrollData} tier={tier} reducedMotion={reducedMotion} />;
  }

  return <GlbBed scrollData={scrollData} modelUrl={modelUrl} tier={tier} reducedMotion={reducedMotion} />;
}
