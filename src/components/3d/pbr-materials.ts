import * as THREE from 'three';

export interface MaterialDescriptor {
  namePattern: string;
  map?: string;
  normalMap?: string;
  roughnessMap?: string;
  metalnessMap?: string;
  aoMap?: string;
  emissiveMap?: string;
  alphaMap?: string;
  color?: string;
  emissive?: string;
  roughness?: number;
  metalness?: number;
  transmission?: number;
  thickness?: number;
  ior?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  envMapIntensity?: number;
  emissiveIntensity?: number;
  opacity?: number;
  transparent?: boolean;
  side?: 'front' | 'double';
}

export interface MaterialManifest {
  basePath?: string;
  materials: MaterialDescriptor[];
}

const MANIFEST_URL = '/models/somaherence-materials.json';

export async function loadMaterialManifest(): Promise<MaterialManifest | null> {
  try {
    const response = await fetch(MANIFEST_URL, {
      method: 'GET',
      cache: 'no-cache',
    });

    if (!response.ok) {
      return null;
    }

    const contentType = response.headers.get('content-type')?.toLowerCase() ?? '';
    if (!contentType.includes('application/json')) {
      return null;
    }

    const manifest = (await response.json()) as MaterialManifest;
    if (!manifest || !Array.isArray(manifest.materials)) {
      return null;
    }

    return manifest;
  } catch {
    return null;
  }
}

function sanitizePath(path: string): string {
  return path.replace(/^\/+/, '');
}

function toTexturePath(basePath: string, value: string): string {
  const sanitizedBase = basePath ? sanitizePath(basePath).replace(/\/$/, '') : '';
  const sanitizedValue = sanitizePath(value);
  return sanitizedBase ? `/${sanitizedBase}/${sanitizedValue}` : `/${sanitizedValue}`;
}

function isColorTextureKey(key: keyof MaterialDescriptor): boolean {
  return key === 'map' || key === 'emissiveMap';
}

function createPhysicalMaterial(
  mesh: THREE.Mesh,
  descriptor: MaterialDescriptor,
  textures: Partial<Record<keyof MaterialDescriptor, THREE.Texture>>,
) {
  const sourceMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  const sourcePhysical = sourceMaterial as THREE.MeshStandardMaterial | undefined;
  const color = descriptor.color
    ? new THREE.Color(descriptor.color)
    : sourcePhysical?.color?.clone() ?? new THREE.Color('#9ab3aa');
  const emissive = descriptor.emissive
    ? new THREE.Color(descriptor.emissive)
    : sourcePhysical?.emissive?.clone() ?? new THREE.Color('#000000');
  const transparent =
    descriptor.transparent ??
    Boolean((descriptor.opacity ?? 1) < 1 || descriptor.alphaMap || descriptor.transmission);

  const material = new THREE.MeshPhysicalMaterial({
    color,
    emissive,
    roughness: descriptor.roughness ?? sourcePhysical?.roughness ?? 0.5,
    metalness: descriptor.metalness ?? sourcePhysical?.metalness ?? 0.2,
    transmission: descriptor.transmission ?? 0,
    thickness: descriptor.thickness ?? 0,
    ior: descriptor.ior ?? 1.45,
    clearcoat: descriptor.clearcoat ?? 0,
    clearcoatRoughness: descriptor.clearcoatRoughness ?? 0,
    envMapIntensity: descriptor.envMapIntensity ?? 1,
    emissiveIntensity: descriptor.emissiveIntensity ?? 1,
    opacity: descriptor.opacity ?? 1,
    transparent,
    side: descriptor.side === 'double' ? THREE.DoubleSide : THREE.FrontSide,
  });

  material.map = textures.map ?? null;
  material.normalMap = textures.normalMap ?? null;
  material.roughnessMap = textures.roughnessMap ?? null;
  material.metalnessMap = textures.metalnessMap ?? null;
  material.aoMap = textures.aoMap ?? null;
  material.emissiveMap = textures.emissiveMap ?? null;
  material.alphaMap = textures.alphaMap ?? null;

  if (material.aoMap && !mesh.geometry.getAttribute('uv2') && mesh.geometry.getAttribute('uv')) {
    mesh.geometry.setAttribute('uv2', mesh.geometry.getAttribute('uv'));
  }

  return material;
}

