import { Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  PerspectiveCamera,
} from '@react-three/drei';
import { BedModel } from './BedModel';
import { SceneFallback } from './SceneFallback';
import { detectDeviceTier, supportsWebGl, type DeviceTier } from '../../lib/device';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import * as THREE from 'three';

const MODEL_URL = '/models/somaherence-bed.glb';

interface SceneProps {
  onJoinWaitlist: () => void;
  scrollData: { current: { offset: number } };
}

function SceneCanvas({
  scrollData,
  modelAvailable,
  tier,
  reducedMotion,
}: {
  onJoinWaitlist: () => void;
  modelAvailable: boolean;
  tier: DeviceTier;
  reducedMotion: boolean;
}) {
  const dpr = useMemo<[number, number]>(() => {
    if (tier === 'high') {
      return [1, 2];
    }
    if (tier === 'medium') {
      return [1, 1.6];
    }
    return [1, 1.2];
  }, [tier]);

  return (
    <div className="canvas-container" aria-hidden>
      <Canvas
        dpr={dpr}
        shadows={tier !== 'low'}
        gl={{ antialias: tier !== 'low', powerPreference: tier === 'high' ? 'high-performance' : 'default' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = tier === 'high' ? 1.08 : 1;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0.8, 8.5]} fov={42} />
        <color attach="background" args={['#0f1815']} />
        <fog attach="fog" args={['#101915', 9, 34]} />

        <ambientLight intensity={0.58} color="#8ea99b" />
        <hemisphereLight intensity={0.22} color="#c2d8cb" groundColor="#0f1a16" />
        <directionalLight
          position={[6, 8, 2]}
          intensity={tier === 'high' ? 1.28 : 0.96}
          color="#eadfae"
          castShadow={tier !== 'low'}
        />
        <pointLight position={[-4, 3, 4]} intensity={0.42} color="#81bfae" />
        <pointLight position={[4, 2, -3]} intensity={0.35} color="#9bbfd0" />

        <Suspense fallback={null}>
          <Environment preset="forest" blur={0.6} background={false} />
          {tier !== 'low' && (
            <ContactShadows
              position={[0, -1.1, 0]}
              opacity={0.35}
              width={8}
              height={8}
              blur={2}
              far={6}
            />
          )}
          <BedModel
            scrollData={scrollData}
            modelUrl={MODEL_URL}
            modelAvailable={modelAvailable}
            tier={tier}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export function Scene({ onJoinWaitlist, scrollData }: SceneProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [webglSupported] = useState(() => supportsWebGl());
  const [tier] = useState<DeviceTier>(() => detectDeviceTier());
  const [modelAvailable, setModelAvailable] = useState(false);

  useEffect(() => {
    const checkModel = async () => {
      try {
        const response = await fetch(MODEL_URL, {
          method: 'HEAD',
          cache: 'no-cache',
        });
        const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
        const looksLikeHtml = contentType.includes('text/html');
        const looksLikeModel =
          contentType.includes('model/gltf-binary') ||
          contentType.includes('application/octet-stream') ||
          contentType.includes('model/gltf+json');

        setModelAvailable(response.ok && !looksLikeHtml && looksLikeModel);
      } catch {
        setModelAvailable(false);
      }
    };

    void checkModel();
  }, []);

  if (prefersReducedMotion) {
    return <SceneFallback onJoinWaitlist={onJoinWaitlist} reason="reduced_motion" />;
  }

  if (!webglSupported) {
    return <SceneFallback onJoinWaitlist={onJoinWaitlist} reason="no_webgl" />;
  }

  return (
    <section className="scene-shell">
      <SceneCanvas
        scrollData={scrollData}
        modelAvailable={modelAvailable}
        tier={tier}
        reducedMotion={prefersReducedMotion}
      />
    </section>
  );
}
