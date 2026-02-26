export type DeviceTier = 'high' | 'medium' | 'low';

function getMemoryScore(): number {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory;
  if (!memory) {
    return 1;
  }

  if (memory >= 8) {
    return 3;
  }

  if (memory >= 4) {
    return 2;
  }

  return 1;
}

function getCpuScore(): number {
  const cores = navigator.hardwareConcurrency;
  if (!cores) {
    return 1;
  }

  if (cores >= 8) {
    return 3;
  }

  if (cores >= 4) {
    return 2;
  }

  return 1;
}

function getNetworkScore(): number {
  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string;
    };
  };
  const connection = nav.connection;
  const effectiveType = connection?.effectiveType ?? '';

  if (effectiveType === '4g') {
    return 3;
  }

  if (effectiveType === '3g') {
    return 2;
  }

  return 1;
}

export function detectDeviceTier(): DeviceTier {
  const score = getMemoryScore() + getCpuScore() + getNetworkScore();
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  if (score <= 4 || (coarsePointer && score <= 5)) {
    return 'low';
  }

  if (score <= 7) {
    return 'medium';
  }

  return 'high';
}

export function supportsWebGl(): boolean {
  const canvas = document.createElement('canvas');

  const gl2 = canvas.getContext('webgl2');
  if (gl2) {
    return true;
  }

  return Boolean(canvas.getContext('webgl'));
}