async function loadDescriptorTextures(
  loader: THREE.TextureLoader,
  descriptor: MaterialDescriptor,
  basePath: string,
): Promise<Partial<Record<keyof MaterialDescriptor, THREE.Texture>>> {
  const textureEntries = (
    [
      'map',
      'normalMap',
      'roughnessMap',
      'metalnessMap',
      'aoMap',
      'emissiveMap',
      'alphaMap',
    ] as const
  ).filter((key) => Boolean(descriptor[key]));

  const result: Partial<Record<keyof MaterialDescriptor, THREE.Texture>> = {};

  await Promise.all(
    textureEntries.map(async (key) => {
      const relativePath = descriptor[key];
      if (!relativePath) {
        return;
      }

      const texturePath = toTexturePath(basePath, relativePath);

      try {
        const probe = await fetch(texturePath, {
          method: 'HEAD',
          cache: 'no-cache',
        });
        const contentType = probe.headers.get('content-type')?.toLowerCase() ?? '';
        if (!probe.ok || contentType.includes('text/html')) {
          return;
        }

        const texture = await loader.loadAsync(texturePath);
        texture.flipY = false;
        texture.anisotropy = 8;
        if (isColorTextureKey(key)) {
          texture.colorSpace = THREE.SRGBColorSpace;
        } else {
          texture.colorSpace = THREE.LinearSRGBColorSpace;
        }
        result[key] = texture;
      } catch {
        // Missing texture maps should not break the render path.
      }
    }),
  );

  return result;
}

export async function applyPbrManifest(root: THREE.Object3D, manifest: MaterialManifest) {
  const descriptorCache = new Map<string, RegExp>();
  const createdMaterials: THREE.Material[] = [];
  const createdTextures: THREE.Texture[] = [];
  const loader = new THREE.TextureLoader();

  const basePath = manifest.basePath ?? 'models/textures';
  const descriptorTextures = await Promise.all(
    manifest.materials.map(async (descriptor) => {
      const textures = await loadDescriptorTextures(loader, descriptor, basePath);
      Object.values(textures).forEach((texture) => {
        if (texture) {
          createdTextures.push(texture);
        }
      });
      return { descriptor, textures };
    }),
  );

  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) {
      return;
    }

    const target = descriptorTextures.find(({ descriptor }) => {
      if (!descriptorCache.has(descriptor.namePattern)) {
        descriptorCache.set(descriptor.namePattern, new RegExp(descriptor.namePattern, 'i'));
      }

      return descriptorCache.get(descriptor.namePattern)?.test(mesh.name);
    });

    if (!target) {
      return;
    }

    const material = createPhysicalMaterial(mesh, target.descriptor, target.textures);
    createdMaterials.push(material);
    mesh.material = material;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
  });

  return () => {
    createdMaterials.forEach((material) => material.dispose());
    createdTextures.forEach((texture) => texture.dispose());
  };
}

function applyDefaultsByName(
  object: THREE.Object3D,
  pattern: RegExp,
  apply: (material: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial) => void,
) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh || !pattern.test(mesh.name)) {
      return;
    }

    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (!material || !('roughness' in material) || !('metalness' in material)) {
      return;
    }

    apply(material as THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial);
    material.needsUpdate = true;
  });
}

export function applyDefaultMaterialLook(root: THREE.Object3D): void {
  applyDefaultsByName(root, /shell|frame|housing/i, (material) => {
    material.roughness = 0.52;
    material.metalness = 0.34;
    material.color = new THREE.Color('#5d7068');
  });

  applyDefaultsByName(root, /water|chamber|bladder/i, (material) => {
    if ('transmission' in material) {
      material.transmission = 0.68;
      material.thickness = 0.45;
      material.clearcoat = 0.84;
      material.clearcoatRoughness = 0.14;
      material.ior = 1.34;
    }
    material.roughness = 0.16;
    material.metalness = 0.06;
    material.color = new THREE.Color('#8dc8bc');
  });

  applyDefaultsByName(root, /transducer|array|speaker|exciter/i, (material) => {
    material.roughness = 0.25;
    material.metalness = 0.72;
    material.color = new THREE.Color('#93b3ad');
    material.emissive = new THREE.Color('#1d3f3b');
  });

  applyDefaultsByName(root, /engine|control|pcb|board|chip|mode|ui|program/i, (material) => {
    material.roughness = 0.48;
    material.metalness = 0.38;
    material.color = new THREE.Color('#6f8279');
  });
}
