const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
] as const;

const UTM_STORAGE_KEY = 'somaherence_utm';

type UtmKey = (typeof UTM_KEYS)[number];

export type UtmMap = Record<UtmKey, string | undefined>;

function parseUtmFromSearch(search: string): UtmMap {
  const params = new URLSearchParams(search);
  const utm = {} as UtmMap;

  UTM_KEYS.forEach((key) => {
    const value = params.get(key);
    utm[key] = value ?? undefined;
  });

  return utm;
}

export function captureUtmFromLocation(): UtmMap {
  const parsed = parseUtmFromSearch(window.location.search);
  const hasAnyUtm = UTM_KEYS.some((key) => Boolean(parsed[key]));

  if (hasAnyUtm) {
    window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(parsed));
    return parsed;
  }

  const stored = window.sessionStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) {
    return parsed;
  }

  try {
    return JSON.parse(stored) as UtmMap;
  } catch {
    return parsed;
  }
}
